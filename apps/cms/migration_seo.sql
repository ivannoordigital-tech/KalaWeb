-- Create Enums if they do not exist
DO $$ BEGIN
  CREATE TYPE "enum_articles_seo_audit_issues_severity" AS ENUM('critical', 'warning');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_articles_seo_audit_grade" AS ENUM('good', 'fair', 'poor');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "enum__articles_v_version_seo_audit_issues_severity" AS ENUM('critical', 'warning');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "enum__articles_v_version_seo_audit_grade" AS ENUM('good', 'fair', 'poor');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_pages_seo_audit_issues_severity" AS ENUM('critical', 'warning');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_pages_seo_audit_grade" AS ENUM('good', 'fair', 'poor');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "enum__pages_v_version_seo_audit_issues_severity" AS ENUM('critical', 'warning');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "enum__pages_v_version_seo_audit_grade" AS ENUM('good', 'fair', 'poor');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_landing_pages_seo_audit_issues_severity" AS ENUM('critical', 'warning');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_landing_pages_seo_audit_grade" AS ENUM('good', 'fair', 'poor');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "enum__landing_pages_v_version_seo_audit_issues_severity" AS ENUM('critical', 'warning');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "enum__landing_pages_v_version_seo_audit_grade" AS ENUM('good', 'fair', 'poor');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Articles Columns & Issues Table
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_score" numeric DEFAULT 0;
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_audit_score" numeric DEFAULT 0;
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_audit_grade" "enum_articles_seo_audit_grade" DEFAULT 'poor';
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_audit_last_audited_at" timestamp(3) with time zone;

CREATE TABLE IF NOT EXISTS "articles_seo_audit_issues" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "articles"("id") ON DELETE CASCADE,
  "id" varchar PRIMARY KEY NOT NULL,
  "code" varchar,
  "severity" "enum_articles_seo_audit_issues_severity",
  "message" varchar,
  "target_field" varchar
);
CREATE INDEX IF NOT EXISTS "articles_seo_audit_issues_order_idx" ON "articles_seo_audit_issues" ("_order");
CREATE INDEX IF NOT EXISTS "articles_seo_audit_issues_parent_id_idx" ON "articles_seo_audit_issues" ("_parent_id");

ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_seo_score" numeric DEFAULT 0;
ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_seo_audit_score" numeric DEFAULT 0;
ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_seo_audit_grade" "enum__articles_v_version_seo_audit_grade" DEFAULT 'poor';
ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_seo_audit_last_audited_at" timestamp(3) with time zone;

CREATE TABLE IF NOT EXISTS "_articles_v_version_seo_audit_issues" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "_articles_v"("id") ON DELETE CASCADE,
  "id" varchar PRIMARY KEY NOT NULL,
  "code" varchar,
  "severity" "enum__articles_v_version_seo_audit_issues_severity",
  "message" varchar,
  "target_field" varchar
);
CREATE INDEX IF NOT EXISTS "_articles_v_version_seo_audit_issues_order_idx" ON "_articles_v_version_seo_audit_issues" ("_order");
CREATE INDEX IF NOT EXISTS "_articles_v_version_seo_audit_issues_parent_id_idx" ON "_articles_v_version_seo_audit_issues" ("_parent_id");

-- 2. Pages Columns & Issues Table
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "seo_score" numeric DEFAULT 0;
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "seo_audit_score" numeric DEFAULT 0;
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "seo_audit_grade" "enum_pages_seo_audit_grade" DEFAULT 'poor';
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "seo_audit_last_audited_at" timestamp(3) with time zone;

CREATE TABLE IF NOT EXISTS "pages_seo_audit_issues" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "pages"("id") ON DELETE CASCADE,
  "id" varchar PRIMARY KEY NOT NULL,
  "code" varchar,
  "severity" "enum_pages_seo_audit_issues_severity",
  "message" varchar,
  "target_field" varchar
);
CREATE INDEX IF NOT EXISTS "pages_seo_audit_issues_order_idx" ON "pages_seo_audit_issues" ("_order");
CREATE INDEX IF NOT EXISTS "pages_seo_audit_issues_parent_id_idx" ON "pages_seo_audit_issues" ("_parent_id");

ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_score" numeric DEFAULT 0;
ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_audit_score" numeric DEFAULT 0;
ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_audit_grade" "enum__pages_v_version_seo_audit_grade" DEFAULT 'poor';
ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_audit_last_audited_at" timestamp(3) with time zone;

