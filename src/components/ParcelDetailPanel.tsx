'use client';

import type { Parcel } from '@/lib/types';
import {
  fmtAcres, fmtDate, fmtFeet, fmtMoney, fmtPercent, fmtRatio, fmtScore, scoreTier
} from '@/lib/format';
import { parcelLookupUrl } from '@/connectors/snohomish/endpoints';

interface Props {
  parcel: Parcel;
  onClose: () => void;
}

export function ParcelDetailPanel({ parcel, onClose }: Props) {
  const mapQuery = encodeURIComponent(parcel.site_address ?? parcel.apn);
  const googleMaps = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const countyLookup = parcel.county.startsWith('Snohomish')
    ? parcelLookupUrl(parcel.apn)
    : null;

  return (
    <>
      <div className="detail-overlay" onClick={onClose} />
      <aside className="detail-panel" role="dialog" aria-label="Parcel detail">
        <div className="detail-header">
          <div>
            <h2>{parcel.site_address || parcel.apn}</h2>
            <div className="sub">{parcel.county} · APN {parcel.apn}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`score-pill tier-${scoreTier(parcel.finished_lot_potential_score)}`}>
              Score {fmtScore(parcel.finished_lot_potential_score)}
            </span>
            <button onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        <div className="detail-section">
          <h3>Owner</h3>
          <dl className="detail-grid">
            <dt>Owner name</dt><dd>{parcel.owner_name ?? '—'}</dd>
            <dt>Mailing address</dt><dd>{parcel.mailing_address ?? '—'}</dd>
            <dt>Site address</dt><dd>{parcel.site_address ?? '—'}</dd>
          </dl>
        </div>

        <div className="detail-section">
          <h3>Acreage</h3>
          <dl className="detail-grid">
            <dt>Gross acres</dt><dd>{fmtAcres(parcel.gross_acres)}</dd>
            <dt>Usable acres</dt><dd>{fmtAcres(parcel.usable_acres)}</dd>
            <dt>Usable %</dt><dd>{fmtPercent(parcel.usable_acres_percent)}</dd>
            <dt>Wetland acres</dt><dd>{fmtAcres(parcel.wetland_acres)}</dd>
            <dt>Wetland %</dt><dd>{fmtPercent(parcel.wetland_percent)}</dd>
          </dl>
        </div>

        <div className="detail-section">
          <h3>Access</h3>
          <dl className="detail-grid">
            <dt>In sewer SSA</dt><dd>{boolLabel(parcel.inside_sewer_service_area)}</dd>
            <dt>Dist. to sewer</dt><dd>{fmtFeet(parcel.distance_to_sewer)}</dd>
            <dt>Public road</dt><dd>{boolLabel(parcel.touches_public_road)}</dd>
            <dt>Est. road frontage</dt><dd>{fmtFeet(parcel.estimated_road_frontage)}</dd>
          </dl>
        </div>

        <div className="detail-section">
          <h3>Valuation</h3>
          <dl className="detail-grid">
            <dt>Land value</dt><dd>{fmtMoney(parcel.land_value)}</dd>
            <dt>Improvement value</dt><dd>{fmtMoney(parcel.improvement_value)}</dd>
            <dt>Total value</dt><dd>{fmtMoney(parcel.total_value)}</dd>
            <dt>Improvement ratio</dt><dd>{fmtRatio(parcel.improvement_ratio)}</dd>
            <dt>Last sale</dt><dd>{fmtDate(parcel.last_sale_date)}</dd>
          </dl>
        </div>

        <div className="detail-section">
          <h3>Links</h3>
          <div className="links">
            <a href={googleMaps} target="_blank" rel="noreferrer">Google Maps search</a>
            {countyLookup && (
              <a href={countyLookup} target="_blank" rel="noreferrer">County parcel lookup</a>
            )}
            {parcel.source_url && (
              <a href={parcel.source_url} target="_blank" rel="noreferrer">Source record</a>
            )}
          </div>
        </div>

        <div className="detail-section">
          <h3>Metadata</h3>
          <dl className="detail-grid">
            <dt>Last updated</dt><dd>{fmtDate(parcel.last_updated)}</dd>
          </dl>
        </div>
      </aside>
    </>
  );
}

function boolLabel(v: boolean | null): string {
  if (v === true) return 'Yes';
  if (v === false) return 'No';
  return '—';
}
