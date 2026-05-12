'use client';

import type { Parcel, SortDirection } from '@/lib/types';
import {
  fmtAcres,
  fmtDate,
  fmtMoney,
  fmtPercent,
  fmtRatio,
  fmtScore,
  scoreTier
} from '@/lib/format';

interface Column {
  key: keyof Parcel;
  label: string;
  numeric?: boolean;
  render?: (p: Parcel) => React.ReactNode;
}

const COLUMNS: Column[] = [
  {
    key: 'finished_lot_potential_score',
    label: 'Score',
    numeric: true,
    render: p => (
      <span className={`score-pill tier-${scoreTier(p.finished_lot_potential_score)}`}>
        {fmtScore(p.finished_lot_potential_score)}
      </span>
    )
  },
  { key: 'apn', label: 'APN' },
  { key: 'owner_name', label: 'Owner' },
  { key: 'site_address', label: 'Site Address' },
  { key: 'mailing_address', label: 'Mailing Address' },
  { key: 'gross_acres', label: 'Gross Ac', numeric: true, render: p => fmtAcres(p.gross_acres) },
  { key: 'usable_acres', label: 'Usable Ac', numeric: true, render: p => fmtAcres(p.usable_acres) },
  { key: 'wetland_percent', label: 'Wetland %', numeric: true, render: p => fmtPercent(p.wetland_percent) },
  {
    key: 'inside_sewer_service_area',
    label: 'Sewer',
    render: p => <AccessBadge value={p.inside_sewer_service_area} yesLabel="In SSA" noLabel="Out" />
  },
  {
    key: 'touches_public_road',
    label: 'Road',
    render: p => <AccessBadge value={p.touches_public_road} yesLabel="Touches" noLabel="No" />
  },
  { key: 'land_value', label: 'Land Value', numeric: true, render: p => fmtMoney(p.land_value) },
  { key: 'improvement_value', label: 'Improv. Value', numeric: true, render: p => fmtMoney(p.improvement_value) },
  { key: 'improvement_ratio', label: 'Improv. Ratio', numeric: true, render: p => fmtRatio(p.improvement_ratio) },
  { key: 'last_sale_date', label: 'Last Sale', render: p => fmtDate(p.last_sale_date) }
];

function AccessBadge({
  value, yesLabel, noLabel
}: { value: boolean | null; yesLabel: string; noLabel: string }) {
  if (value === true) return <span className="badge yes">{yesLabel}</span>;
  if (value === false) return <span className="badge no">{noLabel}</span>;
  return <span className="badge unk">—</span>;
}

interface Props {
  parcels: Parcel[];
  selected: Set<string>;
  onToggleSelect: (key: string) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  onRowClick: (p: Parcel) => void;
  sortBy: keyof Parcel;
  sortDir: SortDirection;
  onSort: (key: keyof Parcel) => void;
}

export function ResultsTable({
  parcels, selected, onToggleSelect, onToggleAll, allSelected,
  onRowClick, sortBy, sortDir, onSort
}: Props) {
  if (parcels.length === 0) {
    return <div className="empty">No parcels match the current filters.</div>;
  }

  const arrow = (key: keyof Parcel) =>
    key === sortBy ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  return (
    <table className="parcels">
      <thead>
        <tr>
          <th className="sticky-left">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onToggleAll}
              aria-label="Select all"
            />
          </th>
          {COLUMNS.map(c => (
            <th
              key={c.key}
              className={c.numeric ? 'num' : ''}
              onClick={() => onSort(c.key)}
            >
              {c.label}{arrow(c.key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {parcels.map(p => {
          const key = `${p.county}::${p.apn}`;
          const isSel = selected.has(key);
          return (
            <tr
              key={key}
              className={isSel ? 'selected' : ''}
              onClick={() => onRowClick(p)}
            >
              <td className="sticky-left" onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={isSel}
                  onChange={() => onToggleSelect(key)}
                />
              </td>
              {COLUMNS.map(c => (
                <td key={c.key} className={c.numeric ? 'num' : ''}>
                  {c.render
                    ? c.render(p)
                    : (p[c.key] == null ? '—' : String(p[c.key]))}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
