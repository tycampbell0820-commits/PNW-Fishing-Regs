import type { Parcel } from './types';

// Finished Lot Potential Score, 0–100. Missing inputs contribute 0 to that bucket.

function grossAcresPoints(gross: number | null): number {
  if (gross == null) return 0;
  if (gross >= 7) return 20;
  if (gross >= 5) return 10;
  return 0;
}

function usableAcresPoints(usable: number | null): number {
  if (usable == null) return 0;
  if (usable >= 7) return 20;
  if (usable >= 5) return 12;
  if (usable >= 3) return 6;
  return 0;
}

function sewerPoints(inside: boolean | null, distanceFt: number | null): number {
  if (inside === true) return 25;
  if (distanceFt != null) {
    if (distanceFt <= 500) return 20;
    if (distanceFt <= 1000) return 10;
  }
  return 0;
}

function wetlandPoints(pct: number | null): number {
  if (pct == null) return 15; // unknown wetland — best-case bucket (treat as 0–10%)
  if (pct <= 0.1) return 15;
  if (pct <= 0.25) return 10;
  if (pct <= 0.4) return 5;
  return 0;
}

function roadPoints(touches: boolean | null, frontageFt: number | null): number {
  if (touches === true) return 10;
  // Some connectors flag near-road (within 100 ft) with touches=false + a small
  // frontage value (the nearest-edge distance). Treat that as the 5-point tier.
  if (touches === false && frontageFt != null && frontageFt > 0 && frontageFt <= 100) return 5;
  return 0;
}

function improvementRatioPoints(ratio: number | null): number {
  if (ratio == null) return 0;
  if (ratio < 0.2) return 5;
  if (ratio <= 0.5) return 3;
  return 0;
}

function mailingAddressPoints(mailing: string | null): number {
  return mailing && mailing.trim().length > 0 ? 5 : 0;
}

export function scoreParcel(p: Parcel): number {
  return (
    grossAcresPoints(p.gross_acres) +
    usableAcresPoints(p.usable_acres) +
    sewerPoints(p.inside_sewer_service_area, p.distance_to_sewer) +
    wetlandPoints(p.wetland_percent) +
    roadPoints(p.touches_public_road, p.estimated_road_frontage) +
    improvementRatioPoints(p.improvement_ratio) +
    mailingAddressPoints(p.mailing_address)
  );
}
