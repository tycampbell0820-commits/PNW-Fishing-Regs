import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { cacheRead, cacheWrite } from './cache';

// Each test uses a distinct query-params object so concurrent execution can't
// step on another test's cache entry. The tmpdir is created once and used by
// all tests.

let tmp = '';

before(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'landfinder-cache-'));
  process.chdir(tmp);
});

test('cache miss returns null on cold read', () => {
  const v = cacheRead<{ x: number }>('parcels', 'http://example/parcels', { case: 'cold' });
  assert.equal(v, null);
});

test('cache write then read returns the same value', () => {
  cacheWrite('parcels', 'http://example/parcels', { case: 'roundtrip' }, { x: 42 });
  const v = cacheRead<{ x: number }>('parcels', 'http://example/parcels', { case: 'roundtrip' });
  assert.deepEqual(v, { x: 42 });
});

test('cache differentiates by query params', () => {
  cacheWrite('parcels', 'http://example/parcels', { case: 'distinct', offset: 0 }, { x: 1 });
  cacheWrite('parcels', 'http://example/parcels', { case: 'distinct', offset: 1000 }, { x: 2 });
  assert.deepEqual(
    cacheRead('parcels', 'http://example/parcels', { case: 'distinct', offset: 0 }),
    { x: 1 }
  );
  assert.deepEqual(
    cacheRead('parcels', 'http://example/parcels', { case: 'distinct', offset: 1000 }),
    { x: 2 }
  );
});

test('cache expires after TTL', () => {
  const prevTtl = process.env.LANDFINDER_CACHE_TTL_HOURS;
  process.env.LANDFINDER_CACHE_TTL_HOURS = '0.00001'; // ~36 ms
  try {
    cacheWrite('parcels', 'http://example/parcels', { case: 'ttl' }, { x: 99 });
    const until = Date.now() + 50;
    while (Date.now() < until) { /* spin past the TTL */ }
    const v = cacheRead<{ x: number }>('parcels', 'http://example/parcels', { case: 'ttl' });
    assert.equal(v, null);
  } finally {
    if (prevTtl == null) delete process.env.LANDFINDER_CACHE_TTL_HOURS;
    else process.env.LANDFINDER_CACHE_TTL_HOURS = prevTtl;
  }
});

test('cache disabled via LANDFINDER_CACHE=0 always misses', () => {
  const prev = process.env.LANDFINDER_CACHE;
  process.env.LANDFINDER_CACHE = '0';
  try {
    cacheWrite('parcels', 'http://example/parcels', { case: 'disabled' }, { x: 1 });
    assert.equal(cacheRead('parcels', 'http://example/parcels', { case: 'disabled' }), null);
  } finally {
    if (prev == null) delete process.env.LANDFINDER_CACHE;
    else process.env.LANDFINDER_CACHE = prev;
  }
});
