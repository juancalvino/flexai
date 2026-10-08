import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as contactMessage from "../src/lib/contact-message.ts";
import { SITE, whatsappUrl } from "../src/data/site.ts";

const resultSource = await readFile(new URL("../src/components/QualifiedPlanResult.astro", import.meta.url), "utf8");
const resultTemplate = (name) => resultSource.match(new RegExp(`<template data-result-template="${name}">([\\s\\S]*?)<\\/template>`))?.[1] ?? "";

const source = await readFile(new URL("../src/components/ContactForm.astro", import.meta.url), "utf8");
const floatingSource = await readFile(new URL("../src/components/ui/WhatsAppFloat.astro", import.meta.url), "utf8");
const input = (name) => source.match(new RegExp(`<input\\b[^>]*name="${name}"[^>]*>`))?.[0] ?? "";

test("phone is explicitly optional while retaining native validation for nonblank values", () => {
  const phone = input("phone");
  assert.match(phone, /type="tel"/);
  assert.doesNotMatch(phone, /\brequired\b/);
  assert.match(phone, /autocomplete="tel"/);
  assert.match(phone, /inputmode="tel"/);
  assert.ok(phone.includes(String.raw`pattern="[0-9 +\\-\\(\\)]{8,}"`));
  const label = [...source.matchAll(/<label\b[^>]*>[\s\S]*?<\/label>/g)]
    .find(([markup]) => markup.includes('name="phone"'))?.[0] ?? "";
  assert.match(label, /Teléfono adicional \/ de contacto \(opcional\)/);
});

test("intake removes retired controls and their payload keys and hints", () => {
  assert.doesNotMatch(source, /vehicleSize|workMessage|name="(?:url|message)"|value\("(?:url|message)"\)|contanos en el mensaje|Link de tu tienda/);
  assert.doesNotMatch(source, /<textarea/);
});

test("collection and origin are coverage autocompletes; other intake stays required text", () => {
  for (const name of ["locality", "originZone"]) {
    assert.match(source, new RegExp(`<LocalityAutocomplete\\s+name="${name}"`));
    assert.doesNotMatch(source, new RegExp(`<input\\b[^>]*name="${name}"`));
  }
  for (const name of ["vehicleBrand", "vehicleModel"]) {
    assert.match(input(name), /type="text"/);
    assert.match(input(name), /\brequired\b/);
  }
  assert.match(input("vehicleYear"), /type="number"/);
  assert.match(input("vehicleYear"), /\brequired\b/);
  assert.match(input("vehicleYear"), /min="1886"/);
  assert.match(input("vehicleYear"), /step="1"/);
  assert.match(source, /const timeBands = \["Mañana", "Tarde\/noche"\]/);
  assert.match(source, /select name="vehicle" required/);
});

test("delivery zone grid uses every shared zone and centered choice cards", () => {
  assert.match(source, /const zoneNames = ZONE_LIST\.map/);
  const zones = source.match(/<fieldset[^>]*data-required-group="deliveryZones"[\s\S]*?<\/fieldset>/)?.[0] ?? "";
  assert.match(zones, /sm:col-span-2/);
  assert.match(zones, /grid gap-3 sm:grid-cols-2 lg:grid-cols-4/);
  assert.match(zones, /zoneNames\.map/);
  assert.match(zones, /choiceCardClass.*justify-center/);
});

