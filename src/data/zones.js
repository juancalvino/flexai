// Datos de zonas con sus municipios
export const zonesData = {
  CABA: {
    name: "CABA",
    description: "Ciudad Autónoma de Buenos Aires",
    municipalities: ["CABA", "Buenos Aires", "Ciudad Autónoma de Buenos Aires", "Capital Federal"],
    standardPrice: 3100, // Precio sin IVA de la página de precios
    proPrice: 2800, // Precio Pro sin IVA de la página de precios
    color: "#FFCF15", // Amarillo FLEXAI para CABA
    hoverColor: "#0D395A" // Azul FLEXAI para hover
  },
  GBA1: {
    name: "GBA 1",
    description: "Primer cordón del conurbano",
    municipalities: [
      "Vicente López", "San Isidro", "San Fernando", "San Martín", 
      "Tres de Febrero", "Morón", "Hurlingham", "Ituzaingó", 
      "La Matanza", "Lomas de Zamora", "Lanús", "Avellaneda"
    ],
    standardPrice: 4000, // Precio sin IVA de la página de precios
    proPrice: 3700, // Precio Pro sin IVA de la página de precios
    color: "#0D395A", // Azul FLEXAI para GBA1
    hoverColor: "#FFCF15" // Amarillo FLEXAI para hover
  },
  GBA2: {
    name: "GBA 2", 
    description: "Segundo cordón del conurbano",
    municipalities: [
      "Tigre", "Malvinas Argentinas", "José C. Paz", "San Miguel", 
      "Moreno", "Merlo", "Ezeiza", "Esteban Echeverría", 
      "Almirante Brown", "Presidente Perón", "Quilmes", "Florencio Varela", "Berazategui"
    ],
    standardPrice: 5000, // Precio sin IVA de la página de precios
    proPrice: 4700, // Precio Pro sin IVA de la página de precios
    color: "#1E5A96", // Azul FLEXAI más claro para GBA2  
    hoverColor: "#FFCF15" // Amarillo FLEXAI para hover
  },
  GBA3: {
    name: "GBA 3",
    description: "Tercer cordón del conurbano", 
    municipalities: [
      "Campana", "Zárate", "Escobar", "Pilar", "Luján", 
      "General Rodríguez", "Marcos Paz", "Cañuelas", "Guernica",
      "La Plata", "Berisso", "Ensenada"
    ],
    standardPrice: 6800, // Precio sin IVA de la página de precios
    proPrice: 6550, // Precio Pro sin IVA de la página de precios
    color: "#4A89DC", // Azul FLEXAI intermedio para GBA3
    hoverColor: "#FFCF15" // Amarillo FLEXAI para hover
  }
};

// Mapeo de municipios a zonas (generado automáticamente)
export const municipalityToZone = {};
Object.entries(zonesData).forEach(([zoneId, zone]) => {
  zone.municipalities.forEach(municipality => {
    municipalityToZone[municipality.toLowerCase()] = zoneId;
  });
});

// Mapeo exacto usando los nombres del GeoJSON (sin acentos)
export const exactMapping = {
  // CABA
  'ciudad autonoma de buenos aires': 'CABA',
  'caba': 'CABA',
  'capital federal': 'CABA',
  'buenos aires': 'CABA', // A veces aparece así en datos
  
  // GBA1 - Primer Cordón
  'vicente lopez': 'GBA1', // sin acento
  'san isidro': 'GBA1',
  'san fernando': 'GBA1', // El partido que limita con San Isidro y Tigre
  'general san martin': 'GBA1', // sin acento
  'tres de febrero': 'GBA1',
  'moron': 'GBA1', // sin acento
  'hurlingham': 'GBA1',
  'ituzaingo': 'GBA1', // sin acento
  'la matanza': 'GBA1',
  'lomas de zamora': 'GBA1',
  'lanus': 'GBA1', // sin acento
  'avellaneda': 'GBA1',
  
  // GBA2 - Segundo Cordón
  'tigre': 'GBA2',
  'malvinas argentinas': 'GBA2',
  'jose c paz': 'GBA2', // sin acento ni punto
  'san miguel': 'GBA2',
  'moreno': 'GBA2',
  'merlo': 'GBA2',
  'ezeiza': 'GBA2',
  'esteban echeverria': 'GBA2', // sin acento
  'almirante brown': 'GBA2',
  'quilmes': 'GBA2',
  'florencio varela': 'GBA2',
  'berazategui': 'GBA2',
  
  // GBA3 - Tercer Cordón
  'berisso': 'GBA3',
  'campana': 'GBA3',
  'ensenada': 'GBA3',
  'escobar': 'GBA3',
  'general rodriguez': 'GBA3', // sin acento
  'cañuelas': 'GBA3',
  'presidente peron': 'GBA2', // Incluye Guernica - movido a GBA2
  'partido de san fernando': 'GBA3', // El que limita con Tigre, Escobar y Campana
  'la plata': 'GBA3',
  'lujan': 'GBA3', // sin acento
  'marcos paz': 'GBA3',
  'pilar': 'GBA3',
  'san vicente': 'GBA3',
  'zarate': 'GBA3' // sin acento
};

// Función para determinar la zona de un municipio
export function getZoneForMunicipality(name) {
  const normalizedName = name.toLowerCase().trim();
  return exactMapping[normalizedName] || null;
}