import { z } from 'zod'

/**
 * AUT-003: Zod Tool Contracts untuk KalaWeb AI Agent & Automation
 * Mendefinisikan skema input/output yang ketat untuk 12 tool inti.
 */

// 1. Tool: get_articles
export const GetArticlesInputSchema = z.object({
  limit: z.number().int().min(1).max(100).default(10),
  page: z.number().int().min(1).default(1),
  status: z.enum(['published', 'draft', 'all']).default('published'),
  category: z.string().optional(),
})
export type GetArticlesInput = z.infer<typeof GetArticlesInputSchema>

// 2. Tool: get_article_by_slug
export const GetArticleBySlugInputSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Format slug hanya boleh huruf kecil, angka, dan tanda hubung'),
})
export type GetArticleBySlugInput = z.infer<typeof GetArticleBySlugInputSchema>

// 3. Tool: create_article
export const CreateArticleInputSchema = z.object({
  title: z.string().min(5, 'Judul artikel minimal 5 karakter').max(150),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(10, 'Ringkasan minimal 10 karakter').max(300),
  contentMarkdown: z.string().min(50, 'Konten artikel minimal 50 kata'),
  category: z.enum([
    'bayi',
    'ibu-menyusui',
    'layanan',
    'kehamilan',
    'newborn-care',
    'pijat-bayi',
    'laktasi-menyusui',
    'tumbuh-kembang',
    'kesehatan-bunda',
  ]).default('bayi'),
  focusKeyword: z.string().min(3),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(175).optional(),
  status: z.enum(['draft', 'in_review']).default('draft'),
  dryRun: z.boolean().default(false),
  idempotencyKey: z.string().min(8, 'Idempotency key wajib disertakan untuk mencegah duplikasi'),
})
export type CreateArticleInput = z.infer<typeof CreateArticleInputSchema>

// 4. Tool: update_article
export const UpdateArticleInputSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(5).max(150).optional(),
  contentMarkdown: z.string().min(50).optional(),
  excerpt: z.string().max(300).optional(),
  focusKeyword: z.string().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(175).optional(),
  status: z.enum(['draft', 'in_review']).optional(),
  dryRun: z.boolean().default(false),
  idempotencyKey: z.string().min(8).optional(),
})
export type UpdateArticleInput = z.infer<typeof UpdateArticleInputSchema>

// 5. Tool: validate_content (Permenkes 1787 & Struktur)
export const ValidateContentInputSchema = z.object({
  collection: z.enum(['articles', 'pages', 'services']),
  title: z.string().min(1),
  content: z.string().min(1),
  metaDescription: z.string().optional(),
})
export type ValidateContentInput = z.infer<typeof ValidateContentInputSchema>

// 6. Tool: get_services
export const GetServicesInputSchema = z.object({
  category: z.string().optional(),
  includeInactive: z.boolean().default(false),
})
export type GetServicesInput = z.infer<typeof GetServicesInputSchema>

// 7. Tool: get_service_areas
export const GetServiceAreasInputSchema = z.object({
  city: z.string().optional(),
})
export type GetServiceAreasInput = z.infer<typeof GetServiceAreasInputSchema>

// 8. Tool: get_faq
export const GetFaqInputSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
})
export type GetFaqInput = z.infer<typeof GetFaqInputSchema>

// 9. Tool: upload_media
export const UploadMediaInputSchema = z.object({
  filename: z.string().min(3).regex(/\.(jpe?g|png|webp|pdf)$/i, 'Hanya format JPG, PNG, WebP, dan PDF yang didukung'),
  alt: z.string().min(5, 'Teks Alt wajib diisi minimal 5 karakter untuk aksesibilitas dan SEO'),
  folder: z.enum(['baby-newborn', 'moms-lactation', 'midwives-clinic', 'documents', 'banners-promo', 'general']).default('general'),
  dataBase64: z.string().min(1, 'Base64 data file wajib diisi'),
})
export type UploadMediaInput = z.infer<typeof UploadMediaInputSchema>

// 10. Tool: get_seo_audit
export const GetSeoAuditInputSchema = z.object({
  title: z.string(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  focusKeyword: z.string().optional(),
  slug: z.string(),
  contentMarkdown: z.string().optional(),
})
export type GetSeoAuditInput = z.infer<typeof GetSeoAuditInputSchema>

// 11. Tool: trigger_deploy
export const TriggerDeployInputSchema = z.object({
  reason: z.string().min(5, 'Alasan deploy wajib ditulis jelas'),
  resource: z.string().default('AutomationAgent'),
  slug: z.string().optional(),
})
export type TriggerDeployInput = z.infer<typeof TriggerDeployInputSchema>

// 12. Tool: get_deploy_status
export const GetDeployStatusInputSchema = z.object({
  forceRefresh: z.boolean().default(false),
})
export type GetDeployStatusInput = z.infer<typeof GetDeployStatusInputSchema>

/**
 * Daftar Nama 12 Tool Resmi
 */
export const TOOL_NAMES = [
  'get_articles',
  'get_article_by_slug',
  'create_article',
  'update_article',
  'validate_content',
  'get_services',
  'get_service_areas',
  'get_faq',
  'upload_media',
  'get_seo_audit',
  'trigger_deploy',
  'get_deploy_status',
] as const
