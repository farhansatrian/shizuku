#!/bin/sh
set -e

echo "=== shizuku (雫) Production Container Starting ==="

mkdir -p "${UPLOAD_DIR:-/app/data/uploads}"

if [ "${RUN_DB_PUSH:-true}" = "true" ]; then
  echo "=> Syncing SQLite schema (prisma db push)..."
  prisma db push --skip-generate
fi

if [ "${RUN_SEED:-true}" = "true" ]; then
  echo "=> Ensuring initial profile & admin seed..."
  tsx prisma/seed.ts
fi

echo "=> Launching shizuku on port ${PORT:-3000}..."
exec "$@"
