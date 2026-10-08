import { eligiblePlan } from "./pricing-qualification.ts";

export type ContactIntent = "services" | "work";

interface MessageOptions {
  /** Caller-owned heading; this helper does not decide plans or eligibility. */
  heading?: string;
}

/** Format validated intake as plain text. Only fields for the active intent are read. */
export function buildContactMessage(
  data: FormData,
  intent: ContactIntent,
  options: MessageOptions = {},
): string {
  const value = (key: string) => String(data.get(key) ?? "").trim();
  const list = (key: string) => data.getAll(key).map((item) => String(item).trim()).join(", ");
  const driver = intent === "work" && value("driver") === "yes";
  const defaultHeading = intent === "services"
    ? "Hola FLEXAI, quiero información sobre el servicio de envíos."
    : driver
      ? "Hola FLEXAI, quiero trabajar como conductor/a."
      : "Hola FLEXAI, quiero trabajar en el equipo en un puesto no conductor.";
  const lines = [
    options.heading?.trim() || defaultHeading,
    "",
    "*Datos de contacto*",
    `Nombre: ${value("name")}`,
  ];
  const phone = value("phone");
  if (phone) lines.push(`Teléfono: ${phone}`);

  if (intent === "services") {
    lines.push(
      "",
      "*Datos de tus envíos*",
      `Empresa: ${value("store")}`,
      `Barrio / localidad de colecta: ${value("locality")}`,
      `Paquetes por día: ${value("volume")}`,
      `Zonas de entrega: ${list("deliveryZones")}`,
      `Tamaño de paquetes: ${value("size")}`,
    );
  } else if (driver) {
    lines.push(
      "",
      "*Perfil de conductor/a*",
      `Barrio / localidad de origen: ${value("originZone")}`,
      `Zona de interés: ${value("interestZone")}`,
      "",
      "*Vehículo*",
      `Tipo: ${value("vehicle")}`,
      `Marca: ${value("vehicleBrand")}`,
      `Modelo: ${value("vehicleModel")}`,
      `Año: ${value("vehicleYear")}`,
      "",
      "*Disponibilidad*",
      `Días: ${list("availabilityDays")}`,
      `Horario: ${value("availabilityTime")}`,
    );
  }
  return lines.join("\n");
}

/** Prepare a draft only; mailto cannot attach a CV or send the email. */
export function buildCvEmailUrl(data: FormData, recipient: string): string {
  const value = (key: string) => String(data.get(key) ?? "").trim();
  const position = value("position");
  const subject = `Postulación: ${position}`;
  const lines = [
    "Hola FLEXAI, quiero postularme para trabajar en el equipo.",
    "",
    `Nombre: ${value("name")}`,
    `Puesto: ${position}`,
  ];
  const phone = value("phone");
  if (phone) lines.push(`Teléfono: ${phone}`);
  lines.push("", "Recordá adjuntar tu CV antes de enviar este correo.");
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

/** Supplements native constraints; callers skip disabled controls. */
export function contactFieldError(
  field: { name: string; required: boolean; value: string },
  currentYear = new Date().getFullYear(),
): string {
  const value = field.value.trim();
  if (field.required && !value) return "Completá este campo sin dejar solo espacios.";
  if (field.name === "volume" && !eligiblePlan(value)) {
    return "Ingresá una cantidad entera de paquetes mayor que cero.";
  }
  if (field.name === "vehicleYear" && value) {
    const year = Number(value);
    // Automotive history is a sanity bound, not an age/eligibility restriction.
    if (!Number.isInteger(year) || year < 1886 || year > currentYear + 1) {
      return `Ingresá un año entero entre 1886 y ${currentYear + 1}.`;
    }
  }
  return "";
}
