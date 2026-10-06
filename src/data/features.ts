// Feature flags toggled per branch.
// Keep both `false` on `dev` and `main`; set them to `true` only on the
// dedicated pricing branch (feat/precios-standar-pro).

export const FEATURES: { pricing: boolean; collectiveShipping: boolean } = {
  /** Show Standard/Pro prices per zone in /servicios and the coverage map. */
  pricing: true,
  /** Show the collective shipping call-to-action. */
  collectiveShipping: true,
};
