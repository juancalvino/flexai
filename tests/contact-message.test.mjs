import assert from "node:assert/strict";
import test from "node:test";
import { buildContactMessage, contactFieldError } from "../src/lib/contact-message.ts";
import * as contactMessage from "../src/lib/contact-message.ts";
import { SITE } from "../src/data/site.ts";

function intake(extra = {}) {
  const data = new FormData();
  const fields = {
    name: "  Ana Pérez  ", phone: "  11 1234 5678  ", store: " Mi tienda ",
    locality: " Devoto ", volume: "30", deliveryZones: ["CABA", "GBA 1"], size: "Mediano",
    position: "STALE_POSITION", driver: "yes", originZone: " Villa Luro ", interestZone: "CABA", vehicle: "Auto",
    vehicleBrand: " Ford ", vehicleModel: " Falcon ", vehicleYear: "1975",
    availabilityDays: ["Lunes", "Viernes"], availabilityTime: "Tarde/noche",
    url: "REMOVED_URL", message: "REMOVED_MESSAGE", workMessage: "REMOVED_WORK", vehicleSize: "REMOVED_SIZE",
    ...extra,
  };
  for (const [key, value] of Object.entries(fields)) {
    for (const item of Array.isArray(value) ? value : [value]) data.append(key, item);
  }
  return data;
}

test("seller message is structured, trimmed and excludes work and removed fields", () => {
  assert.equal(buildContactMessage(intake(), "services"), [
    "Hola FLEXAI, quiero información sobre el servicio de envíos.", "",
    "*Datos de contacto*", "Nombre: Ana Pérez", "Teléfono: 11 1234 5678", "",
    "*Datos de tus envíos*", "Empresa: Mi tienda", "Barrio / localidad de colecta: Devoto",
    "Paquetes por día: 30", "Zonas de entrega: CABA, GBA 1", "Tamaño de paquetes: Mediano",
  ].join("\n"));
});

test("driver message includes vehicle identity and availability, not seller data", () => {
  assert.equal(buildContactMessage(intake(), "work"), [
    "Hola FLEXAI, quiero trabajar como conductor/a.", "",
    "*Datos de contacto*", "Nombre: Ana Pérez", "Teléfono: 11 1234 5678", "",
    "*Perfil de conductor/a*", "Barrio / localidad de origen: Villa Luro", "Zona de interés: CABA", "",
    "*Vehículo*", "Tipo: Auto", "Marca: Ford", "Modelo: Falcon", "Año: 1975", "",
    "*Disponibilidad*", "Días: Lunes, Viernes", "Horario: Tarde/noche",
  ].join("\n"));
});

test("non-driver keeps minimum intake without stale driver or seller data", () => {
  assert.equal(buildContactMessage(intake({ driver: "no" }), "work"), [
    "Hola FLEXAI, quiero trabajar en el equipo en un puesto no conductor.", "",
    "*Datos de contacto*", "Nombre: Ana Pérez", "Teléfono: 11 1234 5678",
  ].join("\n"));
});

test("CV email encodes subject and body and includes only applicant fields and attachment instruction", () => {
  const url = contactMessage.buildCvEmailUrl(intake({
    name: "  Inés & José\nPérez  ", position: "  Administración & logística\nAMBA  ",
  }), SITE.email);
  assert.ok(url.startsWith(`mailto:${SITE.email}?subject=`));
  assert.ok(url.includes("%26"));
  assert.ok(url.includes("%0A"));
  const params = new URL(url).searchParams;
  assert.deepEqual([...params.keys()], ["subject", "body"]);
  assert.equal(params.get("subject"), "Postulación: Administración & logística\nAMBA");
  assert.equal(params.get("body"), [
    "Hola FLEXAI, quiero postularme para trabajar en el equipo.", "",
    "Nombre: Inés & José\nPérez", "Puesto: Administración & logística\nAMBA",
    "Teléfono: 11 1234 5678", "", "Recordá adjuntar tu CV antes de enviar este correo.",
  ].join("\n"));
});

test("CV email omits an absent or whitespace-only phone", () => {
  for (const phone of ["", "  \t\n ", undefined]) {
    const data = intake({ position: "Depósito", phone: phone ?? "" });
    if (phone === undefined) data.delete("phone");
    const body = new URL(contactMessage.buildCvEmailUrl(data, SITE.email)).searchParams.get("body");
    assert.ok(body.includes("Puesto: Depósito"));
    assert.ok(!body.includes("Teléfono"));
    assert.ok(!body.includes("WhatsApp"));
  }
});

test("phone is optional and omitted from the message when blank", () => {
  const data = intake({ phone: "   " });
  assert.equal(buildContactMessage(data, "services"), [
    "Hola FLEXAI, quiero información sobre el servicio de envíos.", "",
    "*Datos de contacto*", "Nombre: Ana Pérez", "",
    "*Datos de tus envíos*", "Empresa: Mi tienda", "Barrio / localidad de colecta: Devoto",
    "Paquetes por día: 30", "Zonas de entrega: CABA, GBA 1", "Tamaño de paquetes: Mediano",
  ].join("\n"));
  assert.ok(!buildContactMessage(data, "work").includes("Teléfono"));
});

test("caller can supply a heading without helper owning plan or premium policy", () => {
  const message = buildContactMessage(intake(), "services", { heading: "  Consulta sobre un plan  " });
  assert.ok(message.startsWith("Consulta sobre un plan\n\n*Datos de contacto*"));
  assert.ok(message.endsWith("Tamaño de paquetes: Mediano"));
  assert.equal(buildContactMessage(intake(), "services", { heading: "  " }), buildContactMessage(intake(), "services"));
});

test("messages reflect current input, preserve text literally and trim list items", () => {
  const data = intake({ store: "<script>alert(1)</script>", deliveryZones: [" CABA ", " GBA 3 "] });
  const first = buildContactMessage(data, "services");
  assert.ok(first.includes("Empresa: <script>alert(1)</script>"));
  assert.ok(first.includes("Zonas de entrega: CABA, GBA 3"));
  data.set("locality", " Tortuguitas ");
  assert.ok(buildContactMessage(data, "services").includes("colecta: Tortuguitas"));
  assert.ok(first.includes("colecta: Devoto"));
});

test("required text rejects whitespace but optional text remains optional", () => {
  for (const name of ["name", "phone", "store", "locality", "originZone", "vehicleBrand", "vehicleModel", "position"]) {
    assert.notEqual(contactFieldError({ name, required: true, value: " \t\n " }), "");
    assert.equal(contactFieldError({ name, required: true, value: " Devoto " }), "");
  }
  assert.equal(contactFieldError({ name: "optional", required: false, value: " " }), "");
});

test("daily volume rejects non-positive and fractional values before either submission mode", () => {
  const error = (value) => contactFieldError({ name: "volume", required: true, value });
  for (const value of ["0", "-1", "1.5", "50.5", "99.5", "NaN", "Infinity", "0x64"]) assert.notEqual(error(value), "", value);
  for (const value of ["1", "50", "51", "99", "100", "101"]) assert.equal(error(value), "", value);
});

test("vehicle year requires an integer in automotive history, not a vehicle-age policy", () => {
  const error = (value) => contactFieldError({ name: "vehicleYear", required: true, value }, 2026);
  for (const value of ["", " ", "abc", "0", "1885", "2028", "2020.5", "Infinity"]) assert.notEqual(error(value), "", value);
  for (const value of ["1886", "1975", "2026", "2027"]) assert.equal(error(value), "", value);
  assert.equal(contactFieldError({ name: "vehicleYear", required: true, value: "2028" }, 2027), "");
});
