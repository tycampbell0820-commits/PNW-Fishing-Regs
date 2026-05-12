#!/bin/sh
# Container entrypoint. Seeds the SQLite store on first boot, then launches
# the Next.js standalone server. The seed pulls from whichever source the
# connector is configured for (sample fixture by default, live ArcGIS when
# LANDFINDER_LIVE=1 is set).
#
# Env flags:
#   LANDFINDER_LIVE=1       Use the live ArcGIS connector instead of fixtures.
#   LANDFINDER_REINGEST=1   One-shot: back up the existing DB and re-run the
#                           seed. On failure the backup is restored so the
#                           site keeps serving the previous data.

set -e

DB_PATH="/app/data/parcels.db"

run_seed() {
  if [ "${LANDFINDER_LIVE:-0}" = "1" ]; then
    echo "[startup] LANDFINDER_LIVE=1 — running live ArcGIS ingest…"
    node node_modules/tsx/dist/cli.mjs src/scripts/ingest.ts "Snohomish County, WA"
  else
    echo "[startup] LANDFINDER_LIVE=0 — seeding with fixture data…"
    node node_modules/tsx/dist/cli.mjs src/scripts/seed.ts
  fi
}

if [ "${LANDFINDER_REINGEST:-0}" = "1" ] && [ -f "$DB_PATH" ]; then
  echo "[startup] LANDFINDER_REINGEST=1 — backing up DB and re-ingesting…"
  mv "$DB_PATH" "$DB_PATH.bak"
  rm -f "$DB_PATH-wal" "$DB_PATH-shm"
  if run_seed; then
    rm -f "$DB_PATH.bak"
  else
    echo "[startup] re-ingest failed — restoring previous DB"
    rm -f "$DB_PATH" "$DB_PATH-wal" "$DB_PATH-shm"
    mv "$DB_PATH.bak" "$DB_PATH"
  fi
elif [ ! -f "$DB_PATH" ]; then
  echo "[startup] no DB at $DB_PATH — seeding…"
  run_seed
else
  echo "[startup] DB present at $DB_PATH"
fi

echo "[startup] launching Next.js on :${PORT:-3000}"
exec node server.js
