import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_pain_points_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_solutions_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_pricing_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_comparison_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_steps_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_guarantee_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_faq_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_cta_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_gallery_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_midwife_spotlight_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_heading_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_heading_level" AS ENUM('h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_heading_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_heading_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_pages_blocks_image_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_image_width" AS ENUM('normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_image_align" AS ENUM('center', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_image_ratio" AS ENUM('auto', '16:9', '4:3', '1:1');
  CREATE TYPE "public"."enum_pages_blocks_image_rounded" AS ENUM('none', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_button_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_button_action" AS ENUM('whatsapp', 'url');
  CREATE TYPE "public"."enum_pages_blocks_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_button_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_button_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_divider_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_divider_variant" AS ENUM('line', 'dots', 'space');
  CREATE TYPE "public"."enum_pages_blocks_divider_spacing" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_divider_width" AS ENUM('narrow', 'normal', 'full');
  CREATE TYPE "public"."enum_pages_blocks_video_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_video_ratio" AS ENUM('16:9', '9:16', '4:3', '1:1');
  CREATE TYPE "public"."enum_pages_blocks_video_max_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_stats_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_stats_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_pages_blocks_stats_style" AS ENUM('plain', 'card');
  CREATE TYPE "public"."enum_pages_blocks_logos_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_logos_columns" AS ENUM('3', '4', '5', '6');
  CREATE TYPE "public"."enum_pages_blocks_logos_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_team_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_team_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_team_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_pages_blocks_tabs_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_tabs_style" AS ENUM('pills', 'underline');
  CREATE TYPE "public"."enum_pages_blocks_tabs_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_pages_blocks_lead_form_fields" AS ENUM('name', 'phone', 'email', 'service', 'date', 'message');
  CREATE TYPE "public"."enum_pages_blocks_lead_form_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_lead_form_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_pages_blocks_blog_feed_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_blog_feed_source" AS ENUM('latest', 'category');
  CREATE TYPE "public"."enum_pages_blocks_blog_feed_category" AS ENUM('bayi', 'ibu-menyusui', 'layanan', 'kehamilan');
  CREATE TYPE "public"."enum_pages_blocks_blog_feed_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_pages_blocks_blog_feed_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_countdown_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_countdown_background" AS ENUM('peach', 'cream', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_social_items_platform" AS ENUM('instagram', 'tiktok', 'facebook', 'youtube', 'whatsapp', 'email');
  CREATE TYPE "public"."enum_pages_blocks_social_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_social_variant" AS ENUM('icons', 'share', 'both');
  CREATE TYPE "public"."enum_pages_blocks_social_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_social_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_pages_blocks_section_columns_width" AS ENUM('full', 'half', 'third', 'twoThirds', 'quarter');
  CREATE TYPE "public"."enum_pages_blocks_section_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_section_background" AS ENUM('white', 'cream', 'peach', 'gradient');
  CREATE TYPE "public"."enum_pages_blocks_section_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_pages_blocks_section_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_section_gap" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_pages_editor_mode" AS ENUM('builder', 'form');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_pain_points_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_solutions_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_comparison_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_steps_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_guarantee_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_midwife_spotlight_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_level" AS ENUM('h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_heading_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_image_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_image_width" AS ENUM('normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_image_align" AS ENUM('center', 'left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_image_ratio" AS ENUM('auto', '16:9', '4:3', '1:1');
  CREATE TYPE "public"."enum__pages_v_blocks_image_rounded" AS ENUM('none', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_button_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_button_action" AS ENUM('whatsapp', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_button_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_button_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_divider_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_divider_variant" AS ENUM('line', 'dots', 'space');
  CREATE TYPE "public"."enum__pages_v_blocks_divider_spacing" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_divider_width" AS ENUM('narrow', 'normal', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_video_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_video_ratio" AS ENUM('16:9', '9:16', '4:3', '1:1');
  CREATE TYPE "public"."enum__pages_v_blocks_video_max_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_style" AS ENUM('plain', 'card');
  CREATE TYPE "public"."enum__pages_v_blocks_logos_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_logos_columns" AS ENUM('3', '4', '5', '6');
  CREATE TYPE "public"."enum__pages_v_blocks_logos_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum__pages_v_blocks_team_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_team_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_team_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__pages_v_blocks_tabs_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_tabs_style" AS ENUM('pills', 'underline');
  CREATE TYPE "public"."enum__pages_v_blocks_tabs_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__pages_v_blocks_lead_form_fields" AS ENUM('name', 'phone', 'email', 'service', 'date', 'message');
  CREATE TYPE "public"."enum__pages_v_blocks_lead_form_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_lead_form_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__pages_v_blocks_blog_feed_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_blog_feed_source" AS ENUM('latest', 'category');
  CREATE TYPE "public"."enum__pages_v_blocks_blog_feed_category" AS ENUM('bayi', 'ibu-menyusui', 'layanan', 'kehamilan');
  CREATE TYPE "public"."enum__pages_v_blocks_blog_feed_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_blog_feed_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum__pages_v_blocks_countdown_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_countdown_background" AS ENUM('peach', 'cream', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_social_items_platform" AS ENUM('instagram', 'tiktok', 'facebook', 'youtube', 'whatsapp', 'email');
  CREATE TYPE "public"."enum__pages_v_blocks_social_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_social_variant" AS ENUM('icons', 'share', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_social_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_social_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__pages_v_blocks_section_columns_width" AS ENUM('full', 'half', 'third', 'twoThirds', 'quarter');
  CREATE TYPE "public"."enum__pages_v_blocks_section_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_section_background" AS ENUM('white', 'cream', 'peach', 'gradient');
  CREATE TYPE "public"."enum__pages_v_blocks_section_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__pages_v_blocks_section_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_section_gap" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__pages_v_version_editor_mode" AS ENUM('builder', 'form');
  CREATE TYPE "public"."enum_landing_pages_blocks_hero_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_pain_points_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_solutions_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_pricing_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_comparison_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_steps_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_testimonials_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_guarantee_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_faq_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_rich_text_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_cta_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_gallery_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_midwife_spotlight_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_heading_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_heading_level" AS ENUM('h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_landing_pages_blocks_heading_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_landing_pages_blocks_heading_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_landing_pages_blocks_image_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_image_width" AS ENUM('normal', 'wide', 'full');
  CREATE TYPE "public"."enum_landing_pages_blocks_image_align" AS ENUM('center', 'left', 'right');
  CREATE TYPE "public"."enum_landing_pages_blocks_image_ratio" AS ENUM('auto', '16:9', '4:3', '1:1');
  CREATE TYPE "public"."enum_landing_pages_blocks_image_rounded" AS ENUM('none', 'md', 'lg');
  CREATE TYPE "public"."enum_landing_pages_blocks_button_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_button_action" AS ENUM('whatsapp', 'url');
  CREATE TYPE "public"."enum_landing_pages_blocks_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_landing_pages_blocks_button_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_landing_pages_blocks_button_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_landing_pages_blocks_divider_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_divider_variant" AS ENUM('line', 'dots', 'space');
  CREATE TYPE "public"."enum_landing_pages_blocks_divider_spacing" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_landing_pages_blocks_divider_width" AS ENUM('narrow', 'normal', 'full');
  CREATE TYPE "public"."enum_landing_pages_blocks_video_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_video_ratio" AS ENUM('16:9', '9:16', '4:3', '1:1');
  CREATE TYPE "public"."enum_landing_pages_blocks_video_max_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum_landing_pages_blocks_stats_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_landing_pages_blocks_stats_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_landing_pages_blocks_stats_style" AS ENUM('plain', 'card');
  CREATE TYPE "public"."enum_landing_pages_blocks_logos_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_logos_columns" AS ENUM('3', '4', '5', '6');
  CREATE TYPE "public"."enum_landing_pages_blocks_logos_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_landing_pages_blocks_team_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_team_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_landing_pages_blocks_team_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_landing_pages_blocks_tabs_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_tabs_style" AS ENUM('pills', 'underline');
  CREATE TYPE "public"."enum_landing_pages_blocks_tabs_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_landing_pages_blocks_lead_form_fields" AS ENUM('name', 'phone', 'email', 'service', 'date', 'message');
  CREATE TYPE "public"."enum_landing_pages_blocks_lead_form_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_lead_form_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_landing_pages_blocks_blog_feed_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_blog_feed_source" AS ENUM('latest', 'category');
  CREATE TYPE "public"."enum_landing_pages_blocks_blog_feed_category" AS ENUM('bayi', 'ibu-menyusui', 'layanan', 'kehamilan');
  CREATE TYPE "public"."enum_landing_pages_blocks_blog_feed_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_landing_pages_blocks_blog_feed_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_landing_pages_blocks_countdown_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_countdown_background" AS ENUM('peach', 'cream', 'dark');
  CREATE TYPE "public"."enum_landing_pages_blocks_social_items_platform" AS ENUM('instagram', 'tiktok', 'facebook', 'youtube', 'whatsapp', 'email');
  CREATE TYPE "public"."enum_landing_pages_blocks_social_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_social_variant" AS ENUM('icons', 'share', 'both');
  CREATE TYPE "public"."enum_landing_pages_blocks_social_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_landing_pages_blocks_social_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_landing_pages_blocks_section_columns_width" AS ENUM('full', 'half', 'third', 'twoThirds', 'quarter');
  CREATE TYPE "public"."enum_landing_pages_blocks_section_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_landing_pages_blocks_section_background" AS ENUM('white', 'cream', 'peach', 'gradient');
  CREATE TYPE "public"."enum_landing_pages_blocks_section_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_landing_pages_blocks_section_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_landing_pages_blocks_section_gap" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_landing_pages_editor_mode" AS ENUM('builder', 'form');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_hero_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_pain_points_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_solutions_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_pricing_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_comparison_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_steps_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_testimonials_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_guarantee_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_faq_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_rich_text_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_cta_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_gallery_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_midwife_spotlight_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_heading_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_heading_level" AS ENUM('h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_heading_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_heading_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_image_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_image_width" AS ENUM('normal', 'wide', 'full');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_image_align" AS ENUM('center', 'left', 'right');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_image_ratio" AS ENUM('auto', '16:9', '4:3', '1:1');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_image_rounded" AS ENUM('none', 'md', 'lg');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_button_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_button_action" AS ENUM('whatsapp', 'url');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_button_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_button_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_divider_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_divider_variant" AS ENUM('line', 'dots', 'space');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_divider_spacing" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_divider_width" AS ENUM('narrow', 'normal', 'full');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_video_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_video_ratio" AS ENUM('16:9', '9:16', '4:3', '1:1');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_video_max_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_stats_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_stats_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_stats_style" AS ENUM('plain', 'card');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_logos_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_logos_columns" AS ENUM('3', '4', '5', '6');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_logos_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_team_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_team_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_team_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_tabs_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_tabs_style" AS ENUM('pills', 'underline');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_tabs_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_lead_form_fields" AS ENUM('name', 'phone', 'email', 'service', 'date', 'message');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_lead_form_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_lead_form_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_blog_feed_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_blog_feed_source" AS ENUM('latest', 'category');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_blog_feed_category" AS ENUM('bayi', 'ibu-menyusui', 'layanan', 'kehamilan');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_blog_feed_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_blog_feed_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_countdown_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_countdown_background" AS ENUM('peach', 'cream', 'dark');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_social_items_platform" AS ENUM('instagram', 'tiktok', 'facebook', 'youtube', 'whatsapp', 'email');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_social_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_social_variant" AS ENUM('icons', 'share', 'both');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_social_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_social_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_section_columns_width" AS ENUM('full', 'half', 'third', 'twoThirds', 'quarter');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_section_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_section_background" AS ENUM('white', 'cream', 'peach', 'gradient');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_section_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_section_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__landing_pages_v_blocks_section_gap" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__landing_pages_v_version_editor_mode" AS ENUM('builder', 'form');
  CREATE TYPE "public"."enum_page_templates_blocks_hero_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_pain_points_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_solutions_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_pricing_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_comparison_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_steps_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_testimonials_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_guarantee_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_faq_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_rich_text_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_cta_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_gallery_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_midwife_spotlight_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_heading_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_heading_level" AS ENUM('h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_page_templates_blocks_heading_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_page_templates_blocks_heading_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_page_templates_blocks_image_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_image_width" AS ENUM('normal', 'wide', 'full');
  CREATE TYPE "public"."enum_page_templates_blocks_image_align" AS ENUM('center', 'left', 'right');
  CREATE TYPE "public"."enum_page_templates_blocks_image_ratio" AS ENUM('auto', '16:9', '4:3', '1:1');
  CREATE TYPE "public"."enum_page_templates_blocks_image_rounded" AS ENUM('none', 'md', 'lg');
  CREATE TYPE "public"."enum_page_templates_blocks_button_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_button_action" AS ENUM('whatsapp', 'url');
  CREATE TYPE "public"."enum_page_templates_blocks_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_page_templates_blocks_button_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_page_templates_blocks_button_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_page_templates_blocks_divider_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_divider_variant" AS ENUM('line', 'dots', 'space');
  CREATE TYPE "public"."enum_page_templates_blocks_divider_spacing" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_page_templates_blocks_divider_width" AS ENUM('narrow', 'normal', 'full');
  CREATE TYPE "public"."enum_page_templates_blocks_video_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_video_ratio" AS ENUM('16:9', '9:16', '4:3', '1:1');
  CREATE TYPE "public"."enum_page_templates_blocks_video_max_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum_page_templates_blocks_stats_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_page_templates_blocks_stats_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_page_templates_blocks_stats_style" AS ENUM('plain', 'card');
  CREATE TYPE "public"."enum_page_templates_blocks_logos_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_logos_columns" AS ENUM('3', '4', '5', '6');
  CREATE TYPE "public"."enum_page_templates_blocks_logos_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_page_templates_blocks_team_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_team_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_page_templates_blocks_team_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_page_templates_blocks_tabs_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_tabs_style" AS ENUM('pills', 'underline');
  CREATE TYPE "public"."enum_page_templates_blocks_tabs_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_page_templates_blocks_lead_form_fields" AS ENUM('name', 'phone', 'email', 'service', 'date', 'message');
  CREATE TYPE "public"."enum_page_templates_blocks_lead_form_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_lead_form_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_page_templates_blocks_blog_feed_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_blog_feed_source" AS ENUM('latest', 'category');
  CREATE TYPE "public"."enum_page_templates_blocks_blog_feed_category" AS ENUM('bayi', 'ibu-menyusui', 'layanan', 'kehamilan');
  CREATE TYPE "public"."enum_page_templates_blocks_blog_feed_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_page_templates_blocks_blog_feed_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_page_templates_blocks_countdown_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_countdown_background" AS ENUM('peach', 'cream', 'dark');
  CREATE TYPE "public"."enum_page_templates_blocks_social_items_platform" AS ENUM('instagram', 'tiktok', 'facebook', 'youtube', 'whatsapp', 'email');
  CREATE TYPE "public"."enum_page_templates_blocks_social_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_social_variant" AS ENUM('icons', 'share', 'both');
  CREATE TYPE "public"."enum_page_templates_blocks_social_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_page_templates_blocks_social_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_page_templates_blocks_section_columns_width" AS ENUM('full', 'half', 'third', 'twoThirds', 'quarter');
  CREATE TYPE "public"."enum_page_templates_blocks_section_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_page_templates_blocks_section_background" AS ENUM('white', 'cream', 'peach', 'gradient');
  CREATE TYPE "public"."enum_page_templates_blocks_section_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_page_templates_blocks_section_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_page_templates_blocks_section_gap" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_block_templates_blocks_hero_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_pain_points_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_solutions_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_pricing_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_comparison_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_steps_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_testimonials_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_guarantee_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_faq_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_rich_text_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_cta_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_gallery_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_midwife_spotlight_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_heading_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_heading_level" AS ENUM('h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_block_templates_blocks_heading_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_block_templates_blocks_heading_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_block_templates_blocks_image_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_image_width" AS ENUM('normal', 'wide', 'full');
  CREATE TYPE "public"."enum_block_templates_blocks_image_align" AS ENUM('center', 'left', 'right');
  CREATE TYPE "public"."enum_block_templates_blocks_image_ratio" AS ENUM('auto', '16:9', '4:3', '1:1');
  CREATE TYPE "public"."enum_block_templates_blocks_image_rounded" AS ENUM('none', 'md', 'lg');
  CREATE TYPE "public"."enum_block_templates_blocks_button_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_button_action" AS ENUM('whatsapp', 'url');
  CREATE TYPE "public"."enum_block_templates_blocks_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_block_templates_blocks_button_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_block_templates_blocks_button_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_block_templates_blocks_divider_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_divider_variant" AS ENUM('line', 'dots', 'space');
  CREATE TYPE "public"."enum_block_templates_blocks_divider_spacing" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_block_templates_blocks_divider_width" AS ENUM('narrow', 'normal', 'full');
  CREATE TYPE "public"."enum_block_templates_blocks_video_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_video_ratio" AS ENUM('16:9', '9:16', '4:3', '1:1');
  CREATE TYPE "public"."enum_block_templates_blocks_video_max_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum_block_templates_blocks_stats_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_block_templates_blocks_stats_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_block_templates_blocks_stats_style" AS ENUM('plain', 'card');
  CREATE TYPE "public"."enum_block_templates_blocks_logos_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_logos_columns" AS ENUM('3', '4', '5', '6');
  CREATE TYPE "public"."enum_block_templates_blocks_logos_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_block_templates_blocks_team_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_team_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_block_templates_blocks_team_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_block_templates_blocks_tabs_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_tabs_style" AS ENUM('pills', 'underline');
  CREATE TYPE "public"."enum_block_templates_blocks_tabs_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_block_templates_blocks_lead_form_fields" AS ENUM('name', 'phone', 'email', 'service', 'date', 'message');
  CREATE TYPE "public"."enum_block_templates_blocks_lead_form_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_lead_form_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_block_templates_blocks_blog_feed_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_blog_feed_source" AS ENUM('latest', 'category');
  CREATE TYPE "public"."enum_block_templates_blocks_blog_feed_category" AS ENUM('bayi', 'ibu-menyusui', 'layanan', 'kehamilan');
  CREATE TYPE "public"."enum_block_templates_blocks_blog_feed_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_block_templates_blocks_blog_feed_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_block_templates_blocks_countdown_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_countdown_background" AS ENUM('peach', 'cream', 'dark');
  CREATE TYPE "public"."enum_block_templates_blocks_social_items_platform" AS ENUM('instagram', 'tiktok', 'facebook', 'youtube', 'whatsapp', 'email');
  CREATE TYPE "public"."enum_block_templates_blocks_social_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_social_variant" AS ENUM('icons', 'share', 'both');
  CREATE TYPE "public"."enum_block_templates_blocks_social_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_block_templates_blocks_social_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum_block_templates_blocks_section_columns_width" AS ENUM('full', 'half', 'third', 'twoThirds', 'quarter');
  CREATE TYPE "public"."enum_block_templates_blocks_section_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_block_templates_blocks_section_background" AS ENUM('white', 'cream', 'peach', 'gradient');
  CREATE TYPE "public"."enum_block_templates_blocks_section_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum_block_templates_blocks_section_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_block_templates_blocks_section_gap" AS ENUM('compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__block_templates_v_blocks_hero_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_pain_points_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_solutions_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_pricing_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_comparison_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_steps_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_testimonials_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_guarantee_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_faq_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_rich_text_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_cta_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_gallery_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_midwife_spotlight_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_heading_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_heading_level" AS ENUM('h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__block_templates_v_blocks_heading_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__block_templates_v_blocks_heading_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum__block_templates_v_blocks_image_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_image_width" AS ENUM('normal', 'wide', 'full');
  CREATE TYPE "public"."enum__block_templates_v_blocks_image_align" AS ENUM('center', 'left', 'right');
  CREATE TYPE "public"."enum__block_templates_v_blocks_image_ratio" AS ENUM('auto', '16:9', '4:3', '1:1');
  CREATE TYPE "public"."enum__block_templates_v_blocks_image_rounded" AS ENUM('none', 'md', 'lg');
  CREATE TYPE "public"."enum__block_templates_v_blocks_button_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_button_action" AS ENUM('whatsapp', 'url');
  CREATE TYPE "public"."enum__block_templates_v_blocks_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum__block_templates_v_blocks_button_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__block_templates_v_blocks_button_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__block_templates_v_blocks_divider_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_divider_variant" AS ENUM('line', 'dots', 'space');
  CREATE TYPE "public"."enum__block_templates_v_blocks_divider_spacing" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__block_templates_v_blocks_divider_width" AS ENUM('narrow', 'normal', 'full');
  CREATE TYPE "public"."enum__block_templates_v_blocks_video_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_video_ratio" AS ENUM('16:9', '9:16', '4:3', '1:1');
  CREATE TYPE "public"."enum__block_templates_v_blocks_video_max_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum__block_templates_v_blocks_stats_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_stats_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__block_templates_v_blocks_stats_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__block_templates_v_blocks_stats_style" AS ENUM('plain', 'card');
  CREATE TYPE "public"."enum__block_templates_v_blocks_logos_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_logos_columns" AS ENUM('3', '4', '5', '6');
  CREATE TYPE "public"."enum__block_templates_v_blocks_logos_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum__block_templates_v_blocks_team_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_team_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__block_templates_v_blocks_team_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__block_templates_v_blocks_tabs_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_tabs_style" AS ENUM('pills', 'underline');
  CREATE TYPE "public"."enum__block_templates_v_blocks_tabs_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__block_templates_v_blocks_lead_form_fields" AS ENUM('name', 'phone', 'email', 'service', 'date', 'message');
  CREATE TYPE "public"."enum__block_templates_v_blocks_lead_form_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_lead_form_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__block_templates_v_blocks_blog_feed_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_blog_feed_source" AS ENUM('latest', 'category');
  CREATE TYPE "public"."enum__block_templates_v_blocks_blog_feed_category" AS ENUM('bayi', 'ibu-menyusui', 'layanan', 'kehamilan');
  CREATE TYPE "public"."enum__block_templates_v_blocks_blog_feed_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__block_templates_v_blocks_blog_feed_background" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum__block_templates_v_blocks_countdown_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_countdown_background" AS ENUM('peach', 'cream', 'dark');
  CREATE TYPE "public"."enum__block_templates_v_blocks_social_items_platform" AS ENUM('instagram', 'tiktok', 'facebook', 'youtube', 'whatsapp', 'email');
  CREATE TYPE "public"."enum__block_templates_v_blocks_social_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_social_variant" AS ENUM('icons', 'share', 'both');
  CREATE TYPE "public"."enum__block_templates_v_blocks_social_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__block_templates_v_blocks_social_background" AS ENUM('white', 'cream', 'peach');
  CREATE TYPE "public"."enum__block_templates_v_blocks_section_columns_width" AS ENUM('full', 'half', 'third', 'twoThirds', 'quarter');
  CREATE TYPE "public"."enum__block_templates_v_blocks_section_visibility" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__block_templates_v_blocks_section_background" AS ENUM('white', 'cream', 'peach', 'gradient');
  CREATE TYPE "public"."enum__block_templates_v_blocks_section_padding" AS ENUM('none', 'compact', 'normal', 'spacious');
  CREATE TYPE "public"."enum__block_templates_v_blocks_section_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__block_templates_v_blocks_section_gap" AS ENUM('compact', 'normal', 'spacious');
  CREATE TABLE "pages_blocks_hero_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_hero_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pain_points_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_pain_points_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_solutions_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_solutions_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pricing_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_pricing_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_comparison_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_comparison_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_steps_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_steps_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_testimonials_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_testimonials_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_guarantee_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_guarantee_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_faq_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_rich_text_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_rich_text_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_cta_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_gallery_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_midwife_spotlight_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_midwife_spotlight_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_heading_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_heading_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"text" varchar,
  	"subtitle" varchar,
  	"level" "enum_pages_blocks_heading_level" DEFAULT 'h2',
  	"size" "enum_pages_blocks_heading_size" DEFAULT 'md',
  	"align" "enum_pages_blocks_heading_align" DEFAULT 'center',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_image_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"link" varchar,
  	"width" "enum_pages_blocks_image_width" DEFAULT 'normal',
  	"align" "enum_pages_blocks_image_align" DEFAULT 'center',
  	"ratio" "enum_pages_blocks_image_ratio" DEFAULT 'auto',
  	"rounded" "enum_pages_blocks_image_rounded" DEFAULT 'md',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_button_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_button_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_button" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"action" "enum_pages_blocks_button_action" DEFAULT 'whatsapp',
  	"style" "enum_pages_blocks_button_style" DEFAULT 'primary',
  	"whatsapp_message" varchar,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"size" "enum_pages_blocks_button_size" DEFAULT 'md',
  	"align" "enum_pages_blocks_button_align" DEFAULT 'center',
  	"note" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_divider_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_divider_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_divider_variant" DEFAULT 'line',
  	"spacing" "enum_pages_blocks_divider_spacing" DEFAULT 'md',
  	"width" "enum_pages_blocks_divider_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_video_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"caption" varchar,
  	"ratio" "enum_pages_blocks_video_ratio" DEFAULT '16:9',
  	"max_width" "enum_pages_blocks_video_max_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_stats_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum_pages_blocks_stats_columns" DEFAULT '3',
  	"background" "enum_pages_blocks_stats_background" DEFAULT 'cream',
  	"style" "enum_pages_blocks_stats_style" DEFAULT 'plain',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "pages_blocks_logos_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_logos_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_pages_blocks_logos_columns" DEFAULT '4',
  	"background" "enum_pages_blocks_logos_background" DEFAULT 'white',
  	"grayscale" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_team_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Kenali Bidan yang Akan Mendampingi Bunda',
  	"subheading" varchar,
  	"columns" "enum_pages_blocks_team_columns" DEFAULT '3',
  	"background" "enum_pages_blocks_team_background" DEFAULT 'white',
  	"show_str" boolean DEFAULT true,
  	"cta_text" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "pages_blocks_tabs_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_tabs_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"style" "enum_pages_blocks_tabs_style" DEFAULT 'pills',
  	"background" "enum_pages_blocks_tabs_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lead_form_fields" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_lead_form_fields",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_lead_form_service_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_lead_form_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_lead_form_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_lead_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Isi Data untuk Reservasi Cepat',
  	"description" varchar,
  	"submit_label" varchar DEFAULT 'Kirim & Chat via WhatsApp',
  	"consent_text" varchar DEFAULT 'Dengan mengirim formulir ini, Bunda setuju dihubungi oleh bidan Kala melalui WhatsApp terkait reservasi.',
  	"background" "enum_pages_blocks_lead_form_background" DEFAULT 'cream',
  	"note" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_blog_feed_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_blog_feed_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_blog_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Bacaan Bermanfaat untuk Bunda',
  	"description" varchar,
  	"source" "enum_pages_blocks_blog_feed_source" DEFAULT 'latest',
  	"category" "enum_pages_blocks_blog_feed_category",
  	"limit" numeric DEFAULT 3,
  	"columns" "enum_pages_blocks_blog_feed_columns" DEFAULT '3',
  	"background" "enum_pages_blocks_blog_feed_background" DEFAULT 'white',
  	"show_image" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"cta_text" varchar DEFAULT 'Baca Artikel',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_countdown_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_countdown_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_countdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Promo Berakhir Dalam',
  	"subtitle" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_text" varchar DEFAULT 'Promo telah berakhir. Hubungi kami untuk penawaran terbaru.',
  	"cta_text" varchar,
  	"background" "enum_pages_blocks_countdown_background" DEFAULT 'peach',
  	"cta_message" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_social_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_pages_blocks_social_items_platform",
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_social_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_social_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_social_variant" DEFAULT 'icons',
  	"title" varchar,
  	"share_label" varchar DEFAULT 'Bagikan halaman ini',
  	"align" "enum_pages_blocks_social_align" DEFAULT 'center',
  	"background" "enum_pages_blocks_social_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_section_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_pages_blocks_section_columns_width" DEFAULT 'full'
  );
  
  CREATE TABLE "pages_blocks_section_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_section_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"background" "enum_pages_blocks_section_background" DEFAULT 'white',
  	"padding" "enum_pages_blocks_section_padding" DEFAULT 'normal',
  	"max_width" "enum_pages_blocks_section_max_width" DEFAULT 'normal',
  	"gap" "enum_pages_blocks_section_gap" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_hero_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_pain_points_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_pain_points_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_solutions_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_solutions_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_pricing_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_comparison_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_steps_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_steps_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_testimonials_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_guarantee_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_guarantee_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_faq_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_rich_text_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_cta_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_gallery_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_midwife_spotlight_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_midwife_spotlight_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_heading_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_heading_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"text" varchar,
  	"subtitle" varchar,
  	"level" "enum__pages_v_blocks_heading_level" DEFAULT 'h2',
  	"size" "enum__pages_v_blocks_heading_size" DEFAULT 'md',
  	"align" "enum__pages_v_blocks_heading_align" DEFAULT 'center',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_image_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"link" varchar,
  	"width" "enum__pages_v_blocks_image_width" DEFAULT 'normal',
  	"align" "enum__pages_v_blocks_image_align" DEFAULT 'center',
  	"ratio" "enum__pages_v_blocks_image_ratio" DEFAULT 'auto',
  	"rounded" "enum__pages_v_blocks_image_rounded" DEFAULT 'md',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_button_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_button_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_button" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"action" "enum__pages_v_blocks_button_action" DEFAULT 'whatsapp',
  	"style" "enum__pages_v_blocks_button_style" DEFAULT 'primary',
  	"whatsapp_message" varchar,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"size" "enum__pages_v_blocks_button_size" DEFAULT 'md',
  	"align" "enum__pages_v_blocks_button_align" DEFAULT 'center',
  	"note" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_divider_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_divider_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_divider_variant" DEFAULT 'line',
  	"spacing" "enum__pages_v_blocks_divider_spacing" DEFAULT 'md',
  	"width" "enum__pages_v_blocks_divider_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_video_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"caption" varchar,
  	"ratio" "enum__pages_v_blocks_video_ratio" DEFAULT '16:9',
  	"max_width" "enum__pages_v_blocks_video_max_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_stats_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum__pages_v_blocks_stats_columns" DEFAULT '3',
  	"background" "enum__pages_v_blocks_stats_background" DEFAULT 'cream',
  	"style" "enum__pages_v_blocks_stats_style" DEFAULT 'plain',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logos_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_logos_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__pages_v_blocks_logos_columns" DEFAULT '4',
  	"background" "enum__pages_v_blocks_logos_background" DEFAULT 'white',
  	"grayscale" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_team_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Kenali Bidan yang Akan Mendampingi Bunda',
  	"subheading" varchar,
  	"columns" "enum__pages_v_blocks_team_columns" DEFAULT '3',
  	"background" "enum__pages_v_blocks_team_background" DEFAULT 'white',
  	"show_str" boolean DEFAULT true,
  	"cta_text" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tabs_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_tabs_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"style" "enum__pages_v_blocks_tabs_style" DEFAULT 'pills',
  	"background" "enum__pages_v_blocks_tabs_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lead_form_fields" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_lead_form_fields",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_lead_form_service_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lead_form_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_lead_form_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_lead_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Isi Data untuk Reservasi Cepat',
  	"description" varchar,
  	"submit_label" varchar DEFAULT 'Kirim & Chat via WhatsApp',
  	"consent_text" varchar DEFAULT 'Dengan mengirim formulir ini, Bunda setuju dihubungi oleh bidan Kala melalui WhatsApp terkait reservasi.',
  	"background" "enum__pages_v_blocks_lead_form_background" DEFAULT 'cream',
  	"note" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_blog_feed_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_blog_feed_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_blog_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Bacaan Bermanfaat untuk Bunda',
  	"description" varchar,
  	"source" "enum__pages_v_blocks_blog_feed_source" DEFAULT 'latest',
  	"category" "enum__pages_v_blocks_blog_feed_category",
  	"limit" numeric DEFAULT 3,
  	"columns" "enum__pages_v_blocks_blog_feed_columns" DEFAULT '3',
  	"background" "enum__pages_v_blocks_blog_feed_background" DEFAULT 'white',
  	"show_image" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"cta_text" varchar DEFAULT 'Baca Artikel',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_countdown_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_countdown_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_countdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Promo Berakhir Dalam',
  	"subtitle" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_text" varchar DEFAULT 'Promo telah berakhir. Hubungi kami untuk penawaran terbaru.',
  	"cta_text" varchar,
  	"background" "enum__pages_v_blocks_countdown_background" DEFAULT 'peach',
  	"cta_message" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_social_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__pages_v_blocks_social_items_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_social_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_social_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_social_variant" DEFAULT 'icons',
  	"title" varchar,
  	"share_label" varchar DEFAULT 'Bagikan halaman ini',
  	"align" "enum__pages_v_blocks_social_align" DEFAULT 'center',
  	"background" "enum__pages_v_blocks_social_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_section_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__pages_v_blocks_section_columns_width" DEFAULT 'full',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_section_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_section_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"background" "enum__pages_v_blocks_section_background" DEFAULT 'white',
  	"padding" "enum__pages_v_blocks_section_padding" DEFAULT 'normal',
  	"max_width" "enum__pages_v_blocks_section_max_width" DEFAULT 'normal',
  	"gap" "enum__pages_v_blocks_section_gap" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_hero_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_hero_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_pain_points_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_pain_points_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_solutions_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_solutions_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_pricing_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_pricing_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_comparison_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_comparison_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_steps_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_steps_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_testimonials_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_testimonials_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_guarantee_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_guarantee_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_faq_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_faq_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_rich_text_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_rich_text_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_cta_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_cta_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_gallery_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_gallery_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_midwife_spotlight_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_midwife_spotlight_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_heading_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_heading_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"text" varchar,
  	"subtitle" varchar,
  	"level" "enum_landing_pages_blocks_heading_level" DEFAULT 'h2',
  	"size" "enum_landing_pages_blocks_heading_size" DEFAULT 'md',
  	"align" "enum_landing_pages_blocks_heading_align" DEFAULT 'center',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_image_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_image_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"link" varchar,
  	"width" "enum_landing_pages_blocks_image_width" DEFAULT 'normal',
  	"align" "enum_landing_pages_blocks_image_align" DEFAULT 'center',
  	"ratio" "enum_landing_pages_blocks_image_ratio" DEFAULT 'auto',
  	"rounded" "enum_landing_pages_blocks_image_rounded" DEFAULT 'md',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_button_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_button_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_button" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"action" "enum_landing_pages_blocks_button_action" DEFAULT 'whatsapp',
  	"style" "enum_landing_pages_blocks_button_style" DEFAULT 'primary',
  	"whatsapp_message" varchar,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"size" "enum_landing_pages_blocks_button_size" DEFAULT 'md',
  	"align" "enum_landing_pages_blocks_button_align" DEFAULT 'center',
  	"note" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_divider_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_divider_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_landing_pages_blocks_divider_variant" DEFAULT 'line',
  	"spacing" "enum_landing_pages_blocks_divider_spacing" DEFAULT 'md',
  	"width" "enum_landing_pages_blocks_divider_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_video_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_video_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"caption" varchar,
  	"ratio" "enum_landing_pages_blocks_video_ratio" DEFAULT '16:9',
  	"max_width" "enum_landing_pages_blocks_video_max_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_stats_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_stats_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum_landing_pages_blocks_stats_columns" DEFAULT '3',
  	"background" "enum_landing_pages_blocks_stats_background" DEFAULT 'cream',
  	"style" "enum_landing_pages_blocks_stats_style" DEFAULT 'plain',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_logos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_logos_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_logos_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_landing_pages_blocks_logos_columns" DEFAULT '4',
  	"background" "enum_landing_pages_blocks_logos_background" DEFAULT 'white',
  	"grayscale" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_team_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_team_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Kenali Bidan yang Akan Mendampingi Bunda',
  	"subheading" varchar,
  	"columns" "enum_landing_pages_blocks_team_columns" DEFAULT '3',
  	"background" "enum_landing_pages_blocks_team_background" DEFAULT 'white',
  	"show_str" boolean DEFAULT true,
  	"cta_text" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "landing_pages_blocks_tabs_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_tabs_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"style" "enum_landing_pages_blocks_tabs_style" DEFAULT 'pills',
  	"background" "enum_landing_pages_blocks_tabs_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_lead_form_fields" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_lead_form_fields",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_lead_form_service_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_lead_form_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_lead_form_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_lead_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Isi Data untuk Reservasi Cepat',
  	"description" varchar,
  	"submit_label" varchar DEFAULT 'Kirim & Chat via WhatsApp',
  	"consent_text" varchar DEFAULT 'Dengan mengirim formulir ini, Bunda setuju dihubungi oleh bidan Kala melalui WhatsApp terkait reservasi.',
  	"background" "enum_landing_pages_blocks_lead_form_background" DEFAULT 'cream',
  	"note" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_blog_feed_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_blog_feed_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_blog_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Bacaan Bermanfaat untuk Bunda',
  	"description" varchar,
  	"source" "enum_landing_pages_blocks_blog_feed_source" DEFAULT 'latest',
  	"category" "enum_landing_pages_blocks_blog_feed_category",
  	"limit" numeric DEFAULT 3,
  	"columns" "enum_landing_pages_blocks_blog_feed_columns" DEFAULT '3',
  	"background" "enum_landing_pages_blocks_blog_feed_background" DEFAULT 'white',
  	"show_image" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"cta_text" varchar DEFAULT 'Baca Artikel',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_countdown_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_countdown_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_countdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Promo Berakhir Dalam',
  	"subtitle" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_text" varchar DEFAULT 'Promo telah berakhir. Hubungi kami untuk penawaran terbaru.',
  	"cta_text" varchar,
  	"background" "enum_landing_pages_blocks_countdown_background" DEFAULT 'peach',
  	"cta_message" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_social_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_landing_pages_blocks_social_items_platform",
  	"url" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_social_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_social_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_landing_pages_blocks_social_variant" DEFAULT 'icons',
  	"title" varchar,
  	"share_label" varchar DEFAULT 'Bagikan halaman ini',
  	"align" "enum_landing_pages_blocks_social_align" DEFAULT 'center',
  	"background" "enum_landing_pages_blocks_social_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_section_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_landing_pages_blocks_section_columns_width" DEFAULT 'full'
  );
  
  CREATE TABLE "landing_pages_blocks_section_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_landing_pages_blocks_section_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"background" "enum_landing_pages_blocks_section_background" DEFAULT 'white',
  	"padding" "enum_landing_pages_blocks_section_padding" DEFAULT 'normal',
  	"max_width" "enum_landing_pages_blocks_section_max_width" DEFAULT 'normal',
  	"gap" "enum_landing_pages_blocks_section_gap" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_hero_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_hero_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_pain_points_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_pain_points_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_solutions_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_solutions_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_pricing_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_pricing_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_comparison_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_comparison_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_steps_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_steps_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_testimonials_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_testimonials_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_guarantee_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_guarantee_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_faq_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_faq_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_rich_text_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_rich_text_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_cta_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_cta_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_gallery_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_gallery_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_midwife_spotlight_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_midwife_spotlight_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_heading_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_heading_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"text" varchar,
  	"subtitle" varchar,
  	"level" "enum__landing_pages_v_blocks_heading_level" DEFAULT 'h2',
  	"size" "enum__landing_pages_v_blocks_heading_size" DEFAULT 'md',
  	"align" "enum__landing_pages_v_blocks_heading_align" DEFAULT 'center',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_image_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_image_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"link" varchar,
  	"width" "enum__landing_pages_v_blocks_image_width" DEFAULT 'normal',
  	"align" "enum__landing_pages_v_blocks_image_align" DEFAULT 'center',
  	"ratio" "enum__landing_pages_v_blocks_image_ratio" DEFAULT 'auto',
  	"rounded" "enum__landing_pages_v_blocks_image_rounded" DEFAULT 'md',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_button_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_button_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_button" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"action" "enum__landing_pages_v_blocks_button_action" DEFAULT 'whatsapp',
  	"style" "enum__landing_pages_v_blocks_button_style" DEFAULT 'primary',
  	"whatsapp_message" varchar,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"size" "enum__landing_pages_v_blocks_button_size" DEFAULT 'md',
  	"align" "enum__landing_pages_v_blocks_button_align" DEFAULT 'center',
  	"note" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_divider_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_divider_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__landing_pages_v_blocks_divider_variant" DEFAULT 'line',
  	"spacing" "enum__landing_pages_v_blocks_divider_spacing" DEFAULT 'md',
  	"width" "enum__landing_pages_v_blocks_divider_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_video_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_video_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"caption" varchar,
  	"ratio" "enum__landing_pages_v_blocks_video_ratio" DEFAULT '16:9',
  	"max_width" "enum__landing_pages_v_blocks_video_max_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_stats_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_stats_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum__landing_pages_v_blocks_stats_columns" DEFAULT '3',
  	"background" "enum__landing_pages_v_blocks_stats_background" DEFAULT 'cream',
  	"style" "enum__landing_pages_v_blocks_stats_style" DEFAULT 'plain',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_logos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_logos_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_logos_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__landing_pages_v_blocks_logos_columns" DEFAULT '4',
  	"background" "enum__landing_pages_v_blocks_logos_background" DEFAULT 'white',
  	"grayscale" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_team_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_team_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Kenali Bidan yang Akan Mendampingi Bunda',
  	"subheading" varchar,
  	"columns" "enum__landing_pages_v_blocks_team_columns" DEFAULT '3',
  	"background" "enum__landing_pages_v_blocks_team_background" DEFAULT 'white',
  	"show_str" boolean DEFAULT true,
  	"cta_text" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_tabs_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_tabs_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"style" "enum__landing_pages_v_blocks_tabs_style" DEFAULT 'pills',
  	"background" "enum__landing_pages_v_blocks_tabs_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_lead_form_fields" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_lead_form_fields",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_lead_form_service_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_lead_form_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_lead_form_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_lead_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Isi Data untuk Reservasi Cepat',
  	"description" varchar,
  	"submit_label" varchar DEFAULT 'Kirim & Chat via WhatsApp',
  	"consent_text" varchar DEFAULT 'Dengan mengirim formulir ini, Bunda setuju dihubungi oleh bidan Kala melalui WhatsApp terkait reservasi.',
  	"background" "enum__landing_pages_v_blocks_lead_form_background" DEFAULT 'cream',
  	"note" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_blog_feed_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_blog_feed_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_blog_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Bacaan Bermanfaat untuk Bunda',
  	"description" varchar,
  	"source" "enum__landing_pages_v_blocks_blog_feed_source" DEFAULT 'latest',
  	"category" "enum__landing_pages_v_blocks_blog_feed_category",
  	"limit" numeric DEFAULT 3,
  	"columns" "enum__landing_pages_v_blocks_blog_feed_columns" DEFAULT '3',
  	"background" "enum__landing_pages_v_blocks_blog_feed_background" DEFAULT 'white',
  	"show_image" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"cta_text" varchar DEFAULT 'Baca Artikel',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_countdown_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_countdown_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_countdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Promo Berakhir Dalam',
  	"subtitle" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_text" varchar DEFAULT 'Promo telah berakhir. Hubungi kami untuk penawaran terbaru.',
  	"cta_text" varchar,
  	"background" "enum__landing_pages_v_blocks_countdown_background" DEFAULT 'peach',
  	"cta_message" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_social_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__landing_pages_v_blocks_social_items_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_social_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_social_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__landing_pages_v_blocks_social_variant" DEFAULT 'icons',
  	"title" varchar,
  	"share_label" varchar DEFAULT 'Bagikan halaman ini',
  	"align" "enum__landing_pages_v_blocks_social_align" DEFAULT 'center',
  	"background" "enum__landing_pages_v_blocks_social_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_section_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__landing_pages_v_blocks_section_columns_width" DEFAULT 'full',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v_blocks_section_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__landing_pages_v_blocks_section_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"background" "enum__landing_pages_v_blocks_section_background" DEFAULT 'white',
  	"padding" "enum__landing_pages_v_blocks_section_padding" DEFAULT 'normal',
  	"max_width" "enum__landing_pages_v_blocks_section_max_width" DEFAULT 'normal',
  	"gap" "enum__landing_pages_v_blocks_section_gap" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_hero_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_hero_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_pain_points_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_pain_points_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_solutions_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_solutions_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_pricing_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_pricing_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_comparison_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_comparison_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_steps_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_steps_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_testimonials_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_testimonials_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_guarantee_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_guarantee_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_faq_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_faq_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_rich_text_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_rich_text_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_cta_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_cta_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_gallery_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_gallery_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_midwife_spotlight_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_midwife_spotlight_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_heading_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_heading_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"text" varchar NOT NULL,
  	"subtitle" varchar,
  	"level" "enum_page_templates_blocks_heading_level" DEFAULT 'h2',
  	"size" "enum_page_templates_blocks_heading_size" DEFAULT 'md',
  	"align" "enum_page_templates_blocks_heading_align" DEFAULT 'center',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_image_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_image_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"link" varchar,
  	"width" "enum_page_templates_blocks_image_width" DEFAULT 'normal',
  	"align" "enum_page_templates_blocks_image_align" DEFAULT 'center',
  	"ratio" "enum_page_templates_blocks_image_ratio" DEFAULT 'auto',
  	"rounded" "enum_page_templates_blocks_image_rounded" DEFAULT 'md',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_button_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_button_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_button" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp' NOT NULL,
  	"action" "enum_page_templates_blocks_button_action" DEFAULT 'whatsapp',
  	"style" "enum_page_templates_blocks_button_style" DEFAULT 'primary',
  	"whatsapp_message" varchar,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"size" "enum_page_templates_blocks_button_size" DEFAULT 'md',
  	"align" "enum_page_templates_blocks_button_align" DEFAULT 'center',
  	"note" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_divider_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_divider_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_page_templates_blocks_divider_variant" DEFAULT 'line',
  	"spacing" "enum_page_templates_blocks_divider_spacing" DEFAULT 'md',
  	"width" "enum_page_templates_blocks_divider_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_video_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_video_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"title" varchar,
  	"caption" varchar,
  	"ratio" "enum_page_templates_blocks_video_ratio" DEFAULT '16:9',
  	"max_width" "enum_page_templates_blocks_video_max_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "page_templates_blocks_stats_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_stats_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum_page_templates_blocks_stats_columns" DEFAULT '3',
  	"background" "enum_page_templates_blocks_stats_background" DEFAULT 'cream',
  	"style" "enum_page_templates_blocks_stats_style" DEFAULT 'plain',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_logos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_logos_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_logos_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_page_templates_blocks_logos_columns" DEFAULT '4',
  	"background" "enum_page_templates_blocks_logos_background" DEFAULT 'white',
  	"grayscale" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_team_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_team_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Kenali Bidan yang Akan Mendampingi Bunda' NOT NULL,
  	"subheading" varchar,
  	"columns" "enum_page_templates_blocks_team_columns" DEFAULT '3',
  	"background" "enum_page_templates_blocks_team_background" DEFAULT 'white',
  	"show_str" boolean DEFAULT true,
  	"cta_text" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"content" jsonb NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_tabs_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_tabs_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"style" "enum_page_templates_blocks_tabs_style" DEFAULT 'pills',
  	"background" "enum_page_templates_blocks_tabs_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_lead_form_fields" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_lead_form_fields",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_lead_form_service_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_lead_form_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_lead_form_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_lead_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Isi Data untuk Reservasi Cepat' NOT NULL,
  	"description" varchar,
  	"submit_label" varchar DEFAULT 'Kirim & Chat via WhatsApp',
  	"consent_text" varchar DEFAULT 'Dengan mengirim formulir ini, Bunda setuju dihubungi oleh bidan Kala melalui WhatsApp terkait reservasi.',
  	"background" "enum_page_templates_blocks_lead_form_background" DEFAULT 'cream',
  	"note" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_blog_feed_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_blog_feed_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_blog_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Bacaan Bermanfaat untuk Bunda',
  	"description" varchar,
  	"source" "enum_page_templates_blocks_blog_feed_source" DEFAULT 'latest',
  	"category" "enum_page_templates_blocks_blog_feed_category",
  	"limit" numeric DEFAULT 3,
  	"columns" "enum_page_templates_blocks_blog_feed_columns" DEFAULT '3',
  	"background" "enum_page_templates_blocks_blog_feed_background" DEFAULT 'white',
  	"show_image" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"cta_text" varchar DEFAULT 'Baca Artikel',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_countdown_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_countdown_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_countdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Promo Berakhir Dalam' NOT NULL,
  	"subtitle" varchar,
  	"target_date" timestamp(3) with time zone NOT NULL,
  	"expired_text" varchar DEFAULT 'Promo telah berakhir. Hubungi kami untuk penawaran terbaru.',
  	"cta_text" varchar,
  	"background" "enum_page_templates_blocks_countdown_background" DEFAULT 'peach',
  	"cta_message" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_social_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_page_templates_blocks_social_items_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_social_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_social_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_page_templates_blocks_social_variant" DEFAULT 'icons' NOT NULL,
  	"title" varchar,
  	"share_label" varchar DEFAULT 'Bagikan halaman ini',
  	"align" "enum_page_templates_blocks_social_align" DEFAULT 'center',
  	"background" "enum_page_templates_blocks_social_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_templates_blocks_section_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_page_templates_blocks_section_columns_width" DEFAULT 'full'
  );
  
  CREATE TABLE "page_templates_blocks_section_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_page_templates_blocks_section_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_templates_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"background" "enum_page_templates_blocks_section_background" DEFAULT 'white',
  	"padding" "enum_page_templates_blocks_section_padding" DEFAULT 'normal',
  	"max_width" "enum_page_templates_blocks_section_max_width" DEFAULT 'normal',
  	"gap" "enum_page_templates_blocks_section_gap" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_hero_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_hero_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_pain_points_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_pain_points_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_solutions_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_solutions_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_pricing_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_pricing_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_comparison_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_comparison_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_steps_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_steps_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_testimonials_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_testimonials_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_guarantee_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_guarantee_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_faq_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_faq_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_rich_text_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_rich_text_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_cta_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_cta_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_gallery_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_gallery_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_midwife_spotlight_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_midwife_spotlight_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_heading_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_heading_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"text" varchar,
  	"subtitle" varchar,
  	"level" "enum_block_templates_blocks_heading_level" DEFAULT 'h2',
  	"size" "enum_block_templates_blocks_heading_size" DEFAULT 'md',
  	"align" "enum_block_templates_blocks_heading_align" DEFAULT 'center',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_image_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_image_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"link" varchar,
  	"width" "enum_block_templates_blocks_image_width" DEFAULT 'normal',
  	"align" "enum_block_templates_blocks_image_align" DEFAULT 'center',
  	"ratio" "enum_block_templates_blocks_image_ratio" DEFAULT 'auto',
  	"rounded" "enum_block_templates_blocks_image_rounded" DEFAULT 'md',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_button_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_button_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_button" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"action" "enum_block_templates_blocks_button_action" DEFAULT 'whatsapp',
  	"style" "enum_block_templates_blocks_button_style" DEFAULT 'primary',
  	"whatsapp_message" varchar,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"size" "enum_block_templates_blocks_button_size" DEFAULT 'md',
  	"align" "enum_block_templates_blocks_button_align" DEFAULT 'center',
  	"note" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_divider_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_divider_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_block_templates_blocks_divider_variant" DEFAULT 'line',
  	"spacing" "enum_block_templates_blocks_divider_spacing" DEFAULT 'md',
  	"width" "enum_block_templates_blocks_divider_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_video_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_video_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"caption" varchar,
  	"ratio" "enum_block_templates_blocks_video_ratio" DEFAULT '16:9',
  	"max_width" "enum_block_templates_blocks_video_max_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "block_templates_blocks_stats_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_stats_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum_block_templates_blocks_stats_columns" DEFAULT '3',
  	"background" "enum_block_templates_blocks_stats_background" DEFAULT 'cream',
  	"style" "enum_block_templates_blocks_stats_style" DEFAULT 'plain',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_logos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_logos_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_logos_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_block_templates_blocks_logos_columns" DEFAULT '4',
  	"background" "enum_block_templates_blocks_logos_background" DEFAULT 'white',
  	"grayscale" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_team_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_team_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Kenali Bidan yang Akan Mendampingi Bunda',
  	"subheading" varchar,
  	"columns" "enum_block_templates_blocks_team_columns" DEFAULT '3',
  	"background" "enum_block_templates_blocks_team_background" DEFAULT 'white',
  	"show_str" boolean DEFAULT true,
  	"cta_text" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "block_templates_blocks_tabs_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_tabs_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"style" "enum_block_templates_blocks_tabs_style" DEFAULT 'pills',
  	"background" "enum_block_templates_blocks_tabs_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_lead_form_fields" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_lead_form_fields",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_lead_form_service_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "block_templates_blocks_lead_form_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_lead_form_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_lead_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Isi Data untuk Reservasi Cepat',
  	"description" varchar,
  	"submit_label" varchar DEFAULT 'Kirim & Chat via WhatsApp',
  	"consent_text" varchar DEFAULT 'Dengan mengirim formulir ini, Bunda setuju dihubungi oleh bidan Kala melalui WhatsApp terkait reservasi.',
  	"background" "enum_block_templates_blocks_lead_form_background" DEFAULT 'cream',
  	"note" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_blog_feed_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_blog_feed_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_blog_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Bacaan Bermanfaat untuk Bunda',
  	"description" varchar,
  	"source" "enum_block_templates_blocks_blog_feed_source" DEFAULT 'latest',
  	"category" "enum_block_templates_blocks_blog_feed_category",
  	"limit" numeric DEFAULT 3,
  	"columns" "enum_block_templates_blocks_blog_feed_columns" DEFAULT '3',
  	"background" "enum_block_templates_blocks_blog_feed_background" DEFAULT 'white',
  	"show_image" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"cta_text" varchar DEFAULT 'Baca Artikel',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_countdown_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_countdown_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_countdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Promo Berakhir Dalam',
  	"subtitle" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_text" varchar DEFAULT 'Promo telah berakhir. Hubungi kami untuk penawaran terbaru.',
  	"cta_text" varchar,
  	"background" "enum_block_templates_blocks_countdown_background" DEFAULT 'peach',
  	"cta_message" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_social_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_block_templates_blocks_social_items_platform",
  	"url" varchar
  );
  
  CREATE TABLE "block_templates_blocks_social_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_social_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_block_templates_blocks_social_variant" DEFAULT 'icons',
  	"title" varchar,
  	"share_label" varchar DEFAULT 'Bagikan halaman ini',
  	"align" "enum_block_templates_blocks_social_align" DEFAULT 'center',
  	"background" "enum_block_templates_blocks_social_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "block_templates_blocks_section_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_block_templates_blocks_section_columns_width" DEFAULT 'full'
  );
  
  CREATE TABLE "block_templates_blocks_section_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_block_templates_blocks_section_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "block_templates_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"background" "enum_block_templates_blocks_section_background" DEFAULT 'white',
  	"padding" "enum_block_templates_blocks_section_padding" DEFAULT 'normal',
  	"max_width" "enum_block_templates_blocks_section_max_width" DEFAULT 'normal',
  	"gap" "enum_block_templates_blocks_section_gap" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_hero_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_hero_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_pain_points_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_pain_points_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_solutions_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_solutions_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_pricing_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_pricing_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_comparison_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_comparison_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_steps_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_steps_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_testimonials_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_testimonials_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_guarantee_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_guarantee_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_faq_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_faq_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_rich_text_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_rich_text_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_cta_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_cta_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_gallery_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_gallery_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_midwife_spotlight_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_midwife_spotlight_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_heading_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_heading_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"text" varchar,
  	"subtitle" varchar,
  	"level" "enum__block_templates_v_blocks_heading_level" DEFAULT 'h2',
  	"size" "enum__block_templates_v_blocks_heading_size" DEFAULT 'md',
  	"align" "enum__block_templates_v_blocks_heading_align" DEFAULT 'center',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_image_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_image_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"link" varchar,
  	"width" "enum__block_templates_v_blocks_image_width" DEFAULT 'normal',
  	"align" "enum__block_templates_v_blocks_image_align" DEFAULT 'center',
  	"ratio" "enum__block_templates_v_blocks_image_ratio" DEFAULT 'auto',
  	"rounded" "enum__block_templates_v_blocks_image_rounded" DEFAULT 'md',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_button_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_button_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_button" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar DEFAULT 'Konsultasi Gratis via WhatsApp',
  	"action" "enum__block_templates_v_blocks_button_action" DEFAULT 'whatsapp',
  	"style" "enum__block_templates_v_blocks_button_style" DEFAULT 'primary',
  	"whatsapp_message" varchar,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"size" "enum__block_templates_v_blocks_button_size" DEFAULT 'md',
  	"align" "enum__block_templates_v_blocks_button_align" DEFAULT 'center',
  	"note" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_divider_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_divider_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__block_templates_v_blocks_divider_variant" DEFAULT 'line',
  	"spacing" "enum__block_templates_v_blocks_divider_spacing" DEFAULT 'md',
  	"width" "enum__block_templates_v_blocks_divider_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_video_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_video_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"caption" varchar,
  	"ratio" "enum__block_templates_v_blocks_video_ratio" DEFAULT '16:9',
  	"max_width" "enum__block_templates_v_blocks_video_max_width" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_stats_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_stats_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum__block_templates_v_blocks_stats_columns" DEFAULT '3',
  	"background" "enum__block_templates_v_blocks_stats_background" DEFAULT 'cream',
  	"style" "enum__block_templates_v_blocks_stats_style" DEFAULT 'plain',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_logos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_url_fallback" varchar,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_logos_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_logos_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__block_templates_v_blocks_logos_columns" DEFAULT '4',
  	"background" "enum__block_templates_v_blocks_logos_background" DEFAULT 'white',
  	"grayscale" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_team_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_team_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Kenali Bidan yang Akan Mendampingi Bunda',
  	"subheading" varchar,
  	"columns" "enum__block_templates_v_blocks_team_columns" DEFAULT '3',
  	"background" "enum__block_templates_v_blocks_team_background" DEFAULT 'white',
  	"show_str" boolean DEFAULT true,
  	"cta_text" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_tabs_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_tabs_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"style" "enum__block_templates_v_blocks_tabs_style" DEFAULT 'pills',
  	"background" "enum__block_templates_v_blocks_tabs_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_lead_form_fields" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_lead_form_fields",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_lead_form_service_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_lead_form_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_lead_form_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_lead_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Isi Data untuk Reservasi Cepat',
  	"description" varchar,
  	"submit_label" varchar DEFAULT 'Kirim & Chat via WhatsApp',
  	"consent_text" varchar DEFAULT 'Dengan mengirim formulir ini, Bunda setuju dihubungi oleh bidan Kala melalui WhatsApp terkait reservasi.',
  	"background" "enum__block_templates_v_blocks_lead_form_background" DEFAULT 'cream',
  	"note" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_blog_feed_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_blog_feed_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_blog_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Bacaan Bermanfaat untuk Bunda',
  	"description" varchar,
  	"source" "enum__block_templates_v_blocks_blog_feed_source" DEFAULT 'latest',
  	"category" "enum__block_templates_v_blocks_blog_feed_category",
  	"limit" numeric DEFAULT 3,
  	"columns" "enum__block_templates_v_blocks_blog_feed_columns" DEFAULT '3',
  	"background" "enum__block_templates_v_blocks_blog_feed_background" DEFAULT 'white',
  	"show_image" boolean DEFAULT true,
  	"show_excerpt" boolean DEFAULT true,
  	"cta_text" varchar DEFAULT 'Baca Artikel',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_countdown_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_countdown_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_countdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Promo Berakhir Dalam',
  	"subtitle" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_text" varchar DEFAULT 'Promo telah berakhir. Hubungi kami untuk penawaran terbaru.',
  	"cta_text" varchar,
  	"background" "enum__block_templates_v_blocks_countdown_background" DEFAULT 'peach',
  	"cta_message" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_social_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__block_templates_v_blocks_social_items_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_social_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_social_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__block_templates_v_blocks_social_variant" DEFAULT 'icons',
  	"title" varchar,
  	"share_label" varchar DEFAULT 'Bagikan halaman ini',
  	"align" "enum__block_templates_v_blocks_social_align" DEFAULT 'center',
  	"background" "enum__block_templates_v_blocks_social_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_section_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__block_templates_v_blocks_section_columns_width" DEFAULT 'full',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_block_templates_v_blocks_section_visibility" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__block_templates_v_blocks_section_visibility",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_block_templates_v_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"background" "enum__block_templates_v_blocks_section_background" DEFAULT 'white',
  	"padding" "enum__block_templates_v_blocks_section_padding" DEFAULT 'normal',
  	"max_width" "enum__block_templates_v_blocks_section_max_width" DEFAULT 'normal',
  	"gap" "enum__block_templates_v_blocks_section_gap" DEFAULT 'normal',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_pain_points" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_solutions" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_pricing" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_comparison" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_steps" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_testimonials" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_guarantee" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_midwife_spotlight" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages" ADD COLUMN "editor_mode" "enum_pages_editor_mode" DEFAULT 'builder';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_pain_points" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_solutions" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_pricing" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_comparison" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_steps" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_guarantee" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_midwife_spotlight" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_editor_mode" "enum__pages_v_version_editor_mode" DEFAULT 'builder';
  ALTER TABLE "landing_pages_blocks_hero" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_pain_points" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_solutions" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_pricing" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_comparison" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_steps" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_testimonials" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_guarantee" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_faq" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_rich_text" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_cta" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_gallery" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_midwife_spotlight" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages" ADD COLUMN "editor_mode" "enum_landing_pages_editor_mode" DEFAULT 'builder';
  ALTER TABLE "_landing_pages_v_blocks_hero" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v_blocks_pain_points" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v_blocks_solutions" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v_blocks_pricing" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v_blocks_comparison" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v_blocks_steps" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v_blocks_testimonials" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v_blocks_guarantee" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v_blocks_faq" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v_blocks_rich_text" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v_blocks_cta" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v_blocks_gallery" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v_blocks_midwife_spotlight" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_landing_pages_v" ADD COLUMN "version_editor_mode" "enum__landing_pages_v_version_editor_mode" DEFAULT 'builder';
  ALTER TABLE "page_templates_blocks_hero" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "page_templates_blocks_pain_points" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "page_templates_blocks_solutions" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "page_templates_blocks_pricing" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "page_templates_blocks_comparison" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "page_templates_blocks_steps" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "page_templates_blocks_testimonials" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "page_templates_blocks_guarantee" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "page_templates_blocks_faq" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "page_templates_blocks_rich_text" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "page_templates_blocks_cta" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "page_templates_blocks_gallery" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "page_templates_blocks_midwife_spotlight" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_hero" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_pain_points" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_solutions" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_pricing" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_comparison" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_steps" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_testimonials" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_guarantee" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_faq" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_rich_text" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_cta" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_gallery" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "block_templates_blocks_midwife_spotlight" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_hero" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_pain_points" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_solutions" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_pricing" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_comparison" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_steps" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_testimonials" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_guarantee" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_faq" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_rich_text" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_cta" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_gallery" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_block_templates_v_blocks_midwife_spotlight" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_hero_visibility" ADD CONSTRAINT "pages_blocks_hero_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pain_points_visibility" ADD CONSTRAINT "pages_blocks_pain_points_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solutions_visibility" ADD CONSTRAINT "pages_blocks_solutions_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_visibility" ADD CONSTRAINT "pages_blocks_pricing_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_visibility" ADD CONSTRAINT "pages_blocks_comparison_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_visibility" ADD CONSTRAINT "pages_blocks_steps_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_visibility" ADD CONSTRAINT "pages_blocks_testimonials_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_guarantee_visibility" ADD CONSTRAINT "pages_blocks_guarantee_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_guarantee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_visibility" ADD CONSTRAINT "pages_blocks_faq_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_visibility" ADD CONSTRAINT "pages_blocks_rich_text_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_visibility" ADD CONSTRAINT "pages_blocks_cta_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_visibility" ADD CONSTRAINT "pages_blocks_gallery_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_midwife_spotlight_visibility" ADD CONSTRAINT "pages_blocks_midwife_spotlight_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_midwife_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_heading_visibility" ADD CONSTRAINT "pages_blocks_heading_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_heading" ADD CONSTRAINT "pages_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_visibility" ADD CONSTRAINT "pages_blocks_image_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_button_visibility" ADD CONSTRAINT "pages_blocks_button_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_button" ADD CONSTRAINT "pages_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_divider_visibility" ADD CONSTRAINT "pages_blocks_divider_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_divider" ADD CONSTRAINT "pages_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_visibility" ADD CONSTRAINT "pages_blocks_video_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_visibility" ADD CONSTRAINT "pages_blocks_stats_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos_items" ADD CONSTRAINT "pages_blocks_logos_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos_items" ADD CONSTRAINT "pages_blocks_logos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos_visibility" ADD CONSTRAINT "pages_blocks_logos_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos" ADD CONSTRAINT "pages_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_visibility" ADD CONSTRAINT "pages_blocks_team_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team" ADD CONSTRAINT "pages_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs_tabs" ADD CONSTRAINT "pages_blocks_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs_visibility" ADD CONSTRAINT "pages_blocks_tabs_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tabs" ADD CONSTRAINT "pages_blocks_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lead_form_fields" ADD CONSTRAINT "pages_blocks_lead_form_fields_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lead_form_service_options" ADD CONSTRAINT "pages_blocks_lead_form_service_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lead_form_visibility" ADD CONSTRAINT "pages_blocks_lead_form_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lead_form" ADD CONSTRAINT "pages_blocks_lead_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog_feed_visibility" ADD CONSTRAINT "pages_blocks_blog_feed_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_blog_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog_feed" ADD CONSTRAINT "pages_blocks_blog_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_countdown_visibility" ADD CONSTRAINT "pages_blocks_countdown_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_countdown"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_countdown" ADD CONSTRAINT "pages_blocks_countdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_items" ADD CONSTRAINT "pages_blocks_social_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_visibility" ADD CONSTRAINT "pages_blocks_social_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social" ADD CONSTRAINT "pages_blocks_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_section_columns" ADD CONSTRAINT "pages_blocks_section_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_section_visibility" ADD CONSTRAINT "pages_blocks_section_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_section" ADD CONSTRAINT "pages_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_visibility" ADD CONSTRAINT "_pages_v_blocks_hero_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pain_points_visibility" ADD CONSTRAINT "_pages_v_blocks_pain_points_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solutions_visibility" ADD CONSTRAINT "_pages_v_blocks_solutions_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_visibility" ADD CONSTRAINT "_pages_v_blocks_pricing_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_visibility" ADD CONSTRAINT "_pages_v_blocks_comparison_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_visibility" ADD CONSTRAINT "_pages_v_blocks_steps_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_visibility" ADD CONSTRAINT "_pages_v_blocks_testimonials_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_guarantee_visibility" ADD CONSTRAINT "_pages_v_blocks_guarantee_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_guarantee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_visibility" ADD CONSTRAINT "_pages_v_blocks_faq_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_visibility" ADD CONSTRAINT "_pages_v_blocks_rich_text_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_visibility" ADD CONSTRAINT "_pages_v_blocks_cta_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_visibility" ADD CONSTRAINT "_pages_v_blocks_gallery_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_midwife_spotlight_visibility" ADD CONSTRAINT "_pages_v_blocks_midwife_spotlight_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_midwife_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_heading_visibility" ADD CONSTRAINT "_pages_v_blocks_heading_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_heading" ADD CONSTRAINT "_pages_v_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_visibility" ADD CONSTRAINT "_pages_v_blocks_image_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_button_visibility" ADD CONSTRAINT "_pages_v_blocks_button_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_button" ADD CONSTRAINT "_pages_v_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_divider_visibility" ADD CONSTRAINT "_pages_v_blocks_divider_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_divider" ADD CONSTRAINT "_pages_v_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_visibility" ADD CONSTRAINT "_pages_v_blocks_video_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_visibility" ADD CONSTRAINT "_pages_v_blocks_stats_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos_items" ADD CONSTRAINT "_pages_v_blocks_logos_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos_items" ADD CONSTRAINT "_pages_v_blocks_logos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos_visibility" ADD CONSTRAINT "_pages_v_blocks_logos_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos" ADD CONSTRAINT "_pages_v_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_visibility" ADD CONSTRAINT "_pages_v_blocks_team_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team" ADD CONSTRAINT "_pages_v_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs_tabs" ADD CONSTRAINT "_pages_v_blocks_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs_visibility" ADD CONSTRAINT "_pages_v_blocks_tabs_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tabs" ADD CONSTRAINT "_pages_v_blocks_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lead_form_fields" ADD CONSTRAINT "_pages_v_blocks_lead_form_fields_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lead_form_service_options" ADD CONSTRAINT "_pages_v_blocks_lead_form_service_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lead_form_visibility" ADD CONSTRAINT "_pages_v_blocks_lead_form_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lead_form" ADD CONSTRAINT "_pages_v_blocks_lead_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_blog_feed_visibility" ADD CONSTRAINT "_pages_v_blocks_blog_feed_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_blog_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_blog_feed" ADD CONSTRAINT "_pages_v_blocks_blog_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_countdown_visibility" ADD CONSTRAINT "_pages_v_blocks_countdown_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_countdown"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_countdown" ADD CONSTRAINT "_pages_v_blocks_countdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social_items" ADD CONSTRAINT "_pages_v_blocks_social_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social_visibility" ADD CONSTRAINT "_pages_v_blocks_social_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social" ADD CONSTRAINT "_pages_v_blocks_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section_columns" ADD CONSTRAINT "_pages_v_blocks_section_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section_visibility" ADD CONSTRAINT "_pages_v_blocks_section_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section" ADD CONSTRAINT "_pages_v_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_hero_visibility" ADD CONSTRAINT "landing_pages_blocks_hero_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_pain_points_visibility" ADD CONSTRAINT "landing_pages_blocks_pain_points_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_solutions_visibility" ADD CONSTRAINT "landing_pages_blocks_solutions_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_pricing_visibility" ADD CONSTRAINT "landing_pages_blocks_pricing_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_comparison_visibility" ADD CONSTRAINT "landing_pages_blocks_comparison_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_steps_visibility" ADD CONSTRAINT "landing_pages_blocks_steps_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_testimonials_visibility" ADD CONSTRAINT "landing_pages_blocks_testimonials_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_guarantee_visibility" ADD CONSTRAINT "landing_pages_blocks_guarantee_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_guarantee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_faq_visibility" ADD CONSTRAINT "landing_pages_blocks_faq_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_rich_text_visibility" ADD CONSTRAINT "landing_pages_blocks_rich_text_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_cta_visibility" ADD CONSTRAINT "landing_pages_blocks_cta_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_gallery_visibility" ADD CONSTRAINT "landing_pages_blocks_gallery_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_midwife_spotlight_visibility" ADD CONSTRAINT "landing_pages_blocks_midwife_spotlight_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_midwife_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_heading_visibility" ADD CONSTRAINT "landing_pages_blocks_heading_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_heading" ADD CONSTRAINT "landing_pages_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_image_visibility" ADD CONSTRAINT "landing_pages_blocks_image_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_image" ADD CONSTRAINT "landing_pages_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_image" ADD CONSTRAINT "landing_pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_button_visibility" ADD CONSTRAINT "landing_pages_blocks_button_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_button" ADD CONSTRAINT "landing_pages_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_divider_visibility" ADD CONSTRAINT "landing_pages_blocks_divider_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_divider" ADD CONSTRAINT "landing_pages_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_video_visibility" ADD CONSTRAINT "landing_pages_blocks_video_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_video" ADD CONSTRAINT "landing_pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_stats_items" ADD CONSTRAINT "landing_pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_stats_visibility" ADD CONSTRAINT "landing_pages_blocks_stats_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_stats" ADD CONSTRAINT "landing_pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_logos_items" ADD CONSTRAINT "landing_pages_blocks_logos_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_logos_items" ADD CONSTRAINT "landing_pages_blocks_logos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_logos_visibility" ADD CONSTRAINT "landing_pages_blocks_logos_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_logos" ADD CONSTRAINT "landing_pages_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_team_visibility" ADD CONSTRAINT "landing_pages_blocks_team_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_team" ADD CONSTRAINT "landing_pages_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_tabs_tabs" ADD CONSTRAINT "landing_pages_blocks_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_tabs_visibility" ADD CONSTRAINT "landing_pages_blocks_tabs_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_tabs" ADD CONSTRAINT "landing_pages_blocks_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_lead_form_fields" ADD CONSTRAINT "landing_pages_blocks_lead_form_fields_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_lead_form_service_options" ADD CONSTRAINT "landing_pages_blocks_lead_form_service_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_lead_form_visibility" ADD CONSTRAINT "landing_pages_blocks_lead_form_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_lead_form" ADD CONSTRAINT "landing_pages_blocks_lead_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_blog_feed_visibility" ADD CONSTRAINT "landing_pages_blocks_blog_feed_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_blog_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_blog_feed" ADD CONSTRAINT "landing_pages_blocks_blog_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_countdown_visibility" ADD CONSTRAINT "landing_pages_blocks_countdown_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_countdown"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_countdown" ADD CONSTRAINT "landing_pages_blocks_countdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_social_items" ADD CONSTRAINT "landing_pages_blocks_social_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_social_visibility" ADD CONSTRAINT "landing_pages_blocks_social_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_social" ADD CONSTRAINT "landing_pages_blocks_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_section_columns" ADD CONSTRAINT "landing_pages_blocks_section_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_section_visibility" ADD CONSTRAINT "landing_pages_blocks_section_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_section" ADD CONSTRAINT "landing_pages_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_hero_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_hero_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_pain_points_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_pain_points_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_solutions_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_solutions_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_pricing_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_pricing_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_comparison_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_comparison_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_steps_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_steps_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_testimonials_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_testimonials_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_guarantee_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_guarantee_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_guarantee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_faq_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_faq_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_rich_text_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_rich_text_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_cta_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_cta_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_gallery_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_gallery_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_midwife_spotlight_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_midwife_spotlight_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_midwife_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_heading_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_heading_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_heading" ADD CONSTRAINT "_landing_pages_v_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_image_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_image_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_image" ADD CONSTRAINT "_landing_pages_v_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_image" ADD CONSTRAINT "_landing_pages_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_button_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_button_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_button" ADD CONSTRAINT "_landing_pages_v_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_divider_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_divider_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_divider" ADD CONSTRAINT "_landing_pages_v_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_video_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_video_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_video" ADD CONSTRAINT "_landing_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_stats_items" ADD CONSTRAINT "_landing_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_stats_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_stats_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_stats" ADD CONSTRAINT "_landing_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_logos_items" ADD CONSTRAINT "_landing_pages_v_blocks_logos_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_logos_items" ADD CONSTRAINT "_landing_pages_v_blocks_logos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_logos_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_logos_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_logos" ADD CONSTRAINT "_landing_pages_v_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_team_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_team_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_team" ADD CONSTRAINT "_landing_pages_v_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_tabs_tabs" ADD CONSTRAINT "_landing_pages_v_blocks_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_tabs_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_tabs_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_tabs" ADD CONSTRAINT "_landing_pages_v_blocks_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_lead_form_fields" ADD CONSTRAINT "_landing_pages_v_blocks_lead_form_fields_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_lead_form_service_options" ADD CONSTRAINT "_landing_pages_v_blocks_lead_form_service_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_lead_form_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_lead_form_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_lead_form" ADD CONSTRAINT "_landing_pages_v_blocks_lead_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_blog_feed_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_blog_feed_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_blog_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_blog_feed" ADD CONSTRAINT "_landing_pages_v_blocks_blog_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_countdown_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_countdown_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_countdown"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_countdown" ADD CONSTRAINT "_landing_pages_v_blocks_countdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_social_items" ADD CONSTRAINT "_landing_pages_v_blocks_social_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_social_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_social_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_social" ADD CONSTRAINT "_landing_pages_v_blocks_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_section_columns" ADD CONSTRAINT "_landing_pages_v_blocks_section_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_section_visibility" ADD CONSTRAINT "_landing_pages_v_blocks_section_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_blocks_section" ADD CONSTRAINT "_landing_pages_v_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_hero_visibility" ADD CONSTRAINT "page_templates_blocks_hero_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_pain_points_visibility" ADD CONSTRAINT "page_templates_blocks_pain_points_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_solutions_visibility" ADD CONSTRAINT "page_templates_blocks_solutions_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_pricing_visibility" ADD CONSTRAINT "page_templates_blocks_pricing_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_comparison_visibility" ADD CONSTRAINT "page_templates_blocks_comparison_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_steps_visibility" ADD CONSTRAINT "page_templates_blocks_steps_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_testimonials_visibility" ADD CONSTRAINT "page_templates_blocks_testimonials_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_guarantee_visibility" ADD CONSTRAINT "page_templates_blocks_guarantee_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_guarantee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_faq_visibility" ADD CONSTRAINT "page_templates_blocks_faq_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_rich_text_visibility" ADD CONSTRAINT "page_templates_blocks_rich_text_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_cta_visibility" ADD CONSTRAINT "page_templates_blocks_cta_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_gallery_visibility" ADD CONSTRAINT "page_templates_blocks_gallery_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_midwife_spotlight_visibility" ADD CONSTRAINT "page_templates_blocks_midwife_spotlight_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_midwife_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_heading_visibility" ADD CONSTRAINT "page_templates_blocks_heading_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_heading" ADD CONSTRAINT "page_templates_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_image_visibility" ADD CONSTRAINT "page_templates_blocks_image_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_image" ADD CONSTRAINT "page_templates_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_image" ADD CONSTRAINT "page_templates_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_button_visibility" ADD CONSTRAINT "page_templates_blocks_button_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_button" ADD CONSTRAINT "page_templates_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_divider_visibility" ADD CONSTRAINT "page_templates_blocks_divider_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_divider" ADD CONSTRAINT "page_templates_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_video_visibility" ADD CONSTRAINT "page_templates_blocks_video_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_video" ADD CONSTRAINT "page_templates_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_stats_items" ADD CONSTRAINT "page_templates_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_stats_visibility" ADD CONSTRAINT "page_templates_blocks_stats_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_stats" ADD CONSTRAINT "page_templates_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_logos_items" ADD CONSTRAINT "page_templates_blocks_logos_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_logos_items" ADD CONSTRAINT "page_templates_blocks_logos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_logos_visibility" ADD CONSTRAINT "page_templates_blocks_logos_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_logos" ADD CONSTRAINT "page_templates_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_team_visibility" ADD CONSTRAINT "page_templates_blocks_team_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_team" ADD CONSTRAINT "page_templates_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_tabs_tabs" ADD CONSTRAINT "page_templates_blocks_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_tabs_visibility" ADD CONSTRAINT "page_templates_blocks_tabs_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_tabs" ADD CONSTRAINT "page_templates_blocks_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_lead_form_fields" ADD CONSTRAINT "page_templates_blocks_lead_form_fields_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_lead_form_service_options" ADD CONSTRAINT "page_templates_blocks_lead_form_service_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_lead_form_visibility" ADD CONSTRAINT "page_templates_blocks_lead_form_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_lead_form" ADD CONSTRAINT "page_templates_blocks_lead_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_blog_feed_visibility" ADD CONSTRAINT "page_templates_blocks_blog_feed_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_blog_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_blog_feed" ADD CONSTRAINT "page_templates_blocks_blog_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_countdown_visibility" ADD CONSTRAINT "page_templates_blocks_countdown_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_countdown"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_countdown" ADD CONSTRAINT "page_templates_blocks_countdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_social_items" ADD CONSTRAINT "page_templates_blocks_social_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_social_visibility" ADD CONSTRAINT "page_templates_blocks_social_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_social" ADD CONSTRAINT "page_templates_blocks_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_section_columns" ADD CONSTRAINT "page_templates_blocks_section_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_section_visibility" ADD CONSTRAINT "page_templates_blocks_section_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_templates_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_templates_blocks_section" ADD CONSTRAINT "page_templates_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_hero_visibility" ADD CONSTRAINT "block_templates_blocks_hero_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_pain_points_visibility" ADD CONSTRAINT "block_templates_blocks_pain_points_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_solutions_visibility" ADD CONSTRAINT "block_templates_blocks_solutions_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_pricing_visibility" ADD CONSTRAINT "block_templates_blocks_pricing_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_comparison_visibility" ADD CONSTRAINT "block_templates_blocks_comparison_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_steps_visibility" ADD CONSTRAINT "block_templates_blocks_steps_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_testimonials_visibility" ADD CONSTRAINT "block_templates_blocks_testimonials_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_guarantee_visibility" ADD CONSTRAINT "block_templates_blocks_guarantee_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_guarantee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_faq_visibility" ADD CONSTRAINT "block_templates_blocks_faq_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_rich_text_visibility" ADD CONSTRAINT "block_templates_blocks_rich_text_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_cta_visibility" ADD CONSTRAINT "block_templates_blocks_cta_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_gallery_visibility" ADD CONSTRAINT "block_templates_blocks_gallery_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_midwife_spotlight_visibility" ADD CONSTRAINT "block_templates_blocks_midwife_spotlight_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_midwife_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_heading_visibility" ADD CONSTRAINT "block_templates_blocks_heading_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_heading" ADD CONSTRAINT "block_templates_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_image_visibility" ADD CONSTRAINT "block_templates_blocks_image_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_image" ADD CONSTRAINT "block_templates_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_image" ADD CONSTRAINT "block_templates_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_button_visibility" ADD CONSTRAINT "block_templates_blocks_button_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_button" ADD CONSTRAINT "block_templates_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_divider_visibility" ADD CONSTRAINT "block_templates_blocks_divider_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_divider" ADD CONSTRAINT "block_templates_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_video_visibility" ADD CONSTRAINT "block_templates_blocks_video_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_video" ADD CONSTRAINT "block_templates_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_stats_items" ADD CONSTRAINT "block_templates_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_stats_visibility" ADD CONSTRAINT "block_templates_blocks_stats_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_stats" ADD CONSTRAINT "block_templates_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_logos_items" ADD CONSTRAINT "block_templates_blocks_logos_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_logos_items" ADD CONSTRAINT "block_templates_blocks_logos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_logos_visibility" ADD CONSTRAINT "block_templates_blocks_logos_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_logos" ADD CONSTRAINT "block_templates_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_team_visibility" ADD CONSTRAINT "block_templates_blocks_team_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_team" ADD CONSTRAINT "block_templates_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_tabs_tabs" ADD CONSTRAINT "block_templates_blocks_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_tabs_visibility" ADD CONSTRAINT "block_templates_blocks_tabs_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_tabs" ADD CONSTRAINT "block_templates_blocks_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_lead_form_fields" ADD CONSTRAINT "block_templates_blocks_lead_form_fields_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_lead_form_service_options" ADD CONSTRAINT "block_templates_blocks_lead_form_service_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_lead_form_visibility" ADD CONSTRAINT "block_templates_blocks_lead_form_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_lead_form" ADD CONSTRAINT "block_templates_blocks_lead_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_blog_feed_visibility" ADD CONSTRAINT "block_templates_blocks_blog_feed_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_blog_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_blog_feed" ADD CONSTRAINT "block_templates_blocks_blog_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_countdown_visibility" ADD CONSTRAINT "block_templates_blocks_countdown_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_countdown"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_countdown" ADD CONSTRAINT "block_templates_blocks_countdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_social_items" ADD CONSTRAINT "block_templates_blocks_social_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_social_visibility" ADD CONSTRAINT "block_templates_blocks_social_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_social" ADD CONSTRAINT "block_templates_blocks_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_section_columns" ADD CONSTRAINT "block_templates_blocks_section_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_section_visibility" ADD CONSTRAINT "block_templates_blocks_section_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."block_templates_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "block_templates_blocks_section" ADD CONSTRAINT "block_templates_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."block_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_hero_visibility" ADD CONSTRAINT "_block_templates_v_blocks_hero_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_pain_points_visibility" ADD CONSTRAINT "_block_templates_v_blocks_pain_points_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_solutions_visibility" ADD CONSTRAINT "_block_templates_v_blocks_solutions_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_pricing_visibility" ADD CONSTRAINT "_block_templates_v_blocks_pricing_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_comparison_visibility" ADD CONSTRAINT "_block_templates_v_blocks_comparison_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_steps_visibility" ADD CONSTRAINT "_block_templates_v_blocks_steps_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_testimonials_visibility" ADD CONSTRAINT "_block_templates_v_blocks_testimonials_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_guarantee_visibility" ADD CONSTRAINT "_block_templates_v_blocks_guarantee_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_guarantee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_faq_visibility" ADD CONSTRAINT "_block_templates_v_blocks_faq_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_rich_text_visibility" ADD CONSTRAINT "_block_templates_v_blocks_rich_text_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_cta_visibility" ADD CONSTRAINT "_block_templates_v_blocks_cta_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_gallery_visibility" ADD CONSTRAINT "_block_templates_v_blocks_gallery_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_midwife_spotlight_visibility" ADD CONSTRAINT "_block_templates_v_blocks_midwife_spotlight_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_midwife_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_heading_visibility" ADD CONSTRAINT "_block_templates_v_blocks_heading_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_heading" ADD CONSTRAINT "_block_templates_v_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_image_visibility" ADD CONSTRAINT "_block_templates_v_blocks_image_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_image" ADD CONSTRAINT "_block_templates_v_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_image" ADD CONSTRAINT "_block_templates_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_button_visibility" ADD CONSTRAINT "_block_templates_v_blocks_button_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_button" ADD CONSTRAINT "_block_templates_v_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_divider_visibility" ADD CONSTRAINT "_block_templates_v_blocks_divider_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_divider" ADD CONSTRAINT "_block_templates_v_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_video_visibility" ADD CONSTRAINT "_block_templates_v_blocks_video_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_video" ADD CONSTRAINT "_block_templates_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_stats_items" ADD CONSTRAINT "_block_templates_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_stats_visibility" ADD CONSTRAINT "_block_templates_v_blocks_stats_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_stats" ADD CONSTRAINT "_block_templates_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_logos_items" ADD CONSTRAINT "_block_templates_v_blocks_logos_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_logos_items" ADD CONSTRAINT "_block_templates_v_blocks_logos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_logos_visibility" ADD CONSTRAINT "_block_templates_v_blocks_logos_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_logos" ADD CONSTRAINT "_block_templates_v_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_team_visibility" ADD CONSTRAINT "_block_templates_v_blocks_team_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_team" ADD CONSTRAINT "_block_templates_v_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_tabs_tabs" ADD CONSTRAINT "_block_templates_v_blocks_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_tabs_visibility" ADD CONSTRAINT "_block_templates_v_blocks_tabs_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_tabs" ADD CONSTRAINT "_block_templates_v_blocks_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_lead_form_fields" ADD CONSTRAINT "_block_templates_v_blocks_lead_form_fields_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_lead_form_service_options" ADD CONSTRAINT "_block_templates_v_blocks_lead_form_service_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_lead_form_visibility" ADD CONSTRAINT "_block_templates_v_blocks_lead_form_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_lead_form" ADD CONSTRAINT "_block_templates_v_blocks_lead_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_blog_feed_visibility" ADD CONSTRAINT "_block_templates_v_blocks_blog_feed_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_blog_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_blog_feed" ADD CONSTRAINT "_block_templates_v_blocks_blog_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_countdown_visibility" ADD CONSTRAINT "_block_templates_v_blocks_countdown_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_countdown"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_countdown" ADD CONSTRAINT "_block_templates_v_blocks_countdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_social_items" ADD CONSTRAINT "_block_templates_v_blocks_social_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_social_visibility" ADD CONSTRAINT "_block_templates_v_blocks_social_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_social" ADD CONSTRAINT "_block_templates_v_blocks_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_section_columns" ADD CONSTRAINT "_block_templates_v_blocks_section_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_section_visibility" ADD CONSTRAINT "_block_templates_v_blocks_section_visibility_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_block_templates_v_blocks_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_block_templates_v_blocks_section" ADD CONSTRAINT "_block_templates_v_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_block_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_visibility_order_idx" ON "pages_blocks_hero_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_hero_visibility_parent_idx" ON "pages_blocks_hero_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_pain_points_visibility_order_idx" ON "pages_blocks_pain_points_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_pain_points_visibility_parent_idx" ON "pages_blocks_pain_points_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_solutions_visibility_order_idx" ON "pages_blocks_solutions_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_solutions_visibility_parent_idx" ON "pages_blocks_solutions_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_pricing_visibility_order_idx" ON "pages_blocks_pricing_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_pricing_visibility_parent_idx" ON "pages_blocks_pricing_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_comparison_visibility_order_idx" ON "pages_blocks_comparison_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_comparison_visibility_parent_idx" ON "pages_blocks_comparison_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_steps_visibility_order_idx" ON "pages_blocks_steps_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_steps_visibility_parent_idx" ON "pages_blocks_steps_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_testimonials_visibility_order_idx" ON "pages_blocks_testimonials_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_testimonials_visibility_parent_idx" ON "pages_blocks_testimonials_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_guarantee_visibility_order_idx" ON "pages_blocks_guarantee_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_guarantee_visibility_parent_idx" ON "pages_blocks_guarantee_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_faq_visibility_order_idx" ON "pages_blocks_faq_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_faq_visibility_parent_idx" ON "pages_blocks_faq_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_rich_text_visibility_order_idx" ON "pages_blocks_rich_text_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_rich_text_visibility_parent_idx" ON "pages_blocks_rich_text_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_cta_visibility_order_idx" ON "pages_blocks_cta_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_cta_visibility_parent_idx" ON "pages_blocks_cta_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_gallery_visibility_order_idx" ON "pages_blocks_gallery_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_gallery_visibility_parent_idx" ON "pages_blocks_gallery_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_midwife_spotlight_visibility_order_idx" ON "pages_blocks_midwife_spotlight_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_midwife_spotlight_visibility_parent_idx" ON "pages_blocks_midwife_spotlight_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_heading_visibility_order_idx" ON "pages_blocks_heading_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_heading_visibility_parent_idx" ON "pages_blocks_heading_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_heading_order_idx" ON "pages_blocks_heading" USING btree ("_order");
  CREATE INDEX "pages_blocks_heading_parent_id_idx" ON "pages_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_heading_path_idx" ON "pages_blocks_heading" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_visibility_order_idx" ON "pages_blocks_image_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_image_visibility_parent_idx" ON "pages_blocks_image_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_image_order_idx" ON "pages_blocks_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_parent_id_idx" ON "pages_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_path_idx" ON "pages_blocks_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_image_idx" ON "pages_blocks_image" USING btree ("image_id");
  CREATE INDEX "pages_blocks_button_visibility_order_idx" ON "pages_blocks_button_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_button_visibility_parent_idx" ON "pages_blocks_button_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_button_order_idx" ON "pages_blocks_button" USING btree ("_order");
  CREATE INDEX "pages_blocks_button_parent_id_idx" ON "pages_blocks_button" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_button_path_idx" ON "pages_blocks_button" USING btree ("_path");
  CREATE INDEX "pages_blocks_divider_visibility_order_idx" ON "pages_blocks_divider_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_divider_visibility_parent_idx" ON "pages_blocks_divider_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_divider_order_idx" ON "pages_blocks_divider" USING btree ("_order");
  CREATE INDEX "pages_blocks_divider_parent_id_idx" ON "pages_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_divider_path_idx" ON "pages_blocks_divider" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_visibility_order_idx" ON "pages_blocks_video_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_video_visibility_parent_idx" ON "pages_blocks_video_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_visibility_order_idx" ON "pages_blocks_stats_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_stats_visibility_parent_idx" ON "pages_blocks_stats_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_logos_items_order_idx" ON "pages_blocks_logos_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_logos_items_parent_id_idx" ON "pages_blocks_logos_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logos_items_image_idx" ON "pages_blocks_logos_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_logos_visibility_order_idx" ON "pages_blocks_logos_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_logos_visibility_parent_idx" ON "pages_blocks_logos_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_logos_order_idx" ON "pages_blocks_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logos_parent_id_idx" ON "pages_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logos_path_idx" ON "pages_blocks_logos" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_visibility_order_idx" ON "pages_blocks_team_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_team_visibility_parent_idx" ON "pages_blocks_team_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_team_order_idx" ON "pages_blocks_team" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_parent_id_idx" ON "pages_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_path_idx" ON "pages_blocks_team" USING btree ("_path");
  CREATE INDEX "pages_blocks_tabs_tabs_order_idx" ON "pages_blocks_tabs_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_tabs_tabs_parent_id_idx" ON "pages_blocks_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tabs_visibility_order_idx" ON "pages_blocks_tabs_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_tabs_visibility_parent_idx" ON "pages_blocks_tabs_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_tabs_order_idx" ON "pages_blocks_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_tabs_parent_id_idx" ON "pages_blocks_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tabs_path_idx" ON "pages_blocks_tabs" USING btree ("_path");
  CREATE INDEX "pages_blocks_lead_form_fields_order_idx" ON "pages_blocks_lead_form_fields" USING btree ("order");
  CREATE INDEX "pages_blocks_lead_form_fields_parent_idx" ON "pages_blocks_lead_form_fields" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_lead_form_service_options_order_idx" ON "pages_blocks_lead_form_service_options" USING btree ("_order");
  CREATE INDEX "pages_blocks_lead_form_service_options_parent_id_idx" ON "pages_blocks_lead_form_service_options" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lead_form_visibility_order_idx" ON "pages_blocks_lead_form_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_lead_form_visibility_parent_idx" ON "pages_blocks_lead_form_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_lead_form_order_idx" ON "pages_blocks_lead_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_lead_form_parent_id_idx" ON "pages_blocks_lead_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lead_form_path_idx" ON "pages_blocks_lead_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_blog_feed_visibility_order_idx" ON "pages_blocks_blog_feed_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_blog_feed_visibility_parent_idx" ON "pages_blocks_blog_feed_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_blog_feed_order_idx" ON "pages_blocks_blog_feed" USING btree ("_order");
  CREATE INDEX "pages_blocks_blog_feed_parent_id_idx" ON "pages_blocks_blog_feed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_blog_feed_path_idx" ON "pages_blocks_blog_feed" USING btree ("_path");
  CREATE INDEX "pages_blocks_countdown_visibility_order_idx" ON "pages_blocks_countdown_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_countdown_visibility_parent_idx" ON "pages_blocks_countdown_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_countdown_order_idx" ON "pages_blocks_countdown" USING btree ("_order");
  CREATE INDEX "pages_blocks_countdown_parent_id_idx" ON "pages_blocks_countdown" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_countdown_path_idx" ON "pages_blocks_countdown" USING btree ("_path");
  CREATE INDEX "pages_blocks_social_items_order_idx" ON "pages_blocks_social_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_social_items_parent_id_idx" ON "pages_blocks_social_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_social_visibility_order_idx" ON "pages_blocks_social_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_social_visibility_parent_idx" ON "pages_blocks_social_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_social_order_idx" ON "pages_blocks_social" USING btree ("_order");
  CREATE INDEX "pages_blocks_social_parent_id_idx" ON "pages_blocks_social" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_social_path_idx" ON "pages_blocks_social" USING btree ("_path");
  CREATE INDEX "pages_blocks_section_columns_order_idx" ON "pages_blocks_section_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_section_columns_parent_id_idx" ON "pages_blocks_section_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_section_visibility_order_idx" ON "pages_blocks_section_visibility" USING btree ("order");
  CREATE INDEX "pages_blocks_section_visibility_parent_idx" ON "pages_blocks_section_visibility" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_section_order_idx" ON "pages_blocks_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_section_parent_id_idx" ON "pages_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_section_path_idx" ON "pages_blocks_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_visibility_order_idx" ON "_pages_v_blocks_hero_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_hero_visibility_parent_idx" ON "_pages_v_blocks_hero_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_pain_points_visibility_order_idx" ON "_pages_v_blocks_pain_points_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_pain_points_visibility_parent_idx" ON "_pages_v_blocks_pain_points_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_solutions_visibility_order_idx" ON "_pages_v_blocks_solutions_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_solutions_visibility_parent_idx" ON "_pages_v_blocks_solutions_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_visibility_order_idx" ON "_pages_v_blocks_pricing_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_pricing_visibility_parent_idx" ON "_pages_v_blocks_pricing_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_visibility_order_idx" ON "_pages_v_blocks_comparison_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_comparison_visibility_parent_idx" ON "_pages_v_blocks_comparison_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_steps_visibility_order_idx" ON "_pages_v_blocks_steps_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_steps_visibility_parent_idx" ON "_pages_v_blocks_steps_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_visibility_order_idx" ON "_pages_v_blocks_testimonials_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_testimonials_visibility_parent_idx" ON "_pages_v_blocks_testimonials_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_guarantee_visibility_order_idx" ON "_pages_v_blocks_guarantee_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_guarantee_visibility_parent_idx" ON "_pages_v_blocks_guarantee_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_faq_visibility_order_idx" ON "_pages_v_blocks_faq_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_faq_visibility_parent_idx" ON "_pages_v_blocks_faq_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_visibility_order_idx" ON "_pages_v_blocks_rich_text_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_rich_text_visibility_parent_idx" ON "_pages_v_blocks_rich_text_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_cta_visibility_order_idx" ON "_pages_v_blocks_cta_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_cta_visibility_parent_idx" ON "_pages_v_blocks_cta_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_visibility_order_idx" ON "_pages_v_blocks_gallery_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_gallery_visibility_parent_idx" ON "_pages_v_blocks_gallery_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_midwife_spotlight_visibility_order_idx" ON "_pages_v_blocks_midwife_spotlight_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_midwife_spotlight_visibility_parent_idx" ON "_pages_v_blocks_midwife_spotlight_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_heading_visibility_order_idx" ON "_pages_v_blocks_heading_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_heading_visibility_parent_idx" ON "_pages_v_blocks_heading_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_heading_order_idx" ON "_pages_v_blocks_heading" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_heading_parent_id_idx" ON "_pages_v_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_heading_path_idx" ON "_pages_v_blocks_heading" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_visibility_order_idx" ON "_pages_v_blocks_image_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_image_visibility_parent_idx" ON "_pages_v_blocks_image_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_image_order_idx" ON "_pages_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_parent_id_idx" ON "_pages_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_path_idx" ON "_pages_v_blocks_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_image_idx" ON "_pages_v_blocks_image" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_button_visibility_order_idx" ON "_pages_v_blocks_button_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_button_visibility_parent_idx" ON "_pages_v_blocks_button_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_button_order_idx" ON "_pages_v_blocks_button" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_button_parent_id_idx" ON "_pages_v_blocks_button" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_button_path_idx" ON "_pages_v_blocks_button" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_divider_visibility_order_idx" ON "_pages_v_blocks_divider_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_divider_visibility_parent_idx" ON "_pages_v_blocks_divider_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_divider_order_idx" ON "_pages_v_blocks_divider" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_divider_parent_id_idx" ON "_pages_v_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_divider_path_idx" ON "_pages_v_blocks_divider" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_visibility_order_idx" ON "_pages_v_blocks_video_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_video_visibility_parent_idx" ON "_pages_v_blocks_video_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_visibility_order_idx" ON "_pages_v_blocks_stats_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_stats_visibility_parent_idx" ON "_pages_v_blocks_stats_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logos_items_order_idx" ON "_pages_v_blocks_logos_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logos_items_parent_id_idx" ON "_pages_v_blocks_logos_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logos_items_image_idx" ON "_pages_v_blocks_logos_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_logos_visibility_order_idx" ON "_pages_v_blocks_logos_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_logos_visibility_parent_idx" ON "_pages_v_blocks_logos_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_logos_order_idx" ON "_pages_v_blocks_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logos_parent_id_idx" ON "_pages_v_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logos_path_idx" ON "_pages_v_blocks_logos" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_visibility_order_idx" ON "_pages_v_blocks_team_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_team_visibility_parent_idx" ON "_pages_v_blocks_team_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_team_order_idx" ON "_pages_v_blocks_team" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_parent_id_idx" ON "_pages_v_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_path_idx" ON "_pages_v_blocks_team" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_tabs_tabs_order_idx" ON "_pages_v_blocks_tabs_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tabs_tabs_parent_id_idx" ON "_pages_v_blocks_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tabs_visibility_order_idx" ON "_pages_v_blocks_tabs_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_tabs_visibility_parent_idx" ON "_pages_v_blocks_tabs_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_tabs_order_idx" ON "_pages_v_blocks_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tabs_parent_id_idx" ON "_pages_v_blocks_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tabs_path_idx" ON "_pages_v_blocks_tabs" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_lead_form_fields_order_idx" ON "_pages_v_blocks_lead_form_fields" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_lead_form_fields_parent_idx" ON "_pages_v_blocks_lead_form_fields" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_lead_form_service_options_order_idx" ON "_pages_v_blocks_lead_form_service_options" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lead_form_service_options_parent_id_idx" ON "_pages_v_blocks_lead_form_service_options" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lead_form_visibility_order_idx" ON "_pages_v_blocks_lead_form_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_lead_form_visibility_parent_idx" ON "_pages_v_blocks_lead_form_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_lead_form_order_idx" ON "_pages_v_blocks_lead_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lead_form_parent_id_idx" ON "_pages_v_blocks_lead_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lead_form_path_idx" ON "_pages_v_blocks_lead_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_blog_feed_visibility_order_idx" ON "_pages_v_blocks_blog_feed_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_blog_feed_visibility_parent_idx" ON "_pages_v_blocks_blog_feed_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_blog_feed_order_idx" ON "_pages_v_blocks_blog_feed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_blog_feed_parent_id_idx" ON "_pages_v_blocks_blog_feed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_blog_feed_path_idx" ON "_pages_v_blocks_blog_feed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_countdown_visibility_order_idx" ON "_pages_v_blocks_countdown_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_countdown_visibility_parent_idx" ON "_pages_v_blocks_countdown_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_countdown_order_idx" ON "_pages_v_blocks_countdown" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_countdown_parent_id_idx" ON "_pages_v_blocks_countdown" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_countdown_path_idx" ON "_pages_v_blocks_countdown" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_social_items_order_idx" ON "_pages_v_blocks_social_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_social_items_parent_id_idx" ON "_pages_v_blocks_social_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_social_visibility_order_idx" ON "_pages_v_blocks_social_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_social_visibility_parent_idx" ON "_pages_v_blocks_social_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_social_order_idx" ON "_pages_v_blocks_social" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_social_parent_id_idx" ON "_pages_v_blocks_social" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_social_path_idx" ON "_pages_v_blocks_social" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_section_columns_order_idx" ON "_pages_v_blocks_section_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_section_columns_parent_id_idx" ON "_pages_v_blocks_section_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_section_visibility_order_idx" ON "_pages_v_blocks_section_visibility" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_section_visibility_parent_idx" ON "_pages_v_blocks_section_visibility" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_section_order_idx" ON "_pages_v_blocks_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_section_parent_id_idx" ON "_pages_v_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_section_path_idx" ON "_pages_v_blocks_section" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_hero_visibility_order_idx" ON "landing_pages_blocks_hero_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_hero_visibility_parent_idx" ON "landing_pages_blocks_hero_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_pain_points_visibility_order_idx" ON "landing_pages_blocks_pain_points_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_pain_points_visibility_parent_idx" ON "landing_pages_blocks_pain_points_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_solutions_visibility_order_idx" ON "landing_pages_blocks_solutions_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_solutions_visibility_parent_idx" ON "landing_pages_blocks_solutions_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_pricing_visibility_order_idx" ON "landing_pages_blocks_pricing_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_pricing_visibility_parent_idx" ON "landing_pages_blocks_pricing_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_comparison_visibility_order_idx" ON "landing_pages_blocks_comparison_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_comparison_visibility_parent_idx" ON "landing_pages_blocks_comparison_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_steps_visibility_order_idx" ON "landing_pages_blocks_steps_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_steps_visibility_parent_idx" ON "landing_pages_blocks_steps_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_testimonials_visibility_order_idx" ON "landing_pages_blocks_testimonials_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_testimonials_visibility_parent_idx" ON "landing_pages_blocks_testimonials_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_guarantee_visibility_order_idx" ON "landing_pages_blocks_guarantee_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_guarantee_visibility_parent_idx" ON "landing_pages_blocks_guarantee_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_faq_visibility_order_idx" ON "landing_pages_blocks_faq_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_faq_visibility_parent_idx" ON "landing_pages_blocks_faq_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_rich_text_visibility_order_idx" ON "landing_pages_blocks_rich_text_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_rich_text_visibility_parent_idx" ON "landing_pages_blocks_rich_text_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_cta_visibility_order_idx" ON "landing_pages_blocks_cta_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_cta_visibility_parent_idx" ON "landing_pages_blocks_cta_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_gallery_visibility_order_idx" ON "landing_pages_blocks_gallery_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_gallery_visibility_parent_idx" ON "landing_pages_blocks_gallery_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_midwife_spotlight_visibility_order_idx" ON "landing_pages_blocks_midwife_spotlight_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_midwife_spotlight_visibility_parent_idx" ON "landing_pages_blocks_midwife_spotlight_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_heading_visibility_order_idx" ON "landing_pages_blocks_heading_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_heading_visibility_parent_idx" ON "landing_pages_blocks_heading_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_heading_order_idx" ON "landing_pages_blocks_heading" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_heading_parent_id_idx" ON "landing_pages_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_heading_path_idx" ON "landing_pages_blocks_heading" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_image_visibility_order_idx" ON "landing_pages_blocks_image_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_image_visibility_parent_idx" ON "landing_pages_blocks_image_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_image_order_idx" ON "landing_pages_blocks_image" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_image_parent_id_idx" ON "landing_pages_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_image_path_idx" ON "landing_pages_blocks_image" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_image_image_idx" ON "landing_pages_blocks_image" USING btree ("image_id");
  CREATE INDEX "landing_pages_blocks_button_visibility_order_idx" ON "landing_pages_blocks_button_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_button_visibility_parent_idx" ON "landing_pages_blocks_button_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_button_order_idx" ON "landing_pages_blocks_button" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_button_parent_id_idx" ON "landing_pages_blocks_button" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_button_path_idx" ON "landing_pages_blocks_button" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_divider_visibility_order_idx" ON "landing_pages_blocks_divider_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_divider_visibility_parent_idx" ON "landing_pages_blocks_divider_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_divider_order_idx" ON "landing_pages_blocks_divider" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_divider_parent_id_idx" ON "landing_pages_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_divider_path_idx" ON "landing_pages_blocks_divider" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_video_visibility_order_idx" ON "landing_pages_blocks_video_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_video_visibility_parent_idx" ON "landing_pages_blocks_video_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_video_order_idx" ON "landing_pages_blocks_video" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_video_parent_id_idx" ON "landing_pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_video_path_idx" ON "landing_pages_blocks_video" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_stats_items_order_idx" ON "landing_pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_stats_items_parent_id_idx" ON "landing_pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_stats_visibility_order_idx" ON "landing_pages_blocks_stats_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_stats_visibility_parent_idx" ON "landing_pages_blocks_stats_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_stats_order_idx" ON "landing_pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_stats_parent_id_idx" ON "landing_pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_stats_path_idx" ON "landing_pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_logos_items_order_idx" ON "landing_pages_blocks_logos_items" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_logos_items_parent_id_idx" ON "landing_pages_blocks_logos_items" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_logos_items_image_idx" ON "landing_pages_blocks_logos_items" USING btree ("image_id");
  CREATE INDEX "landing_pages_blocks_logos_visibility_order_idx" ON "landing_pages_blocks_logos_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_logos_visibility_parent_idx" ON "landing_pages_blocks_logos_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_logos_order_idx" ON "landing_pages_blocks_logos" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_logos_parent_id_idx" ON "landing_pages_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_logos_path_idx" ON "landing_pages_blocks_logos" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_team_visibility_order_idx" ON "landing_pages_blocks_team_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_team_visibility_parent_idx" ON "landing_pages_blocks_team_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_team_order_idx" ON "landing_pages_blocks_team" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_team_parent_id_idx" ON "landing_pages_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_team_path_idx" ON "landing_pages_blocks_team" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_tabs_tabs_order_idx" ON "landing_pages_blocks_tabs_tabs" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_tabs_tabs_parent_id_idx" ON "landing_pages_blocks_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_tabs_visibility_order_idx" ON "landing_pages_blocks_tabs_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_tabs_visibility_parent_idx" ON "landing_pages_blocks_tabs_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_tabs_order_idx" ON "landing_pages_blocks_tabs" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_tabs_parent_id_idx" ON "landing_pages_blocks_tabs" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_tabs_path_idx" ON "landing_pages_blocks_tabs" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_lead_form_fields_order_idx" ON "landing_pages_blocks_lead_form_fields" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_lead_form_fields_parent_idx" ON "landing_pages_blocks_lead_form_fields" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_lead_form_service_options_order_idx" ON "landing_pages_blocks_lead_form_service_options" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_lead_form_service_options_parent_id_idx" ON "landing_pages_blocks_lead_form_service_options" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_lead_form_visibility_order_idx" ON "landing_pages_blocks_lead_form_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_lead_form_visibility_parent_idx" ON "landing_pages_blocks_lead_form_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_lead_form_order_idx" ON "landing_pages_blocks_lead_form" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_lead_form_parent_id_idx" ON "landing_pages_blocks_lead_form" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_lead_form_path_idx" ON "landing_pages_blocks_lead_form" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_blog_feed_visibility_order_idx" ON "landing_pages_blocks_blog_feed_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_blog_feed_visibility_parent_idx" ON "landing_pages_blocks_blog_feed_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_blog_feed_order_idx" ON "landing_pages_blocks_blog_feed" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_blog_feed_parent_id_idx" ON "landing_pages_blocks_blog_feed" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_blog_feed_path_idx" ON "landing_pages_blocks_blog_feed" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_countdown_visibility_order_idx" ON "landing_pages_blocks_countdown_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_countdown_visibility_parent_idx" ON "landing_pages_blocks_countdown_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_countdown_order_idx" ON "landing_pages_blocks_countdown" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_countdown_parent_id_idx" ON "landing_pages_blocks_countdown" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_countdown_path_idx" ON "landing_pages_blocks_countdown" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_social_items_order_idx" ON "landing_pages_blocks_social_items" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_social_items_parent_id_idx" ON "landing_pages_blocks_social_items" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_social_visibility_order_idx" ON "landing_pages_blocks_social_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_social_visibility_parent_idx" ON "landing_pages_blocks_social_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_social_order_idx" ON "landing_pages_blocks_social" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_social_parent_id_idx" ON "landing_pages_blocks_social" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_social_path_idx" ON "landing_pages_blocks_social" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_section_columns_order_idx" ON "landing_pages_blocks_section_columns" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_section_columns_parent_id_idx" ON "landing_pages_blocks_section_columns" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_section_visibility_order_idx" ON "landing_pages_blocks_section_visibility" USING btree ("order");
  CREATE INDEX "landing_pages_blocks_section_visibility_parent_idx" ON "landing_pages_blocks_section_visibility" USING btree ("parent_id");
  CREATE INDEX "landing_pages_blocks_section_order_idx" ON "landing_pages_blocks_section" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_section_parent_id_idx" ON "landing_pages_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_section_path_idx" ON "landing_pages_blocks_section" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_hero_visibility_order_idx" ON "_landing_pages_v_blocks_hero_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_hero_visibility_parent_idx" ON "_landing_pages_v_blocks_hero_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_pain_points_visibility_order_idx" ON "_landing_pages_v_blocks_pain_points_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_pain_points_visibility_parent_idx" ON "_landing_pages_v_blocks_pain_points_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_solutions_visibility_order_idx" ON "_landing_pages_v_blocks_solutions_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_solutions_visibility_parent_idx" ON "_landing_pages_v_blocks_solutions_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_pricing_visibility_order_idx" ON "_landing_pages_v_blocks_pricing_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_pricing_visibility_parent_idx" ON "_landing_pages_v_blocks_pricing_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_comparison_visibility_order_idx" ON "_landing_pages_v_blocks_comparison_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_comparison_visibility_parent_idx" ON "_landing_pages_v_blocks_comparison_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_steps_visibility_order_idx" ON "_landing_pages_v_blocks_steps_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_steps_visibility_parent_idx" ON "_landing_pages_v_blocks_steps_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_testimonials_visibility_order_idx" ON "_landing_pages_v_blocks_testimonials_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_testimonials_visibility_parent_idx" ON "_landing_pages_v_blocks_testimonials_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_guarantee_visibility_order_idx" ON "_landing_pages_v_blocks_guarantee_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_guarantee_visibility_parent_idx" ON "_landing_pages_v_blocks_guarantee_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_faq_visibility_order_idx" ON "_landing_pages_v_blocks_faq_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_faq_visibility_parent_idx" ON "_landing_pages_v_blocks_faq_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_rich_text_visibility_order_idx" ON "_landing_pages_v_blocks_rich_text_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_rich_text_visibility_parent_idx" ON "_landing_pages_v_blocks_rich_text_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_cta_visibility_order_idx" ON "_landing_pages_v_blocks_cta_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_cta_visibility_parent_idx" ON "_landing_pages_v_blocks_cta_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_gallery_visibility_order_idx" ON "_landing_pages_v_blocks_gallery_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_gallery_visibility_parent_idx" ON "_landing_pages_v_blocks_gallery_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_midwife_spotlight_visibility_order_idx" ON "_landing_pages_v_blocks_midwife_spotlight_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_midwife_spotlight_visibility_parent_idx" ON "_landing_pages_v_blocks_midwife_spotlight_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_heading_visibility_order_idx" ON "_landing_pages_v_blocks_heading_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_heading_visibility_parent_idx" ON "_landing_pages_v_blocks_heading_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_heading_order_idx" ON "_landing_pages_v_blocks_heading" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_heading_parent_id_idx" ON "_landing_pages_v_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_heading_path_idx" ON "_landing_pages_v_blocks_heading" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_image_visibility_order_idx" ON "_landing_pages_v_blocks_image_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_image_visibility_parent_idx" ON "_landing_pages_v_blocks_image_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_image_order_idx" ON "_landing_pages_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_image_parent_id_idx" ON "_landing_pages_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_image_path_idx" ON "_landing_pages_v_blocks_image" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_image_image_idx" ON "_landing_pages_v_blocks_image" USING btree ("image_id");
  CREATE INDEX "_landing_pages_v_blocks_button_visibility_order_idx" ON "_landing_pages_v_blocks_button_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_button_visibility_parent_idx" ON "_landing_pages_v_blocks_button_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_button_order_idx" ON "_landing_pages_v_blocks_button" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_button_parent_id_idx" ON "_landing_pages_v_blocks_button" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_button_path_idx" ON "_landing_pages_v_blocks_button" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_divider_visibility_order_idx" ON "_landing_pages_v_blocks_divider_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_divider_visibility_parent_idx" ON "_landing_pages_v_blocks_divider_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_divider_order_idx" ON "_landing_pages_v_blocks_divider" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_divider_parent_id_idx" ON "_landing_pages_v_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_divider_path_idx" ON "_landing_pages_v_blocks_divider" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_video_visibility_order_idx" ON "_landing_pages_v_blocks_video_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_video_visibility_parent_idx" ON "_landing_pages_v_blocks_video_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_video_order_idx" ON "_landing_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_video_parent_id_idx" ON "_landing_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_video_path_idx" ON "_landing_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_stats_items_order_idx" ON "_landing_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_stats_items_parent_id_idx" ON "_landing_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_stats_visibility_order_idx" ON "_landing_pages_v_blocks_stats_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_stats_visibility_parent_idx" ON "_landing_pages_v_blocks_stats_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_stats_order_idx" ON "_landing_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_stats_parent_id_idx" ON "_landing_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_stats_path_idx" ON "_landing_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_logos_items_order_idx" ON "_landing_pages_v_blocks_logos_items" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_logos_items_parent_id_idx" ON "_landing_pages_v_blocks_logos_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_logos_items_image_idx" ON "_landing_pages_v_blocks_logos_items" USING btree ("image_id");
  CREATE INDEX "_landing_pages_v_blocks_logos_visibility_order_idx" ON "_landing_pages_v_blocks_logos_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_logos_visibility_parent_idx" ON "_landing_pages_v_blocks_logos_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_logos_order_idx" ON "_landing_pages_v_blocks_logos" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_logos_parent_id_idx" ON "_landing_pages_v_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_logos_path_idx" ON "_landing_pages_v_blocks_logos" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_team_visibility_order_idx" ON "_landing_pages_v_blocks_team_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_team_visibility_parent_idx" ON "_landing_pages_v_blocks_team_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_team_order_idx" ON "_landing_pages_v_blocks_team" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_team_parent_id_idx" ON "_landing_pages_v_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_team_path_idx" ON "_landing_pages_v_blocks_team" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_tabs_tabs_order_idx" ON "_landing_pages_v_blocks_tabs_tabs" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_tabs_tabs_parent_id_idx" ON "_landing_pages_v_blocks_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_tabs_visibility_order_idx" ON "_landing_pages_v_blocks_tabs_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_tabs_visibility_parent_idx" ON "_landing_pages_v_blocks_tabs_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_tabs_order_idx" ON "_landing_pages_v_blocks_tabs" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_tabs_parent_id_idx" ON "_landing_pages_v_blocks_tabs" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_tabs_path_idx" ON "_landing_pages_v_blocks_tabs" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_lead_form_fields_order_idx" ON "_landing_pages_v_blocks_lead_form_fields" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_lead_form_fields_parent_idx" ON "_landing_pages_v_blocks_lead_form_fields" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_lead_form_service_options_order_idx" ON "_landing_pages_v_blocks_lead_form_service_options" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_lead_form_service_options_parent_id_idx" ON "_landing_pages_v_blocks_lead_form_service_options" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_lead_form_visibility_order_idx" ON "_landing_pages_v_blocks_lead_form_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_lead_form_visibility_parent_idx" ON "_landing_pages_v_blocks_lead_form_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_lead_form_order_idx" ON "_landing_pages_v_blocks_lead_form" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_lead_form_parent_id_idx" ON "_landing_pages_v_blocks_lead_form" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_lead_form_path_idx" ON "_landing_pages_v_blocks_lead_form" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_blog_feed_visibility_order_idx" ON "_landing_pages_v_blocks_blog_feed_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_blog_feed_visibility_parent_idx" ON "_landing_pages_v_blocks_blog_feed_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_blog_feed_order_idx" ON "_landing_pages_v_blocks_blog_feed" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_blog_feed_parent_id_idx" ON "_landing_pages_v_blocks_blog_feed" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_blog_feed_path_idx" ON "_landing_pages_v_blocks_blog_feed" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_countdown_visibility_order_idx" ON "_landing_pages_v_blocks_countdown_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_countdown_visibility_parent_idx" ON "_landing_pages_v_blocks_countdown_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_countdown_order_idx" ON "_landing_pages_v_blocks_countdown" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_countdown_parent_id_idx" ON "_landing_pages_v_blocks_countdown" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_countdown_path_idx" ON "_landing_pages_v_blocks_countdown" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_social_items_order_idx" ON "_landing_pages_v_blocks_social_items" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_social_items_parent_id_idx" ON "_landing_pages_v_blocks_social_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_social_visibility_order_idx" ON "_landing_pages_v_blocks_social_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_social_visibility_parent_idx" ON "_landing_pages_v_blocks_social_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_social_order_idx" ON "_landing_pages_v_blocks_social" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_social_parent_id_idx" ON "_landing_pages_v_blocks_social" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_social_path_idx" ON "_landing_pages_v_blocks_social" USING btree ("_path");
  CREATE INDEX "_landing_pages_v_blocks_section_columns_order_idx" ON "_landing_pages_v_blocks_section_columns" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_section_columns_parent_id_idx" ON "_landing_pages_v_blocks_section_columns" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_section_visibility_order_idx" ON "_landing_pages_v_blocks_section_visibility" USING btree ("order");
  CREATE INDEX "_landing_pages_v_blocks_section_visibility_parent_idx" ON "_landing_pages_v_blocks_section_visibility" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_blocks_section_order_idx" ON "_landing_pages_v_blocks_section" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_blocks_section_parent_id_idx" ON "_landing_pages_v_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_blocks_section_path_idx" ON "_landing_pages_v_blocks_section" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_hero_visibility_order_idx" ON "page_templates_blocks_hero_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_hero_visibility_parent_idx" ON "page_templates_blocks_hero_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_pain_points_visibility_order_idx" ON "page_templates_blocks_pain_points_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_pain_points_visibility_parent_idx" ON "page_templates_blocks_pain_points_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_solutions_visibility_order_idx" ON "page_templates_blocks_solutions_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_solutions_visibility_parent_idx" ON "page_templates_blocks_solutions_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_pricing_visibility_order_idx" ON "page_templates_blocks_pricing_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_pricing_visibility_parent_idx" ON "page_templates_blocks_pricing_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_comparison_visibility_order_idx" ON "page_templates_blocks_comparison_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_comparison_visibility_parent_idx" ON "page_templates_blocks_comparison_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_steps_visibility_order_idx" ON "page_templates_blocks_steps_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_steps_visibility_parent_idx" ON "page_templates_blocks_steps_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_testimonials_visibility_order_idx" ON "page_templates_blocks_testimonials_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_testimonials_visibility_parent_idx" ON "page_templates_blocks_testimonials_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_guarantee_visibility_order_idx" ON "page_templates_blocks_guarantee_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_guarantee_visibility_parent_idx" ON "page_templates_blocks_guarantee_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_faq_visibility_order_idx" ON "page_templates_blocks_faq_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_faq_visibility_parent_idx" ON "page_templates_blocks_faq_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_rich_text_visibility_order_idx" ON "page_templates_blocks_rich_text_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_rich_text_visibility_parent_idx" ON "page_templates_blocks_rich_text_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_cta_visibility_order_idx" ON "page_templates_blocks_cta_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_cta_visibility_parent_idx" ON "page_templates_blocks_cta_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_gallery_visibility_order_idx" ON "page_templates_blocks_gallery_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_gallery_visibility_parent_idx" ON "page_templates_blocks_gallery_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_midwife_spotlight_visibility_order_idx" ON "page_templates_blocks_midwife_spotlight_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_midwife_spotlight_visibility_parent_idx" ON "page_templates_blocks_midwife_spotlight_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_heading_visibility_order_idx" ON "page_templates_blocks_heading_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_heading_visibility_parent_idx" ON "page_templates_blocks_heading_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_heading_order_idx" ON "page_templates_blocks_heading" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_heading_parent_id_idx" ON "page_templates_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_heading_path_idx" ON "page_templates_blocks_heading" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_image_visibility_order_idx" ON "page_templates_blocks_image_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_image_visibility_parent_idx" ON "page_templates_blocks_image_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_image_order_idx" ON "page_templates_blocks_image" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_image_parent_id_idx" ON "page_templates_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_image_path_idx" ON "page_templates_blocks_image" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_image_image_idx" ON "page_templates_blocks_image" USING btree ("image_id");
  CREATE INDEX "page_templates_blocks_button_visibility_order_idx" ON "page_templates_blocks_button_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_button_visibility_parent_idx" ON "page_templates_blocks_button_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_button_order_idx" ON "page_templates_blocks_button" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_button_parent_id_idx" ON "page_templates_blocks_button" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_button_path_idx" ON "page_templates_blocks_button" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_divider_visibility_order_idx" ON "page_templates_blocks_divider_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_divider_visibility_parent_idx" ON "page_templates_blocks_divider_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_divider_order_idx" ON "page_templates_blocks_divider" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_divider_parent_id_idx" ON "page_templates_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_divider_path_idx" ON "page_templates_blocks_divider" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_video_visibility_order_idx" ON "page_templates_blocks_video_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_video_visibility_parent_idx" ON "page_templates_blocks_video_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_video_order_idx" ON "page_templates_blocks_video" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_video_parent_id_idx" ON "page_templates_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_video_path_idx" ON "page_templates_blocks_video" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_stats_items_order_idx" ON "page_templates_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_stats_items_parent_id_idx" ON "page_templates_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_stats_visibility_order_idx" ON "page_templates_blocks_stats_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_stats_visibility_parent_idx" ON "page_templates_blocks_stats_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_stats_order_idx" ON "page_templates_blocks_stats" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_stats_parent_id_idx" ON "page_templates_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_stats_path_idx" ON "page_templates_blocks_stats" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_logos_items_order_idx" ON "page_templates_blocks_logos_items" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_logos_items_parent_id_idx" ON "page_templates_blocks_logos_items" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_logos_items_image_idx" ON "page_templates_blocks_logos_items" USING btree ("image_id");
  CREATE INDEX "page_templates_blocks_logos_visibility_order_idx" ON "page_templates_blocks_logos_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_logos_visibility_parent_idx" ON "page_templates_blocks_logos_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_logos_order_idx" ON "page_templates_blocks_logos" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_logos_parent_id_idx" ON "page_templates_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_logos_path_idx" ON "page_templates_blocks_logos" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_team_visibility_order_idx" ON "page_templates_blocks_team_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_team_visibility_parent_idx" ON "page_templates_blocks_team_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_team_order_idx" ON "page_templates_blocks_team" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_team_parent_id_idx" ON "page_templates_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_team_path_idx" ON "page_templates_blocks_team" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_tabs_tabs_order_idx" ON "page_templates_blocks_tabs_tabs" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_tabs_tabs_parent_id_idx" ON "page_templates_blocks_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_tabs_visibility_order_idx" ON "page_templates_blocks_tabs_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_tabs_visibility_parent_idx" ON "page_templates_blocks_tabs_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_tabs_order_idx" ON "page_templates_blocks_tabs" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_tabs_parent_id_idx" ON "page_templates_blocks_tabs" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_tabs_path_idx" ON "page_templates_blocks_tabs" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_lead_form_fields_order_idx" ON "page_templates_blocks_lead_form_fields" USING btree ("order");
  CREATE INDEX "page_templates_blocks_lead_form_fields_parent_idx" ON "page_templates_blocks_lead_form_fields" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_lead_form_service_options_order_idx" ON "page_templates_blocks_lead_form_service_options" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_lead_form_service_options_parent_id_idx" ON "page_templates_blocks_lead_form_service_options" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_lead_form_visibility_order_idx" ON "page_templates_blocks_lead_form_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_lead_form_visibility_parent_idx" ON "page_templates_blocks_lead_form_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_lead_form_order_idx" ON "page_templates_blocks_lead_form" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_lead_form_parent_id_idx" ON "page_templates_blocks_lead_form" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_lead_form_path_idx" ON "page_templates_blocks_lead_form" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_blog_feed_visibility_order_idx" ON "page_templates_blocks_blog_feed_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_blog_feed_visibility_parent_idx" ON "page_templates_blocks_blog_feed_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_blog_feed_order_idx" ON "page_templates_blocks_blog_feed" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_blog_feed_parent_id_idx" ON "page_templates_blocks_blog_feed" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_blog_feed_path_idx" ON "page_templates_blocks_blog_feed" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_countdown_visibility_order_idx" ON "page_templates_blocks_countdown_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_countdown_visibility_parent_idx" ON "page_templates_blocks_countdown_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_countdown_order_idx" ON "page_templates_blocks_countdown" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_countdown_parent_id_idx" ON "page_templates_blocks_countdown" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_countdown_path_idx" ON "page_templates_blocks_countdown" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_social_items_order_idx" ON "page_templates_blocks_social_items" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_social_items_parent_id_idx" ON "page_templates_blocks_social_items" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_social_visibility_order_idx" ON "page_templates_blocks_social_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_social_visibility_parent_idx" ON "page_templates_blocks_social_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_social_order_idx" ON "page_templates_blocks_social" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_social_parent_id_idx" ON "page_templates_blocks_social" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_social_path_idx" ON "page_templates_blocks_social" USING btree ("_path");
  CREATE INDEX "page_templates_blocks_section_columns_order_idx" ON "page_templates_blocks_section_columns" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_section_columns_parent_id_idx" ON "page_templates_blocks_section_columns" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_section_visibility_order_idx" ON "page_templates_blocks_section_visibility" USING btree ("order");
  CREATE INDEX "page_templates_blocks_section_visibility_parent_idx" ON "page_templates_blocks_section_visibility" USING btree ("parent_id");
  CREATE INDEX "page_templates_blocks_section_order_idx" ON "page_templates_blocks_section" USING btree ("_order");
  CREATE INDEX "page_templates_blocks_section_parent_id_idx" ON "page_templates_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "page_templates_blocks_section_path_idx" ON "page_templates_blocks_section" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_hero_visibility_order_idx" ON "block_templates_blocks_hero_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_hero_visibility_parent_idx" ON "block_templates_blocks_hero_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_pain_points_visibility_order_idx" ON "block_templates_blocks_pain_points_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_pain_points_visibility_parent_idx" ON "block_templates_blocks_pain_points_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_solutions_visibility_order_idx" ON "block_templates_blocks_solutions_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_solutions_visibility_parent_idx" ON "block_templates_blocks_solutions_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_pricing_visibility_order_idx" ON "block_templates_blocks_pricing_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_pricing_visibility_parent_idx" ON "block_templates_blocks_pricing_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_comparison_visibility_order_idx" ON "block_templates_blocks_comparison_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_comparison_visibility_parent_idx" ON "block_templates_blocks_comparison_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_steps_visibility_order_idx" ON "block_templates_blocks_steps_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_steps_visibility_parent_idx" ON "block_templates_blocks_steps_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_testimonials_visibility_order_idx" ON "block_templates_blocks_testimonials_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_testimonials_visibility_parent_idx" ON "block_templates_blocks_testimonials_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_guarantee_visibility_order_idx" ON "block_templates_blocks_guarantee_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_guarantee_visibility_parent_idx" ON "block_templates_blocks_guarantee_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_faq_visibility_order_idx" ON "block_templates_blocks_faq_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_faq_visibility_parent_idx" ON "block_templates_blocks_faq_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_rich_text_visibility_order_idx" ON "block_templates_blocks_rich_text_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_rich_text_visibility_parent_idx" ON "block_templates_blocks_rich_text_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_cta_visibility_order_idx" ON "block_templates_blocks_cta_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_cta_visibility_parent_idx" ON "block_templates_blocks_cta_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_gallery_visibility_order_idx" ON "block_templates_blocks_gallery_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_gallery_visibility_parent_idx" ON "block_templates_blocks_gallery_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_midwife_spotlight_visibility_order_idx" ON "block_templates_blocks_midwife_spotlight_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_midwife_spotlight_visibility_parent_idx" ON "block_templates_blocks_midwife_spotlight_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_heading_visibility_order_idx" ON "block_templates_blocks_heading_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_heading_visibility_parent_idx" ON "block_templates_blocks_heading_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_heading_order_idx" ON "block_templates_blocks_heading" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_heading_parent_id_idx" ON "block_templates_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_heading_path_idx" ON "block_templates_blocks_heading" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_image_visibility_order_idx" ON "block_templates_blocks_image_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_image_visibility_parent_idx" ON "block_templates_blocks_image_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_image_order_idx" ON "block_templates_blocks_image" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_image_parent_id_idx" ON "block_templates_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_image_path_idx" ON "block_templates_blocks_image" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_image_image_idx" ON "block_templates_blocks_image" USING btree ("image_id");
  CREATE INDEX "block_templates_blocks_button_visibility_order_idx" ON "block_templates_blocks_button_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_button_visibility_parent_idx" ON "block_templates_blocks_button_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_button_order_idx" ON "block_templates_blocks_button" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_button_parent_id_idx" ON "block_templates_blocks_button" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_button_path_idx" ON "block_templates_blocks_button" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_divider_visibility_order_idx" ON "block_templates_blocks_divider_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_divider_visibility_parent_idx" ON "block_templates_blocks_divider_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_divider_order_idx" ON "block_templates_blocks_divider" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_divider_parent_id_idx" ON "block_templates_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_divider_path_idx" ON "block_templates_blocks_divider" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_video_visibility_order_idx" ON "block_templates_blocks_video_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_video_visibility_parent_idx" ON "block_templates_blocks_video_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_video_order_idx" ON "block_templates_blocks_video" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_video_parent_id_idx" ON "block_templates_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_video_path_idx" ON "block_templates_blocks_video" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_stats_items_order_idx" ON "block_templates_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_stats_items_parent_id_idx" ON "block_templates_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_stats_visibility_order_idx" ON "block_templates_blocks_stats_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_stats_visibility_parent_idx" ON "block_templates_blocks_stats_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_stats_order_idx" ON "block_templates_blocks_stats" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_stats_parent_id_idx" ON "block_templates_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_stats_path_idx" ON "block_templates_blocks_stats" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_logos_items_order_idx" ON "block_templates_blocks_logos_items" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_logos_items_parent_id_idx" ON "block_templates_blocks_logos_items" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_logos_items_image_idx" ON "block_templates_blocks_logos_items" USING btree ("image_id");
  CREATE INDEX "block_templates_blocks_logos_visibility_order_idx" ON "block_templates_blocks_logos_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_logos_visibility_parent_idx" ON "block_templates_blocks_logos_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_logos_order_idx" ON "block_templates_blocks_logos" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_logos_parent_id_idx" ON "block_templates_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_logos_path_idx" ON "block_templates_blocks_logos" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_team_visibility_order_idx" ON "block_templates_blocks_team_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_team_visibility_parent_idx" ON "block_templates_blocks_team_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_team_order_idx" ON "block_templates_blocks_team" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_team_parent_id_idx" ON "block_templates_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_team_path_idx" ON "block_templates_blocks_team" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_tabs_tabs_order_idx" ON "block_templates_blocks_tabs_tabs" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_tabs_tabs_parent_id_idx" ON "block_templates_blocks_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_tabs_visibility_order_idx" ON "block_templates_blocks_tabs_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_tabs_visibility_parent_idx" ON "block_templates_blocks_tabs_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_tabs_order_idx" ON "block_templates_blocks_tabs" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_tabs_parent_id_idx" ON "block_templates_blocks_tabs" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_tabs_path_idx" ON "block_templates_blocks_tabs" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_lead_form_fields_order_idx" ON "block_templates_blocks_lead_form_fields" USING btree ("order");
  CREATE INDEX "block_templates_blocks_lead_form_fields_parent_idx" ON "block_templates_blocks_lead_form_fields" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_lead_form_service_options_order_idx" ON "block_templates_blocks_lead_form_service_options" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_lead_form_service_options_parent_id_idx" ON "block_templates_blocks_lead_form_service_options" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_lead_form_visibility_order_idx" ON "block_templates_blocks_lead_form_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_lead_form_visibility_parent_idx" ON "block_templates_blocks_lead_form_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_lead_form_order_idx" ON "block_templates_blocks_lead_form" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_lead_form_parent_id_idx" ON "block_templates_blocks_lead_form" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_lead_form_path_idx" ON "block_templates_blocks_lead_form" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_blog_feed_visibility_order_idx" ON "block_templates_blocks_blog_feed_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_blog_feed_visibility_parent_idx" ON "block_templates_blocks_blog_feed_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_blog_feed_order_idx" ON "block_templates_blocks_blog_feed" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_blog_feed_parent_id_idx" ON "block_templates_blocks_blog_feed" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_blog_feed_path_idx" ON "block_templates_blocks_blog_feed" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_countdown_visibility_order_idx" ON "block_templates_blocks_countdown_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_countdown_visibility_parent_idx" ON "block_templates_blocks_countdown_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_countdown_order_idx" ON "block_templates_blocks_countdown" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_countdown_parent_id_idx" ON "block_templates_blocks_countdown" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_countdown_path_idx" ON "block_templates_blocks_countdown" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_social_items_order_idx" ON "block_templates_blocks_social_items" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_social_items_parent_id_idx" ON "block_templates_blocks_social_items" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_social_visibility_order_idx" ON "block_templates_blocks_social_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_social_visibility_parent_idx" ON "block_templates_blocks_social_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_social_order_idx" ON "block_templates_blocks_social" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_social_parent_id_idx" ON "block_templates_blocks_social" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_social_path_idx" ON "block_templates_blocks_social" USING btree ("_path");
  CREATE INDEX "block_templates_blocks_section_columns_order_idx" ON "block_templates_blocks_section_columns" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_section_columns_parent_id_idx" ON "block_templates_blocks_section_columns" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_section_visibility_order_idx" ON "block_templates_blocks_section_visibility" USING btree ("order");
  CREATE INDEX "block_templates_blocks_section_visibility_parent_idx" ON "block_templates_blocks_section_visibility" USING btree ("parent_id");
  CREATE INDEX "block_templates_blocks_section_order_idx" ON "block_templates_blocks_section" USING btree ("_order");
  CREATE INDEX "block_templates_blocks_section_parent_id_idx" ON "block_templates_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "block_templates_blocks_section_path_idx" ON "block_templates_blocks_section" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_hero_visibility_order_idx" ON "_block_templates_v_blocks_hero_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_hero_visibility_parent_idx" ON "_block_templates_v_blocks_hero_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_pain_points_visibility_order_idx" ON "_block_templates_v_blocks_pain_points_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_pain_points_visibility_parent_idx" ON "_block_templates_v_blocks_pain_points_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_solutions_visibility_order_idx" ON "_block_templates_v_blocks_solutions_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_solutions_visibility_parent_idx" ON "_block_templates_v_blocks_solutions_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_pricing_visibility_order_idx" ON "_block_templates_v_blocks_pricing_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_pricing_visibility_parent_idx" ON "_block_templates_v_blocks_pricing_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_comparison_visibility_order_idx" ON "_block_templates_v_blocks_comparison_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_comparison_visibility_parent_idx" ON "_block_templates_v_blocks_comparison_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_steps_visibility_order_idx" ON "_block_templates_v_blocks_steps_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_steps_visibility_parent_idx" ON "_block_templates_v_blocks_steps_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_testimonials_visibility_order_idx" ON "_block_templates_v_blocks_testimonials_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_testimonials_visibility_parent_idx" ON "_block_templates_v_blocks_testimonials_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_guarantee_visibility_order_idx" ON "_block_templates_v_blocks_guarantee_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_guarantee_visibility_parent_idx" ON "_block_templates_v_blocks_guarantee_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_faq_visibility_order_idx" ON "_block_templates_v_blocks_faq_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_faq_visibility_parent_idx" ON "_block_templates_v_blocks_faq_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_rich_text_visibility_order_idx" ON "_block_templates_v_blocks_rich_text_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_rich_text_visibility_parent_idx" ON "_block_templates_v_blocks_rich_text_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_cta_visibility_order_idx" ON "_block_templates_v_blocks_cta_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_cta_visibility_parent_idx" ON "_block_templates_v_blocks_cta_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_gallery_visibility_order_idx" ON "_block_templates_v_blocks_gallery_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_gallery_visibility_parent_idx" ON "_block_templates_v_blocks_gallery_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_midwife_spotlight_visibility_order_idx" ON "_block_templates_v_blocks_midwife_spotlight_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_midwife_spotlight_visibility_parent_idx" ON "_block_templates_v_blocks_midwife_spotlight_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_heading_visibility_order_idx" ON "_block_templates_v_blocks_heading_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_heading_visibility_parent_idx" ON "_block_templates_v_blocks_heading_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_heading_order_idx" ON "_block_templates_v_blocks_heading" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_heading_parent_id_idx" ON "_block_templates_v_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_heading_path_idx" ON "_block_templates_v_blocks_heading" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_image_visibility_order_idx" ON "_block_templates_v_blocks_image_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_image_visibility_parent_idx" ON "_block_templates_v_blocks_image_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_image_order_idx" ON "_block_templates_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_image_parent_id_idx" ON "_block_templates_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_image_path_idx" ON "_block_templates_v_blocks_image" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_image_image_idx" ON "_block_templates_v_blocks_image" USING btree ("image_id");
  CREATE INDEX "_block_templates_v_blocks_button_visibility_order_idx" ON "_block_templates_v_blocks_button_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_button_visibility_parent_idx" ON "_block_templates_v_blocks_button_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_button_order_idx" ON "_block_templates_v_blocks_button" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_button_parent_id_idx" ON "_block_templates_v_blocks_button" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_button_path_idx" ON "_block_templates_v_blocks_button" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_divider_visibility_order_idx" ON "_block_templates_v_blocks_divider_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_divider_visibility_parent_idx" ON "_block_templates_v_blocks_divider_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_divider_order_idx" ON "_block_templates_v_blocks_divider" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_divider_parent_id_idx" ON "_block_templates_v_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_divider_path_idx" ON "_block_templates_v_blocks_divider" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_video_visibility_order_idx" ON "_block_templates_v_blocks_video_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_video_visibility_parent_idx" ON "_block_templates_v_blocks_video_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_video_order_idx" ON "_block_templates_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_video_parent_id_idx" ON "_block_templates_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_video_path_idx" ON "_block_templates_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_stats_items_order_idx" ON "_block_templates_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_stats_items_parent_id_idx" ON "_block_templates_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_stats_visibility_order_idx" ON "_block_templates_v_blocks_stats_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_stats_visibility_parent_idx" ON "_block_templates_v_blocks_stats_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_stats_order_idx" ON "_block_templates_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_stats_parent_id_idx" ON "_block_templates_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_stats_path_idx" ON "_block_templates_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_logos_items_order_idx" ON "_block_templates_v_blocks_logos_items" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_logos_items_parent_id_idx" ON "_block_templates_v_blocks_logos_items" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_logos_items_image_idx" ON "_block_templates_v_blocks_logos_items" USING btree ("image_id");
  CREATE INDEX "_block_templates_v_blocks_logos_visibility_order_idx" ON "_block_templates_v_blocks_logos_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_logos_visibility_parent_idx" ON "_block_templates_v_blocks_logos_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_logos_order_idx" ON "_block_templates_v_blocks_logos" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_logos_parent_id_idx" ON "_block_templates_v_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_logos_path_idx" ON "_block_templates_v_blocks_logos" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_team_visibility_order_idx" ON "_block_templates_v_blocks_team_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_team_visibility_parent_idx" ON "_block_templates_v_blocks_team_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_team_order_idx" ON "_block_templates_v_blocks_team" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_team_parent_id_idx" ON "_block_templates_v_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_team_path_idx" ON "_block_templates_v_blocks_team" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_tabs_tabs_order_idx" ON "_block_templates_v_blocks_tabs_tabs" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_tabs_tabs_parent_id_idx" ON "_block_templates_v_blocks_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_tabs_visibility_order_idx" ON "_block_templates_v_blocks_tabs_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_tabs_visibility_parent_idx" ON "_block_templates_v_blocks_tabs_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_tabs_order_idx" ON "_block_templates_v_blocks_tabs" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_tabs_parent_id_idx" ON "_block_templates_v_blocks_tabs" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_tabs_path_idx" ON "_block_templates_v_blocks_tabs" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_lead_form_fields_order_idx" ON "_block_templates_v_blocks_lead_form_fields" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_lead_form_fields_parent_idx" ON "_block_templates_v_blocks_lead_form_fields" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_lead_form_service_options_order_idx" ON "_block_templates_v_blocks_lead_form_service_options" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_lead_form_service_options_parent_id_idx" ON "_block_templates_v_blocks_lead_form_service_options" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_lead_form_visibility_order_idx" ON "_block_templates_v_blocks_lead_form_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_lead_form_visibility_parent_idx" ON "_block_templates_v_blocks_lead_form_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_lead_form_order_idx" ON "_block_templates_v_blocks_lead_form" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_lead_form_parent_id_idx" ON "_block_templates_v_blocks_lead_form" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_lead_form_path_idx" ON "_block_templates_v_blocks_lead_form" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_blog_feed_visibility_order_idx" ON "_block_templates_v_blocks_blog_feed_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_blog_feed_visibility_parent_idx" ON "_block_templates_v_blocks_blog_feed_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_blog_feed_order_idx" ON "_block_templates_v_blocks_blog_feed" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_blog_feed_parent_id_idx" ON "_block_templates_v_blocks_blog_feed" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_blog_feed_path_idx" ON "_block_templates_v_blocks_blog_feed" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_countdown_visibility_order_idx" ON "_block_templates_v_blocks_countdown_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_countdown_visibility_parent_idx" ON "_block_templates_v_blocks_countdown_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_countdown_order_idx" ON "_block_templates_v_blocks_countdown" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_countdown_parent_id_idx" ON "_block_templates_v_blocks_countdown" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_countdown_path_idx" ON "_block_templates_v_blocks_countdown" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_social_items_order_idx" ON "_block_templates_v_blocks_social_items" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_social_items_parent_id_idx" ON "_block_templates_v_blocks_social_items" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_social_visibility_order_idx" ON "_block_templates_v_blocks_social_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_social_visibility_parent_idx" ON "_block_templates_v_blocks_social_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_social_order_idx" ON "_block_templates_v_blocks_social" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_social_parent_id_idx" ON "_block_templates_v_blocks_social" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_social_path_idx" ON "_block_templates_v_blocks_social" USING btree ("_path");
  CREATE INDEX "_block_templates_v_blocks_section_columns_order_idx" ON "_block_templates_v_blocks_section_columns" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_section_columns_parent_id_idx" ON "_block_templates_v_blocks_section_columns" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_section_visibility_order_idx" ON "_block_templates_v_blocks_section_visibility" USING btree ("order");
  CREATE INDEX "_block_templates_v_blocks_section_visibility_parent_idx" ON "_block_templates_v_blocks_section_visibility" USING btree ("parent_id");
  CREATE INDEX "_block_templates_v_blocks_section_order_idx" ON "_block_templates_v_blocks_section" USING btree ("_order");
  CREATE INDEX "_block_templates_v_blocks_section_parent_id_idx" ON "_block_templates_v_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "_block_templates_v_blocks_section_path_idx" ON "_block_templates_v_blocks_section" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_visibility" CASCADE;
  DROP TABLE "pages_blocks_pain_points_visibility" CASCADE;
  DROP TABLE "pages_blocks_solutions_visibility" CASCADE;
  DROP TABLE "pages_blocks_pricing_visibility" CASCADE;
  DROP TABLE "pages_blocks_comparison_visibility" CASCADE;
  DROP TABLE "pages_blocks_steps_visibility" CASCADE;
  DROP TABLE "pages_blocks_testimonials_visibility" CASCADE;
  DROP TABLE "pages_blocks_guarantee_visibility" CASCADE;
  DROP TABLE "pages_blocks_faq_visibility" CASCADE;
  DROP TABLE "pages_blocks_rich_text_visibility" CASCADE;
  DROP TABLE "pages_blocks_cta_visibility" CASCADE;
  DROP TABLE "pages_blocks_gallery_visibility" CASCADE;
  DROP TABLE "pages_blocks_midwife_spotlight_visibility" CASCADE;
  DROP TABLE "pages_blocks_heading_visibility" CASCADE;
  DROP TABLE "pages_blocks_heading" CASCADE;
  DROP TABLE "pages_blocks_image_visibility" CASCADE;
  DROP TABLE "pages_blocks_image" CASCADE;
  DROP TABLE "pages_blocks_button_visibility" CASCADE;
  DROP TABLE "pages_blocks_button" CASCADE;
  DROP TABLE "pages_blocks_divider_visibility" CASCADE;
  DROP TABLE "pages_blocks_divider" CASCADE;
  DROP TABLE "pages_blocks_video_visibility" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats_visibility" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_logos_items" CASCADE;
  DROP TABLE "pages_blocks_logos_visibility" CASCADE;
  DROP TABLE "pages_blocks_logos" CASCADE;
  DROP TABLE "pages_blocks_team_visibility" CASCADE;
  DROP TABLE "pages_blocks_team" CASCADE;
  DROP TABLE "pages_blocks_tabs_tabs" CASCADE;
  DROP TABLE "pages_blocks_tabs_visibility" CASCADE;
  DROP TABLE "pages_blocks_tabs" CASCADE;
  DROP TABLE "pages_blocks_lead_form_fields" CASCADE;
  DROP TABLE "pages_blocks_lead_form_service_options" CASCADE;
  DROP TABLE "pages_blocks_lead_form_visibility" CASCADE;
  DROP TABLE "pages_blocks_lead_form" CASCADE;
  DROP TABLE "pages_blocks_blog_feed_visibility" CASCADE;
  DROP TABLE "pages_blocks_blog_feed" CASCADE;
  DROP TABLE "pages_blocks_countdown_visibility" CASCADE;
  DROP TABLE "pages_blocks_countdown" CASCADE;
  DROP TABLE "pages_blocks_social_items" CASCADE;
  DROP TABLE "pages_blocks_social_visibility" CASCADE;
  DROP TABLE "pages_blocks_social" CASCADE;
  DROP TABLE "pages_blocks_section_columns" CASCADE;
  DROP TABLE "pages_blocks_section_visibility" CASCADE;
  DROP TABLE "pages_blocks_section" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_pain_points_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_solutions_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_guarantee_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_midwife_spotlight_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_heading_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_heading" CASCADE;
  DROP TABLE "_pages_v_blocks_image_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_image" CASCADE;
  DROP TABLE "_pages_v_blocks_button_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_button" CASCADE;
  DROP TABLE "_pages_v_blocks_divider_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_divider" CASCADE;
  DROP TABLE "_pages_v_blocks_video_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_logos_items" CASCADE;
  DROP TABLE "_pages_v_blocks_logos_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_team_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_team" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_lead_form_fields" CASCADE;
  DROP TABLE "_pages_v_blocks_lead_form_service_options" CASCADE;
  DROP TABLE "_pages_v_blocks_lead_form_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_lead_form" CASCADE;
  DROP TABLE "_pages_v_blocks_blog_feed_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_blog_feed" CASCADE;
  DROP TABLE "_pages_v_blocks_countdown_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_countdown" CASCADE;
  DROP TABLE "_pages_v_blocks_social_items" CASCADE;
  DROP TABLE "_pages_v_blocks_social_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_social" CASCADE;
  DROP TABLE "_pages_v_blocks_section_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_section_visibility" CASCADE;
  DROP TABLE "_pages_v_blocks_section" CASCADE;
  DROP TABLE "landing_pages_blocks_hero_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_pain_points_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_solutions_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_pricing_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_comparison_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_steps_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_testimonials_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_guarantee_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_faq_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_rich_text_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_cta_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_gallery_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_midwife_spotlight_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_heading_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_heading" CASCADE;
  DROP TABLE "landing_pages_blocks_image_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_image" CASCADE;
  DROP TABLE "landing_pages_blocks_button_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_button" CASCADE;
  DROP TABLE "landing_pages_blocks_divider_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_divider" CASCADE;
  DROP TABLE "landing_pages_blocks_video_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_video" CASCADE;
  DROP TABLE "landing_pages_blocks_stats_items" CASCADE;
  DROP TABLE "landing_pages_blocks_stats_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_stats" CASCADE;
  DROP TABLE "landing_pages_blocks_logos_items" CASCADE;
  DROP TABLE "landing_pages_blocks_logos_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_logos" CASCADE;
  DROP TABLE "landing_pages_blocks_team_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_team" CASCADE;
  DROP TABLE "landing_pages_blocks_tabs_tabs" CASCADE;
  DROP TABLE "landing_pages_blocks_tabs_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_tabs" CASCADE;
  DROP TABLE "landing_pages_blocks_lead_form_fields" CASCADE;
  DROP TABLE "landing_pages_blocks_lead_form_service_options" CASCADE;
  DROP TABLE "landing_pages_blocks_lead_form_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_lead_form" CASCADE;
  DROP TABLE "landing_pages_blocks_blog_feed_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_blog_feed" CASCADE;
  DROP TABLE "landing_pages_blocks_countdown_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_countdown" CASCADE;
  DROP TABLE "landing_pages_blocks_social_items" CASCADE;
  DROP TABLE "landing_pages_blocks_social_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_social" CASCADE;
  DROP TABLE "landing_pages_blocks_section_columns" CASCADE;
  DROP TABLE "landing_pages_blocks_section_visibility" CASCADE;
  DROP TABLE "landing_pages_blocks_section" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_hero_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_pain_points_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_solutions_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_pricing_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_comparison_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_steps_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_testimonials_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_guarantee_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_faq_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_rich_text_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_cta_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_gallery_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_midwife_spotlight_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_heading_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_heading" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_image_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_image" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_button_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_button" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_divider_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_divider" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_video_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_video" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_stats_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_logos_items" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_logos_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_logos" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_team_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_team" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_tabs_tabs" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_tabs_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_tabs" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_lead_form_fields" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_lead_form_service_options" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_lead_form_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_lead_form" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_blog_feed_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_blog_feed" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_countdown_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_countdown" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_social_items" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_social_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_social" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_section_columns" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_section_visibility" CASCADE;
  DROP TABLE "_landing_pages_v_blocks_section" CASCADE;
  DROP TABLE "page_templates_blocks_hero_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_pain_points_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_solutions_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_pricing_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_comparison_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_steps_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_testimonials_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_guarantee_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_faq_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_rich_text_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_cta_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_gallery_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_midwife_spotlight_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_heading_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_heading" CASCADE;
  DROP TABLE "page_templates_blocks_image_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_image" CASCADE;
  DROP TABLE "page_templates_blocks_button_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_button" CASCADE;
  DROP TABLE "page_templates_blocks_divider_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_divider" CASCADE;
  DROP TABLE "page_templates_blocks_video_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_video" CASCADE;
  DROP TABLE "page_templates_blocks_stats_items" CASCADE;
  DROP TABLE "page_templates_blocks_stats_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_stats" CASCADE;
  DROP TABLE "page_templates_blocks_logos_items" CASCADE;
  DROP TABLE "page_templates_blocks_logos_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_logos" CASCADE;
  DROP TABLE "page_templates_blocks_team_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_team" CASCADE;
  DROP TABLE "page_templates_blocks_tabs_tabs" CASCADE;
  DROP TABLE "page_templates_blocks_tabs_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_tabs" CASCADE;
  DROP TABLE "page_templates_blocks_lead_form_fields" CASCADE;
  DROP TABLE "page_templates_blocks_lead_form_service_options" CASCADE;
  DROP TABLE "page_templates_blocks_lead_form_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_lead_form" CASCADE;
  DROP TABLE "page_templates_blocks_blog_feed_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_blog_feed" CASCADE;
  DROP TABLE "page_templates_blocks_countdown_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_countdown" CASCADE;
  DROP TABLE "page_templates_blocks_social_items" CASCADE;
  DROP TABLE "page_templates_blocks_social_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_social" CASCADE;
  DROP TABLE "page_templates_blocks_section_columns" CASCADE;
  DROP TABLE "page_templates_blocks_section_visibility" CASCADE;
  DROP TABLE "page_templates_blocks_section" CASCADE;
  DROP TABLE "block_templates_blocks_hero_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_pain_points_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_solutions_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_pricing_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_comparison_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_steps_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_testimonials_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_guarantee_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_faq_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_rich_text_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_cta_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_gallery_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_midwife_spotlight_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_heading_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_heading" CASCADE;
  DROP TABLE "block_templates_blocks_image_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_image" CASCADE;
  DROP TABLE "block_templates_blocks_button_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_button" CASCADE;
  DROP TABLE "block_templates_blocks_divider_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_divider" CASCADE;
  DROP TABLE "block_templates_blocks_video_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_video" CASCADE;
  DROP TABLE "block_templates_blocks_stats_items" CASCADE;
  DROP TABLE "block_templates_blocks_stats_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_stats" CASCADE;
  DROP TABLE "block_templates_blocks_logos_items" CASCADE;
  DROP TABLE "block_templates_blocks_logos_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_logos" CASCADE;
  DROP TABLE "block_templates_blocks_team_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_team" CASCADE;
  DROP TABLE "block_templates_blocks_tabs_tabs" CASCADE;
  DROP TABLE "block_templates_blocks_tabs_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_tabs" CASCADE;
  DROP TABLE "block_templates_blocks_lead_form_fields" CASCADE;
  DROP TABLE "block_templates_blocks_lead_form_service_options" CASCADE;
  DROP TABLE "block_templates_blocks_lead_form_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_lead_form" CASCADE;
  DROP TABLE "block_templates_blocks_blog_feed_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_blog_feed" CASCADE;
  DROP TABLE "block_templates_blocks_countdown_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_countdown" CASCADE;
  DROP TABLE "block_templates_blocks_social_items" CASCADE;
  DROP TABLE "block_templates_blocks_social_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_social" CASCADE;
  DROP TABLE "block_templates_blocks_section_columns" CASCADE;
  DROP TABLE "block_templates_blocks_section_visibility" CASCADE;
  DROP TABLE "block_templates_blocks_section" CASCADE;
  DROP TABLE "_block_templates_v_blocks_hero_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_pain_points_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_solutions_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_pricing_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_comparison_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_steps_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_testimonials_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_guarantee_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_faq_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_rich_text_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_cta_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_gallery_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_midwife_spotlight_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_heading_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_heading" CASCADE;
  DROP TABLE "_block_templates_v_blocks_image_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_image" CASCADE;
  DROP TABLE "_block_templates_v_blocks_button_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_button" CASCADE;
  DROP TABLE "_block_templates_v_blocks_divider_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_divider" CASCADE;
  DROP TABLE "_block_templates_v_blocks_video_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_video" CASCADE;
  DROP TABLE "_block_templates_v_blocks_stats_items" CASCADE;
  DROP TABLE "_block_templates_v_blocks_stats_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_stats" CASCADE;
  DROP TABLE "_block_templates_v_blocks_logos_items" CASCADE;
  DROP TABLE "_block_templates_v_blocks_logos_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_logos" CASCADE;
  DROP TABLE "_block_templates_v_blocks_team_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_team" CASCADE;
  DROP TABLE "_block_templates_v_blocks_tabs_tabs" CASCADE;
  DROP TABLE "_block_templates_v_blocks_tabs_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_tabs" CASCADE;
  DROP TABLE "_block_templates_v_blocks_lead_form_fields" CASCADE;
  DROP TABLE "_block_templates_v_blocks_lead_form_service_options" CASCADE;
  DROP TABLE "_block_templates_v_blocks_lead_form_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_lead_form" CASCADE;
  DROP TABLE "_block_templates_v_blocks_blog_feed_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_blog_feed" CASCADE;
  DROP TABLE "_block_templates_v_blocks_countdown_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_countdown" CASCADE;
  DROP TABLE "_block_templates_v_blocks_social_items" CASCADE;
  DROP TABLE "_block_templates_v_blocks_social_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_social" CASCADE;
  DROP TABLE "_block_templates_v_blocks_section_columns" CASCADE;
  DROP TABLE "_block_templates_v_blocks_section_visibility" CASCADE;
  DROP TABLE "_block_templates_v_blocks_section" CASCADE;
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_pain_points" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_solutions" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_pricing" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_comparison" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_steps" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_testimonials" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_guarantee" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_midwife_spotlight" DROP COLUMN "anchor_id";
  ALTER TABLE "pages" DROP COLUMN "editor_mode";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_pain_points" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_solutions" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_pricing" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_comparison" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_steps" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_testimonials" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_guarantee" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_midwife_spotlight" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_editor_mode";
  ALTER TABLE "landing_pages_blocks_hero" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_pain_points" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_solutions" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_pricing" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_comparison" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_steps" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_testimonials" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_guarantee" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_faq" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_rich_text" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_cta" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_gallery" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_midwife_spotlight" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages" DROP COLUMN "editor_mode";
  ALTER TABLE "_landing_pages_v_blocks_hero" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v_blocks_pain_points" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v_blocks_solutions" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v_blocks_pricing" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v_blocks_comparison" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v_blocks_steps" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v_blocks_testimonials" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v_blocks_guarantee" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v_blocks_faq" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v_blocks_rich_text" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v_blocks_cta" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v_blocks_gallery" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v_blocks_midwife_spotlight" DROP COLUMN "anchor_id";
  ALTER TABLE "_landing_pages_v" DROP COLUMN "version_editor_mode";
  ALTER TABLE "page_templates_blocks_hero" DROP COLUMN "anchor_id";
  ALTER TABLE "page_templates_blocks_pain_points" DROP COLUMN "anchor_id";
  ALTER TABLE "page_templates_blocks_solutions" DROP COLUMN "anchor_id";
  ALTER TABLE "page_templates_blocks_pricing" DROP COLUMN "anchor_id";
  ALTER TABLE "page_templates_blocks_comparison" DROP COLUMN "anchor_id";
  ALTER TABLE "page_templates_blocks_steps" DROP COLUMN "anchor_id";
  ALTER TABLE "page_templates_blocks_testimonials" DROP COLUMN "anchor_id";
  ALTER TABLE "page_templates_blocks_guarantee" DROP COLUMN "anchor_id";
  ALTER TABLE "page_templates_blocks_faq" DROP COLUMN "anchor_id";
  ALTER TABLE "page_templates_blocks_rich_text" DROP COLUMN "anchor_id";
  ALTER TABLE "page_templates_blocks_cta" DROP COLUMN "anchor_id";
  ALTER TABLE "page_templates_blocks_gallery" DROP COLUMN "anchor_id";
  ALTER TABLE "page_templates_blocks_midwife_spotlight" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_hero" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_pain_points" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_solutions" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_pricing" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_comparison" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_steps" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_testimonials" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_guarantee" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_faq" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_rich_text" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_cta" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_gallery" DROP COLUMN "anchor_id";
  ALTER TABLE "block_templates_blocks_midwife_spotlight" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_hero" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_pain_points" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_solutions" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_pricing" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_comparison" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_steps" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_testimonials" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_guarantee" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_faq" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_rich_text" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_cta" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_gallery" DROP COLUMN "anchor_id";
  ALTER TABLE "_block_templates_v_blocks_midwife_spotlight" DROP COLUMN "anchor_id";
  DROP TYPE "public"."enum_pages_blocks_hero_visibility";
  DROP TYPE "public"."enum_pages_blocks_pain_points_visibility";
  DROP TYPE "public"."enum_pages_blocks_solutions_visibility";
  DROP TYPE "public"."enum_pages_blocks_pricing_visibility";
  DROP TYPE "public"."enum_pages_blocks_comparison_visibility";
  DROP TYPE "public"."enum_pages_blocks_steps_visibility";
  DROP TYPE "public"."enum_pages_blocks_testimonials_visibility";
  DROP TYPE "public"."enum_pages_blocks_guarantee_visibility";
  DROP TYPE "public"."enum_pages_blocks_faq_visibility";
  DROP TYPE "public"."enum_pages_blocks_rich_text_visibility";
  DROP TYPE "public"."enum_pages_blocks_cta_visibility";
  DROP TYPE "public"."enum_pages_blocks_gallery_visibility";
  DROP TYPE "public"."enum_pages_blocks_midwife_spotlight_visibility";
  DROP TYPE "public"."enum_pages_blocks_heading_visibility";
  DROP TYPE "public"."enum_pages_blocks_heading_level";
  DROP TYPE "public"."enum_pages_blocks_heading_size";
  DROP TYPE "public"."enum_pages_blocks_heading_align";
  DROP TYPE "public"."enum_pages_blocks_image_visibility";
  DROP TYPE "public"."enum_pages_blocks_image_width";
  DROP TYPE "public"."enum_pages_blocks_image_align";
  DROP TYPE "public"."enum_pages_blocks_image_ratio";
  DROP TYPE "public"."enum_pages_blocks_image_rounded";
  DROP TYPE "public"."enum_pages_blocks_button_visibility";
  DROP TYPE "public"."enum_pages_blocks_button_action";
  DROP TYPE "public"."enum_pages_blocks_button_style";
  DROP TYPE "public"."enum_pages_blocks_button_size";
  DROP TYPE "public"."enum_pages_blocks_button_align";
  DROP TYPE "public"."enum_pages_blocks_divider_visibility";
  DROP TYPE "public"."enum_pages_blocks_divider_variant";
  DROP TYPE "public"."enum_pages_blocks_divider_spacing";
  DROP TYPE "public"."enum_pages_blocks_divider_width";
  DROP TYPE "public"."enum_pages_blocks_video_visibility";
  DROP TYPE "public"."enum_pages_blocks_video_ratio";
  DROP TYPE "public"."enum_pages_blocks_video_max_width";
  DROP TYPE "public"."enum_pages_blocks_stats_visibility";
  DROP TYPE "public"."enum_pages_blocks_stats_columns";
  DROP TYPE "public"."enum_pages_blocks_stats_background";
  DROP TYPE "public"."enum_pages_blocks_stats_style";
  DROP TYPE "public"."enum_pages_blocks_logos_visibility";
  DROP TYPE "public"."enum_pages_blocks_logos_columns";
  DROP TYPE "public"."enum_pages_blocks_logos_background";
  DROP TYPE "public"."enum_pages_blocks_team_visibility";
  DROP TYPE "public"."enum_pages_blocks_team_columns";
  DROP TYPE "public"."enum_pages_blocks_team_background";
  DROP TYPE "public"."enum_pages_blocks_tabs_visibility";
  DROP TYPE "public"."enum_pages_blocks_tabs_style";
  DROP TYPE "public"."enum_pages_blocks_tabs_background";
  DROP TYPE "public"."enum_pages_blocks_lead_form_fields";
  DROP TYPE "public"."enum_pages_blocks_lead_form_visibility";
  DROP TYPE "public"."enum_pages_blocks_lead_form_background";
  DROP TYPE "public"."enum_pages_blocks_blog_feed_visibility";
  DROP TYPE "public"."enum_pages_blocks_blog_feed_source";
  DROP TYPE "public"."enum_pages_blocks_blog_feed_category";
  DROP TYPE "public"."enum_pages_blocks_blog_feed_columns";
  DROP TYPE "public"."enum_pages_blocks_blog_feed_background";
  DROP TYPE "public"."enum_pages_blocks_countdown_visibility";
  DROP TYPE "public"."enum_pages_blocks_countdown_background";
  DROP TYPE "public"."enum_pages_blocks_social_items_platform";
  DROP TYPE "public"."enum_pages_blocks_social_visibility";
  DROP TYPE "public"."enum_pages_blocks_social_variant";
  DROP TYPE "public"."enum_pages_blocks_social_align";
  DROP TYPE "public"."enum_pages_blocks_social_background";
  DROP TYPE "public"."enum_pages_blocks_section_columns_width";
  DROP TYPE "public"."enum_pages_blocks_section_visibility";
  DROP TYPE "public"."enum_pages_blocks_section_background";
  DROP TYPE "public"."enum_pages_blocks_section_padding";
  DROP TYPE "public"."enum_pages_blocks_section_max_width";
  DROP TYPE "public"."enum_pages_blocks_section_gap";
  DROP TYPE "public"."enum_pages_editor_mode";
  DROP TYPE "public"."enum__pages_v_blocks_hero_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_pain_points_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_solutions_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_comparison_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_steps_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_guarantee_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_faq_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_cta_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_midwife_spotlight_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_heading_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_heading_size";
  DROP TYPE "public"."enum__pages_v_blocks_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_image_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_image_width";
  DROP TYPE "public"."enum__pages_v_blocks_image_align";
  DROP TYPE "public"."enum__pages_v_blocks_image_ratio";
  DROP TYPE "public"."enum__pages_v_blocks_image_rounded";
  DROP TYPE "public"."enum__pages_v_blocks_button_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_button_action";
  DROP TYPE "public"."enum__pages_v_blocks_button_style";
  DROP TYPE "public"."enum__pages_v_blocks_button_size";
  DROP TYPE "public"."enum__pages_v_blocks_button_align";
  DROP TYPE "public"."enum__pages_v_blocks_divider_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_divider_variant";
  DROP TYPE "public"."enum__pages_v_blocks_divider_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_divider_width";
  DROP TYPE "public"."enum__pages_v_blocks_video_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_video_ratio";
  DROP TYPE "public"."enum__pages_v_blocks_video_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_stats_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_stats_columns";
  DROP TYPE "public"."enum__pages_v_blocks_stats_background";
  DROP TYPE "public"."enum__pages_v_blocks_stats_style";
  DROP TYPE "public"."enum__pages_v_blocks_logos_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_logos_columns";
  DROP TYPE "public"."enum__pages_v_blocks_logos_background";
  DROP TYPE "public"."enum__pages_v_blocks_team_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_team_columns";
  DROP TYPE "public"."enum__pages_v_blocks_team_background";
  DROP TYPE "public"."enum__pages_v_blocks_tabs_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_tabs_style";
  DROP TYPE "public"."enum__pages_v_blocks_tabs_background";
  DROP TYPE "public"."enum__pages_v_blocks_lead_form_fields";
  DROP TYPE "public"."enum__pages_v_blocks_lead_form_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_lead_form_background";
  DROP TYPE "public"."enum__pages_v_blocks_blog_feed_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_blog_feed_source";
  DROP TYPE "public"."enum__pages_v_blocks_blog_feed_category";
  DROP TYPE "public"."enum__pages_v_blocks_blog_feed_columns";
  DROP TYPE "public"."enum__pages_v_blocks_blog_feed_background";
  DROP TYPE "public"."enum__pages_v_blocks_countdown_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_countdown_background";
  DROP TYPE "public"."enum__pages_v_blocks_social_items_platform";
  DROP TYPE "public"."enum__pages_v_blocks_social_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_social_variant";
  DROP TYPE "public"."enum__pages_v_blocks_social_align";
  DROP TYPE "public"."enum__pages_v_blocks_social_background";
  DROP TYPE "public"."enum__pages_v_blocks_section_columns_width";
  DROP TYPE "public"."enum__pages_v_blocks_section_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_section_padding";
  DROP TYPE "public"."enum__pages_v_blocks_section_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_section_gap";
  DROP TYPE "public"."enum__pages_v_version_editor_mode";
  DROP TYPE "public"."enum_landing_pages_blocks_hero_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_pain_points_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_solutions_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_pricing_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_comparison_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_steps_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_testimonials_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_guarantee_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_faq_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_rich_text_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_cta_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_gallery_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_midwife_spotlight_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_heading_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_heading_level";
  DROP TYPE "public"."enum_landing_pages_blocks_heading_size";
  DROP TYPE "public"."enum_landing_pages_blocks_heading_align";
  DROP TYPE "public"."enum_landing_pages_blocks_image_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_image_width";
  DROP TYPE "public"."enum_landing_pages_blocks_image_align";
  DROP TYPE "public"."enum_landing_pages_blocks_image_ratio";
  DROP TYPE "public"."enum_landing_pages_blocks_image_rounded";
  DROP TYPE "public"."enum_landing_pages_blocks_button_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_button_action";
  DROP TYPE "public"."enum_landing_pages_blocks_button_style";
  DROP TYPE "public"."enum_landing_pages_blocks_button_size";
  DROP TYPE "public"."enum_landing_pages_blocks_button_align";
  DROP TYPE "public"."enum_landing_pages_blocks_divider_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_divider_variant";
  DROP TYPE "public"."enum_landing_pages_blocks_divider_spacing";
  DROP TYPE "public"."enum_landing_pages_blocks_divider_width";
  DROP TYPE "public"."enum_landing_pages_blocks_video_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_video_ratio";
  DROP TYPE "public"."enum_landing_pages_blocks_video_max_width";
  DROP TYPE "public"."enum_landing_pages_blocks_stats_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_stats_columns";
  DROP TYPE "public"."enum_landing_pages_blocks_stats_background";
  DROP TYPE "public"."enum_landing_pages_blocks_stats_style";
  DROP TYPE "public"."enum_landing_pages_blocks_logos_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_logos_columns";
  DROP TYPE "public"."enum_landing_pages_blocks_logos_background";
  DROP TYPE "public"."enum_landing_pages_blocks_team_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_team_columns";
  DROP TYPE "public"."enum_landing_pages_blocks_team_background";
  DROP TYPE "public"."enum_landing_pages_blocks_tabs_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_tabs_style";
  DROP TYPE "public"."enum_landing_pages_blocks_tabs_background";
  DROP TYPE "public"."enum_landing_pages_blocks_lead_form_fields";
  DROP TYPE "public"."enum_landing_pages_blocks_lead_form_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_lead_form_background";
  DROP TYPE "public"."enum_landing_pages_blocks_blog_feed_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_blog_feed_source";
  DROP TYPE "public"."enum_landing_pages_blocks_blog_feed_category";
  DROP TYPE "public"."enum_landing_pages_blocks_blog_feed_columns";
  DROP TYPE "public"."enum_landing_pages_blocks_blog_feed_background";
  DROP TYPE "public"."enum_landing_pages_blocks_countdown_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_countdown_background";
  DROP TYPE "public"."enum_landing_pages_blocks_social_items_platform";
  DROP TYPE "public"."enum_landing_pages_blocks_social_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_social_variant";
  DROP TYPE "public"."enum_landing_pages_blocks_social_align";
  DROP TYPE "public"."enum_landing_pages_blocks_social_background";
  DROP TYPE "public"."enum_landing_pages_blocks_section_columns_width";
  DROP TYPE "public"."enum_landing_pages_blocks_section_visibility";
  DROP TYPE "public"."enum_landing_pages_blocks_section_background";
  DROP TYPE "public"."enum_landing_pages_blocks_section_padding";
  DROP TYPE "public"."enum_landing_pages_blocks_section_max_width";
  DROP TYPE "public"."enum_landing_pages_blocks_section_gap";
  DROP TYPE "public"."enum_landing_pages_editor_mode";
  DROP TYPE "public"."enum__landing_pages_v_blocks_hero_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_pain_points_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_solutions_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_pricing_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_comparison_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_steps_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_testimonials_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_guarantee_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_faq_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_rich_text_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_cta_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_gallery_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_midwife_spotlight_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_heading_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_heading_level";
  DROP TYPE "public"."enum__landing_pages_v_blocks_heading_size";
  DROP TYPE "public"."enum__landing_pages_v_blocks_heading_align";
  DROP TYPE "public"."enum__landing_pages_v_blocks_image_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_image_width";
  DROP TYPE "public"."enum__landing_pages_v_blocks_image_align";
  DROP TYPE "public"."enum__landing_pages_v_blocks_image_ratio";
  DROP TYPE "public"."enum__landing_pages_v_blocks_image_rounded";
  DROP TYPE "public"."enum__landing_pages_v_blocks_button_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_button_action";
  DROP TYPE "public"."enum__landing_pages_v_blocks_button_style";
  DROP TYPE "public"."enum__landing_pages_v_blocks_button_size";
  DROP TYPE "public"."enum__landing_pages_v_blocks_button_align";
  DROP TYPE "public"."enum__landing_pages_v_blocks_divider_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_divider_variant";
  DROP TYPE "public"."enum__landing_pages_v_blocks_divider_spacing";
  DROP TYPE "public"."enum__landing_pages_v_blocks_divider_width";
  DROP TYPE "public"."enum__landing_pages_v_blocks_video_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_video_ratio";
  DROP TYPE "public"."enum__landing_pages_v_blocks_video_max_width";
  DROP TYPE "public"."enum__landing_pages_v_blocks_stats_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_stats_columns";
  DROP TYPE "public"."enum__landing_pages_v_blocks_stats_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_stats_style";
  DROP TYPE "public"."enum__landing_pages_v_blocks_logos_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_logos_columns";
  DROP TYPE "public"."enum__landing_pages_v_blocks_logos_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_team_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_team_columns";
  DROP TYPE "public"."enum__landing_pages_v_blocks_team_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_tabs_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_tabs_style";
  DROP TYPE "public"."enum__landing_pages_v_blocks_tabs_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_lead_form_fields";
  DROP TYPE "public"."enum__landing_pages_v_blocks_lead_form_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_lead_form_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_blog_feed_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_blog_feed_source";
  DROP TYPE "public"."enum__landing_pages_v_blocks_blog_feed_category";
  DROP TYPE "public"."enum__landing_pages_v_blocks_blog_feed_columns";
  DROP TYPE "public"."enum__landing_pages_v_blocks_blog_feed_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_countdown_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_countdown_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_social_items_platform";
  DROP TYPE "public"."enum__landing_pages_v_blocks_social_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_social_variant";
  DROP TYPE "public"."enum__landing_pages_v_blocks_social_align";
  DROP TYPE "public"."enum__landing_pages_v_blocks_social_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_section_columns_width";
  DROP TYPE "public"."enum__landing_pages_v_blocks_section_visibility";
  DROP TYPE "public"."enum__landing_pages_v_blocks_section_background";
  DROP TYPE "public"."enum__landing_pages_v_blocks_section_padding";
  DROP TYPE "public"."enum__landing_pages_v_blocks_section_max_width";
  DROP TYPE "public"."enum__landing_pages_v_blocks_section_gap";
  DROP TYPE "public"."enum__landing_pages_v_version_editor_mode";
  DROP TYPE "public"."enum_page_templates_blocks_hero_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_pain_points_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_solutions_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_pricing_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_comparison_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_steps_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_testimonials_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_guarantee_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_faq_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_rich_text_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_cta_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_gallery_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_midwife_spotlight_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_heading_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_heading_level";
  DROP TYPE "public"."enum_page_templates_blocks_heading_size";
  DROP TYPE "public"."enum_page_templates_blocks_heading_align";
  DROP TYPE "public"."enum_page_templates_blocks_image_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_image_width";
  DROP TYPE "public"."enum_page_templates_blocks_image_align";
  DROP TYPE "public"."enum_page_templates_blocks_image_ratio";
  DROP TYPE "public"."enum_page_templates_blocks_image_rounded";
  DROP TYPE "public"."enum_page_templates_blocks_button_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_button_action";
  DROP TYPE "public"."enum_page_templates_blocks_button_style";
  DROP TYPE "public"."enum_page_templates_blocks_button_size";
  DROP TYPE "public"."enum_page_templates_blocks_button_align";
  DROP TYPE "public"."enum_page_templates_blocks_divider_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_divider_variant";
  DROP TYPE "public"."enum_page_templates_blocks_divider_spacing";
  DROP TYPE "public"."enum_page_templates_blocks_divider_width";
  DROP TYPE "public"."enum_page_templates_blocks_video_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_video_ratio";
  DROP TYPE "public"."enum_page_templates_blocks_video_max_width";
  DROP TYPE "public"."enum_page_templates_blocks_stats_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_stats_columns";
  DROP TYPE "public"."enum_page_templates_blocks_stats_background";
  DROP TYPE "public"."enum_page_templates_blocks_stats_style";
  DROP TYPE "public"."enum_page_templates_blocks_logos_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_logos_columns";
  DROP TYPE "public"."enum_page_templates_blocks_logos_background";
  DROP TYPE "public"."enum_page_templates_blocks_team_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_team_columns";
  DROP TYPE "public"."enum_page_templates_blocks_team_background";
  DROP TYPE "public"."enum_page_templates_blocks_tabs_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_tabs_style";
  DROP TYPE "public"."enum_page_templates_blocks_tabs_background";
  DROP TYPE "public"."enum_page_templates_blocks_lead_form_fields";
  DROP TYPE "public"."enum_page_templates_blocks_lead_form_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_lead_form_background";
  DROP TYPE "public"."enum_page_templates_blocks_blog_feed_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_blog_feed_source";
  DROP TYPE "public"."enum_page_templates_blocks_blog_feed_category";
  DROP TYPE "public"."enum_page_templates_blocks_blog_feed_columns";
  DROP TYPE "public"."enum_page_templates_blocks_blog_feed_background";
  DROP TYPE "public"."enum_page_templates_blocks_countdown_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_countdown_background";
  DROP TYPE "public"."enum_page_templates_blocks_social_items_platform";
  DROP TYPE "public"."enum_page_templates_blocks_social_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_social_variant";
  DROP TYPE "public"."enum_page_templates_blocks_social_align";
  DROP TYPE "public"."enum_page_templates_blocks_social_background";
  DROP TYPE "public"."enum_page_templates_blocks_section_columns_width";
  DROP TYPE "public"."enum_page_templates_blocks_section_visibility";
  DROP TYPE "public"."enum_page_templates_blocks_section_background";
  DROP TYPE "public"."enum_page_templates_blocks_section_padding";
  DROP TYPE "public"."enum_page_templates_blocks_section_max_width";
  DROP TYPE "public"."enum_page_templates_blocks_section_gap";
  DROP TYPE "public"."enum_block_templates_blocks_hero_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_pain_points_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_solutions_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_pricing_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_comparison_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_steps_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_testimonials_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_guarantee_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_faq_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_rich_text_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_cta_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_gallery_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_midwife_spotlight_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_heading_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_heading_level";
  DROP TYPE "public"."enum_block_templates_blocks_heading_size";
  DROP TYPE "public"."enum_block_templates_blocks_heading_align";
  DROP TYPE "public"."enum_block_templates_blocks_image_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_image_width";
  DROP TYPE "public"."enum_block_templates_blocks_image_align";
  DROP TYPE "public"."enum_block_templates_blocks_image_ratio";
  DROP TYPE "public"."enum_block_templates_blocks_image_rounded";
  DROP TYPE "public"."enum_block_templates_blocks_button_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_button_action";
  DROP TYPE "public"."enum_block_templates_blocks_button_style";
  DROP TYPE "public"."enum_block_templates_blocks_button_size";
  DROP TYPE "public"."enum_block_templates_blocks_button_align";
  DROP TYPE "public"."enum_block_templates_blocks_divider_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_divider_variant";
  DROP TYPE "public"."enum_block_templates_blocks_divider_spacing";
  DROP TYPE "public"."enum_block_templates_blocks_divider_width";
  DROP TYPE "public"."enum_block_templates_blocks_video_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_video_ratio";
  DROP TYPE "public"."enum_block_templates_blocks_video_max_width";
  DROP TYPE "public"."enum_block_templates_blocks_stats_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_stats_columns";
  DROP TYPE "public"."enum_block_templates_blocks_stats_background";
  DROP TYPE "public"."enum_block_templates_blocks_stats_style";
  DROP TYPE "public"."enum_block_templates_blocks_logos_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_logos_columns";
  DROP TYPE "public"."enum_block_templates_blocks_logos_background";
  DROP TYPE "public"."enum_block_templates_blocks_team_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_team_columns";
  DROP TYPE "public"."enum_block_templates_blocks_team_background";
  DROP TYPE "public"."enum_block_templates_blocks_tabs_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_tabs_style";
  DROP TYPE "public"."enum_block_templates_blocks_tabs_background";
  DROP TYPE "public"."enum_block_templates_blocks_lead_form_fields";
  DROP TYPE "public"."enum_block_templates_blocks_lead_form_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_lead_form_background";
  DROP TYPE "public"."enum_block_templates_blocks_blog_feed_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_blog_feed_source";
  DROP TYPE "public"."enum_block_templates_blocks_blog_feed_category";
  DROP TYPE "public"."enum_block_templates_blocks_blog_feed_columns";
  DROP TYPE "public"."enum_block_templates_blocks_blog_feed_background";
  DROP TYPE "public"."enum_block_templates_blocks_countdown_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_countdown_background";
  DROP TYPE "public"."enum_block_templates_blocks_social_items_platform";
  DROP TYPE "public"."enum_block_templates_blocks_social_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_social_variant";
  DROP TYPE "public"."enum_block_templates_blocks_social_align";
  DROP TYPE "public"."enum_block_templates_blocks_social_background";
  DROP TYPE "public"."enum_block_templates_blocks_section_columns_width";
  DROP TYPE "public"."enum_block_templates_blocks_section_visibility";
  DROP TYPE "public"."enum_block_templates_blocks_section_background";
  DROP TYPE "public"."enum_block_templates_blocks_section_padding";
  DROP TYPE "public"."enum_block_templates_blocks_section_max_width";
  DROP TYPE "public"."enum_block_templates_blocks_section_gap";
  DROP TYPE "public"."enum__block_templates_v_blocks_hero_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_pain_points_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_solutions_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_pricing_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_comparison_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_steps_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_testimonials_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_guarantee_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_faq_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_rich_text_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_cta_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_gallery_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_midwife_spotlight_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_heading_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_heading_level";
  DROP TYPE "public"."enum__block_templates_v_blocks_heading_size";
  DROP TYPE "public"."enum__block_templates_v_blocks_heading_align";
  DROP TYPE "public"."enum__block_templates_v_blocks_image_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_image_width";
  DROP TYPE "public"."enum__block_templates_v_blocks_image_align";
  DROP TYPE "public"."enum__block_templates_v_blocks_image_ratio";
  DROP TYPE "public"."enum__block_templates_v_blocks_image_rounded";
  DROP TYPE "public"."enum__block_templates_v_blocks_button_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_button_action";
  DROP TYPE "public"."enum__block_templates_v_blocks_button_style";
  DROP TYPE "public"."enum__block_templates_v_blocks_button_size";
  DROP TYPE "public"."enum__block_templates_v_blocks_button_align";
  DROP TYPE "public"."enum__block_templates_v_blocks_divider_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_divider_variant";
  DROP TYPE "public"."enum__block_templates_v_blocks_divider_spacing";
  DROP TYPE "public"."enum__block_templates_v_blocks_divider_width";
  DROP TYPE "public"."enum__block_templates_v_blocks_video_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_video_ratio";
  DROP TYPE "public"."enum__block_templates_v_blocks_video_max_width";
  DROP TYPE "public"."enum__block_templates_v_blocks_stats_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_stats_columns";
  DROP TYPE "public"."enum__block_templates_v_blocks_stats_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_stats_style";
  DROP TYPE "public"."enum__block_templates_v_blocks_logos_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_logos_columns";
  DROP TYPE "public"."enum__block_templates_v_blocks_logos_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_team_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_team_columns";
  DROP TYPE "public"."enum__block_templates_v_blocks_team_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_tabs_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_tabs_style";
  DROP TYPE "public"."enum__block_templates_v_blocks_tabs_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_lead_form_fields";
  DROP TYPE "public"."enum__block_templates_v_blocks_lead_form_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_lead_form_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_blog_feed_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_blog_feed_source";
  DROP TYPE "public"."enum__block_templates_v_blocks_blog_feed_category";
  DROP TYPE "public"."enum__block_templates_v_blocks_blog_feed_columns";
  DROP TYPE "public"."enum__block_templates_v_blocks_blog_feed_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_countdown_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_countdown_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_social_items_platform";
  DROP TYPE "public"."enum__block_templates_v_blocks_social_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_social_variant";
  DROP TYPE "public"."enum__block_templates_v_blocks_social_align";
  DROP TYPE "public"."enum__block_templates_v_blocks_social_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_section_columns_width";
  DROP TYPE "public"."enum__block_templates_v_blocks_section_visibility";
  DROP TYPE "public"."enum__block_templates_v_blocks_section_background";
  DROP TYPE "public"."enum__block_templates_v_blocks_section_padding";
  DROP TYPE "public"."enum__block_templates_v_blocks_section_max_width";
  DROP TYPE "public"."enum__block_templates_v_blocks_section_gap";`)
}
