// Single source of truth for business and contact data.

const WHATSAPP_NUMBER = "5491130502881";

export const SITE = {
  name: "FLEXAI",
  fullName: "FLEXAI Logística",
  url: "https://flexai.com.ar",
  tagline: "Logística Flex para vendedores de Mercado Libre en AMBA",
  description:
    "Logística especializada en Mercado Envíos Flex. Cobertura en CABA y GBA, dos recorridos diarios de lunes a sábado y seguimiento en tiempo real.",
  phoneDisplay: "+54 9 11 3050-2881",
  phoneHref: `tel:+${WHATSAPP_NUMBER}`,
  whatsappNumber: WHATSAPP_NUMBER,
  email: "flexai.logistica@gmail.com",
  lightDataUrl: "https://lightdata.flexai.com.ar",
  instagram: "https://instagram.com/flexai.logistica",
  ogImage: "/assets/og-image.jpg",
  // Browser UI color (mobile address bar). Meta tags can't read CSS variables: keep in sync with --color-ink.
  browserThemeColor: "#081421",
} as const;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hola FLEXAI, quiero información sobre el servicio de envíos Flex.";

export const NAVIGATION = [
  { title: "Inicio", path: "/" },
  { title: "Servicios", path: "/servicios" },
  { title: "Cobertura", path: "/cobertura" },
  { title: "Nosotros", path: "/nosotros" },
  { title: "Contacto", path: "/contacto" },
] as const;

export const SOCIAL_LINKS = [
  { name: "Instagram", href: SITE.instagram, icon: "simple-icons:instagram" },
  { name: "WhatsApp", href: whatsappUrl(), icon: "simple-icons:whatsapp" },
] as const;
