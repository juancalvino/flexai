# Feature: Qualified pricing and shared contact intake

## Objective
Keep ON/OFF variants aligned while requiring complete client intake before displaying a suitable pricing result in the ON variant. Simplify shared contact forms and route public WhatsApp entry points through intake.

## Confirmed requirements
- User selected 1–50 packages/day Standard, 51–99 Pro, >=100 Premium.
- Premium shows no price card; advisor CTA prepares “Quiero adquirir el servicio premium, tengo un promedio de X paquetes por día”, with the submitted X >=100 and client details.
- Prices must not be visible in the coverage map before intake. This is a static-site UX qualification flow, not server-side authorization or confidential-price protection.
- ON /servicios starts with “Todo lo que tu tienda necesita para vender más”; remove public pricing cards and preceding hero. Restore historical two-color “Tarifas claras. / Sin sorpresas.” on the new qualification page.
- Shared: remove header Hablanos (desktop/mobile); public WhatsApp entry CTAs go through intent-aware intake. Final validated form/result WhatsApp actions remain allowed.
- Remove store URL, freeform message fields, vehicle size. Collect neighborhood/locality text for pickup and driver origin. Add driver brand/model/year, retain vehicle type, limit time bands to Mañana and Tarde/noche.
- Delivery-zone choices centered and full-width; retain existing coverage zones. Generate readable, structured Spanish messages with relevant fields only.
- Preserve independent pricing/collectiveShipping flags and the OFF build's exclusion of commercial price data.

## Baseline and constraints
- Pricing worktree: feat/precios-standar-pro at a36a75d; dev/main at 98eeac5, OFF. Existing branch tree difference only src/data/features.ts.
- Preserve untracked untitled.md in pricing and all unrelated original-worktree changes.
- Single writer, bounded work units. No push/PR/deploy, no real WhatsApp messages, no dependency install or review tooling repair without authorization.
- This request authorizes implementation, not new Git delivery operations. No new commits or main movement without explicit confirmation; record verified units and pending commit boundaries.

## Tasks
- [x] T1 — Update shared intake fields, validation and structured WhatsApp messages. Status: verified; commit pending authorization.
- [x] T2 — Route public contact entry points through intake, remove header CTA and public map prices. Status: verified in both variants; commit pending authorization.
- [x] T3 — Build qualified pricing page, services-first layout and eligible result/CTA. Status: verified including browser boundaries and edited-data results; commit pending authorization.
- [x] T4 — Verify both variants, synchronize shared source to OFF worktree, and record browser/native-review evidence. Status: verified; native review declined, no approval claimed; commit pending authorization.

## Acceptance and verification
- Test-first pure message/eligibility behavior and regression tests where deterministic; record observed RED then GREEN.
- Boundaries: invalid, 1, 50, 51, 99, 100, 101; no price result before complete valid intake; one Standard/Pro result or Premium advisor content, never priced cards for Premium.
- Test active-only field validation, driver/non-driver switching, brand/model/year, origin text, two time options, no removed fields/payload keys, safe text rendering, edited-data result refresh.
- Public site entry links contain no direct WhatsApp destination except generated post-validation actions; coverage renders/searches/selects normally without prices or plan toggle.
- ON/OFF and mixed flag builds remain valid; OFF HTML/JS excludes commercial price tables and qualification pricing output.
- Run focused node tests, matrix tests, build, TypeScript sequentially, git diff --check; browser desktop/mobile with WhatsApp intercepted, no sending.
- Native review under user-owned switch; unavailable review is not approval and requires independent verification. Functional checks still required.

## Evidence
- Read-only exploration completed; historical title confirmed in git history d2cd355: “Tarifas claras.” / “Sin sorpresas.”.
- T1: writer observed missing-helper/source-assertion RED then 12/12 GREEN. Independent verifier reran 12/12, six-page build, tsc and diff check successfully. Parent read back message helper and repeated diff check. Driver year is integer 1886–current year+1; whitespace-only required text rejected; inactive fields excluded. Browser checks deferred to T4. Browserslist stale-data warning only.
- T1 assessment unassessable due untracked declaration; independent verifier applied, no native approval. RDD switch currently ON.
- T2: writer observed 5/5 routing RED then GREEN; updated four-flag matrix 24/24, six-page build, tsc and diff checks passed. Parent repeated diff check and inspected price-free map payload/CTA. ON /planes destination awaits T3, so T2 is not complete. Native assessment still unassessable, independent T4 verification required. T2 size 262 diff lines across 8 files.

