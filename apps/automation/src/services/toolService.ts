import {
  type GetArticlesInput,
  type GetArticleBySlugInput,
  type CreateArticleInput,
  type UpdateArticleInput,
  type ValidateContentInput,
  type GetServicesInput,
  type GetServiceAreasInput,
  type GetFaqInput,
  type UploadMediaInput,
  type GetSeoAuditInput,
  type TriggerDeployInput,
  type GetDeployStatusInput,
} from '../contracts/schemas.js'
import { idempotencyManager } from '../middleware/idempotency.js'
import { auditLogger } from '../audit/auditLogger.js'
import { convertMarkdownToLexical } from '../utilities/markdownToLexical.js'

// Daftar kata klaim terlarang medis sesuai Permenkes No. 1787/2010
export const FORBIDDEN_MEDICAL_WORDS = [
  'pasti sembuh',
  'dijamin sembuh',
  '100% sembuh',
  'garansi sembuh',
  '100% aman',
  'tanpa efek samping apapun',
  'bebas komplikasi mutlak',
]

const NEGATION_PATTERNS = [
  'tidak menjamin',
  'bukan berarti',
  'belum tentu',
  'tidak bisa dipastikan',
  'tidak ada jaminan',
  'tidak',
  'bukan',
]

export interface ToolContext {
  actor: string
  ip: string
  payloadInstance?: any
}

export class ToolService {
  /**
   * Helper: Deteksi pelanggaran Permenkes 1787 dengan kesadaran negasi edukatif
   */
  public checkForbiddenMedicalClaims(text: string): string[] {
    const lower = text.toLowerCase()
    const violations: string[] = []

    for (const phrase of FORBIDDEN_MEDICAL_WORDS) {
      let idx = lower.indexOf(phrase)
      while (idx !== -1) {
        const start = Math.max(0, idx - 50)
        const precedingSlice = lower.slice(start, idx)
        const clause = (precedingSlice.split(/[.!?;\n]/).pop() || '').trim()
        const isNegated = NEGATION_PATTERNS.some((neg) => {
          const words = clause.split(/\s+/).slice(-5).join(' ')
          return words.includes(neg)
        })

        if (!isNegated && !violations.includes(phrase)) {
          violations.push(phrase)
        }
        idx = lower.indexOf(phrase, idx + phrase.length)
      }
    }

    return violations
  }

  // 1. Tool: get_articles (Memerlukan payloadInstance riil)
  public async getArticles(input: GetArticlesInput, ctx?: ToolContext) {
    if (!ctx?.payloadInstance || typeof ctx.payloadInstance.find !== 'function') {
      return {
        success: false,
        error: 'DATABASE_UNAVAILABLE: Payload CMS instance tidak terhubung atau database offline.',
        code: 'DATABASE_UNAVAILABLE',
      }
    }

    auditLogger.log({
      actor: ctx.actor,
      action: 'get_articles',
      resource: 'Articles',
      ip: ctx.ip,
      status: 'success',
      payload: input,
    })

    try {
      const where: any = {}
      if (input.status && input.status !== 'all') {
        where._status = { equals: input.status }
      }
      if (input.category) {
        where.category = { equals: input.category }
      }
      const res = await ctx.payloadInstance.find({
        collection: 'articles',
        where,
        limit: input.limit,
        page: input.page,
      })

      return {
        success: true,
        data: res.docs || [],
        meta: {
          page: res.page,
          limit: res.limit,
          totalDocs: res.totalDocs,
        },
      }
    } catch (err: any) {
      return {
        success: false,
        error: `DATABASE_QUERY_ERROR: ${err.message}`,
        code: 'DATABASE_QUERY_ERROR',
      }
    }
  }

  // 2. Tool: get_article_by_slug
  public async getArticleBySlug(input: GetArticleBySlugInput, ctx?: ToolContext) {
    if (!ctx?.payloadInstance || typeof ctx.payloadInstance.find !== 'function') {
      return {
        success: false,
        error: 'DATABASE_UNAVAILABLE: Payload CMS instance tidak terhubung atau database offline.',
        code: 'DATABASE_UNAVAILABLE',
      }
    }

    auditLogger.log({
      actor: ctx.actor,
      action: 'get_article_by_slug',
      resource: 'Articles',
      slug: input.slug,
      ip: ctx.ip,
      status: 'success',
    })

    try {
      const res = await ctx.payloadInstance.find({
        collection: 'articles',
        where: { slug: { equals: input.slug } },
        limit: 1,
      })

      if (res.docs && res.docs.length > 0) {
        return {
          success: true,
          data: res.docs[0],
        }
      }

      return {
        success: false,
        error: `NOT_FOUND: Artikel dengan slug "${input.slug}" tidak ditemukan.`,
        code: 'NOT_FOUND',
      }
    } catch (err: any) {
      return {
        success: false,
        error: `DATABASE_QUERY_ERROR: ${err.message}`,
        code: 'DATABASE_QUERY_ERROR',
      }
    }
  }

