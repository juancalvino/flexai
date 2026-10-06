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
const text = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]*>/g, " ")
  .replace(/&nbsp;|&#160;/g, " ").replace(/\s+/g, " ");

async function buildVariant(t, pricing, collectiveShipping) {
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
    .replace(/pricing: (true|false)/, `pricing: ${pricing}`)
    .replace(/collectiveShipping: (true|false)/, `collectiveShipping: ${collectiveShipping}`));
  execFileSync(process.execPath, [join(root, "node_modules/astro/astro.js"), "build"], {
    cwd: fixture, encoding: "utf8", timeout: 120_000, stdio: "pipe",
  });
  return fixture;
}

for (const pricing of [false, true]) {
  for (const collective of [false, true]) {
    test(`pricing=${pricing}, collectiveShipping=${collective}`, async (t) => {
      const fixture = await buildVariant(t, pricing, collective);
      const dist = join(fixture, "dist");
      const [home, services, coverage, about] = await Promise.all(
        ["index.html", "servicios/index.html", "cobertura/index.html", "nosotros/index.html"]
          .map((path) => readFile(join(dist, path), "utf8")),
      );
      await t.test("collective promotion follows its own flag", () => {
        assert.equal(text(services).includes("Sumá envíos con otros comercios"), collective);
        if (!pricing && collective) assert.doesNotMatch(text(services), /plan superior|tarifas más bajas/i);
      });
      await t.test("rendered pricing and copy follow the pricing flag", () => {
        const visible = [home, services, coverage, about].map(text).join(" ");
        assert.doesNotMatch(visible, /Sin sorpresas/i);
        for (const plan of ["Standard Seller", "Pro Seller"]) {
          assert.equal(text(services).includes(plan), pricing);
        }
        if (pricing) {
          assert.match(text(services), /10 a 50 paquetes por día/);
          assert.match(text(services), /Más de 50 paquetes por día/);
          for (const price of expectedPrices) assert.ok(text(services).includes(price.toLocaleString("es-AR")));
        } else {
          assert.doesNotMatch(visible, /Ver planes|Tarifas claras|Mejor tarifa|10 a 50 paquetes|Más de 50 paquetes|IVA no incluido/i);
          assert.match(home, /<a\b[^>]*href="\/contacto\?intent=services"[^>]*>\s*Contactanos\s*<\/a>/);
        }
      });
      await t.test("services explain the offer before the final quotation link", () => {
        assert.doesNotMatch(services, /data-open-quote|<dialog\b/);
        if (!pricing) {
          const quote = services.indexOf('id="cotizacion"');
          assert.ok(quote > services.indexOf('id="servicios"') && quote > 0);
          assert.match(services.slice(quote), /<a\b[^>]*href="\/contacto\?intent=services"[^>]*>\s*Consultar tarifa\s*<\/a>/);
          const main = services.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
          assert.ok(main, "Layout renders main content");
          assert.equal(main.lastIndexOf("<section"), main.lastIndexOf("<section", main.indexOf('id="cotizacion"')));
        }
      });
      await t.test("map controls and downloadable data respect pricing", async () => {
        assert.equal((coverage.match(/data-plan="/g) ?? []).length, pricing ? 2 : 0);
        assert.equal(coverage.includes('id="zone-price-wrap"'), pricing);
        assert.equal((coverage.match(/data-zone="/g) ?? []).length, 4);
        const payload = coverage.match(/data-map="([^"]+)"/)?.[1];
        assert.ok(payload, "Map receives serialized build-time data");
        const map = JSON.parse(payload.replace(/&quot;|&#34;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&"));
        assert.deepEqual(map.zones.map((zone) => zone.id), ["CABA", "GBA1", "GBA2", "GBA3"]);
        assert.equal(map.plans !== null, pricing);
        for (const [index, zone] of map.zones.entries()) {
          assert.equal(Object.hasOwn(zone, "prices"), pricing);
          if (pricing) {
            for (const [offset, plan] of ["standard", "pro"].entries()) {
              assert.equal(zone.prices[plan].replace(/\D/g, ""), String(expectedPrices[index * 2 + offset]));
            }
          }
        }
        assert.ok(map.zones[1].searchAliases.some((alias) => alias.names.includes("Ramos Mejía")));
        assert.ok(map.zones[2].searchAliases.some((alias) => alias.names.includes("González Catán")));
        assert.deepEqual(map.exceptions.Tigre, ["Nordelta"]);
        const assets = await readdir(join(dist, "_astro"));
        const clientJS = (await Promise.all(assets.filter((name) => name.endsWith(".js"))
          .map((name) => readFile(join(dist, "_astro", name), "utf8")))).join("\n");
        if (!pricing) {
          const leakedPrice = /["']?(?:standard|pro)["']?\s*:\s*(?:3100|2800|4000|3700|5000|4700|6800|6550)\b/.exec(`${coverage}\n${clientJS}`);
          assert.equal(leakedPrice?.[0], undefined, "OFF downloadable output excludes the commercial price table");
          assert.doesNotMatch(coverage, /data-standard=|data-pro=|\$\s*(?:3\.100|2\.800|6\.550)/);
        } else {
          assert.match(coverage, /data-standard="\$\s*3\.100"/);
          assert.match(coverage, /data-pro="\$\s*2\.800"/);
        }
        assert.equal(await readFile(join(dist, "data/amba.geojson"), "utf8"),
          await readFile(join(root, "public/data/amba.geojson"), "utf8"));
      });
      assert.equal(await readFile(featurePath, "utf8"), originalFlags, "Active feature configuration stays untouched");
    });
  }
}
