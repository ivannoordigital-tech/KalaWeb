import config from '@payload-config'
import { getPayload } from 'payload'
import { builderTemplates } from '../blocks/registry'
import { RESERVED_PAGE_SLUGS } from '../utilities/pageBuilderValidators'

/**
 * Script untuk membuat atau mengisi landing page iklan berbayar (Native-First Hybrid).
 *
 * Penggunaan:
 *   # Dry-run melihat rencana (bisa tanpa slug):
 *   npm run seed:landing-ads:dry
 *
 *   # Dry-run dengan slug spesifik:
 *   LANDING_SLUG=promo-treatment npm run seed:landing-ads:dry
 *
 *   # Eksekusi seed ke database (status draft untuk review):
 *   LANDING_SLUG=promo-treatment npm run seed:landing-ads
 *
 *   # Paksa timpa jika halaman sudah ada:
 *   LANDING_SLUG=promo-treatment OVERWRITE=true npm run seed:landing-ads
 */
const TEMPLATE_ID = 'landing-kala-ads'
const rawSlug = (process.env.LANDING_SLUG || process.argv[2] || '').trim().toLowerCase()
const dryRun = process.env.DRY_RUN === 'true' || !rawSlug
const overwrite = process.env.OVERWRITE === 'true'

async function main() {
  const template = builderTemplates.find((item) => item.id === TEMPLATE_ID)
  if (!template) {
    throw new Error(`Template "${TEMPLATE_ID}" tidak ditemukan di registry builder.`)
  }

  console.log(`[seed-landing-ads] Template target: "${template.title}" (${template.blocks.length} blok native).`)

  if (!rawSlug) {
    console.log(
      '\nℹ️ [INFO] Parameter LANDING_SLUG belum diisi.\n' +
        'Script berjalan dalam mode simulasi rencana.\n' +
        'Untuk menjalankan seed ke halaman nyata nanti, gunakan:\n' +
        '  LANDING_SLUG=<nama-slug> npm run seed:landing-ads\n' +
        'Contoh:\n' +
        '  LANDING_SLUG=promo-treatment npm run seed:landing-ads\n',
    )
    console.log('--- Ringkasan 11 Blok yang Akan Diterapkan ---')
    template.blocks.forEach((b: any, idx: number) => {
      console.log(`  ${idx + 1}. [${b.blockType}] ${b.title || b.headline || b.label || ''}`)
    })
    return
  }

  // Validasi slug reserved
  if (RESERVED_PAGE_SLUGS.includes(rawSlug)) {
    throw new Error(
      `Slug "${rawSlug}" termasuk RESERVED_SLUGS dan tidak boleh digunakan untuk landing page iklan.`,
    )
  }

  if (rawSlug === 'reservasi-online') {
    throw new Error(
      'Slug "reservasi-online" sudah digunakan oleh kampanye aktif eksisting dan dilindungi dari penimpaan.',
    )
  }

  const slug = rawSlug
  const refCode = `KALA-LP-${slug.toUpperCase()}-A`

  if (dryRun) {
    console.log(
      `\n🔍 [DRY RUN] Rencana pembuatan landing page:` +
        `\n  - Slug: /sales/${slug}` +
        `\n  - RefCode: ${refCode}` +
        `\n  - PageType: landing` +
        `\n  - PageLayout: canvas` +
        `\n  - EditorMode: builder` +
        `\n  - Status Awal: draft` +
        `\n  - Total Blok: ${template.blocks.length} blok` +
        `\nTidak ada perubahan yang ditulis ke database.`,
    )
    return
  }

  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  const customizedLayout = template.blocks.map((block: any) => {
    if (block.blockType === 'html' && typeof block.html === 'string') {
      return {
        ...block,
        html: block.html.replace(/KALA-LP-ADS-FLOATING/g, refCode),
      }
    }
    if (block.blockType === 'promoBanner' && block.refCode) {
      return {
        ...block,
        refCode: `KALA-LP-${slug.toUpperCase()}-PROMO`,
      }
    }
    return block
  })

  const pageData = {
    title: 'Kala Baby Spa – Promo Treatment Pertama',
    slug,
    pageType: 'landing' as const,
    pageLayout: 'canvas' as const,
    editorMode: 'builder' as const,
    refCode,
    variant: 'A',
    activePixels: ['meta'] as ('meta' | 'google' | 'tiktok')[],
    description:
      'Promo treatment pertama pijat bayi & perawatan nifas homecare di Surabaya & Sidoarjo. Ditangani bidan bersertifikat Kemenkes RI.',
    layout: customizedLayout as any,
    _status: 'draft' as const,
  }

  if (existing.totalDocs > 0) {
    const doc = existing.docs[0] as any
    const existingLayout = Array.isArray(doc.layout) ? doc.layout : []

    if (existingLayout.length > 0 && !overwrite) {
      console.log(
        `[seed-landing-ads] Halaman "${doc.title}" (/sales/${slug}) sudah memiliki ${existingLayout.length} blok. ` +
          `Dilewati agar editan Page Builder tidak tertimpa.\n` +
          `Gunakan OVERWRITE=true jika Anda ingin menimpa layout dengan template ads ini.`,
      )
      return
    }

    console.log(`[seed-landing-ads] Memperbarui halaman yang ada (id: ${doc.id})...`)
    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: pageData,
    })
  } else {
    console.log(`[seed-landing-ads] Membuat dokumen landing page baru untuk /sales/${slug}...`)
    await payload.create({
      collection: 'pages',
      data: pageData,
    })
  }

  console.log(
    `\n✅ [BERHASIL] Halaman iklan tersimpan sebagai DRAFT di /sales/${slug} dengan ${template.blocks.length} blok.` +
      `\nBuka Admin CMS -> Pages -> "${pageData.title}" untuk me-review dan mem-publish saat siap.`,
  )
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed-landing-ads] Gagal:', err.message || err)
    process.exit(1)
  })