  // 3. Tool: create_article (Idempotent + Dry-run + Permenkes Guard + DB write)
  public async createArticle(input: CreateArticleInput, ctx: ToolContext) {
    // 1. Cek Idempotency
    const idemCheck = idempotencyManager.check(input.idempotencyKey, input)
    if (idemCheck.error) {
      return { success: false, error: idemCheck.error, code: 'IDEMPOTENCY_MISMATCH' }
    }
    if (idemCheck.isHit) {
      return { ...idemCheck.record?.response, _cached: true }
    }

    // 2. Deteksi Klaim Terlarang (Permenkes 1787)
    const violations = this.checkForbiddenMedicalClaims(
      `${input.title} ${input.excerpt} ${input.contentMarkdown}`
    )
    if (violations.length > 0) {
      const errorMsg = `PELANGGARAN_PERMENKES_1787: Konten mengandung klaim medis terlarang: "${violations.join('", "')}". Gunakan bahasa empati dan penjelasan berbasis stimulasi.`
      auditLogger.log({
        actor: ctx.actor,
        action: 'create_article',
        resource: 'Articles',
        slug: input.slug,
        ip: ctx.ip,
        status: 'failure',
        error: errorMsg,
      })
      return { success: false, error: errorMsg, code: 'FORBIDDEN_MEDICAL_CLAIM', violations }
    }

    // 3. Mode Dry-Run
    if (input.dryRun) {
      const lexicalAST = convertMarkdownToLexical(input.contentMarkdown)
      return {
        success: true,
        dryRun: true,
        message: 'Validasi pra-tulis berhasil. Tidak ada klaim terlarang dan struktur Lexical valid.',
        astNodesCount: lexicalAST.root.children.length,
      }
    }

    // 4. Eksekusi Tulis ke Payload DB
    if (!ctx.payloadInstance || typeof ctx.payloadInstance.create !== 'function') {
      return {
        success: false,
        error: 'DATABASE_UNAVAILABLE: create_article mewajibkan koneksi database aktif.',
        code: 'DATABASE_UNAVAILABLE',
      }
    }

    const lexicalContent = convertMarkdownToLexical(input.contentMarkdown)
    try {
      const createdDoc = await ctx.payloadInstance.create({
        collection: 'articles',
        data: {
          title: input.title,
          slug: input.slug,
          description: input.excerpt,
          content: lexicalContent,
          category: input.category === 'newborn-care' ? 'bayi' : input.category,
          _status: input.status,
          seo: {
            metaTitle: input.metaTitle,
            metaDescription: input.metaDescription,
          },
        },
      })

      const result = {
        success: true,
        action: 'created',
        data: createdDoc,
        message: `Artikel "${input.title}" berhasil dibuat dalam status ${input.status}.`,
      }

      idempotencyManager.store(input.idempotencyKey, input, result)
      auditLogger.log({
        actor: ctx.actor,
        action: 'create_article',
        resource: 'Articles',
        slug: input.slug,
        ip: ctx.ip,
        status: 'success',
        payload: input,
      })

      return result
    } catch (err: any) {
      return {
        success: false,
        error: `DATABASE_WRITE_ERROR: ${err.message}`,
        code: 'DATABASE_WRITE_ERROR',
      }
    }
  }

