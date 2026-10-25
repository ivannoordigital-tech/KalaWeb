import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_help_center_category" AS ENUM('panduan-lp', 'etika-iklan-medis', 'standar-foto-media', 'pelacakan-wa', 'faq-kendala');
  CREATE TYPE "public"."enum_landing_pages_active_pixels" AS ENUM('meta', 'google', 'tiktok');
  CREATE TYPE "public"."enum_landing_pages_blocks_hero_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_landing_pages_blocks_hero_btn_color" AS ENUM('terracotta', 'whatsapp', 'chocolate');
  CREATE TYPE "public"."enum_landing_pages_blocks_hero_bg_style" AS ENUM('gradient', 'plain', 'white');
  CREATE TYPE "public"."enum_landing_pages_blocks_pain_points_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_landing_pages_blocks_pain_points_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum_landing_pages_blocks_pain_points_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_landing_pages_blocks_pricing_layout_style" AS ENUM('cards', 'list');
  CREATE TYPE "public"."enum_landing_pages_blocks_pricing_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum_landing_pages_blocks_pricing_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_landing_pages_blocks_rich_text_container_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum_landing_pages_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_landing_pages_blocks_gallery_bg_style" AS ENUM('white', 'warm');
  CREATE TYPE "public"."enum_landing_pages_blocks_midwife_spotlight_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_landing_pages_blocks_midwife_spotlight_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_landing_pages_seo_audit_issues_severity" AS ENUM('critical', 'warning');
  CREATE TYPE "public"."enum_landing_pages_variant" AS ENUM('A', 'B', 'C');
  CREATE TYPE "public"."enum_landing_pages_seo_audit_grade" AS ENUM('good', 'fair', 'poor');
  CREATE TYPE "public"."enum_landing_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_pages_v_version_active_pixels" AS ENUM('meta', 'google', 'tiktok');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_hero_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_hero_btn_color" AS ENUM('terracotta', 'whatsapp', 'chocolate');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_hero_bg_style" AS ENUM('gradient', 'plain', 'white');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_pain_points_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_pain_points_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_pain_points_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_pricing_layout_style" AS ENUM('cards', 'list');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_pricing_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_pricing_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_rich_text_container_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_gallery_bg_style" AS ENUM('white', 'warm');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_midwife_spotlight_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_midwife_spotlight_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__landing_pages_v_version_seo_audit_issues_severity" AS ENUM('critical', 'warning');
  CREATE TYPE "public"."enum__landing_pages_v_version_variant" AS ENUM('A', 'B', 'C');
  CREATE TYPE "public"."enum__landing_pages_v_version_seo_audit_grade" AS ENUM('good', 'fair', 'poor');
  CREATE TYPE "public"."enum__landing_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_page_templates_blocks_hero_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_page_templates_blocks_hero_btn_color" AS ENUM('terracotta', 'whatsapp', 'chocolate');
  CREATE TYPE "public"."enum_page_templates_blocks_hero_bg_style" AS ENUM('gradient', 'plain', 'white');
  CREATE TYPE "public"."enum_page_templates_blocks_pain_points_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_page_templates_blocks_pain_points_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum_page_templates_blocks_pain_points_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_page_templates_blocks_pricing_layout_style" AS ENUM('cards', 'list');
  CREATE TYPE "public"."enum_page_templates_blocks_pricing_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum_page_templates_blocks_pricing_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_page_templates_blocks_rich_text_container_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum_page_templates_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_page_templates_blocks_gallery_bg_style" AS ENUM('white', 'warm');
  CREATE TYPE "public"."enum_page_templates_blocks_midwife_spotlight_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_page_templates_blocks_midwife_spotlight_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_page_templates_category" AS ENUM('kolik', 'newborn', 'laktasi', 'selapanan', 'promo');
  CREATE TYPE "public"."enum_block_templates_blocks_hero_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_block_templates_blocks_hero_btn_color" AS ENUM('terracotta', 'whatsapp', 'chocolate');
  CREATE TYPE "public"."enum_block_templates_blocks_hero_bg_style" AS ENUM('gradient', 'plain', 'white');
  CREATE TYPE "public"."enum_block_templates_blocks_pain_points_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_block_templates_blocks_pain_points_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum_block_templates_blocks_pain_points_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_block_templates_blocks_pricing_layout_style" AS ENUM('cards', 'list');
  CREATE TYPE "public"."enum_block_templates_blocks_pricing_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum_block_templates_blocks_pricing_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_block_templates_blocks_rich_text_container_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum_block_templates_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_block_templates_blocks_gallery_bg_style" AS ENUM('white', 'warm');
  CREATE TYPE "public"."enum_block_templates_blocks_midwife_spotlight_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_block_templates_blocks_midwife_spotlight_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_block_templates_category" AS ENUM('promo', 'galeri', 'edukasi', 'review', 'umum');
  CREATE TYPE "public"."enum_block_templates_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__block_templates_v_blocks_hero_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum__block_templates_v_blocks_hero_btn_color" AS ENUM('terracotta', 'whatsapp', 'chocolate');
  CREATE TYPE "public"."enum__block_templates_v_blocks_hero_bg_style" AS ENUM('gradient', 'plain', 'white');
  CREATE TYPE "public"."enum__block_templates_v_blocks_pain_points_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__block_templates_v_blocks_pain_points_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum__block_templates_v_blocks_pain_points_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__block_templates_v_blocks_pricing_layout_style" AS ENUM('cards', 'list');
  CREATE TYPE "public"."enum__block_templates_v_blocks_pricing_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum__block_templates_v_blocks_pricing_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__block_templates_v_blocks_rich_text_container_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum__block_templates_v_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__block_templates_v_blocks_gallery_bg_style" AS ENUM('white', 'warm');
  CREATE TYPE "public"."enum__block_templates_v_blocks_midwife_spotlight_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__block_templates_v_blocks_midwife_spotlight_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__block_templates_v_version_category" AS ENUM('promo', 'galeri', 'edukasi', 'review', 'umum');
  CREATE TYPE "public"."enum__block_templates_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_blocks_hero_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_pages_blocks_hero_btn_color" AS ENUM('terracotta', 'whatsapp', 'chocolate');
  CREATE TYPE "public"."enum_pages_blocks_hero_bg_style" AS ENUM('gradient', 'plain', 'white');
  CREATE TYPE "public"."enum_pages_blocks_pain_points_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_pages_blocks_pain_points_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum_pages_blocks_pain_points_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_pages_blocks_pricing_layout_style" AS ENUM('cards', 'list');
  CREATE TYPE "public"."enum_pages_blocks_pricing_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum_pages_blocks_pricing_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_container_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_gallery_bg_style" AS ENUM('white', 'warm');
  CREATE TYPE "public"."enum_pages_blocks_midwife_spotlight_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_pages_blocks_midwife_spotlight_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_pages_seo_audit_issues_severity" AS ENUM('critical', 'warning');
  CREATE TYPE "public"."enum_pages_seo_audit_grade" AS ENUM('good', 'fair', 'poor');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_btn_color" AS ENUM('terracotta', 'whatsapp', 'chocolate');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_bg_style" AS ENUM('gradient', 'plain', 'white');
  CREATE TYPE "public"."enum__pages_v_blocks_pain_points_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_pain_points_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum__pages_v_blocks_pain_points_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_layout_style" AS ENUM('cards', 'list');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_background" AS ENUM('cream', 'white', 'peach');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_container_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_bg_style" AS ENUM('white', 'warm');
  CREATE TYPE "public"."enum__pages_v_blocks_midwife_spotlight_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__pages_v_blocks_midwife_spotlight_spacing" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__pages_v_version_seo_audit_issues_severity" AS ENUM('critical', 'warning');
  CREATE TYPE "public"."enum__pages_v_version_seo_audit_grade" AS ENUM('good', 'fair', 'poor');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_service_areas_city" AS ENUM('Surabaya', 'Sidoarjo');
  CREATE TYPE "public"."enum_faq_category" AS ENUM('layanan', 'keamanan-medis', 'reservasi-homecare', 'biaya-wilayah');
  CREATE TYPE "public"."enum_articles_seo_audit_issues_severity" AS ENUM('critical', 'warning');
  CREATE TYPE "public"."enum_articles_category" AS ENUM('bayi', 'ibu-menyusui', 'layanan', 'kehamilan');
  CREATE TYPE "public"."enum_articles_seo_audit_grade" AS ENUM('good', 'fair', 'poor');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_seo_audit_issues_severity" AS ENUM('critical', 'warning');
  CREATE TYPE "public"."enum__articles_v_version_category" AS ENUM('bayi', 'ibu-menyusui', 'layanan', 'kehamilan');
  CREATE TYPE "public"."enum__articles_v_version_seo_audit_grade" AS ENUM('good', 'fair', 'poor');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_users_role" AS ENUM('superadmin', 'operator', 'author', 'seo', 'midwife_coordinator', 'marketing');
  CREATE TYPE "public"."enum_site_settings_operational_schedule_days_day" AS ENUM('0', '1', '2', '3', '4', '5', '6');
  CREATE TABLE "help_center_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_number" varchar DEFAULT '1',
  	"step_title" varchar NOT NULL,
  	"step_detail" varchar NOT NULL
  );
  
  CREATE TABLE "help_center_dos_and_donts_dos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "help_center_dos_and_donts_donts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "help_center" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category" "enum_help_center_category" DEFAULT 'panduan-lp' NOT NULL,
  	"order" numeric DEFAULT 1,
  	"summary" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "landing_pages_active_pixels" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_landing_pages_active_pixels",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar,
  	"subheadline" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"cta_text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"cta_message" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"align" "enum_landing_pages_blocks_hero_align" DEFAULT 'center',
  	"btn_color" "enum_landing_pages_blocks_hero_btn_color" DEFAULT 'terracotta',
  	"bg_style" "enum_landing_pages_blocks_hero_bg_style" DEFAULT 'gradient',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_pain_points_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😭',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_pain_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apakah Ini yang Bunda Rasakan?',
  	"subtitle" varchar DEFAULT 'Kekhawatiran yang Kerap Dialami Orang Tua Baru di Surabaya & Sidoarjo',
  	"columns" "enum_landing_pages_blocks_pain_points_columns" DEFAULT '2',
  	"background" "enum_landing_pages_blocks_pain_points_background" DEFAULT 'cream',
  	"spacing" "enum_landing_pages_blocks_pain_points_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_solutions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😴',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apa yang Berubah Setelah Perawatan di Kala?',
  	"subtitle" varchar DEFAULT 'Bukan sekadar pijat biasa, melainkan stimulasi terapeutik yang menenangkan.',
  	"highlight_quote_quote" varchar,
  	"highlight_quote_author" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_pricing_packages_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_pricing_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"target" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"description" varchar,
  	"is_popular" boolean DEFAULT false,
  	"popular_badge" varchar,
  	"cta_text" varchar DEFAULT 'Reservasi Paket Ini',
  	"ref_code" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"title" varchar DEFAULT 'Pilihan Paket Perawatan Buah Hati & Bunda',
  	"subtitle" varchar DEFAULT 'Ditangani 100% oleh bidan resmi ber-STR Kemenkes menggunakan produk organik steril.',
  	"layout_style" "enum_landing_pages_blocks_pricing_layout_style" DEFAULT 'cards',
  	"background" "enum_landing_pages_blocks_pricing_background" DEFAULT 'cream',
  	"spacing" "enum_landing_pages_blocks_pricing_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"kala_value" varchar,
  	"other_value" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mengapa Bunda Memilih Kala Dibandingkan yang Lain?',
  	"subtitle" varchar DEFAULT 'Standar kebidanan medis higienis yang kami jaga demi ketenangan hati keluarga Anda.',
  	"kala_label" varchar DEFAULT 'Kala Moms & Baby Spa',
  	"other_label" varchar DEFAULT 'Pijat Keliling / Terapis Umum',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar DEFAULT '1',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mudah & Nyaman dari Rumah',
  	"subtitle" varchar DEFAULT 'Alur praktis tanpa perlu keluar rumah dan tanpa antre.',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"area" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Kata Mereka yang Sudah Merasakan Sentuhan Kala',
  	"subtitle" varchar DEFAULT 'Ulasan asli dan terverifikasi dari orang tua yang memilih kenyamanan homecare kami.',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_guarantee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT '🛡️ Komitmen Kualitas Kala',
  	"title" varchar DEFAULT 'Puas 100% atau Sesi Pengganti Gratis',
  	"description" varchar DEFAULT 'Kami percaya pada kelembutan dan kualitas dedikasi bidan kami. Jika Bunda merasa kurang puas pada sesi pertama, kami sediakan sesi evaluasi pengganti gratis demi ketenangan buah hati Anda.',
  	"note" varchar DEFAULT '*Kepercayaan dan ketenangan keluarga Bunda adalah prioritas utama kami.',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_faq_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Pertanyaan yang Sering Diajukan Bunda',
  	"subtitle" varchar DEFAULT 'Jawaban transparan seputar kenyamanan dan higienitas homecare kami.',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"container_width" "enum_landing_pages_blocks_rich_text_container_width" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Langkah Pertama untuk Si Kecil',
  	"headline" varchar DEFAULT 'Berikan Si Kecil Awal Terbaik dalam Hidupnya',
  	"description" varchar DEFAULT 'Konsultasi gratis via WhatsApp sekarang. Bidan kami siap hadir ke rumah Anda di Surabaya & Sidoarjo.',
  	"button_text" varchar DEFAULT '💬 Chat WhatsApp Sekarang',
  	"button_message" varchar,
  	"footnote" varchar DEFAULT '⏰ Balas cepat dalam 5 menit · Bebas mom-shaming',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"caption" varchar,
  	"tag" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Dokumentasi Kala',
  	"title" varchar DEFAULT 'Momen Nyaman & Ceria Si Kecil Bersama Bidan',
  	"subtitle" varchar DEFAULT 'Dokumentasi asli kenyamanan dan kehangatan penanganan bidan resmi Kala di rumah para Bunda di Surabaya & Sidoarjo.',
  	"columns" "enum_landing_pages_blocks_gallery_columns" DEFAULT '3',
  	"bg_style" "enum_landing_pages_blocks_gallery_bg_style" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_midwife_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Ditangani Langsung oleh Bidan Profesional Ber-STR Resmi',
  	"subheading" varchar DEFAULT 'Tenaga kesehatan terdaftar Kemenkes RI yang berempati tinggi, komunikatif, dan menjamin kenyamanan Bunda tanpa mom-shaming.',
  	"background" "enum_landing_pages_blocks_midwife_spotlight_background" DEFAULT 'cream',
  	"spacing" "enum_landing_pages_blocks_midwife_spotlight_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_template_ref" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"template_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_pain_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar
  );
  
  CREATE TABLE "landing_pages_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar
  );
  
  CREATE TABLE "landing_pages_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar DEFAULT '1',
  	"title" varchar,
  	"desc" varchar
  );
  
  CREATE TABLE "landing_pages_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "landing_pages_seo_audit_issues" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"severity" "enum_landing_pages_seo_audit_issues_severity",
  	"message" varchar,
  	"target_field" varchar
  );
  
  CREATE TABLE "landing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"ref_code" varchar,
  	"active" boolean DEFAULT true,
  	"campaign_base_ref" varchar,
  	"variant" "enum_landing_pages_variant" DEFAULT 'A',
  	"price" varchar,
  	"duration" varchar,
  	"headline" varchar,
  	"subheadline" varchar,
  	"testimonial_quote" varchar,
  	"testimonial_author" varchar,
  	"testimonial_area" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_focus_keyword" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_is_substantive_update" boolean DEFAULT false,
  	"seo_score" numeric DEFAULT 0,
  	"seo_audit_score" numeric DEFAULT 0,
  	"seo_audit_grade" "enum_landing_pages_seo_audit_grade" DEFAULT 'poor',
  	"seo_audit_last_audited_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_landing_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "landing_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"midwives_id" integer
  );
  
  CREATE TABLE "_landing_pages_v_version_active_pixels" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_version_active_pixels",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar,
  	"subheadline" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"cta_text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"cta_message" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"align" "enum__landing_pages_v_blocks_hero_align" DEFAULT 'center',
  	"btn_color" "enum__landing_pages_v_blocks_hero_btn_color" DEFAULT 'terracotta',
  	"bg_style" "enum__landing_pages_v_blocks_hero_bg_style" DEFAULT 'gradient',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_pain_points_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😭',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_pain_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apakah Ini yang Bunda Rasakan?',
  	"subtitle" varchar DEFAULT 'Kekhawatiran yang Kerap Dialami Orang Tua Baru di Surabaya & Sidoarjo',
  	"columns" "enum__landing_pages_v_blocks_pain_points_columns" DEFAULT '2',
  	"background" "enum__landing_pages_v_blocks_pain_points_background" DEFAULT 'cream',
  	"spacing" "enum__landing_pages_v_blocks_pain_points_spacing" DEFAULT 'normal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_solutions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😴',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apa yang Berubah Setelah Perawatan di Kala?',
  	"subtitle" varchar DEFAULT 'Bukan sekadar pijat biasa, melainkan stimulasi terapeutik yang menenangkan.',
  	"highlight_quote_quote" varchar,
  	"highlight_quote_author" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_pricing_packages_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_pricing_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"target" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"description" varchar,
  	"is_popular" boolean DEFAULT false,
  	"popular_badge" varchar,
  	"cta_text" varchar DEFAULT 'Reservasi Paket Ini',
  	"ref_code" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"title" varchar DEFAULT 'Pilihan Paket Perawatan Buah Hati & Bunda',
  	"subtitle" varchar DEFAULT 'Ditangani 100% oleh bidan resmi ber-STR Kemenkes menggunakan produk organik steril.',
  	"layout_style" "enum__landing_pages_v_blocks_pricing_layout_style" DEFAULT 'cards',
  	"background" "enum__landing_pages_v_blocks_pricing_background" DEFAULT 'cream',
  	"spacing" "enum__landing_pages_v_blocks_pricing_spacing" DEFAULT 'normal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"kala_value" varchar,
  	"other_value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mengapa Bunda Memilih Kala Dibandingkan yang Lain?',
  	"subtitle" varchar DEFAULT 'Standar kebidanan medis higienis yang kami jaga demi ketenangan hati keluarga Anda.',
  	"kala_label" varchar DEFAULT 'Kala Moms & Baby Spa',
  	"other_label" varchar DEFAULT 'Pijat Keliling / Terapis Umum',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"num" varchar DEFAULT '1',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mudah & Nyaman dari Rumah',
  	"subtitle" varchar DEFAULT 'Alur praktis tanpa perlu keluar rumah dan tanpa antre.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"area" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Kata Mereka yang Sudah Merasakan Sentuhan Kala',
  	"subtitle" varchar DEFAULT 'Ulasan asli dan terverifikasi dari orang tua yang memilih kenyamanan homecare kami.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_guarantee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT '🛡️ Komitmen Kualitas Kala',
  	"title" varchar DEFAULT 'Puas 100% atau Sesi Pengganti Gratis',
  	"description" varchar DEFAULT 'Kami percaya pada kelembutan dan kualitas dedikasi bidan kami. Jika Bunda merasa kurang puas pada sesi pertama, kami sediakan sesi evaluasi pengganti gratis demi ketenangan buah hati Anda.',
  	"note" varchar DEFAULT '*Kepercayaan dan ketenangan keluarga Bunda adalah prioritas utama kami.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_faq_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Pertanyaan yang Sering Diajukan Bunda',
  	"subtitle" varchar DEFAULT 'Jawaban transparan seputar kenyamanan dan higienitas homecare kami.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"container_width" "enum__landing_pages_v_blocks_rich_text_container_width" DEFAULT 'normal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Langkah Pertama untuk Si Kecil',
  	"headline" varchar DEFAULT 'Berikan Si Kecil Awal Terbaik dalam Hidupnya',
  	"description" varchar DEFAULT 'Konsultasi gratis via WhatsApp sekarang. Bidan kami siap hadir ke rumah Anda di Surabaya & Sidoarjo.',
  	"button_text" varchar DEFAULT '💬 Chat WhatsApp Sekarang',
  	"button_message" varchar,
  	"footnote" varchar DEFAULT '⏰ Balas cepat dalam 5 menit · Bebas mom-shaming',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"caption" varchar,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Dokumentasi Kala',
  	"title" varchar DEFAULT 'Momen Nyaman & Ceria Si Kecil Bersama Bidan',
  	"subtitle" varchar DEFAULT 'Dokumentasi asli kenyamanan dan kehangatan penanganan bidan resmi Kala di rumah para Bunda di Surabaya & Sidoarjo.',
  	"columns" "enum__landing_pages_v_blocks_gallery_columns" DEFAULT '3',
  	"bg_style" "enum__landing_pages_v_blocks_gallery_bg_style" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_midwife_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Ditangani Langsung oleh Bidan Profesional Ber-STR Resmi',
  	"subheading" varchar DEFAULT 'Tenaga kesehatan terdaftar Kemenkes RI yang berempati tinggi, komunikatif, dan menjamin kenyamanan Bunda tanpa mom-shaming.',
  	"background" "enum__landing_pages_v_blocks_midwife_spotlight_background" DEFAULT 'cream',
  	"spacing" "enum__landing_pages_v_blocks_midwife_spotlight_spacing" DEFAULT 'normal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_template_ref" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"template_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_version_pain_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"point" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_version_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"num" varchar DEFAULT '1',
  	"title" varchar,
  	"desc" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_version_seo_audit_issues" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"severity" "enum__landing_pages_v_version_seo_audit_issues_severity",
  	"message" varchar,
  	"target_field" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_ref_code" varchar,
  	"version_active" boolean DEFAULT true,
  	"version_campaign_base_ref" varchar,
  	"version_variant" "enum__landing_pages_v_version_variant" DEFAULT 'A',
  	"version_price" varchar,
  	"version_duration" varchar,
  	"version_headline" varchar,
  	"version_subheadline" varchar,
  	"version_testimonial_quote" varchar,
  	"version_testimonial_author" varchar,
  	"version_testimonial_area" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_focus_keyword" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_is_substantive_update" boolean DEFAULT false,
  	"version_seo_score" numeric DEFAULT 0,
  	"version_seo_audit_score" numeric DEFAULT 0,
  	"version_seo_audit_grade" "enum__landing_pages_v_version_seo_audit_grade" DEFAULT 'poor',
  	"version_seo_audit_last_audited_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__landing_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_landing_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"midwives_id" integer
  );
  
  CREATE TABLE "page_templates_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar NOT NULL,
  	"subheadline" varchar NOT NULL,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"cta_text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"cta_message" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"align" "enum_page_templates_blocks_hero_align" DEFAULT 'center',
  	"btn_color" "enum_page_templates_blocks_hero_btn_color" DEFAULT 'terracotta',
  	"bg_style" "enum_page_templates_blocks_hero_bg_style" DEFAULT 'gradient',
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_pain_points_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😭',
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_pain_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apakah Ini yang Bunda Rasakan?' NOT NULL,
  	"subtitle" varchar DEFAULT 'Kekhawatiran yang Kerap Dialami Orang Tua Baru di Surabaya & Sidoarjo',
  	"columns" "enum_page_templates_blocks_pain_points_columns" DEFAULT '2',
  	"background" "enum_page_templates_blocks_pain_points_background" DEFAULT 'cream',
  	"spacing" "enum_page_templates_blocks_pain_points_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_solutions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😴',
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apa yang Berubah Setelah Perawatan di Kala?' NOT NULL,
  	"subtitle" varchar DEFAULT 'Bukan sekadar pijat biasa, melainkan stimulasi terapeutik yang menenangkan.',
  	"highlight_quote_quote" varchar,
  	"highlight_quote_author" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_pricing_packages_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_pricing_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"target" varchar,
  	"price" varchar NOT NULL,
  	"original_price" varchar,
  	"duration" varchar,
  	"description" varchar,
  	"is_popular" boolean DEFAULT false,
  	"popular_badge" varchar,
  	"cta_text" varchar DEFAULT 'Reservasi Paket Ini',
  	"ref_code" varchar
  );
  
  CREATE TABLE "page_templates_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"title" varchar DEFAULT 'Pilihan Paket Perawatan Buah Hati & Bunda' NOT NULL,
  	"subtitle" varchar DEFAULT 'Ditangani 100% oleh bidan resmi ber-STR Kemenkes menggunakan produk organik steril.',
  	"layout_style" "enum_page_templates_blocks_pricing_layout_style" DEFAULT 'cards',
  	"background" "enum_page_templates_blocks_pricing_background" DEFAULT 'cream',
  	"spacing" "enum_page_templates_blocks_pricing_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL,
  	"kala_value" varchar NOT NULL,
  	"other_value" varchar NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mengapa Bunda Memilih Kala Dibandingkan yang Lain?' NOT NULL,
  	"subtitle" varchar DEFAULT 'Standar kebidanan medis higienis yang kami jaga demi ketenangan hati keluarga Anda.',
  	"kala_label" varchar DEFAULT 'Kala Moms & Baby Spa',
  	"other_label" varchar DEFAULT 'Pijat Keliling / Terapis Umum',
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar DEFAULT '1',
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mudah & Nyaman dari Rumah' NOT NULL,
  	"subtitle" varchar DEFAULT 'Alur praktis tanpa perlu keluar rumah dan tanpa antre.',
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"role" varchar,
  	"area" varchar
  );
  
  CREATE TABLE "page_templates_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Kata Mereka yang Sudah Merasakan Sentuhan Kala' NOT NULL,
  	"subtitle" varchar DEFAULT 'Ulasan asli dan terverifikasi dari orang tua yang memilih kenyamanan homecare kami.',
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_guarantee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT '🛡️ Komitmen Kualitas Kala',
  	"title" varchar DEFAULT 'Puas 100% atau Sesi Pengganti Gratis' NOT NULL,
  	"description" varchar DEFAULT 'Kami percaya pada kelembutan dan kualitas dedikasi bidan kami. Jika Bunda merasa kurang puas pada sesi pertama, kami sediakan sesi evaluasi pengganti gratis demi ketenangan buah hati Anda.' NOT NULL,
  	"note" varchar DEFAULT '*Kepercayaan dan ketenangan keluarga Bunda adalah prioritas utama kami.',
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_faq_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Pertanyaan yang Sering Diajukan Bunda' NOT NULL,
  	"subtitle" varchar DEFAULT 'Jawaban transparan seputar kenyamanan dan higienitas homecare kami.',
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"container_width" "enum_page_templates_blocks_rich_text_container_width" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Langkah Pertama untuk Si Kecil',
  	"headline" varchar DEFAULT 'Berikan Si Kecil Awal Terbaik dalam Hidupnya' NOT NULL,
  	"description" varchar DEFAULT 'Konsultasi gratis via WhatsApp sekarang. Bidan kami siap hadir ke rumah Anda di Surabaya & Sidoarjo.',
  	"button_text" varchar DEFAULT '💬 Chat WhatsApp Sekarang',
  	"button_message" varchar,
  	"footnote" varchar DEFAULT '⏰ Balas cepat dalam 5 menit · Bebas mom-shaming',
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"caption" varchar,
  	"tag" varchar
  );
  
  CREATE TABLE "page_templates_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Dokumentasi Kala',
  	"title" varchar DEFAULT 'Momen Nyaman & Ceria Si Kecil Bersama Bidan' NOT NULL,
  	"subtitle" varchar DEFAULT 'Dokumentasi asli kenyamanan dan kehangatan penanganan bidan resmi Kala di rumah para Bunda di Surabaya & Sidoarjo.',
  	"columns" "enum_page_templates_blocks_gallery_columns" DEFAULT '3',
  	"bg_style" "enum_page_templates_blocks_gallery_bg_style" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_midwife_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Ditangani Langsung oleh Bidan Profesional Ber-STR Resmi' NOT NULL,
  	"subheading" varchar DEFAULT 'Tenaga kesehatan terdaftar Kemenkes RI yang berempati tinggi, komunikatif, dan menjamin kenyamanan Bunda tanpa mom-shaming.',
  	"background" "enum_page_templates_blocks_midwife_spotlight_background" DEFAULT 'cream',
  	"spacing" "enum_page_templates_blocks_midwife_spotlight_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_template_ref" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"template_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "enum_page_templates_category" DEFAULT 'kolik',
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "page_templates_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"midwives_id" integer
  );
  
  CREATE TABLE "block_templates_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar,
  	"subheadline" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"cta_text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"cta_message" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"align" "enum_block_templates_blocks_hero_align" DEFAULT 'center',
  	"btn_color" "enum_block_templates_blocks_hero_btn_color" DEFAULT 'terracotta',
  	"bg_style" "enum_block_templates_blocks_hero_bg_style" DEFAULT 'gradient',
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_pain_points_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😭',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "block_templates_blocks_pain_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apakah Ini yang Bunda Rasakan?',
  	"subtitle" varchar DEFAULT 'Kekhawatiran yang Kerap Dialami Orang Tua Baru di Surabaya & Sidoarjo',
  	"columns" "enum_block_templates_blocks_pain_points_columns" DEFAULT '2',
  	"background" "enum_block_templates_blocks_pain_points_background" DEFAULT 'cream',
  	"spacing" "enum_block_templates_blocks_pain_points_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_solutions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😴',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "block_templates_blocks_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apa yang Berubah Setelah Perawatan di Kala?',
  	"subtitle" varchar DEFAULT 'Bukan sekadar pijat biasa, melainkan stimulasi terapeutik yang menenangkan.',
  	"highlight_quote_quote" varchar,
  	"highlight_quote_author" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_pricing_packages_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "block_templates_blocks_pricing_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"target" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"description" varchar,
  	"is_popular" boolean DEFAULT false,
  	"popular_badge" varchar,
  	"cta_text" varchar DEFAULT 'Reservasi Paket Ini',
  	"ref_code" varchar
  );
  
  CREATE TABLE "block_templates_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"title" varchar DEFAULT 'Pilihan Paket Perawatan Buah Hati & Bunda',
  	"subtitle" varchar DEFAULT 'Ditangani 100% oleh bidan resmi ber-STR Kemenkes menggunakan produk organik steril.',
  	"layout_style" "enum_block_templates_blocks_pricing_layout_style" DEFAULT 'cards',
  	"background" "enum_block_templates_blocks_pricing_background" DEFAULT 'cream',
  	"spacing" "enum_block_templates_blocks_pricing_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"kala_value" varchar,
  	"other_value" varchar
  );
  
  CREATE TABLE "block_templates_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mengapa Bunda Memilih Kala Dibandingkan yang Lain?',
  	"subtitle" varchar DEFAULT 'Standar kebidanan medis higienis yang kami jaga demi ketenangan hati keluarga Anda.',
  	"kala_label" varchar DEFAULT 'Kala Moms & Baby Spa',
  	"other_label" varchar DEFAULT 'Pijat Keliling / Terapis Umum',
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar DEFAULT '1',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "block_templates_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mudah & Nyaman dari Rumah',
  	"subtitle" varchar DEFAULT 'Alur praktis tanpa perlu keluar rumah dan tanpa antre.',
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"area" varchar
  );
  
  CREATE TABLE "block_templates_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Kata Mereka yang Sudah Merasakan Sentuhan Kala',
  	"subtitle" varchar DEFAULT 'Ulasan asli dan terverifikasi dari orang tua yang memilih kenyamanan homecare kami.',
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_guarantee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT '🛡️ Komitmen Kualitas Kala',
  	"title" varchar DEFAULT 'Puas 100% atau Sesi Pengganti Gratis',
  	"description" varchar DEFAULT 'Kami percaya pada kelembutan dan kualitas dedikasi bidan kami. Jika Bunda merasa kurang puas pada sesi pertama, kami sediakan sesi evaluasi pengganti gratis demi ketenangan buah hati Anda.',
  	"note" varchar DEFAULT '*Kepercayaan dan ketenangan keluarga Bunda adalah prioritas utama kami.',
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_faq_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "block_templates_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Pertanyaan yang Sering Diajukan Bunda',
  	"subtitle" varchar DEFAULT 'Jawaban transparan seputar kenyamanan dan higienitas homecare kami.',
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"container_width" "enum_block_templates_blocks_rich_text_container_width" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Langkah Pertama untuk Si Kecil',
  	"headline" varchar DEFAULT 'Berikan Si Kecil Awal Terbaik dalam Hidupnya',
  	"description" varchar DEFAULT 'Konsultasi gratis via WhatsApp sekarang. Bidan kami siap hadir ke rumah Anda di Surabaya & Sidoarjo.',
  	"button_text" varchar DEFAULT '💬 Chat WhatsApp Sekarang',
  	"button_message" varchar,
  	"footnote" varchar DEFAULT '⏰ Balas cepat dalam 5 menit · Bebas mom-shaming',
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"caption" varchar,
  	"tag" varchar
  );
  
  CREATE TABLE "block_templates_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Dokumentasi Kala',
  	"title" varchar DEFAULT 'Momen Nyaman & Ceria Si Kecil Bersama Bidan',
  	"subtitle" varchar DEFAULT 'Dokumentasi asli kenyamanan dan kehangatan penanganan bidan resmi Kala di rumah para Bunda di Surabaya & Sidoarjo.',
  	"columns" "enum_block_templates_blocks_gallery_columns" DEFAULT '3',
  	"bg_style" "enum_block_templates_blocks_gallery_bg_style" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_midwife_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Ditangani Langsung oleh Bidan Profesional Ber-STR Resmi',
  	"subheading" varchar DEFAULT 'Tenaga kesehatan terdaftar Kemenkes RI yang berempati tinggi, komunikatif, dan menjamin kenyamanan Bunda tanpa mom-shaming.',
  	"background" "enum_block_templates_blocks_midwife_spotlight_background" DEFAULT 'cream',
  	"spacing" "enum_block_templates_blocks_midwife_spotlight_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"category" "enum_block_templates_category" DEFAULT 'promo',
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_block_templates_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "block_templates_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"midwives_id" integer
  );
  
  CREATE TABLE "_block_templates_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar,
  	"subheadline" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"cta_text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"cta_message" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"align" "enum__block_templates_v_blocks_hero_align" DEFAULT 'center',
  	"btn_color" "enum__block_templates_v_blocks_hero_btn_color" DEFAULT 'terracotta',
  	"bg_style" "enum__block_templates_v_blocks_hero_bg_style" DEFAULT 'gradient',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_pain_points_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😭',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_pain_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apakah Ini yang Bunda Rasakan?',
  	"subtitle" varchar DEFAULT 'Kekhawatiran yang Kerap Dialami Orang Tua Baru di Surabaya & Sidoarjo',
  	"columns" "enum__block_templates_v_blocks_pain_points_columns" DEFAULT '2',
  	"background" "enum__block_templates_v_blocks_pain_points_background" DEFAULT 'cream',
  	"spacing" "enum__block_templates_v_blocks_pain_points_spacing" DEFAULT 'normal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_solutions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😴',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apa yang Berubah Setelah Perawatan di Kala?',
  	"subtitle" varchar DEFAULT 'Bukan sekadar pijat biasa, melainkan stimulasi terapeutik yang menenangkan.',
  	"highlight_quote_quote" varchar,
  	"highlight_quote_author" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_pricing_packages_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_pricing_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"target" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"description" varchar,
  	"is_popular" boolean DEFAULT false,
  	"popular_badge" varchar,
  	"cta_text" varchar DEFAULT 'Reservasi Paket Ini',
  	"ref_code" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"title" varchar DEFAULT 'Pilihan Paket Perawatan Buah Hati & Bunda',
  	"subtitle" varchar DEFAULT 'Ditangani 100% oleh bidan resmi ber-STR Kemenkes menggunakan produk organik steril.',
  	"layout_style" "enum__block_templates_v_blocks_pricing_layout_style" DEFAULT 'cards',
  	"background" "enum__block_templates_v_blocks_pricing_background" DEFAULT 'cream',
  	"spacing" "enum__block_templates_v_blocks_pricing_spacing" DEFAULT 'normal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"kala_value" varchar,
  	"other_value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mengapa Bunda Memilih Kala Dibandingkan yang Lain?',
  	"subtitle" varchar DEFAULT 'Standar kebidanan medis higienis yang kami jaga demi ketenangan hati keluarga Anda.',
  	"kala_label" varchar DEFAULT 'Kala Moms & Baby Spa',
  	"other_label" varchar DEFAULT 'Pijat Keliling / Terapis Umum',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"num" varchar DEFAULT '1',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mudah & Nyaman dari Rumah',
  	"subtitle" varchar DEFAULT 'Alur praktis tanpa perlu keluar rumah dan tanpa antre.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"area" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Kata Mereka yang Sudah Merasakan Sentuhan Kala',
  	"subtitle" varchar DEFAULT 'Ulasan asli dan terverifikasi dari orang tua yang memilih kenyamanan homecare kami.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_guarantee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT '🛡️ Komitmen Kualitas Kala',
  	"title" varchar DEFAULT 'Puas 100% atau Sesi Pengganti Gratis',
  	"description" varchar DEFAULT 'Kami percaya pada kelembutan dan kualitas dedikasi bidan kami. Jika Bunda merasa kurang puas pada sesi pertama, kami sediakan sesi evaluasi pengganti gratis demi ketenangan buah hati Anda.',
  	"note" varchar DEFAULT '*Kepercayaan dan ketenangan keluarga Bunda adalah prioritas utama kami.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_faq_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Pertanyaan yang Sering Diajukan Bunda',
  	"subtitle" varchar DEFAULT 'Jawaban transparan seputar kenyamanan dan higienitas homecare kami.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"container_width" "enum__block_templates_v_blocks_rich_text_container_width" DEFAULT 'normal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Langkah Pertama untuk Si Kecil',
  	"headline" varchar DEFAULT 'Berikan Si Kecil Awal Terbaik dalam Hidupnya',
  	"description" varchar DEFAULT 'Konsultasi gratis via WhatsApp sekarang. Bidan kami siap hadir ke rumah Anda di Surabaya & Sidoarjo.',
  	"button_text" varchar DEFAULT '💬 Chat WhatsApp Sekarang',
  	"button_message" varchar,
  	"footnote" varchar DEFAULT '⏰ Balas cepat dalam 5 menit · Bebas mom-shaming',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"caption" varchar,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Dokumentasi Kala',
  	"title" varchar DEFAULT 'Momen Nyaman & Ceria Si Kecil Bersama Bidan',
  	"subtitle" varchar DEFAULT 'Dokumentasi asli kenyamanan dan kehangatan penanganan bidan resmi Kala di rumah para Bunda di Surabaya & Sidoarjo.',
  	"columns" "enum__block_templates_v_blocks_gallery_columns" DEFAULT '3',
  	"bg_style" "enum__block_templates_v_blocks_gallery_bg_style" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_midwife_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Ditangani Langsung oleh Bidan Profesional Ber-STR Resmi',
  	"subheading" varchar DEFAULT 'Tenaga kesehatan terdaftar Kemenkes RI yang berempati tinggi, komunikatif, dan menjamin kenyamanan Bunda tanpa mom-shaming.',
  	"background" "enum__block_templates_v_blocks_midwife_spotlight_background" DEFAULT 'cream',
  	"spacing" "enum__block_templates_v_blocks_midwife_spotlight_spacing" DEFAULT 'normal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_category" "enum__block_templates_v_version_category" DEFAULT 'promo',
  	"version_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__block_templates_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_block_templates_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"midwives_id" integer
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar,
  	"subheadline" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"cta_text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"cta_message" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"align" "enum_pages_blocks_hero_align" DEFAULT 'center',
  	"btn_color" "enum_pages_blocks_hero_btn_color" DEFAULT 'terracotta',
  	"bg_style" "enum_pages_blocks_hero_bg_style" DEFAULT 'gradient',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pain_points_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😭',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_pain_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apakah Ini yang Bunda Rasakan?',
  	"subtitle" varchar DEFAULT 'Kekhawatiran yang Kerap Dialami Orang Tua Baru di Surabaya & Sidoarjo',
  	"columns" "enum_pages_blocks_pain_points_columns" DEFAULT '2',
  	"background" "enum_pages_blocks_pain_points_background" DEFAULT 'cream',
  	"spacing" "enum_pages_blocks_pain_points_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_solutions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😴',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apa yang Berubah Setelah Perawatan di Kala?',
  	"subtitle" varchar DEFAULT 'Bukan sekadar pijat biasa, melainkan stimulasi terapeutik yang menenangkan.',
  	"highlight_quote_quote" varchar,
  	"highlight_quote_author" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_packages_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"target" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"description" varchar,
  	"is_popular" boolean DEFAULT false,
  	"popular_badge" varchar,
  	"cta_text" varchar DEFAULT 'Reservasi Paket Ini',
  	"ref_code" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"title" varchar DEFAULT 'Pilihan Paket Perawatan Buah Hati & Bunda',
  	"subtitle" varchar DEFAULT 'Ditangani 100% oleh bidan resmi ber-STR Kemenkes menggunakan produk organik steril.',
  	"layout_style" "enum_pages_blocks_pricing_layout_style" DEFAULT 'cards',
  	"background" "enum_pages_blocks_pricing_background" DEFAULT 'cream',
  	"spacing" "enum_pages_blocks_pricing_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"kala_value" varchar,
  	"other_value" varchar
  );
  
  CREATE TABLE "pages_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mengapa Bunda Memilih Kala Dibandingkan yang Lain?',
  	"subtitle" varchar DEFAULT 'Standar kebidanan medis higienis yang kami jaga demi ketenangan hati keluarga Anda.',
  	"kala_label" varchar DEFAULT 'Kala Moms & Baby Spa',
  	"other_label" varchar DEFAULT 'Pijat Keliling / Terapis Umum',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar DEFAULT '1',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mudah & Nyaman dari Rumah',
  	"subtitle" varchar DEFAULT 'Alur praktis tanpa perlu keluar rumah dan tanpa antre.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"area" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Kata Mereka yang Sudah Merasakan Sentuhan Kala',
  	"subtitle" varchar DEFAULT 'Ulasan asli dan terverifikasi dari orang tua yang memilih kenyamanan homecare kami.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_guarantee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT '🛡️ Komitmen Kualitas Kala',
  	"title" varchar DEFAULT 'Puas 100% atau Sesi Pengganti Gratis',
  	"description" varchar DEFAULT 'Kami percaya pada kelembutan dan kualitas dedikasi bidan kami. Jika Bunda merasa kurang puas pada sesi pertama, kami sediakan sesi evaluasi pengganti gratis demi ketenangan buah hati Anda.',
  	"note" varchar DEFAULT '*Kepercayaan dan ketenangan keluarga Bunda adalah prioritas utama kami.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Pertanyaan yang Sering Diajukan Bunda',
  	"subtitle" varchar DEFAULT 'Jawaban transparan seputar kenyamanan dan higienitas homecare kami.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"container_width" "enum_pages_blocks_rich_text_container_width" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Langkah Pertama untuk Si Kecil',
  	"headline" varchar DEFAULT 'Berikan Si Kecil Awal Terbaik dalam Hidupnya',
  	"description" varchar DEFAULT 'Konsultasi gratis via WhatsApp sekarang. Bidan kami siap hadir ke rumah Anda di Surabaya & Sidoarjo.',
  	"button_text" varchar DEFAULT '💬 Chat WhatsApp Sekarang',
  	"button_message" varchar,
  	"footnote" varchar DEFAULT '⏰ Balas cepat dalam 5 menit · Bebas mom-shaming',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"caption" varchar,
  	"tag" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Dokumentasi Kala',
  	"title" varchar DEFAULT 'Momen Nyaman & Ceria Si Kecil Bersama Bidan',
  	"subtitle" varchar DEFAULT 'Dokumentasi asli kenyamanan dan kehangatan penanganan bidan resmi Kala di rumah para Bunda di Surabaya & Sidoarjo.',
  	"columns" "enum_pages_blocks_gallery_columns" DEFAULT '3',
  	"bg_style" "enum_pages_blocks_gallery_bg_style" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_midwife_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Ditangani Langsung oleh Bidan Profesional Ber-STR Resmi',
  	"subheading" varchar DEFAULT 'Tenaga kesehatan terdaftar Kemenkes RI yang berempati tinggi, komunikatif, dan menjamin kenyamanan Bunda tanpa mom-shaming.',
  	"background" "enum_pages_blocks_midwife_spotlight_background" DEFAULT 'cream',
  	"spacing" "enum_pages_blocks_midwife_spotlight_spacing" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_template_ref" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"template_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_seo_audit_issues" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"severity" "enum_pages_seo_audit_issues_severity",
  	"message" varchar,
  	"target_field" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"show_whats_app_cta" boolean DEFAULT true,
  	"whatsapp_custom_message" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_focus_keyword" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_is_substantive_update" boolean DEFAULT false,
  	"seo_score" numeric DEFAULT 0,
  	"seo_audit_score" numeric DEFAULT 0,
  	"seo_audit_grade" "enum_pages_seo_audit_grade" DEFAULT 'poor',
  	"seo_audit_last_audited_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"midwives_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar,
  	"subheadline" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"cta_text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"cta_message" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"align" "enum__pages_v_blocks_hero_align" DEFAULT 'center',
  	"btn_color" "enum__pages_v_blocks_hero_btn_color" DEFAULT 'terracotta',
  	"bg_style" "enum__pages_v_blocks_hero_bg_style" DEFAULT 'gradient',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pain_points_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😭',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pain_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apakah Ini yang Bunda Rasakan?',
  	"subtitle" varchar DEFAULT 'Kekhawatiran yang Kerap Dialami Orang Tua Baru di Surabaya & Sidoarjo',
  	"columns" "enum__pages_v_blocks_pain_points_columns" DEFAULT '2',
  	"background" "enum__pages_v_blocks_pain_points_background" DEFAULT 'cream',
  	"spacing" "enum__pages_v_blocks_pain_points_spacing" DEFAULT 'normal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_solutions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT '😴',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Apa yang Berubah Setelah Perawatan di Kala?',
  	"subtitle" varchar DEFAULT 'Bukan sekadar pijat biasa, melainkan stimulasi terapeutik yang menenangkan.',
  	"highlight_quote_quote" varchar,
  	"highlight_quote_author" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_packages_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"target" varchar,
  	"price" varchar,
  	"original_price" varchar,
  	"duration" varchar,
  	"description" varchar,
  	"is_popular" boolean DEFAULT false,
  	"popular_badge" varchar,
  	"cta_text" varchar DEFAULT 'Reservasi Paket Ini',
  	"ref_code" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"title" varchar DEFAULT 'Pilihan Paket Perawatan Buah Hati & Bunda',
  	"subtitle" varchar DEFAULT 'Ditangani 100% oleh bidan resmi ber-STR Kemenkes menggunakan produk organik steril.',
  	"layout_style" "enum__pages_v_blocks_pricing_layout_style" DEFAULT 'cards',
  	"background" "enum__pages_v_blocks_pricing_background" DEFAULT 'cream',
  	"spacing" "enum__pages_v_blocks_pricing_spacing" DEFAULT 'normal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"kala_value" varchar,
  	"other_value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mengapa Bunda Memilih Kala Dibandingkan yang Lain?',
  	"subtitle" varchar DEFAULT 'Standar kebidanan medis higienis yang kami jaga demi ketenangan hati keluarga Anda.',
  	"kala_label" varchar DEFAULT 'Kala Moms & Baby Spa',
  	"other_label" varchar DEFAULT 'Pijat Keliling / Terapis Umum',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"num" varchar DEFAULT '1',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Mudah & Nyaman dari Rumah',
  	"subtitle" varchar DEFAULT 'Alur praktis tanpa perlu keluar rumah dan tanpa antre.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"area" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Kata Mereka yang Sudah Merasakan Sentuhan Kala',
  	"subtitle" varchar DEFAULT 'Ulasan asli dan terverifikasi dari orang tua yang memilih kenyamanan homecare kami.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_guarantee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT '🛡️ Komitmen Kualitas Kala',
  	"title" varchar DEFAULT 'Puas 100% atau Sesi Pengganti Gratis',
  	"description" varchar DEFAULT 'Kami percaya pada kelembutan dan kualitas dedikasi bidan kami. Jika Bunda merasa kurang puas pada sesi pertama, kami sediakan sesi evaluasi pengganti gratis demi ketenangan buah hati Anda.',
  	"note" varchar DEFAULT '*Kepercayaan dan ketenangan keluarga Bunda adalah prioritas utama kami.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Pertanyaan yang Sering Diajukan Bunda',
  	"subtitle" varchar DEFAULT 'Jawaban transparan seputar kenyamanan dan higienitas homecare kami.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"container_width" "enum__pages_v_blocks_rich_text_container_width" DEFAULT 'normal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Langkah Pertama untuk Si Kecil',
  	"headline" varchar DEFAULT 'Berikan Si Kecil Awal Terbaik dalam Hidupnya',
  	"description" varchar DEFAULT 'Konsultasi gratis via WhatsApp sekarang. Bidan kami siap hadir ke rumah Anda di Surabaya & Sidoarjo.',
  	"button_text" varchar DEFAULT '💬 Chat WhatsApp Sekarang',
  	"button_message" varchar,
  	"footnote" varchar DEFAULT '⏰ Balas cepat dalam 5 menit · Bebas mom-shaming',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"caption" varchar,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar DEFAULT 'Dokumentasi Kala',
  	"title" varchar DEFAULT 'Momen Nyaman & Ceria Si Kecil Bersama Bidan',
  	"subtitle" varchar DEFAULT 'Dokumentasi asli kenyamanan dan kehangatan penanganan bidan resmi Kala di rumah para Bunda di Surabaya & Sidoarjo.',
  	"columns" "enum__pages_v_blocks_gallery_columns" DEFAULT '3',
  	"bg_style" "enum__pages_v_blocks_gallery_bg_style" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_midwife_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Ditangani Langsung oleh Bidan Profesional Ber-STR Resmi',
  	"subheading" varchar DEFAULT 'Tenaga kesehatan terdaftar Kemenkes RI yang berempati tinggi, komunikatif, dan menjamin kenyamanan Bunda tanpa mom-shaming.',
  	"background" "enum__pages_v_blocks_midwife_spotlight_background" DEFAULT 'cream',
  	"spacing" "enum__pages_v_blocks_midwife_spotlight_spacing" DEFAULT 'normal',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_template_ref" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"template_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_seo_audit_issues" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"severity" "enum__pages_v_version_seo_audit_issues_severity",
  	"message" varchar,
  	"target_field" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_show_whats_app_cta" boolean DEFAULT true,
  	"version_whatsapp_custom_message" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_focus_keyword" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_is_substantive_update" boolean DEFAULT false,
  	"version_seo_score" numeric DEFAULT 0,
  	"version_seo_audit_score" numeric DEFAULT 0,
  	"version_seo_audit_grade" "enum__pages_v_version_seo_audit_grade" DEFAULT 'poor',
  	"version_seo_audit_last_audited_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"midwives_id" integer
  );
  
  CREATE TABLE "services_included_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"target" varchar NOT NULL,
  	"numeric_price" numeric NOT NULL,
  	"price" varchar,
  	"original_price" varchar,
  	"duration_minutes" numeric,
  	"duration" varchar,
  	"confirm_large_price_change" boolean DEFAULT false,
  	"short_description" varchar,
  	"description" varchar NOT NULL,
  	"image_id" integer,
  	"badge" varchar,
  	"recommended" boolean DEFAULT false,
  	"slug" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"order" numeric DEFAULT 1,
  	"ref_code" varchar NOT NULL,
  	"message" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_focus_keyword" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_is_substantive_update" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "midwives_specialties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"specialty" varchar NOT NULL
  );
  
  CREATE TABLE "midwives" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"str_number" varchar NOT NULL,
  	"photo_id" integer,
  	"experience_years" numeric,
  	"bio" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_focus_keyword" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_is_substantive_update" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_areas_landmarks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "service_areas_available_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_name" varchar NOT NULL
  );
  
  CREATE TABLE "service_areas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"city" "enum_service_areas_city" DEFAULT 'Surabaya' NOT NULL,
  	"unique_description" varchar NOT NULL,
  	"estimated_arrival_minutes" varchar,
  	"slug" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_focus_keyword" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_is_substantive_update" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"area" varchar NOT NULL,
  	"service" varchar NOT NULL,
  	"related_service_id" integer,
  	"related_area_id" integer,
  	"quote" varchar NOT NULL,
  	"photo_id" integer,
  	"permission_granted" boolean DEFAULT true NOT NULL,
  	"external_ref" varchar,
  	"date" timestamp(3) with time zone,
  	"order" numeric DEFAULT 1,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"category" "enum_faq_category" DEFAULT 'layanan' NOT NULL,
  	"order" numeric DEFAULT 1,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"service_areas_id" integer
  );
  
  CREATE TABLE "articles_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar
  );
  
  CREATE TABLE "articles_seo_audit_issues" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"severity" "enum_articles_seo_audit_issues_severity",
  	"message" varchar,
  	"target_field" varchar
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"category" "enum_articles_category" DEFAULT 'bayi',
  	"pub_date" timestamp(3) with time zone,
  	"updated_date" timestamp(3) with time zone,
  	"author" varchar DEFAULT 'Bidan Annisa, S.Tr.Keb',
  	"author_title" varchar DEFAULT 'Bidan Praktisi Homecare Kala',
  	"medical_reviewer" varchar DEFAULT 'Tim Medis & Kebidanan Kala Moms and Baby Spa',
  	"description" varchar,
  	"hero_image_id" integer,
  	"hero_image_url_fallback" varchar,
  	"hero_image_alt" varchar,
  	"content" jsonb,
  	"slug" varchar,
  	"internal_linking_is_pillar_article" boolean DEFAULT false,
  	"internal_linking_parent_pillar_id" integer,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_focus_keyword" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_is_substantive_update" boolean DEFAULT false,
  	"seo_score" numeric DEFAULT 0,
  	"seo_audit_score" numeric DEFAULT 0,
  	"seo_audit_grade" "enum_articles_seo_audit_grade" DEFAULT 'poor',
  	"seo_audit_last_audited_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"articles_id" integer,
  	"service_areas_id" integer
  );
  
  CREATE TABLE "_articles_v_version_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"keyword" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_version_seo_audit_issues" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"severity" "enum__articles_v_version_seo_audit_issues_severity",
  	"message" varchar,
  	"target_field" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_category" "enum__articles_v_version_category" DEFAULT 'bayi',
  	"version_pub_date" timestamp(3) with time zone,
  	"version_updated_date" timestamp(3) with time zone,
  	"version_author" varchar DEFAULT 'Bidan Annisa, S.Tr.Keb',
  	"version_author_title" varchar DEFAULT 'Bidan Praktisi Homecare Kala',
  	"version_medical_reviewer" varchar DEFAULT 'Tim Medis & Kebidanan Kala Moms and Baby Spa',
  	"version_description" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_image_url_fallback" varchar,
  	"version_hero_image_alt" varchar,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_internal_linking_is_pillar_article" boolean DEFAULT false,
  	"version_internal_linking_parent_pillar_id" integer,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_focus_keyword" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_is_substantive_update" boolean DEFAULT false,
  	"version_seo_score" numeric DEFAULT 0,
  	"version_seo_audit_score" numeric DEFAULT 0,
  	"version_seo_audit_grade" "enum__articles_v_version_seo_audit_grade" DEFAULT 'poor',
  	"version_seo_audit_last_audited_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"articles_id" integer,
  	"service_areas_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"type" "enum_redirects_type" DEFAULT '301' NOT NULL,
  	"active" boolean DEFAULT true,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'operator' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"help_center_id" integer,
  	"landing_pages_id" integer,
  	"page_templates_id" integer,
  	"block_templates_id" integer,
  	"pages_id" integer,
  	"services_id" integer,
  	"midwives_id" integer,
  	"service_areas_id" integer,
  	"testimonials_id" integer,
  	"faq_id" integer,
  	"articles_id" integer,
  	"media_id" integer,
  	"redirects_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE "site_settings_homepage_pain_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_homepage_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_homepage_booking_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"whatsapp_number" varchar NOT NULL,
  	"whatsapp_number_formatted" varchar,
  	"instagram" varchar,
  	"operational_hours" varchar,
  	"operational_schedule_timezone" varchar DEFAULT 'Asia/Jakarta',
  	"operational_schedule_after_hours_announcement" varchar DEFAULT 'Terima kasih telah menghubungi Kala Moms & Baby Spa. Layanan konsultasi saat ini sedang di luar jam operasional (08.00–17.00 WIB). Pesan Bunda telah tercatat dalam antrean dan akan segera dihubungi oleh Bidan kami besok pagi.',
  	"hero_badge_text" varchar,
  	"social_proof_text" varchar,
  	"banner_group_announcement_banner" varchar,
  	"banner_group_banner_start_date" timestamp(3) with time zone,
  	"banner_group_banner_end_date" timestamp(3) with time zone,
  	"homepage_hero_headline" varchar,
  	"homepage_hero_tagline" varchar,
  	"homepage_hero_description" varchar,
  	"homepage_promotion_title" varchar,
  	"homepage_promotion_description" varchar,
  	"homepage_promotion_service_name" varchar,
  	"homepage_promotion_price" varchar,
  	"homepage_promotion_original_price" varchar,
  	"homepage_promotion_badge" varchar,
  	"homepage_promotion_note" varchar,
  	"homepage_promotion_capacity_note" varchar,
  	"homepage_promotion_ref_code" varchar,
  	"homepage_promotion_message" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "help_center_steps" ADD CONSTRAINT "help_center_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."help_center"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "help_center_dos_and_donts_dos" ADD CONSTRAINT "help_center_dos_and_donts_dos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."help_center"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "help_center_dos_and_donts_donts" ADD CONSTRAINT "help_center_dos_and_donts_donts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."help_center"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_active_pixels" ADD CONSTRAINT "landing_pages_active_pixels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_hero" ADD CONSTRAINT "landing_pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_hero" ADD CONSTRAINT "landing_pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_pain_points_points" ADD CONSTRAINT "landing_pages_blocks_pain_points_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_pain_points" ADD CONSTRAINT "landing_pages_blocks_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_solutions_items" ADD CONSTRAINT "landing_pages_blocks_solutions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_solutions" ADD CONSTRAINT "landing_pages_blocks_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_pricing_packages_features" ADD CONSTRAINT "landing_pages_blocks_pricing_packages_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_pricing_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_pricing_packages" ADD CONSTRAINT "landing_pages_blocks_pricing_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_pricing" ADD CONSTRAINT "landing_pages_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_comparison_rows" ADD CONSTRAINT "landing_pages_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_comparison" ADD CONSTRAINT "landing_pages_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_steps_steps" ADD CONSTRAINT "landing_pages_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_steps" ADD CONSTRAINT "landing_pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_testimonials_items" ADD CONSTRAINT "landing_pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_testimonials" ADD CONSTRAINT "landing_pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_guarantee" ADD CONSTRAINT "landing_pages_blocks_guarantee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_faq_faqs" ADD CONSTRAINT "landing_pages_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_faq" ADD CONSTRAINT "landing_pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_rich_text" ADD CONSTRAINT "landing_pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_cta" ADD CONSTRAINT "landing_pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_gallery_images" ADD CONSTRAINT "landing_pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_gallery_images" ADD CONSTRAINT "landing_pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_gallery" ADD CONSTRAINT "landing_pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_midwife_spotlight" ADD CONSTRAINT "landing_pages_blocks_midwife_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_template_ref" ADD CONSTRAINT "landing_pages_blocks_template_ref_template_id_block_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."block_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_template_ref" ADD CONSTRAINT "landing_pages_blocks_template_ref_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_pain_points" ADD CONSTRAINT "landing_pages_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_solutions" ADD CONSTRAINT "landing_pages_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_steps" ADD CONSTRAINT "landing_pages_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_faqs" ADD CONSTRAINT "landing_pages_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_seo_audit_issues" ADD CONSTRAINT "landing_pages_seo_audit_issues_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages" ADD CONSTRAINT "landing_pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_rels" ADD CONSTRAINT "landing_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_rels" ADD CONSTRAINT "landing_pages_rels_midwives_fk" FOREIGN KEY ("midwives_id") REFERENCES "public"."midwives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_active_pixels" ADD CONSTRAINT "_landing_pages_v_version_active_pixels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_hero" ADD CONSTRAINT "_landing_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_hero" ADD CONSTRAINT "_landing_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_pain_points_points" ADD CONSTRAINT "_landing_pages_v_blocks_pain_points_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_pain_points" ADD CONSTRAINT "_landing_pages_v_blocks_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_solutions_items" ADD CONSTRAINT "_landing_pages_v_blocks_solutions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_solutions" ADD CONSTRAINT "_landing_pages_v_blocks_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_pricing_packages_features" ADD CONSTRAINT "_landing_pages_v_blocks_pricing_packages_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_pricing_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_pricing_packages" ADD CONSTRAINT "_landing_pages_v_blocks_pricing_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_pricing" ADD CONSTRAINT "_landing_pages_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_comparison_rows" ADD CONSTRAINT "_landing_pages_v_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_comparison" ADD CONSTRAINT "_landing_pages_v_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_steps_steps" ADD CONSTRAINT "_landing_pages_v_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_steps" ADD CONSTRAINT "_landing_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_landing_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_testimonials" ADD CONSTRAINT "_landing_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_guarantee" ADD CONSTRAINT "_landing_pages_v_blocks_guarantee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_faq_faqs" ADD CONSTRAINT "_landing_pages_v_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_faq" ADD CONSTRAINT "_landing_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_rich_text" ADD CONSTRAINT "_landing_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_cta" ADD CONSTRAINT "_landing_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_gallery_images" ADD CONSTRAINT "_landing_pages_v_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_gallery_images" ADD CONSTRAINT "_landing_pages_v_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_gallery" ADD CONSTRAINT "_landing_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_midwife_spotlight" ADD CONSTRAINT "_landing_pages_v_blocks_midwife_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_template_ref" ADD CONSTRAINT "_landing_pages_v_blocks_template_ref_template_id_block_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."block_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_template_ref" ADD CONSTRAINT "_landing_pages_v_blocks_template_ref_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_pain_points" ADD CONSTRAINT "_landing_pages_v_version_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_solutions" ADD CONSTRAINT "_landing_pages_v_version_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_steps" ADD CONSTRAINT "_landing_pages_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_faqs" ADD CONSTRAINT "_landing_pages_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_seo_audit_issues" ADD CONSTRAINT "_landing_pages_v_version_seo_audit_issues_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v" ADD CONSTRAINT "_landing_pages_v_parent_id_landing_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v" ADD CONSTRAINT "_landing_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_rels" ADD CONSTRAINT "_landing_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_rels" ADD CONSTRAINT "_landing_pages_v_rels_midwives_fk" FOREIGN KEY ("midwives_id") REFERENCES "public"."midwives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_hero" ADD CONSTRAINT "page_templates_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_hero" ADD CONSTRAINT "page_templates_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_pain_points_points" ADD CONSTRAINT "page_templates_blocks_pain_points_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_pain_points" ADD CONSTRAINT "page_templates_blocks_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_solutions_items" ADD CONSTRAINT "page_templates_blocks_solutions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_solutions" ADD CONSTRAINT "page_templates_blocks_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_pricing_packages_features" ADD CONSTRAINT "page_templates_blocks_pricing_packages_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_pricing_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_pricing_packages" ADD CONSTRAINT "page_templates_blocks_pricing_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_pricing" ADD CONSTRAINT "page_templates_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_comparison_rows" ADD CONSTRAINT "page_templates_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_comparison" ADD CONSTRAINT "page_templates_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_steps_steps" ADD CONSTRAINT "page_templates_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_steps" ADD CONSTRAINT "page_templates_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_testimonials_items" ADD CONSTRAINT "page_templates_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_testimonials" ADD CONSTRAINT "page_templates_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_guarantee" ADD CONSTRAINT "page_templates_blocks_guarantee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_faq_faqs" ADD CONSTRAINT "page_templates_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_faq" ADD CONSTRAINT "page_templates_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_rich_text" ADD CONSTRAINT "page_templates_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_cta" ADD CONSTRAINT "page_templates_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_gallery_images" ADD CONSTRAINT "page_templates_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_gallery_images" ADD CONSTRAINT "page_templates_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_gallery" ADD CONSTRAINT "page_templates_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_midwife_spotlight" ADD CONSTRAINT "page_templates_blocks_midwife_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_template_ref" ADD CONSTRAINT "page_templates_blocks_template_ref_template_id_block_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."block_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_template_ref" ADD CONSTRAINT "page_templates_blocks_template_ref_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_rels" ADD CONSTRAINT "page_templates_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_rels" ADD CONSTRAINT "page_templates_rels_midwives_fk" FOREIGN KEY ("midwives_id") REFERENCES "public"."midwives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_hero" ADD CONSTRAINT "block_templates_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_hero" ADD CONSTRAINT "block_templates_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_pain_points_points" ADD CONSTRAINT "block_templates_blocks_pain_points_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_pain_points" ADD CONSTRAINT "block_templates_blocks_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_solutions_items" ADD CONSTRAINT "block_templates_blocks_solutions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_solutions" ADD CONSTRAINT "block_templates_blocks_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_pricing_packages_features" ADD CONSTRAINT "block_templates_blocks_pricing_packages_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_pricing_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_pricing_packages" ADD CONSTRAINT "block_templates_blocks_pricing_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_pricing" ADD CONSTRAINT "block_templates_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_comparison_rows" ADD CONSTRAINT "block_templates_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_comparison" ADD CONSTRAINT "block_templates_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_steps_steps" ADD CONSTRAINT "block_templates_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_steps" ADD CONSTRAINT "block_templates_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_testimonials_items" ADD CONSTRAINT "block_templates_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_testimonials" ADD CONSTRAINT "block_templates_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_guarantee" ADD CONSTRAINT "block_templates_blocks_guarantee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_faq_faqs" ADD CONSTRAINT "block_templates_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_faq" ADD CONSTRAINT "block_templates_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_rich_text" ADD CONSTRAINT "block_templates_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_cta" ADD CONSTRAINT "block_templates_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_gallery_images" ADD CONSTRAINT "block_templates_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_gallery_images" ADD CONSTRAINT "block_templates_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_gallery" ADD CONSTRAINT "block_templates_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_midwife_spotlight" ADD CONSTRAINT "block_templates_blocks_midwife_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_rels" ADD CONSTRAINT "block_templates_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_rels" ADD CONSTRAINT "block_templates_rels_midwives_fk" FOREIGN KEY ("midwives_id") REFERENCES "public"."midwives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_hero" ADD CONSTRAINT "_block_templates_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_hero" ADD CONSTRAINT "_block_templates_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_pain_points_points" ADD CONSTRAINT "_block_templates_v_blocks_pain_points_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_pain_points" ADD CONSTRAINT "_block_templates_v_blocks_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_solutions_items" ADD CONSTRAINT "_block_templates_v_blocks_solutions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_solutions" ADD CONSTRAINT "_block_templates_v_blocks_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_pricing_packages_features" ADD CONSTRAINT "_block_templates_v_blocks_pricing_packages_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_pricing_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_pricing_packages" ADD CONSTRAINT "_block_templates_v_blocks_pricing_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_pricing" ADD CONSTRAINT "_block_templates_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_comparison_rows" ADD CONSTRAINT "_block_templates_v_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_comparison" ADD CONSTRAINT "_block_templates_v_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_steps_steps" ADD CONSTRAINT "_block_templates_v_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_steps" ADD CONSTRAINT "_block_templates_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_testimonials_items" ADD CONSTRAINT "_block_templates_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_testimonials" ADD CONSTRAINT "_block_templates_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_guarantee" ADD CONSTRAINT "_block_templates_v_blocks_guarantee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_faq_faqs" ADD CONSTRAINT "_block_templates_v_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_faq" ADD CONSTRAINT "_block_templates_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_rich_text" ADD CONSTRAINT "_block_templates_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_cta" ADD CONSTRAINT "_block_templates_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_gallery_images" ADD CONSTRAINT "_block_templates_v_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_gallery_images" ADD CONSTRAINT "_block_templates_v_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_gallery" ADD CONSTRAINT "_block_templates_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_midwife_spotlight" ADD CONSTRAINT "_block_templates_v_blocks_midwife_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v" ADD CONSTRAINT "_block_templates_v_parent_id_block_templates_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_block_templates_v_rels" ADD CONSTRAINT "_block_templates_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_rels" ADD CONSTRAINT "_block_templates_v_rels_midwives_fk" FOREIGN KEY ("midwives_id") REFERENCES "public"."midwives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pain_points_points" ADD CONSTRAINT "pages_blocks_pain_points_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pain_points" ADD CONSTRAINT "pages_blocks_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solutions_items" ADD CONSTRAINT "pages_blocks_solutions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solutions" ADD CONSTRAINT "pages_blocks_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_packages_features" ADD CONSTRAINT "pages_blocks_pricing_packages_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_packages" ADD CONSTRAINT "pages_blocks_pricing_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_rows" ADD CONSTRAINT "pages_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison" ADD CONSTRAINT "pages_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_steps" ADD CONSTRAINT "pages_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_guarantee" ADD CONSTRAINT "pages_blocks_guarantee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_faqs" ADD CONSTRAINT "pages_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_midwife_spotlight" ADD CONSTRAINT "pages_blocks_midwife_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_template_ref" ADD CONSTRAINT "pages_blocks_template_ref_template_id_block_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."block_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_template_ref" ADD CONSTRAINT "pages_blocks_template_ref_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_seo_audit_issues" ADD CONSTRAINT "pages_seo_audit_issues_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_midwives_fk" FOREIGN KEY ("midwives_id") REFERENCES "public"."midwives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pain_points_points" ADD CONSTRAINT "_pages_v_blocks_pain_points_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pain_points" ADD CONSTRAINT "_pages_v_blocks_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solutions_items" ADD CONSTRAINT "_pages_v_blocks_solutions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solutions" ADD CONSTRAINT "_pages_v_blocks_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_packages_features" ADD CONSTRAINT "_pages_v_blocks_pricing_packages_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_packages" ADD CONSTRAINT "_pages_v_blocks_pricing_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing" ADD CONSTRAINT "_pages_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_rows" ADD CONSTRAINT "_pages_v_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison" ADD CONSTRAINT "_pages_v_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_steps" ADD CONSTRAINT "_pages_v_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps" ADD CONSTRAINT "_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_guarantee" ADD CONSTRAINT "_pages_v_blocks_guarantee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_faqs" ADD CONSTRAINT "_pages_v_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_midwife_spotlight" ADD CONSTRAINT "_pages_v_blocks_midwife_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_template_ref" ADD CONSTRAINT "_pages_v_blocks_template_ref_template_id_block_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."block_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_template_ref" ADD CONSTRAINT "_pages_v_blocks_template_ref_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_seo_audit_issues" ADD CONSTRAINT "_pages_v_version_seo_audit_issues_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_midwives_fk" FOREIGN KEY ("midwives_id") REFERENCES "public"."midwives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_included_items" ADD CONSTRAINT "services_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "midwives_specialties" ADD CONSTRAINT "midwives_specialties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."midwives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "midwives" ADD CONSTRAINT "midwives_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "midwives" ADD CONSTRAINT "midwives_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_areas_landmarks" ADD CONSTRAINT "service_areas_landmarks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_areas_available_services" ADD CONSTRAINT "service_areas_available_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_areas" ADD CONSTRAINT "service_areas_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_related_service_id_services_id_fk" FOREIGN KEY ("related_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_related_area_id_service_areas_id_fk" FOREIGN KEY ("related_area_id") REFERENCES "public"."service_areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faq_rels" ADD CONSTRAINT "faq_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_rels" ADD CONSTRAINT "faq_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_rels" ADD CONSTRAINT "faq_rels_service_areas_fk" FOREIGN KEY ("service_areas_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_keywords" ADD CONSTRAINT "articles_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_seo_audit_issues" ADD CONSTRAINT "articles_seo_audit_issues_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_internal_linking_parent_pillar_id_articles_id_fk" FOREIGN KEY ("internal_linking_parent_pillar_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_service_areas_fk" FOREIGN KEY ("service_areas_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_keywords" ADD CONSTRAINT "_articles_v_version_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_seo_audit_issues" ADD CONSTRAINT "_articles_v_version_seo_audit_issues_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_internal_linking_parent_pillar_id_articles_id_fk" FOREIGN KEY ("version_internal_linking_parent_pillar_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_service_areas_fk" FOREIGN KEY ("service_areas_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_help_center_fk" FOREIGN KEY ("help_center_id") REFERENCES "public"."help_center"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_landing_pages_fk" FOREIGN KEY ("landing_pages_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_templates_fk" FOREIGN KEY ("page_templates_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_block_templates_fk" FOREIGN KEY ("block_templates_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_midwives_fk" FOREIGN KEY ("midwives_id") REFERENCES "public"."midwives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_areas_fk" FOREIGN KEY ("service_areas_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_operational_schedule_days" ADD CONSTRAINT "site_settings_operational_schedule_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_coverage_areas" ADD CONSTRAINT "site_settings_coverage_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_homepage_pain_points" ADD CONSTRAINT "site_settings_homepage_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_homepage_benefits" ADD CONSTRAINT "site_settings_homepage_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_homepage_booking_steps" ADD CONSTRAINT "site_settings_homepage_booking_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "help_center_steps_order_idx" ON "help_center_steps" USING btree ("_order");
  CREATE INDEX "help_center_steps_parent_id_idx" ON "help_center_steps" USING btree ("_parent_id");
  CREATE INDEX "help_center_dos_and_donts_dos_order_idx" ON "help_center_dos_and_donts_dos" USING btree ("_order");
  CREATE INDEX "help_center_dos_and_donts_dos_parent_id_idx" ON "help_center_dos_and_donts_dos" USING btree ("_parent_id");
  CREATE INDEX "help_center_dos_and_donts_donts_order_idx" ON "help_center_dos_and_donts_donts" USING btree ("_order");
  CREATE INDEX "help_center_dos_and_donts_donts_parent_id_idx" ON "help_center_dos_and_donts_donts" USING btree ("_parent_id");
  CREATE INDEX "help_center_updated_at_idx" ON "help_center" USING btree ("updated_at");
  CREATE INDEX "help_center_created_at_idx" ON "help_center" USING btree ("created_at");
  CREATE INDEX "landing_pages_active_pixels_order_idx" ON "landing_pages_active_pixels" USING btree ("order");
  CREATE INDEX "landing_pages_active_pixels_parent_idx" ON "landing_pages_active_pixels" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_hero_order_idx" ON "landing_pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_hero_parent_id_idx" ON "landing_pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_hero_path_idx" ON "landing_pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_hero_image_idx" ON "landing_pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "landing_pages_blocks_pain_points_points_order_idx" ON "landing_pages_blocks_pain_points_points" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_pain_points_points_parent_id_idx" ON "landing_pages_blocks_pain_points_points" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_pain_points_order_idx" ON "landing_pages_blocks_pain_points" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_pain_points_parent_id_idx" ON "landing_pages_blocks_pain_points" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_pain_points_path_idx" ON "landing_pages_blocks_pain_points" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_solutions_items_order_idx" ON "landing_pages_blocks_solutions_items" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_solutions_items_parent_id_idx" ON "landing_pages_blocks_solutions_items" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_solutions_order_idx" ON "landing_pages_blocks_solutions" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_solutions_parent_id_idx" ON "landing_pages_blocks_solutions" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_solutions_path_idx" ON "landing_pages_blocks_solutions" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_pricing_packages_features_order_idx" ON "landing_pages_blocks_pricing_packages_features" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_pricing_packages_features_parent_id_idx" ON "landing_pages_blocks_pricing_packages_features" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_pricing_packages_order_idx" ON "landing_pages_blocks_pricing_packages" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_pricing_packages_parent_id_idx" ON "landing_pages_blocks_pricing_packages" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_pricing_order_idx" ON "landing_pages_blocks_pricing" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_pricing_parent_id_idx" ON "landing_pages_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_pricing_path_idx" ON "landing_pages_blocks_pricing" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_comparison_rows_order_idx" ON "landing_pages_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_comparison_rows_parent_id_idx" ON "landing_pages_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_comparison_order_idx" ON "landing_pages_blocks_comparison" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_comparison_parent_id_idx" ON "landing_pages_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_comparison_path_idx" ON "landing_pages_blocks_comparison" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_steps_steps_order_idx" ON "landing_pages_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_steps_steps_parent_id_idx" ON "landing_pages_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_steps_order_idx" ON "landing_pages_blocks_steps" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_steps_parent_id_idx" ON "landing_pages_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_steps_path_idx" ON "landing_pages_blocks_steps" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_testimonials_items_order_idx" ON "landing_pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_testimonials_items_parent_id_idx" ON "landing_pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_testimonials_order_idx" ON "landing_pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_testimonials_parent_id_idx" ON "landing_pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_testimonials_path_idx" ON "landing_pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_guarantee_order_idx" ON "landing_pages_blocks_guarantee" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_guarantee_parent_id_idx" ON "landing_pages_blocks_guarantee" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_guarantee_path_idx" ON "landing_pages_blocks_guarantee" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_faq_faqs_order_idx" ON "landing_pages_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_faq_faqs_parent_id_idx" ON "landing_pages_blocks_faq_faqs" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_faq_order_idx" ON "landing_pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_faq_parent_id_idx" ON "landing_pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_faq_path_idx" ON "landing_pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_rich_text_order_idx" ON "landing_pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_rich_text_parent_id_idx" ON "landing_pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_rich_text_path_idx" ON "landing_pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_cta_order_idx" ON "landing_pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_cta_parent_id_idx" ON "landing_pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_cta_path_idx" ON "landing_pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_gallery_images_order_idx" ON "landing_pages_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_gallery_images_parent_id_idx" ON "landing_pages_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_gallery_images_image_idx" ON "landing_pages_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "landing_pages_blocks_gallery_order_idx" ON "landing_pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_gallery_parent_id_idx" ON "landing_pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_gallery_path_idx" ON "landing_pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_midwife_spotlight_order_idx" ON "landing_pages_blocks_midwife_spotlight" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_midwife_spotlight_parent_id_idx" ON "landing_pages_blocks_midwife_spotlight" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_midwife_spotlight_path_idx" ON "landing_pages_blocks_midwife_spotlight" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_template_ref_order_idx" ON "landing_pages_blocks_template_ref" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_template_ref_parent_id_idx" ON "landing_pages_blocks_template_ref" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_template_ref_path_idx" ON "landing_pages_blocks_template_ref" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_template_ref_template_idx" ON "landing_pages_blocks_template_ref" USING btree ("template_id");
  CREATE INDEX "landing_pages_pain_points_order_idx" ON "landing_pages_pain_points" USING btree ("_order");
  CREATE INDEX "landing_pages_pain_points_parent_id_idx" ON "landing_pages_pain_points" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_solutions_order_idx" ON "landing_pages_solutions" USING btree ("_order");
  CREATE INDEX "landing_pages_solutions_parent_id_idx" ON "landing_pages_solutions" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_steps_order_idx" ON "landing_pages_steps" USING btree ("_order");
  CREATE INDEX "landing_pages_steps_parent_id_idx" ON "landing_pages_steps" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_faqs_order_idx" ON "landing_pages_faqs" USING btree ("_order");
  CREATE INDEX "landing_pages_faqs_parent_id_idx" ON "landing_pages_faqs" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_seo_audit_issues_order_idx" ON "landing_pages_seo_audit_issues" USING btree ("_order");
  CREATE INDEX "landing_pages_seo_audit_issues_parent_id_idx" ON "landing_pages_seo_audit_issues" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "landing_pages_slug_idx" ON "landing_pages" USING btree ("slug");
  CREATE INDEX "landing_pages_seo_seo_og_image_idx" ON "landing_pages" USING btree ("seo_og_image_id");
  CREATE INDEX "landing_pages_updated_at_idx" ON "landing_pages" USING btree ("updated_at");
  CREATE INDEX "landing_pages_created_at_idx" ON "landing_pages" USING btree ("created_at");
  CREATE INDEX "landing_pages__status_idx" ON "landing_pages" USING btree ("_status");
  CREATE INDEX "landing_pages_rels_order_idx" ON "landing_pages_rels" USING btree ("order");
  CREATE INDEX "landing_pages_rels_parent_idx" ON "landing_pages_rels" USING btree ("parent_id");
  CREATE INDEX "landing_pages_rels_path_idx" ON "landing_pages_rels" USING btree ("path");
  CREATE INDEX "landing_pages_rels_midwives_id_idx" ON "landing_pages_rels" USING btree ("midwives_id");
  CREATE INDEX "_landing_pages_v_version_active_pixels_order_idx" ON "_landing_pages_v_version_active_pixels" USING btree ("order");
  CREATE INDEX "_landing_pages_v_version_active_pixels_parent_idx" ON "_landing_pages_v_version_active_pixels" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_hero_order_idx" ON "_landing_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_hero_parent_id_idx" ON "_landing_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_hero_path_idx" ON "_landing_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_hero_image_idx" ON "_landing_pages_v_blocks_hero" USING btree ("image_id");
  CREATE INDEX "_landing_pages_v_blocks_pain_points_points_order_idx" ON "_landing_pages_v_blocks_pain_points_points" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_pain_points_points_parent_id_idx" ON "_landing_pages_v_blocks_pain_points_points" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_pain_points_order_idx" ON "_landing_pages_v_blocks_pain_points" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_pain_points_parent_id_idx" ON "_landing_pages_v_blocks_pain_points" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_pain_points_path_idx" ON "_landing_pages_v_blocks_pain_points" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_solutions_items_order_idx" ON "_landing_pages_v_blocks_solutions_items" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_solutions_items_parent_id_idx" ON "_landing_pages_v_blocks_solutions_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_solutions_order_idx" ON "_landing_pages_v_blocks_solutions" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_solutions_parent_id_idx" ON "_landing_pages_v_blocks_solutions" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_solutions_path_idx" ON "_landing_pages_v_blocks_solutions" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_pricing_packages_features_order_idx" ON "_landing_pages_v_blocks_pricing_packages_features" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_pricing_packages_features_parent_id_idx" ON "_landing_pages_v_blocks_pricing_packages_features" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_pricing_packages_order_idx" ON "_landing_pages_v_blocks_pricing_packages" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_pricing_packages_parent_id_idx" ON "_landing_pages_v_blocks_pricing_packages" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_pricing_order_idx" ON "_landing_pages_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_pricing_parent_id_idx" ON "_landing_pages_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_pricing_path_idx" ON "_landing_pages_v_blocks_pricing" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_comparison_rows_order_idx" ON "_landing_pages_v_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_comparison_rows_parent_id_idx" ON "_landing_pages_v_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_comparison_order_idx" ON "_landing_pages_v_blocks_comparison" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_comparison_parent_id_idx" ON "_landing_pages_v_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_comparison_path_idx" ON "_landing_pages_v_blocks_comparison" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_steps_steps_order_idx" ON "_landing_pages_v_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_steps_steps_parent_id_idx" ON "_landing_pages_v_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_steps_order_idx" ON "_landing_pages_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_steps_parent_id_idx" ON "_landing_pages_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_steps_path_idx" ON "_landing_pages_v_blocks_steps" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_testimonials_items_order_idx" ON "_landing_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_testimonials_items_parent_id_idx" ON "_landing_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_testimonials_order_idx" ON "_landing_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_testimonials_parent_id_idx" ON "_landing_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_testimonials_path_idx" ON "_landing_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_guarantee_order_idx" ON "_landing_pages_v_blocks_guarantee" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_guarantee_parent_id_idx" ON "_landing_pages_v_blocks_guarantee" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_guarantee_path_idx" ON "_landing_pages_v_blocks_guarantee" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_faq_faqs_order_idx" ON "_landing_pages_v_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_faq_faqs_parent_id_idx" ON "_landing_pages_v_blocks_faq_faqs" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_faq_order_idx" ON "_landing_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_faq_parent_id_idx" ON "_landing_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_faq_path_idx" ON "_landing_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_rich_text_order_idx" ON "_landing_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_rich_text_parent_id_idx" ON "_landing_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_rich_text_path_idx" ON "_landing_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_cta_order_idx" ON "_landing_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_cta_parent_id_idx" ON "_landing_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_cta_path_idx" ON "_landing_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_gallery_images_order_idx" ON "_landing_pages_v_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_gallery_images_parent_id_idx" ON "_landing_pages_v_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_gallery_images_image_idx" ON "_landing_pages_v_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "_landing_pages_v_blocks_gallery_order_idx" ON "_landing_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_gallery_parent_id_idx" ON "_landing_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_gallery_path_idx" ON "_landing_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_midwife_spotlight_order_idx" ON "_landing_pages_v_blocks_midwife_spotlight" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_midwife_spotlight_parent_id_idx" ON "_landing_pages_v_blocks_midwife_spotlight" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_midwife_spotlight_path_idx" ON "_landing_pages_v_blocks_midwife_spotlight" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_template_ref_order_idx" ON "_landing_pages_v_blocks_template_ref" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_template_ref_parent_id_idx" ON "_landing_pages_v_blocks_template_ref" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_template_ref_path_idx" ON "_landing_pages_v_blocks_template_ref" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_template_ref_template_idx" ON "_landing_pages_v_blocks_template_ref" USING btree ("template_id");
  CREATE INDEX "_landing_pages_v_version_pain_points_order_idx" ON "_landing_pages_v_version_pain_points" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_pain_points_parent_id_idx" ON "_landing_pages_v_version_pain_points" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_solutions_order_idx" ON "_landing_pages_v_version_solutions" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_solutions_parent_id_idx" ON "_landing_pages_v_version_solutions" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_steps_order_idx" ON "_landing_pages_v_version_steps" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_steps_parent_id_idx" ON "_landing_pages_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_faqs_order_idx" ON "_landing_pages_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_faqs_parent_id_idx" ON "_landing_pages_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_seo_audit_issues_order_idx" ON "_landing_pages_v_version_seo_audit_issues" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_seo_audit_issues_parent_id_idx" ON "_landing_pages_v_version_seo_audit_issues" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_parent_idx" ON "_landing_pages_v" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_version_version_slug_idx" ON "_landing_pages_v" USING btree ("version_slug");
  CREATE INDEX "_landing_pages_v_version_seo_version_seo_og_image_idx" ON "_landing_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_landing_pages_v_version_version_updated_at_idx" ON "_landing_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_landing_pages_v_version_version_created_at_idx" ON "_landing_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_landing_pages_v_version_version__status_idx" ON "_landing_pages_v" USING btree ("version__status");
  CREATE INDEX "_landing_pages_v_created_at_idx" ON "_landing_pages_v" USING btree ("created_at");
  CREATE INDEX "_landing_pages_v_updated_at_idx" ON "_landing_pages_v" USING btree ("updated_at");
  CREATE INDEX "_landing_pages_v_latest_idx" ON "_landing_pages_v" USING btree ("latest");
  CREATE INDEX "_landing_pages_v_rels_order_idx" ON "_landing_pages_v_rels" USING btree ("order");
  CREATE INDEX "_landing_pages_v_rels_parent_idx" ON "_landing_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_rels_path_idx" ON "_landing_pages_v_rels" USING btree ("path");
  CREATE INDEX "_landing_pages_v_rels_midwives_id_idx" ON "_landing_pages_v_rels" USING btree ("midwives_id");
  CREATE INDEX "page_templates_blocks_hero_order_idx" ON "page_templates_blocks_hero" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_hero_parent_id_idx" ON "page_templates_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_hero_path_idx" ON "page_templates_blocks_hero" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_hero_image_idx" ON "page_templates_blocks_hero" USING btree ("image_id");
  CREATE INDEX "page_templates_blocks_pain_points_points_order_idx" ON "page_templates_blocks_pain_points_points" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_pain_points_points_parent_id_idx" ON "page_templates_blocks_pain_points_points" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_pain_points_order_idx" ON "page_templates_blocks_pain_points" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_pain_points_parent_id_idx" ON "page_templates_blocks_pain_points" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_pain_points_path_idx" ON "page_templates_blocks_pain_points" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_solutions_items_order_idx" ON "page_templates_blocks_solutions_items" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_solutions_items_parent_id_idx" ON "page_templates_blocks_solutions_items" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_solutions_order_idx" ON "page_templates_blocks_solutions" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_solutions_parent_id_idx" ON "page_templates_blocks_solutions" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_solutions_path_idx" ON "page_templates_blocks_solutions" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_pricing_packages_features_order_idx" ON "page_templates_blocks_pricing_packages_features" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_pricing_packages_features_parent_id_idx" ON "page_templates_blocks_pricing_packages_features" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_pricing_packages_order_idx" ON "page_templates_blocks_pricing_packages" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_pricing_packages_parent_id_idx" ON "page_templates_blocks_pricing_packages" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_pricing_order_idx" ON "page_templates_blocks_pricing" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_pricing_parent_id_idx" ON "page_templates_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_pricing_path_idx" ON "page_templates_blocks_pricing" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_comparison_rows_order_idx" ON "page_templates_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_comparison_rows_parent_id_idx" ON "page_templates_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_comparison_order_idx" ON "page_templates_blocks_comparison" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_comparison_parent_id_idx" ON "page_templates_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_comparison_path_idx" ON "page_templates_blocks_comparison" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_steps_steps_order_idx" ON "page_templates_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_steps_steps_parent_id_idx" ON "page_templates_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_steps_order_idx" ON "page_templates_blocks_steps" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_steps_parent_id_idx" ON "page_templates_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_steps_path_idx" ON "page_templates_blocks_steps" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_testimonials_items_order_idx" ON "page_templates_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_testimonials_items_parent_id_idx" ON "page_templates_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_testimonials_order_idx" ON "page_templates_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_testimonials_parent_id_idx" ON "page_templates_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_testimonials_path_idx" ON "page_templates_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_guarantee_order_idx" ON "page_templates_blocks_guarantee" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_guarantee_parent_id_idx" ON "page_templates_blocks_guarantee" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_guarantee_path_idx" ON "page_templates_blocks_guarantee" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_faq_faqs_order_idx" ON "page_templates_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_faq_faqs_parent_id_idx" ON "page_templates_blocks_faq_faqs" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_faq_order_idx" ON "page_templates_blocks_faq" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_faq_parent_id_idx" ON "page_templates_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_faq_path_idx" ON "page_templates_blocks_faq" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_rich_text_order_idx" ON "page_templates_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_rich_text_parent_id_idx" ON "page_templates_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_rich_text_path_idx" ON "page_templates_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_cta_order_idx" ON "page_templates_blocks_cta" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_cta_parent_id_idx" ON "page_templates_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_cta_path_idx" ON "page_templates_blocks_cta" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_gallery_images_order_idx" ON "page_templates_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_gallery_images_parent_id_idx" ON "page_templates_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_gallery_images_image_idx" ON "page_templates_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "page_templates_blocks_gallery_order_idx" ON "page_templates_blocks_gallery" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_gallery_parent_id_idx" ON "page_templates_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_gallery_path_idx" ON "page_templates_blocks_gallery" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_midwife_spotlight_order_idx" ON "page_templates_blocks_midwife_spotlight" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_midwife_spotlight_parent_id_idx" ON "page_templates_blocks_midwife_spotlight" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_midwife_spotlight_path_idx" ON "page_templates_blocks_midwife_spotlight" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_template_ref_order_idx" ON "page_templates_blocks_template_ref" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_template_ref_parent_id_idx" ON "page_templates_blocks_template_ref" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_template_ref_path_idx" ON "page_templates_blocks_template_ref" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_template_ref_template_idx" ON "page_templates_blocks_template_ref" USING btree ("template_id");
  CREATE UNIQUE INDEX "page_templates_slug_idx" ON "page_templates" USING btree ("slug");
  CREATE INDEX "page_templates_updated_at_idx" ON "page_templates" USING btree ("updated_at");
  CREATE INDEX "page_templates_created_at_idx" ON "page_templates" USING btree ("created_at");
  CREATE INDEX "page_templates_rels_order_idx" ON "page_templates_rels" USING btree ("order");
  CREATE INDEX "page_templates_rels_parent_idx" ON "page_templates_rels" USING btree ("parent_id");
  CREATE INDEX "page_templates_rels_path_idx" ON "page_templates_rels" USING btree ("path");
  CREATE INDEX "page_templates_rels_midwives_id_idx" ON "page_templates_rels" USING btree ("midwives_id");
  CREATE INDEX "block_templates_blocks_hero_order_idx" ON "block_templates_blocks_hero" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_hero_parent_id_idx" ON "block_templates_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_hero_path_idx" ON "block_templates_blocks_hero" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_hero_image_idx" ON "block_templates_blocks_hero" USING btree ("image_id");
  CREATE INDEX "block_templates_blocks_pain_points_points_order_idx" ON "block_templates_blocks_pain_points_points" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_pain_points_points_parent_id_idx" ON "block_templates_blocks_pain_points_points" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_pain_points_order_idx" ON "block_templates_blocks_pain_points" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_pain_points_parent_id_idx" ON "block_templates_blocks_pain_points" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_pain_points_path_idx" ON "block_templates_blocks_pain_points" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_solutions_items_order_idx" ON "block_templates_blocks_solutions_items" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_solutions_items_parent_id_idx" ON "block_templates_blocks_solutions_items" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_solutions_order_idx" ON "block_templates_blocks_solutions" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_solutions_parent_id_idx" ON "block_templates_blocks_solutions" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_solutions_path_idx" ON "block_templates_blocks_solutions" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_pricing_packages_features_order_idx" ON "block_templates_blocks_pricing_packages_features" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_pricing_packages_features_parent_id_idx" ON "block_templates_blocks_pricing_packages_features" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_pricing_packages_order_idx" ON "block_templates_blocks_pricing_packages" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_pricing_packages_parent_id_idx" ON "block_templates_blocks_pricing_packages" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_pricing_order_idx" ON "block_templates_blocks_pricing" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_pricing_parent_id_idx" ON "block_templates_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_pricing_path_idx" ON "block_templates_blocks_pricing" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_comparison_rows_order_idx" ON "block_templates_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_comparison_rows_parent_id_idx" ON "block_templates_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_comparison_order_idx" ON "block_templates_blocks_comparison" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_comparison_parent_id_idx" ON "block_templates_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_comparison_path_idx" ON "block_templates_blocks_comparison" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_steps_steps_order_idx" ON "block_templates_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_steps_steps_parent_id_idx" ON "block_templates_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_steps_order_idx" ON "block_templates_blocks_steps" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_steps_parent_id_idx" ON "block_templates_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_steps_path_idx" ON "block_templates_blocks_steps" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_testimonials_items_order_idx" ON "block_templates_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_testimonials_items_parent_id_idx" ON "block_templates_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_testimonials_order_idx" ON "block_templates_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_testimonials_parent_id_idx" ON "block_templates_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_testimonials_path_idx" ON "block_templates_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_guarantee_order_idx" ON "block_templates_blocks_guarantee" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_guarantee_parent_id_idx" ON "block_templates_blocks_guarantee" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_guarantee_path_idx" ON "block_templates_blocks_guarantee" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_faq_faqs_order_idx" ON "block_templates_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_faq_faqs_parent_id_idx" ON "block_templates_blocks_faq_faqs" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_faq_order_idx" ON "block_templates_blocks_faq" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_faq_parent_id_idx" ON "block_templates_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_faq_path_idx" ON "block_templates_blocks_faq" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_rich_text_order_idx" ON "block_templates_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_rich_text_parent_id_idx" ON "block_templates_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_rich_text_path_idx" ON "block_templates_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_cta_order_idx" ON "block_templates_blocks_cta" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_cta_parent_id_idx" ON "block_templates_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_cta_path_idx" ON "block_templates_blocks_cta" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_gallery_images_order_idx" ON "block_templates_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_gallery_images_parent_id_idx" ON "block_templates_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_gallery_images_image_idx" ON "block_templates_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "block_templates_blocks_gallery_order_idx" ON "block_templates_blocks_gallery" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_gallery_parent_id_idx" ON "block_templates_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_gallery_path_idx" ON "block_templates_blocks_gallery" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_midwife_spotlight_order_idx" ON "block_templates_blocks_midwife_spotlight" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_midwife_spotlight_parent_id_idx" ON "block_templates_blocks_midwife_spotlight" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_midwife_spotlight_path_idx" ON "block_templates_blocks_midwife_spotlight" USING btree ("_path");
  CREATE UNIQUE INDEX "block_templates_slug_idx" ON "block_templates" USING btree ("slug");
  CREATE INDEX "block_templates_updated_at_idx" ON "block_templates" USING btree ("updated_at");
  CREATE INDEX "block_templates_created_at_idx" ON "block_templates" USING btree ("created_at");
  CREATE INDEX "block_templates__status_idx" ON "block_templates" USING btree ("_status");
  CREATE INDEX "block_templates_rels_order_idx" ON "block_templates_rels" USING btree ("order");
  CREATE INDEX "block_templates_rels_parent_idx" ON "block_templates_rels" USING btree ("parent_id");
  CREATE INDEX "block_templates_rels_path_idx" ON "block_templates_rels" USING btree ("path");
  CREATE INDEX "block_templates_rels_midwives_id_idx" ON "block_templates_rels" USING btree ("midwives_id");
  CREATE INDEX "_block_templates_v_blocks_hero_order_idx" ON "_block_templates_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_hero_parent_id_idx" ON "_block_templates_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_hero_path_idx" ON "_block_templates_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_hero_image_idx" ON "_block_templates_v_blocks_hero" USING btree ("image_id");
  CREATE INDEX "_block_templates_v_blocks_pain_points_points_order_idx" ON "_block_templates_v_blocks_pain_points_points" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_pain_points_points_parent_id_idx" ON "_block_templates_v_blocks_pain_points_points" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_pain_points_order_idx" ON "_block_templates_v_blocks_pain_points" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_pain_points_parent_id_idx" ON "_block_templates_v_blocks_pain_points" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_pain_points_path_idx" ON "_block_templates_v_blocks_pain_points" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_solutions_items_order_idx" ON "_block_templates_v_blocks_solutions_items" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_solutions_items_parent_id_idx" ON "_block_templates_v_blocks_solutions_items" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_solutions_order_idx" ON "_block_templates_v_blocks_solutions" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_solutions_parent_id_idx" ON "_block_templates_v_blocks_solutions" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_solutions_path_idx" ON "_block_templates_v_blocks_solutions" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_pricing_packages_features_order_idx" ON "_block_templates_v_blocks_pricing_packages_features" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_pricing_packages_features_parent_id_idx" ON "_block_templates_v_blocks_pricing_packages_features" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_pricing_packages_order_idx" ON "_block_templates_v_blocks_pricing_packages" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_pricing_packages_parent_id_idx" ON "_block_templates_v_blocks_pricing_packages" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_pricing_order_idx" ON "_block_templates_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_pricing_parent_id_idx" ON "_block_templates_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_pricing_path_idx" ON "_block_templates_v_blocks_pricing" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_comparison_rows_order_idx" ON "_block_templates_v_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_comparison_rows_parent_id_idx" ON "_block_templates_v_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_comparison_order_idx" ON "_block_templates_v_blocks_comparison" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_comparison_parent_id_idx" ON "_block_templates_v_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_comparison_path_idx" ON "_block_templates_v_blocks_comparison" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_steps_steps_order_idx" ON "_block_templates_v_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_steps_steps_parent_id_idx" ON "_block_templates_v_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_steps_order_idx" ON "_block_templates_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_steps_parent_id_idx" ON "_block_templates_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_steps_path_idx" ON "_block_templates_v_blocks_steps" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_testimonials_items_order_idx" ON "_block_templates_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_testimonials_items_parent_id_idx" ON "_block_templates_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_testimonials_order_idx" ON "_block_templates_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_testimonials_parent_id_idx" ON "_block_templates_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_testimonials_path_idx" ON "_block_templates_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_guarantee_order_idx" ON "_block_templates_v_blocks_guarantee" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_guarantee_parent_id_idx" ON "_block_templates_v_blocks_guarantee" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_guarantee_path_idx" ON "_block_templates_v_blocks_guarantee" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_faq_faqs_order_idx" ON "_block_templates_v_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_faq_faqs_parent_id_idx" ON "_block_templates_v_blocks_faq_faqs" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_faq_order_idx" ON "_block_templates_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_faq_parent_id_idx" ON "_block_templates_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_faq_path_idx" ON "_block_templates_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_rich_text_order_idx" ON "_block_templates_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_rich_text_parent_id_idx" ON "_block_templates_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_rich_text_path_idx" ON "_block_templates_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_cta_order_idx" ON "_block_templates_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_cta_parent_id_idx" ON "_block_templates_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_cta_path_idx" ON "_block_templates_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_gallery_images_order_idx" ON "_block_templates_v_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_gallery_images_parent_id_idx" ON "_block_templates_v_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_gallery_images_image_idx" ON "_block_templates_v_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "_block_templates_v_blocks_gallery_order_idx" ON "_block_templates_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_gallery_parent_id_idx" ON "_block_templates_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_gallery_path_idx" ON "_block_templates_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_midwife_spotlight_order_idx" ON "_block_templates_v_blocks_midwife_spotlight" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_midwife_spotlight_parent_id_idx" ON "_block_templates_v_blocks_midwife_spotlight" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_midwife_spotlight_path_idx" ON "_block_templates_v_blocks_midwife_spotlight" USING btree ("_path");
  CREATE INDEX "_block_templates_v_parent_idx" ON "_block_templates_v" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_version_version_slug_idx" ON "_block_templates_v" USING btree ("version_slug");
  CREATE INDEX "_block_templates_v_version_version_updated_at_idx" ON "_block_templates_v" USING btree ("version_updated_at");
  CREATE INDEX "_block_templates_v_version_version_created_at_idx" ON "_block_templates_v" USING btree ("version_created_at");
  CREATE INDEX "_block_templates_v_version_version__status_idx" ON "_block_templates_v" USING btree ("version__status");
  CREATE INDEX "_block_templates_v_created_at_idx" ON "_block_templates_v" USING btree ("created_at");
  CREATE INDEX "_block_templates_v_updated_at_idx" ON "_block_templates_v" USING btree ("updated_at");
  CREATE INDEX "_block_templates_v_latest_idx" ON "_block_templates_v" USING btree ("latest");
  CREATE INDEX "_block_templates_v_rels_order_idx" ON "_block_templates_v_rels" USING btree ("order");
  CREATE INDEX "_block_templates_v_rels_parent_idx" ON "_block_templates_v_rels" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_rels_path_idx" ON "_block_templates_v_rels" USING btree ("path");
  CREATE INDEX "_block_templates_v_rels_midwives_id_idx" ON "_block_templates_v_rels" USING btree ("midwives_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_pain_points_points_order_idx" ON "pages_blocks_pain_points_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_pain_points_points_parent_id_idx" ON "pages_blocks_pain_points_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pain_points_order_idx" ON "pages_blocks_pain_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_pain_points_parent_id_idx" ON "pages_blocks_pain_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pain_points_path_idx" ON "pages_blocks_pain_points" USING btree ("_path");
  CREATE INDEX "pages_blocks_solutions_items_order_idx" ON "pages_blocks_solutions_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_solutions_items_parent_id_idx" ON "pages_blocks_solutions_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_solutions_order_idx" ON "pages_blocks_solutions" USING btree ("_order");
  CREATE INDEX "pages_blocks_solutions_parent_id_idx" ON "pages_blocks_solutions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_solutions_path_idx" ON "pages_blocks_solutions" USING btree ("_path");
  CREATE INDEX "pages_blocks_pricing_packages_features_order_idx" ON "pages_blocks_pricing_packages_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_packages_features_parent_id_idx" ON "pages_blocks_pricing_packages_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_packages_order_idx" ON "pages_blocks_pricing_packages" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_packages_parent_id_idx" ON "pages_blocks_pricing_packages" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_order_idx" ON "pages_blocks_pricing" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_parent_id_idx" ON "pages_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_path_idx" ON "pages_blocks_pricing" USING btree ("_path");
  CREATE INDEX "pages_blocks_comparison_rows_order_idx" ON "pages_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_rows_parent_id_idx" ON "pages_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_order_idx" ON "pages_blocks_comparison" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_parent_id_idx" ON "pages_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_path_idx" ON "pages_blocks_comparison" USING btree ("_path");
  CREATE INDEX "pages_blocks_steps_steps_order_idx" ON "pages_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_steps_parent_id_idx" ON "pages_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_guarantee_order_idx" ON "pages_blocks_guarantee" USING btree ("_order");
  CREATE INDEX "pages_blocks_guarantee_parent_id_idx" ON "pages_blocks_guarantee" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_guarantee_path_idx" ON "pages_blocks_guarantee" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_faqs_order_idx" ON "pages_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_faqs_parent_id_idx" ON "pages_blocks_faq_faqs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_images_order_idx" ON "pages_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_images_parent_id_idx" ON "pages_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_image_idx" ON "pages_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_midwife_spotlight_order_idx" ON "pages_blocks_midwife_spotlight" USING btree ("_order");
  CREATE INDEX "pages_blocks_midwife_spotlight_parent_id_idx" ON "pages_blocks_midwife_spotlight" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_midwife_spotlight_path_idx" ON "pages_blocks_midwife_spotlight" USING btree ("_path");
  CREATE INDEX "pages_blocks_template_ref_order_idx" ON "pages_blocks_template_ref" USING btree ("_order");
  CREATE INDEX "pages_blocks_template_ref_parent_id_idx" ON "pages_blocks_template_ref" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_template_ref_path_idx" ON "pages_blocks_template_ref" USING btree ("_path");
  CREATE INDEX "pages_blocks_template_ref_template_idx" ON "pages_blocks_template_ref" USING btree ("template_id");
  CREATE INDEX "pages_seo_audit_issues_order_idx" ON "pages_seo_audit_issues" USING btree ("_order");
  CREATE INDEX "pages_seo_audit_issues_parent_id_idx" ON "pages_seo_audit_issues" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_midwives_id_idx" ON "pages_rels" USING btree ("midwives_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_image_idx" ON "_pages_v_blocks_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_pain_points_points_order_idx" ON "_pages_v_blocks_pain_points_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pain_points_points_parent_id_idx" ON "_pages_v_blocks_pain_points_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pain_points_order_idx" ON "_pages_v_blocks_pain_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pain_points_parent_id_idx" ON "_pages_v_blocks_pain_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pain_points_path_idx" ON "_pages_v_blocks_pain_points" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_solutions_items_order_idx" ON "_pages_v_blocks_solutions_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_solutions_items_parent_id_idx" ON "_pages_v_blocks_solutions_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_solutions_order_idx" ON "_pages_v_blocks_solutions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_solutions_parent_id_idx" ON "_pages_v_blocks_solutions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_solutions_path_idx" ON "_pages_v_blocks_solutions" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pricing_packages_features_order_idx" ON "_pages_v_blocks_pricing_packages_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_packages_features_parent_id_idx" ON "_pages_v_blocks_pricing_packages_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_packages_order_idx" ON "_pages_v_blocks_pricing_packages" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_packages_parent_id_idx" ON "_pages_v_blocks_pricing_packages" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_order_idx" ON "_pages_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_parent_id_idx" ON "_pages_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_path_idx" ON "_pages_v_blocks_pricing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_comparison_rows_order_idx" ON "_pages_v_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_rows_parent_id_idx" ON "_pages_v_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_order_idx" ON "_pages_v_blocks_comparison" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_parent_id_idx" ON "_pages_v_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_path_idx" ON "_pages_v_blocks_comparison" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_steps_steps_order_idx" ON "_pages_v_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_steps_parent_id_idx" ON "_pages_v_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_order_idx" ON "_pages_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_parent_id_idx" ON "_pages_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_path_idx" ON "_pages_v_blocks_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_items_order_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_items_parent_id_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_guarantee_order_idx" ON "_pages_v_blocks_guarantee" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_guarantee_parent_id_idx" ON "_pages_v_blocks_guarantee" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_guarantee_path_idx" ON "_pages_v_blocks_guarantee" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_faqs_order_idx" ON "_pages_v_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_faqs_parent_id_idx" ON "_pages_v_blocks_faq_faqs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_images_order_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_images_parent_id_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_images_image_idx" ON "_pages_v_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_midwife_spotlight_order_idx" ON "_pages_v_blocks_midwife_spotlight" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_midwife_spotlight_parent_id_idx" ON "_pages_v_blocks_midwife_spotlight" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_midwife_spotlight_path_idx" ON "_pages_v_blocks_midwife_spotlight" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_template_ref_order_idx" ON "_pages_v_blocks_template_ref" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_template_ref_parent_id_idx" ON "_pages_v_blocks_template_ref" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_template_ref_path_idx" ON "_pages_v_blocks_template_ref" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_template_ref_template_idx" ON "_pages_v_blocks_template_ref" USING btree ("template_id");
  CREATE INDEX "_pages_v_version_seo_audit_issues_order_idx" ON "_pages_v_version_seo_audit_issues" USING btree ("_order");
  CREATE INDEX "_pages_v_version_seo_audit_issues_parent_id_idx" ON "_pages_v_version_seo_audit_issues" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_seo_version_seo_og_image_idx" ON "_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_midwives_id_idx" ON "_pages_v_rels" USING btree ("midwives_id");
  CREATE INDEX "services_included_items_order_idx" ON "services_included_items" USING btree ("_order");
  CREATE INDEX "services_included_items_parent_id_idx" ON "services_included_items" USING btree ("_parent_id");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE UNIQUE INDEX "services_ref_code_idx" ON "services" USING btree ("ref_code");
  CREATE INDEX "services_seo_seo_og_image_idx" ON "services" USING btree ("seo_og_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "midwives_specialties_order_idx" ON "midwives_specialties" USING btree ("_order");
  CREATE INDEX "midwives_specialties_parent_id_idx" ON "midwives_specialties" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "midwives_str_number_idx" ON "midwives" USING btree ("str_number");
  CREATE INDEX "midwives_photo_idx" ON "midwives" USING btree ("photo_id");
  CREATE UNIQUE INDEX "midwives_slug_idx" ON "midwives" USING btree ("slug");
  CREATE INDEX "midwives_seo_seo_og_image_idx" ON "midwives" USING btree ("seo_og_image_id");
  CREATE INDEX "midwives_updated_at_idx" ON "midwives" USING btree ("updated_at");
  CREATE INDEX "midwives_created_at_idx" ON "midwives" USING btree ("created_at");
  CREATE INDEX "service_areas_landmarks_order_idx" ON "service_areas_landmarks" USING btree ("_order");
  CREATE INDEX "service_areas_landmarks_parent_id_idx" ON "service_areas_landmarks" USING btree ("_parent_id");
  CREATE INDEX "service_areas_available_services_order_idx" ON "service_areas_available_services" USING btree ("_order");
  CREATE INDEX "service_areas_available_services_parent_id_idx" ON "service_areas_available_services" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "service_areas_slug_idx" ON "service_areas" USING btree ("slug");
  CREATE INDEX "service_areas_seo_seo_og_image_idx" ON "service_areas" USING btree ("seo_og_image_id");
  CREATE INDEX "service_areas_updated_at_idx" ON "service_areas" USING btree ("updated_at");
  CREATE INDEX "service_areas_created_at_idx" ON "service_areas" USING btree ("created_at");
  CREATE INDEX "testimonials_related_service_idx" ON "testimonials" USING btree ("related_service_id");
  CREATE INDEX "testimonials_related_area_idx" ON "testimonials" USING btree ("related_area_id");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE UNIQUE INDEX "testimonials_external_ref_idx" ON "testimonials" USING btree ("external_ref");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "faq_updated_at_idx" ON "faq" USING btree ("updated_at");
  CREATE INDEX "faq_created_at_idx" ON "faq" USING btree ("created_at");
  CREATE INDEX "faq_rels_order_idx" ON "faq_rels" USING btree ("order");
  CREATE INDEX "faq_rels_parent_idx" ON "faq_rels" USING btree ("parent_id");
  CREATE INDEX "faq_rels_path_idx" ON "faq_rels" USING btree ("path");
  CREATE INDEX "faq_rels_services_id_idx" ON "faq_rels" USING btree ("services_id");
  CREATE INDEX "faq_rels_service_areas_id_idx" ON "faq_rels" USING btree ("service_areas_id");
  CREATE INDEX "articles_keywords_order_idx" ON "articles_keywords" USING btree ("_order");
  CREATE INDEX "articles_keywords_parent_id_idx" ON "articles_keywords" USING btree ("_parent_id");
  CREATE INDEX "articles_seo_audit_issues_order_idx" ON "articles_seo_audit_issues" USING btree ("_order");
  CREATE INDEX "articles_seo_audit_issues_parent_id_idx" ON "articles_seo_audit_issues" USING btree ("_parent_id");
  CREATE INDEX "articles_hero_image_idx" ON "articles" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_internal_linking_internal_linking_parent_pillar_idx" ON "articles" USING btree ("internal_linking_parent_pillar_id");
  CREATE INDEX "articles_seo_seo_og_image_idx" ON "articles" USING btree ("seo_og_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_services_id_idx" ON "articles_rels" USING btree ("services_id");
  CREATE INDEX "articles_rels_articles_id_idx" ON "articles_rels" USING btree ("articles_id");
  CREATE INDEX "articles_rels_service_areas_id_idx" ON "articles_rels" USING btree ("service_areas_id");
  CREATE INDEX "_articles_v_version_keywords_order_idx" ON "_articles_v_version_keywords" USING btree ("_order");
  CREATE INDEX "_articles_v_version_keywords_parent_id_idx" ON "_articles_v_version_keywords" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_version_seo_audit_issues_order_idx" ON "_articles_v_version_seo_audit_issues" USING btree ("_order");
  CREATE INDEX "_articles_v_version_seo_audit_issues_parent_id_idx" ON "_articles_v_version_seo_audit_issues" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_hero_image_idx" ON "_articles_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_internal_linking_version_internal_li_idx" ON "_articles_v" USING btree ("version_internal_linking_parent_pillar_id");
  CREATE INDEX "_articles_v_version_seo_version_seo_og_image_idx" ON "_articles_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_services_id_idx" ON "_articles_v_rels" USING btree ("services_id");
  CREATE INDEX "_articles_v_rels_articles_id_idx" ON "_articles_v_rels" USING btree ("articles_id");
  CREATE INDEX "_articles_v_rels_service_areas_id_idx" ON "_articles_v_rels" USING btree ("service_areas_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_help_center_id_idx" ON "payload_locked_documents_rels" USING btree ("help_center_id");
  CREATE INDEX "payload_locked_documents_rels_landing_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("landing_pages_id");
  CREATE INDEX "payload_locked_documents_rels_page_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("page_templates_id");
  CREATE INDEX "payload_locked_documents_rels_block_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("block_templates_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_midwives_id_idx" ON "payload_locked_documents_rels" USING btree ("midwives_id");
  CREATE INDEX "payload_locked_documents_rels_service_areas_id_idx" ON "payload_locked_documents_rels" USING btree ("service_areas_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_operational_schedule_days_order_idx" ON "site_settings_operational_schedule_days" USING btree ("_order");
  CREATE INDEX "site_settings_operational_schedule_days_parent_id_idx" ON "site_settings_operational_schedule_days" USING btree ("_parent_id");
  CREATE INDEX "site_settings_coverage_areas_order_idx" ON "site_settings_coverage_areas" USING btree ("_order");
  CREATE INDEX "site_settings_coverage_areas_parent_id_idx" ON "site_settings_coverage_areas" USING btree ("_parent_id");
  CREATE INDEX "site_settings_homepage_pain_points_order_idx" ON "site_settings_homepage_pain_points" USING btree ("_order");
  CREATE INDEX "site_settings_homepage_pain_points_parent_id_idx" ON "site_settings_homepage_pain_points" USING btree ("_parent_id");
  CREATE INDEX "site_settings_homepage_benefits_order_idx" ON "site_settings_homepage_benefits" USING btree ("_order");
  CREATE INDEX "site_settings_homepage_benefits_parent_id_idx" ON "site_settings_homepage_benefits" USING btree ("_parent_id");
  CREATE INDEX "site_settings_homepage_booking_steps_order_idx" ON "site_settings_homepage_booking_steps" USING btree ("_order");
  CREATE INDEX "site_settings_homepage_booking_steps_parent_id_idx" ON "site_settings_homepage_booking_steps" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "help_center_steps" CASCADE;
  DROP TABLE "help_center_dos_and_donts_dos" CASCADE;
  DROP TABLE "help_center_dos_and_donts_donts" CASCADE;
  DROP TABLE "help_center" CASCADE;
  DROP TABLE "landing_pages_active_pixels" CASCADE;
  DROP TABLE "landing_pages_blocks_hero" CASCADE;
  DROP TABLE "landing_pages_blocks_pain_points_points" CASCADE;
  DROP TABLE "landing_pages_blocks_pain_points" CASCADE;
  DROP TABLE "landing_pages_blocks_solutions_items" CASCADE;
  DROP TABLE "landing_pages_blocks_solutions" CASCADE;
  DROP TABLE "landing_pages_blocks_pricing_packages_features" CASCADE;
  DROP TABLE "landing_pages_blocks_pricing_packages" CASCADE;
  DROP TABLE "landing_pages_blocks_pricing" CASCADE;
  DROP TABLE "landing_pages_blocks_comparison_rows" CASCADE;
  DROP TABLE "landing_pages_blocks_comparison" CASCADE;
  DROP TABLE "landing_pages_blocks_steps_steps" CASCADE;
  DROP TABLE "landing_pages_blocks_steps" CASCADE;
  DROP TABLE "landing_pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "landing_pages_blocks_testimonials" CASCADE;
  DROP TABLE "landing_pages_blocks_guarantee" CASCADE;
  DROP TABLE "landing_pages_blocks_faq_faqs" CASCADE;
  DROP TABLE "landing_pages_blocks_faq" CASCADE;
  DROP TABLE "landing_pages_blocks_rich_text" CASCADE;
  DROP TABLE "landing_pages_blocks_cta" CASCADE;
  DROP TABLE "landing_pages_blocks_gallery_images" CASCADE;
  DROP TABLE "landing_pages_blocks_gallery" CASCADE;
  DROP TABLE "landing_pages_blocks_midwife_spotlight" CASCADE;
  DROP TABLE "landing_pages_blocks_template_ref" CASCADE;
  DROP TABLE "landing_pages_pain_points" CASCADE;
  DROP TABLE "landing_pages_solutions" CASCADE;
  DROP TABLE "landing_pages_steps" CASCADE;
  DROP TABLE "landing_pages_faqs" CASCADE;
  DROP TABLE "landing_pages_seo_audit_issues" CASCADE;
  DROP TABLE "landing_pages" CASCADE;
  DROP TABLE "landing_pages_rels" CASCADE;
  DROP TABLE "_landing_pages_v_version_active_pixels" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_pain_points_points" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_pain_points" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_solutions_items" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_solutions" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_pricing_packages_features" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_pricing_packages" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_pricing" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_comparison_rows" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_comparison" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_steps_steps" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_steps" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_guarantee" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_faq_faqs" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_gallery_images" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_midwife_spotlight" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_template_ref" CASCADE;
  DROP TABLE "_landing_pages_v_version_pain_points" CASCADE;
  DROP TABLE "_landing_pages_v_version_solutions" CASCADE;
  DROP TABLE "_landing_pages_v_version_steps" CASCADE;
  DROP TABLE "_landing_pages_v_version_faqs" CASCADE;
  DROP TABLE "_landing_pages_v_version_seo_audit_issues" CASCADE;
  DROP TABLE "_landing_pages_v" CASCADE;
  DROP TABLE "_landing_pages_v_rels" CASCADE;
  DROP TABLE "page_templates_blocks_hero" CASCADE;
  DROP TABLE "page_templates_blocks_pain_points_points" CASCADE;
  DROP TABLE "page_templates_blocks_pain_points" CASCADE;
  DROP TABLE "page_templates_blocks_solutions_items" CASCADE;
  DROP TABLE "page_templates_blocks_solutions" CASCADE;
  DROP TABLE "page_templates_blocks_pricing_packages_features" CASCADE;
  DROP TABLE "page_templates_blocks_pricing_packages" CASCADE;
  DROP TABLE "page_templates_blocks_pricing" CASCADE;
  DROP TABLE "page_templates_blocks_comparison_rows" CASCADE;
  DROP TABLE "page_templates_blocks_comparison" CASCADE;
  DROP TABLE "page_templates_blocks_steps_steps" CASCADE;
  DROP TABLE "page_templates_blocks_steps" CASCADE;
  DROP TABLE "page_templates_blocks_testimonials_items" CASCADE;
  DROP TABLE "page_templates_blocks_testimonials" CASCADE;
  DROP TABLE "page_templates_blocks_guarantee" CASCADE;
  DROP TABLE "page_templates_blocks_faq_faqs" CASCADE;
  DROP TABLE "page_templates_blocks_faq" CASCADE;
  DROP TABLE "page_templates_blocks_rich_text" CASCADE;
  DROP TABLE "page_templates_blocks_cta" CASCADE;
  DROP TABLE "page_templates_blocks_gallery_images" CASCADE;
  DROP TABLE "page_templates_blocks_gallery" CASCADE;
  DROP TABLE "page_templates_blocks_midwife_spotlight" CASCADE;
  DROP TABLE "page_templates_blocks_template_ref" CASCADE;
  DROP TABLE "page_templates" CASCADE;
  DROP TABLE "page_templates_rels" CASCADE;
  DROP TABLE "block_templates_blocks_hero" CASCADE;
  DROP TABLE "block_templates_blocks_pain_points_points" CASCADE;
  DROP TABLE "block_templates_blocks_pain_points" CASCADE;
  DROP TABLE "block_templates_blocks_solutions_items" CASCADE;
  DROP TABLE "block_templates_blocks_solutions" CASCADE;
  DROP TABLE "block_templates_blocks_pricing_packages_features" CASCADE;
  DROP TABLE "block_templates_blocks_pricing_packages" CASCADE;
  DROP TABLE "block_templates_blocks_pricing" CASCADE;
  DROP TABLE "block_templates_blocks_comparison_rows" CASCADE;
  DROP TABLE "block_templates_blocks_comparison" CASCADE;
  DROP TABLE "block_templates_blocks_steps_steps" CASCADE;
  DROP TABLE "block_templates_blocks_steps" CASCADE;
  DROP TABLE "block_templates_blocks_testimonials_items" CASCADE;
  DROP TABLE "block_templates_blocks_testimonials" CASCADE;
  DROP TABLE "block_templates_blocks_guarantee" CASCADE;
  DROP TABLE "block_templates_blocks_faq_faqs" CASCADE;
  DROP TABLE "block_templates_blocks_faq" CASCADE;
  DROP TABLE "block_templates_blocks_rich_text" CASCADE;
  DROP TABLE "block_templates_blocks_cta" CASCADE;
  DROP TABLE "block_templates_blocks_gallery_images" CASCADE;
  DROP TABLE "block_templates_blocks_gallery" CASCADE;
  DROP TABLE "block_templates_blocks_midwife_spotlight" CASCADE;
  DROP TABLE "block_templates" CASCADE;
  DROP TABLE "block_templates_rels" CASCADE;
  DROP TABLE "_block_templates_v_blocks_hero" CASCADE;
  DROP TABLE "_block_templates_v_blocks_pain_points_points" CASCADE;
  DROP TABLE "_block_templates_v_blocks_pain_points" CASCADE;
  DROP TABLE "_block_templates_v_blocks_solutions_items" CASCADE;
  DROP TABLE "_block_templates_v_blocks_solutions" CASCADE;
  DROP TABLE "_block_templates_v_blocks_pricing_packages_features" CASCADE;
  DROP TABLE "_block_templates_v_blocks_pricing_packages" CASCADE;
  DROP TABLE "_block_templates_v_blocks_pricing" CASCADE;
  DROP TABLE "_block_templates_v_blocks_comparison_rows" CASCADE;
  DROP TABLE "_block_templates_v_blocks_comparison" CASCADE;
  DROP TABLE "_block_templates_v_blocks_steps_steps" CASCADE;
  DROP TABLE "_block_templates_v_blocks_steps" CASCADE;
  DROP TABLE "_block_templates_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_block_templates_v_blocks_testimonials" CASCADE;
  DROP TABLE "_block_templates_v_blocks_guarantee" CASCADE;
  DROP TABLE "_block_templates_v_blocks_faq_faqs" CASCADE;
  DROP TABLE "_block_templates_v_blocks_faq" CASCADE;
  DROP TABLE "_block_templates_v_blocks_rich_text" CASCADE;
  DROP TABLE "_block_templates_v_blocks_cta" CASCADE;
  DROP TABLE "_block_templates_v_blocks_gallery_images" CASCADE;
  DROP TABLE "_block_templates_v_blocks_gallery" CASCADE;
  DROP TABLE "_block_templates_v_blocks_midwife_spotlight" CASCADE;
  DROP TABLE "_block_templates_v" CASCADE;
  DROP TABLE "_block_templates_v_rels" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_pain_points_points" CASCADE;
  DROP TABLE "pages_blocks_pain_points" CASCADE;
  DROP TABLE "pages_blocks_solutions_items" CASCADE;
  DROP TABLE "pages_blocks_solutions" CASCADE;
  DROP TABLE "pages_blocks_pricing_packages_features" CASCADE;
  DROP TABLE "pages_blocks_pricing_packages" CASCADE;
  DROP TABLE "pages_blocks_pricing" CASCADE;
  DROP TABLE "pages_blocks_comparison_rows" CASCADE;
  DROP TABLE "pages_blocks_comparison" CASCADE;
  DROP TABLE "pages_blocks_steps_steps" CASCADE;
  DROP TABLE "pages_blocks_steps" CASCADE;
  DROP TABLE "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_guarantee" CASCADE;
  DROP TABLE "pages_blocks_faq_faqs" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_midwife_spotlight" CASCADE;
  DROP TABLE "pages_blocks_template_ref" CASCADE;
  DROP TABLE "pages_seo_audit_issues" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_pain_points_points" CASCADE;
  DROP TABLE "_pages_v_blocks_pain_points" CASCADE;
  DROP TABLE "_pages_v_blocks_solutions_items" CASCADE;
  DROP TABLE "_pages_v_blocks_solutions" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_packages_features" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_packages" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_guarantee" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_faqs" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_midwife_spotlight" CASCADE;
  DROP TABLE "_pages_v_blocks_template_ref" CASCADE;
  DROP TABLE "_pages_v_version_seo_audit_issues" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "services_included_items" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "midwives_specialties" CASCADE;
  DROP TABLE "midwives" CASCADE;
  DROP TABLE "service_areas_landmarks" CASCADE;
  DROP TABLE "service_areas_available_services" CASCADE;
  DROP TABLE "service_areas" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "faq_rels" CASCADE;
  DROP TABLE "articles_keywords" CASCADE;
  DROP TABLE "articles_seo_audit_issues" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v_version_keywords" CASCADE;
  DROP TABLE "_articles_v_version_seo_audit_issues" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_operational_schedule_days" CASCADE;
  DROP TABLE "site_settings_coverage_areas" CASCADE;
  DROP TABLE "site_settings_homepage_pain_points" CASCADE;
  DROP TABLE "site_settings_homepage_benefits" CASCADE;
  DROP TABLE "site_settings_homepage_booking_steps" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_help_center_category";
  DROP TYPE "public"."enum_landing_pages_active_pixels";
  DROP TYPE "public"."enum_landing_pages_blocks_hero_align";
  DROP TYPE "public"."enum_landing_pages_blocks_hero_btn_color";
  DROP TYPE "public"."enum_landing_pages_blocks_hero_bg_style";
  DROP TYPE "public"."enum_landing_pages_blocks_pain_points_columns";
  DROP TYPE "public"."enum_landing_pages_blocks_pain_points_background";
  DROP TYPE "public"."enum_landing_pages_blocks_pain_points_spacing";
  DROP TYPE "public"."enum_landing_pages_blocks_pricing_layout_style";
  DROP TYPE "public"."enum_landing_pages_blocks_pricing_background";
  DROP TYPE "public"."enum_landing_pages_blocks_pricing_spacing";
  DROP TYPE "public"."enum_landing_pages_blocks_rich_text_container_width";
  DROP TYPE "public"."enum_landing_pages_blocks_gallery_columns";
  DROP TYPE "public"."enum_landing_pages_blocks_gallery_bg_style";
  DROP TYPE "public"."enum_landing_pages_blocks_midwife_spotlight_background";
  DROP TYPE "public"."enum_landing_pages_blocks_midwife_spotlight_spacing";
  DROP TYPE "public"."enum_landing_pages_seo_audit_issues_severity";
  DROP TYPE "public"."enum_landing_pages_variant";
  DROP TYPE "public"."enum_landing_pages_seo_audit_grade";
  DROP TYPE "public"."enum_landing_pages_status";
  DROP TYPE "public"."enum__landing_pages_v_version_active_pixels";
  DROP TYPE "public"."enum__landing_pages_v_blocks_hero_align";
  DROP TYPE "public"."enum__landing_pages_v_blocks_hero_btn_color";
  DROP TYPE "public"."enum__landing_pages_v_blocks_hero_bg_style";
  DROP TYPE "public"."enum__landing_pages_v_blocks_pain_points_columns";
  DROP TYPE "public"."enum__landing_pages_v_blocks_pain_points_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_pain_points_spacing";
  DROP TYPE "public"."enum__landing_pages_v_blocks_pricing_layout_style";
  DROP TYPE "public"."enum__landing_pages_v_blocks_pricing_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_pricing_spacing";
  DROP TYPE "public"."enum__landing_pages_v_blocks_rich_text_container_width";
  DROP TYPE "public"."enum__landing_pages_v_blocks_gallery_columns";
  DROP TYPE "public"."enum__landing_pages_v_blocks_gallery_bg_style";
  DROP TYPE "public"."enum__landing_pages_v_blocks_midwife_spotlight_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_midwife_spotlight_spacing";
  DROP TYPE "public"."enum__landing_pages_v_version_seo_audit_issues_severity";
  DROP TYPE "public"."enum__landing_pages_v_version_variant";
  DROP TYPE "public"."enum__landing_pages_v_version_seo_audit_grade";
  DROP TYPE "public"."enum__landing_pages_v_version_status";
  DROP TYPE "public"."enum_page_templates_blocks_hero_align";
  DROP TYPE "public"."enum_page_templates_blocks_hero_btn_color";
  DROP TYPE "public"."enum_page_templates_blocks_hero_bg_style";
  DROP TYPE "public"."enum_page_templates_blocks_pain_points_columns";
  DROP TYPE "public"."enum_page_templates_blocks_pain_points_background";
  DROP TYPE "public"."enum_page_templates_blocks_pain_points_spacing";
  DROP TYPE "public"."enum_page_templates_blocks_pricing_layout_style";
  DROP TYPE "public"."enum_page_templates_blocks_pricing_background";
  DROP TYPE "public"."enum_page_templates_blocks_pricing_spacing";
  DROP TYPE "public"."enum_page_templates_blocks_rich_text_container_width";
  DROP TYPE "public"."enum_page_templates_blocks_gallery_columns";
  DROP TYPE "public"."enum_page_templates_blocks_gallery_bg_style";
  DROP TYPE "public"."enum_page_templates_blocks_midwife_spotlight_background";
  DROP TYPE "public"."enum_page_templates_blocks_midwife_spotlight_spacing";
  DROP TYPE "public"."enum_page_templates_category";
  DROP TYPE "public"."enum_block_templates_blocks_hero_align";
  DROP TYPE "public"."enum_block_templates_blocks_hero_btn_color";
  DROP TYPE "public"."enum_block_templates_blocks_hero_bg_style";
  DROP TYPE "public"."enum_block_templates_blocks_pain_points_columns";
  DROP TYPE "public"."enum_block_templates_blocks_pain_points_background";
  DROP TYPE "public"."enum_block_templates_blocks_pain_points_spacing";
  DROP TYPE "public"."enum_block_templates_blocks_pricing_layout_style";
  DROP TYPE "public"."enum_block_templates_blocks_pricing_background";
  DROP TYPE "public"."enum_block_templates_blocks_pricing_spacing";
  DROP TYPE "public"."enum_block_templates_blocks_rich_text_container_width";
  DROP TYPE "public"."enum_block_templates_blocks_gallery_columns";
  DROP TYPE "public"."enum_block_templates_blocks_gallery_bg_style";
  DROP TYPE "public"."enum_block_templates_blocks_midwife_spotlight_background";
  DROP TYPE "public"."enum_block_templates_blocks_midwife_spotlight_spacing";
  DROP TYPE "public"."enum_block_templates_category";
  DROP TYPE "public"."enum_block_templates_status";
  DROP TYPE "public"."enum__block_templates_v_blocks_hero_align";
  DROP TYPE "public"."enum__block_templates_v_blocks_hero_btn_color";
  DROP TYPE "public"."enum__block_templates_v_blocks_hero_bg_style";
  DROP TYPE "public"."enum__block_templates_v_blocks_pain_points_columns";
  DROP TYPE "public"."enum__block_templates_v_blocks_pain_points_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_pain_points_spacing";
  DROP TYPE "public"."enum__block_templates_v_blocks_pricing_layout_style";
  DROP TYPE "public"."enum__block_templates_v_blocks_pricing_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_pricing_spacing";
  DROP TYPE "public"."enum__block_templates_v_blocks_rich_text_container_width";
  DROP TYPE "public"."enum__block_templates_v_blocks_gallery_columns";
  DROP TYPE "public"."enum__block_templates_v_blocks_gallery_bg_style";
  DROP TYPE "public"."enum__block_templates_v_blocks_midwife_spotlight_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_midwife_spotlight_spacing";
  DROP TYPE "public"."enum__block_templates_v_version_category";
  DROP TYPE "public"."enum__block_templates_v_version_status";
  DROP TYPE "public"."enum_pages_blocks_hero_align";
  DROP TYPE "public"."enum_pages_blocks_hero_btn_color";
  DROP TYPE "public"."enum_pages_blocks_hero_bg_style";
  DROP TYPE "public"."enum_pages_blocks_pain_points_columns";
  DROP TYPE "public"."enum_pages_blocks_pain_points_background";
  DROP TYPE "public"."enum_pages_blocks_pain_points_spacing";
  DROP TYPE "public"."enum_pages_blocks_pricing_layout_style";
  DROP TYPE "public"."enum_pages_blocks_pricing_background";
  DROP TYPE "public"."enum_pages_blocks_pricing_spacing";
  DROP TYPE "public"."enum_pages_blocks_rich_text_container_width";
  DROP TYPE "public"."enum_pages_blocks_gallery_columns";
  DROP TYPE "public"."enum_pages_blocks_gallery_bg_style";
  DROP TYPE "public"."enum_pages_blocks_midwife_spotlight_background";
  DROP TYPE "public"."enum_pages_blocks_midwife_spotlight_spacing";
  DROP TYPE "public"."enum_pages_seo_audit_issues_severity";
  DROP TYPE "public"."enum_pages_seo_audit_grade";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_align";
  DROP TYPE "public"."enum__pages_v_blocks_hero_btn_color";
  DROP TYPE "public"."enum__pages_v_blocks_hero_bg_style";
  DROP TYPE "public"."enum__pages_v_blocks_pain_points_columns";
  DROP TYPE "public"."enum__pages_v_blocks_pain_points_background";
  DROP TYPE "public"."enum__pages_v_blocks_pain_points_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_layout_style";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_background";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_container_width";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_columns";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_bg_style";
  DROP TYPE "public"."enum__pages_v_blocks_midwife_spotlight_background";
  DROP TYPE "public"."enum__pages_v_blocks_midwife_spotlight_spacing";
  DROP TYPE "public"."enum__pages_v_version_seo_audit_issues_severity";
  DROP TYPE "public"."enum__pages_v_version_seo_audit_grade";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_service_areas_city";
  DROP TYPE "public"."enum_faq_category";
  DROP TYPE "public"."enum_articles_seo_audit_issues_severity";
  DROP TYPE "public"."enum_articles_category";
  DROP TYPE "public"."enum_articles_seo_audit_grade";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_seo_audit_issues_severity";
  DROP TYPE "public"."enum__articles_v_version_category";
  DROP TYPE "public"."enum__articles_v_version_seo_audit_grade";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_site_settings_operational_schedule_days_day";`)
}
