# Feature: Full-height inner heroes and consistent contact entry

## Objective
Keep the initial /nosotros and /planes viewport blue without the next cream section peeking through, and make floating service/work choices behave exactly like the contact hero choices.

## Scope
- PageHero has opt-in fullHeight=false and growable min-height100svh; /nosotros and /planes opt in, other routes unchanged. Keep existing copy/colors/padding and allow content growth on short screens.
- Floating choices retain /contacto?intent=services#formulario and work equivalent. On Contact, share the hero choice handler so choosing even the already-active intent reveals/refocuses/rescrolls the correct heading. Preserve data, popup dismissal, modified clicks and cross-page navigation.
- Contact heading remains approximately96px below viewport top (header80px+16px). No WhatsApp navigation/sending during checks.
- Both variants share sources except pricing flag. Preserve prior uncommitted work and user-owned untitled.md/.codegraph/. No push/main changes/install.
- User explicitly authorized mobile audit/fixes and local integration: no-plans in dev, plans on new feat/with-plans based on final dev. Necessary local work-unit commits/branch operations are now authorized; preserve original pricing branch until verified. This supersedes earlier no-commit constraints for current delivery only.

## Tasks
- [x] T1 — Finish viewport-height heroes and shared floating-contact intent behavior. Status: verified and committed. Work-unit commit: 69f23aeac87b8b329940ec738b262c82918b27db.
- [x] T2 — Synchronize and audit desktop/mobile behavior in both variants; fix evidenced defects. Status: verified and committed. Work-unit commit: 69f23aeac87b8b329940ec738b262c82918b27db.
- [x] T3 — Integrate shared work into dev without prices and create feat/with-plans from dev with plans enabled. Status: independently verified and committed. Dev configuration: 0f30301160642bf4fdf1e6d4605d44f051d59c67. Plans activation: 4867ec9a7d72bdb0a2491dae70c70c26696893a8.

## Checks
- Deterministic RED/GREEN for opt-in/default hero contracts and shared contact-choice wiring.
- Build, focused tests, sequential type/diff checks, pricing matrix where applicable.
- Hero bottom/next-section top >= viewport height on desktop1440x1000,1464x960,mobile390x844 and short1366x600; text remains readable and next content accessible by scrolling.
- Floating service/work choices from other pages, direct/gated Contact, already-selected same intent, after success, and while switching intent match hero choice behavior; popup closes and heading focus/geometry correct.
- Viewport screenshots before full-page captures. Preserve final message/plan behavior and no public provider or collective branding.

## Evidence
- Nosotros writer: source-test RED3 then GREEN3, build/types/diff passed, files synced OFF. Original independent verifier reports focused48/48 each, matrix16/16, both builds/types/diff passed; browser geometry correct in8combinations but initial harness assertions incorrectly expected mixed-case innerText despite uppercaseCSS. Temp-only assertion correction authorized; final report pending.
- Parent visually inspected initial /nosotros desktop screenshot: full blue viewport, preserved title.
- Existing floating hrefs already match hero hrefs, but floating options lack data-contact-intent, so same-page native fragment navigation can bypass heading alignment/shared state handler.

- Original Nosotros verification finished: corrected28/28 browser checks,48focused each and16matrix, both build/types/diff passed. Height1000/960/844 for matchingviewports; short600viewport grows to679.95 without crop. Artifacts /tmp/flexai-nosotros-hero.wQ0u77/. Current Planes baseline hero674.47desktop and585.13ON/511.72OFF mobile, not yet fullheight. /contacto heading remains96px. Own4421/4422 shut down.

- Remaining T1 writer:52focused tests pass after49pass/3expectedRED failures. Planes opts fullHeight and floating anchors add matching data-contact-intent; no extra popup listener needed because focusout dismisses it. Seven-page build, sequential types/diff passed. Final browser pending.
- Local Git baseline:dev/main98eeac5, pricinga36a75d. feat/with-plans does not exist. Original dev worktree contains our known shared pending edits and unrelated .codegraph; pricing contains unrelated untitled.md. Orca CLI guide read; branch operations can use ordinary Git without new worktree creation.

## Historical blocker: concurrent external mutation (authorization resolved)
- During mobile audit, three ON files changed outside this session's completed writers: src/components/ContactForm.astro, src/lib/contact-message.ts and tests/contact-message.test.mjs. Phone is now optional, renamed additional/contact phone, blank phone omitted from messages; OFF still requires phone. No source overwrite/revert/staging occurred.
- Audit source snapshot drift invalidates final parity/current-candidate verification. Pre-mutation focused52/52 both and builds/types/diff passed; first browser harness223cases had78pass/145suspected harness failures (fieldset disabled API, exact plan labels and pre-load sampling), not established product failures. Corrected temp harness prepared; own4421/4422 stopped, existing4322healthy.
- Mobile screenshot review found visible home ImageSlot prompt overlapping eyebrow at320px, likely preexisting placeholder design. Preserve requirement to show placeholders; assess scoped layout fix only after source ownership resolved.
- Verifier finished partial/blocked without new source/build/browser operations. Need user confirmation of optional-phone inclusion and coordination/freeze before sync and rerun. No commits or branch integration yet.
- Final verifier disclosed matrix failure:12pass/4fail (including2parent tests). tests/feature-variants.test.mjs:114 forbids data-contact-intent anywhere on /planes, now invalid because floating links intentionally use it. Narrow that assertion to intake, observe RED/GREEN, then rerun matrix. This is a confirmed test defect, not a product failure; delivery remains blocked until fixed/verified.
- Corrected browser script /tmp/flexai-final-mobile-audit.mjs is preserved but not rerun. Actual78passes include60layout/8menus/10map interactions;145remaining cases unverified due harness issues. Matrix log /tmp/flexai-final-mobile-audit.27gFuB/on-check-1.log.

