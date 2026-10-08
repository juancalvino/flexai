// Feature flag toggled per branch.
// Keep `false` on `dev` and `main`; set to `true` only on the
// dedicated pricing branch (feat/with-plans).

export const FEATURES: { pricing: boolean } = {
  /** Show qualified plan results and rates on /planes after valid intake. */
  pricing: true,
};
