import { test, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { cacheRead, cacheWrite } from './cache';

// The cache module reads `process.cwd()` at call time, so redirecting CWD in a
// `before` hook is enough to keep the on-disk artifacts under a tmpdir.
let tmp = '';

before(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'landfinder-cache-'));
  process.chdir(tmp);
});

beforeEach(() => {
  fs.rmSync(path.join(tmp, 'data'), { recursive: true, force: true });
  delete process.env.LANDFINDER_CACHE;
  delete process.env.LANDFINDER_CACHE_TTL_HOURS;
});

test('cache miss returns null on cold read', () => {
  const v = cacheRead<{ x: number }>('parcels', 'http://example/parcels', { offset: 0 });
  assert.equal(v, null);
});

test('cache write then read returns the same value', () => {
  cacheWrite('parcels', 'http://example/parcels', { offset: 0 }, { x: 42 });
  const v = cacheRead<{ x: number }>('parcels', 'http://example/parcels', { offset: 0 });
  assert.deepEqual(v, { x: 42 });
});

test('cache differentiates by query params', () => {
  cacheWrite('parcels', 'http://example/parcels', { offset: 0 }, { x: 1 });
  cacheWrite('parcels', 'http://example/parcels', { offset: 1000 }, { x: 2 });
  assert.deepEqual(
    cacheRead('parcels', 'http://example/parcels', { offset: 0 }),
    { x: 1 }
  );
  assert.deepEqual(
    cacheRead('parcels', 'http://example/parcels', { offset: 1000 }),
    { x: 2 }
  );
});

test('cache expires after TTL', () => {
  process.env.LANDFINDER_CACHE_TTL_HOURS = '0.00001'; // ~36 ms
  cacheWrite('parcels', 'http://example/parcels', { offset: 0 }, { x: 99 });
  const until = Date.now() + 50;
  while (Date.now() < until) { /* spin past the TTL */ }
  const v = cacheRead<{ x: number }>('parcels', 'http://example/parcels', { offset: 0 });
  assert.equal(v, null);
});

test('cache disabled via LANDFINDER_CACHE=0 always misses', () => {
  process.env.LANDFINDER_CACHE = '0';
  cacheWrite('parcels', 'http://example/parcels', { offset: 0 }, { x: 1 });
  assert.equal(cacheRead('parcels', 'http://example/parcels', { offset: 0 }), null);
});
