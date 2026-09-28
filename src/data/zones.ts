// Zones, localities and prices. Used by the map, /servicios and /cobertura.

export type ZoneId = "CABA" | "GBA1" | "GBA2" | "GBA3";
export type PlanId = "standard" | "pro";

export interface Zone {
  id: ZoneId;
  name: string;
  description: string;
  localities: string[];
  prices: Record<PlanId, number>;
  color: string;
}

export const ZONES: Record<ZoneId, Zone> = {
  CABA: {
    id: "CABA",
    name: "CABA",
    description: "Todas las comunas de la Ciudad",
    localities: ["Todas las comunas"],
    prices: { standard: 3100, pro: 2800 },
    color: "#FFCF15",
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
    prices: { standard: 4000, pro: 3700 },
    color: "#F3F1EB",
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
    prices: { standard: 5000, pro: 4700 },
    color: "#8FA9BF",
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
    color: "#0D395A",
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

// GeoJSON "departamento" names (lowercase, no accents) mapped to zones.
// Used by scripts/build-coverage-geojson.mjs to generate public/data/amba.geojson.
export const GEOJSON_ZONE_MAP: Record<string, ZoneId> = {
  "ciudad autonoma de buenos aires": "CABA",
  "vicente lopez": "GBA1",
  "san isidro": "GBA1",
  "san fernando": "GBA1",
  "general san martin": "GBA1",
  "tres de febrero": "GBA1",
  "moron": "GBA1",
  "hurlingham": "GBA1",
  "ituzaingo": "GBA1",
  "la matanza": "GBA1",
  "lomas de zamora": "GBA1",
  "lanus": "GBA1",
  "avellaneda": "GBA1",
  "tigre": "GBA2",
  "malvinas argentinas": "GBA2",
  "jose c paz": "GBA2",
  "san miguel": "GBA2",
  "moreno": "GBA2",
  "merlo": "GBA2",
  "ezeiza": "GBA2",
  "esteban echeverria": "GBA2",
  "almirante brown": "GBA2",
  "presidente peron": "GBA2",
  "quilmes": "GBA2",
  "florencio varela": "GBA2",
  "berazategui": "GBA2",
  "berisso": "GBA3",
  "campana": "GBA3",
  "ensenada": "GBA3",
  "escobar": "GBA3",
  "general rodriguez": "GBA3",
  "cañuelas": "GBA3",
  "la plata": "GBA3",
  "lujan": "GBA3",
  "marcos paz": "GBA3",
  "pilar": "GBA3",
  "san vicente": "GBA3",
  "zarate": "GBA3",
};
