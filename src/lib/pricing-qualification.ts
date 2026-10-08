/** Premium is adviser-led, never a key in the numeric zone price table. */
export type QualifiedPlan = "standard" | "pro" | "premium";

/** Client-side UX eligibility only: this is not authorization to access prices. */
export function eligiblePlan(value: unknown): QualifiedPlan | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !/^\d+$/.test(value.trim())) return null;
  const volume = Number(value);
  if (!Number.isSafeInteger(volume) || volume < 1) return null;
  if (volume <= 50) return "standard";
  if (volume <= 99) return "pro";
  return "premium";
}

export function qualificationHeading(value: unknown): string | null {
  const plan = eligiblePlan(value);
  if (!plan) return null;
  const volume = Number(value);
  const request = plan === "premium"
    ? "adquirir el servicio premium"
    : `contratar el plan ${plan === "standard" ? "Standard Seller" : "Pro Seller"}`;
  return `Hola FLEXAI, quiero ${request}, tengo un promedio de ${volume} paquetes por día.`;
}
