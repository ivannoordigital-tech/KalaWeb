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
      slug: 'bundle-duo',
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
      slug: 'baby-newborn',
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
      slug: 'bundle-selapan',
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
      where: { slug: { equals: srv.slug } },
    })
    if (existing.totalDocs === 0) {
      console.log(`Seeding service: ${srv.name}`)
      await (payload.create as any)({
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
      area: 'Rungkut, Surabaya Timur',
      service: 'Kala Bundle Duo',
    },
    {
      quote: 'Si kecil sempat sering nangis histeris tiap malam karena kembung. Bidan Kala sabar banget ngajarin gerakan ILU dan posisi sendawa yang benar. Sekarang jauh lebih tenang dan kami nggak panikan lagi.',
      author: 'Bunda Nadhira & Baby Zayn (3 minggu)',
      area: 'Waru, Sidoarjo',
      service: 'Pijat Ceria Newborn',
    },
    {
      quote: 'Cukur selapanan di rumah sama Bidan Kala higienis banget. Alatnya steril dan bidannya telaten ngalihin perhatian bayi sampai nggak nangis sama sekali. Praktis nggak perlu keluar rumah.',
      author: 'Bunda Clarissa & Baby Kenzo (1 bulan)',
      area: 'Wiyung, Surabaya Barat',
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
      await (payload.create as any)({
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
      await (payload.create as any)({
        collection: 'articles',
        data: {
          ...art,
          pubDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
        },
      })
    }
  }

  // 5. Seed Landing Pages for Ads
  const initialLandingPages = [
    {
      title: 'Solusi Tangis Kolik & Perut Kembung Bayi di Surabaya & Sidoarjo',
      slug: 'bayi-kolik',
      headline: 'Atasi Tangis Bayi Akibat Kolik & Kembung Tanpa Panik',
      subheadline: 'Bidan ber-STR resmi hadir langsung ke rumah Bunda. Terapi pijat ILU anatomi medis + evaluasi perlekatan menyusui untuk meredakan tangisan si kecil.',
      refCode: 'LP-KOLIK-ADS',
      price: 'Rp60.000',
      duration: '40 Menit',
      active: true,
      painPoints: [
        { point: 'Bayi menangis histeris di sore atau malam hari dengan kaki menekuk ke dada' },
        { point: 'Perut si kecil terasa kencang, begah, atau berbunyi keras saat disentuh' },
        { point: 'Bunda dan Ayah kelelahan, kurang tidur, dan merasa cemas bingung harus berbuat apa' },
        { point: 'Takut mencoba obat sembarangan atau pijat urut tradisional yang terlalu keras' },
      ],
      solutions: [
        {
          title: 'Teknik Pijat ILU Klinis & Gerakan Kayuh Sepeda',
          desc: 'Stimulasi gerak peristaltik usus yang terbukti ilmiah membantu mengeluarkan gas terjebak secara alami dan tanpa rasa sakit.',
        },
        {
          title: 'Evaluasi Sendawa & Pelekatan Menyusui',
          desc: 'Bidan memeriksa posisi menyusui Bunda untuk mencegah udara tertelan (aerofagia) saat bayi minum ASI atau susu botol.',
        },
        {
          title: 'Zero Mom-Shaming Guarantee',
          desc: 'Rasa lelah dan cemas Bunda kami validasi dengan penuh kehangatan. Tidak ada nada menghakimi.',
        },
      ],
      steps: [
        { num: '1', title: 'Chat WhatsApp', desc: 'Sampaikan keluhan tangis bayi Bunda dan tentukan jam kedatangan bidan.' },
        { num: '2', title: 'Bidan Tiba di Rumah', desc: 'Bidan memeriksa tanda vital, membawa perlak steril & minyak food-grade.' },
        { num: '3', title: 'Bayi Rileks & Tenang', desc: 'Gas keluar, perut si kecil lebih nyaman, dan Bunda bisa beristirahat lega.' },
      ],
      testimonial: {
        quote: 'Baby Zayn sempat nangis 3 jam tiap malam. Bidan Kala datang dan sabar banget ngeluarin gas di perutnya pakai pijatan lembut. Malam itu Zayn bisa tidur nyenyak 4 jam berturut-turut. Terima kasih banyak!',
        author: 'Bunda Nadhira & Baby Zayn (3 minggu)',
        area: 'Waru, Sidoarjo',
      },
      faqs: [
        {
          q: 'Kapan waktu terbaik untuk pijat kolik?',
          a: 'Paling baik dilakukan saat bayi dalam kondisi tenang atau di antara jadwal minum (sekitar 45 menit setelah menyusui), bukan saat bayi sedang kelaparan atau tepat setelah minum kenyang.',
        },
        {
          q: 'Apakah bidannya aman dan terpercaya?',
          a: 'Seluruh tim Kala adalah bidan berijazah kebidanan dengan Surat Tanda Registrasi (STR) aktif dari Kemenkes RI serta sertifikasi pijat bayi.',
        },
        {
          q: 'Bagaimana jika bayi menangis saat dipijat?',
          a: 'Bidan tidak akan pernah memaksa tindakan. Jika bayi butuh jeda, bidan akan menenangkan si kecil atau membiarkan Bunda menyusui terlebih dahulu.',
        },
      ],
    },
    {
      title: 'Pijat Ceria Newborn Homecare Surabaya & Sidoarjo | Bidan Ber-STR',
      slug: 'pijat-newborn',
      headline: 'Sentuhan Lembut Pertama untuk Kenyamanan Tumbuh Kembang Si Kecil',
      subheadline: 'Perawatan homecare khusus bayi baru lahir (0-6 bulan) langsung di kamar Bunda. Higienis steril, minyak food-grade, dan ditangani 100% oleh bidan resmi.',
      refCode: 'LP-NEWBORN-ADS',
      price: 'Rp60.000',
      duration: '40 Menit',
      active: true,
      painPoints: [
        { point: 'Kekhawatiran memegang dan merawat tubuh newborn yang masih sangat mungil dan rentan' },
        { point: 'Bayi sering kaget, rewel saat tidur, atau sulit beradaptasi dengan lingkungan luar rahim' },
        { point: 'Bunda masih dalam masa pemulihan nifas atau sesar, sulit keluar rumah menembus macet' },
        { point: 'Ragu dengan kebersihan terapis pijat umum yang belum memahami anatomi bayi baru lahir' },
      ],
      solutions: [
        {
          title: 'Stimulasi Taktil & Sensori Berstandar Medis',
          desc: 'Membantu menurunkan hormon stres kortisol bayi dan meningkatkan hormon relaksasi untuk kualitas tidur yang jauh lebih lelap.',
        },
        {
          title: 'Higienitas Medis & Minyak Food-Grade Steril',
          desc: 'Menggunakan perlak steril dan minyak alami tanpa pewangi sintetis yang 100% aman bagi kulit sensitif bayi baru lahir.',
        },
        {
          title: 'Praktis di Rumah Tanpa Macet',
          desc: 'Bunda cukup beristirahat di rumah dengan tenang. Bidan datang tepat waktu membawa seluruh perlengkapan bersih.',
        },
      ],
      steps: [
        { num: '1', title: 'Pilih Jadwal Kunjungan', desc: 'Hubungi WhatsApp Bidan Kala dan infokan usia si kecil serta alamat rumah Bunda.' },
        { num: '2', title: 'Kunjungan Bidan Bersih', desc: 'Bidan mencuci tangan aseptik, cek suhu tubuh bayi, dan menyiapkan perlak higienis.' },
        { num: '3', title: 'Tumbuh Ceria & Tidur Lelap', desc: 'Si kecil rileks, tidur lebih pulas, dan Bunda mendapatkan panduan stimulasi mandiri.' },
      ],
      testimonial: {
        quote: 'Setelah melahirkan sesar badan rasanya nyeri semua dan takut mandiin atau megang bayi. Bidan Kala telaten banget, ngajarin posisi gendong dan pijat stimulasi lembut. Rasanya tenang banget!',
        author: 'Bunda Clarissa & Baby Kenzo (1 bulan)',
        area: 'Wiyung, Surabaya Barat',
      },
      faqs: [
        {
          q: 'Usia berapa bayi sudah boleh dipijat oleh bidan?',
          a: 'Sejak usia beberapa hari setelah lahir (newborn) sudah sangat aman dilakukan pijatan stimulasi lembut, asalkan kondisi tanda vital stabil dan tali pusat dirawat secara benar.',
        },
        {
          q: 'Apakah Bunda perlu menyiapkan minyak sendiri?',
          a: 'Tidak perlu. Bidan Kala membawa minyak pijat food-grade alami steril yang telah disetujui standar medis untuk kulit bayi.',
        },
        {
          q: 'Apakah melayani seluruh area Surabaya dan Sidoarjo?',
          a: 'Ya, kami melayani seluruh kawasan Surabaya (Barat, Timur, Selatan, Pusat, Utara) serta Sidoarjo Kota dan sekitarnya.',
        },
      ],
    },
  ]

  for (const lp of initialLandingPages) {
    const existing = await payload.find({
      collection: 'landing-pages',
      where: { slug: { equals: lp.slug } },
    })
    if (existing.totalDocs === 0) {
      console.log(`Seeding landing page: ${lp.title}`)
      await (payload.create as any)({
        collection: 'landing-pages',
        data: lp,
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
