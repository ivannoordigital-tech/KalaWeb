import * as migration_20261025_141832_add_seo_audit from './20261025_141832_add_seo_audit';

export const migrations = [
  {
    up: migration_20261025_141832_add_seo_audit.up,
    down: migration_20261025_141832_add_seo_audit.down,
    name: '20261025_141832_add_seo_audit'
  },
];