## Current authorization and execution plan
- User confirmed optional phone and explicitly requested integrating all current work into dev; versions must be almost identical except price-related buttons/cards/value copy. Local commits and branch integration authorized; no push/main change.
- Read-only reconciliation found coverage autocomplete already implemented and current scope includes it. Other session confirmed its writers are stopped and will remain frozen until integration. Preserve all current files and stop if source hashes drift during verification. CV behavior reported in memory was not found in source and is not claimed as delivered.
- T2 now includes: scope the erroneous plans matrix assertion to intake; unify Servicios on the existing ON service-first layout in both variants; protect optional-phone markup; fix evidenced 320px home placeholder/eyebrow overlap without hiding placeholder text; preserve/autoverify autocomplete. Synchronize agreed shared source/tests to OFF, with pricing flag the only active-code difference.
- Run all focused tests including locality autocomplete, matrix, build/types/diff sequentially; rerun corrected browser audit with valid canonical locality selection and add autocomplete interaction coverage. Preserve tests' actual RED/GREEN evidence.
- Then close T1/T2 with verified local work-unit commits and complete T3: dev OFF, feat/with-plans created from final dev and enabled by one flag. Verify ancestry/content and preserve original pricing branch/user files.

## Final verification
- T2 writer observed focused RED31pass/2fail for shared Servicios and mobile clearance, then GREEN33/33. Optional-phone and autocomplete regressions retained. Corrected global plans intent assertion by checking intake only and preserving floating hooks.
- Both roots independently passed62/62 focused tests, build, sequential TypeScript check and diff check. Pricing matrix16/16 passed. All41 sourcefiles/7testfiles identical except pricingboolean; four taskdocs synchronized. Sourcehashes and Gitstatus unchanged during audit.
- Chrome audit verified293distinct cases over303executions: main282/283, oneOFFdesktopmap7secondnavigationtimeout then20/20retry/additionaldriverchecks. Widths320/360/390/430/1440 plus1366x600. Heroes,96pxcontactalignment, intentreselection/retention, optionalphone allroles, bothautocompletecontrols (keyboard/tap/blur/capturesubmit), planboundaries1/30/50/51/99/100,Premiumnorates,OFFpriceexclusion,menu/map/Login/servicesparity allpassed.
- Home320placeholder/eyebrow overlap fixed without hiding placeholders. Existing preview4321/4322 healthy/untouched; owned4421/4422 stopped. No WhatsAppsent/opened, dependenciesinstalled, or productconsoleerrors.
- Evidence:/tmp/flexai-final-mobile-audit.uaMGOo/ and /tmp/flexai-final-mobile-audit.rZBmQE/. Resumableharness:/tmp/flexai-final-mobile-audit.mjs. Safari/physicaldevices nottested; imagery remains intentionallyplaceholder. Modifiedclick checked bysource/controller tests, notliveexternalnavigation.
- NativeASSESS unavailable dueundeclareduntrackedfiles; independentverification performed underhighriskfallback. Nativepreflightstillpending; no nativeapprovalclaimed.

## Next step
Local delivery is complete. Push, PR, merge to main and imagery completion remain human decisions; none were performed.

## Delivery evidence
- Shared implementation: 69f23aeac87b8b329940ec738b262c82918b27db. Recovery branch backup/verified-pricing-before-with-plans remains at ef9f2b63fcd618cc0d72dba6750359c2d0cf3433.
- Dev was fast-forwarded to the verified shared work, then pricing disabled in 0f30301160642bf4fdf1e6d4605d44f051d59c67. Plans branch was created directly from that commit and enabled in 4867ec9a7d72bdb0a2491dae70c70c26696893a8. This passive completion record is merged forward afterward, without application changes.
- Independent final verification reran 62/62 focused tests in each root, confirmed all 48 source/test files match the verified work unit (OFF differs only by the pricing boolean), and verified clean tracked worktrees/indexes. The entire branch-tree difference is that one boolean. Existing /servicios and /planes previews on4321/OFF and4322/ON return200 and expose the correct quote/form mode.
- Main remains98eeac5b1d30afea9a1d941f8a44453e81d45538; old feat/precios-standar-pro remainsa36a75df4055410ec7bfeadf3cef5ebc15c16499. OFF's unrelated .codegraph stays untracked and untouched. Scoped pre-integration OFF recovery stash77b2353a509aad454bcf0d1aefeae82ed77ed269 retained; do not reapply blindly because its application changes are integrated.
- Human declined native review separately for the shared candidate, OFF flag, ON flag and the explicit post-commit reminder targetsha256:bfbf618f8909bf1a9406e28f94a0ba8a5ae1d062669e7ea63d9a8a40edb2b45b. No lineage or native approval was created. Independent verification is the evidence; review decline did not authorize delivery (the user's explicit local-integration instruction did).
- Final limitations: Chrome emulation, not Safari or physical devices; image placeholders intentional. One initial browser timeout passed on bounded retry. No outstanding confirmed defect in the audited scope.
