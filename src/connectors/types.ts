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
  // Bounded extent or specific APNs can be added later; out of scope for Phase 1.
}
