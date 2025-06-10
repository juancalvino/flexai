// Business constants for FLEXAI
export const BUSINESS_INFO = {
  name: "FLEXAI",
  fullName: "FLEXAI Logística",
  tagline: "Tu socio confiable en logística para Mercado Libre",
  phone: "+5491130502881",
  email: "flexai.logistica@gmail.com",
  website: "https://flexai.com.ar",
  lightDataUrl: "https://lightdata.flexai.com.ar",
  instagram: "https://instagram.com/flexai.logistica",
  whatsapp: "https://wa.me/5491130502881",
} as const;

export const COVERAGE_ZONES = {
  CABA: "Ciudad Autónoma de Buenos Aires",
  GBA1: "Gran Buenos Aires Zona 1",
  GBA2: "Gran Buenos Aires Zona 2", 
  GBA3: "Gran Buenos Aires Zona 3",
} as const;

export const SELLER_TIERS = {
  STANDARD: {
    name: "Standard Seller",
    description: "Para vendedores con volumen medio",
    minDeliveries: 10,
    maxDeliveries: 50,
    features: [
      "2 recorridos diarios",
      "Intentos de entrega ilimitados",
      "Responsabilidad total por pérdidas",
      "Grupo de WhatsApp dedicado",
      "Sistema LightData incluido",
      "Liquidaciones quincenales"
    ],
    prices: {
      CABA: 2600,
      GBA1: 3400,
      GBA2: 4300,
      GBA3: 6500,
    }
  },
  PRO: {
    name: "Pro Seller", 
    description: "Para vendedores con alto volumen",
    minDeliveries: 50,
    maxDeliveries: 100,
    features: [
      "2 recorridos diarios",
      "Intentos de entrega ilimitados", 
      "Responsabilidad total por pérdidas",
      "Grupo de WhatsApp dedicado",
      "Sistema LightData incluido",
      "Liquidaciones quincenales",
      "Soporte prioritario",
      "Flota adicional en fechas especiales"
    ],
    prices: {
      CABA: 2300,
      GBA1: 3000,
      GBA2: 3800,
      GBA3: 5900,
    }
  },
  BEST: {
    name: "Best Seller",
    description: "Para vendedores de alto volumen",
    minDeliveries: 100,
    maxDeliveries: null,
    features: [
      "2 recorridos diarios",
      "Intentos de entrega ilimitados",
      "Responsabilidad total por pérdidas", 
      "Grupo de WhatsApp dedicado",
      "Sistema LightData incluido",
      "Liquidaciones quincenales",
      "Soporte VIP 24/7",
      "Flota adicional garantizada",
      "Gestión de devoluciones express",
      "Precios cooperativos disponibles"
    ],
    prices: {
      CABA: 2000,
      GBA1: 2600,
      GBA2: 3300,
      GBA3: 5000,
    }
  }
} as const;

export const SERVICE_FEATURES = [
  {
    title: "Cobertura Total AMBA",
    description: "Servicio completo en CABA y todas las zonas del Gran Buenos Aires",
    icon: "bx:map"
  },
  {
    title: "Entregas Garantizadas", 
    description: "100% de responsabilidad sobre pérdidas o daños en tus envíos",
    icon: "bx:shield-check"
  },
  {
    title: "Sistema LightData",
    description: "Plataforma propia para control total de tus envíos en tiempo real",
    icon: "bx:desktop"
  },
  {
    title: "Flexibilidad Operativa",
    description: "Dos recorridos diarios y horarios adaptados a tu negocio",
    icon: "bx:time"
  },
  {
    title: "Atención Personalizada",
    description: "Grupos de WhatsApp dedicados y soporte especializado",
    icon: "bx:support"
  },
  {
    title: "Sin Costos Ocultos",
    description: "Intentos de entrega ilimitados sin cargo adicional",
    icon: "bx:money-withdraw"
  }
] as const;

export const OPERATING_HOURS = {
  collection: "13:00 - 14:00",
  delivery: "Hasta las 22:00",
  support: "Lunes a Sábado: 9:00 - 22:00"
} as const;

export const PRICING_NOTES = [
  "Precios no incluyen IVA (21% adicional si requiere factura)",
  "Comercios en radio de 5 cuadras pueden unir envíos para mejores tarifas",
  "Período de prueba de 15 días con precios preferenciales",
  "Flota reforzada disponible para fechas especiales"
] as const;