- T3: writer observed focused RED (4 failures) and missing-page matrix RED across all flags; GREEN 28/28 focused and 24/24 matrix. Seven-page build, tsc, diff passed. Parent repeated diff check and read the new result component/page. Native assessment unassessable; independent verification required. T3 is 444 changed lines (+348/-96) across 12 files: above 400-line review target, kept as one coherent form/result integration and explicitly surfaced.
- T4 synchronization: 19 approved source/test files copied byte-for-byte to OFF dev worktree after clean tracked-tree check; both flags retained false, refs unchanged. OFF focused28/28, seven-page build, tsc and diff checks passed. Mechanical duplication adds no new behavior/meaningful RED.
- Native inspect selected only eight new source/test files, excluding user-owned untitled.md and this tracking file. START consent was declined for exact candidate sha256:828a773d539f9c6f25dda558724be563eaed87213d5ea2909882174b24767830; no lineage created and no native approval. Assessment with declined outcome remains unassessable due untracked scope; independent verification required and running. Complete shared candidate is 19 files/999 diff lines, split logically as T1/T2/T3 (no commits authorized).
- Active diagnostics: Astro LSP unavailable for three changed Astro files. Auxiliary analyzer reports two nested-ternary warnings and five type-boundary hints in pure helpers; no error reported. These are not a claim of clean Astro diagnostics.

## Final independent verification
- Both roots: focused tests 28/28 each; seven-page builds, sequential tsc and diff checks passed. ON four-flag matrix24/24 passed.
- Chrome desktop1440x1000/mobile390x844: 34/34 scenario groups. Six public routes audited in both variants/widths; no public direct WhatsApp entry or visible rates. ON first services heading, two-color /planes title, OFF fallback verified.
- Complete intake before eligibility; invalid/whitespace/zero/fractional inputs rejected. 1/50 Standard,51/99 Pro,100/101 Premium. Premium has no rates; message includes correct volume and client details. Edit preserves fields and clears stale result/link. Untrusted text stays literal.
- Seller/driver/non-driver switching, required vehicle fields/year, locality text, both time bands and centered full-width zone choices verified. No mobile horizontal overflow. Maps retain53 polygons, search, actual SVG clicks, zone selection/reset; no commercial payload/toggle.
- Browser report/screenshots: /tmp/flexai-qualified-final.VLCzUX/report.json. Own temporary ON4422/OFF4421 preview servers stopped; original ON4322 server untouched and parent confirmed /planes HTTP200. OFF4321 remains not started by this work.
- Parent investigated misleading mobile viewport evidence: fullPage screenshot itself moved mobile scroll from553 to1990 (Premium). Separate trusted submit100→edit→51 with normal/reduced motion proved result title visible below80px header before capture; no product fix needed. Reliable before-fullpage viewport evidence: /tmp/flexai-qualified-viewport.UHRWzM/report.json and mobile-no-preference-premium100-BEFORE-fullpage.png, visually inspected by parent.
- Final comparison: all19 shared source/test files identical, feature flags and branch refs unchanged. No source mutation by verifier. No real WhatsApp navigation or message delivery attempted.
- Nonblocking limitations: stale Browserslist warning; known local analytics404/tile interruptions. Astro LSP unavailable; auxiliary warnings documented above. Native review declined for this candidate, not approved. No product failures remain in observed checks.

## Next step
Human visual comparison using existing ON preview http://127.0.0.1:4322/planes. OFF source/build ready in dev worktree; its long-running preview is currently off. All edits remain uncommitted in feat/precios-standar-pro and dev worktrees; main unchanged. Commit by recorded T1/T2/T3 work-unit boundaries only after explicit user authorization; no push/PR/deployment.
