import assert from "node:assert/strict";
import test from "node:test";
import { eligiblePlan, qualificationHeading } from "../src/lib/pricing-qualification.ts";
import { buildContactMessage } from "../src/lib/contact-message.ts";

for (const [volume, plan] of [[1, "standard"], [50, "standard"], [51, "pro"], [99, "pro"], [100, "premium"], [101, "premium"]]) {
  test(`${volume} packages qualifies only for ${plan}`, () => {
    assert.equal(eligiblePlan(volume), plan);
    assert.equal(eligiblePlan(String(volume)), plan);
  });
}

test("invalid, fractional, zero and unsafe volumes never qualify", () => {
  for (const value of [undefined, null, false, true, {}, [], "", " ", "NaN", "no", NaN, Infinity, -Infinity, 0, -1, 1.5, 50.5, 99.5, "100.1", "1.0", "1e2", "0x64", Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(eligiblePlan(value), null, String(value));
  }
  assert.equal(eligiblePlan(" 51 "), "pro");
});

test("qualified messages name the matching plan and retain structured submitted details", () => {
  for (const [volume, name] of [[1, "Standard Seller"], [51, "Pro Seller"], [100, "premium"], [101, "premium"]]) {
    const data = new FormData();
    for (const [key, value] of Object.entries({ name: "Ana", phone: "1123456789", store: "<b>Tienda</b>", locality: "Devoto", volume: String(volume), deliveryZones: "CABA", size: "Pequeño" })) data.set(key, value);
    const heading = qualificationHeading(volume);
    const expected = volume >= 100
      ? `Hola FLEXAI, quiero adquirir el servicio premium, tengo un promedio de ${volume} paquetes por día.`
      : `Hola FLEXAI, quiero contratar el plan ${name}, tengo un promedio de ${volume} paquetes por día.`;
    assert.equal(heading, expected);
    const message = buildContactMessage(data, "services", { heading });
    assert.ok(message.startsWith(expected + "\n\n*Datos de contacto*"));
    for (const detail of ["Nombre: Ana", "Teléfono: 1123456789", "Empresa: <b>Tienda</b>", "colecta: Devoto", `Paquetes por día: ${volume}`, "Zonas de entrega: CABA", "Tamaño de paquetes: Pequeño"]) assert.ok(message.includes(detail), detail);
  }
  assert.equal(qualificationHeading(0), null);
});
