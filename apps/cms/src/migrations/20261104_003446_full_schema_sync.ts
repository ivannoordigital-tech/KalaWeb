import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_media_folder" AS ENUM('baby-newborn', 'moms-lactation', 'midwives-clinic', 'documents', 'banners-promo', 'general');
  CREATE TYPE "public"."enum_pages_active_pixels" AS ENUM('meta', 'google', 'tiktok', 'ga4', 'clarity');
  CREATE TYPE "public"."enum_pages_page_layout" AS ENUM('default', 'canvas', 'full_width');
  CREATE TYPE "public"."enum_pages_variant" AS ENUM('A', 'B', 'C');
  CREATE TYPE "public"."enum_pages_page_type" AS ENUM('standard', 'landing');
  CREATE TYPE "public"."enum__pages_v_version_active_pixels" AS ENUM('meta', 'google', 'tiktok', 'ga4', 'clarity');
  CREATE TYPE "public"."enum__pages_v_version_page_layout" AS ENUM('default', 'canvas', 'full_width');
  CREATE TYPE "public"."enum__pages_v_version_variant" AS ENUM('A', 'B', 'C');
  CREATE TYPE "public"."enum__pages_v_version_page_type" AS ENUM('standard', 'landing');
  CREATE TYPE "public"."enum_landing_pages_page_layout" AS ENUM('canvas_minimal', 'canvas', 'default', 'full_width');
  CREATE TYPE "public"."enum__landing_pages_v_version_page_layout" AS ENUM('canvas_minimal', 'canvas', 'default', 'full_width');
  CREATE TYPE "public"."enum_testimonials_consent_method" AS ENUM('whatsapp', 'written', 'online_form');
  CREATE TYPE "public"."enum_deployments_status" AS ENUM('queued', 'building', 'success', 'failed', 'canceled');
  CREATE TYPE "public"."enum_deployments_environment" AS ENUM('production', 'preview');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  ALTER TYPE "public"."enum_landing_pages_active_pixels" ADD VALUE 'ga4';
  ALTER TYPE "public"."enum_landing_pages_active_pixels" ADD VALUE 'clarity';
  ALTER TYPE "public"."enum__landing_pages_v_version_active_pixels" ADD VALUE 'ga4';
  ALTER TYPE "public"."enum__landing_pages_v_version_active_pixels" ADD VALUE 'clarity';
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'automation';
  CREATE TABLE "pages_active_pixels" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_pages_active_pixels",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_active_pixels" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_version_active_pixels",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "service_areas_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "deployments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_deployments_status" DEFAULT 'queued' NOT NULL,
  	"trigger_reason" varchar NOT NULL,
  	"url" varchar,
  	"cloudflare_deployment_id" varchar,
  	"environment" "enum_deployments_environment" DEFAULT 'production',
  	"duration_seconds" numeric,
  	"started_at" timestamp(3) with time zone,
  	"completed_at" timestamp(3) with time zone,
  	"error_message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_coverage_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_homepage_trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "site_settings_homepage_differentiators" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings_operational_schedule_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_coverage_areas" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_operational_schedule_days" CASCADE;
  DROP TABLE "site_settings_coverage_areas" CASCADE;
  ALTER TABLE "testimonials" ALTER COLUMN "permission_granted" SET DEFAULT false;
  ALTER TABLE "testimonials" ALTER COLUMN "permission_granted" DROP NOT NULL;
  ALTER TABLE "testimonials" ALTER COLUMN "active" SET DEFAULT false;
  ALTER TABLE "articles" ALTER COLUMN "medical_reviewer" DROP DEFAULT;
  ALTER TABLE "_articles_v" ALTER COLUMN "version_medical_reviewer" DROP DEFAULT;
  ALTER TABLE "landing_pages" ADD COLUMN "page_layout" "enum_landing_pages_page_layout" DEFAULT 'canvas_minimal';
  ALTER TABLE "landing_pages" ADD COLUMN "seo_audit_engine_version" varchar DEFAULT '2.1.0';
  ALTER TABLE "landing_pages" ADD COLUMN "seo_audit_metrics_title_score" numeric DEFAULT 0;
  ALTER TABLE "landing_pages" ADD COLUMN "seo_audit_metrics_desc_score" numeric DEFAULT 0;
  ALTER TABLE "landing_pages" ADD COLUMN "seo_audit_metrics_keyword_score" numeric DEFAULT 0;
  ALTER TABLE "landing_pages" ADD COLUMN "seo_audit_metrics_h1_score" numeric DEFAULT 0;
  ALTER TABLE "landing_pages" ADD COLUMN "seo_audit_metrics_alt_score" numeric DEFAULT 0;
  ALTER TABLE "landing_pages" ADD COLUMN "seo_audit_metrics_slug_score" numeric DEFAULT 0;
  ALTER TABLE "landing_pages" ADD COLUMN "seo_audit_metrics_og_score" numeric DEFAULT 0;
  ALTER TABLE "landing_pages" ADD COLUMN "seo_audit_metrics_content_score" numeric DEFAULT 0;
  ALTER TABLE "landing_pages" ADD COLUMN "seo_audit_metrics_word_count" numeric DEFAULT 0;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_page_layout" "enum__landing_pages_v_version_page_layout" DEFAULT 'canvas_minimal';
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_seo_audit_engine_version" varchar DEFAULT '2.1.0';
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_seo_audit_metrics_title_score" numeric DEFAULT 0;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_seo_audit_metrics_desc_score" numeric DEFAULT 0;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_seo_audit_metrics_keyword_score" numeric DEFAULT 0;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_seo_audit_metrics_h1_score" numeric DEFAULT 0;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_seo_audit_metrics_alt_score" numeric DEFAULT 0;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_seo_audit_metrics_slug_score" numeric DEFAULT 0;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_seo_audit_metrics_og_score" numeric DEFAULT 0;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_seo_audit_metrics_content_score" numeric DEFAULT 0;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_seo_audit_metrics_word_count" numeric DEFAULT 0;
  ALTER TABLE "pages" ADD COLUMN "page_layout" "enum_pages_page_layout" DEFAULT 'default';
  ALTER TABLE "pages" ADD COLUMN "ref_code" varchar;
  ALTER TABLE "pages" ADD COLUMN "variant" "enum_pages_variant" DEFAULT 'A';
  ALTER TABLE "pages" ADD COLUMN "page_type" "enum_pages_page_type" DEFAULT 'standard';
  ALTER TABLE "pages" ADD COLUMN "seo_audit_engine_version" varchar DEFAULT '2.1.0';
  ALTER TABLE "pages" ADD COLUMN "seo_audit_metrics_title_score" numeric DEFAULT 0;
  ALTER TABLE "pages" ADD COLUMN "seo_audit_metrics_desc_score" numeric DEFAULT 0;
  ALTER TABLE "pages" ADD COLUMN "seo_audit_metrics_keyword_score" numeric DEFAULT 0;
  ALTER TABLE "pages" ADD COLUMN "seo_audit_metrics_h1_score" numeric DEFAULT 0;
  ALTER TABLE "pages" ADD COLUMN "seo_audit_metrics_alt_score" numeric DEFAULT 0;
  ALTER TABLE "pages" ADD COLUMN "seo_audit_metrics_slug_score" numeric DEFAULT 0;
  ALTER TABLE "pages" ADD COLUMN "seo_audit_metrics_og_score" numeric DEFAULT 0;
  ALTER TABLE "pages" ADD COLUMN "seo_audit_metrics_content_score" numeric DEFAULT 0;
  ALTER TABLE "pages" ADD COLUMN "seo_audit_metrics_word_count" numeric DEFAULT 0;
  ALTER TABLE "pages" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_pages_v" ADD COLUMN "version_page_layout" "enum__pages_v_version_page_layout" DEFAULT 'default';
  ALTER TABLE "_pages_v" ADD COLUMN "version_ref_code" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_variant" "enum__pages_v_version_variant" DEFAULT 'A';
  ALTER TABLE "_pages_v" ADD COLUMN "version_page_type" "enum__pages_v_version_page_type" DEFAULT 'standard';
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_audit_engine_version" varchar DEFAULT '2.1.0';
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_audit_metrics_title_score" numeric DEFAULT 0;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_audit_metrics_desc_score" numeric DEFAULT 0;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_audit_metrics_keyword_score" numeric DEFAULT 0;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_audit_metrics_h1_score" numeric DEFAULT 0;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_audit_metrics_alt_score" numeric DEFAULT 0;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_audit_metrics_slug_score" numeric DEFAULT 0;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_audit_metrics_og_score" numeric DEFAULT 0;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_audit_metrics_content_score" numeric DEFAULT 0;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_audit_metrics_word_count" numeric DEFAULT 0;
  ALTER TABLE "_pages_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_pages_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "testimonials" ADD COLUMN "consent_method" "enum_testimonials_consent_method" DEFAULT 'whatsapp';
  ALTER TABLE "testimonials" ADD COLUMN "consent_date" timestamp(3) with time zone;
  ALTER TABLE "articles" ADD COLUMN "author_midwife_id" integer;
  ALTER TABLE "articles" ADD COLUMN "reviewed_by_midwife_id" integer;
  ALTER TABLE "articles" ADD COLUMN "reviewed_at" timestamp(3) with time zone;
  ALTER TABLE "articles" ADD COLUMN "review_notes" varchar;
  ALTER TABLE "articles" ADD COLUMN "seo_audit_engine_version" varchar DEFAULT '2.1.0';
  ALTER TABLE "articles" ADD COLUMN "seo_audit_metrics_title_score" numeric DEFAULT 0;
  ALTER TABLE "articles" ADD COLUMN "seo_audit_metrics_desc_score" numeric DEFAULT 0;
  ALTER TABLE "articles" ADD COLUMN "seo_audit_metrics_keyword_score" numeric DEFAULT 0;
  ALTER TABLE "articles" ADD COLUMN "seo_audit_metrics_h1_score" numeric DEFAULT 0;
  ALTER TABLE "articles" ADD COLUMN "seo_audit_metrics_alt_score" numeric DEFAULT 0;
  ALTER TABLE "articles" ADD COLUMN "seo_audit_metrics_slug_score" numeric DEFAULT 0;
  ALTER TABLE "articles" ADD COLUMN "seo_audit_metrics_og_score" numeric DEFAULT 0;
  ALTER TABLE "articles" ADD COLUMN "seo_audit_metrics_content_score" numeric DEFAULT 0;
  ALTER TABLE "articles" ADD COLUMN "seo_audit_metrics_word_count" numeric DEFAULT 0;
  ALTER TABLE "articles" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_articles_v" ADD COLUMN "version_author_midwife_id" integer;
  ALTER TABLE "_articles_v" ADD COLUMN "version_reviewed_by_midwife_id" integer;
  ALTER TABLE "_articles_v" ADD COLUMN "version_reviewed_at" timestamp(3) with time zone;
  ALTER TABLE "_articles_v" ADD COLUMN "version_review_notes" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_seo_audit_engine_version" varchar DEFAULT '2.1.0';
  ALTER TABLE "_articles_v" ADD COLUMN "version_seo_audit_metrics_title_score" numeric DEFAULT 0;
  ALTER TABLE "_articles_v" ADD COLUMN "version_seo_audit_metrics_desc_score" numeric DEFAULT 0;
  ALTER TABLE "_articles_v" ADD COLUMN "version_seo_audit_metrics_keyword_score" numeric DEFAULT 0;
  ALTER TABLE "_articles_v" ADD COLUMN "version_seo_audit_metrics_h1_score" numeric DEFAULT 0;
  ALTER TABLE "_articles_v" ADD COLUMN "version_seo_audit_metrics_alt_score" numeric DEFAULT 0;
  ALTER TABLE "_articles_v" ADD COLUMN "version_seo_audit_metrics_slug_score" numeric DEFAULT 0;
  ALTER TABLE "_articles_v" ADD COLUMN "version_seo_audit_metrics_og_score" numeric DEFAULT 0;
  ALTER TABLE "_articles_v" ADD COLUMN "version_seo_audit_metrics_content_score" numeric DEFAULT 0;
  ALTER TABLE "_articles_v" ADD COLUMN "version_seo_audit_metrics_word_count" numeric DEFAULT 0;
  ALTER TABLE "_articles_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_articles_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "media" ADD COLUMN "folder" "enum_media_folder" DEFAULT 'general';
  ALTER TABLE "media" ADD COLUMN "tags" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "deployments_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "analytics_gtm_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "analytics_meta_pixel_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "analytics_ga4_measurement_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "analytics_gads_conversion_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "analytics_tiktok_pixel_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "analytics_clarity_project_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "structured_hours_opens" varchar DEFAULT '08:00';
  ALTER TABLE "site_settings" ADD COLUMN "structured_hours_closes" varchar DEFAULT '17:00';
  ALTER TABLE "site_settings" ADD COLUMN "homepage_section_headings_services_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "homepage_section_headings_services_subtitle" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "homepage_section_headings_reviews_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "homepage_section_headings_faq_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "homepage_bottom_cta_headline" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "homepage_bottom_cta_subheadline" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "homepage_bottom_cta_button_text" varchar;
  ALTER TABLE "pages_active_pixels" ADD CONSTRAINT "pages_active_pixels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_active_pixels" ADD CONSTRAINT "_pages_v_version_active_pixels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_areas_rels" ADD CONSTRAINT "service_areas_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_areas_rels" ADD CONSTRAINT "service_areas_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_coverage_cities" ADD CONSTRAINT "site_settings_coverage_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_homepage_trust_badges" ADD CONSTRAINT "site_settings_homepage_trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_homepage_differentiators" ADD CONSTRAINT "site_settings_homepage_differentiators_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_active_pixels_order_idx" ON "pages_active_pixels" USING btree ("order");
  CREATE INDEX "pages_active_pixels_parent_idx" ON "pages_active_pixels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_active_pixels_order_idx" ON "_pages_v_version_active_pixels" USING btree ("order");
  CREATE INDEX "_pages_v_version_active_pixels_parent_idx" ON "_pages_v_version_active_pixels" USING btree ("parent_id");
  CREATE INDEX "service_areas_rels_order_idx" ON "service_areas_rels" USING btree ("order");
  CREATE INDEX "service_areas_rels_parent_idx" ON "service_areas_rels" USING btree ("parent_id");
  CREATE INDEX "service_areas_rels_path_idx" ON "service_areas_rels" USING btree ("path");
  CREATE INDEX "service_areas_rels_services_id_idx" ON "service_areas_rels" USING btree ("services_id");
  CREATE INDEX "deployments_updated_at_idx" ON "deployments" USING btree ("updated_at");
  CREATE INDEX "deployments_created_at_idx" ON "deployments" USING btree ("created_at");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "site_settings_coverage_cities_order_idx" ON "site_settings_coverage_cities" USING btree ("_order");
  CREATE INDEX "site_settings_coverage_cities_parent_id_idx" ON "site_settings_coverage_cities" USING btree ("_parent_id");
  CREATE INDEX "site_settings_homepage_trust_badges_order_idx" ON "site_settings_homepage_trust_badges" USING btree ("_order");
  CREATE INDEX "site_settings_homepage_trust_badges_parent_id_idx" ON "site_settings_homepage_trust_badges" USING btree ("_parent_id");
  CREATE INDEX "site_settings_homepage_differentiators_order_idx" ON "site_settings_homepage_differentiators" USING btree ("_order");
  CREATE INDEX "site_settings_homepage_differentiators_parent_id_idx" ON "site_settings_homepage_differentiators" USING btree ("_parent_id");
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_midwife_id_midwives_id_fk" FOREIGN KEY ("author_midwife_id") REFERENCES "public"."midwives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_reviewed_by_midwife_id_midwives_id_fk" FOREIGN KEY ("reviewed_by_midwife_id") REFERENCES "public"."midwives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_midwife_id_midwives_id_fk" FOREIGN KEY ("version_author_midwife_id") REFERENCES "public"."midwives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_reviewed_by_midwife_id_midwives_id_fk" FOREIGN KEY ("version_reviewed_by_midwife_id") REFERENCES "public"."midwives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_deployments_fk" FOREIGN KEY ("deployments_id") REFERENCES "public"."deployments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_deleted_at_idx" ON "pages" USING btree ("deleted_at");
  CREATE INDEX "_pages_v_version_version_deleted_at_idx" ON "_pages_v" USING btree ("version_deleted_at");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "articles_author_midwife_idx" ON "articles" USING btree ("author_midwife_id");
  CREATE INDEX "articles_reviewed_by_midwife_idx" ON "articles" USING btree ("reviewed_by_midwife_id");
  CREATE INDEX "articles_deleted_at_idx" ON "articles" USING btree ("deleted_at");
  CREATE INDEX "_articles_v_version_version_author_midwife_idx" ON "_articles_v" USING btree ("version_author_midwife_id");
  CREATE INDEX "_articles_v_version_version_reviewed_by_midwife_idx" ON "_articles_v" USING btree ("version_reviewed_by_midwife_id");
  CREATE INDEX "_articles_v_version_version_deleted_at_idx" ON "_articles_v" USING btree ("version_deleted_at");
  CREATE INDEX "_articles_v_autosave_idx" ON "_articles_v" USING btree ("autosave");
  CREATE INDEX "payload_locked_documents_rels_deployments_id_idx" ON "payload_locked_documents_rels" USING btree ("deployments_id");
  ALTER TABLE "site_settings" DROP COLUMN "operational_schedule_timezone";
  ALTER TABLE "site_settings" DROP COLUMN "operational_schedule_after_hours_announcement";
  DROP TYPE "public"."enum_site_settings_operational_schedule_days_day";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_operational_schedule_days_day" AS ENUM('0', '1', '2', '3', '4', '5', '6');
  CREATE TABLE "site_settings_operational_schedule_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_site_settings_operational_schedule_days_day" NOT NULL,
  	"closed" boolean DEFAULT false,
  	"open" varchar DEFAULT '08:00',
  	"close" varchar DEFAULT '17:00'
  );
  
  CREATE TABLE "site_settings_coverage_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"area" varchar NOT NULL
  );
  
  ALTER TABLE "pages_active_pixels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_active_pixels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_areas_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "deployments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_coverage_cities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_homepage_trust_badges" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_homepage_differentiators" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_active_pixels" CASCADE;
  DROP TABLE "_pages_v_version_active_pixels" CASCADE;
  DROP TABLE "service_areas_rels" CASCADE;
  DROP TABLE "deployments" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "site_settings_coverage_cities" CASCADE;
  DROP TABLE "site_settings_homepage_trust_badges" CASCADE;
  DROP TABLE "site_settings_homepage_differentiators" CASCADE;
  ALTER TABLE "articles" DROP CONSTRAINT "articles_author_midwife_id_midwives_id_fk";
  
  ALTER TABLE "articles" DROP CONSTRAINT "articles_reviewed_by_midwife_id_midwives_id_fk";
  
  ALTER TABLE "_articles_v" DROP CONSTRAINT "_articles_v_version_author_midwife_id_midwives_id_fk";
  
  ALTER TABLE "_articles_v" DROP CONSTRAINT "_articles_v_version_reviewed_by_midwife_id_midwives_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_deployments_fk";
  
  ALTER TABLE "landing_pages_active_pixels" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_landing_pages_active_pixels";
  CREATE TYPE "public"."enum_landing_pages_active_pixels" AS ENUM('meta', 'google', 'tiktok');
  ALTER TABLE "landing_pages_active_pixels" ALTER COLUMN "value" SET DATA TYPE "public"."enum_landing_pages_active_pixels" USING "value"::"public"."enum_landing_pages_active_pixels";
  ALTER TABLE "_landing_pages_v_version_active_pixels" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum__landing_pages_v_version_active_pixels";
  CREATE TYPE "public"."enum__landing_pages_v_version_active_pixels" AS ENUM('meta', 'google', 'tiktok');
  ALTER TABLE "_landing_pages_v_version_active_pixels" ALTER COLUMN "value" SET DATA TYPE "public"."enum__landing_pages_v_version_active_pixels" USING "value"::"public"."enum__landing_pages_v_version_active_pixels";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'operator'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('superadmin', 'operator', 'author', 'seo', 'midwife_coordinator', 'marketing');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'operator'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  DROP INDEX "articles_author_midwife_idx";
  DROP INDEX "articles_reviewed_by_midwife_idx";
  DROP INDEX "articles_deleted_at_idx";
  DROP INDEX "_articles_v_version_version_author_midwife_idx";
  DROP INDEX "_articles_v_version_version_reviewed_by_midwife_idx";
  DROP INDEX "_articles_v_version_version_deleted_at_idx";
  DROP INDEX "_articles_v_autosave_idx";
  DROP INDEX "pages_deleted_at_idx";
  DROP INDEX "_pages_v_version_version_deleted_at_idx";
  DROP INDEX "_pages_v_autosave_idx";
  DROP INDEX "payload_locked_documents_rels_deployments_id_idx";
  ALTER TABLE "articles" ALTER COLUMN "medical_reviewer" SET DEFAULT 'Tim Medis & Kebidanan Kala Moms and Baby Spa';
  ALTER TABLE "_articles_v" ALTER COLUMN "version_medical_reviewer" SET DEFAULT 'Tim Medis & Kebidanan Kala Moms and Baby Spa';
  ALTER TABLE "testimonials" ALTER COLUMN "permission_granted" SET DEFAULT true;
  ALTER TABLE "testimonials" ALTER COLUMN "permission_granted" SET NOT NULL;
  ALTER TABLE "testimonials" ALTER COLUMN "active" SET DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "operational_schedule_timezone" varchar DEFAULT 'Asia/Jakarta';
  ALTER TABLE "site_settings" ADD COLUMN "operational_schedule_after_hours_announcement" varchar DEFAULT 'Terima kasih telah menghubungi Kala Moms & Baby Spa. Layanan konsultasi saat ini sedang di luar jam operasional (08.00–17.00 WIB). Pesan Bunda telah tercatat dalam antrean dan akan segera dihubungi oleh Bidan kami besok pagi.';
  ALTER TABLE "site_settings_operational_schedule_days" ADD CONSTRAINT "site_settings_operational_schedule_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_coverage_areas" ADD CONSTRAINT "site_settings_coverage_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_operational_schedule_days_order_idx" ON "site_settings_operational_schedule_days" USING btree ("_order");
  CREATE INDEX "site_settings_operational_schedule_days_parent_id_idx" ON "site_settings_operational_schedule_days" USING btree ("_parent_id");
  CREATE INDEX "site_settings_coverage_areas_order_idx" ON "site_settings_coverage_areas" USING btree ("_order");
  CREATE INDEX "site_settings_coverage_areas_parent_id_idx" ON "site_settings_coverage_areas" USING btree ("_parent_id");
  ALTER TABLE "articles" DROP COLUMN "author_midwife_id";
  ALTER TABLE "articles" DROP COLUMN "reviewed_by_midwife_id";
  ALTER TABLE "articles" DROP COLUMN "reviewed_at";
  ALTER TABLE "articles" DROP COLUMN "review_notes";
  ALTER TABLE "articles" DROP COLUMN "seo_audit_engine_version";
  ALTER TABLE "articles" DROP COLUMN "seo_audit_metrics_title_score";
  ALTER TABLE "articles" DROP COLUMN "seo_audit_metrics_desc_score";
  ALTER TABLE "articles" DROP COLUMN "seo_audit_metrics_keyword_score";
  ALTER TABLE "articles" DROP COLUMN "seo_audit_metrics_h1_score";
  ALTER TABLE "articles" DROP COLUMN "seo_audit_metrics_alt_score";
  ALTER TABLE "articles" DROP COLUMN "seo_audit_metrics_slug_score";
  ALTER TABLE "articles" DROP COLUMN "seo_audit_metrics_og_score";
  ALTER TABLE "articles" DROP COLUMN "seo_audit_metrics_content_score";
  ALTER TABLE "articles" DROP COLUMN "seo_audit_metrics_word_count";
  ALTER TABLE "articles" DROP COLUMN "deleted_at";
  ALTER TABLE "_articles_v" DROP COLUMN "version_author_midwife_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_reviewed_by_midwife_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_reviewed_at";
  ALTER TABLE "_articles_v" DROP COLUMN "version_review_notes";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_audit_engine_version";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_audit_metrics_title_score";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_audit_metrics_desc_score";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_audit_metrics_keyword_score";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_audit_metrics_h1_score";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_audit_metrics_alt_score";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_audit_metrics_slug_score";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_audit_metrics_og_score";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_audit_metrics_content_score";
  ALTER TABLE "_articles_v" DROP COLUMN "version_seo_audit_metrics_word_count";
  ALTER TABLE "_articles_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_articles_v" DROP COLUMN "autosave";
  ALTER TABLE "media" DROP COLUMN "folder";
  ALTER TABLE "media" DROP COLUMN "tags";
  ALTER TABLE "pages" DROP COLUMN "page_layout";
  ALTER TABLE "pages" DROP COLUMN "ref_code";
  ALTER TABLE "pages" DROP COLUMN "variant";
  ALTER TABLE "pages" DROP COLUMN "page_type";
  ALTER TABLE "pages" DROP COLUMN "seo_audit_engine_version";
  ALTER TABLE "pages" DROP COLUMN "seo_audit_metrics_title_score";
  ALTER TABLE "pages" DROP COLUMN "seo_audit_metrics_desc_score";
  ALTER TABLE "pages" DROP COLUMN "seo_audit_metrics_keyword_score";
  ALTER TABLE "pages" DROP COLUMN "seo_audit_metrics_h1_score";
  ALTER TABLE "pages" DROP COLUMN "seo_audit_metrics_alt_score";
  ALTER TABLE "pages" DROP COLUMN "seo_audit_metrics_slug_score";
  ALTER TABLE "pages" DROP COLUMN "seo_audit_metrics_og_score";
  ALTER TABLE "pages" DROP COLUMN "seo_audit_metrics_content_score";
  ALTER TABLE "pages" DROP COLUMN "seo_audit_metrics_word_count";
  ALTER TABLE "pages" DROP COLUMN "deleted_at";
  ALTER TABLE "_pages_v" DROP COLUMN "version_page_layout";
  ALTER TABLE "_pages_v" DROP COLUMN "version_ref_code";
  ALTER TABLE "_pages_v" DROP COLUMN "version_variant";
  ALTER TABLE "_pages_v" DROP COLUMN "version_page_type";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_audit_engine_version";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_audit_metrics_title_score";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_audit_metrics_desc_score";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_audit_metrics_keyword_score";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_audit_metrics_h1_score";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_audit_metrics_alt_score";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_audit_metrics_slug_score";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_audit_metrics_og_score";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_audit_metrics_content_score";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_audit_metrics_word_count";
  ALTER TABLE "_pages_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_pages_v" DROP COLUMN "autosave";
  ALTER TABLE "landing_pages" DROP COLUMN "page_layout";
  ALTER TABLE "landing_pages" DROP COLUMN "seo_audit_engine_version";
  ALTER TABLE "landing_pages" DROP COLUMN "seo_audit_metrics_title_score";
  ALTER TABLE "landing_pages" DROP COLUMN "seo_audit_metrics_desc_score";
  ALTER TABLE "landing_pages" DROP COLUMN "seo_audit_metrics_keyword_score";
  ALTER TABLE "landing_pages" DROP COLUMN "seo_audit_metrics_h1_score";
  ALTER TABLE "landing_pages" DROP COLUMN "seo_audit_metrics_alt_score";
  ALTER TABLE "landing_pages" DROP COLUMN "seo_audit_metrics_slug_score";
  ALTER TABLE "landing_pages" DROP COLUMN "seo_audit_metrics_og_score";
  ALTER TABLE "landing_pages" DROP COLUMN "seo_audit_metrics_content_score";
  ALTER TABLE "landing_pages" DROP COLUMN "seo_audit_metrics_word_count";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_page_layout";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_seo_audit_engine_version";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_seo_audit_metrics_title_score";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_seo_audit_metrics_desc_score";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_seo_audit_metrics_keyword_score";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_seo_audit_metrics_h1_score";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_seo_audit_metrics_alt_score";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_seo_audit_metrics_slug_score";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_seo_audit_metrics_og_score";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_seo_audit_metrics_content_score";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_seo_audit_metrics_word_count";
  ALTER TABLE "testimonials" DROP COLUMN "consent_method";
  ALTER TABLE "testimonials" DROP COLUMN "consent_date";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "deployments_id";
  ALTER TABLE "site_settings" DROP COLUMN "analytics_gtm_id";
  ALTER TABLE "site_settings" DROP COLUMN "analytics_meta_pixel_id";
  ALTER TABLE "site_settings" DROP COLUMN "analytics_ga4_measurement_id";
  ALTER TABLE "site_settings" DROP COLUMN "analytics_gads_conversion_id";
  ALTER TABLE "site_settings" DROP COLUMN "analytics_tiktok_pixel_id";
  ALTER TABLE "site_settings" DROP COLUMN "analytics_clarity_project_id";
  ALTER TABLE "site_settings" DROP COLUMN "structured_hours_opens";
  ALTER TABLE "site_settings" DROP COLUMN "structured_hours_closes";
  ALTER TABLE "site_settings" DROP COLUMN "homepage_section_headings_services_title";
  ALTER TABLE "site_settings" DROP COLUMN "homepage_section_headings_services_subtitle";
  ALTER TABLE "site_settings" DROP COLUMN "homepage_section_headings_reviews_title";
  ALTER TABLE "site_settings" DROP COLUMN "homepage_section_headings_faq_title";
  ALTER TABLE "site_settings" DROP COLUMN "homepage_bottom_cta_headline";
  ALTER TABLE "site_settings" DROP COLUMN "homepage_bottom_cta_subheadline";
  ALTER TABLE "site_settings" DROP COLUMN "homepage_bottom_cta_button_text";
  DROP TYPE "public"."enum_media_folder";
  DROP TYPE "public"."enum_pages_active_pixels";
  DROP TYPE "public"."enum_pages_page_layout";
  DROP TYPE "public"."enum_pages_variant";
  DROP TYPE "public"."enum_pages_page_type";
  DROP TYPE "public"."enum__pages_v_version_active_pixels";
  DROP TYPE "public"."enum__pages_v_version_page_layout";
  DROP TYPE "public"."enum__pages_v_version_variant";
  DROP TYPE "public"."enum__pages_v_version_page_type";
  DROP TYPE "public"."enum_landing_pages_page_layout";
  DROP TYPE "public"."enum__landing_pages_v_version_page_layout";
  DROP TYPE "public"."enum_testimonials_consent_method";
  DROP TYPE "public"."enum_deployments_status";
  DROP TYPE "public"."enum_deployments_environment";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
