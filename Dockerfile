# Land Finder — production image.
# Multi-stage build: deps -> build -> runtime. Uses Next.js standalone output.
#
# Build:   docker build -t land-finder .
# Run:     docker run -p 3000:3000 -v landfinder-data:/app/data \
#            -e LANDFINDER_AUTH_PASSWORD=changeme land-finder

# ---- deps stage: install full deps for the build ----
FROM node:22-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 build-essential ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- build stage: produce .next/standalone ----
FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 build-essential ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runtime stage: minimal image ----
FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Install runtime deps (libsqlite3 isn't needed; better-sqlite3 statically links)
# and curl for healthcheck.
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates curl tini \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m -u 1001 node-app

# Full node_modules from the build stage. The standalone bundle below
# overwrites overlapping files, so Next's runtime tweaks still win — and
# the seed/ingest scripts (run via tsx at startup) get the full dep graph
# (@turf/*, esbuild, etc.) that the standalone trimmer would otherwise drop.
COPY --from=build --chown=node-app:node-app /app/node_modules ./node_modules

# Standalone bundle: server.js + the minimal node_modules Next packed in.
COPY --from=build --chown=node-app:node-app /app/.next/standalone ./
COPY --from=build --chown=node-app:node-app /app/.next/static ./.next/static

# Ingest CLI + connectors (not part of standalone). Used by the start script
# to seed the DB on first boot.
COPY --from=build --chown=node-app:node-app /app/src ./src
COPY --from=build --chown=node-app:node-app /app/tsconfig.json ./tsconfig.json

COPY --chown=node-app:node-app scripts/start.sh /app/start.sh
RUN chmod +x /app/start.sh && mkdir -p /app/data && chown node-app:node-app /app/data

USER node-app
VOLUME ["/app/data"]
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsS -o /dev/null http://127.0.0.1:3000/api/health || exit 1

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["/app/start.sh"]
