// Zones, localities and prices. Used by the map, /servicios and /cobertura.

export type ZoneId = "CABA" | "GBA1" | "GBA2" | "GBA3";
export type PlanId = "standard" | "pro";

export interface Zone {
  id: ZoneId;
  name: string;
  description: string;
  localities: string[];
  /** Extra places (neighborhoods, towns) the map search resolves to this zone; `within` is the map polygon to focus. */
  searchAliases?: { within?: string; names: string[] }[];
  prices: Record<PlanId, number>;
  /** Theme token in src/styles/theme.css (--color-<token>). */
  colorToken: string;
  /** CSS color for inline styles. */
  color: string;
}

const themeColor = (token: string) => `rgb(var(--color-${token}))`;

export const ZONES: Record<ZoneId, Zone> = {
  CABA: {
    id: "CABA",
    name: "CABA",
    description: "Todas las comunas de la Ciudad",
    localities: ["Todas las comunas"],
    searchAliases: [
      {
        names: [
          "Agronomía", "Almagro", "Balvanera", "Barracas", "Belgrano", "Boedo", "Caballito", "Chacarita",
          "Coghlan", "Colegiales", "Constitución", "Flores", "Floresta", "La Boca", "La Paternal", "Liniers",
          "Mataderos", "Monte Castro", "Monserrat", "Nueva Pompeya", "Núñez", "Palermo", "Parque Avellaneda",
          "Parque Chacabuco", "Parque Chas", "Parque Patricios", "Puerto Madero", "Recoleta", "Retiro",
          "Saavedra", "San Cristóbal", "San Nicolás", "San Telmo", "Vélez Sarsfield", "Versalles", "Villa Crespo",
          "Villa del Parque", "Villa Devoto", "Villa General Mitre", "Villa Lugano", "Villa Luro", "Villa Ortúzar",
          "Villa Pueyrredón", "Villa Real", "Villa Riachuelo", "Villa Santa Rita", "Villa Soldati", "Villa Urquiza",
          "Capital Federal",
        ],
      },
    ],
    prices: { standard: 3100, pro: 2800 },
    colorToken: "zone-1",
    color: themeColor("zone-1"),
  },
  GBA1: {
    id: "GBA1",
    name: "GBA 1",
    description: "Primer cordón del conurbano",
    localities: [
      "Vicente López", "San Isidro", "San Fernando", "San Martín",
      "Tres de Febrero", "Morón", "Hurlingham", "Ituzaingó",
      "La Matanza Norte", "Lomas de Zamora", "Lanús", "Avellaneda",
    ],
    // La Matanza inside Camino de Cintura (INDEC "La Matanza 1").
    searchAliases: [
      {
        within: "La Matanza Norte",
        names: [
          "Aldo Bonzi", "La Tablada", "Lomas del Mirador", "Ramos Mejía", "San Justo", "Tapiales",
          "Villa Madero", "Villa Luzuriaga", "Matanza 1",
        ],
      },
    ],
    prices: { standard: 4000, pro: 3700 },
    colorToken: "zone-2",
    color: themeColor("zone-2"),
  },
  GBA2: {
    id: "GBA2",
    name: "GBA 2",
    description: "Segundo cordón del conurbano",
    localities: [
      "Tigre", "Malvinas Argentinas", "José C. Paz", "San Miguel",
      "Moreno", "Merlo", "La Matanza Sur", "Ezeiza", "Esteban Echeverría",
      "Almirante Brown", "Presidente Perón", "Quilmes", "Florencio Varela",
      "Berazategui",
    ],
    // La Matanza outside Camino de Cintura (INDEC "La Matanza 2").
    searchAliases: [
      {
        within: "La Matanza Sur",
        names: [
          "Ciudad Evita", "González Catán", "Gregorio de Laferrere", "Laferrere", "Isidro Casanova",
          "Rafael Castillo", "20 de Junio", "Virrey del Pino", "Matanza 2",
        ],
      },
    ],
    prices: { standard: 5000, pro: 4700 },
    colorToken: "zone-3",
    color: themeColor("zone-3"),
  },
  GBA3: {
    id: "GBA3",
    name: "GBA 3",
    description: "Tercer cordón y La Plata",
    localities: [
      "Berisso", "Campana", "Canning", "Del Viso", "Derqui", "Ensenada",
      "Escobar", "Garín", "General Rodríguez", "Guernica", "Cañuelas",
      "Ingeniero Maschwitz", "La Plata", "Luján", "Marcos Paz", "Nordelta",
      "Pilar", "San Vicente", "Villa Rosa", "Zárate",
    ],
    prices: { standard: 6800, pro: 6550 },
    colorToken: "zone-4",
    color: themeColor("zone-4"),
  },
};

