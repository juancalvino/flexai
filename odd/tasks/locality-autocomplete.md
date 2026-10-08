# Feature: Barrio / localidad con autocompletado de cobertura

## Objective
Reemplazar los campos de texto libre "Barrio / localidad de colecta" (`locality`) y "Barrio / localidad de origen" (`originZone`) por un combobox accesible que, a partir del 3er carácter, sugiere lugares dentro de las zonas y localidades de cobertura (mismo listado canónico que el mapa), al estilo argenprop.com.

## Decisions
- Fuente de datos única: `ZONE_LIST` (`localities` + `searchAliases`), deduplicada y ordenada, sin exponer precios al cliente.
- Estricto: el valor solo queda confirmado si es un lugar de cobertura (match exacto normalizado por mayúsculas/acentos/puntuación). Texto libre inválido se revierte al valor confirmado al salir del campo.
- Umbral de búsqueda: 3 caracteres (normalizado). Enter selecciona la opción activa o la primera coincidencia; nunca envía con texto inválido.
- Se aplica a ambos campos (`locality` y `originZone`) por coherencia.

## Tasks
- [x] T1 — Agregar `src/lib/coverage-places.ts` (lista plana de lugares + `normalizePlace`). Status: done.
- [x] T2 — Crear `src/components/LocalityAutocomplete.astro` (combobox ARIA, umbral 3 chars, sin `innerHTML`, sin importar `data/zones` al cliente). Status: done.
- [x] T3 — Reemplazar en `ContactForm.astro` los dos inputs por el componente. Status: done.
- [x] T4 — Actualizar `tests/contact-form.test.mjs` y agregar `tests/locality-autocomplete.test.mjs`. Status: done.
- [x] T5 — Build + tests + typecheck. Status: done.

## Checks
- `node --test` (7 archivos rápidos): 59/59 verde.
- `npm run build` (7 páginas) y `npx --no-install tsc --noEmit` y `git diff --check`: OK.
- El bundle cliente no filtra precios: `data-places` serializa solo `{name, zone}` (114 lugares, sin claves de precios).
- VM test ejecuta el script real: umbral <3 cierra, ≥3 abre con coincidencias, click confirma y notifica `change`, blur inválido revierte.
- Placeholder usa lugares exactos de cobertura: "Villa Devoto, Villa Luro o Quilmes". `Tortuguitas` sigue sin estar en la lista enumerable (limitación de datos, ya no se usa como ejemplo).

## Evidence
- Build dist verificado: 2 combobox (locality/originZone), script inlined, `data-places` decodifica a 114 nombres únicos sin precios.
- `tests/feature-variants.test.mjs` tiene UNA falla PRE-EXISTENTE ajena a este cambio: `assert.doesNotMatch(plans, /data-contact-intent|id="fieldset-intent"/)` falla porque `WhatsAppFloat.astro` (trabajo no commiteado de `inner-hero-contact-links`) agrega `data-contact-intent` al widget flotante renderizado en todas las páginas incluida /planes. Los otros 12 subtests de feature-variants (incluida la no-fuga de precios) pasan.

## Next step
Revisión visual del autocompletado en /contacto y /planes (desktop + mobile). Commit pendiente de autorización del usuario.

## Preview sync
- ON/pricing (4322): actualizado al rebuild anterior.
- OFF/dev (4321): sincronizado copiando `coverage-places.ts` + `LocalityAutocomplete.astro` + los 3 cambios de `ContactForm.astro`, y rebuild; verificado en /contacto (autocompletado + placeholder nuevos) y /planes sin `data-plans` (OFF correcto).
- Divergencia pre-existente ajena a este cambio: en dev el campo teléfono es `Teléfono *` (requerido) y en pricing es `Teléfono adicional / de contacto (opcional)`.
