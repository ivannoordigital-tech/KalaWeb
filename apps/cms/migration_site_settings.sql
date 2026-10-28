-- Migration for SiteSettings & ActivePixels
-- 1. Ensure columns exist on site_settings
ALTER TABLE "site_settings"
  ADD COLUMN IF NOT EXISTS "homepage_hero_headline" varchar,
  ADD COLUMN IF NOT EXISTS "homepage_hero_tagline" varchar,
  ADD COLUMN IF NOT EXISTS "homepage_hero_description" varchar,
  ADD COLUMN IF NOT EXISTS "homepage_promotion_title" varchar,
  ADD COLUMN IF NOT EXISTS "homepage_promotion_description" varchar,
  ADD COLUMN IF NOT EXISTS "homepage_promotion_service_name" varchar,
  ADD COLUMN IF NOT EXISTS "homepage_promotion_price" varchar,
  ADD COLUMN IF NOT EXISTS "homepage_promotion_original_price" varchar,
  ADD COLUMN IF NOT EXISTS "homepage_promotion_badge" varchar,
  ADD COLUMN IF NOT EXISTS "homepage_promotion_note" varchar,
  ADD COLUMN IF NOT EXISTS "homepage_promotion_capacity_note" varchar,
  ADD COLUMN IF NOT EXISTS "homepage_promotion_ref_code" varchar,
  ADD COLUMN IF NOT EXISTS "homepage_promotion_message" varchar,
  ADD COLUMN IF NOT EXISTS "analytics_gtm_id" varchar,
  ADD COLUMN IF NOT EXISTS "analytics_meta_pixel_id" varchar,
  ADD COLUMN IF NOT EXISTS "analytics_ga4_measurement_id" varchar,
  ADD COLUMN IF NOT EXISTS "analytics_gads_conversion_id" varchar,
  ADD COLUMN IF NOT EXISTS "analytics_tiktok_pixel_id" varchar,
  ADD COLUMN IF NOT EXISTS "analytics_clarity_project_id" varchar;

-- 2. Create child tables for homepage arrays
CREATE TABLE IF NOT EXISTS "site_settings_homepage_pain_points" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "title" varchar NOT NULL,
  "description" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "site_settings_homepage_benefits" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "title" varchar NOT NULL,
  "description" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "site_settings_homepage_booking_steps" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "title" varchar NOT NULL,
  "description" varchar NOT NULL
);

-- 3. Add foreign keys
DO $$ BEGIN
  ALTER TABLE "site_settings_homepage_pain_points"
    ADD CONSTRAINT "site_settings_homepage_pain_points_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "site_settings_homepage_benefits"
    ADD CONSTRAINT "site_settings_homepage_benefits_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "site_settings_homepage_booking_steps"
    ADD CONSTRAINT "site_settings_homepage_booking_steps_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS "site_settings_homepage_pain_points_order_idx" ON "site_settings_homepage_pain_points" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "site_settings_homepage_pain_points_parent_id_idx" ON "site_settings_homepage_pain_points" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "site_settings_homepage_benefits_order_idx" ON "site_settings_homepage_benefits" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "site_settings_homepage_benefits_parent_id_idx" ON "site_settings_homepage_benefits" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "site_settings_homepage_booking_steps_order_idx" ON "site_settings_homepage_booking_steps" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "site_settings_homepage_booking_steps_parent_id_idx" ON "site_settings_homepage_booking_steps" USING btree ("_parent_id");

-- 5. Extend pixel enum values
DO $$ BEGIN
  ALTER TYPE enum_landing_pages_active_pixels ADD VALUE IF NOT EXISTS 'ga4';
  ALTER TYPE enum_landing_pages_active_pixels ADD VALUE IF NOT EXISTS 'clarity';
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER TYPE enum__landing_pages_v_version_active_pixels ADD VALUE IF NOT EXISTS 'ga4';
  ALTER TYPE enum__landing_pages_v_version_active_pixels ADD VALUE IF NOT EXISTS 'clarity';
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER TYPE enum_pages_active_pixels ADD VALUE IF NOT EXISTS 'meta';
  ALTER TYPE enum_pages_active_pixels ADD VALUE IF NOT EXISTS 'google';
  ALTER TYPE enum_pages_active_pixels ADD VALUE IF NOT EXISTS 'tiktok';
  ALTER TYPE enum_pages_active_pixels ADD VALUE IF NOT EXISTS 'ga4';
  ALTER TYPE enum_pages_active_pixels ADD VALUE IF NOT EXISTS 'clarity';
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER TYPE enum__pages_v_version_active_pixels ADD VALUE IF NOT EXISTS 'meta';
  ALTER TYPE enum__pages_v_version_active_pixels ADD VALUE IF NOT EXISTS 'google';
  ALTER TYPE enum__pages_v_version_active_pixels ADD VALUE IF NOT EXISTS 'tiktok';
  ALTER TYPE enum__pages_v_version_active_pixels ADD VALUE IF NOT EXISTS 'ga4';
  ALTER TYPE enum__pages_v_version_active_pixels ADD VALUE IF NOT EXISTS 'clarity';
EXCEPTION WHEN others THEN null; END $$;
