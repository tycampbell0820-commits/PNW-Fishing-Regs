import type { ParcelFilters, ParcelQuery, SortDirection } from './types';

const num = (v: string | null): number | undefined => {
  if (v == null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const bool = (v: string | null): boolean | undefined => {
  if (v == null || v === '') return undefined;
  if (v === 'true' || v === '1') return true;
  if (v === 'false' || v === '0') return false;
  return undefined;
};

export function parseFilters(params: URLSearchParams): ParcelFilters {
  return {
    county: params.get('county') ?? undefined,
    min_gross_acres: num(params.get('min_gross_acres')),
    min_usable_acres: num(params.get('min_usable_acres')),
    max_wetland_percent: num(params.get('max_wetland_percent')),
    sewer_access: bool(params.get('sewer_access')),
    road_access: bool(params.get('road_access')),
    max_improvement_ratio: num(params.get('max_improvement_ratio')),
    min_score: num(params.get('min_score')),
    mailing_address_required: bool(params.get('mailing_address_required'))
  };
}

export function parseQuery(params: URLSearchParams): ParcelQuery {
  const dir = params.get('sort_dir');
  const sort_dir: SortDirection | undefined =
    dir === 'asc' || dir === 'desc' ? dir : undefined;
  return {
    ...parseFilters(params),
    sort_by: (params.get('sort_by') as ParcelQuery['sort_by']) ?? undefined,
    sort_dir,
    limit: num(params.get('limit')),
    offset: num(params.get('offset'))
  };
}
