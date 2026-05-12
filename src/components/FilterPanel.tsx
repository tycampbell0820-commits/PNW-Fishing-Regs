'use client';

import type { ParcelFilters } from '@/lib/types';

interface Props {
  counties: string[];
  filters: ParcelFilters;
  onChange: (next: ParcelFilters) => void;
  onReset: () => void;
}

export function FilterPanel({ counties, filters, onChange, onReset }: Props) {
  const set = <K extends keyof ParcelFilters>(key: K, value: ParcelFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const num = (v: string): number | undefined =>
    v === '' ? undefined : Number(v);

  return (
    <div className="filter-panel">
      <h2>County</h2>
      <div className="group">
        <select
          value={filters.county ?? ''}
          onChange={e => set('county', e.target.value === '' ? undefined : e.target.value)}
        >
          <option value="">All counties</option>
          {counties.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <h2>Acreage</h2>
      <div className="group">
        <label className="field">Min gross acres</label>
        <input
          type="number"
          min={0}
          step={0.5}
          value={filters.min_gross_acres ?? ''}
          onChange={e => set('min_gross_acres', num(e.target.value))}
          placeholder="7"
        />
      </div>
      <div className="group">
        <label className="field">Min usable acres</label>
        <input
          type="number"
          min={0}
          step={0.5}
          value={filters.min_usable_acres ?? ''}
          onChange={e => set('min_usable_acres', num(e.target.value))}
          placeholder="any"
        />
      </div>

      <h2>Constraints</h2>
      <div className="group">
        <label className="field">Max wetland %</label>
        <input
          type="number"
          min={0}
          max={100}
          step={1}
          value={filters.max_wetland_percent != null ? filters.max_wetland_percent * 100 : ''}
          onChange={e => {
            const raw = e.target.value;
            set('max_wetland_percent', raw === '' ? undefined : Number(raw) / 100);
          }}
          placeholder="any"
        />
      </div>
      <div className="group">
        <label className="field">Max improvement ratio</label>
        <input
          type="number"
          min={0}
          step={0.1}
          value={filters.max_improvement_ratio ?? ''}
          onChange={e => set('max_improvement_ratio', num(e.target.value))}
          placeholder="any"
        />
      </div>

      <h2>Access</h2>
      <div className="group">
        <label className="field">Sewer access</label>
        <select
          value={filters.sewer_access == null ? '' : String(filters.sewer_access)}
          onChange={e =>
            set('sewer_access', e.target.value === '' ? undefined : e.target.value === 'true')
          }
        >
          <option value="">Any</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div className="group">
        <label className="field">Road access</label>
        <select
          value={filters.road_access == null ? '' : String(filters.road_access)}
          onChange={e =>
            set('road_access', e.target.value === '' ? undefined : e.target.value === 'true')
          }
        >
          <option value="">Any</option>
          <option value="true">Touches public road</option>
          <option value="false">No frontage</option>
        </select>
      </div>

      <h2>Score & Contact</h2>
      <div className="group">
        <label className="field">Min Finished Lot Score</label>
        <input
          type="number"
          min={0}
          max={100}
          step={1}
          value={filters.min_score ?? ''}
          onChange={e => set('min_score', num(e.target.value))}
          placeholder="any"
        />
      </div>
      <div className="group">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={!!filters.mailing_address_required}
            onChange={e => set('mailing_address_required', e.target.checked || undefined)}
          />
          Mailing address required
        </label>
      </div>

      <button className="reset" onClick={onReset}>Reset filters</button>
    </div>
  );
}