CREATE TABLE IF NOT EXISTS "_pages_v_version_seo_audit_issues" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "_pages_v"("id") ON DELETE CASCADE,
  "id" varchar PRIMARY KEY NOT NULL,
  "code" varchar,
  "severity" "enum__pages_v_version_seo_audit_issues_severity",
  "message" varchar,
  "target_field" varchar
);
CREATE INDEX IF NOT EXISTS "_pages_v_version_seo_audit_issues_order_idx" ON "_pages_v_version_seo_audit_issues" ("_order");
CREATE INDEX IF NOT EXISTS "_pages_v_version_seo_audit_issues_parent_id_idx" ON "_pages_v_version_seo_audit_issues" ("_parent_id");

-- 3. Landing Pages Columns & Issues Table
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar;
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "seo_meta_description" varchar;
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "seo_focus_keyword" varchar;
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "seo_og_image_id" integer;
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "seo_canonical_url" varchar;
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false;
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "seo_is_substantive_update" boolean DEFAULT false;
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "seo_score" numeric DEFAULT 0;
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "seo_audit_score" numeric DEFAULT 0;
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "seo_audit_grade" "enum_landing_pages_seo_audit_grade" DEFAULT 'poor';
ALTER TABLE "landing_pages" ADD COLUMN IF NOT EXISTS "seo_audit_last_audited_at" timestamp(3) with time zone;

CREATE TABLE IF NOT EXISTS "landing_pages_seo_audit_issues" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "landing_pages"("id") ON DELETE CASCADE,
  "id" varchar PRIMARY KEY NOT NULL,
  "code" varchar,
  "severity" "enum_landing_pages_seo_audit_issues_severity",
  "message" varchar,
  "target_field" varchar
);
CREATE INDEX IF NOT EXISTS "landing_pages_seo_audit_issues_order_idx" ON "landing_pages_seo_audit_issues" ("_order");
CREATE INDEX IF NOT EXISTS "landing_pages_seo_audit_issues_parent_id_idx" ON "landing_pages_seo_audit_issues" ("_parent_id");

ALTER TABLE "_landing_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_meta_title" varchar;
ALTER TABLE "_landing_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_meta_description" varchar;
ALTER TABLE "_landing_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_focus_keyword" varchar;
ALTER TABLE "_landing_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_og_image_id" integer;
ALTER TABLE "_landing_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_canonical_url" varchar;
ALTER TABLE "_landing_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false;
ALTER TABLE "_landing_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_is_substantive_update" boolean DEFAULT false;
ALTER TABLE "_landing_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_score" numeric DEFAULT 0;
ALTER TABLE "_landing_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_audit_score" numeric DEFAULT 0;
ALTER TABLE "_landing_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_audit_grade" "enum__landing_pages_v_version_seo_audit_grade" DEFAULT 'poor';
ALTER TABLE "_landing_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_audit_last_audited_at" timestamp(3) with time zone;

CREATE TABLE IF NOT EXISTS "_landing_pages_v_version_seo_audit_issues" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "_landing_pages_v"("id") ON DELETE CASCADE,
  "id" varchar PRIMARY KEY NOT NULL,
  "code" varchar,
  "severity" "enum__landing_pages_v_version_seo_audit_issues_severity",
  "message" varchar,
  "target_field" varchar
);
CREATE INDEX IF NOT EXISTS "_landing_pages_v_version_seo_audit_issues_order_idx" ON "_landing_pages_v_version_seo_audit_issues" ("_order");
CREATE INDEX IF NOT EXISTS "_landing_pages_v_version_seo_audit_issues_parent_id_idx" ON "_landing_pages_v_version_seo_audit_issues" ("_parent_id");
