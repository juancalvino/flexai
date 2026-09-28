// Builds public/data/amba.geojson: AMBA departments + CABA comunas, tagged with
// their delivery zone and with coordinates rounded to keep the file small.
// Usage: node --experimental-strip-types scripts/build-coverage-geojson.mjs
import { writeFile } from "node:fs/promises";
import { GEOJSON_DEPARTMENTS } from "../src/data/zones.ts";

const SOURCES = {
  province: "https://raw.githubusercontent.com/mgaitan/departamentos_argentina/master/departamentos-buenos_aires.json",
  caba: "https://cdn.buenosaires.gob.ar/datosabiertos/datasets/ministerio-de-educacion/comunas/comunas.geojson",
};

// The Paraná Delta islands (part of San Fernando) are not served and distort the map bounds.
const DELTA_NORTH_LIMIT = -34.38;

// ~100 m precision is plenty at the zoom levels the map uses.
const roundPoint = ([lng, lat]) => [Math.round(lng * 1e3) / 1e3, Math.round(lat * 1e3) / 1e3];
const samePoint = (a, b) => a && a[0] === b[0] && a[1] === b[1];
const round = (coords) => {
  if (typeof coords[0][0] !== "number") return coords.map(round);
  return coords.map(roundPoint).filter((point, index, ring) => !samePoint(ring[index - 1], point));
};

const polygonLat = (polygon) => {
  const ring = polygon[0];
  return ring.reduce((total, [, lat]) => total + lat, 0) / ring.length;
};

function withoutDelta(geometry) {
  if (geometry.type !== "MultiPolygon") return geometry;
  const coordinates = geometry.coordinates.filter((polygon) => polygonLat(polygon) < DELTA_NORTH_LIMIT);
  return { type: "MultiPolygon", coordinates };
}

const feature = (properties, geometry) => ({
  type: "Feature",
  properties,
  geometry: { ...geometry, coordinates: round(geometry.coordinates) },
});

const fetchJson = (url) => fetch(url).then((response) => response.json());
const [province, caba] = await Promise.all([fetchJson(SOURCES.province), fetchJson(SOURCES.caba)]);

const features = [
  ...province.features.flatMap((item) => {
    const department = GEOJSON_DEPARTMENTS[String(item.properties.departamento ?? "").toLowerCase().trim()];
    if (!department) return [];
    return [feature({ name: department.label, zone: department.zone }, withoutDelta(item.geometry))];
  }),
  ...caba.features.map((item) => feature({ name: `Comuna ${item.properties.comuna}`, zone: "CABA" }, item.geometry)),
];

await writeFile("public/data/amba.geojson", JSON.stringify({ type: "FeatureCollection", features }));
console.log(`Wrote ${features.length} features`);
