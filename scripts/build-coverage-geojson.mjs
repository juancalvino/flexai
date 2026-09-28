// Builds public/data/amba.geojson: AMBA departments + CABA comunas, tagged with
// their delivery zone and with coordinates rounded to keep the file small.
// Usage: node --experimental-strip-types scripts/build-coverage-geojson.mjs
import { readFile, writeFile } from "node:fs/promises";
import * as turf from "@turf/turf";
import { GEOJSON_DEPARTMENTS, GEOJSON_SPLITS } from "../src/data/zones.ts";

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

// Road corridor width used to cut a department in two (the corridor goes to the inner piece).
const ROAD_BUFFER_KM = 0.04;

// Road lines are stored in scripts/data (exported from OpenStreetMap via Overpass).
async function splitDepartment(item, split) {
  const road = JSON.parse(await readFile(split.road, "utf8"));
  const corridor = turf.buffer(turf.combine(road).features[0], ROAD_BUFFER_KM, { units: "kilometers" });
  const pieces = turf.flatten(turf.difference(turf.featureCollection([item, corridor]))).features;
  const innerPiece = pieces.find((piece) => turf.booleanPointInPolygon(turf.point(split.innerPoint), piece));
  if (!innerPiece) throw new Error(`innerPoint is not inside any piece of ${item.properties.departamento}`);

  // Outer = everything that is not the inner piece or the road corridor; inner keeps the corridor.
  const outerPieces = pieces.filter((piece) => piece !== innerPiece && turf.area(piece) > 1e5);
  const outer = outerPieces.length > 1 ? turf.union(turf.featureCollection(outerPieces)) : outerPieces[0];
  if (!outer) throw new Error(`The road does not split ${item.properties.departamento}`);
  const inner = turf.difference(turf.featureCollection([item, outer]));
  return [
    feature({ name: split.inner.label, zone: split.inner.zone }, inner.geometry),
    feature({ name: split.outer.label, zone: split.outer.zone }, outer.geometry),
  ];
}

const fetchJson = (url) => fetch(url).then((response) => response.json());
const [province, caba] = await Promise.all([fetchJson(SOURCES.province), fetchJson(SOURCES.caba)]);

const departments = await Promise.all(
  province.features.map(async (item) => {
    const key = String(item.properties.departamento ?? "").toLowerCase().trim();
    if (GEOJSON_SPLITS[key]) return splitDepartment(item, GEOJSON_SPLITS[key]);
    const department = GEOJSON_DEPARTMENTS[key];
    if (!department) return [];
    return [feature({ name: department.label, zone: department.zone }, withoutDelta(item.geometry))];
  }),
);

const features = [
  ...departments.flat(),
  ...caba.features.map((item) => feature({ name: `Comuna ${item.properties.comuna}`, zone: "CABA" }, item.geometry)),
];

await writeFile("public/data/amba.geojson", JSON.stringify({ type: "FeatureCollection", features }));
console.log(`Wrote ${features.length} features`);
