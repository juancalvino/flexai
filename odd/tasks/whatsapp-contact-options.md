# WhatsApp contact options

## Objective
Offer two contact paths, acquiring FLEXAI services or working with FLEXAI, in the Contact page and the floating WhatsApp button. Both lead to intention-specific prefilled WhatsApp messages. Applicants who identify as drivers must provide residential zone, vehicle, and availability before opening WhatsApp.

## Scope and constraints
- Update `src/pages/contacto.astro` and `src/components/ui/WhatsAppFloat.astro` only for source behavior.
- Floating button opens an accessible choice popup; each option navigates to `/contacto` with the corresponding intention preselected, sharing one validated form rather than duplicating it.
- Keep existing service-specific WhatsApp CTAs untouched and use the existing business number.
- No test runner exists; verify via type check, build, and manual browser interaction if available.
- Do not commit without explicit user request under the safety rule; record commit evidence as pending.

## Tasks
- [x] T1: Split Contact into service and work flows, conditionally require driver details, and compose distinct WhatsApp messages. Check: intent switching, conditional validity, preselection, and type/build checks. Status: done (static logic readback; interactive browser test unavailable, tracked in T4). Commit: pending authorization.
- [x] T2: Replace floating direct link with accessible two-option popup that routes to Contact with the chosen intent. Check: open/close, keyboard/outside handling, correct target links, and type/build checks. Status: done (structural readback; interactive browser test unavailable, tracked in T4). Commit: pending authorization.
- [x] T3: Verify the combined user flows and document any unavailable checks. Check: type/build, browser flow where available, git diff sanity. Status: done for available checks; interactive browser test unavailable (no installed harness). Commit: pending authorization.
- [ ] T4: Resolve external native-review tooling blocker or obtain an explicit decision to leave this candidate unreviewed; manually exercise browser interactions if a browser harness becomes available. Status: blocked on missing Pi MCP adapter. Commit: pending authorization.

## Acceptance criteria
- Contact shows exactly two primary intentions: services and work.
- Services retain existing seller fields and a service-specific WhatsApp message.
- Work applicants can state whether they are drivers; driver applicants cannot proceed without residential zone, vehicle, and availability. The work message includes these fields when applicable.
- Floating WhatsApp button opens the two choices, selecting one preselects the same Contact form path; the final WhatsApp message matches the selected path.

## Progress and evidence
- Explored existing single-purpose Contact form, WhatsApp helper, and floating link. Existing untracked `.codegraph/` is outside this change and left untouched.
- T1: `src/pages/contacto.astro` now routes services/work through disabled and hidden fieldsets, requires driver-specific fields only for drivers, preselects by query string, and builds separate messages. `npx tsc --noEmit` and `npm run build` passed twice. Browser interaction unavailable; tracked in T4.
- T2: `src/components/ui/WhatsAppFloat.astro` opens a non-modal, keyboard-dismissible two-choice popup linking to the preselected form; scroll/off-focus/outside dismissals implemented. `npx tsc --noEmit` and `npm run build` passed twice. Browser interaction unavailable; tracked in T4.
- T3: A verifier independently confirmed `git diff --check`, `npx tsc --noEmit`, and `npm run build` pass on the final candidate, including the HTML-safe phone pattern; built markup and message branches were read back. Browser interaction was unavailable without a browser harness; no actual WhatsApp message was sent.
- Native review: inspect required a deliberate untracked selection. Selected only this task file, excluding `.codegraph/`. Provider then stopped with `managed_assets_outdated`; exact offered `gentle-ai sync --agent pi` failed because the globally declared `pi-mcp-adapter/index.ts` is absent. A read-only tooling diagnosis confirmed no repository changes from sync. Native review was not started. `assess` returned unassessable/unavailable and required an independent verifier; that verifier passed its available checks.
- Historical next step above is superseded by the consolidation below; no global tooling repair is part of FLEXAI work.

## Consolidation into comparable variants
- Owner session: sin_precios; previous writer confirmed no active edits or commits.
- User explicitly authorized local commits and dev/main OFF versus pricing-branch ON synchronization; no push/publication.
- Shared form now lives in `src/components/ContactForm.astro`. Quote entry locks services without the intent chooser; direct Contact retains both choices. Label: Contratar el servicio.
- Seller/driver/non-driver validation and encoded WhatsApp payloads passed in Orca browser with `window.open` stubbed; no real messages sent. Responsive DOM/layout checks and build/type/diff checks passed.
- Interaction tests used DOM click/requestSubmit; trusted pointer interaction remains a limitation.
- Current native reviewer configuration lacks a model, rather than the historical adapter failure. No review approval claimed; independent verification tracked in `odd/tasks/precios-standar-pro.md`.
