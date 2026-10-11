import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const read = (path) => readFile(new URL(`../src/${path}`, import.meta.url), "utf8");
const source = await read("components/GeoJSONMap.astro");
const transpile = (text) => ts.transpileModule(text, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const zones = await import(`data:text/javascript;base64,${Buffer.from(transpile(await read("data/zones.ts"))).toString("base64")}`);
const { mapData, localityOptions } = JSON.parse(runInNewContext(
  `${transpile(source.split("---")[1].replace(/^import .*;$/gm, ""))}\nJSON.stringify({ mapData, localityOptions })`, zones,
));

class Element {
  constructor(id = "") {
    this.id = id;
    this.value = "";
    this.textContent = "";
    this.dataset = {};
    this.attributes = new Map();
    this.listeners = new Map();
    this.children = [];
    this.hidden = true;
    this.style = {};
    const classes = new Set(["hidden"]);
    this.classList = {
      add: (...names) => names.forEach((name) => classes.add(name)),
      remove: (...names) => names.forEach((name) => classes.delete(name)),
      contains: (name) => classes.has(name),
      toggle: (name, on = !classes.has(name)) => on ? classes.add(name) : classes.delete(name),
    };
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  removeAttribute(name) { this.attributes.delete(name); }
  addEventListener(type, fn) { this.listeners.set(type, [...(this.listeners.get(type) ?? []), fn]); }
  emit(type, properties = {}) {
    const event = { type, target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...properties };
    for (const fn of this.listeners.get(type) ?? []) fn(event);
    return event;
  }
  replaceChildren(...children) { this.children = children; }
  contains(target) { return target === this || this.children.some((child) => child.contains(target)); }
  scrollIntoView(options) { this.scrolled = options; }
  focus() { this.emit("focus"); }
  remove() {}
}

function setup() {
  const elements = new Map([...source.matchAll(/id="([^"]+)"/g)].map(([, id]) => [id, new Element(id)]));
  const get = (id) => elements.get(id);
  const input = get("locality-input");
  for (const [, name, value] of source.match(/<input\s+id="locality-input"[\s\S]*?\/>/)[0].matchAll(/(role|aria-[\w-]+)="([^"]+)"/g)) input.setAttribute(name, value);
  get("coverage-map").dataset.map = JSON.stringify(mapData);
  get("locality-options").dataset.localities = JSON.stringify(localityOptions);
  get("locality-search").children = [input, get("locality-options")];
  const document = new Element();
  Object.assign(document, { documentElement: new Element(), getElementById: get, createElement: () => new Element(), querySelectorAll: () => [] });
  let selections = 0;
  // Count renders through the mobile summary, independently of map geometry availability.
  Object.defineProperty(get("map-summary-place"), "textContent", { set(value) { this.text = value; selections++; }, get() { return this.text; } });
  const map = { setView() { return this; }, createPane() {}, getPane: () => new Element(), on() {}, once() {}, invalidateSize() {} };
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^\s*import .*;$/gm, "");
  runInNewContext(transpile(script), {
    document, window: { matchMedia: () => ({ matches: false }) },
    getComputedStyle: () => ({ getPropertyValue: () => "1 2 3" }),
    L: { map: () => map, tileLayer: () => ({ addTo() {} }) },
    ResizeObserver: class { observe() {} },
    fetch: () => Promise.reject(new Error("offline")),
  });
  const type = (value) => { input.value = value; input.emit("input"); };
  const enter = () => { if (!input.emit("keydown", { key: "Enter" }).defaultPrevented) get("locality-search").emit("submit"); };
  return { get, input, list: get("locality-options"), document, type, enter, selections: () => selections };
}

function assertClosed({ input, list }) {
  assert.equal(input.getAttribute("aria-expanded"), "false");
  assert.equal(input.getAttribute("aria-activedescendant"), null);
  assert.equal(list.hidden, true);
}

test("map-specific combobox exposes labelled ARIA and a bounded dark touch-friendly popup", () => {
  assert.doesNotMatch(source, /<datalist|\blist="locality-options"/);
  assert.match(source, /role="combobox"/);
  assert.match(source, /aria-controls="locality-options"/);
  assert.match(source, /aria-autocomplete="list"/);
  assert.match(source, /aria-describedby="search-feedback"/);
  assert.match(source, /role="listbox"/);
  assert.match(source, /aria-label="Localidades"/);
  assert.match(source, /data-lenis-prevent/);
  assert.match(source, /overscroll-contain/);
  assert.match(source, /min-h-\[44px\]/);
  assert.match(source, /break-words/);
  assert.match(source, /role="status"/);
});

test("popup stays in flow below lg and overlays only on desktop", () => {
  const popup = source.match(/<ul\s+id="locality-options"[\s\S]*?>/)[0];
  const classes = new Set(popup.match(/class="([^"]+)"/)[1].split(/\s+/));
  for (const name of ["absolute", "fixed", "inset-x-0", "top-full"]) {
    assert.equal(classes.has(name), false, `mobile popup must not use ${name}`);
  }
  for (const name of ["static", "lg:absolute", "lg:inset-x-0", "lg:top-full"]) {
    assert.ok(classes.has(name), `popup must use ${name}`);
  }
});

test("search icon is centered against an input-only wrapper, with the popup outside it", () => {
  const form = source.match(/<form id="locality-search"[\s\S]*?<\/form>/)[0];
  assert.match(form, /<div class="relative mt-2">\s*<div class="relative">\s*<Icon name="bx:search"[^>]*\/>\s*<input\s+id="locality-input"[^>]*\/>\s*<\/div>\s*<ul\s+id="locality-options"[^>]*><\/ul>\s*<\/div>/,
    "icon and input must share their own relative wrapper; popup must be its sibling under the outer relative wrapper");
  const iconClasses = new Set(form.match(/<Icon name="bx:search" class="([^"]+)"/)[1].split(/\s+/));
  for (const name of ["absolute", "top-1/2", "-translate-y-1/2"]) {
    assert.ok(iconClasses.has(name), `search icon must retain ${name}`);
  }
});

test("suggestions preserve sorted unique names and serialize no commercial data", () => {
  assert.deepEqual(localityOptions, [...new Set(localityOptions)].sort((a, b) => a.localeCompare(b, "es")));
  assert.ok(localityOptions.includes("Ramos Mejía"));
  assert.ok(mapData.zones.every((zone) => !Object.hasOwn(zone, "prices")));
  assert.match(source, /data-localities=\{JSON\.stringify\(localityOptions\)\}/);
});

test("one/two-character and accent-insensitive suggestions are capped without automatic activation", () => {
  const h = setup();
  for (const query of ["a", "qu", "MEJIA"]) {
    h.type(query);
    assert.equal(h.input.getAttribute("aria-expanded"), "true");
    assert.ok(h.list.children.length > 0 && h.list.children.length <= 8);
    assert.equal(h.input.getAttribute("aria-activedescendant"), null);
    for (const option of h.list.children) {
      assert.equal(option.getAttribute("role"), "option");
      assert.equal(option.getAttribute("aria-selected"), "false");
    }
  }
  assert.equal(h.list.children[0].textContent, "Ramos Mejía");
  h.type("   ");
  assertClosed(h);
});

test("arrow navigation retains query, updates active ARIA, scrolls, and Enter commits exactly once", () => {
  const h = setup();
  h.type("qu");
  assert.equal(h.input.emit("keydown", { key: "ArrowDown" }).defaultPrevented, true);
  const first = h.list.children[0];
  assert.equal(h.input.value, "qu");
  assert.equal(h.input.getAttribute("aria-activedescendant"), first.id);
  assert.equal(first.getAttribute("aria-selected"), "true");
  assert.equal(first.scrolled.block, "nearest");
  h.input.emit("keydown", { key: "ArrowUp" });
  assert.equal(h.input.getAttribute("aria-activedescendant"), h.list.children.at(-1).id);
  h.input.emit("keydown", { key: "ArrowDown" });
  h.enter();
  assert.equal(h.input.value, first.textContent);
  assert.equal(h.selections(), 1);
  assertClosed(h);
  h.input.emit("change");
  assert.equal(h.selections(), 1);
});

test("typed Enter preserves ambiguity rather than choosing the first suggestion", () => {
  const h = setup();
  h.type("La Matanza");
  h.enter();
  assert.equal(h.selections(), 0);
  assert.equal(h.input.value, "La Matanza");
  assert.match(h.get("search-feedback").textContent, /más de una zona/);
  assertClosed(h);
  h.type("La Matanza");
  h.input.emit("keydown", { key: "ArrowDown" });
  h.enter();
  assert.equal(h.selections(), 1);
});

test("full-map free-text resolver retains exact, short partial, alias/within, and unmatched behavior", () => {
  const h = setup();
  for (const [query, place, zone] of [["Quilmes", "Quilmes", "GBA 2"], ["qu", "Quilmes", "GBA 2"], ["ramos mejia", "Ramos Mejía", "GBA 1"]]) {
    h.type(query);
    h.enter();
    assert.equal(h.get("zone-title").textContent, place);
    assert.equal(h.get("map-summary-zone").textContent, zone);
  }
  assert.match(h.get("zone-description").textContent, /La Matanza/);
  const before = h.selections();
  h.type("zzzz");
  h.enter();
  assert.equal(h.selections(), before);
  assert.match(h.get("search-feedback").textContent, /No encontramos/);
  h.type("q");
  assert.equal(h.get("search-feedback").textContent, "");
  assert.equal(h.get("search-feedback").classList.contains("hidden"), true);
});

test("pointer/touch selects once on click, not pointerdown, and delayed change does not repeat it", () => {
  for (const pointerType of ["mouse", "touch"]) {
    const h = setup();
    h.type("MEJIA");
    const option = h.list.children[0];
    assert.equal(option.emit("pointerdown", { pointerType }).defaultPrevented, true);
    assert.equal(h.selections(), 0);
    option.emit("click");
    assert.equal(h.input.value, "Ramos Mejía");
    assert.equal(h.selections(), 1);
    assertClosed(h);
    h.input.emit("change");
    assert.equal(h.selections(), 1);
    h.type("Quilmes");
    h.input.emit("change");
    assert.equal(h.selections(), 2);
  }
});

test("Escape, Tab, blur, and outside dismiss without changing text or selecting; focus reopens", () => {
  const h = setup();
  for (const dismiss of [() => h.input.emit("keydown", { key: "Escape" }), () => {
    assert.equal(h.input.emit("keydown", { key: "Tab" }).defaultPrevented, false);
  }, () => h.input.emit("blur"), () => h.document.emit("pointerdown", { target: new Element() })]) {
    h.type("La Matanza");
    h.input.emit("keydown", { key: "ArrowDown" });
    dismiss();
    assertClosed(h);
    assert.equal(h.input.value, "La Matanza");
    assert.equal(h.selections(), 0);
    h.input.emit("focus");
    assert.equal(h.input.getAttribute("aria-expanded"), "true");
    assert.equal(h.input.getAttribute("aria-activedescendant"), null);
  }
  h.input.emit("change");
  assert.match(h.get("search-feedback").textContent, /más de una zona/);
});

test("editing discards the active option, while empty/unmatched queries and IME do not navigate", () => {
  const h = setup();
  h.type("qu");
  h.input.emit("keydown", { key: "ArrowDown" });
  h.type("La Matanza");
  assert.equal(h.input.getAttribute("aria-activedescendant"), null);
  h.enter();
  assert.equal(h.selections(), 0);
  for (const query of ["", "zzzz"]) {
    h.type(query);
    assert.equal(h.input.emit("keydown", { key: "ArrowDown" }).defaultPrevented, false);
    assertClosed(h);
  }
  h.type("qu");
  h.input.emit("keydown", { key: "ArrowUp" });
  assert.equal(h.input.getAttribute("aria-activedescendant"), h.list.children.at(-1).id);
  assert.equal(h.input.emit("keydown", { key: "Enter", isComposing: true }).defaultPrevented, false);
  assert.equal(h.selections(), 0);
});

test("reset clears popup, active state and stale feedback; offline map retains search", async () => {
  const h = setup();
  await new Promise((resolve) => setImmediate(resolve));
  assert.match(h.get("map-status").textContent, /No pudimos cargar/);
  h.type("zzzz");
  h.enter();
  h.type("qu");
  h.input.emit("keydown", { key: "ArrowDown" });
  h.get("map-reset").emit("click");
  assertClosed(h);
  assert.equal(h.input.value, "");
  assert.equal(h.get("search-feedback").textContent, "");
  h.type("Quilmes");
  h.enter();
  assert.equal(h.get("zone-title").textContent, "Quilmes");
});
