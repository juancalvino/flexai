# Feature: Comparable pricing variants

## Objective
Keep the primary FLEXAI experience on dev/main without public prices or collective shipping, and keep feat/precios-standar-pro with both enabled. Share the same reliable map, contact form and coherent Spanish copy. Start two simultaneous local previews after validation.

## Reconciled baseline
- dev: d2cd355 added independent pricing/collectiveShipping flags (both OFF).
- feat/precios-standar-pro: 310ed05 enabled both flags; baseline branch delta is only src/data/features.ts.
- main: e834948, ancestor of dev; origin/main ee20e63 is 28 commits ahead of main and one behind dev. No remote mutation requested.
- Pending shared edits include ContactForm extraction, SellerQuoteForm deletion, contact/floating choices, copy and map guards. Preserve them; exclude pre-existing .codegraph/.
- Older tasks described an inline form/modal; these are superseded by navigation to /contacto?intent=services.
- Previous builds/curl checks are not browser proof and do not prove the latest ON state.
- User explicitly authorized local work-unit commits, main synchronization and both previews; no push/publication.

## Scope and constraints
- Primary configuration: pricing=false, collectiveShipping=false. Alternate: both true.
- Flags remain independent; verify mixed configurations too.
- No Standard/Pro cards, thresholds, public-price promises or collective promotion in the primary rendered UI.
- Consultar tarifa navigates to Contact with seller intent fixed, without another intent question. Direct /contacto retains both choices; work links select recruitment.
- Use Contratar el servicio everywhere. No contact-page phone/hours sidebar.
- Keep seller and driver intake fields and encoded WhatsApp messages; do not send real messages during tests.
- Do not attribute internal size categories to official Mercado Libre tiers.
- Diagnose the map from runtime evidence, not HTTP status alone.
- Single writer at a time; preserve existing changes and branch history. No unrelated environment repair.
- Review candidates are work-unit commit ranges, not the whole dirty tree/feature branch.

## Tasks
- [x] T1: Restore and verify coverage map behavior. Status: done. Existing map copy changes preserve OFF semantics. Runtime failure recovered by restarting Astro after explicit authorization; independent verification passed. Commit: f131128600a9b2bc41214a6dc02f991310255927.
- [x] T2: Consolidate and polish contact/quotation flow. Status: done. Shared form/intent/validation/styling verified including independent browser assertions. Commit: 1435e9fbf2c40e090cbee0ba03d6a4cb6c544d95.
- [x] T3: Make variant copy and independent flags coherent. Status: done. Independent flags/copy and price-free OFF client output verified; matrix20/20 and browser passed. Commit: 83591bf5507793c928f011bdbb3e04cb0fd1e0b4.
- [ ] T4: Synchronize branches and start verified comparison previews. Status: in_progress. Safely integrate shared commits, retain ON config on pricing branch, fast-forward main to validated OFF dev; verify both builds/browser flows and report URLs/commits. Commit: pending.

## Acceptance and checks
- Browser map: nonzero dimensions, initialized Leaflet, visible polygons, no initialization exception; search/zone/reset and responsive layout work.
- Browser contact: direct/services/work entry, native validation plus required checkbox groups, no irrelevant required fields; stub window.open and inspect encoded WhatsApp payload.
- Build/type/diff checks per work unit, plus focused regression evidence. Use meaningful RED/GREEN for deterministic behavior fixes; purely visual changes get browser inspection.
- Both variant servers stay bound to separate same-clone worktrees and output directories. Compare home, services, coverage and contact at desktop/mobile widths.
- Main/dev have flags OFF; pricing has ON. Final shared source differences limited to intended configuration.
- Native review follows user-owned RDD setting; record declined/unavailable checks truthfully and run required independent verification.

## Analysis
Read-only audit confirmed collectiveShipping is nested under pricing, ServicesSection always says Ver planes, ContactForm initializes intent twice, /nosotros contains unconditional Tarifas claras, and existing OFF client bundle contains price data. Map root cause is not yet established. No test runner currently declared. Orca is running with browser automation available.

## Verification evidence
- Initial read-only ancestry: main...origin/main = 0/28; origin/main...dev = 0/1; dev...pricing = 0/1; main is an ancestor of dev.
- Existing branch diff: only src/data/features.ts (two booleans).
- RDD mode: on (global). Earlier unrelated adapter issue is historical, not a current result.

## Next step
Create separate same-clone pricing worktree, merge shared commits retaining ON configuration, fast-forward main to OFF dev, validate both final builds/browser previews and report URLs.

