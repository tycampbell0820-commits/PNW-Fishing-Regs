import type { Parcel, RawParcel } from './types';
import { scoreParcel } from './scoring';

const safeDiv = (num: number | null | undefined, den: number | null | undefined): number | null => {
  if (num == null || den == null || den === 0) return null;
  return num / den;
};

export function normalizeParcel(raw: RawParcel): Parcel {
  const wetland_acres = raw.wetland_acres ?? 0;
  const gross = raw.gross_acres;

  const usable_acres =
    gross == null ? null : Math.max(0, gross - (raw.wetland_acres ?? 0));

  const usable_acres_percent = safeDiv(usable_acres, gross);
  const wetland_percent = safeDiv(wetland_acres, gross);
  const improvement_ratio = safeDiv(raw.improvement_value, raw.land_value);

  const total_value =
    raw.total_value ??
    ((raw.land_value ?? 0) + (raw.improvement_value ?? 0) || null);

  const partial: Parcel = {
    ...raw,
    usable_acres,
    usable_acres_percent,
    wetland_percent,
    improvement_ratio,
    total_value,
    finished_lot_potential_score: null,
    last_updated: new Date().toISOString()
  };

  partial.finished_lot_potential_score = scoreParcel(partial);
  return partial;
}
