import type { Parcel } from './types';

// Fields required in the mailing-list export.
export const EXPORT_FIELDS: (keyof Parcel)[] = [
  'owner_name',
  'mailing_address',
  'site_address',
  'apn',
  'county',
  'gross_acres',
  'usable_acres',
  'wetland_percent',
  'inside_sewer_service_area',
  'distance_to_sewer',
  'touches_public_road',
  'finished_lot_potential_score',
  'land_value',
  'improvement_value',
  'improvement_ratio',
  'last_sale_date'
];

function csvEscape(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function parcelsToCsv(parcels: Parcel[], fields: (keyof Parcel)[] = EXPORT_FIELDS): string {
  const header = fields.join(',');
  const lines = parcels.map(p => fields.map(f => csvEscape(p[f])).join(','));
  return [header, ...lines].join('\n') + '\n';
}
