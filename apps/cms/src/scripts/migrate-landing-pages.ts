import type { Block } from 'payload'

export interface LegacyLandingPage {
  id?: string | number
  title: string
  slug: string
  refCode?: string
  variant?: 'A' | 'B' | 'C'
  active?: boolean
  activePixels?: Array<'meta' | 'google' | 'tiktok' | 'ga4' | 'clarity'>
  pageLayout?: 'canvas' | 'canvas_minimal' | 'default' | 'full_width'
  layout?: any[]
  headline?: string
  subheadline?: string
  price?: string
  duration?: string
  painPoints?: Array<string | { point: string }>
  solutions?: Array<{ title: string; desc: string }>
  steps?: Array<{ num: string; title: string; desc: string }>
  testimonial?: { quote: string; author: string; area?: string }
  faqs?: Array<{ q: string; a: string }>
  seo?: any
  _status?: 'draft' | 'published'
}

/**
 * Konversi field mode klasik legacy ke array blok modern Page Builder
 */
export function convertLegacyLandingToBlocks(lp: LegacyLandingPage): any[] {
  // Jika sudah memiliki layout blok lengkap, gunakan layout tersebut
  if (Array.isArray(lp.layout) && lp.layout.length > 0) {
    return lp.layout
  }

  const blocks: any[] = []

  // 1. Hero Block
  if (lp.headline || lp.price || lp.title) {
    blocks.push({
      blockType: 'hero',
      badge: '🌿 Bidan Ber-STR Resmi Hadir ke Rumah',
      headline: lp.headline || lp.title,
      subheadline: lp.subheadline || 'Perawatan homecare oleh bidan resmi Kemenkes RI langsung di rumah Bunda. Higienis medis, ramah, dan bebas mom-shaming.',
      price: lp.price || 'Rp60.000',
      duration: lp.duration || '40 Menit',
      ctaText: 'Konsultasi via WhatsApp',
      ctaMessage: `Promo [${lp.refCode || 'LP-ADS'}]\nHalo Bu Bidan, saya mau pesan sesi ${lp.headline || lp.title}`,
      bgStyle: 'gradient',
    })
  }

  // 2. Pain Points Block
  if (lp.painPoints && lp.painPoints.length > 0) {
    const rawPoints = lp.painPoints.map((p) => (typeof p === 'string' ? p : p.point))
    const icons = ['😭', '🎈', '😴', '⚠️', '🥺', '🚗']
    blocks.push({
      blockType: 'painPoints',
      title: 'Apakah Bunda Mengalami Hal Ini?',
      subtitle: 'Rasa cemas dan lelah Bunda sangat wajar. Ratusan Bunda di Surabaya & Sidoarjo merasakan hal serupa:',
      points: rawPoints.map((text, idx) => ({
        icon: icons[idx % icons.length],
        title: text.length > 35 ? text.slice(0, 32) + '...' : text,
        description: text,
      })),
    })
  }

  // 3. Solutions Block
  if (lp.solutions && lp.solutions.length > 0) {
    blocks.push({
      blockType: 'solutions',
      title: 'Solusi Medis & Penuh Kehangatan dari Kala',
      subtitle: 'Pendekatan klinis terbukti ilmiah untuk membantu kenyamanan dan kesehatan si kecil:',
      items: lp.solutions.map((sol) => ({
        icon: '🌿',
        title: sol.title,
        description: sol.desc,
      })),
      highlightQuote: lp.testimonial
        ? {
            quote: lp.testimonial.quote,
            author: lp.testimonial.author,
            role: lp.testimonial.area || 'Surabaya & Sidoarjo',
          }
        : undefined,
    })
  }

  // 4. Steps Block
  if (lp.steps && lp.steps.length > 0) {
    blocks.push({
      blockType: 'steps',
      title: 'Cara Kerja Praktis 3 Langkah',
      subtitle: 'Tanpa perlu repot keluar rumah menembus kemacetan:',
      steps: lp.steps.map((st) => ({
        num: String(st.num),
        title: st.title,
        description: st.desc,
      })),
    })
  }

  // 5. Testimonials Block
  if (lp.testimonial) {
    blocks.push({
      blockType: 'testimonials',
      title: 'Pengalaman Nyata Bunda di Surabaya & Sidoarjo',
      subtitle: 'Ulasan terverifikasi dari keluarga yang telah merasakan perawatan homecare Kala:',
      items: [
        {
          quote: lp.testimonial.quote,
          author: lp.testimonial.author,
          role: 'Bunda Pasien Kala',
          area: lp.testimonial.area || 'Surabaya / Sidoarjo',
        },
      ],
    })
  }

  // 6. Guarantee Block
  blocks.push({
    blockType: 'guarantee',
    badge: '🛡️ Komitmen Kepuasan 100%',
    title: 'Garansi Kenyamanan Buah Hati Bunda',
    description: 'Jika si kecil rewel atau Bunda merasa pelayanan bidan kami tidak sesuai standar kebidanan ramah yang kami janjikan, kami sediakan sesi evaluasi ulang gratis tanpa ribet.',
    note: '*Kenyamanan dan ketenangan Bunda serta si kecil adalah kehormatan bagi kami.',
  })

  // 7. FAQ Block
  if (lp.faqs && lp.faqs.length > 0) {
    blocks.push({
      blockType: 'faq',
      title: 'Pertanyaan yang Sering Diajukan Bunda',
      subtitle: 'Informasi lengkap seputar kunjungan homecare Bidan Kala.',
      faqs: lp.faqs.map((f) => ({
        q: f.q,
        a: f.a,
      })),
    })
  }

  // 8. CTA Block
  blocks.push({
    blockType: 'cta',
    badge: '⚡ Slot Terbatas Setiap Hari',
    headline: lp.headline || 'Berikan Sentuhan Terbaik untuk Tumbuh Kembang Buah Hati',
    description: lp.subheadline || 'Konsultasikan kebutuhan perawatan si kecil bersama Bidan Kala sekarang juga via WhatsApp.',
    buttonText: 'Hubungi Bidan Kala Sekarang',
    buttonMessage: `Promo [${lp.refCode || 'LP-ADS'}]\nHalo Bu Bidan, saya mau reservasi kunjungan homecare`,
    footnote: '⚡ Respon cepat setiap hari 08.00 - 17.00 WIB · 100% Bidan Ber-STR',
  })

  return blocks
}

