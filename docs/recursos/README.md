# Recursos

Marketing and sales material: social posts, client proposals and similar assets. Not part of the site build: nothing under `docs/` is published, and the site must not import from here.

```
recursos/
├── propuestas/       Client proposals (HTML source + PDF). See propuestas/README.md.
└── publicaciones/    Social posts (Instagram / WhatsApp), one folder per campaign: YYYY-MM-<topic>/
```

## Publicaciones

Each campaign folder holds the final PNGs (1080 × 1350, Instagram 4:5) and the HTML they were rendered from, with the images they use next to them.

| Folder | Content |
| --- | --- |
| `publicaciones/2026-10-cambio-precios/` | New Flex rates from 01-10-2026 (CABA $3.600, GBA 1 $4.500, GBA 2 $5.300, GBA 3 $7.300). Three layouts: `lista-` (price list), plain (2×2 price grid) and `ml-integrado-` (grid + Mercado Libre card). No phone, web or email on purpose. |

Re-render a post after editing its HTML:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1080,1350 --virtual-time-budget=6000 \
  --screenshot="$PWD/<post>.png" "file://$PWD/<post>.html"
```

Per-client special rates are never stored here.
