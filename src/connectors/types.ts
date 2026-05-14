import type { RawParcel } from '../lib/types';

// Counties are added by implementing this interface and registering the connector.
// Each connector is responsible for: hitting source GIS/assessor APIs, joining
// parcel / wetland / sewer / road data, and producing RawParcel records.
//
// Connectors stream parcels in pages so very large counties can ingest without
// holding the full dataset in memory at once.
export interface CountyConnector {
  readonly county: string;
  fetchStream(options?: FetchOptions): AsyncIterable<RawParcel[]>;
}

export interface FetchOptions {
  minGrossAcres?: number;
  // Cap the number of parcels returned. Useful for partial ingests during
  // development. Connectors may interpret this as a per-source paging limit.
  maxRecords?: number;
  // Bounded extent or specific APNs can be added later.
}
