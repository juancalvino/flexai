// Centralized configuration for FLEXAI

import type { BusinessInfo, SeoData } from '@/types/business';

/**
 * Environment configuration
 */
export const ENV = {
  NODE_ENV: import.meta.env.MODE || 'development',
  SITE_URL: import.meta.env.SITE || 'https://flexai.com.ar',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
} as const;

/**
 * Business information configuration
 */
export const BUSINESS: BusinessInfo = {
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

/**
 * Default SEO configuration
 */
export const DEFAULT_SEO: SeoData = {
  title: "FLEXAI - Logística para Mercado Libre | Entregas AMBA",
  description: "Servicio de logística especializado en Mercado Flex. Cobertura completa CABA y GBA con entregas garantizadas, sistema de tracking y precios competitivos.",
  canonical: ENV.SITE_URL,
  image: `${ENV.SITE_URL}/assets/og-image.jpg`,
  type: "website",
  locale: "es_AR",
  siteName: BUSINESS.fullName,
} as const;

/**
 * Social media configuration
 */
export const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: BUSINESS.instagram,
    icon: "simple-icons:instagram",
  },
  {
    name: "WhatsApp",
    href: BUSINESS.whatsapp,
    icon: "simple-icons:whatsapp",
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: "simple-icons:linkedin",
  },
] as const;

/**
 * Navigation configuration
 */
export const NAVIGATION = {
  main: [
    { title: "Inicio", path: "/" },
    { title: "Precios", path: "/precios" },
    { title: "Cobertura", path: "/cobertura" },
    { title: "Nosotros", path: "/nosotros" },
  ],
  footer: {
    servicios: [
      { name: "Distribución Express", href: "#" },
      { name: "Cobertura AMBA", href: "/cobertura" },
      { name: "Sistema LightData", href: BUSINESS.lightDataUrl },
      { name: "Precios", href: "/precios" },
    ],
    empresa: [
      { name: "Nosotros", href: "/nosotros" },
      { name: "Cómo funciona", href: "#como-funciona" },
      { name: "Testimonios", href: "#testimonios" },
      { name: "Blog", href: "#" },
    ],
    soporte: [
      { name: "Centro de ayuda", href: "#" },
      { name: "Términos y condiciones", href: "#" },
      { name: "Política de privacidad", href: "#" },
      { name: "Contacto", href: "#contacto" },
    ],
  },
} as const;

/**
 * Analytics configuration
 */
export const ANALYTICS = {
  googleAnalyticsId: import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID,
  vercelAnalyticsId: import.meta.env.PUBLIC_VERCEL_ANALYTICS_ID,
  enabled: ENV.IS_PRODUCTION,
} as const;

/**
 * Theme configuration
 */
export const THEME = {
  colors: {
    primary: {
      yellow: '#FFCF15',
      blue: '#0D395A',
    },
    neutral: {
      light: '#FAFAFA',
      dark: '#171717',
    },
  },
  fonts: {
    sans: 'Inter Variable, system-ui, sans-serif',
    display: 'Bricolage Grotesque Variable, system-ui, sans-serif',
    logo: 'Istok Web, system-ui, sans-serif',
  },
  spacing: {
    section: {
      sm: 'py-12',
      md: 'py-16',
      lg: 'py-20',
      xl: 'py-24',
    },
  },
} as const;

/**
 * Form configuration
 */
export const FORMS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  validation: {
    name: { minLength: 2, maxLength: 50 },
    email: { maxLength: 100 },
    phone: { minLength: 10, maxLength: 15 },
    message: { maxLength: 500 },
    company: { maxLength: 100 },
  },
} as const;

/**
 * API configuration
 */
export const API = {
  baseUrl: ENV.IS_DEVELOPMENT ? 'http://localhost:3000/api' : `${ENV.SITE_URL}/api`,
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  endpoints: {
    contact: '/contact',
    quote: '/quote',
    newsletter: '/newsletter',
    tracking: '/tracking',
  },
} as const;

/**
 * Cache configuration
 */
export const CACHE = {
  ttl: {
    static: 60 * 60 * 24 * 7, // 1 week
    dynamic: 60 * 5, // 5 minutes
    api: 60 * 1, // 1 minute
  },
  keys: {
    pricing: 'pricing_data',
    coverage: 'coverage_zones',
    testimonials: 'testimonials_data',
  },
} as const;

/**
 * Feature flags
 */
export const FEATURES = {
  darkMode: false,
  newsletter: true,
  testimonials: true,
  blog: false,
  liveChat: ENV.IS_PRODUCTION,
  maintenance: false,
  betaFeatures: ENV.IS_DEVELOPMENT,
} as const;

/**
 * Performance configuration
 */
export const PERFORMANCE = {
  imageOptimization: {
    formats: ['webp', 'avif'],
    quality: 80,
    sizes: [320, 640, 768, 1024, 1280, 1536],
  },
  lazyLoading: {
    rootMargin: '50px',
    threshold: 0.1,
  },
  prefetch: {
    enabled: true,
    onHover: true,
    onVisible: false,
  },
} as const;