#!/bin/sh
# Container entrypoint. Seeds the SQLite store on first boot, then launches
# the Next.js standalone server. The seed pulls from whichever source the
# connector is configured for (sample fixture by default, live ArcGIS when
# LANDFINDER_LIVE=1 is set).

set -e

DB_PATH="/app/data/parcels.db"

if [ ! -f "$DB_PATH" ]; then
  echo "[startup] no DB at $DB_PATH — seeding…"
  if [ "${LANDFINDER_LIVE:-0}" = "1" ]; then
    node_modules/.bin/tsx src/scripts/ingest.ts "Snohomish County, WA"
  else
    node_modules/.bin/tsx src/scripts/seed.ts
  fi
else
  echo "[startup] DB present at $DB_PATH"
fi

echo "[startup] launching Next.js on :${PORT:-3000}"
exec node server.js
