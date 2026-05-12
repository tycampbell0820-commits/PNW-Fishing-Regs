export const fmtAcres = (v: number | null | undefined): string =>
  v == null ? '—' : v.toFixed(2);

export const fmtPercent = (v: number | null | undefined): string =>
  v == null ? '—' : `${(v * 100).toFixed(1)}%`;

export const fmtMoney = (v: number | null | undefined): string => {
  if (v == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(v);
};

export const fmtRatio = (v: number | null | undefined): string =>
  v == null ? '—' : v.toFixed(2);

export const fmtDate = (v: string | null | undefined): string => {
  if (!v) return '—';
  // Accept ISO or yyyy-mm-dd; render yyyy-mm-dd.
  return v.slice(0, 10);
};

export const fmtFeet = (v: number | null | undefined): string =>
  v == null ? '—' : `${Math.round(v).toLocaleString()} ft`;

export const fmtScore = (v: number | null | undefined): string =>
  v == null ? '—' : Math.round(v).toString();

export function scoreTier(v: number | null | undefined): 'a' | 'b' | 'c' {
  if (v == null) return 'c';
  if (v >= 75) return 'a';
  if (v >= 55) return 'b';
  return 'c';
}
