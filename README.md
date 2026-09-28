# FLEXAI

Marketing site for FLEXAI, a Mercado Envíos Flex last-mile logistics company in AMBA.
Built with Astro 5 (static output), Tailwind CSS, GSAP + Lenis for motion and Leaflet for the coverage map.

## Commands

```sh
npm install
npm run dev       # local dev server
npm run build     # static build into dist/
npm run preview   # serve the build
```

## Project layout

| Path | Purpose |
| --- | --- |
| `src/styles/theme.css` | Brand colors as CSS variables (the only place colors are defined) |
| `src/data/site.ts` | Brand name, contact data, navigation, social links |
| `src/data/zones.ts` | Coverage zones, localities, prices and GeoJSON mapping |
| `src/data/services.ts` | Services, differentiators and process steps copy |
| `src/components/sections/` | Page sections (hero, services, gallery, CTA, …) |
| `src/scripts/motion.ts` | Scroll animations driven by `data-*` attributes |
| `scripts/build-coverage-geojson.mjs` | Regenerates `public/data/amba.geojson` |

## Creating a site for another brand

This site is meant to be reused as a base for other logistics companies.

1. **Colors**: edit `src/styles/theme.css`. Values are RGB channels (`R G B`) so Tailwind
   opacity modifiers keep working. Use `--color-on-accent` for the text color on top of the accent.
   Also update `browserThemeColor` in `src/data/site.ts` (meta tags can't read CSS variables).
2. **Brand and contact data**: edit `src/data/site.ts`.
3. **Logo**: replace the SVG in `src/components/ui/Logo.astro`. Keep `currentColor` for the main
   color and `var(--logo-accent, currentColor)` for the part that should use the accent.
   Also replace `public/favicon.svg`, `public/assets/logoFlexai.png` and `public/assets/og-image.jpg`.
4. **Fonts**: change the `@fontsource` imports in `src/layouts/Layout.astro` and `fontFamily` in
   `tailwind.config.cjs`.
5. **Coverage and prices**: edit `src/data/zones.ts`. If the zones change, update `GEOJSON_DEPARTMENTS`
   and regenerate the map data:

   ```sh
   node --experimental-strip-types scripts/build-coverage-geojson.mjs
   ```

6. **Copy and images**: section copy lives in `src/data/services.ts` and the section components.
   Image placeholders (`ImageSlot`) show a `<colocar imagen: …>` label with the prompt for the image to create.
