import * as migration_20261025_141832_add_seo_audit from './20261025_141832_add_seo_audit';
import * as migration_20261104_003446_full_schema_sync from './20261104_003446_full_schema_sync';
import * as migration_20261104_020403_add_visual_builder_and_basic_blocks from './20261104_020403_add_visual_builder_and_basic_blocks';
import * as migration_20261104_030141_add_html_block from './20261104_030141_add_html_block';
import * as migration_20261104_031712_add_html_sandbox_flag from './20261104_031712_add_html_sandbox_flag';

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
    name: '20261104_020403_add_visual_builder_and_basic_blocks',
  },
  {
    up: migration_20261104_030141_add_html_block.up,
    down: migration_20261104_030141_add_html_block.down,
    name: '20261104_030141_add_html_block',
  },
  {
    up: migration_20261104_031712_add_html_sandbox_flag.up,
    down: migration_20261104_031712_add_html_sandbox_flag.down,
    name: '20261104_031712_add_html_sandbox_flag'
  },
];
