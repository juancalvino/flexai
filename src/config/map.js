// Configuración del mapa interactivo
export const MAP_CONFIG = {
  // Colores de la marca
  COLORS: {
    PRIMARY: "#FFCF15", // Amarillo FLEXAI
    SECONDARY: "#0D395A", // Azul FLEXAI
    TERTIARY: "#1E5A96", // Azul FLEXAI claro
    QUATERNARY: "#4A89DC", // Azul FLEXAI intermedio
    WHITE: "#ffffff",
    GRAY: "#e5e7eb",
    DARK_GRAY: "#6b7280"
  },

  // Configuración del mapa
  MAP: {
    CENTER: [-34.6037, -58.3816], // Coordenadas de Buenos Aires
    ZOOM: 9,
    MIN_ZOOM: 7,
    MAX_ZOOM: 13
  },

  // URLs de datos GeoJSON
  GEOJSON_URLS: {
    BUENOS_AIRES: 'https://raw.githubusercontent.com/mgaitan/departamentos_argentina/master/departamentos-buenos_aires.json',
    CABA: 'https://cdn.buenosaires.gob.ar/datosabiertos/datasets/ministerio-de-educacion/comunas/comunas.geojson'
  },

  // Configuración de contacto
  CONTACT: {
    WHATSAPP: "5491130502881",
    EMAIL: "flexai.logistica@gmail.com"
  },

  // Configuración de estilos del mapa
  STYLES: {
    DEFAULT: {
      weight: 2,
      opacity: 1,
      color: "#ffffff",
      dashArray: '3',
      fillOpacity: 0.7
    },
    HOVER: {
      weight: 3,
      dashArray: '',
      fillOpacity: 0.9
    },
    DISABLED: {
      fillColor: '#cccccc',
      weight: 1,
      opacity: 0.3,
      color: 'white',
      fillOpacity: 0.2
    }
  },

  // Z-indexes para evitar conflictos de layers
  Z_INDEX: {
    MAP_PANE: 5,
    MAP_CONTAINER: 10,
    LEAFLET_CONTROLS: 15,
    HEADER: 50
  },

  // Configuración del toggle
  TOGGLE: {
    WIDTH: 200,
    HEIGHT: 48,
    BUTTON_WIDTH: 96,
    MOBILE_WIDTH: 180,
    MOBILE_HEIGHT: 44,
    MOBILE_BUTTON_WIDTH: 86
  }
};

// Utilidades de configuración
export const getWhatsAppUrl = (zoneName, municipalityName = '') => {
  const message = municipalityName 
    ? `Hola! Me interesa el servicio de envíos para ${municipalityName} (${zoneName}). ¿Podrían darme más información?`
    : `Hola! Me interesa el servicio de envíos para ${zoneName}. ¿Podrían darme más información?`;
  
  return `https://wa.me/${MAP_CONFIG.CONTACT.WHATSAPP}?text=${encodeURIComponent(message)}`;
};

// CSS Custom Properties para usar en estilos
export const getCSSVariables = () => {
  return {
    '--color-primary': MAP_CONFIG.COLORS.PRIMARY,
    '--color-secondary': MAP_CONFIG.COLORS.SECONDARY,
    '--color-tertiary': MAP_CONFIG.COLORS.TERTIARY,
    '--color-quaternary': MAP_CONFIG.COLORS.QUATERNARY,
    '--toggle-width': `${MAP_CONFIG.TOGGLE.WIDTH}px`,
    '--toggle-height': `${MAP_CONFIG.TOGGLE.HEIGHT}px`,
    '--toggle-button-width': `${MAP_CONFIG.TOGGLE.BUTTON_WIDTH}px`
  };
};