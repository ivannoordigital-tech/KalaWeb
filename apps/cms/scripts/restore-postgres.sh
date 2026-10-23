#!/usr/bin/env bash
# ==============================================================================
# KalaWeb - PostgreSQL Restore Script
# Safely restores a compressed SQL backup into the kala_cms_db database.
# ==============================================================================

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 /path/to/kala_cms_db_YYYYMMDD_HHMMSS.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Backup file ${BACKUP_FILE} not found."
  exit 1
fi

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-kala_cms_db}"
DB_USER="${DB_USER:-kala_cms_user}"

echo "WARNING: Restoring will overwrite existing data in '${DB_NAME}'!"
read -p "Are you sure you want to proceed? (y/N): " -r CONFIRM
if [[ ! "${CONFIRM}" =~ ^[Yy]$ ]]; then
  echo "Restore aborted by user."
  exit 0
fi

echo "[$(date)] Restoring ${BACKUP_FILE} into ${DB_NAME} (User: ${DB_USER})..."
gunzip -c "${BACKUP_FILE}" | PGPASSWORD="${DB_PASSWORD:-${CMS_DB_PASSWORD:-}}" psql \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}"

echo "[$(date)] Database restored successfully!"
