#!/usr/bin/env bash
# ==============================================================================
# KalaWeb - Automated PostgreSQL Backup & Cloudflare R2 / S3 Sync Script
# Runs daily via cron to prevent catastrophic data loss.
# Retention: 30 days of daily backups.
# ==============================================================================

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/kala-postgres}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/kala_cms_db_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

# Database credentials (defaults or from env)
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-kala_cms_db}"
DB_USER="${DB_USER:-kala_cms_user}"

mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting PostgreSQL backup for ${DB_NAME} (User: ${DB_USER})..."

# Export database with pg_dump and gzip compression
PGPASSWORD="${DB_PASSWORD:-${CMS_DB_PASSWORD:-}}" pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -F p \
  -d "${DB_NAME}" | gzip -9 > "${BACKUP_FILE}"

FILESIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "[$(date)] Backup completed successfully: ${BACKUP_FILE} (${FILESIZE})"

# Optional: Sync to Cloudflare R2 / S3 if rclone or aws cli is available
if command -v aws >/dev/null 2>&1 && [ -n "${R2_BUCKET_NAME:-}" ]; then
  echo "[$(date)] Uploading to Cloudflare R2 bucket: ${R2_BUCKET_NAME}..."
  aws s3 cp "${BACKUP_FILE}" "s3://${R2_BUCKET_NAME}/database-backups/" \
    --endpoint-url "${R2_ENDPOINT_URL:-}"
  echo "[$(date)] Upload to R2 successful."
fi

# Cleanup local backups older than RETENTION_DAYS
echo "[$(date)] Cleaning up local backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "kala_cms_db_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

echo "[$(date)] Backup process finished cleanly."
