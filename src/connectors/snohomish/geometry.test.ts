import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  haversineFeet,
  metersToFeet,
  polygonAreaAcres,
  polygonCentroid,
  polygonEnvelope,
  squareMetersToAcres
} from './geometry';
import type { Geometry } from './arcgis';

// Roughly 1 acre near the equator: 63.6m × 63.6m square. Construct one and
// verify the area conversion lands within 1% of 1.0 acres.
const ONE_ACRE_AT_EQUATOR: Geometry = {
  type: 'Polygon',
  coordinates: [[
    [0, 0],
    [0.00057, 0],
    [0.00057, 0.00057],
    [0, 0.00057],
    [0, 0]
  ]]
};

test('squareMetersToAcres matches the survey constant', () => {
  assert.equal(squareMetersToAcres(4046.8564224), 1);
  assert.ok(Math.abs(squareMetersToAcres(8093.7128448) - 2) < 1e-9);
});

test('metersToFeet matches the international foot', () => {
  // 1 m = 3.28084 ft
  assert.ok(Math.abs(metersToFeet(1) - 3.280839895013123) < 1e-9);
});

test('polygonAreaAcres returns ~1 acre for a 63.6m square at the equator', () => {
  const acres = polygonAreaAcres(ONE_ACRE_AT_EQUATOR);
  assert.ok(acres > 0.9 && acres < 1.1, `expected ~1 acre, got ${acres}`);
});

test('polygonCentroid returns the average of the ring vertices', () => {
  const c = polygonCentroid(ONE_ACRE_AT_EQUATOR);
  assert.ok(c !== null);
  assert.ok(Math.abs(c![0] - 0.000228) < 1e-5);
  assert.ok(Math.abs(c![1] - 0.000228) < 1e-5);
});

test('polygonEnvelope returns tight bounds', () => {
  const env = polygonEnvelope(ONE_ACRE_AT_EQUATOR);
  assert.deepEqual(env, [0, 0, 0.00057, 0.00057]);
});

test('haversineFeet measures ~328 ft for 100 m of separation', () => {
  // Two points 100 m apart along the equator.
  const a: [number, number] = [0, 0];
  const b: [number, number] = [0.000898, 0];
  const d = haversineFeet(a, b);
  assert.ok(d > 320 && d < 340, `expected ~328 ft, got ${d}`);
});
