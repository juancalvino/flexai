// Builds public/data/amba.geojson: AMBA departments + CABA comunas, tagged with
// their delivery zone and with coordinates rounded to keep the file small.
// Usage: node --experimental-strip-types scripts/build-coverage-geojson.mjs
import { writeFile } from "node:fs/promises";
import { GEOJSON_ZONE_MAP } from "../src/data/zones.ts";

const SOURCES = {
  province: "https://raw.githubusercontent.com/mgaitan/departamentos_argentina/master/departamentos-buenos_aires.json",
  caba: "https://cdn.buenosaires.gob.ar/datosabiertos/datasets/ministerio-de-educacion/comunas/comunas.geojson",
};

// ~100 m precision is plenty at the zoom levels the map uses.
const roundPoint = ([lng, lat]) => [Math.round(lng * 1e3) / 1e3, Math.round(lat * 1e3) / 1e3];
const samePoint = (a, b) => a && a[0] === b[0] && a[1] === b[1];
const round = (coords) => {
  if (typeof coords[0][0] !== "number") return coords.map(round);
  return coords.map(roundPoint).filter((point, index, ring) => !samePoint(ring[index - 1], point));
};

const fetchJson = (url) => fetch(url).then((response) => response.json());
const [province, caba] = await Promise.all([fetchJson(SOURCES.province), fetchJson(SOURCES.caba)]);

const features = [
  ...province.features.flatMap((feature) => {
    const name = String(feature.properties.departamento ?? "");
    const zone = GEOJSON_ZONE_MAP[name.toLowerCase().trim()];
    return zone ? [{ type: "Feature", properties: { name, zone }, geometry: { ...feature.geometry, coordinates: round(feature.geometry.coordinates) } }] : [];
  }),
  ...caba.features.map((feature) => ({
    type: "Feature",
    properties: { name: "CABA", zone: "CABA" },
    geometry: { ...feature.geometry, coordinates: round(feature.geometry.coordinates) },
  })),
];

await writeFile("public/data/amba.geojson", JSON.stringify({ type: "FeatureCollection", features }));
console.log(`Wrote ${features.length} features`);