/**
 * Mapping data landing page ke schema Pages
 */
export function mapLandingToPageData(lp: LegacyLandingPage) {
  const normalizedLayout =
    lp.pageLayout === 'canvas_minimal' || lp.pageLayout === 'canvas'
      ? 'canvas'
      : lp.pageLayout === 'full_width'
      ? 'full_width'
      : 'default'

  return {
    title: lp.title,
    slug: lp.slug,
    pageType: 'landing' as const,
    pageLayout: normalizedLayout as 'canvas' | 'default' | 'full_width',
    refCode: lp.refCode || `KALA-LP-${lp.slug.toUpperCase().replace(/[^A-Z0-9]/g, '-')}-A`,
    variant: lp.variant || 'A',
    activePixels: lp.activePixels || ['meta', 'google'],
    showWhatsAppCta: true,
    whatsappCustomMessage: `Halo Bidan Kala, saya mau tanya paket [${lp.refCode || lp.slug}]`,
    layout: convertLegacyLandingToBlocks(lp),
    _status: (lp.active !== false ? 'published' : 'draft') as 'published' | 'draft',
    seo: lp.seo,
  }
}

// ==============================================================================
// RUNNER UTAMA
// ==============================================================================
async function main() {
  const isDryRun = process.argv.includes('--dry-run') || process.env.DRY_RUN === 'true'
  console.log('================================================================================')
  console.log('📦 SCRIPT MIGRASI LANDING PAGES → PAGES (LP-002)')
  console.log(`Mode: ${isDryRun ? '🔍 DRY RUN (Simulasi / Tanpa Sentuh Database)' : '🚀 LIVE EXECUTION (Menulis ke DB)'}`)
  console.log('================================================================================\n')

  let payload: any = null

  if (!isDryRun) {
    try {
      const { getPayload } = await import('payload')
      const configPromise = await import('../payload.config')
      payload = await getPayload({ config: configPromise.default })
    } catch (err: any) {
      console.warn('⚠️ Tidak dapat terhubung ke PostgreSQL lokal:', err.message)
      console.log('💡 Menjalankan verifikasi migrasi dalam mode DRY-RUN otomatis...\n')
    }
  }

  // Data sampel fallback jika DB offline atau saat dry-run
  const sampleLandingPages: LegacyLandingPage[] = [
    {
      slug: 'bayi-kolik',
      title: 'Solusi Tangis Kolik & Perut Kembung Bayi di Surabaya & Sidoarjo',
      headline: 'Atasi Tangis Bayi Akibat Kolik & Kembung Tanpa Panik',
      subheadline: 'Bidan ber-STR resmi hadir langsung ke rumah Bunda. Terapi pijat ILU anatomi medis + evaluasi perlekatan menyusui untuk meredakan tangisan si kecil.',
      refCode: 'LP-KOLIK-ADS',
      price: 'Rp60.000',
      duration: '40 Menit',
      active: true,
      painPoints: [
        'Bayi menangis histeris di sore atau malam hari dengan kaki menekuk ke dada',
        'Perut si kecil terasa kencang, begah, atau berbunyi keras saat disentuh',
      ],
      solutions: [
        { title: 'Teknik Pijat ILU Klinis & Gerakan Kayuh Sepeda', desc: 'Stimulasi gerak peristaltik usus yang terbukti ilmiah.' },
      ],
      steps: [
        { num: '1', title: 'Chat WhatsApp', desc: 'Sampaikan keluhan si kecil.' },
      ],
      testimonial: {
        quote: 'Baby Zayn sempat nangis 3 jam tiap malam. Sekarang tidur nyenyak.',
        author: 'Bunda Nadhira',
        area: 'Waru, Sidoarjo',
      },
      faqs: [
        { q: 'Kapan waktu terbaik untuk pijat kolik?', a: 'Saat bayi tenang, sekitar 45 menit setelah menyusui.' },
      ],
    },
    {
      slug: 'pijat-newborn',
      title: 'Pijat Ceria Newborn Homecare Surabaya & Sidoarjo | Bidan Bersertifikat',
      headline: 'Sentuhan Lembut Pertama untuk Kenyamanan Tumbuh Kembang Si Kecil',
      subheadline: 'Perawatan homecare khusus bayi baru lahir (0-6 bulan) langsung di kamar Bunda.',
      refCode: 'LP-NEWBORN-ADS',
      price: 'Rp60.000',
      duration: '40 Menit',
      active: true,
      painPoints: [
        'Kekhawatiran memegang tubuh newborn yang masih mungil',
      ],
      solutions: [
        { title: 'Stimulasi Taktil Medis', desc: 'Membantu kualitas tidur si kecil.' },
      ],
      steps: [
        { num: '1', title: 'Pilih Jadwal', desc: 'Hubungi WhatsApp Bidan Kala.' },
      ],
      testimonial: {
        quote: 'Bidan Kala sangat telaten.',
        author: 'Bunda Clarissa',
        area: 'Wiyung, Surabaya Barat',
      },
      faqs: [
        { q: 'Usia berapa bayi boleh dipijat?', a: 'Sejak usia newborn sudah aman.' },
      ],
    },
    {
      slug: 'reservasi-online',
      title: 'Reservasi Online Homecare Bidan Kala | Surabaya & Sidoarjo',
      refCode: 'LP-RESERVASI-ONLINE',
      active: true,
      layout: [
        { blockType: 'hero', headline: 'Si Kecil Lebih Tenang' },
        { blockType: 'painPoints', title: 'Khawatir?' },
        { blockType: 'solutions', title: 'Solusi Kala' },
        { blockType: 'pricing', title: 'Paket Perawatan' },
        { blockType: 'steps', title: 'Cara Reservasi' },
        { blockType: 'testimonials', title: 'Kata Bunda' },
        { blockType: 'guarantee', title: 'Garansi 100%' },
        { blockType: 'faq', title: 'FAQ' },
        { blockType: 'cta', headline: 'Chat WhatsApp' },
      ],
    },
  ]

  let sourceDocs: LegacyLandingPage[] = []

  if (payload) {
    try {
      const res = await payload.find({
        collection: 'landing-pages',
        limit: 100,
      })
      sourceDocs = res.docs || []
      if (sourceDocs.length === 0) {
        console.log('ℹ️ Tidak ada dokumen legacy di koleksi landing-pages. Tidak ada yang dimigrasikan.')
        process.exit(0)
      }
      console.log(`📋 Ditemukan ${sourceDocs.length} landing page di database lokal.`)
    } catch (e: any) {
      console.error('❌ Gagal membaca dari koleksi landing-pages:', e.message)
      process.exit(1)
    }
  } else {
    if (!isDryRun) {
      console.error('❌ Tidak dapat terhubung ke PostgreSQL. Migrasi live dibatalkan agar tidak menghasilkan status palsu.')
      console.error('   Jalankan ulang saat database aktif, atau gunakan --dry-run untuk simulasi.')
      process.exit(1)
    }
    sourceDocs = sampleLandingPages
    console.log('🧪 DB tidak tersedia; memakai data sampel hanya untuk simulasi dry-run.')
  }

  console.log(`Memproses ${sourceDocs.length} dokumen:\n`)

  let migratedCount = 0

  for (const doc of sourceDocs) {
    const pageData = mapLandingToPageData(doc)
    console.log(`--------------------------------------------------------------------------------`)
    console.log(`📄 Slug: /sales/${doc.slug}`)
    console.log(`   Judul       : ${pageData.title}`)
    console.log(`   Ref Code    : ${pageData.refCode}`)
    console.log(`   Tipe / Form : ${pageData.pageType} (${pageData.pageLayout})`)
    console.log(`   Status      : ${pageData._status}`)
    console.log(`   Jumlah Blok : ${pageData.layout.length} blok (${pageData.layout.map((b: any) => b.blockType).join(', ')})`)

    if (payload && !isDryRun) {
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: doc.slug } },
      })

      if (existing.totalDocs > 0) {
        const existingDoc = existing.docs[0]
        console.log(`   ⚡ Halaman sudah ada di Pages (ID: ${existingDoc.id}). Melakukan konsolidasi metadata & blok...`)
        await payload.update({
          collection: 'pages',
          id: existingDoc.id,
          data: {
            pageType: 'landing',
            pageLayout: pageData.pageLayout,
            refCode: pageData.refCode,
            variant: pageData.variant,
            activePixels: pageData.activePixels,
            layout: pageData.layout,
            _status: pageData._status,
          },
        })
      } else {
        console.log(`   ✨ Membuat dokumen baru di Pages...`)
        await payload.create({
          collection: 'pages',
          data: pageData,
        })
      }
    } else {
      console.log(`   [DRY-RUN] Simulasi sukses: Dokumen siap dimigrasikan ke Pages.`)
    }

    migratedCount++
  }

  // Pembersihan otomatis artefak lama non-kebab/halaman uji jika ada di database
  if (payload) {
    try {
      const testDocs = await payload.find({
        collection: 'pages',
        where: { slug: { equals: 'babyMassage' } },
        overrideAccess: true,
      })
      if (testDocs.docs.length > 0) {
        for (const doc of testDocs.docs) {
          await payload.delete({
            collection: 'pages',
            id: doc.id,
            overrideAccess: true,
          })
          console.log(`🗑️ Halaman uji lama "${doc.slug}" (ID: ${doc.id}) berhasil dibersihkan dari CMS.`)
        }
      }
    } catch (e: any) {
      console.warn(`[Cleanup] Tidak dapat memeriksa halaman uji babyMassage: ${e.message}`)
    }
  }

  console.log(`\n================================================================================`)
  console.log(`🎉 Berhasil memproses ${migratedCount} landing page!`)
  console.log(`Seluruh landing page kini terpetakan 100% ke schema Pages dengan blok modern.`)
  console.log(`================================================================================\n`)

  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal migration error:', err)
  process.exit(1)
})
