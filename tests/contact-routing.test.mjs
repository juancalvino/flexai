import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const read = (path) => readFile(new URL(`../src/${path}`, import.meta.url), "utf8");
const [navbar, footer, hero, contact, map, site, zonesSource] = await Promise.all([
  "components/navbar/navbar.astro", "components/footer.astro", "components/sections/HeroSection.astro",
  "components/sections/ContactCta.astro", "components/GeoJSONMap.astro", "data/site.ts", "data/zones.ts",
].map(read));
const transpile = (source) => ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const load = (source) => import(`data:text/javascript;base64,${Buffer.from(transpile(source)).toString("base64")}`);
const zones = await load(zonesSource);
const sourcePaths = (await readdir(new URL("../src/", import.meta.url), { recursive: true }))
  .filter((path) => /\.(astro|[cm]?[jt]s|css)$/.test(path));
const sources = await Promise.all(sourcePaths.map(async (path) => [path, await read(path)]));

test("header removes both Hablanos actions; public shared CTAs use intake", () => {
  assert.doesNotMatch(navbar, /Hablanos|whatsappUrl|DEFAULT_WHATSAPP_MESSAGE/);
  for (const source of [footer, hero, contact]) assert.doesNotMatch(source, /whatsappUrl|DEFAULT_WHATSAPP_MESSAGE|wa\.me/);
  assert.match(footer, /href="\/contacto"/);
  assert.match(hero, /href="\/contacto\?intent=services#formulario"/);
  assert.match(contact, /href="\/contacto\?intent=services#formulario"/);
  assert.match(hero, /href=\{FEATURES\.pricing \? "\/planes" : "\/servicios"\}/);
});

test("contact hero contains two progressive choices before the initially hidden shared form", async () => {
  const page = await read("pages/contacto.astro");
  const hero = page.match(/<PageHero\b[\s\S]*?<\/PageHero>/)?.[0] ?? "";
  for (const [intent, label] of [["services", "Adquirir servicio"], ["work", "Trabajá con nosotros"]]) {
    assert.ok(hero.includes(`href="/contacto?intent=${intent}#formulario"`));
    assert.ok(hero.includes(`data-contact-intent="${intent}"`));
    assert.ok(hero.includes(label));
  }
  assert.match(hero, /aria-controls="formulario"/);
  assert.match(page, /<section[^>]*id="formulario"[^>]*hidden[^>]*tabindex="-1"[^>]*scroll-mt-24/);
  assert.match(page, /<ContactForm selectionMode\s*\/>/);
  assert.match(page, /<noscript>[\s\S]*?JavaScript/);
});

