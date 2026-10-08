import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const hero = await readFile(new URL("../src/components/sections/PageHero.astro", import.meta.url), "utf8");
const nosotros = await readFile(new URL("../src/pages/nosotros.astro", import.meta.url), "utf8");
const planes = await readFile(new URL("../src/pages/planes.astro", import.meta.url), "utf8");
const services = await readFile(new URL("../src/pages/servicios.astro", import.meta.url), "utf8");
const homeHero = await readFile(new URL("../src/components/sections/HeroSection.astro", import.meta.url), "utf8");

// Source contracts only; the parent verifier checks rendered variants and viewport geometry.
test("Servicios shares its service-first H1, differentiators and final contact CTA across flags", () => {
  assert.match(services, /<ServicesSection headingTag="h1"\s*\/>/);
  assert.doesNotMatch(services, /FEATURES|PageHero|ZONE_LIST|id="cotizacion"/);
  assert.match(services, /DIFFERENTIATORS\.map/);
  assert.match(services, /<ContactCta\s*\/>\s*<\/Layout>/);
  assert.ok(services.indexOf("<ServicesSection") < services.indexOf("DIFFERENTIATORS.map"));
  assert.ok(services.indexOf("DIFFERENTIATORS.map") < services.indexOf("<ContactCta"));
});

test("home foreground reserves mobile clearance for the visible image instructions", () => {
  const foreground = homeHero.match(/<Container\b[^>]*>/)?.[0] ?? "";
  assert.match(foreground, /\bpt-64 sm:pt-32\b/);
  assert.match(homeHero, /min-h-\[100svh\]/);
  const placeholder = homeHero.match(/<ImageSlot\b[\s\S]*?\/>/)?.[0] ?? "";
  assert.match(placeholder, /prompt="fotografía cinematográfica/);
  assert.match(placeholder, /class="h-\[115%\] w-full pt-20"/);
  assert.doesNotMatch(placeholder, /hidden|invisible|opacity-0|aria-hidden/);
});

test("Planes opts into full height for both pricing variants without changing its conditional title", () => {
  const usage = planes.match(/<PageHero\b[^>]*>/)?.[0];
  assert.ok(usage);
  assert.match(usage, /\sfullHeight(?:\s|\/|=\{true\})/);
  assert.match(usage, /eyebrow=\{FEATURES\.pricing \? "Planes · Tarifas" : "Contacto · Envíos"\}/);
  assert.match(usage, /title=\{FEATURES\.pricing \? \["Tarifas claras\.", "Sin sorpresas\."\] : \["Hablemos de", "tus envíos\."\]\}/);
  assert.match(usage, /accent=\{1\}/);
});

// Source contracts only: viewport dimensions are verified separately in a browser.
test("PageHero full height is optional and defaults to false", () => {
  assert.match(hero, /fullHeight\?:\s*boolean\s*;/);
  assert.match(hero, /const\s*\{[^}]*fullHeight\s*=\s*false[^}]*\}\s*=\s*Astro\.props/);
});

test("PageHero conditionally adds a growable full-viewport minimum without changing base styles", () => {
  const section = hero.match(/<section\b[^>]*>/)?.[0];
  assert.ok(section);
  assert.match(section, /class:list=\{\[\s*"relative overflow-hidden bg-ink pb-20 pt-40 text-cream md:pb-28 md:pt-52",\s*\{\s*"min-h-\[100svh\]":\s*fullHeight\s*\}\s*\]\}/);
  assert.equal((hero.match(/min-h-\[100svh\]/g) ?? []).length, 1);
  assert.doesNotMatch(section, /(?<![\w-])(?:h-|max-h-)|\bstyle=/);
});

test("Nosotros opts in while retaining its title and accent", () => {
  const usage = nosotros.match(/<PageHero\b[^>]*\/>/)?.[0];
  assert.ok(usage);
  assert.match(usage, /\sfullHeight(?:\s|\/|=\{true\})/);
  assert.match(usage, /eyebrow="Nosotros"/);
  assert.match(usage, /title=\{\["Tu socio", "logístico en", "Mercado Libre\."\]\}/);
  assert.match(usage, /accent=\{2\}/);
});
