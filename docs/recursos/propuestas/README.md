# Commercial proposals

Client-facing proposals. Not part of the site build (kept outside `public/` on purpose: rates are not published on the web).

| File | Description |
| --- | --- |
| `flexai-propuesta-comercial.html` | Source. A4 document (4 pages): cover, services, coverage, rates. |
| `flexai-propuesta-comercial.pdf` | Generated from the HTML. Do not edit by hand. |
| `cover-night-ride.jpg` | Cover background, compressed copy of `src/images/hero-night-ride.png`. Must sit next to the HTML. |

## Data sources

- Copy, services and contact data: `src/data/services.ts`, `src/data/site.ts`.
- Coverage zones and localities: `src/data/zones.ts`.
- Rates: same as Logística Soluciones Flex (CABA / Zona 1 / Zona 2 / Zona 3 by daily order volume). They are NOT the `prices` in `src/data/zones.ts`.

If any of those change, update the HTML by hand and regenerate the PDF.

## Regenerate the PDF

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --no-pdf-header-footer --virtual-time-budget=5000 \
  --print-to-pdf="$PWD/docs/recursos/propuestas/flexai-propuesta-comercial.pdf" \
  "file://$PWD/docs/recursos/propuestas/flexai-propuesta-comercial.html"
```

Or open the HTML in Chrome → Print → Save as PDF, margins "None", "Background graphics" on.
