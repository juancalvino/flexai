import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { COVERAGE_PLACES, normalizePlace } from "../src/lib/coverage-places.ts";

const source = await readFile(new URL("../src/components/LocalityAutocomplete.astro", import.meta.url), "utf8");
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? "";

test("coverage places are deduplicated, alphabetized and name-only", () => {
  assert.ok(COVERAGE_PLACES.length > 100);
  assert.equal(new Set(COVERAGE_PLACES.map((place) => normalizePlace(place.name))).size, COVERAGE_PLACES.length);
  for (const place of COVERAGE_PLACES) {
    assert.deepEqual(Object.keys(place).sort(), ["name", "zone"]);
  }
  const sorted = [...COVERAGE_PLACES].sort((a, b) => a.name.localeCompare(b.name, "es"));
  assert.deepEqual(COVERAGE_PLACES, sorted);
});

test("every coverage place maps to one of the four shared zones", () => {
  const zones = new Set(COVERAGE_PLACES.map((place) => place.zone));
  assert.deepEqual([...zones].sort(), ["CABA", "GBA 1", "GBA 2", "GBA 3"]);
  assert.equal(COVERAGE_PLACES.find((place) => place.name === "Ramos Mejía")?.zone, "GBA 1");
  assert.ok(COVERAGE_PLACES.some((place) => place.name === "Villa Devoto"));
  assert.ok(COVERAGE_PLACES.some((place) => place.name === "Villa Luro"));
});

test("normalization folds case and accents for matching", () => {
  assert.equal(normalizePlace("Ramos Mejia"), normalizePlace("Ramos Mejía"));
  assert.equal(normalizePlace("  JOSE C PAZ "), normalizePlace("José C. Paz"));
  assert.equal(normalizePlace("  Devoto  "), normalizePlace("devoto"));
});

test("combobox exposes accessible autocomplete hooks and a 3-character threshold", () => {
  assert.match(source, /role="combobox"/);
  assert.match(source, /role="listbox"/);
  assert.match(source, /aria-expanded="false"/);
  assert.match(source, /aria-autocomplete="list"/);
  assert.match(source, /autocomplete="off"/);
  assert.match(source, /name=\{name\}/);
  assert.match(source, /\brequired\b/);
  assert.match(source, /data-locality-autocomplete data-places=/);
  assert.match(source, /query\.length < 3/);
  assert.match(script, /normalize\("NFD"\)/);
  assert.match(script, /places = JSON\.parse\(root\.dataset\.places\)/);
  assert.match(script, /input\.form\?\.addEventListener\("submit"/);
});

test("client script never imports zone data or writes raw HTML", () => {
  assert.doesNotMatch(script, /import /);
  assert.doesNotMatch(script, /data\/zones/);
  assert.doesNotMatch(script, /innerHTML|insertAdjacentHTML|outerHTML|document\.write/);
  assert.match(script, /textContent|createElement\("li"\)/);
});

// Exercise the real controller with a minimal DOM double: threshold, filtering, commit and revert.
function boot(places) {
  const events = [];
  const makeNode = (tag = "div") => {
    const attributes = {};
    const tokens = new Set();
    const listeners = {};
    const children = [];
    return {
      tag, children, textContent: "", className: "", id: "", value: "", form: null,
      dataset: {},
      setAttribute(key, value) { attributes[key] = String(value); },
      getAttribute(key) { return attributes[key]; },
      removeAttribute(key) { delete attributes[key]; },
      classList: {
        add: (t) => tokens.add(t), remove: (t) => tokens.delete(t),
        contains: (t) => tokens.has(t), toggle: (t, force) => force ? tokens.add(t) : tokens.delete(t),
      },
      addEventListener(type, fn) { (listeners[type] ??= []).push(fn); },
      _emit(type, event = {}) {
        events.push({ type, target: this });
        for (const fn of listeners[type] ?? []) fn({ preventDefault() {}, ...event });
      },
      dispatchEvent(event) { events.push({ type: event.type, target: this }); return true; },
      append(...nodes) { children.push(...nodes); },
      appendChild(node) { children.push(node); return node; },
      replaceChildren(...nodes) { children.length = 0; children.push(...nodes); },
      contains() { return false; },
    };
  };

  const root = makeNode("div");
  root.dataset.places = JSON.stringify(places);
  const input = makeNode("input");
  const listbox = makeNode("ul");
  listbox.id = "locality-listbox";
  root.querySelector = (selector) => selector === 'input[role="combobox"]' ? input : selector === '[role="listbox"]' ? listbox : null;

  const document = {
    querySelectorAll: (selector) => selector === "[data-locality-autocomplete]" ? [root] : [],
    createElement: (tag) => makeNode(tag),
  };
  runInNewContext(ts.transpileModule(script, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText, { document, Event: class { constructor(type, init = {}) { this.type = type; this.bubbles = Boolean(init.bubbles); } }, Map, JSON });
  return { root, input, listbox, events };
}

test("autocomplete opens at 3 characters, commits a selection and reverts invalid blur", () => {
  const { root, input, listbox, events } = boot([
    { name: "Villa Devoto", zone: "CABA" },
    { name: "Villa Luro", zone: "CABA" },
    { name: "Ramos Mejía", zone: "GBA 1" },
  ]);

  input.value = "ab";
  input._emit("input");
  assert.equal(listbox.classList.contains("hidden"), true, "below threshold stays closed");
  assert.equal(listbox.children.length, 0);

  input.value = "dev";
  input._emit("input");
  assert.equal(listbox.classList.contains("hidden"), false, "opens from 3 characters");
  assert.equal(listbox.children[0].children[0].textContent, "Villa Devoto");
  assert.equal(listbox.children[0].children[1].textContent, "CABA");

  listbox.children[0]._emit("click");
  assert.equal(input.value, "Villa Devoto");
  assert.equal(listbox.classList.contains("hidden"), true);
  assert.ok(events.some((event) => event.type === "change" && event.target === input), "settled value notifies the form");

  input.value = "noexiste";
  listbox.classList.remove("hidden");
  root._emit("focusout", { relatedTarget: null });
  assert.equal(input.value, "Villa Devoto", "invalid free text reverts to the committed place");
  assert.equal(listbox.classList.contains("hidden"), true);
});