  // 4. Tool: update_article
  public async updateArticle(input: UpdateArticleInput, ctx: ToolContext) {
    if (input.contentMarkdown || input.title) {
      const violations = this.checkForbiddenMedicalClaims(
        `${input.title || ''} ${input.contentMarkdown || ''}`
      )
      if (violations.length > 0) {
        return {
          success: false,
          error: `PELANGGARAN_PERMENKES_1787: Konten mengandung klaim terlarang: "${violations.join('", "')}".`,
          code: 'FORBIDDEN_MEDICAL_CLAIM',
        }
      }
    }

    if (input.dryRun) {
      return { success: true, dryRun: true, message: 'Validasi update berhasil.' }
    }

    if (!ctx.payloadInstance || typeof ctx.payloadInstance.update !== 'function') {
      return {
        success: false,
        error: 'DATABASE_UNAVAILABLE: update_article mewajibkan koneksi database aktif.',
        code: 'DATABASE_UNAVAILABLE',
      }
    }

    try {
      const updateData: any = {}
      if (input.title) updateData.title = input.title
      if (input.contentMarkdown) updateData.content = convertMarkdownToLexical(input.contentMarkdown)
      if (input.excerpt) updateData.description = input.excerpt
      if (input.status) updateData._status = input.status

      const res = await ctx.payloadInstance.update({
        collection: 'articles',
        where: { slug: { equals: input.slug } },
        data: updateData,
      })

      auditLogger.log({
        actor: ctx.actor,
        action: 'update_article',
        resource: 'Articles',
        slug: input.slug,
        ip: ctx.ip,
        status: 'success',
        payload: input,
      })

      return {
        success: true,
        action: 'updated',
        slug: input.slug,
        data: res.docs?.[0] || null,
        message: `Artikel ${input.slug} berhasil diperbarui.`,
      }
    } catch (err: any) {
      return {
        success: false,
        error: `DATABASE_UPDATE_ERROR: ${err.message}`,
        code: 'DATABASE_UPDATE_ERROR',
      }
    }
  }

  // 5. Tool: validate_content (Pure validator, tidak perlu DB)
  public async validateContent(input: ValidateContentInput) {
    const violations = this.checkForbiddenMedicalClaims(`${input.title} ${input.content} ${input.metaDescription || ''}`)
    const wordCount = input.content.trim().split(/\s+/).filter(Boolean).length

    const fieldErrors: Array<{ path: string; code: string; message: string }> = []
    if (violations.length > 0) {
      fieldErrors.push({
        path: 'content',
        code: 'FORBIDDEN_MEDICAL_CLAIM',
        message: `Ditemukan klaim medis yang dilarang: ${violations.join(', ')}`,
      })
    }
    if (input.collection === 'articles' && wordCount < 50) {
      fieldErrors.push({
        path: 'content',
        code: 'CONTENT_TOO_SHORT',
        message: `Konten artikel terlalu pendek (${wordCount} kata, minimal 50 kata).`,
      })
    }

    return {
      valid: fieldErrors.length === 0,
      wordCount,
      violations,
      fieldErrors,
    }
  }

  // 6. Tool: get_services (Memerlukan payloadInstance)
  public async getServices(input: GetServicesInput, ctx?: ToolContext) {
    if (!ctx?.payloadInstance || typeof ctx.payloadInstance.find !== 'function') {
      return {
        success: false,
        error: 'DATABASE_UNAVAILABLE: Payload CMS instance tidak terhubung atau database offline.',
        code: 'DATABASE_UNAVAILABLE',
      }
    }

    try {
      const where: any = {}
      if (!input.includeInactive) {
        where.active = { equals: true }
      }
      const res = await ctx.payloadInstance.find({
        collection: 'services',
        where,
        limit: 50,
      })
      return { success: true, data: res.docs || [] }
    } catch (err: any) {
      return {
        success: false,
        error: `DATABASE_QUERY_ERROR: ${err.message}`,
        code: 'DATABASE_QUERY_ERROR',
      }
    }
  }

  // 7. Tool: get_service_areas (Memerlukan payloadInstance)
  public async getServiceAreas(input: GetServiceAreasInput, ctx?: ToolContext) {
    if (!ctx?.payloadInstance || typeof ctx.payloadInstance.find !== 'function') {
      return {
        success: false,
        error: 'DATABASE_UNAVAILABLE: Payload CMS instance tidak terhubung atau database offline.',
        code: 'DATABASE_UNAVAILABLE',
      }
    }

    try {
      const where: any = { active: { equals: true } }
      if (input.city) {
        where.city = { equals: input.city }
      }
      const res = await ctx.payloadInstance.find({
        collection: 'service-areas',
        where,
        limit: 50,
      })
      return { success: true, data: res.docs || [] }
    } catch (err: any) {
      return {
        success: false,
        error: `DATABASE_QUERY_ERROR: ${err.message}`,
        code: 'DATABASE_QUERY_ERROR',
      }
    }
  }

  // 8. Tool: get_faq (Memerlukan payloadInstance)
  public async getFaq(input: GetFaqInput, ctx?: ToolContext) {
    if (!ctx?.payloadInstance || typeof ctx.payloadInstance.find !== 'function') {
      return {
        success: false,
        error: 'DATABASE_UNAVAILABLE: Payload CMS instance tidak terhubung atau database offline.',
        code: 'DATABASE_UNAVAILABLE',
      }
    }

    try {
      const where: any = { active: { equals: true } }
      if (input.category) {
        where.category = { equals: input.category }
      }
      const res = await ctx.payloadInstance.find({
        collection: 'faq',
        where,
        limit: 50,
      })
      return { success: true, data: res.docs || [] }
    } catch (err: any) {
      return {
        success: false,
        error: `DATABASE_QUERY_ERROR: ${err.message}`,
        code: 'DATABASE_QUERY_ERROR',
      }
    }
  }