test("all intent-specific links target the form and updated floating choices remain links", async () => {
  for (const [path, source] of sources) {
    assert.doesNotMatch(source, /\/contacto\?intent=(?:services|work)(?!#formulario)["'`]/, path);
    assert.doesNotMatch(source, /Quiero enviar con FLEXAI/, path);
  }
  const floating = await read("components/ui/WhatsAppFloat.astro");
  for (const intent of ["services", "work"]) assert.ok(floating.includes(`href="/contacto?intent=${intent}#formulario"`));
  assert.match(floating, /Quiero realizar envíos con FLEXAI/);
});

test("floating choices mirror contact hero intents and native cross-page URLs", async () => {
  const page = await read("pages/contacto.astro");
  const hero = page.match(/<PageHero\b[\s\S]*?<\/PageHero>/)?.[0] ?? "";
  const floating = await read("components/ui/WhatsAppFloat.astro");
  for (const intent of ["services", "work"]) {
    for (const markup of [hero, floating]) {
      const anchor = [...markup.matchAll(/<a\b[^>]*>/g)]
        .find(([tag]) => tag.includes(`href="/contacto?intent=${intent}#formulario"`))?.[0];
      assert.ok(anchor, `${intent} retains its native URL`);
      assert.ok(anchor.includes(`data-contact-intent="${intent}"`), `${intent} uses the shared controller`);
    }
  }
});

test("generic social WhatsApp opens intake in place, external links stay external", async () => {
  const { SOCIAL_LINKS } = await load(site);
  assert.equal(SOCIAL_LINKS.find((link) => link.name === "WhatsApp").href, "/contacto");
  assert.match(SOCIAL_LINKS.find((link) => link.name === "Instagram").href, /^https:\/\//);
  for (const source of [navbar, footer]) {
    assert.match(source, /target=\{social\.href\.startsWith\("\/"\) \? undefined : "_blank"\}/);
    assert.match(source, /href=\{SITE\.trackingUrl\} target="_blank" rel="noopener noreferrer"/);
  }
});

test("tracking links use centralized unchanged destination and exact Login labels", async () => {
  const { SITE } = await load(site);
  assert.equal(SITE.trackingUrl, "https://lightdata.flexai.com.ar");
  assert.equal(Object.hasOwn(SITE, "lightDataUrl"), false);
  for (const [source, expectedCount] of [[navbar, 2], [footer, 1]]) {
    const links = [...source.matchAll(/<a\b[^>]*href=\{SITE\.trackingUrl\}[^>]*>([\s\S]*?)<\/a>/g)];
    assert.equal(links.length, expectedCount);
    for (const link of links) {
      assert.equal(link[1].trim(), "Login");
      assert.match(link[0], /target="_blank" rel="noopener noreferrer"/);
    }
  }
});

test("tracking service and workflow use provider-neutral wording", async () => {
  const { SERVICES, STEPS } = await load(await read("data/services.ts"));
  const tracking = SERVICES.find((service) => service.id === "tracking");
  assert.ok(tracking);
  assert.equal(tracking.title, "Seguimiento de envíos");
  assert.match(tracking.description, /plataforma de seguimiento/);
  assert.match(STEPS.find((step) => step.title === "Seguís todo").description, /plataforma de seguimiento/);
});

test("provider branding exists only in the centralized real URL", () => {
  for (const [path, source] of sources) {
    const neutralSource = path === "data/site.ts" ? source.replace('"https://lightdata.flexai.com.ar"', '""') : source;
    assert.doesNotMatch(neutralSource, /lightdata/i, path);
  }
});

test("collective shipping flag and promotion are removed throughout the site", async () => {
  const { FEATURES } = await load(await read("data/features.ts"));
  assert.deepEqual(Object.keys(FEATURES), ["pricing"]);
  for (const [path, source] of sources) {
    assert.doesNotMatch(source, /collective|envíos colectivos|Sumá envíos con otros comercios|comercios cercanos|operación conjunta/i, path);
  }
});

for (const pricing of [false, true]) {
  test(`map serializes coverage only with pricing=${pricing}`, () => {
    const frontmatter = map.split("---")[1].replace(/^import .*;$/gm, "");
    const payload = JSON.parse(runInNewContext(`${transpile(frontmatter)}\nJSON.stringify(mapData)`, {
      ...zones, FEATURES: { pricing },
    }));
    assert.equal(Object.hasOwn(payload, "plans"), false);
    assert.deepEqual(payload.zones.map((zone) => zone.id), ["CABA", "GBA1", "GBA2", "GBA3"]);
    for (const zone of payload.zones) assert.equal(Object.hasOwn(zone, "prices"), false);
    assert.deepEqual(payload.exceptions.Tigre, ["Nordelta"]);
    assert.ok(payload.zones[1].searchAliases.some((alias) => alias.names.includes("Ramos Mejía")));
  });
}

test("map has no obsolete pricing UI or client paths; quote destination is build-time", () => {
  assert.doesNotMatch(map, /zone-price|zone-plan|map-summary-price|plan-btn|data-plan|data-standard|data-pro|PlanId|formatPrice|whatsappUrl/);
  assert.match(map, /id="zone-cta" href=\{FEATURES\.pricing \? "\/planes" : "\/contacto\?intent=services#formulario"\}/);
  const script = map.match(/<script>([\s\S]*?)<\/script>/)[1];
  assert.doesNotMatch(script, /cta\.href|plans|priceWrap|summaryPrice/);
  // Preserve coverage interaction hooks, including mobile summary and fallback search.
  for (const id of ["map-reset", "locality-search", "locality-input", "search-feedback", "map-summary", "map-hint", "zone-localities"]) {
    assert.ok(map.includes(`id="${id}"`), id);
  }
  assert.match(script, /polygon\.on\(/);
  assert.match(script, /placeLayer\?\.setStyle/);
  assert.match(script, /map\.flyTo\(overview\.center, overview\.zoom/);
  assert.match(script, /searchInput\.addEventListener\("change", searchLocality\)/);
  assert.match(script, /dragging: !isTouch/);
});
