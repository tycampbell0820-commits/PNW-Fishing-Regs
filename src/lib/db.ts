import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import type { Parcel, ParcelQuery } from './types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'parcels.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS parcels (
      county TEXT NOT NULL,
      apn TEXT NOT NULL,
      owner_name TEXT,
      mailing_address TEXT,
      site_address TEXT,
      gross_acres REAL,
      usable_acres REAL,
      usable_acres_percent REAL,
      land_value REAL,
      improvement_value REAL,
      total_value REAL,
      improvement_ratio REAL,
      last_sale_date TEXT,
      wetland_acres REAL,
      wetland_percent REAL,
      inside_sewer_service_area INTEGER,
      distance_to_sewer REAL,
      touches_public_road INTEGER,
      estimated_road_frontage REAL,
      finished_lot_potential_score REAL,
      source_url TEXT,
      last_updated TEXT NOT NULL,
      PRIMARY KEY (county, apn)
    );

    CREATE INDEX IF NOT EXISTS idx_parcels_score
      ON parcels (finished_lot_potential_score DESC);
    CREATE INDEX IF NOT EXISTS idx_parcels_county_acres
      ON parcels (county, gross_acres);
  `);

  _db = db;
  return db;
}

const PARCEL_COLUMNS: (keyof Parcel)[] = [
  'county', 'apn', 'owner_name', 'mailing_address', 'site_address',
  'gross_acres', 'usable_acres', 'usable_acres_percent',
  'land_value', 'improvement_value', 'total_value', 'improvement_ratio',
  'last_sale_date', 'wetland_acres', 'wetland_percent',
  'inside_sewer_service_area', 'distance_to_sewer',
  'touches_public_road', 'estimated_road_frontage',
  'finished_lot_potential_score', 'source_url', 'last_updated'
];

const toDbValue = (v: unknown): unknown => {
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (v === undefined) return null;
  return v;
};

const fromDbRow = (row: Record<string, unknown>): Parcel => ({
  ...(row as unknown as Parcel),
  inside_sewer_service_area:
    row.inside_sewer_service_area == null ? null : Boolean(row.inside_sewer_service_area),
  touches_public_road:
    row.touches_public_road == null ? null : Boolean(row.touches_public_road)
});

export function upsertParcels(parcels: Parcel[]): number {
  const db = getDb();
  const cols = PARCEL_COLUMNS.join(', ');
  const placeholders = PARCEL_COLUMNS.map(c => `@${c}`).join(', ');
  const updateAssignments = PARCEL_COLUMNS
    .filter(c => c !== 'county' && c !== 'apn')
    .map(c => `${c} = excluded.${c}`)
    .join(', ');

  const stmt = db.prepare(`
    INSERT INTO parcels (${cols}) VALUES (${placeholders})
    ON CONFLICT(county, apn) DO UPDATE SET ${updateAssignments}
  `);

  const tx = db.transaction((batch: Parcel[]) => {
    for (const p of batch) {
      const params: Record<string, unknown> = {};
      for (const col of PARCEL_COLUMNS) params[col] = toDbValue(p[col]);
      stmt.run(params);
    }
  });

  tx(parcels);
  return parcels.length;
}

const SORTABLE_COLUMNS = new Set<string>([
  'finished_lot_potential_score', 'apn', 'owner_name', 'site_address',
  'mailing_address', 'gross_acres', 'usable_acres', 'wetland_percent',
  'inside_sewer_service_area', 'touches_public_road',
  'land_value', 'improvement_value', 'improvement_ratio', 'last_sale_date'
]);

export function queryParcels(q: ParcelQuery): Parcel[] {
  const db = getDb();
  const where: string[] = [];
  const params: Record<string, unknown> = {};

  if (q.county) { where.push('county = @county'); params.county = q.county; }
  if (q.min_gross_acres != null) {
    where.push('gross_acres >= @min_gross_acres');
    params.min_gross_acres = q.min_gross_acres;
  }
  if (q.min_usable_acres != null) {
    where.push('usable_acres >= @min_usable_acres');
    params.min_usable_acres = q.min_usable_acres;
  }
  if (q.max_wetland_percent != null) {
    where.push('(wetland_percent IS NULL OR wetland_percent <= @max_wetland_percent)');
    params.max_wetland_percent = q.max_wetland_percent;
  }
  if (q.sewer_access === true) {
    where.push('(inside_sewer_service_area = 1 OR (distance_to_sewer IS NOT NULL AND distance_to_sewer <= 1000))');
  } else if (q.sewer_access === false) {
    where.push('(inside_sewer_service_area = 0 AND (distance_to_sewer IS NULL OR distance_to_sewer > 1000))');
  }
  if (q.road_access === true) {
    where.push('touches_public_road = 1');
  } else if (q.road_access === false) {
    where.push('(touches_public_road = 0 OR touches_public_road IS NULL)');
  }
  if (q.max_improvement_ratio != null) {
    where.push('(improvement_ratio IS NULL OR improvement_ratio <= @max_improvement_ratio)');
    params.max_improvement_ratio = q.max_improvement_ratio;
  }
  if (q.min_score != null) {
    where.push('finished_lot_potential_score >= @min_score');
    params.min_score = q.min_score;
  }
  if (q.mailing_address_required) {
    where.push("mailing_address IS NOT NULL AND TRIM(mailing_address) <> ''");
  }

  const sortCol = q.sort_by && SORTABLE_COLUMNS.has(q.sort_by)
    ? q.sort_by
    : 'finished_lot_potential_score';
  const sortDir = q.sort_dir === 'asc' ? 'ASC' : 'DESC';

  const limit = Math.min(Math.max(q.limit ?? 500, 1), 5000);
  const offset = Math.max(q.offset ?? 0, 0);

  const sql = `
    SELECT * FROM parcels
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY ${sortCol} ${sortDir} NULLS LAST, apn ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const rows = db.prepare(sql).all(params) as Record<string, unknown>[];
  return rows.map(fromDbRow);
}

export function getParcel(county: string, apn: string): Parcel | null {
  const db = getDb();
  const row = db
    .prepare('SELECT * FROM parcels WHERE county = ? AND apn = ?')
    .get(county, apn) as Record<string, unknown> | undefined;
  return row ? fromDbRow(row) : null;
}

export function listCounties(): string[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT DISTINCT county FROM parcels WHERE county IS NOT NULL AND TRIM(county) <> '' ORDER BY county")
    .all() as { county: string }[];
  return rows.map(r => r.county);
}

export function countParcels(county?: string): number {
  const db = getDb();
  const sql = county
    ? 'SELECT COUNT(*) as c FROM parcels WHERE county = ?'
    : 'SELECT COUNT(*) as c FROM parcels';
  const row = (county ? db.prepare(sql).get(county) : db.prepare(sql).get()) as { c: number };
  return row.c;
}
