import * as migration_20261025_141832_add_seo_audit from './20261025_141832_add_seo_audit';
import * as migration_20261104_003446_full_schema_sync from './20261104_003446_full_schema_sync';

export const migrations = [
  {
    up: migration_20261025_141832_add_seo_audit.up,
    down: migration_20261025_141832_add_seo_audit.down,
    name: '20261025_141832_add_seo_audit',
  },
  {
    up: migration_20261104_003446_full_schema_sync.up,
    down: migration_20261104_003446_full_schema_sync.down,
    name: '20261104_003446_full_schema_sync',
  },
];