  // 9. Tool: upload_media (Upload file nyata ke collection media)
  public async uploadMedia(input: UploadMediaInput, ctx: ToolContext) {
    if (!ctx.payloadInstance || typeof ctx.payloadInstance.create !== 'function') {
      return {
        success: false,
        error: 'DATABASE_UNAVAILABLE: upload_media mewajibkan koneksi database Payload CMS aktif.',
        code: 'DATABASE_UNAVAILABLE',
      }
    }

    if (!input.dataBase64) {
      return {
        success: false,
        error: 'FILE_REQUIRED: Payload dataBase64 file wajib disertakan.',
        code: 'FILE_REQUIRED',
      }
    }

    try {
      const buffer = Buffer.from(input.dataBase64, 'base64')
      const ext = input.filename.split('.').pop()?.toLowerCase() || 'webp'
      const mimeMap: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        pdf: 'application/pdf',
      }
      const mimetype = mimeMap[ext] || 'image/webp'

      const mediaDoc = await ctx.payloadInstance.create({
        collection: 'media',
        data: {
          alt: input.alt,
          folder: input.folder,
        },
        file: {
          data: buffer,
          mimetype,
          name: input.filename,
          size: buffer.length,
        },
      })

      auditLogger.log({
        actor: ctx.actor,
        action: 'upload_media',
        resource: 'Media',
        ip: ctx.ip,
        status: 'success',
        payload: { filename: input.filename, alt: input.alt, folder: input.folder },
      })

      return {
        success: true,
        data: {
          id: mediaDoc.id,
          filename: mediaDoc.filename,
          alt: mediaDoc.alt,
          folder: mediaDoc.folder,
          url: mediaDoc.url,
        },
      }
    } catch (err: any) {
      return {
        success: false,
        error: `UPLOAD_FAILED: ${err.message}`,
        code: 'UPLOAD_FAILED',
      }
    }
  }

  // 10. Tool: get_seo_audit (Pure calculation)
  public async getSeoAudit(input: GetSeoAuditInput) {
    const titleLen = (input.metaTitle || input.title).length
    const descLen = (input.metaDescription || '').length
    const wordCount = (input.contentMarkdown || '').trim().split(/\s+/).filter(Boolean).length

    let score = 50
    if (titleLen >= 30 && titleLen <= 60) score += 20
    if (descLen >= 70 && descLen <= 160) score += 20
    if (wordCount >= 300) score += 10
    if (wordCount < 100) score = Math.min(score, 58)

    return {
      score,
      grade: score >= 80 ? 'good' : score >= 60 ? 'fair' : 'poor',
      metrics: {
        titleLength: titleLen,
        descLength: descLen,
        wordCount,
      },
    }
  }

  // 11. Tool: trigger_deploy (Mencatat ke koleksi Deployments & trigger Cloudflare webhook)
  public async triggerDeploy(input: TriggerDeployInput, ctx: ToolContext) {
    if (!ctx.payloadInstance || typeof ctx.payloadInstance.create !== 'function') {
      return {
        success: false,
        error: 'DATABASE_UNAVAILABLE: trigger_deploy mewajibkan koneksi database Payload CMS aktif.',
        code: 'DATABASE_UNAVAILABLE',
      }
    }

    const targetUrl = input.slug
      ? `https://kalababyspa.com/${input.resource.toLowerCase() === 'articles' ? 'blog/' : ''}${input.slug}`
      : 'https://kalababyspa.com'

    try {
      const deployDoc = await ctx.payloadInstance.create({
        collection: 'deployments',
        data: {
          status: 'queued',
          triggerReason: `[AUTOMATION] ${input.reason} (${input.resource}${input.slug ? `/${input.slug}` : ''})`,
          url: targetUrl,
          environment: 'production',
          startedAt: new Date().toISOString(),
        },
      })

      // Jika webhook Cloudflare terkonfigurasi, kirimkan trigger
      const hookUrl = process.env.CLOUDFLARE_DEPLOY_HOOK_URL
      let finalStatus: 'queued' | 'building' = 'queued'
      if (hookUrl) {
        try {
          await fetch(hookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: input.reason, timestamp: new Date().toISOString() }),
          })
          await ctx.payloadInstance.update({
            collection: 'deployments',
            id: deployDoc.id,
            data: { status: 'building' },
          })
          finalStatus = 'building'
        } catch (webhookErr: any) {
          console.warn('[ToolService] Gagal memicu Cloudflare webhook:', webhookErr.message)
        }
      }

      auditLogger.log({
        actor: ctx.actor,
        action: 'trigger_deploy',
        resource: input.resource,
        slug: input.slug,
        ip: ctx.ip,
        status: 'success',
        payload: input,
      })

      return {
        success: true,
        deploymentId: deployDoc.id,
        status: finalStatus,
        message: `Build Cloudflare Pages dijadwalkan. Alasan: ${input.reason}`,
      }
    } catch (err: any) {
      return {
        success: false,
        error: `DEPLOY_TRIGGER_FAILED: ${err.message}`,
        code: 'DEPLOY_TRIGGER_FAILED',
      }
    }
  }

  // 12. Tool: get_deploy_status (Query koleksi Deployments & Cloudflare API nyata)
  public async getDeployStatus(input: GetDeployStatusInput, ctx?: ToolContext) {
    if (!ctx?.payloadInstance || typeof ctx.payloadInstance.find !== 'function') {
      return {
        success: false,
        error: 'DATABASE_UNAVAILABLE: get_deploy_status mewajibkan koneksi database Payload CMS aktif.',
        code: 'DATABASE_UNAVAILABLE',
      }
    }

    try {
      const deploys = await ctx.payloadInstance.find({
        collection: 'deployments',
        limit: 1,
        sort: '-createdAt',
      })

      let latest = deploys.docs?.[0]
      if (!latest) {
        return {
          status: 'idle',
          isBuilding: false,
          lastCompletedAt: null,
          targetUrl: 'https://kalababyspa.com',
          message: 'Belum ada catatan riwayat deployment.',
        }
      }

      // Sinkronisasi status nyata dari Cloudflare Pages API bila diminta.
      let refreshError: string | null = null
      let refreshedFromCloudflare = false

      if (input?.forceRefresh) {
        const token = process.env.CLOUDFLARE_API_TOKEN
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
        const projectName = process.env.CLOUDFLARE_PROJECT_NAME || 'kala-web'

        if (!token || !accountId) {
          refreshError =
            'CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID belum dikonfigurasi; status berasal dari database.'
        } else {
          try {
            const response = await fetch(
              `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments?per_page=1`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
            const json: any = await response.json()
            if (!response.ok || json?.success === false) {
              throw new Error(json?.errors?.[0]?.message || `Cloudflare API HTTP ${response.status}`)
            }

            const cf = json?.result?.[0]
            if (!cf) {
              refreshError = 'Cloudflare belum mengembalikan data deployment.'
            } else {
              const statusMap: Record<string, string> = {
                success: 'success',
                failure: 'failed',
                failed: 'failed',
                active: 'building',
                building: 'building',
                queued: 'queued',
                idle: 'queued',
                canceled: 'canceled',
                cancelled: 'canceled',
              }
              const mappedStatus = statusMap[cf.latest_stage?.status || cf.status] || 'building'
              const startedOn = cf.latest_stage?.started_on || null
              const endedOn = cf.latest_stage?.ended_on || null
              const durationSeconds =
                startedOn && endedOn
                  ? Math.max(
                      0,
                      Math.round((new Date(endedOn).getTime() - new Date(startedOn).getTime()) / 1000)
                    )
                  : latest.durationSeconds
              const completedAt = ['success', 'failed', 'canceled'].includes(mappedStatus)
                ? endedOn || new Date().toISOString()
                : latest.completedAt

              latest = await ctx.payloadInstance.update({
                collection: 'deployments',
                id: latest.id,
                data: {
                  status: mappedStatus,
                  cloudflareDeploymentId: cf.id || latest.cloudflareDeploymentId,
                  completedAt,
                  durationSeconds,
                },
              })
              refreshedFromCloudflare = true
            }
          } catch (err: any) {
            refreshError = err.message
          }
        }
      }

      return {
        status: latest.status,
        isBuilding: latest.status === 'building' || latest.status === 'queued',
        lastCompletedAt: latest.completedAt || latest.updatedAt,
        targetUrl: latest.url || 'https://kalababyspa.com',
        durationSeconds: latest.durationSeconds,
        triggerReason: latest.triggerReason,
        refreshedFromCloudflare,
        ...(refreshError ? { refreshError } : {}),
      }
    } catch (err: any) {
      return {
        success: false,
        error: `DEPLOY_STATUS_ERROR: ${err.message}`,
        code: 'DEPLOY_STATUS_ERROR',
      }
    }
  }
}

export const toolService = new ToolService()
