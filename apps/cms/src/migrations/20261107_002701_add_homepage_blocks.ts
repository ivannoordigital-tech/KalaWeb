import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_solutions_variant" AS ENUM('default', 'benefits', 'differentiators');
  CREATE TYPE "public"."enum_pages_blocks_promo_banner_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_featured_services_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_coverage_area_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_solutions_variant" AS ENUM('default', 'benefits', 'differentiators');
  CREATE TYPE "public"."enum__pages_v_blocks_promo_banner_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_services_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_coverage_area_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_solutions_variant" AS ENUM('default', 'benefits', 'differentiators');
  CREATE TYPE "public"."enum_landing_pages_blocks_promo_banner_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_featured_services_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_coverage_area_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_solutions_variant" AS ENUM('default', 'benefits', 'differentiators');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_promo_banner_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_featured_services_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_coverage_area_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_solutions_variant" AS ENUM('default', 'benefits', 'differentiators');
  CREATE TYPE "public"."enum_page_templates_blocks_promo_banner_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_featured_services_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_coverage_area_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_solutions_variant" AS ENUM('default', 'benefits', 'differentiators');
  CREATE TYPE "public"."enum_block_templates_blocks_promo_banner_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_featured_services_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_coverage_area_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_solutions_variant" AS ENUM('default', 'benefits', 'differentiators');
  CREATE TYPE "public"."enum__block_templates_v_blocks_promo_banner_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_featured_services_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_coverage_area_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TABLE "pages_blocks_promo_banner_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_promo_banner_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_promo_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Penawaran Reservasi Pertama',
  	"title" varchar DEFAULT 'Promo treatment Kala',
  	"description" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"discount_badge" varchar,
  	"note" varchar,
  	"capacity_note" varchar,
  	"service_name" varchar,
  	"button_text" varchar DEFAULT 'Ambil Promo via WhatsApp',
  	"ref_code" varchar,
  	"message" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_services_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_featured_services_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_featured_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Menu Layanan Terfavorit',
  	"title" varchar DEFAULT '3 Layanan Unggulan Homecare Kala',
  	"subtitle" varchar,
  	"catalog_title" varchar,
  	"catalog_description" varchar,
  	"catalog_cta_text" varchar,
  	"catalog_cta_message" varchar,
  	"catalog_ref_code" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_coverage_area_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"region" varchar,
  	"slug" varchar,
  	"areas" varchar
  );
  
  CREATE TABLE "pages_blocks_coverage_area_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_coverage_area_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_coverage_area" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Jangkauan Homecare Langsung ke Rumah',
  	"title" varchar DEFAULT 'Area Layanan Surabaya & Sidoarjo',
  	"subtitle" varchar,
  	"note" varchar,
  	"cta_text" varchar DEFAULT 'Cek Ketersediaan Bidan ke Rumah Saya',
  	"cta_message" varchar,
  	"ref_code" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_promo_banner_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_promo_banner_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_promo_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Penawaran Reservasi Pertama',
  	"title" varchar DEFAULT 'Promo treatment Kala',
  	"description" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"discount_badge" varchar,
  	"note" varchar,
  	"capacity_note" varchar,
  	"service_name" varchar,
  	"button_text" varchar DEFAULT 'Ambil Promo via WhatsApp',
  	"ref_code" varchar,
  	"message" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_services_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_featured_services_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_featured_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Menu Layanan Terfavorit',
  	"title" varchar DEFAULT '3 Layanan Unggulan Homecare Kala',
  	"subtitle" varchar,
  	"catalog_title" varchar,
  	"catalog_description" varchar,
  	"catalog_cta_text" varchar,
  	"catalog_cta_message" varchar,
  	"catalog_ref_code" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_coverage_area_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"region" varchar,
  	"slug" varchar,
  	"areas" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_coverage_area_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_coverage_area_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_coverage_area" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Jangkauan Homecare Langsung ke Rumah',
  	"title" varchar DEFAULT 'Area Layanan Surabaya & Sidoarjo',
  	"subtitle" varchar,
  	"note" varchar,
  	"cta_text" varchar DEFAULT 'Cek Ketersediaan Bidan ke Rumah Saya',
  	"cta_message" varchar,
  	"ref_code" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_promo_banner_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_promo_banner_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_promo_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Penawaran Reservasi Pertama',
  	"title" varchar DEFAULT 'Promo treatment Kala',
  	"description" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"discount_badge" varchar,
  	"note" varchar,
  	"capacity_note" varchar,
  	"service_name" varchar,
  	"button_text" varchar DEFAULT 'Ambil Promo via WhatsApp',
  	"ref_code" varchar,
  	"message" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_featured_services_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_featured_services_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_featured_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Menu Layanan Terfavorit',
  	"title" varchar DEFAULT '3 Layanan Unggulan Homecare Kala',
  	"subtitle" varchar,
  	"catalog_title" varchar,
  	"catalog_description" varchar,
  	"catalog_cta_text" varchar,
  	"catalog_cta_message" varchar,
  	"catalog_ref_code" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_coverage_area_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"region" varchar,
  	"slug" varchar,
  	"areas" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_coverage_area_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_coverage_area_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_coverage_area" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Jangkauan Homecare Langsung ke Rumah',
  	"title" varchar DEFAULT 'Area Layanan Surabaya & Sidoarjo',
  	"subtitle" varchar,
  	"note" varchar,
  	"cta_text" varchar DEFAULT 'Cek Ketersediaan Bidan ke Rumah Saya',
  	"cta_message" varchar,
  	"ref_code" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_promo_banner_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_promo_banner_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_promo_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Penawaran Reservasi Pertama',
  	"title" varchar DEFAULT 'Promo treatment Kala',
  	"description" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"discount_badge" varchar,
  	"note" varchar,
  	"capacity_note" varchar,
  	"service_name" varchar,
  	"button_text" varchar DEFAULT 'Ambil Promo via WhatsApp',
  	"ref_code" varchar,
  	"message" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_featured_services_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_featured_services_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_featured_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Menu Layanan Terfavorit',
  	"title" varchar DEFAULT '3 Layanan Unggulan Homecare Kala',
  	"subtitle" varchar,
  	"catalog_title" varchar,
  	"catalog_description" varchar,
  	"catalog_cta_text" varchar,
  	"catalog_cta_message" varchar,
  	"catalog_ref_code" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_coverage_area_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"region" varchar,
  	"slug" varchar,
  	"areas" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_coverage_area_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_coverage_area_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_coverage_area" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Jangkauan Homecare Langsung ke Rumah',
  	"title" varchar DEFAULT 'Area Layanan Surabaya & Sidoarjo',
  	"subtitle" varchar,
  	"note" varchar,
  	"cta_text" varchar DEFAULT 'Cek Ketersediaan Bidan ke Rumah Saya',
  	"cta_message" varchar,
  	"ref_code" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_promo_banner_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_promo_banner_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_promo_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Penawaran Reservasi Pertama',
  	"title" varchar DEFAULT 'Promo treatment Kala' NOT NULL,
  	"description" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"discount_badge" varchar,
  	"note" varchar,
  	"capacity_note" varchar,
  	"service_name" varchar,
  	"button_text" varchar DEFAULT 'Ambil Promo via WhatsApp',
  	"ref_code" varchar,
  	"message" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_featured_services_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_featured_services_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_featured_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Menu Layanan Terfavorit',
  	"title" varchar DEFAULT '3 Layanan Unggulan Homecare Kala' NOT NULL,
  	"subtitle" varchar,
  	"catalog_title" varchar,
  	"catalog_description" varchar,
  	"catalog_cta_text" varchar,
  	"catalog_cta_message" varchar,
  	"catalog_ref_code" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_coverage_area_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"region" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"areas" varchar NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_coverage_area_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_coverage_area_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_coverage_area" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Jangkauan Homecare Langsung ke Rumah',
  	"title" varchar DEFAULT 'Area Layanan Surabaya & Sidoarjo' NOT NULL,
  	"subtitle" varchar,
  	"note" varchar,
  	"cta_text" varchar DEFAULT 'Cek Ketersediaan Bidan ke Rumah Saya',
  	"cta_message" varchar,
  	"ref_code" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_promo_banner_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_promo_banner_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_promo_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Penawaran Reservasi Pertama',
  	"title" varchar DEFAULT 'Promo treatment Kala',
  	"description" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"discount_badge" varchar,
  	"note" varchar,
  	"capacity_note" varchar,
  	"service_name" varchar,
  	"button_text" varchar DEFAULT 'Ambil Promo via WhatsApp',
  	"ref_code" varchar,
  	"message" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_featured_services_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_featured_services_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_featured_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Menu Layanan Terfavorit',
  	"title" varchar DEFAULT '3 Layanan Unggulan Homecare Kala',
  	"subtitle" varchar,
  	"catalog_title" varchar,
  	"catalog_description" varchar,
  	"catalog_cta_text" varchar,
  	"catalog_cta_message" varchar,
  	"catalog_ref_code" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_coverage_area_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"region" varchar,
  	"slug" varchar,
  	"areas" varchar
  );
  
  CREATE TABLE "block_templates_blocks_coverage_area_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_coverage_area_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_coverage_area" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Jangkauan Homecare Langsung ke Rumah',
  	"title" varchar DEFAULT 'Area Layanan Surabaya & Sidoarjo',
  	"subtitle" varchar,
  	"note" varchar,
  	"cta_text" varchar DEFAULT 'Cek Ketersediaan Bidan ke Rumah Saya',
  	"cta_message" varchar,
  	"ref_code" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_promo_banner_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_promo_banner_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_promo_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Penawaran Reservasi Pertama',
  	"title" varchar DEFAULT 'Promo treatment Kala',
  	"description" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"discount_badge" varchar,
  	"note" varchar,
  	"capacity_note" varchar,
  	"service_name" varchar,
  	"button_text" varchar DEFAULT 'Ambil Promo via WhatsApp',
  	"ref_code" varchar,
  	"message" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_featured_services_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_featured_services_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_featured_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Menu Layanan Terfavorit',
  	"title" varchar DEFAULT '3 Layanan Unggulan Homecare Kala',
  	"subtitle" varchar,
  	"catalog_title" varchar,
  	"catalog_description" varchar,
  	"catalog_cta_text" varchar,
  	"catalog_cta_message" varchar,
  	"catalog_ref_code" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_coverage_area_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"region" varchar,
  	"slug" varchar,
  	"areas" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_coverage_area_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_coverage_area_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_coverage_area" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Jangkauan Homecare Langsung ke Rumah',
  	"title" varchar DEFAULT 'Area Layanan Surabaya & Sidoarjo',
  	"subtitle" varchar,
  	"note" varchar,
  	"cta_text" varchar DEFAULT 'Cek Ketersediaan Bidan ke Rumah Saya',
  	"cta_message" varchar,
  	"ref_code" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_solutions_items" ADD COLUMN "number" varchar;
  ALTER TABLE "pages_blocks_solutions_items" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_solutions" ADD COLUMN "variant" "enum_pages_blocks_solutions_variant" DEFAULT 'default';
  ALTER TABLE "pages_blocks_solutions" ADD COLUMN "badge" varchar;
  ALTER TABLE "pages_blocks_solutions" ADD COLUMN "note" varchar;
  ALTER TABLE "_pages_v_blocks_solutions_items" ADD COLUMN "number" varchar;
  ALTER TABLE "_pages_v_blocks_solutions_items" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "_pages_v_blocks_solutions" ADD COLUMN "variant" "enum__pages_v_blocks_solutions_variant" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_solutions" ADD COLUMN "badge" varchar;
  ALTER TABLE "_pages_v_blocks_solutions" ADD COLUMN "note" varchar;
  ALTER TABLE "landing_pages_blocks_solutions_items" ADD COLUMN "number" varchar;
  ALTER TABLE "landing_pages_blocks_solutions_items" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "landing_pages_blocks_solutions" ADD COLUMN "variant" "enum_landing_pages_blocks_solutions_variant" DEFAULT 'default';
  ALTER TABLE "landing_pages_blocks_solutions" ADD COLUMN "badge" varchar;
  ALTER TABLE "landing_pages_blocks_solutions" ADD COLUMN "note" varchar;
  ALTER TABLE "_landing_pages_v_blocks_solutions_items" ADD COLUMN "number" varchar;
  ALTER TABLE "_landing_pages_v_blocks_solutions_items" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "_landing_pages_v_blocks_solutions" ADD COLUMN "variant" "enum__landing_pages_v_blocks_solutions_variant" DEFAULT 'default';
  ALTER TABLE "_landing_pages_v_blocks_solutions" ADD COLUMN "badge" varchar;
  ALTER TABLE "_landing_pages_v_blocks_solutions" ADD COLUMN "note" varchar;
  ALTER TABLE "page_templates_blocks_solutions_items" ADD COLUMN "number" varchar;
  ALTER TABLE "page_templates_blocks_solutions_items" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "page_templates_blocks_solutions" ADD COLUMN "variant" "enum_page_templates_blocks_solutions_variant" DEFAULT 'default';
  ALTER TABLE "page_templates_blocks_solutions" ADD COLUMN "badge" varchar;
  ALTER TABLE "page_templates_blocks_solutions" ADD COLUMN "note" varchar;
  ALTER TABLE "block_templates_blocks_solutions_items" ADD COLUMN "number" varchar;
  ALTER TABLE "block_templates_blocks_solutions_items" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "block_templates_blocks_solutions" ADD COLUMN "variant" "enum_block_templates_blocks_solutions_variant" DEFAULT 'default';
  ALTER TABLE "block_templates_blocks_solutions" ADD COLUMN "badge" varchar;
  ALTER TABLE "block_templates_blocks_solutions" ADD COLUMN "note" varchar;
  ALTER TABLE "_block_templates_v_blocks_solutions_items" ADD COLUMN "number" varchar;
  ALTER TABLE "_block_templates_v_blocks_solutions_items" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "_block_templates_v_blocks_solutions" ADD COLUMN "variant" "enum__block_templates_v_blocks_solutions_variant" DEFAULT 'default';
  ALTER TABLE "_block_templates_v_blocks_solutions" ADD COLUMN "badge" varchar;
  ALTER TABLE "_block_templates_v_blocks_solutions" ADD COLUMN "note" varchar;
  ALTER TABLE "pages_blocks_promo_banner_visibility" ADD CONSTRAINT "pages_blocks_promo_banner_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_promo_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promo_banner" ADD CONSTRAINT "pages_blocks_promo_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_services_visibility" ADD CONSTRAINT "pages_blocks_featured_services_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_featured_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_services" ADD CONSTRAINT "pages_blocks_featured_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_coverage_area_areas" ADD CONSTRAINT "pages_blocks_coverage_area_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_coverage_area_visibility" ADD CONSTRAINT "pages_blocks_coverage_area_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_coverage_area" ADD CONSTRAINT "pages_blocks_coverage_area_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_banner_visibility" ADD CONSTRAINT "_pages_v_blocks_promo_banner_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_promo_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_banner" ADD CONSTRAINT "_pages_v_blocks_promo_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_services_visibility" ADD CONSTRAINT "_pages_v_blocks_featured_services_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_featured_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_services" ADD CONSTRAINT "_pages_v_blocks_featured_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_coverage_area_areas" ADD CONSTRAINT "_pages_v_blocks_coverage_area_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_coverage_area_visibility" ADD CONSTRAINT "_pages_v_blocks_coverage_area_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_coverage_area" ADD CONSTRAINT "_pages_v_blocks_coverage_area_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_promo_banner_visibility" ADD CONSTRAINT "landing_pages_blocks_promo_banner_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_promo_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_promo_banner" ADD CONSTRAINT "landing_pages_blocks_promo_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_featured_services_visibility" ADD CONSTRAINT "landing_pages_blocks_featured_services_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_featured_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_featured_services" ADD CONSTRAINT "landing_pages_blocks_featured_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_coverage_area_areas" ADD CONSTRAINT "landing_pages_blocks_coverage_area_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_coverage_area_visibility" ADD CONSTRAINT "landing_pages_blocks_coverage_area_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_coverage_area" ADD CONSTRAINT "landing_pages_blocks_coverage_area_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_promo_banner_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_promo_banner_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_promo_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_promo_banner" ADD CONSTRAINT "_landing_pages_v_blocks_promo_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_featured_services_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_featured_services_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_featured_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_featured_services" ADD CONSTRAINT "_landing_pages_v_blocks_featured_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_coverage_area_areas" ADD CONSTRAINT "_landing_pages_v_blocks_coverage_area_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_coverage_area_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_coverage_area_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_coverage_area" ADD CONSTRAINT "_landing_pages_v_blocks_coverage_area_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_promo_banner_visibility" ADD CONSTRAINT "page_templates_blocks_promo_banner_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_promo_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_promo_banner" ADD CONSTRAINT "page_templates_blocks_promo_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_featured_services_visibility" ADD CONSTRAINT "page_templates_blocks_featured_services_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_featured_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_featured_services" ADD CONSTRAINT "page_templates_blocks_featured_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_coverage_area_areas" ADD CONSTRAINT "page_templates_blocks_coverage_area_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_coverage_area_visibility" ADD CONSTRAINT "page_templates_blocks_coverage_area_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_coverage_area" ADD CONSTRAINT "page_templates_blocks_coverage_area_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_promo_banner_visibility" ADD CONSTRAINT "block_templates_blocks_promo_banner_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_promo_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_promo_banner" ADD CONSTRAINT "block_templates_blocks_promo_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_featured_services_visibility" ADD CONSTRAINT "block_templates_blocks_featured_services_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_featured_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_featured_services" ADD CONSTRAINT "block_templates_blocks_featured_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_coverage_area_areas" ADD CONSTRAINT "block_templates_blocks_coverage_area_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_coverage_area_visibility" ADD CONSTRAINT "block_templates_blocks_coverage_area_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_coverage_area" ADD CONSTRAINT "block_templates_blocks_coverage_area_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_promo_banner_visibility" ADD CONSTRAINT "_block_templates_v_blocks_promo_banner_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_promo_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_promo_banner" ADD CONSTRAINT "_block_templates_v_blocks_promo_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_featured_services_visibility" ADD CONSTRAINT "_block_templates_v_blocks_featured_services_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_featured_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_featured_services" ADD CONSTRAINT "_block_templates_v_blocks_featured_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_coverage_area_areas" ADD CONSTRAINT "_block_templates_v_blocks_coverage_area_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_coverage_area_visibility" ADD CONSTRAINT "_block_templates_v_blocks_coverage_area_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_coverage_area"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_coverage_area" ADD CONSTRAINT "_block_templates_v_blocks_coverage_area_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_promo_banner_visibility_order_idx" ON "pages_blocks_promo_banner_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_promo_banner_visibility_parent_idx" ON "pages_blocks_promo_banner_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_promo_banner_order_idx" ON "pages_blocks_promo_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_banner_parent_id_idx" ON "pages_blocks_promo_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_banner_path_idx" ON "pages_blocks_promo_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_services_visibility_order_idx" ON "pages_blocks_featured_services_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_featured_services_visibility_parent_idx" ON "pages_blocks_featured_services_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_featured_services_order_idx" ON "pages_blocks_featured_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_services_parent_id_idx" ON "pages_blocks_featured_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_services_path_idx" ON "pages_blocks_featured_services" USING btree ("_path");
  CREATE INDEX "pages_blocks_coverage_area_areas_order_idx" ON "pages_blocks_coverage_area_areas" USING btree ("_order");
  CREATE INDEX "pages_blocks_coverage_area_areas_parent_id_idx" ON "pages_blocks_coverage_area_areas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_coverage_area_visibility_order_idx" ON "pages_blocks_coverage_area_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_coverage_area_visibility_parent_idx" ON "pages_blocks_coverage_area_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_coverage_area_order_idx" ON "pages_blocks_coverage_area" USING btree ("_order");
  CREATE INDEX "pages_blocks_coverage_area_parent_id_idx" ON "pages_blocks_coverage_area" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_coverage_area_path_idx" ON "pages_blocks_coverage_area" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_promo_banner_visibility_order_idx" ON "_pages_v_blocks_promo_banner_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_promo_banner_visibility_parent_idx" ON "_pages_v_blocks_promo_banner_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_promo_banner_order_idx" ON "_pages_v_blocks_promo_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promo_banner_parent_id_idx" ON "_pages_v_blocks_promo_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promo_banner_path_idx" ON "_pages_v_blocks_promo_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_services_visibility_order_idx" ON "_pages_v_blocks_featured_services_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_featured_services_visibility_parent_idx" ON "_pages_v_blocks_featured_services_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_featured_services_order_idx" ON "_pages_v_blocks_featured_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_services_parent_id_idx" ON "_pages_v_blocks_featured_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_services_path_idx" ON "_pages_v_blocks_featured_services" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_coverage_area_areas_order_idx" ON "_pages_v_blocks_coverage_area_areas" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_coverage_area_areas_parent_id_idx" ON "_pages_v_blocks_coverage_area_areas" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_coverage_area_visibility_order_idx" ON "_pages_v_blocks_coverage_area_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_coverage_area_visibility_parent_idx" ON "_pages_v_blocks_coverage_area_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_coverage_area_order_idx" ON "_pages_v_blocks_coverage_area" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_coverage_area_parent_id_idx" ON "_pages_v_blocks_coverage_area" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_coverage_area_path_idx" ON "_pages_v_blocks_coverage_area" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_promo_banner_visibility_order_idx" ON "landing_pages_blocks_promo_banner_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_promo_banner_visibility_parent_idx" ON "landing_pages_blocks_promo_banner_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_promo_banner_order_idx" ON "landing_pages_blocks_promo_banner" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_promo_banner_parent_id_idx" ON "landing_pages_blocks_promo_banner" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_promo_banner_path_idx" ON "landing_pages_blocks_promo_banner" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_featured_services_visibility_order_idx" ON "landing_pages_blocks_featured_services_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_featured_services_visibility_parent_idx" ON "landing_pages_blocks_featured_services_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_featured_services_order_idx" ON "landing_pages_blocks_featured_services" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_featured_services_parent_id_idx" ON "landing_pages_blocks_featured_services" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_featured_services_path_idx" ON "landing_pages_blocks_featured_services" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_coverage_area_areas_order_idx" ON "landing_pages_blocks_coverage_area_areas" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_coverage_area_areas_parent_id_idx" ON "landing_pages_blocks_coverage_area_areas" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_coverage_area_visibility_order_idx" ON "landing_pages_blocks_coverage_area_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_coverage_area_visibility_parent_idx" ON "landing_pages_blocks_coverage_area_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_coverage_area_order_idx" ON "landing_pages_blocks_coverage_area" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_coverage_area_parent_id_idx" ON "landing_pages_blocks_coverage_area" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_coverage_area_path_idx" ON "landing_pages_blocks_coverage_area" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_promo_banner_visibility_order_idx" ON "_landing_pages_v_blocks_promo_banner_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_promo_banner_visibility_parent_idx" ON "_landing_pages_v_blocks_promo_banner_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_promo_banner_order_idx" ON "_landing_pages_v_blocks_promo_banner" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_promo_banner_parent_id_idx" ON "_landing_pages_v_blocks_promo_banner" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_promo_banner_path_idx" ON "_landing_pages_v_blocks_promo_banner" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_featured_services_visibility_order_idx" ON "_landing_pages_v_blocks_featured_services_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_featured_services_visibility_parent_idx" ON "_landing_pages_v_blocks_featured_services_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_featured_services_order_idx" ON "_landing_pages_v_blocks_featured_services" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_featured_services_parent_id_idx" ON "_landing_pages_v_blocks_featured_services" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_featured_services_path_idx" ON "_landing_pages_v_blocks_featured_services" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_coverage_area_areas_order_idx" ON "_landing_pages_v_blocks_coverage_area_areas" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_coverage_area_areas_parent_id_idx" ON "_landing_pages_v_blocks_coverage_area_areas" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_coverage_area_visibility_order_idx" ON "_landing_pages_v_blocks_coverage_area_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_coverage_area_visibility_parent_idx" ON "_landing_pages_v_blocks_coverage_area_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_coverage_area_order_idx" ON "_landing_pages_v_blocks_coverage_area" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_coverage_area_parent_id_idx" ON "_landing_pages_v_blocks_coverage_area" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_coverage_area_path_idx" ON "_landing_pages_v_blocks_coverage_area" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_promo_banner_visibility_order_idx" ON "page_templates_blocks_promo_banner_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_promo_banner_visibility_parent_idx" ON "page_templates_blocks_promo_banner_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_promo_banner_order_idx" ON "page_templates_blocks_promo_banner" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_promo_banner_parent_id_idx" ON "page_templates_blocks_promo_banner" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_promo_banner_path_idx" ON "page_templates_blocks_promo_banner" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_featured_services_visibility_order_idx" ON "page_templates_blocks_featured_services_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_featured_services_visibility_parent_idx" ON "page_templates_blocks_featured_services_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_featured_services_order_idx" ON "page_templates_blocks_featured_services" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_featured_services_parent_id_idx" ON "page_templates_blocks_featured_services" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_featured_services_path_idx" ON "page_templates_blocks_featured_services" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_coverage_area_areas_order_idx" ON "page_templates_blocks_coverage_area_areas" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_coverage_area_areas_parent_id_idx" ON "page_templates_blocks_coverage_area_areas" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_coverage_area_visibility_order_idx" ON "page_templates_blocks_coverage_area_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_coverage_area_visibility_parent_idx" ON "page_templates_blocks_coverage_area_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_coverage_area_order_idx" ON "page_templates_blocks_coverage_area" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_coverage_area_parent_id_idx" ON "page_templates_blocks_coverage_area" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_coverage_area_path_idx" ON "page_templates_blocks_coverage_area" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_promo_banner_visibility_order_idx" ON "block_templates_blocks_promo_banner_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_promo_banner_visibility_parent_idx" ON "block_templates_blocks_promo_banner_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_promo_banner_order_idx" ON "block_templates_blocks_promo_banner" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_promo_banner_parent_id_idx" ON "block_templates_blocks_promo_banner" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_promo_banner_path_idx" ON "block_templates_blocks_promo_banner" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_featured_services_visibility_order_idx" ON "block_templates_blocks_featured_services_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_featured_services_visibility_parent_idx" ON "block_templates_blocks_featured_services_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_featured_services_order_idx" ON "block_templates_blocks_featured_services" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_featured_services_parent_id_idx" ON "block_templates_blocks_featured_services" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_featured_services_path_idx" ON "block_templates_blocks_featured_services" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_coverage_area_areas_order_idx" ON "block_templates_blocks_coverage_area_areas" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_coverage_area_areas_parent_id_idx" ON "block_templates_blocks_coverage_area_areas" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_coverage_area_visibility_order_idx" ON "block_templates_blocks_coverage_area_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_coverage_area_visibility_parent_idx" ON "block_templates_blocks_coverage_area_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_coverage_area_order_idx" ON "block_templates_blocks_coverage_area" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_coverage_area_parent_id_idx" ON "block_templates_blocks_coverage_area" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_coverage_area_path_idx" ON "block_templates_blocks_coverage_area" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_promo_banner_visibility_order_idx" ON "_block_templates_v_blocks_promo_banner_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_promo_banner_visibility_parent_idx" ON "_block_templates_v_blocks_promo_banner_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_promo_banner_order_idx" ON "_block_templates_v_blocks_promo_banner" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_promo_banner_parent_id_idx" ON "_block_templates_v_blocks_promo_banner" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_promo_banner_path_idx" ON "_block_templates_v_blocks_promo_banner" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_featured_services_visibility_order_idx" ON "_block_templates_v_blocks_featured_services_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_featured_services_visibility_parent_idx" ON "_block_templates_v_blocks_featured_services_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_featured_services_order_idx" ON "_block_templates_v_blocks_featured_services" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_featured_services_parent_id_idx" ON "_block_templates_v_blocks_featured_services" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_featured_services_path_idx" ON "_block_templates_v_blocks_featured_services" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_coverage_area_areas_order_idx" ON "_block_templates_v_blocks_coverage_area_areas" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_coverage_area_areas_parent_id_idx" ON "_block_templates_v_blocks_coverage_area_areas" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_coverage_area_visibility_order_idx" ON "_block_templates_v_blocks_coverage_area_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_coverage_area_visibility_parent_idx" ON "_block_templates_v_blocks_coverage_area_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_coverage_area_order_idx" ON "_block_templates_v_blocks_coverage_area" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_coverage_area_parent_id_idx" ON "_block_templates_v_blocks_coverage_area" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_coverage_area_path_idx" ON "_block_templates_v_blocks_coverage_area" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_promo_banner_visibility" CASCADE;
  DROP TABLE "pages_blocks_promo_banner" CASCADE;
  DROP TABLE "pages_blocks_featured_services_visibility" CASCADE;
  DROP TABLE "pages_blocks_featured_services" CASCADE;
  DROP TABLE "pages_blocks_coverage_area_areas" CASCADE;
  DROP TABLE "pages_blocks_coverage_area_visibility" CASCADE;
  DROP TABLE "pages_blocks_coverage_area" CASCADE;
  DROP TABLE "_pages_v_blocks_promo_banner_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_promo_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_services_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_services" CASCADE;
  DROP TABLE "_pages_v_blocks_coverage_area_areas" CASCADE;
  DROP TABLE "_pages_v_blocks_coverage_area_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_coverage_area" CASCADE;
  DROP TABLE "landing_pages_blocks_promo_banner_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_promo_banner" CASCADE;
  DROP TABLE "landing_pages_blocks_featured_services_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_featured_services" CASCADE;
  DROP TABLE "landing_pages_blocks_coverage_area_areas" CASCADE;
  DROP TABLE "landing_pages_blocks_coverage_area_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_coverage_area" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_promo_banner_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_promo_banner" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_featured_services_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_featured_services" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_coverage_area_areas" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_coverage_area_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_coverage_area" CASCADE;
  DROP TABLE "page_templates_blocks_promo_banner_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_promo_banner" CASCADE;
  DROP TABLE "page_templates_blocks_featured_services_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_featured_services" CASCADE;
  DROP TABLE "page_templates_blocks_coverage_area_areas" CASCADE;
  DROP TABLE "page_templates_blocks_coverage_area_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_coverage_area" CASCADE;
  DROP TABLE "block_templates_blocks_promo_banner_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_promo_banner" CASCADE;
  DROP TABLE "block_templates_blocks_featured_services_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_featured_services" CASCADE;
  DROP TABLE "block_templates_blocks_coverage_area_areas" CASCADE;
  DROP TABLE "block_templates_blocks_coverage_area_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_coverage_area" CASCADE;
  DROP TABLE "_block_templates_v_blocks_promo_banner_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_promo_banner" CASCADE;
  DROP TABLE "_block_templates_v_blocks_featured_services_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_featured_services" CASCADE;
  DROP TABLE "_block_templates_v_blocks_coverage_area_areas" CASCADE;
  DROP TABLE "_block_templates_v_blocks_coverage_area_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_coverage_area" CASCADE;
  ALTER TABLE "pages_blocks_solutions_items" DROP COLUMN "number";
  ALTER TABLE "pages_blocks_solutions_items" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_solutions" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_solutions" DROP COLUMN "badge";
  ALTER TABLE "pages_blocks_solutions" DROP COLUMN "note";
  ALTER TABLE "_pages_v_blocks_solutions_items" DROP COLUMN "number";
  ALTER TABLE "_pages_v_blocks_solutions_items" DROP COLUMN "subtitle";
  ALTER TABLE "_pages_v_blocks_solutions" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_solutions" DROP COLUMN "badge";
  ALTER TABLE "_pages_v_blocks_solutions" DROP COLUMN "note";
  ALTER TABLE "landing_pages_blocks_solutions_items" DROP COLUMN "number";
  ALTER TABLE "landing_pages_blocks_solutions_items" DROP COLUMN "subtitle";
  ALTER TABLE "landing_pages_blocks_solutions" DROP COLUMN "variant";
  ALTER TABLE "landing_pages_blocks_solutions" DROP COLUMN "badge";
  ALTER TABLE "landing_pages_blocks_solutions" DROP COLUMN "note";
  ALTER TABLE "_landing_pages_v_blocks_solutions_items" DROP COLUMN "number";
  ALTER TABLE "_landing_pages_v_blocks_solutions_items" DROP COLUMN "subtitle";
  ALTER TABLE "_landing_pages_v_blocks_solutions" DROP COLUMN "variant";
  ALTER TABLE "_landing_pages_v_blocks_solutions" DROP COLUMN "badge";
  ALTER TABLE "_landing_pages_v_blocks_solutions" DROP COLUMN "note";
  ALTER TABLE "page_templates_blocks_solutions_items" DROP COLUMN "number";
  ALTER TABLE "page_templates_blocks_solutions_items" DROP COLUMN "subtitle";
  ALTER TABLE "page_templates_blocks_solutions" DROP COLUMN "variant";
  ALTER TABLE "page_templates_blocks_solutions" DROP COLUMN "badge";
  ALTER TABLE "page_templates_blocks_solutions" DROP COLUMN "note";
  ALTER TABLE "block_templates_blocks_solutions_items" DROP COLUMN "number";
  ALTER TABLE "block_templates_blocks_solutions_items" DROP COLUMN "subtitle";
  ALTER TABLE "block_templates_blocks_solutions" DROP COLUMN "variant";
  ALTER TABLE "block_templates_blocks_solutions" DROP COLUMN "badge";
  ALTER TABLE "block_templates_blocks_solutions" DROP COLUMN "note";
  ALTER TABLE "_block_templates_v_blocks_solutions_items" DROP COLUMN "number";
  ALTER TABLE "_block_templates_v_blocks_solutions_items" DROP COLUMN "subtitle";
  ALTER TABLE "_block_templates_v_blocks_solutions" DROP COLUMN "variant";
  ALTER TABLE "_block_templates_v_blocks_solutions" DROP COLUMN "badge";
  ALTER TABLE "_block_templates_v_blocks_solutions" DROP COLUMN "note";
  DROP TYPE "public"."enum_pages_blocks_solutions_variant";
  DROP TYPE "public"."enum_pages_blocks_promo_banner_visibility";
  DROP TYPE "public"."enum_pages_blocks_featured_services_visibility";
  DROP TYPE "public"."enum_pages_blocks_coverage_area_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_solutions_variant";
  DROP TYPE "public"."enum__pages_v_blocks_promo_banner_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_featured_services_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_coverage_area_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_solutions_variant";
  DROP TYPE "public"."enum_landing_pages_blocks_promo_banner_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_featured_services_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_coverage_area_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_solutions_variant";
  DROP TYPE "public"."enum__landing_pages_v_blocks_promo_banner_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_featured_services_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_coverage_area_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_solutions_variant";
  DROP TYPE "public"."enum_page_templates_blocks_promo_banner_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_featured_services_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_coverage_area_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_solutions_variant";
  DROP TYPE "public"."enum_block_templates_blocks_promo_banner_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_featured_services_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_coverage_area_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_solutions_variant";
  DROP TYPE "public"."enum__block_templates_v_blocks_promo_banner_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_featured_services_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_coverage_area_visibility";`)
}
