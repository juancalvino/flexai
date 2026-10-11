# Feature: Non-driver CV email handoff

## Objective
For Contact > Trabajá con nosotros > No, otro puesto, offer a truthful “Enviar CV” action that prepares an email to FLEXAI. The applicant attaches the CV manually in their mail client; the static site never uploads or sends files.

## Scope
- Preserve the seller and driver WhatsApp paths, all qualification and validation behavior, form state retention, and the plans price flag.
- Only non-driver work intent uses the existing `SITE.email`, with a prepared subject and body containing name, a required non-driver position field, and optional additional phone; it must not include hidden seller/driver data. The CV is not automatically attached. The position field is visible/required only for non-drivers and retains its value when the intent changes.
- Show the email icon and “Enviar CV” only for this choice; restore WhatsApp button for other paths. On successful handoff, show truthful email-specific instructions and a `mailto:` fallback without changing other success copy.
- Apply the exact same source/tests to dev without pricing and feat/with-plans with pricing. Preserve main, the old pricing branch, the existing backup/stash and unrelated `.codegraph/`; no push or real email/WhatsApp sends.

## Tasks
- [x] T1 — Add test-first non-driver mailto handoff and accessible branch-specific button/confirmation. Status: verified and committed. Work-unit commit: `0bb992f685f9cb6ec19b15654066af292fa07456`.
- [x] T2 — Independently verify mailto/WhatsApp flows, then integrate shared work into dev and feat/with-plans with only the pricing flag different. Status: verified and integrated. Dev work unit: `2b4bef334c654d98ec729e829a45b03be714a7ef`; plans merge: `1f9e3e0dc86f134b397db6febc04a734ae00c50c`. Passive closure record follows on both branches.

## Checks
- RED before implementation for email body/URL/branch state where runnable; GREEN with focused tests.
- Builds, TypeScript, pricing matrix, diff checks and source parity; browser tests for non-driver mailto and fallback, driver/seller WhatsApp, repeated intent switching and mobile.
- Intercept mailto and WhatsApp; do not send messages or open a real mail client. Inspect focus, copy and dynamic button states.

## Evidence
- User selected `mailto:` over WhatsApp-only or file upload. The chosen option explicitly includes name/position/phone in the email; the new position field is required only for non-drivers. `SITE.email` is `flexai.logistica@gmail.com`.
- Branch `feat/non-driver-cv-email` created from dev `7a50a21a99e7736c628487f8070df03884c29c24` before the first source write. The original plans branch was `55f6282b19b15ad2e81175de717cc546e63dc74f`; main remains `98eeac5b1d30afea9a1d941f8a44453e81d45538`.
- Writer observed RED6 failed/30 passed then GREEN36/36 focused. Independent verifier passed68/68 focused,16/16 OFF/ON matrix, seven-page build, TypeScript and diff checks. Chrome390x844/1440x1000:73/73 assertions, no page errors or real email/WhatsApp sends. Source hashes/staging unchanged. Evidence: `/var/folders/2g/qj004bhs6ld174gdqgg2yrl00000gn/T/flexai-cv-verify-zmnvhdvi`.
- Native ordinary review was offered for the exact five-path OFF candidate and later for the committed five-path ON slice, but human declined each candidate; no lineage or approval was created. Independent verification remains the evidence. A stale consent binding on ON was reconciled with one fresh inspect/start before the final declined result; it created no lineage.
- Shared work was fast-forwarded into `dev` at `2b4bef334c654d98ec729e829a45b03be714a7ef` and merged into `feat/with-plans` at `1f9e3e0dc86f134b397db6febc04a734ae00c50c`. Post-merge independent verification passed 152/152 Node tests (68 per root +16 matrix), both builds/TypeScript/diff checks, and 115 Chrome assertions on the isolated ON preview for CV and pricing boundaries1/51/100 at mobile/desktop sizes. Source hashes and branch refs stayed stable; only `src/data/features.ts` differs between branches. Artifacts: `/var/folders/2g/qj004bhs6ld174gdqgg2yrl00000gn/T/flexai-final-verify-fc_e5dny`. Owned preview4422 stopped; existing preview4322 had been unavailable and was not touched.
- Browser automation verifies draft URL/fallback, not a physical OS mail-client attachment/send; no real email or WhatsApp was sent. Build emitted only the preexisting stale caniuse-lite warning. Safari/physical-device testing and final imagery remain outside this scope. No push/PR/main change; OFF `.codegraph/`, original pricing branch, backup and recovery stash preserved. Next step is user-owned publication/assets decision, not more local feature work.