export const ZONE_LIST: Zone[] = Object.values(ZONES);

export const PLANS: Record<PlanId, { name: string; volume: string; highlight: string }> = {
  standard: {
    name: "Standard Seller",
    volume: "10 a 50 paquetes por día",
    highlight: "Ideal para tiendas en crecimiento",
  },
  pro: {
    name: "Pro Seller",
    volume: "Más de 50 paquetes por día",
    highlight: "Tarifa preferencial por volumen",
  },
};

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

// GeoJSON "departamento" names (lowercase, no accents) mapped to zone and display label.
// Used by scripts/build-coverage-geojson.mjs to generate public/data/amba.geojson.
export const GEOJSON_DEPARTMENTS: Record<string, { zone: ZoneId; label: string }> = {
  "vicente lopez": { zone: "GBA1", label: "Vicente López" },
  "san isidro": { zone: "GBA1", label: "San Isidro" },
  "san fernando": { zone: "GBA1", label: "San Fernando" },
  "general san martin": { zone: "GBA1", label: "San Martín" },
  "tres de febrero": { zone: "GBA1", label: "Tres de Febrero" },
  "moron": { zone: "GBA1", label: "Morón" },
  "hurlingham": { zone: "GBA1", label: "Hurlingham" },
  "ituzaingo": { zone: "GBA1", label: "Ituzaingó" },
  "la matanza": { zone: "GBA1", label: "La Matanza Norte" },
  "lomas de zamora": { zone: "GBA1", label: "Lomas de Zamora" },
  "lanus": { zone: "GBA1", label: "Lanús" },
  "avellaneda": { zone: "GBA1", label: "Avellaneda" },
  "tigre": { zone: "GBA2", label: "Tigre" },
  "malvinas argentinas": { zone: "GBA2", label: "Malvinas Argentinas" },
  "jose c paz": { zone: "GBA2", label: "José C. Paz" },
  "san miguel": { zone: "GBA2", label: "San Miguel" },
  "moreno": { zone: "GBA2", label: "Moreno" },
  "merlo": { zone: "GBA2", label: "Merlo" },
  "ezeiza": { zone: "GBA2", label: "Ezeiza" },
  "esteban echeverria": { zone: "GBA2", label: "Esteban Echeverría" },
  "almirante brown": { zone: "GBA2", label: "Almirante Brown" },
  "presidente peron": { zone: "GBA2", label: "Presidente Perón" },
  "quilmes": { zone: "GBA2", label: "Quilmes" },
  "florencio varela": { zone: "GBA2", label: "Florencio Varela" },
  "berazategui": { zone: "GBA2", label: "Berazategui" },
  "berisso": { zone: "GBA3", label: "Berisso" },
  "campana": { zone: "GBA3", label: "Campana" },
  "ensenada": { zone: "GBA3", label: "Ensenada" },
  "escobar": { zone: "GBA3", label: "Escobar" },
  "general rodriguez": { zone: "GBA3", label: "General Rodríguez" },
  "cañuelas": { zone: "GBA3", label: "Cañuelas" },
  "la plata": { zone: "GBA3", label: "La Plata" },
  "lujan": { zone: "GBA3", label: "Luján" },
  "marcos paz": { zone: "GBA3", label: "Marcos Paz" },
  "pilar": { zone: "GBA3", label: "Pilar" },
  "san vicente": { zone: "GBA3", label: "San Vicente" },
  "zarate": { zone: "GBA3", label: "Zárate" },
};

// Departments split in two zones along a road. The generator cuts the polygon with the road
// line: the piece containing `innerPoint` gets `inner`, the rest gets `outer`.
export const GEOJSON_SPLITS: Record<string, {
  road: string;
  innerPoint: [number, number];
  inner: { zone: ZoneId; label: string };
  outer: { zone: ZoneId; label: string };
}> = {
  "la matanza": {
    road: "scripts/data/rp4-camino-de-cintura.geojson",
    innerPoint: [-58.563, -34.683], // San Justo
    inner: { zone: "GBA1", label: "La Matanza Norte" },
    outer: { zone: "GBA2", label: "La Matanza Sur" },
  },
};

// Localities priced in a different zone than the partido that contains them on the map.
// The map shows a note when one of these partidos is selected.
export const PARTIDO_EXCEPTIONS: Record<string, string[]> = {
  "Tigre": ["Nordelta"],
  "Presidente Perón": ["Guernica"],
  "Esteban Echeverría": ["Canning"],
  "Ezeiza": ["Canning"],
};
