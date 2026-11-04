import * as migration_20261025_141832_add_seo_audit from './20261025_141832_add_seo_audit';
import * as migration_20261104_003446_full_schema_sync from './20261104_003446_full_schema_sync';
import * as migration_20261104_020403_add_visual_builder_and_basic_blocks from './20261104_020403_add_visual_builder_and_basic_blocks';

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
  {
    up: migration_20261104_020403_add_visual_builder_and_basic_blocks.up,
    down: migration_20261104_020403_add_visual_builder_and_basic_blocks.down,
    name: '20261104_020403_add_visual_builder_and_basic_blocks'
  },
];
