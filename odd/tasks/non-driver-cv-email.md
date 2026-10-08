# Feature: Non-driver CV email handoff

## Objective
For Contact > Trabajá con nosotros > No, otro puesto, offer a truthful “Enviar CV” action that prepares an email to FLEXAI. The applicant attaches the CV manually in their mail client; the static site never uploads or sends files.

## Scope
- Preserve the seller and driver WhatsApp paths, all qualification and validation behavior, form state retention, and the plans price flag.
- Only non-driver work intent uses the existing `SITE.email`, with a prepared subject and body containing name, a required non-driver position field, and optional additional phone; it must not include hidden seller/driver data. The CV is not automatically attached. The position field is visible/required only for non-drivers and retains its value when the intent changes.
- Show the email icon and “Enviar CV” only for this choice; restore WhatsApp button for other paths. On successful handoff, show truthful email-specific instructions and a `mailto:` fallback without changing other success copy.
- Apply the exact same source/tests to dev without pricing and feat/with-plans with pricing. Preserve main, the old pricing branch, the existing backup/stash and unrelated `.codegraph/`; no push or real email/WhatsApp sends.

## Tasks
- [ ] T1 — Add test-first non-driver mailto handoff and accessible branch-specific button/confirmation. Status: in_progress. Work-unit commit: pending.
- [ ] T2 — Independently verify mailto/WhatsApp flows, then integrate shared work into dev and feat/with-plans with only the pricing flag different. Status: pending. Work-unit/merge commit: pending.

## Checks
- RED before implementation for email body/URL/branch state where runnable; GREEN with focused tests.
- Builds, TypeScript, pricing matrix, diff checks and source parity; browser tests for non-driver mailto and fallback, driver/seller WhatsApp, repeated intent switching and mobile.
- Intercept mailto and WhatsApp; do not send messages or open a real mail client. Inspect focus, copy and dynamic button states.

## Evidence
- User selected `mailto:` over WhatsApp-only or file upload. The chosen option explicitly includes name/position/phone in the email; the new position field is required only for non-drivers. `SITE.email` is `flexai.logistica@gmail.com`.
- Branch `feat/non-driver-cv-email` created from dev `7a50a21a99e7736c628487f8070df03884c29c24` before the first source write. The original plans branch was `55f6282b19b15ad2e81175de717cc546e63dc74f`; main remains `98eeac5b1d30afea9a1d941f8a44453e81d45538`.
- Writer observed RED6 failed/30 passed then GREEN36/36 focused. Independent verifier passed68/68 focused,16/16 OFF/ON matrix, seven-page build, TypeScript and diff checks. Chrome390x844/1440x1000:73/73 assertions, no page errors or real email/WhatsApp sends. Source hashes/staging unchanged. Evidence: `/var/folders/2g/qj004bhs6ld174gdqgg2yrl00000gn/T/flexai-cv-verify-zmnvhdvi`.
- Native ordinary review was offered for the exact five-path candidate, but human declined this candidate; no lineage or approval was created. Independent verification remains the evidence. Existing ON preview4322 was unavailable (`ERR_CONNECTION_REFUSED`); an isolated ON preview after integration is required. Browser automation verifies URL/fallback, not an OS mail-client attachment/send. Build emitted only the preexisting stale caniuse-lite warning.
