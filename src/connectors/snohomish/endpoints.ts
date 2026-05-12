// Snohomish County public GIS sources used by this connector.
// All endpoints below are public ArcGIS REST / county data services. They are
// referenced here so the connector code stays declarative and so swapping a
// URL doesn't require touching the fetch logic.

export const SNOHOMISH = {
  county: 'Snohomish County, WA',

  // ArcGIS REST MapServer / FeatureServer endpoints. The exact layer index
  // can drift between county updates — keep these centralized for maintenance.
  parcels:
    'https://gis.snoco.org/arcgis/rest/services/MapServices/Parcels/MapServer/0/query',

  // Assessor account/owner data. Joined to parcels via PIN/APN.
  assessor:
    'https://gis.snoco.org/arcgis/rest/services/MapServices/Assessor/MapServer/0/query',

  // Wetlands and critical areas overlay for wetland acreage intersection.
  wetlands:
    'https://gis.snoco.org/arcgis/rest/services/MapServices/CriticalAreas/MapServer/0/query',

  // Sewer service area polygons + sewer mains for distance lookups.
  sewerServiceArea:
    'https://gis.snoco.org/arcgis/rest/services/MapServices/SewerServiceArea/MapServer/0/query',
  sewerMains:
    'https://gis.snoco.org/arcgis/rest/services/MapServices/SewerMains/MapServer/0/query',

  // Public road centerlines and right-of-way for touches/frontage checks.
  roadCenterlines:
    'https://gis.snoco.org/arcgis/rest/services/MapServices/RoadCenterlines/MapServer/0/query',

  // Per-parcel detail page the source_url can link to.
  parcelLookupBase:
    'https://propertyresearch.snoco.org/Default.aspx?ParcelNumber='
};

export function parcelLookupUrl(apn: string): string {
  return `${SNOHOMISH.parcelLookupBase}${encodeURIComponent(apn)}`;
}
