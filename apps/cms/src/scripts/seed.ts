import config from '@payload-config'
import { getPayload } from 'payload'

export async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding initial Kala Moms & Baby Spa data into Payload CMS...')

  // 1. Create Superadmin if not exists
  const existingUsers = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'admin@kalababyspa.com',
      },
    },
  })

  if (existingUsers.totalDocs === 0) {
    console.log('Creating initial admin user: admin@kalababyspa.com')
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@kalababyspa.com',
        password: 'KalaAdminPassword2026!',
        name: 'Admin Utama Kala',
        role: 'superadmin',
      },
    })
  }

  // 2. Seed Services
  const initialServices = [
    {
      serviceId: 'bundle-duo',
      name: 'Kala Bundle Duo (Mom & Baby Ceria)',
      target: '1 Ibu + 1 Bayi',
      duration: '100 Menit',
      originalPrice: 'Rp190.000',
      price: 'Rp150.000',
      numericPrice: 150000,
      description: 'Perawatan komplit relaksasi pasca-persalinan untuk Bunda dan pijat lembut stimulasi ceria untuk si kecil dalam satu kali kunjungan hangat.',
      badge: 'Paling Diminati Bunda',
      popular: true,
      refCode: 'KALA-SRV-DUO',
      message: 'Halo Bidan Kala, saya mau reservasi Kala Bundle Duo (Mom & Baby Ceria) Rp150.000 [ref: KALA-SRV-DUO]',
    },
    {
      serviceId: 'baby-newborn',
      name: 'Kala Baby – Pijat Ceria Newborn',
      target: 'Bayi 0 - 6 Bulan',
      duration: '40 Menit',
      originalPrice: 'Rp80.000',
      price: 'Rp60.000',
      numericPrice: 60000,
      description: 'Pijat stimulasi taktil lembut oleh bidan dengan minyak food-grade steril. Membantu si kecil lebih rileks, meredakan ketegangan adaptasi lahir, dan tidur lebih lelap.',
      badge: 'Best Entry Baru Lahir',
      popular: false,
      refCode: 'KALA-SRV-NEWBORN',
      message: 'Halo Bidan Kala, saya mau reservasi Kala Baby Pijat Ceria Newborn Rp60.000 [ref: KALA-SRV-NEWBORN]',
    },
    {
      serviceId: 'bundle-selapan',
      name: 'Kala Bundle Selapan Full',
      target: 'Bayi 0 - 12 Bulan',
      duration: '80 Menit',
      originalPrice: 'Rp155.000',
      price: 'Rp100.000',
      numericPrice: 100000,
      description: 'Tradisi selapanan praktis dan higienis: cukur bersih/gundul dengan alat steril, pijat ceria rileks, dan mandi air hangat didampingi bidan penuh kehangatan.',
      badge: 'Tradisi Praktis Steril',
      popular: false,
      refCode: 'KALA-SRV-SELAPAN',
      message: 'Halo Bidan Kala, saya mau reservasi Kala Bundle Selapan Full Rp100.000 [ref: KALA-SRV-SELAPAN]',
    },
  ]

  for (const srv of initialServices) {
    const existing = await payload.find({
      collection: 'services',
      where: { serviceId: { equals: srv.serviceId } },
    })
    if (existing.totalDocs === 0) {
      console.log(`Seeding service: ${srv.name}`)
      await payload.create({
        collection: 'services',
        data: srv,
      })
    }
  }

  // 3. Seed Testimonials
  const initialTestimonials = [
    {
      quote: 'Setelah melahirkan sesar rasanya badan remuk dan cemas banget pegang newborn. Begitu Bidan Kala datang, langsung diajak ngobrol santai tanpa disalah-salahin soal ASI. Pijatan lembutnya bikin anakku tidur tenang banget.',
      author: 'Bunda Sarah & Baby Arka (2 bulan)',
      location: 'Rungkut, Surabaya Timur',
      service: 'Kala Bundle Duo',
    },
    {
      quote: 'Si kecil sempat sering nangis histeris tiap malam karena kembung. Bidan Kala sabar banget ngajarin gerakan ILU dan posisi sendawa yang benar. Sekarang jauh lebih tenang dan kami nggak panikan lagi.',
      author: 'Bunda Nadhira & Baby Zayn (3 minggu)',
      location: 'Waru, Sidoarjo',
      service: 'Pijat Ceria Newborn',
    },
    {
      quote: 'Cukur selapanan di rumah sama Bidan Kala higienis banget. Alatnya steril dan bidannya telaten ngalihin perhatian bayi sampai nggak nangis sama sekali. Praktis nggak perlu keluar rumah.',
      author: 'Bunda Clarissa & Baby Kenzo (1 bulan)',
      location: 'Wiyung, Surabaya Barat',
      service: 'Kala Bundle Selapan Full',
    },
  ]

  for (const test of initialTestimonials) {
    const existing = await payload.find({
      collection: 'testimonials',
      where: { author: { equals: test.author } },
    })
    if (existing.totalDocs === 0) {
      console.log(`Seeding testimonial from: ${test.author}`)
      await payload.create({
        collection: 'testimonials',
        data: test,
      })
    }
  }

  // 4. Seed 3 Pillar Articles
  const initialArticles = [
    {
      title: 'Cara Mengatasi Bayi Kolik Malam Hari: Panduan Bidan Tenangkan Tangisan Si Kecil',
      slug: 'bayi-kolik-malam-hari',
      description: 'Panduan praktis dan ilmiah cara mengatasi bayi kolik malam hari. Penjelasan fisiologis, teknik pijat ILU, pertolongan pertama, dan tanda kapan harus ke dokter anak.',
      author: 'Bidan Annisa, S.Tr.Keb',
      authorTitle: 'Bidan Praktisi Homecare Kala',
      category: 'bayi' as const,
      medicalReviewer: 'Tim Medis & Kebidanan Kala Moms and Baby Spa',
      heroImageUrlFallback: '/images/blog/bayi-kolik.svg',
      heroImageAlt: 'Bidan mengedukasi Bunda teknik relaksasi bayi kembung dan kolik di rumah',
      keywords: [
        { keyword: 'cara mengatasi bayi kolik malam hari' },
        { keyword: 'bayi kolik menangis terus' },
        { keyword: 'pijat kolik bayi ILU' },
        { keyword: 'bayi kembung malam hari' },
      ],
      _status: 'published' as const,
    },
    {
      title: 'Manfaat Pijat Oksitosin untuk Ibu Menyusui: Rahasia ASI Lancar Bebas Cemas',
      slug: 'manfaat-pijat-oksitosin-ibu-menyusui',
      description: 'Panduan medis pijat oksitosin untuk melancarkan let-down reflex ASI pada ibu menyusui. Manfaat relaksasi, cara stimulasi hormon cinta, dan panduan praktis untuk Ayah di rumah.',
      author: 'Bidan Annisa, S.Tr.Keb',
      authorTitle: 'Bidan Praktisi Homecare Kala',
      category: 'ibu-menyusui' as const,
      medicalReviewer: 'Tim Medis & Kebidanan Kala Moms and Baby Spa',
      heroImageUrlFallback: '/images/blog/pijat-oksitosin.svg',
      heroImageAlt: 'Sentuhan pijat oksitosin di area punggung ibu menyusui dengan suasana tenang',
      keywords: [
        { keyword: 'manfaat pijat oksitosin ibu menyusui' },
        { keyword: 'cara melancarkan ASI mampet' },
        { keyword: 'titik pijat oksitosin punggung' },
      ],
      _status: 'published' as const,
    },
    {
      title: 'Panduan Memilih Jasa Pijat Bayi Homecare di Surabaya: Waspada Malpraktik & Mom-Shaming',
      slug: 'panduan-memilih-pijat-bayi-homecare-surabaya',
      description: 'Panduan lengkap bagi orang tua di Surabaya dan Sidoarjo dalam memilih layanan spa dan pijat bayi homecare profesional. Kriteria legalitas STR bidan, higienitas steril, dan kenyamanan tanpa penghakiman.',
      author: 'Bidan Annisa, S.Tr.Keb',
      authorTitle: 'Bidan Praktisi Homecare Kala',
      category: 'layanan' as const,
      medicalReviewer: 'Tim Medis & Kebidanan Kala Moms and Baby Spa',
      heroImageUrlFallback: '/images/blog/homecare-surabaya.svg',
      heroImageAlt: 'Bidan homecare Kala memeriksa kondisi bayi dengan hangat di kamar tidur pasien',
      keywords: [
        { keyword: 'pijat bayi homecare surabaya' },
        { keyword: 'baby spa panggilan surabaya sidoarjo' },
        { keyword: 'bidan homecare bayi bersertifikat' },
      ],
      _status: 'published' as const,
    },
  ]

  for (const art of initialArticles) {
    const existing = await payload.find({
      collection: 'articles',
      where: { slug: { equals: art.slug } },
    })
    if (existing.totalDocs === 0) {
      console.log(`Seeding article: ${art.title}`)
      await payload.create({
        collection: 'articles',
        data: {
          ...art,
          pubDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
        },
      })
    }
  }

  console.log('Seeding completed successfully!')
  process.exit(0)
}

if (process.argv[1]?.includes('seed')) {
  seed().catch((err) => {
    console.error('Seed error:', err)
    process.exit(1)
  })
}
