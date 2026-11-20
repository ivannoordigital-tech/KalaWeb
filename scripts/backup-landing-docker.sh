#!/usr/bin/env bash
# Backup landing page dari VPS yang tidak memiliki Node.js di host.
# Menjalankan script Node di container node:20-alpine dengan repo di-mount.
set -euo pipefail

cd "$(dirname "$0")/.."

docker run --rm \
  --user "$(id -u):$(id -g)" \
  -v "$PWD:/app" \
  -w /app \
  node:20-alpine \
  node scripts/backup-landing-page.mjs
