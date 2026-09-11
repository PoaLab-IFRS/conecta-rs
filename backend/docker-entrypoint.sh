#!/bin/sh
set -e

echo "Running database migrations..."
i=0
until yarn prisma migrate deploy; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "Migrations failed after retries"
    exit 1
  fi
  echo "Database not ready, retrying in 2s..."
  sleep 2
done

echo "Starting API..."
exec node dist/index.js
