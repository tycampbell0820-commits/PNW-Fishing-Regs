import type { RawParcel } from '../lib/types';

// Counties are added by implementing this interface and registering the connector.
// Each connector is responsible for: hitting source GIS/assessor APIs, joining
// parcel / wetland / sewer / road data, and producing RawParcel records.
export interface CountyConnector {
  readonly county: string;

  // Optional minimum acreage filter applied at the source to keep ingests small.
  // The default app filter is 7 acres, so connectors can pre-filter on the wire.
  fetch(options?: FetchOptions): Promise<RawParcel[]>;
}

export interface FetchOptions {
  minGrossAcres?: number;
  // Cap the number of parcels returned. Useful for partial ingests during
  // development. Connectors may interpret this as a per-source paging limit.
  maxRecords?: number;
  // Bounded extent or specific APNs can be added later.
}
