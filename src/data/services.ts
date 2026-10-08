// Service and differentiator copy shared by the home page and /servicios.

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  imagePrompt: string;
}

export const SERVICES: Service[] = [
  {
    id: "flex",
    title: "Envíos Flex",
    description:
      "Retiramos tus ventas de Mercado Envíos Flex y las entregamos en el día, cuidando tu reputación en cada paquete.",
    icon: "bx:package",
    imagePrompt:
      "repartidor en moto con caja de envío amarilla recorriendo una calle de Buenos Aires al atardecer, fotografía editorial, tonos cálidos",
  },
  {
    id: "recorridos",
    title: "Dos recorridos diarios",
    description:
      "Salimos dos veces por día, de lunes a sábado, para que ningún pedido quede esperando al día siguiente.",
    icon: "bx:time-five",
    imagePrompt:
      "furgoneta de reparto estacionada en un depósito con paquetes apilados, luz de la mañana, estilo documental",
  },
  {
    id: "tracking",
    title: "Seguimiento de envíos",
    description:
      "Gestioná tus envíos y consultá el estado de cada entrega en tiempo real desde nuestra plataforma de seguimiento.",
    icon: "bx:line-chart",
    imagePrompt:
      "manos sosteniendo un celular con un panel de seguimiento de envíos en pantalla, fondo desenfocado de depósito, tonos oscuros con acentos amarillos",
  },
  {
    id: "reprogramaciones",
    title: "Reprogramaciones sin estrés",
    description:
      "Coordinamos con el comprador cuando no está en su domicilio y reprogramamos la entrega en tiempo y forma.",
    icon: "bx:calendar-check",
    imagePrompt:
      "repartidor tocando el timbre de un edificio residencial porteño con un paquete en la mano, fotografía natural",
  },
];

export const DIFFERENTIATORS = [
  {
    title: "Cobertura total en CABA y GBA",
    description: "Llegamos a todas las zonas habilitadas por Mercado Libre, incluidas las nuevas localidades.",
    icon: "bx:map-alt",
  },
  {
    title: "Máxima seguridad",
    description: "Garantizamos el 100% de las entregas, protegiendo tu reputación y tu mercadería.",
    icon: "bx:shield-quarter",
  },
  {
    title: "Atención personalizada",
    description: "Un equipo real disponible para resolver tus dudas por WhatsApp.",
    icon: "bx:support",
  },
] as const;

export const STEPS = [
  { title: "Retiramos", description: "Pasamos por tu depósito o local a buscar las ventas del día." },
  { title: "Entregamos", description: "Nuestros repartidores llevan cada paquete a destino en el día." },
  { title: "Seguís todo", description: "Consultás cada entrega en la plataforma de seguimiento y recibís el cierre del recorrido." },
] as const;
