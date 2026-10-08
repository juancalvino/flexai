import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const featurePath = join(root, "src/data/features.ts");
const originalFlags = await readFile(featurePath, "utf8");
const expectedPrices = [3100, 2800, 4000, 3700, 5000, 4700, 6800, 6550];
const text = (html) => html.replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, "")
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]*>/g, " ")
  .replace(/&nbsp;|&#160;/g, " ").replace(/\s+/g, " ");

async function buildVariant(t, pricing) {
  const fixture = await mkdtemp(join(tmpdir(), "flexai-variants-"));
  // Register before copying/building so failures also clean up this invocation's fixture.
  // Opt in to browser debugging with FLEXAI_KEEP_VARIANT_FIXTURES=1.
  if (process.env.FLEXAI_KEEP_VARIANT_FIXTURES === "1") {
    t.diagnostic(`Retaining fixture (FLEXAI_KEEP_VARIANT_FIXTURES=1): ${fixture}`);
  } else {
    t.after(() => rm(fixture, { recursive: true, force: true }));
  }
  // Explicit inputs only: never copy environment files, Git state or local caches.
  for (const path of ["src", "public", "package.json", "astro.config.mjs", "astro.config.security.mjs", "tailwind.config.cjs", "tsconfig.json"]) {
    await cp(join(root, path), join(fixture, path), {
      recursive: true,
      filter: (source) => !basename(source).startsWith(".env"),
    });
  }
  await symlink(join(root, "node_modules"), join(fixture, "node_modules"), "dir");
  // Keep Astro component paths and generated caches inside the fixture despite the dependency symlink.
  const configPath = join(fixture, "astro.config.mjs");
  await writeFile(configPath, (await readFile(configPath, "utf8")).replace("  vite: {", `  cacheDir: "./.astro-cache",
  vite: {
    cacheDir: "./.vite-cache",
    resolve: { preserveSymlinks: true },`));
  await writeFile(join(fixture, "src/data/features.ts"), originalFlags
    .replace(/pricing: (true|false)/, `pricing: ${pricing}`));
  execFileSync(process.execPath, [join(root, "node_modules/astro/astro.js"), "build"], {
    cwd: fixture, encoding: "utf8", timeout: 120_000, stdio: "pipe",
  });
  return fixture;
}

for (const pricing of [false, true]) {
  test(`pricing=${pricing}`, async (t) => {
    const fixture = await buildVariant(t, pricing);
    const dist = join(fixture, "dist");
    const [home, services, coverage, about, plans, contact] = await Promise.all(
      ["index.html", "servicios/index.html", "cobertura/index.html", "nosotros/index.html", "planes/index.html", "contacto/index.html"]
        .map((path) => readFile(join(dist, path), "utf8")),
    );
    await t.test("rendered pricing and copy follow the pricing flag", () => {
      const visible = [home, services, coverage, about].map(text).join(" ");
      assert.doesNotMatch(visible, /Sin sorpresas|Tarifas claras|Standard Seller|Pro Seller|IVA no incluido/i);
      if (pricing) {
        assert.match(text(plans), /Tarifas claras\. Sin sorpresas\./);
        assert.match(plans, /class="block">Tarifas claras\.<\/span>/);
        assert.match(plans, /class="block text-accent">Sin sorpresas\.<\/span>/);
        assert.equal((plans.match(/<h1\b/g) ?? []).length, 1);
        assert.match(plans, /data-quote-mode="true"/);
        assert.match(plans, /data-preset-intent="services" data-hide-intent="true"/);
        assert.match(plans, /id="qualified-result"[^>]*class="hidden/);
        assert.match(plans, /<div data-result-content><\/div>/);
        assert.doesNotMatch(text(plans), /Standard Seller|Pro Seller|IVA no incluido/);
        const payload = plans.match(/data-plans="([^"]+)"/)?.[1];
        assert.ok(payload);
        const rates = JSON.parse(payload.replace(/&quot;|&#34;/g, '"').replace(/&amp;/g, "&"));
        assert.deepEqual(Object.keys(rates), ["standard", "pro"]);
        for (const plan of Object.values(rates)) {
          assert.deepEqual(Object.keys(plan), ["name", "highlight", "rates"]);
          assert.ok(plan.name);
          assert.ok(plan.highlight);
        }
        assert.doesNotMatch(plans, /data-message|data-volume|Revisá tu consulta|Todavía no enviamos nada|1–50|51–99|100 paquetes por día o más/);
        for (const name of ["priced", "premium"]) {
          const template = plans.match(new RegExp(`<template data-result-template="${name}">([\\s\\S]*?)<\\/template>`))?.[1];
          assert.ok(template);
          assert.equal((template.match(/<article\b/g) ?? []).length, 1);
          assert.doesNotMatch(template, /\d+\s*(?:[–−-]\s*\d+|paquetes)|por día/);
          if (name === "premium") assert.doesNotMatch(template, /data-rates|<dl|IVA|\$/);
        }
        const actions = plans.match(/<template data-result-template="actions">([\s\S]*?)<\/template>/)?.[1];
        assert.ok(actions);
        assert.equal((actions.match(/data-whatsapp/g) ?? []).length, 1);
        assert.match(actions, /data-whatsapp[^>]*class="[^"]*btn-primary/);
        assert.match(actions, /data-edit[^>]*>Editar datos<\/button>/);
        assert.deepEqual(Object.values(rates).flatMap((plan) => plan.rates.map((rate) => rate.amount)).sort((a, b) => a - b), [...expectedPrices].sort((a, b) => a - b));
      } else {
        assert.doesNotMatch(plans, /data-plans=|id="qualified-result"|data-quote-mode="true"|Tarifas claras|Sin sorpresas/);
        assert.match(plans, /data-preset-intent="services" data-hide-intent="true"/);
        assert.doesNotMatch(visible, /Ver planes|Tarifas claras|Mejor tarifa|10 a 50 paquetes|Más de 50 paquetes|IVA no incluido/i);
        assert.match(home, /<a\b[^>]*href="\/contacto\?intent=services#formulario"[^>]*>\s*Contactanos\s*<\/a>/);
      }
    });
    await t.test("contact renders a choice gate, not a default seller form", () => {
      const hero = contact.match(/<section\b[\s\S]*?<\/section>/)?.[0];
      assert.ok(hero);
      assert.match(text(hero), /Adquirir servicio[\s\S]*Trabajá con nosotros/);
      for (const intent of ["services", "work"]) {
        assert.ok(hero.includes(`href="/contacto?intent=${intent}#formulario"`));
        assert.ok(hero.includes(`data-contact-intent="${intent}"`));
      }
      assert.match(contact, /id="formulario"[^>]*hidden[^>]*tabindex="-1"[^>]*scroll-mt-24/);
      assert.match(contact, /data-selection-mode="true"/);
      assert.doesNotMatch(contact, /id="fieldset-intent"/);
      assert.equal((contact.match(/id="contact-form"/g) ?? []).length, 1);
      assert.match(contact, /<noscript>[\s\S]*?JavaScript/);
      assert.match(plans, /data-selection-mode="false"/);
      const plansForm = plans.match(/<form\b[^>]*id="contact-form"[^>]*>[\s\S]*?<\/form>/)?.[0];
      assert.ok(plansForm, "Plans renders its preset intake form");
      assert.doesNotMatch(plansForm, /data-contact-intent/);
      assert.doesNotMatch(plans, /id="fieldset-intent"/);
    });
    await t.test("shared public links route through intake without new tabs", () => {
      for (const html of [home, services, coverage, about, plans, contact]) {
        assert.doesNotMatch(html, /href="https:\/\/(?:wa\.me|api\.whatsapp\.com)/);
        const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
        assert.ok(header);
        assert.doesNotMatch(text(header), /Hablanos/i);
        for (const anchor of html.matchAll(/<a\b[^>]*>/g)) {
          if (/href="\/contacto(?:\?|"|\/)/.test(anchor[0])) assert.doesNotMatch(anchor[0], /target="_blank"/);
          if (/href="https:\/\/(?:instagram\.com|lightdata\.flexai\.com\.ar)/.test(anchor[0])) assert.match(anchor[0], /target="_blank"/);
        }
        const floatingPopup = html.match(/<div\b[^>]*id="whatsapp-popup"[\s\S]*?<\/div>\s*<\/div>/)?.[0];
        assert.ok(floatingPopup, "Every page retains the floating contact choices");
        for (const intent of ["services", "work"]) {
          const choice = [...floatingPopup.matchAll(/<a\b[^>]*>/g)]
            .find(([anchor]) => anchor.includes(`data-contact-intent="${intent}"`))?.[0];
          assert.ok(choice, `Floating contact retains the ${intent} hook`);
          assert.ok(choice.includes(`href="/contacto?intent=${intent}#formulario"`));
        }
        assert.match(html, /href="\/contacto\?intent=work#formulario"/);
        assert.match(html, /href="\/contacto\?intent=services#formulario"/);
        assert.doesNotMatch(html, /Quiero enviar con FLEXAI/);
      }
      assert.match(home, pricing
        ? /href="\/planes"[^>]*>Ver tarifas<\/a>/
        : /href="\/servicios"[^>]*>Ver servicios<\/a>/);
    });
    await t.test("services share the service-first structure and final contact CTA across flags", () => {
      assert.doesNotMatch(services, /data-open-quote|<dialog\b/);
      const mainContent = services.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
      assert.ok(mainContent);
      assert.equal((mainContent.match(/<h1\b/g) ?? []).length, 1);
      assert.match(home, /<h2\b[^>]*>[\s\S]*?Todo lo que tu/);
      const sections = [...mainContent.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].map(([section]) => section);
      assert.equal(sections.length, 3, "Services, differentiators and final contact CTA stay shared");
      assert.match(sections[0], /id="servicios"/);
      assert.match(sections[0], /pt-40/);
      assert.match(sections[0], /<h1\b[^>]*>[\s\S]*?Todo lo que tu[\s\S]*?tienda necesita[\s\S]*?para vender más/);
      assert.match(text(sections[1]), /Por qué FLEXAI[\s\S]*Tu reputación,[\s\S]*en buenas manos\./);
      assert.match(text(sections[2]), /Empezá hoy[\s\S]*Tus ventas,[\s\S]*nuestra ruta\./);
      assert.match(sections[2], /<a\b[^>]*href="\/contacto\?intent=services#formulario"[^>]*>\s*Hablanos por WhatsApp\s*<\/a>/);
      assert.match(sections[2], /<a\b[^>]*href="\/contacto\?intent=services#formulario"[^>]*>\s*Dejanos tus datos\s*<\/a>/);
      assert.doesNotMatch(mainContent, /id="(?:tarifas|cotizacion)"|Tu logística,/);
      assert.match(sections[0], pricing
        ? /href="\/planes"[^>]*>\s*Ver planes y tarifas/
        : /href="\/contacto\?intent=services#formulario"[^>]*>\s*Contactanos/);
    });
    const assets = await readdir(join(dist, "_astro"));
    const clientJS = (await Promise.all(assets.filter((name) => name.endsWith(".js"))
      .map((name) => readFile(join(dist, "_astro", name), "utf8")))).join("\n");
    const htmlPaths = (await readdir(dist, { recursive: true })).filter((path) => path.endsWith(".html"));
    const allHTML = await Promise.all(htmlPaths.map((path) => readFile(join(dist, path), "utf8")));
    const htmlAndJS = [...allHTML, clientJS].join("\n");
    await t.test("collective shipping is absent from every page and client asset", () => {
      assert.doesNotMatch(originalFlags, /collective/i);
      assert.doesNotMatch(htmlAndJS, /collective|envíos colectivos|Sumá envíos con otros comercios|comercios cercanos|operación conjunta/i);
    });
    await t.test("every page uses provider-neutral tracking and three exact Login labels", () => {
      assert.doesNotMatch(htmlAndJS.replaceAll("https://lightdata.flexai.com.ar", ""), /lightdata/i);
      for (const html of allHTML) {
        const links = [...html.matchAll(/<a\b[^>]*href="https:\/\/lightdata\.flexai\.com\.ar"[^>]*>([\s\S]*?)<\/a>/g)];
        assert.equal(links.length, 3, "Desktop, mobile and footer retain the real tracking URL");
        for (const link of links) {
          assert.equal(text(link[1]).trim(), "Login");
          assert.match(link[0], /target="_blank"/);
          assert.match(link[0], /rel="noopener noreferrer"/);
        }
      }
      for (const html of [home, services]) {
        assert.match(text(html), /Seguimiento de envíos/);
        assert.match(text(html), /plataforma de seguimiento/);
      }
    });
    await t.test("map is coverage-only under both pricing variants", async () => {
      assert.equal((coverage.match(/data-plan="/g) ?? []).length, 0);
      assert.equal(coverage.includes('id="zone-price-wrap"'), false);
      assert.match(coverage, new RegExp(`<a\\b[^>]*id="zone-cta"[^>]*href="${pricing ? "/planes" : "/contacto\\?intent=services#formulario"}"`));
      assert.equal((coverage.match(/data-zone="/g) ?? []).length, 4);
      const payload = coverage.match(/data-map="([^"]+)"/)?.[1];
      assert.ok(payload, "Map receives serialized build-time data");
      const map = JSON.parse(payload.replace(/&quot;|&#34;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&"));
      assert.deepEqual(map.zones.map((zone) => zone.id), ["CABA", "GBA1", "GBA2", "GBA3"]);
      assert.equal(Object.hasOwn(map, "plans"), false);
      for (const zone of map.zones) assert.equal(Object.hasOwn(zone, "prices"), false);
      assert.ok(map.zones[1].searchAliases.some((alias) => alias.names.includes("Ramos Mejía")));
      assert.ok(map.zones[2].searchAliases.some((alias) => alias.names.includes("González Catán")));
      assert.deepEqual(map.exceptions.Tigre, ["Nordelta"]);
      const leakedPrice = /["']?(?:standard|pro)["']?\s*:\s*(?:3100|2800|4000|3700|5000|4700|6800|6550)\b/.exec(`${coverage}\n${clientJS}`);
      assert.equal(leakedPrice?.[0], undefined, "Map and client JS exclude the commercial price table");
      if (!pricing) {
        assert.doesNotMatch(htmlAndJS, /data-plans=|"amount":(?:3100|2800|4000|3700|5000|4700|6800|6550)/);
        assert.doesNotMatch(htmlAndJS, /\$\s*(?:3\.100|2\.800|4\.000|3\.700|5\.000|4\.700|6\.800|6\.550)/);
      }
      assert.doesNotMatch(coverage, /data-standard=|data-pro=|\$\s*(?:3\.100|2\.800|6\.550)/);
      assert.doesNotMatch(text(coverage), /Standard Seller|Pro Seller|IVA no incluido|ver la tarifa/i);
      assert.equal(await readFile(join(dist, "data/amba.geojson"), "utf8"),
        await readFile(join(root, "public/data/amba.geojson"), "utf8"));
    });
    assert.equal(await readFile(featurePath, "utf8"), originalFlags, "Active feature configuration stays untouched");
  });
}
