import config from '@payload-config'
import { getPayload } from 'payload'
import { builderTemplates } from '../blocks/registry'

/**
 * Membuat halaman builder "home" yang menjadi beranda utama.
 *
 * Jalankan:
 *   npm run seed:homepage
 *   npm run seed:homepage:dry
 *   OVERWRITE=true npm run seed:homepage   # paksa timpa layout yang sudah ada
 *
 * Halaman ini tampil di `/` (bukan `/home`). Jika halaman belum ada atau
 * layout-nya kosong, frontend otomatis memakai desain statis lama.
 *
 * Script ini AMAN dijalankan ulang: halaman yang sudah punya layout tidak akan
 * ditimpa kecuali `OVERWRITE=true`, agar perubahan manual dari Page Builder
 * tidak hilang.
 */
const HOMEPAGE_SLUG = 'home'
const HOMEPAGE_TEMPLATE_ID = 'homepage-kala'
const dryRun = process.env.DRY_RUN === 'true'
const overwrite = process.env.OVERWRITE === 'true'

async function main() {
  const template = builderTemplates.find((item) => item.id === HOMEPAGE_TEMPLATE_ID)
  if (!template) {
    throw new Error(`Template "${HOMEPAGE_TEMPLATE_ID}" tidak ditemukan di registry builder.`)
  }

  if (dryRun) {
    console.log(
      `[seed-homepage] DRY RUN: template "${template.title}" siap diterapkan (${template.blocks.length} blok). Tidak ada koneksi database / perubahan data.`,
    )
    return
  }

  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: HOMEPAGE_SLUG } },
    limit: 1,
    depth: 0,
  })

  if (existing.totalDocs > 0) {
    const doc = existing.docs[0] as any
    const existingLayout = Array.isArray(doc.layout) ? doc.layout : []

    if (existingLayout.length > 0 && !overwrite) {
      console.log(
        `[seed-homepage] Halaman "${doc.title}" sudah berisi ${existingLayout.length} blok. Dilewati agar editan Page Builder tidak hilang.` +
          ' Jalankan dengan OVERWRITE=true jika memang ingin menimpa layout.',
      )
      return
    }

    console.log(`[seed-homepage] Mengisi layout halaman "${doc.title}" (id: ${doc.id})...`)
    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: {
        title: doc.title || 'Beranda',
        layout: template.blocks as any,
        _status: 'published',
      },
    })
  } else {
    console.log('[seed-homepage] Membuat halaman beranda builder baru...')
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Beranda',
        slug: HOMEPAGE_SLUG,
        pageType: 'standard',
        layout: template.blocks as any,
        _status: 'published',
      },
    })
  }

  console.log(
    `[seed-homepage] Selesai. ${template.blocks.length} blok diterapkan ke halaman "/" (slug: ${HOMEPAGE_SLUG}).`,
  )
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed-homepage] Gagal:', err)
    process.exit(1)
  })
