import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_html" ADD COLUMN "allow_scripts" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_html" ADD COLUMN "allow_scripts" boolean DEFAULT false;
  ALTER TABLE "landing_pages_blocks_html" ADD COLUMN "allow_scripts" boolean DEFAULT false;
  ALTER TABLE "_landing_pages_v_blocks_html" ADD COLUMN "allow_scripts" boolean DEFAULT false;
  ALTER TABLE "page_templates_blocks_html" ADD COLUMN "allow_scripts" boolean DEFAULT false;
  ALTER TABLE "block_templates_blocks_html" ADD COLUMN "allow_scripts" boolean DEFAULT false;
  ALTER TABLE "_block_templates_v_blocks_html" ADD COLUMN "allow_scripts" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_html" DROP COLUMN "allow_scripts";
  ALTER TABLE "_pages_v_blocks_html" DROP COLUMN "allow_scripts";
  ALTER TABLE "landing_pages_blocks_html" DROP COLUMN "allow_scripts";
  ALTER TABLE "_landing_pages_v_blocks_html" DROP COLUMN "allow_scripts";
  ALTER TABLE "page_templates_blocks_html" DROP COLUMN "allow_scripts";
  ALTER TABLE "block_templates_blocks_html" DROP COLUMN "allow_scripts";
  ALTER TABLE "_block_templates_v_blocks_html" DROP COLUMN "allow_scripts";`)
}
