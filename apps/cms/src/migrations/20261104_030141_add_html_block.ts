import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_html_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_html_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_html_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_pages_blocks_html_background" AS ENUM('transparent', 'white', 'cream', 'peach');
  CREATE TYPE "public"."enum__pages_v_blocks_html_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_html_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_html_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__pages_v_blocks_html_background" AS ENUM('transparent', 'white', 'cream', 'peach');
  CREATE TYPE "public"."enum_landing_pages_blocks_html_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_html_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_landing_pages_blocks_html_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_landing_pages_blocks_html_background" AS ENUM('transparent', 'white', 'cream', 'peach');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_html_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_html_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_html_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_html_background" AS ENUM('transparent', 'white', 'cream', 'peach');
  CREATE TYPE "public"."enum_page_templates_blocks_html_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_html_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_page_templates_blocks_html_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_page_templates_blocks_html_background" AS ENUM('transparent', 'white', 'cream', 'peach');
  CREATE TYPE "public"."enum_block_templates_blocks_html_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_html_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_block_templates_blocks_html_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_block_templates_blocks_html_background" AS ENUM('transparent', 'white', 'cream', 'peach');
  CREATE TYPE "public"."enum__block_templates_v_blocks_html_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_html_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__block_templates_v_blocks_html_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__block_templates_v_blocks_html_background" AS ENUM('transparent', 'white', 'cream', 'peach');
  CREATE TABLE "pages_blocks_html_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_html_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_html" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"max_width" "enum_pages_blocks_html_max_width" DEFAULT 'normal',
  	"padding" "enum_pages_blocks_html_padding" DEFAULT 'normal',
  	"background" "enum_pages_blocks_html_background" DEFAULT 'transparent',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_html_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_html_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_html" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"max_width" "enum__pages_v_blocks_html_max_width" DEFAULT 'normal',
  	"padding" "enum__pages_v_blocks_html_padding" DEFAULT 'normal',
  	"background" "enum__pages_v_blocks_html_background" DEFAULT 'transparent',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_html_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_html_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_html" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"max_width" "enum_landing_pages_blocks_html_max_width" DEFAULT 'normal',
  	"padding" "enum_landing_pages_blocks_html_padding" DEFAULT 'normal',
  	"background" "enum_landing_pages_blocks_html_background" DEFAULT 'transparent',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_html_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_html_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_html" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"max_width" "enum__landing_pages_v_blocks_html_max_width" DEFAULT 'normal',
  	"padding" "enum__landing_pages_v_blocks_html_padding" DEFAULT 'normal',
  	"background" "enum__landing_pages_v_blocks_html_background" DEFAULT 'transparent',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_html_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_html_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_html" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar NOT NULL,
  	"max_width" "enum_page_templates_blocks_html_max_width" DEFAULT 'normal',
  	"padding" "enum_page_templates_blocks_html_padding" DEFAULT 'normal',
  	"background" "enum_page_templates_blocks_html_background" DEFAULT 'transparent',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_html_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_html_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_html" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"max_width" "enum_block_templates_blocks_html_max_width" DEFAULT 'normal',
  	"padding" "enum_block_templates_blocks_html_padding" DEFAULT 'normal',
  	"background" "enum_block_templates_blocks_html_background" DEFAULT 'transparent',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_html_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_html_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_html" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"max_width" "enum__block_templates_v_blocks_html_max_width" DEFAULT 'normal',
  	"padding" "enum__block_templates_v_blocks_html_padding" DEFAULT 'normal',
  	"background" "enum__block_templates_v_blocks_html_background" DEFAULT 'transparent',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_html_visibility" ADD CONSTRAINT "pages_blocks_html_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_html"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_html" ADD CONSTRAINT "pages_blocks_html_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_html_visibility" ADD CONSTRAINT "_pages_v_blocks_html_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_html"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_html" ADD CONSTRAINT "_pages_v_blocks_html_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_html_visibility" ADD CONSTRAINT "landing_pages_blocks_html_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_html"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_html" ADD CONSTRAINT "landing_pages_blocks_html_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_html_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_html_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_html"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_html" ADD CONSTRAINT "_landing_pages_v_blocks_html_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_html_visibility" ADD CONSTRAINT "page_templates_blocks_html_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_html"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_html" ADD CONSTRAINT "page_templates_blocks_html_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_html_visibility" ADD CONSTRAINT "block_templates_blocks_html_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_html"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_html" ADD CONSTRAINT "block_templates_blocks_html_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_html_visibility" ADD CONSTRAINT "_block_templates_v_blocks_html_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_html"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_html" ADD CONSTRAINT "_block_templates_v_blocks_html_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_html_visibility_order_idx" ON "pages_blocks_html_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_html_visibility_parent_idx" ON "pages_blocks_html_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_html_order_idx" ON "pages_blocks_html" USING btree ("_order");
  CREATE INDEX "pages_blocks_html_parent_id_idx" ON "pages_blocks_html" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_html_path_idx" ON "pages_blocks_html" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_html_visibility_order_idx" ON "_pages_v_blocks_html_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_html_visibility_parent_idx" ON "_pages_v_blocks_html_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_html_order_idx" ON "_pages_v_blocks_html" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_html_parent_id_idx" ON "_pages_v_blocks_html" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_html_path_idx" ON "_pages_v_blocks_html" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_html_visibility_order_idx" ON "landing_pages_blocks_html_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_html_visibility_parent_idx" ON "landing_pages_blocks_html_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_html_order_idx" ON "landing_pages_blocks_html" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_html_parent_id_idx" ON "landing_pages_blocks_html" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_html_path_idx" ON "landing_pages_blocks_html" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_html_visibility_order_idx" ON "_landing_pages_v_blocks_html_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_html_visibility_parent_idx" ON "_landing_pages_v_blocks_html_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_html_order_idx" ON "_landing_pages_v_blocks_html" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_html_parent_id_idx" ON "_landing_pages_v_blocks_html" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_html_path_idx" ON "_landing_pages_v_blocks_html" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_html_visibility_order_idx" ON "page_templates_blocks_html_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_html_visibility_parent_idx" ON "page_templates_blocks_html_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_html_order_idx" ON "page_templates_blocks_html" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_html_parent_id_idx" ON "page_templates_blocks_html" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_html_path_idx" ON "page_templates_blocks_html" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_html_visibility_order_idx" ON "block_templates_blocks_html_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_html_visibility_parent_idx" ON "block_templates_blocks_html_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_html_order_idx" ON "block_templates_blocks_html" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_html_parent_id_idx" ON "block_templates_blocks_html" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_html_path_idx" ON "block_templates_blocks_html" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_html_visibility_order_idx" ON "_block_templates_v_blocks_html_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_html_visibility_parent_idx" ON "_block_templates_v_blocks_html_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_html_order_idx" ON "_block_templates_v_blocks_html" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_html_parent_id_idx" ON "_block_templates_v_blocks_html" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_html_path_idx" ON "_block_templates_v_blocks_html" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_html_visibility" CASCADE;
  DROP TABLE "pages_blocks_html" CASCADE;
  DROP TABLE "_pages_v_blocks_html_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_html" CASCADE;
  DROP TABLE "landing_pages_blocks_html_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_html" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_html_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_html" CASCADE;
  DROP TABLE "page_templates_blocks_html_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_html" CASCADE;
  DROP TABLE "block_templates_blocks_html_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_html" CASCADE;
  DROP TABLE "_block_templates_v_blocks_html_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_html" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_html_visibility";
  DROP TYPE "public"."enum_pages_blocks_html_max_width";
  DROP TYPE "public"."enum_pages_blocks_html_padding";
  DROP TYPE "public"."enum_pages_blocks_html_background";
  DROP TYPE "public"."enum__pages_v_blocks_html_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_html_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_html_padding";
  DROP TYPE "public"."enum__pages_v_blocks_html_background";
  DROP TYPE "public"."enum_landing_pages_blocks_html_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_html_max_width";
  DROP TYPE "public"."enum_landing_pages_blocks_html_padding";
  DROP TYPE "public"."enum_landing_pages_blocks_html_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_html_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_html_max_width";
  DROP TYPE "public"."enum__landing_pages_v_blocks_html_padding";
  DROP TYPE "public"."enum__landing_pages_v_blocks_html_background";
  DROP TYPE "public"."enum_page_templates_blocks_html_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_html_max_width";
  DROP TYPE "public"."enum_page_templates_blocks_html_padding";
  DROP TYPE "public"."enum_page_templates_blocks_html_background";
  DROP TYPE "public"."enum_block_templates_blocks_html_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_html_max_width";
  DROP TYPE "public"."enum_block_templates_blocks_html_padding";
  DROP TYPE "public"."enum_block_templates_blocks_html_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_html_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_html_max_width";
  DROP TYPE "public"."enum__block_templates_v_blocks_html_padding";
  DROP TYPE "public"."enum__block_templates_v_blocks_html_background";`)
}
