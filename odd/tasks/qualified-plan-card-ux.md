# Feature: Focused qualified plan card

## Objective
After valid client intake, show only the matching plan card with an “Adquirir el servicio” action that opens the prepared WhatsApp message. Remove the separate message-preview panel and internal volume thresholds from customer-facing results.

## Scope and decisions
- Standard/Pro: name, existing benefits and rates, no volume-range eyebrow.
- Premium: personalized-service card without prices or a public >=100 threshold.
- Put the same “Adquirir el servicio” primary action inside the matching card. Keep “Editar datos” secondary and preserve submitted values.
- Keep the complete generated WhatsApp message, selected service and actual submitted volume; do not display it on the page.
- Keep validation, eligibility thresholds, no auto-open on qualification, stale-link invalidation and safe text rendering.
- Shared source remains identical across pricing and OFF worktrees except existing feature flags. OFF must not expose prices.
- Preserve all existing uncommitted work, untitled.md and .codegraph/. No commits, main movement, push, installs or real messages.
- Autocomplete remains a separate unresolved request; do not implement it here.
- User added provider-neutral tracking-system wording: replace LightData brand references in UI and internal identifiers with tracking-system naming; login links say “Login”. Keep the real current URL unchanged, centralized in src/data/site.ts under a generic property. Do not replace the actual provider hostname with an invented destination.
- User then explicitly removed collective shipping from the whole site and both variants. Delete the section/promotion and now-unused collectiveShipping flag, simplify the matrix to pricing ON/OFF, preserve all other coverage and pricing behavior. This supersedes the older independent-collective-flag requirement.
- Contact landing: two buttons directly below hero copy, “Adquirir servicio” and “Trabajá con nosotros”; no form initially until a choice. Only the selected form is displayed, without a redundant internal intent question.
- Intent-specific links deep-link to /contacto?intent=services#formulario or /contacto?intent=work#formulario, reveal the matching form and scroll/focus below fixed header. Generic Contact links keep the choice screen. Pricing consultation links still go to /planes.
- Replace “Quiero enviar con FLEXAI” with “Quiero realizar envíos con FLEXAI” everywhere it appears.

## Tasks
- [x] T1 — Simplify the result card and add regression tests. Status: verified. Commit: pending authorization.
- [x] T2 — Make tracking copy/identifiers provider-neutral with Login labels; remove collective-shipping promotion and flag. Status: verified. Commit: pending authorization.
- [x] T3 — Add contact landing choices, intent-specific form deep links and updated shipping-intent copy. Status: verified. Commit: pending authorization.
- [x] T4 — Synchronize shared paths and verify desktop/mobile behavior in both variants. Status: verified; native review declined, no approval claimed. Commit: pending authorization.

## Checks
- Observe RED then GREEN for no preview/range copy and card-contained action; keep message/threshold tests passing.
- Focused tests, feature matrix, sequential build/type/diff checks.
- Browser Standard30, Pro51 and Premium100: one card, exact CTA label, no preview/threshold, correct decoded WhatsApp message, no automatic opening, edit/requalification and invalidation intact.
- Mobile and desktop screenshots captured viewport-first; full-page screenshots can alter mobile scroll.
- OFF build excludes prices; code copies byte-identical. Native review respects per-candidate consent; independent verification required if declined/unavailable.

## Evidence
- Existing result renders a priced/Premium card plus a separate actions/message panel; range exposed through selected.volume and Premium copy.
- Existing helper already includes selected plan/service and submitted volume in generated messages; preserve it unchanged.

- T1 writer observed three expected RED failures then focused32/32 GREEN. Build, sequential tsc and diff passed. Matrix delegated to independent verifier due writer's temporary-fixture restrictions. Parent read resulting single-card component. Native assessment unassessable; separate verifier required.

- T2 writer observed five expected regression failures before implementation, then focused36/36 GREEN; seven-page build, sequential tsc and diff passed. Matrix intentionally not executed by writer. Tracking provider hostname exists only in real centralized URL, Login copy and generic tracking identifiers everywhere else; collective flag removed. Native assessment unassessable, independent verifier required.

- T3 writer observed targeted RED then focused43/43 GREEN, seven-page build, sequential tsc and diff checks passed. Parent read contact landing/anchors. Direct/malformed intent gates remain empty; valid query reveals/focuses selected form; /planes presets bypass gating. No browser claim yet.

## Final verification
- Shared22 source/test paths synchronized byte-for-byte; features.ts differs only pricing=true (ON) versus false (OFF). Collective flag removed. Original dev worktree updated; main and all refs unchanged.
- Independent verifier: focused43/43 in each root, pricing ON/OFF matrix16/16, seven-page builds, sequential tsc and diff checks passed. Parent repeated both diff checks and confirmed current ON /planes and /contacto HTTP200.
- Chrome desktop1440x1000/mobile390x844:40/40 final browser scenarios passed. Contact choice gate, malformed queries, keyboard, anchor/legacy entries, focus below header, switching after success, retained values and browser history verified. Floating actions clicked normally.
- Standard30/Pro51/Premium100: one matching card, in-card exact CTA and edit action, correct full WhatsApp messages, no preview/internal thresholds, no auto-opening, preserved edit data and stale-link rejection. Premium no rates. OFF contact fallback exposes no pricing output.
- Six routes audited in both variants for generic provider wording, Login labels/destination, intent links and collective removal. Coverage53polygons, GBA1 list12 default-open, collapse/reopen/search/reset passed; no mobile overflow.
- Report and screenshots: /tmp/flexai-refined-ux.2tJfnz/report.json. Parent visually inspected on-mobile-card-30-viewport.png and on-mobile-contact-services-anchor-viewport.png. Viewport screenshots taken before full-page captures.
- Verifier initially failed with a runner error; resumed and finished. Earlier harness assertions corrected for CSS uppercase, price100 substrings, contextual links and synthetic history. One earlier chained mobile anchor sample was above header boundary; isolated fresh direct navigation passed, no stable product repro. No source fix claimed for harness issues.
- Own temporary4421/4422 servers stopped, existing ON4322 untouched. No real WhatsApp navigation/send, no dependency installs, no source changes by verifier. OFF long-running preview remains off.
- Native consent declined for candidate sha256:77d0782347edf6a52c37759ea9bd869033b482efd5554152865a66e11edf37c0; no lineage created, no approval. Assessment remained unassessable due untracked-scope support, independent verification completed.
- Active diagnostics: Astro LSP unsupported on3changed Astro files; no clean Astro claim. TypeScript data files had no errors, with two English-dictionary informational false positives for existing Spanish words. Nonblocking stale Browserslist and local analytics404/tile-abort warnings remain. Production analytics and real message delivery not verified.

## Next step
Human can inspect http://127.0.0.1:4322/contacto and /planes. Changes remain uncommitted in both worktrees; no commits/push/main integration without explicit authorization. Autocomplete is intentionally pending clarification of geographic scope (CABA/GBA versus all Argentina).
