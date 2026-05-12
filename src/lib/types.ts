// Normalized parcel schema. All counties' connectors must produce this shape.
// Nullable fields allow ingestion to continue when a source layer is unavailable.

export type SewerStatus = boolean | null;
export type RoadStatus = boolean | null;

export interface Parcel {
  county: string;
  apn: string;

  owner_name: string | null;
  mailing_address: string | null;
  site_address: string | null;

  gross_acres: number | null;
  usable_acres: number | null;
  usable_acres_percent: number | null;

  land_value: number | null;
  improvement_value: number | null;
  total_value: number | null;
  improvement_ratio: number | null;

  last_sale_date: string | null;

  wetland_acres: number | null;
  wetland_percent: number | null;

  inside_sewer_service_area: SewerStatus;
  distance_to_sewer: number | null; // feet

  touches_public_road: RoadStatus;
  estimated_road_frontage: number | null; // feet

  finished_lot_potential_score: number | null;

  source_url: string | null;
  last_updated: string; // ISO timestamp
}

// Raw inputs from a connector before derived fields/score are computed.
export type RawParcel = Omit<
  Parcel,
  | 'usable_acres'
  | 'usable_acres_percent'
  | 'improvement_ratio'
  | 'wetland_percent'
  | 'finished_lot_potential_score'
  | 'total_value'
  | 'last_updated'
> & {
  // Connectors may provide total_value if the source gives it directly.
  total_value?: number | null;
};

export interface ParcelFilters {
  min_gross_acres?: number;
  min_usable_acres?: number;
  max_wetland_percent?: number; // 0–1
  sewer_access?: boolean;
  road_access?: boolean;
  max_improvement_ratio?: number;
  min_score?: number;
  mailing_address_required?: boolean;
  county?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface ParcelQuery extends ParcelFilters {
  sort_by?: keyof Parcel;
  sort_dir?: SortDirection;
  limit?: number;
  offset?: number;
}
