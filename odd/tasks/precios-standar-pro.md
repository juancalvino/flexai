# Feature: Standard/Pro pricing & quote forms

## Goal

Show Standard/Pro prices and collective shipping only on a dedicated pricing branch.
Hide prices (show "Consultar") on `dev` and `main`, and replace the "Consultar" click
with a focused seller quote form. Enhance the driver intake form on `/contacto`.

## Branch strategy

- `dev` / `main`: `FEATURES.pricing = false`, `FEATURES.collectiveShipping = false`.
- `feat/precios-standar-pro`: both flags `true`.

## Tasks

1. Add feature flags in `src/data/features.ts`.
2. Build the focused seller quote form (`src/components/sections/SellerQuoteForm.astro`).
3. Gate prices + collective shipping and mount the quote form in `src/pages/servicios.astro`.
4. Gate prices/toggle/chips in `src/components/GeoJSONMap.astro`.
5. Enhance driver intake fields in `src/pages/contacto.astro`.
6. Verify build with flags off (no prices in `dist/`).
7. Create the pricing branch with flags on and verify build (prices present).

## Form fields

- Seller: zona, tamaño de paquete (Pequeño/Mediano/Grande, within Mercado Envíos Flex limits), paquetes/día, empresa.
- Driver: zona de origen, zona de interés, vehículo, tamaño de vehículo, disponibilidad (días + horario).

## Verification

- `npm run build` must pass on both flag states.
- `grep` of `dist/` must show no price strings when flags are off, and prices present when on.
