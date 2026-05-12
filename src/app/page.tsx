'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FilterPanel } from '@/components/FilterPanel';
import { ResultsTable } from '@/components/ResultsTable';
import { ParcelDetailPanel } from '@/components/ParcelDetailPanel';
import type { Parcel, ParcelFilters, SortDirection } from '@/lib/types';

const DEFAULT_FILTERS: ParcelFilters = {
  min_gross_acres: 7
};

function filtersToParams(f: ParcelFilters, sortBy: keyof Parcel, sortDir: SortDirection): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) {
    if (v == null || v === '') continue;
    p.set(k, String(v));
  }
  p.set('sort_by', String(sortBy));
  p.set('sort_dir', sortDir);
  return p.toString();
}

export default function HomePage() {
  const [filters, setFilters] = useState<ParcelFilters>(DEFAULT_FILTERS);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof Parcel>('finished_lot_potential_score');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<Parcel | null>(null);

  const queryString = useMemo(
    () => filtersToParams(filters, sortBy, sortDir),
    [filters, sortBy, sortDir]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/parcels?${queryString}`)
      .then(async r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ parcels: Parcel[]; count: number }>;
      })
      .then(data => {
        if (cancelled) return;
        setParcels(data.parcels);
      })
      .catch(e => { if (!cancelled) setError(String(e.message ?? e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [queryString]);

  const onSort = useCallback((key: keyof Parcel) => {
    setSortBy(prev => {
      if (prev === key) {
        setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('desc');
      return key;
    });
  }, []);

  const toggleSelect = useCallback((key: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const allKeys = useMemo(() => parcels.map(p => `${p.county}::${p.apn}`), [parcels]);
  const allSelected = allKeys.length > 0 && allKeys.every(k => selected.has(k));
  const toggleAll = useCallback(() => {
    setSelected(prev => {
      if (allKeys.every(k => prev.has(k))) {
        const next = new Set(prev);
        for (const k of allKeys) next.delete(k);
        return next;
      }
      const next = new Set(prev);
      for (const k of allKeys) next.add(k);
      return next;
    });
  }, [allKeys]);

  const exportFiltered = () => {
    window.location.href = `/api/export?${queryString}`;
  };

  const exportSelected = async () => {
    const selections = Array.from(selected).map(key => {
      const [county, apn] = key.split('::');
      return { county, apn };
    });
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selections })
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parcels-selected.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <aside>
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={() => { setFilters(DEFAULT_FILTERS); setSelected(new Set()); }}
        />
      </aside>
      <main>
        <header className="topbar">
          <div>
            <h1>Land Finder · Snohomish County</h1>
            <div className="meta">
              {loading ? 'Loading…' : `${parcels.length} parcels`}
              {error && <span style={{ color: 'var(--bad)', marginLeft: 12 }}>· {error}</span>}
            </div>
          </div>
          <div className="actions">
            <button onClick={exportFiltered} disabled={parcels.length === 0}>
              Export filtered CSV
            </button>
            <button
              className="primary"
              onClick={exportSelected}
              disabled={selected.size === 0}
            >
              Export selected ({selected.size})
            </button>
          </div>
        </header>

        {selected.size > 0 && (
          <div className="selection-bar">
            <span>{selected.size} selected</span>
            <button onClick={() => setSelected(new Set())}>Clear selection</button>
          </div>
        )}

        <div className="table-wrap">
          <ResultsTable
            parcels={parcels}
            selected={selected}
            onToggleSelect={toggleSelect}
            onToggleAll={toggleAll}
            allSelected={allSelected}
            onRowClick={setActive}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={onSort}
          />
        </div>
      </main>

      {active && <ParcelDetailPanel parcel={active} onClose={() => setActive(null)} />}
    </div>
  );
}