## T1 evidence
- RED: Leaflet optimized dependency returned 504 Outdated Optimize Dep; map measured 610x640 but had zero polygons.
- Recovery: user chose A; stopped only confirmed Astro PID26089 and restarted managed terminal term_9796dec7-cced-4e15-a889-e8337152fd4d on 4321. No geometry fix needed.
- GREEN: unchanged initialization loads 53 polygons; all zone buttons, Quilmes/Tigre, ambiguous La Matanza, Ramos Mejia/Gonzalez Catan, unknown locality, reset geometry and mobile polygon selection passed.
- Responsive: 390x844 gives map350x440; desktop1440x1000 gives map896x640. No captured interaction errors.
- npm run build, npx --no-install tsc --noEmit and git diff --check passed. Build did not reintroduce the optimizer failure. Browserslist freshness warning nonblocking.
- Parent reran exact original browser initialization assertion: PASS.
- Pricing ON interaction verification remains T3/T4.

- T1 independent verification: build/type/diff passed; real browser 53 interactive polygons, OFF guidance, GBA1 -> Quilmes/GBA2 -> reset passed. Orca ref-click acknowledgements did not change state; DOM .click() exercised handlers. Tested dirty live checkout, not isolated commit.
- T1 native review unavailable: review-9c508578851f6438 is still reviewing, no verdict/acknowledgement. Host relay lacks configured review-reliability model. No global configuration changed. ASSESS unassessable; mandated independent verifier completed above.

## T2 evidence
- RED: services entry exposed two redundant intent choices. GREEN: seller entry locked, intent selector hidden and disabled; direct/work/malformed query handling passed.
- One effective intent now governs visibility/constraints/payload; checkbox errors are associated and focus the first invalid control.
- Seller/driver/non-driver WhatsApp payloads checked with window.open stubbed. No messages sent.
- Build (6 pages), npx --no-install tsc --noEmit and git diff --check passed. Mobile390x844 and desktop1440x1000 have no overflow.
- Parent services-intent browser spot check returned true. LSP probe unsupported (no Astro LSP server); not a clean-diagnostics claim.
- Browser checks used DOM click/requestSubmit; screenshots returned base64 only, no saved visual evidence. No automated dependency-based test harness added.

- T2 commit 1435e9f includes inherited contact/floating refactor (684 diff lines), kept as one behavior area with its docs. Services-page migration/deleted legacy form remains T3.
- T2 native review unavailable (review-413f3847284f72e5, no reviewer model); ASSESS unassessable, independent verifier applied. No native verdict/approval.
- Independent T2 static build/type/diff passed. Old test tab disappeared, then proxy failed because dev server had exited; confirmed no listener on4321, recreated managed dev terminal term_748a7acb-9699-4784-af1e-f6befc2aa5c7. Browser retest then passed all scoped modes, invalid-driver isolation, delivery-error/focus and valid seller payload. No real messages, DOM interactions only.

## T3 evidence
- RED observed: OFF Ver planes/Tarifas claras, nested collective gating, trailing CTA and downloadable price table. GREEN:20/20 tests across all four flags using isolated builds.
- Map serializes public data at build time; OFF has no commercial prices/plans, ON preserves all eight amounts. Geometry/data unchanged. Legacy seller form deletion and services link migration consolidated.
- Tests create isolated fixtures, preserve active flags, and clean only own fixtures by default; explicit FLEXAI_KEEP_VARIANT_FIXTURES=1 retains them. Independent default run20/20 passed and all4 new temp trees disappeared;24 pre-existing fixtures preserved.
- Writer isolated OFF/ON browser checks passed polygons, zones/search/exceptions/reset and all ON prices/toggle. Actual dev had recurring Leaflet504; parent closed only owned dev terminal and started production preview on4321, terminal term_bb74af70-ae7d-406c-bb4a-bb90ef3054b9. Actual-hostname map then passed53 polygons, no prices, no optimizer URLs.
- Independent build6pages/type/diff passed. Verifier initially ran tsc concurrently with build and encountered generated-file race; sequential tsc passed. Future checks must be sequential.
- Review workload: inherited migration/deletion plus matrix test totals480 source/test diff lines, slightly above400, one bounded variant behavior unit; no unrelated expansion.

- T3 commit83591bf finalized the variant unit. Native review unavailable (review-7915c4b2cc98b872), no configured reviewer model, no approval. ASSESS unassessable; independent20/20/build/type/browser verification already passed same source candidate. Parent browser spot check confirmed53 polygons, plans:null, noPrices:true.