test("validation and message helpers are wired before the WhatsApp handoff", () => {
  assert.match(source, /field\.setCustomValidity\(.*contactFieldError\(field\)/);
  assert.match(source, /!field\.matches\(":disabled"\) && !field\.checkValidity\(\)/);
  assert.match(source, /controls\.find\(.*aria-invalid/);
  assert.match(source, /firstInvalid\?\.focus\(\)/);
  assert.match(source, /whatsappUrl\(buildContactMessage\(data, intent\)\)/);
  assert.doesNotMatch(source, /innerHTML/);
});

test("qualification is explicit, validates first, and returns before the regular WhatsApp action", () => {
  assert.match(source, /quoteMode\?: boolean/);
  assert.match(source, /quoteMode = false/);
  assert.match(source, /data-quote-mode=\{quoteMode\}/);
  assert.match(source, /method="post"/); // No native GET may put intake values in page URLs.
  const submit = source.slice(source.indexOf('form.addEventListener("submit"'));
  assert.ok(submit.indexOf("if (!validate(true))") < submit.indexOf("if (quoteMode)"));
  assert.match(submit, /if \(quoteMode\) \{[\s\S]*?contact:qualified[\s\S]*?return;[\s\S]*?window\.open/);
  for (const event of ["input", "change"]) assert.ok(source.includes(`form.addEventListener("${event}", onEdit)`));
  assert.match(source, /contact:edit/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|history\.pushState|form\.reset\(/);
});

test("result rendering uses text nodes and clears the previous result", async () => {
  const result = await readFile(new URL("../src/components/QualifiedPlanResult.astro", import.meta.url), "utf8");
  assert.match(result, /textContent/);
  assert.match(result, /replaceChildren\(/);
  assert.match(result, /contact:clear/);
  assert.match(result, /plan === "premium"/);
  const premium = result.match(/<template data-result-template="premium">([\s\S]*?)<\/template>/)?.[1];
  assert.ok(premium);
  assert.doesNotMatch(premium, /<dl|data-rates|IVA|\$/);
  assert.match(result, /currentHeading[\s\S]*?!== message[\s\S]*?click\.preventDefault\(\)/);
  assert.doesNotMatch(result, /innerHTML|insertAdjacentHTML|localStorage|sessionStorage/);
  const script = result.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? "";
  assert.doesNotMatch(script, /from ["'].*data\/zones/);
  assert.doesNotMatch(script, /window\.open/);
});

test("qualified result removes the message preview and public volume ranges entirely", () => {
  assert.doesNotMatch(resultSource, /data-message|<pre\b|Revisá tu consulta|Todavía no enviamos nada|Abrí WhatsApp cuando/);
  assert.doesNotMatch(resultSource, /data-volume|selected\.volume|volume: string|\.\.\.PLANS/);
  for (const name of ["priced", "premium"]) {
    const template = resultTemplate(name);
    assert.match(template, /<article\b[^>]*bg-ink/);
    assert.equal((template.match(/<article\b/g) ?? []).length, 1);
    assert.doesNotMatch(template, /\d+\s*(?:[–−-]\s*\d+|paquetes)|por día|umbral/);
  }
  assert.match(resultTemplate("priced"), /data-highlight/);
  assert.match(resultTemplate("premium"), /asesor[\s\S]*necesidades/);
});

test("plan payload explicitly exposes only names, highlights and unchanged rates", () => {
  const frontmatter = resultSource.split("---")[1].replace(/^import .*;$/gm, "");
  const compiled = ts.transpileModule(frontmatter, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  }).outputText;
  const PLANS = Object.fromEntries(["standard", "pro"].map((id) => [id, {
    name: id, highlight: `Benefit ${id}`, volume: "INTERNAL RANGE", privateField: "INTERNAL",
  }]));
  const ZONE_LIST = [{ name: "CABA", prices: { standard: 3100, pro: 2800 } }];
  const plans = JSON.parse(runInNewContext(`${compiled}\nJSON.stringify(plans)`, { PLANS, ZONE_LIST }));
  for (const id of ["standard", "pro"]) {
    assert.deepEqual(plans[id], {
      name: PLANS[id].name, highlight: PLANS[id].highlight,
      rates: [{ name: "CABA", amount: ZONE_LIST[0].prices[id] }],
    });
  }
});

test("both plan templates receive the same card-contained primary and edit actions", () => {
  const actions = resultTemplate("actions");
  assert.equal((actions.match(/<a\b/g) ?? []).length, 1);
  assert.match(actions, /data-whatsapp[^>]*class="[^"]*btn-primary/);
  assert.match(actions, /data-edit[^>]*>Editar datos<\/button>/);
  assert.match(resultSource, /link\.textContent = "Adquirir el servicio";/);
  assert.match(resultSource, /const card = clone\(plan === "premium" \? "premium" : "priced"\)/);
  assert.match(resultSource, /card\.querySelector\("article"\)!\.append\(actions\);\s*content\.append\(card\);/);
  assert.doesNotMatch(resultSource, /content\.append\(card, actions\)/);
  assert.match(resultSource, /const heading = qualificationHeading\(data\.get\("volume"\)\)/);
  assert.match(resultSource, /const message = buildContactMessage\(data, "services", \{ heading \}\)/);
  assert.match(resultSource, /link\.href = whatsappUrl\(message\)/);
  assert.match(actions, /target="_blank" rel="noopener noreferrer"/);
});

test("generated plan labels and rates stay text-only", () => {
  for (const value of ["selected.name", "selected.highlight", "rate.name", "formatter.format(rate.amount)"]) {
    assert.ok(resultSource.includes(`.textContent = ${value};`), value);
  }
  assert.doesNotMatch(resultSource, /innerHTML|outerHTML|insertAdjacentHTML|set:html|document\.write/);
});

test("contact heading supports programmatic focus and clears the fixed header", () => {
  const heading = source.match(/<h2\b[^>]*id="contact-form-heading"[^>]*>/)?.[0] ?? "";
  assert.match(heading, /tabindex="-1"/);
  assert.match(heading, /class="[^"]*\bscroll-mt-24\b/);
});

// Execute the shared controller with a small DOM double; no browser/dependency fixture.
function contactController({ search = "", selectionMode = true, presetIntent, quoteMode = false } = {}) {
  const actions = [];
  const frames = [];
  class DomNode {}
  let activeElement;
  let floatingWrapper;
  const node = (id, classes = []) => {
    const tokens = new Set(classes);
    const listeners = {};
    const attributes = {};
    return Object.assign(new DomNode(), {
      id, dataset: {}, hidden: false, disabled: false, value: "", checked: false,
      classList: {
        contains: (token) => tokens.has(token),
        add: (token) => tokens.add(token), remove: (token) => tokens.delete(token),
        toggle: (token, force) => force ? tokens.add(token) : tokens.delete(token),
      },
      setAttribute: (key, value) => { attributes[key] = value; },
      getAttribute: (key) => attributes[key],
      hasAttribute: (key) => Object.hasOwn(attributes, key),
      toggleAttribute: (key, force) => { if (force) attributes[key] = ""; else delete attributes[key]; },
      addEventListener: (type, listener) => { (listeners[type] ??= []).push(listener); },
      emit(type, extra = {}) {
        const event = { button: 0, preventDefault() { this.defaultPrevented = true; }, ...extra };
        for (const listener of listeners[type] ?? []) listener(event);
        return event;
      },
      focus() {
        actions.push(`focus:${id}`);
        const previous = activeElement;
        activeElement = this;
        if (floatingWrapper?.contains(previous)) floatingWrapper.emit("focusout", { relatedTarget: this });
      },
      scrollIntoView: () => actions.push(`scroll:${id}`),
      setCustomValidity(message) { this.validationMessage = message; },
      checkValidity() { return !this.validationMessage; },
      reportValidity: () => actions.push(`validity:${id}`),
      matches() { return this.disabled || Boolean(this.parent?.disabled); },
    });
  };
  const elements = Object.fromEntries([
    "contact-form", "form-error", "form-success", "form-fallback", "fieldset-services",
    "fieldset-work", "fieldset-driver-details", "fieldset-non-driver", "formulario", "contact-form-heading",
    "submit-label", "submit-whatsapp-icon", "submit-email-icon", "form-success-message",
  ].map((id) => [id, node(id)]));
  elements["fieldset-non-driver"].disabled = true;
  const form = elements["contact-form"];
  form.dataset = { selectionMode: String(selectionMode), presetIntent, quoteMode: String(quoteMode), hideIntent: String(Boolean(presetIntent)) };
  const section = elements.formulario;
  section.hidden = selectionMode;
  const name = node("name");
  const store = node("store");
  store.parent = elements["fieldset-services"];
  const driver = node("driver");
  driver.value = "yes";
  driver.parent = elements["fieldset-work"];
  const origin = node("originZone");
  origin.parent = elements["fieldset-driver-details"];
  const nonDriver = node("non-driver");
  nonDriver.value = "no";
  nonDriver.parent = elements["fieldset-work"];
  const position = node("position");
  position.required = true;
  position.parent = elements["fieldset-non-driver"];
  const phone = node("phone");
  const controls = [name, store, driver, origin, nonDriver, position, phone];
  controls.forEach((field) => { field.name = field === nonDriver ? "driver" : field.id; });
  const submit = node("submit");
  submit.disabled = true;
  form.querySelectorAll = (selector) => ({
    'input[name="intent"]': [], 'input[name="driver"]': [driver, nonDriver],
    "input, select": controls, "[data-required-group]": [],
  })[selector] ?? [];
  form.querySelector = (selector) => selector.includes("submit") ? submit : name;
  const choices = ["services", "work"].map((intent) => {
    const choice = node(intent);
    choice.dataset.contactIntent = intent;
    choice.href = `https://flexai.com.ar/contacto?intent=${intent}#formulario`;
    return choice;
  });
  // Derive actual floating anchors from markup so missing controller hooks fail behavior tests.
  const floatingChoices = [...floatingSource.matchAll(/<a\b[^>]*>/g)].map(([tag], index) => {
    const choice = node(`floating-${index}`);
    const intent = tag.match(/data-contact-intent="([^"]+)"/)?.[1];
    if (intent) choice.dataset.contactIntent = intent;
    choice.href = `https://flexai.com.ar${tag.match(/href="([^"]+)"/)[1]}`;
    return choice;
  });
  const button = elements["whatsapp-float"] = node("whatsapp-float");
  const popup = elements["whatsapp-popup"] = node("whatsapp-popup");
  popup.hidden = true;
  popup.querySelectorAll = () => floatingChoices;
  floatingWrapper = node("floating-wrapper");
  floatingWrapper.contains = (target) => [button, popup, ...floatingChoices].includes(target);
  button.parentElement = floatingWrapper;
  const urls = [];
  const opens = [];
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^\s*import .*;$/gm, "");
  const context = {
    Node: DomNode,
    document: {
      addEventListener() {},
      getElementById: (id) => elements[id] ?? null,
      querySelectorAll: (selector) => selector === "[data-contact-intent]"
        ? [...choices, ...floatingChoices].filter((choice) => choice.dataset.contactIntent) : [],
    },
    window: {
      location: { search }, open: (url) => opens.push(url),
      scrollY: 1000, innerHeight: 800, addEventListener() {},
      history: { replaceState: (_state, _title, url) => urls.push(String(url)) },
    },
    requestAnimationFrame: (callback) => frames.push(callback), URLSearchParams,
    ...contactMessage, SITE, whatsappUrl,
    contactFieldError: (field) => field.value === "invalid" ? "Revisá este dato" : contactMessage.contactFieldError(field),
    FormData: class {
      constructor() {
        this.data = new FormData();
        for (const field of controls) {
          if (!field.matches(":disabled") && (field.name !== "driver" || field.checked)) {
            this.data.append(field.name, field.value);
          }
        }
      }
      get(key) { return this.data.get(key); }
      getAll(key) { return this.data.getAll(key); }
    },
  };
  for (const controller of [script, floatingSource.match(/<script>([\s\S]*?)<\/script>/)[1]]) {
    runInNewContext(ts.transpileModule(controller, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
    }).outputText, { ...context });
  }
  return {
    elements, form, section, choices, floatingChoices, button, popup, controls, submit, actions, urls, opens,
    driver, nonDriver, position, phone,
    flush: () => { while (frames.length) frames.shift()(); },
  };
}

test("non-driver markup has a disabled required position and separate accessible CTA icons", () => {
  assert.match(source, /<fieldset id="fieldset-non-driver"[^>]*class="hidden[^>]*disabled>/);
  assert.match(input("position"), /type="text"/);
  assert.match(input("position"), /\brequired\b/);
  assert.match(source, /Puesto al que te postulás \*/);
  for (const id of ["submit-whatsapp-icon", "submit-email-icon"]) {
    assert.match(source, new RegExp(`<span id="${id}"[^>]*aria-hidden="true"`));
  }
  assert.match(source, /id="submit-whatsapp-icon"[\s\S]*?simple-icons:whatsapp/);
  assert.match(source, /id="submit-email-icon"[^>]*>[\s\S]*?<svg/);
  assert.doesNotMatch(source, /type="file"|fetch\(/);
});

function selectDriver(ui, isDriver) {
  ui.driver.checked = isDriver;
  ui.nonDriver.checked = !isDriver;
  (isDriver ? ui.driver : ui.nonDriver).emit("change");
}

function assertCta(ui, label, email = false, quote = false) {
  assert.equal(ui.elements["submit-label"].textContent, label);
  assert.equal(ui.elements["submit-email-icon"].classList.contains("hidden"), !email || quote);
  assert.equal(ui.elements["submit-whatsapp-icon"].classList.contains("hidden"), email || quote);
}

test("non-driver switches position and email CTA immediately, preserving typed values and quote CTA", () => {
  const ui = contactController({ search: "?intent=work" });
  assertCta(ui, "Enviar por WhatsApp");
  assert.equal(ui.elements["fieldset-non-driver"].disabled, true);
  selectDriver(ui, false);
  assertCta(ui, "Enviar CV", true);
  assert.equal(ui.elements["fieldset-non-driver"].disabled, false);
  assert.equal(ui.elements["fieldset-non-driver"].classList.contains("hidden"), false);
  ui.position.value = "Administración";
  for (const switchTo of [() => selectDriver(ui, true), () => ui.choices[0].emit("click")]) {
    switchTo();
    assertCta(ui, "Enviar por WhatsApp");
    assert.equal(ui.elements["fieldset-non-driver"].disabled, true);
    assert.equal(ui.elements["fieldset-non-driver"].classList.contains("hidden"), true);
    ui.choices[1].emit("click");
    selectDriver(ui, false);
    assert.equal(ui.position.value, "Administración");
    assertCta(ui, "Enviar CV", true);
  }
  const plans = contactController({ presetIntent: "services", quoteMode: true });
  assertCta(plans, "Ver mi plan", false, true);
});

test("non-driver rejects blank position, focuses it, and hands a valid email to the client and fallback", () => {
  const ui = contactController({ search: "?intent=work" });
  ui.controls[0].value = "Ana Pérez";
  ui.controls[1].value = "HIDDEN_STORE";
  ui.controls[3].value = "HIDDEN_ORIGIN";
  selectDriver(ui, false);
  for (const blank of ["", "  \t "]) {
    ui.position.value = blank;
    ui.form.emit("submit");
    assert.equal(ui.opens.length, 0);
    assert.equal(ui.position.getAttribute("aria-invalid"), "true");
    assert.deepEqual(ui.actions.slice(-2), ["focus:position", "validity:position"]);
  }
  ui.position.value = "Depósito & logística";
  ui.phone.value = "11 1234 5678";
  ui.form.emit("input");
  assert.equal(ui.position.getAttribute("aria-invalid"), "false");
  assert.equal(ui.opens.length, 0);
  ui.form.emit("submit");
  assert.equal(ui.opens.length, 1);
  const url = ui.opens[0];
  assert.ok(url.startsWith(`mailto:${SITE.email}?`));
  const body = new URL(url).searchParams.get("body");
  assert.match(body, /Nombre: Ana Pérez/);
  assert.match(body, /Puesto: Depósito & logística/);
  assert.match(body, /Teléfono: 11 1234 5678/);
  assert.doesNotMatch(body, /HIDDEN_|Vehículo|Empresa/);
  assert.equal(ui.elements["form-fallback"].href, url);
  assert.equal(ui.form.classList.contains("hidden"), true);
  assert.equal(ui.elements["form-success"].classList.contains("hidden"), false);
  assert.match(ui.elements["form-success-message"].textContent, /[Aa]djuntá tu CV/);
  assert.match(ui.elements["form-success-message"].textContent, /correo/);
  assert.doesNotMatch(ui.elements["form-success-message"].textContent, /WhatsApp|enviado/);
  assert.equal(ui.actions.at(-1), "focus:form-success");
});

test("switching back to seller or driver keeps WhatsApp handoff and ignores stale position", () => {
  for (const intent of ["services", "work"]) {
    const ui = contactController({ search: "?intent=work" });
    ui.controls[0].value = "Ana";
    selectDriver(ui, false);
    ui.position.value = "STALE_POSITION";
    ui.form.emit("submit");
    if (intent === "services") ui.choices[0].emit("click");
    else { ui.choices[1].emit("click"); selectDriver(ui, true); }
    ui.form.emit("submit");
    const url = ui.opens.at(-1);
    assert.ok(url.startsWith("https://wa.me/"));
    const message = new URL(url).searchParams.get("text");
    assert.doesNotMatch(message, /STALE_POSITION|Puesto:|adjunt/);
    assert.match(message, intent === "services" ? /servicio de envíos/ : /conductor\/a/);
    assert.equal(ui.elements["form-fallback"].href, url);
    assert.match(ui.elements["form-success-message"].textContent, /WhatsApp/);
    assert.doesNotMatch(ui.elements["form-success-message"].textContent, /CV/);
  }
});

test("direct and malformed contact URLs keep both intents unselected and disabled", () => {
  for (const search of ["", "?intent=bogus", "?intent=", "?intent=Services"]) {
    const ui = contactController({ search });
    ui.flush();
    assert.equal(ui.section.hidden, true, search);
    assert.equal(ui.elements["fieldset-services"].disabled, true, search);
    assert.equal(ui.elements["fieldset-work"].disabled, true, search);
    assert.equal(ui.submit.disabled, true);
    ui.form.emit("submit");
    assert.equal(ui.opens.length, 0);
    assert.deepEqual(ui.actions, []);
  }
});

test("valid contact query reveals the matching form and focuses and scrolls its heading even without a fragment", () => {
  for (const intent of ["services", "work"]) {
    const ui = contactController({ search: `?intent=${intent}` });
    assert.equal(ui.section.hidden, false);
    assert.equal(ui.form.dataset.intent, intent);
    assert.equal(ui.elements["fieldset-services"].disabled, intent !== "services");
    assert.equal(ui.elements["fieldset-work"].disabled, intent !== "work");
    assert.equal(ui.submit.disabled, false);
    ui.flush();
    assert.deepEqual(ui.actions, ["focus:contact-form-heading", "scroll:contact-form-heading"]);
    assert.equal(ui.opens.length, 0);
  }
});

test("both hero choices focus and scroll the revealed heading while retaining public fragment URLs", () => {
  for (const intent of ["services", "work"]) {
    const ui = contactController();
    const choice = ui.choices.find((choice) => choice.dataset.contactIntent === intent);
    assert.equal(choice.emit("click").defaultPrevented, true);
    assert.equal(ui.section.hidden, false);
    assert.equal(ui.form.dataset.intent, intent);
    ui.flush();
    assert.deepEqual(ui.actions, ["focus:contact-form-heading", "scroll:contact-form-heading"]);
    assert.deepEqual(ui.urls, [`https://flexai.com.ar/contacto?intent=${intent}#formulario`]);
  }
});

test("hero choices switch without reload, retain values and clear stale errors/success", () => {
  const ui = contactController();
  assert.equal(ui.choices[0].emit("click").defaultPrevented, true);
  ui.controls[0].value = "invalid";
  ui.form.emit("submit");
  assert.equal(ui.opens.length, 0);
  assert.equal(ui.controls[0].getAttribute("aria-invalid"), "true");
  assert.ok(ui.actions.includes("validity:name"));
  ui.controls[0].value = "Ana";
  ui.controls[1].value = "Mi tienda";
  ui.choices[1].emit("click");
  assert.equal(ui.form.dataset.intent, "work");
  assert.equal(ui.choices[1].getAttribute("aria-expanded"), "true");
  assert.equal(ui.choices[0].getAttribute("aria-expanded"), "false");
  assert.equal(ui.elements["form-error"].classList.contains("hidden"), true);
  assert.equal(ui.controls[0].getAttribute("aria-invalid"), "false");
  ui.controls[2].checked = true;
  ui.controls[2].emit("change");
  assert.equal(ui.elements["fieldset-driver-details"].disabled, false);
  ui.form.emit("submit");
  assert.equal(ui.opens.length, 1);
  assert.equal(ui.elements["form-success"].classList.contains("hidden"), false);
  ui.choices[0].emit("click");
  assert.equal(ui.elements["form-success"].classList.contains("hidden"), true);
  assert.equal(ui.elements["form-fallback"].href, "#");
  assert.equal(ui.form.classList.contains("hidden"), false);
  assert.equal(ui.elements["fieldset-driver-details"].disabled, true);
  assert.equal(ui.controls[0].value, "Ana");
  assert.equal(ui.controls[1].value, "Mi tienda");
  assert.deepEqual(ui.urls, ["services", "work", "services"].map((intent) =>
    `https://flexai.com.ar/contacto?intent=${intent}#formulario`));
});

test("floating reselect and switches clear stale success, preserve data, and close via heading focusout", () => {
  const ui = contactController();
  ui.choices[0].emit("click");
  ui.flush();
  ui.controls[0].value = "Ana";
  ui.controls[1].value = "Mi tienda";
  ui.controls[2].checked = true;
  ui.controls[3].value = "Devoto";
  for (const intent of ["services", "work", "work", "services"]) {
    ui.form.emit("submit");
    assert.equal(ui.elements["form-success"].classList.contains("hidden"), false);
    ui.button.emit("click");
    assert.equal(ui.popup.hidden, false);
    const choice = ui.floatingChoices.find((choice) => choice.href.includes(`intent=${intent}`));
    choice.focus();
    ui.actions.length = 0;
    assert.equal(choice.emit("click").defaultPrevented, true);
    assert.equal(ui.form.dataset.intent, intent);
    assert.equal(ui.form.classList.contains("hidden"), false);
    assert.equal(ui.elements["form-success"].classList.contains("hidden"), true);
    assert.equal(ui.elements["form-fallback"].href, "#");
    ui.flush();
    assert.deepEqual(ui.actions, ["focus:contact-form-heading", "scroll:contact-form-heading"]);
    assert.equal(ui.popup.hidden, true);
    assert.equal(ui.button.getAttribute("aria-expanded"), "false");
    assert.equal(ui.urls.at(-1), choice.href);
    assert.deepEqual(ui.controls.slice(0, 4).map((field) => field.value), ["Ana", "Mi tienda", "yes", "Devoto"]);
    assert.equal(ui.controls[2].checked, true);
    for (const link of [...ui.choices, ...ui.floatingChoices]) {
      assert.equal(link.getAttribute("aria-expanded"), String(link.dataset.contactIntent === intent));
    }
  }
  ui.controls[0].value = "invalid";
  ui.form.emit("submit");
  assert.equal(ui.controls[0].getAttribute("aria-invalid"), "true");
  ui.floatingChoices[1].emit("click");
  assert.equal(ui.controls[0].getAttribute("aria-invalid"), "false");
  assert.equal(ui.elements["form-error"].classList.contains("hidden"), true);
  assert.equal(ui.controls[0].value, "invalid");
});

test("modified floating clicks and pages without selection mode retain native navigation", () => {
  for (const modifier of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    const ui = contactController();
    for (const choice of ui.floatingChoices) {
      assert.equal(choice.emit("click", modifier).defaultPrevented, undefined);
    }
    ui.flush();
    assert.equal(ui.section.hidden, true);
    assert.deepEqual(ui.urls, []);
    assert.deepEqual(ui.actions, []);
  }
  const plans = contactController({ selectionMode: false, presetIntent: "services", quoteMode: true });
  for (const choice of plans.floatingChoices) assert.equal(choice.emit("click").defaultPrevented, undefined);
  assert.equal(plans.form.dataset.intent, "services");
  assert.deepEqual(plans.urls, []);
});

test("modified hero clicks keep native navigation and planes preset bypasses the gate", () => {
  const ui = contactController();
  assert.equal(ui.choices[0].emit("click", { ctrlKey: true }).defaultPrevented, undefined);
  assert.equal(ui.section.hidden, true);
  const plans = contactController({ search: "?intent=work", selectionMode: false, presetIntent: "services", quoteMode: true });
  assert.equal(plans.form.dataset.intent, "services");
  assert.equal(plans.elements["fieldset-services"].disabled, false);
  assert.equal(plans.elements["fieldset-work"].disabled, true);
  assert.equal(plans.submit.disabled, false);
  plans.flush();
  assert.deepEqual(plans.actions, []);
});

test("no-JS cannot post intake to the static site and landing removes redundant question", () => {
  assert.match(source, /<button type="submit" disabled/);
  assert.match(source, /!hideIntent && !selectionMode/);
  assert.match(source, /Quiero realizar envíos con FLEXAI/);
  assert.doesNotMatch(source, /Quiero enviar con FLEXAI/);
});

test("explicit preset locks and conditional disabled fieldsets remain intact", () => {
  assert.match(source, /preset \?\? requested/);
  assert.match(source, /Boolean\(preset\)/);
  assert.match(source, /servicesFieldset\.disabled = intent !== "services"/);
  assert.match(source, /workFieldset\.disabled = intent !== "work"/);
  assert.match(source, /intent === "work" && driver === "yes"/);
  assert.match(source, /driverDetailsFieldset\.disabled = !showDriver/);
  assert.match(source, /checkboxes\.some\(\(input\) => !input\.matches\(":disabled"\)\)/);
  assert.match(source, /input\.setAttribute\("aria-invalid", String\(showErrors && invalid\)\)/);
});
