import { ZONE_LIST } from "../data/zones.ts";

export interface CoveragePlace {
  /** Display name, e.g. "Villa Devoto" or "Ramos Mejía". */
  name: string;
  /** Zone display name, e.g. "CABA" or "GBA 1". */
  zone: string;
}

/** Case-, accent- and punctuation-insensitive key used for matching ("Ramos Mejia" === "Ramos Mejía", "JOSE C PAZ" === "José C. Paz"). */
export function normalizePlace(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Every searchable coverage place: CABA barrios, partidos and the extra towns in
 * `searchAliases`. Mirrors the map's locality list so the intake and the map agree.
 * Deduplicated by normalized name and sorted alphabetically (Spanish collation).
 */
export const COVERAGE_PLACES: CoveragePlace[] = buildCoveragePlaces();

function buildCoveragePlaces(): CoveragePlace[] {
  const seen = new Set<string>();
  const places: CoveragePlace[] = [];
  for (const zone of ZONE_LIST) {
    const names = [
      ...(zone.id === "CABA" ? ["CABA"] : zone.localities),
      ...(zone.searchAliases ?? []).flatMap((alias) => alias.names),
    ];
    for (const name of names) {
      const key = normalizePlace(name);
      if (seen.has(key)) continue;
      seen.add(key);
      places.push({ name, zone: zone.name });
    }
  }
  return places.sort((a, b) => a.name.localeCompare(b.name, "es"));
}
