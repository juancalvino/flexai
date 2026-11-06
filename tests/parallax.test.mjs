import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../src/styles/global.css", import.meta.url), "utf8");
const motion = await readFile(new URL("../src/scripts/motion.ts", import.meta.url), "utf8");
const homeHero = await readFile(new URL("../src/components/sections/HeroSection.astro", import.meta.url), "utf8");

// Source contracts only; scroll behavior is verified separately in a browser.
test("parallax is a scroll-driven CSS animation gated by support and motion preference", () => {
  const block = css.match(/@media \(prefers-reduced-motion: no-preference\) \{\s*@supports \(animation-timeline: view\(\)\) \{([\s\S]*?)\n  \}\n\}/)?.[1] ?? "";
  assert.match(block, /:has\(> \[data-parallax\]\) \{\s*view-timeline: --parallax block;\s*\}/);
  const rule = block.match(/\[data-parallax\] \{([^}]*)\}/)?.[1] ?? "";
  // Longhands only: the minifier folds a shorthand plus animation-timeline into one invalid
  // shorthand. Firefox needs a non-zero duration.
  assert.doesNotMatch(rule, /animation:/);
  assert.match(rule, /animation-name: parallax;\s*animation-duration: 1ms;\s*animation-timing-function: linear;\s*animation-fill-mode: both;\s*animation-timeline: --parallax;/);
  assert.match(css, /@keyframes parallax \{\s*from \{ translate: 0 calc\(var\(--parallax-amount, 15%\) \/ -2\); \}\s*to \{ translate: 0 calc\(var\(--parallax-amount, 15%\) \/ 2\); \}\s*\}/);
});

test("motion script no longer drives parallax while keeping the other effects", () => {
  assert.doesNotMatch(motion, /parallax/i);
  for (const init of ["initSmoothScroll", "initReveals", "initLines", "initCounters", "initStackedCards"]) {
    assert.match(motion, new RegExp(`\\b${init}\\(\\);`), init);
  }
});

test("home hero clips without creating a scroll container and sets its parallax amount", () => {
  const section = homeHero.match(/<section\b[^>]*>/)?.[0] ?? "";
  assert.match(section, /\boverflow-clip\b/);
  assert.doesNotMatch(section, /\boverflow-hidden\b/);
  const image = homeHero.match(/<ImageSlot\b[\s\S]*?\/>/)?.[0] ?? "";
  assert.match(image, /\sdata-parallax\s/);
  assert.match(image, /style="--parallax-amount: 12%"/);
  assert.match(image, /class="h-\[115%\] w-full pt-20"/);
});
