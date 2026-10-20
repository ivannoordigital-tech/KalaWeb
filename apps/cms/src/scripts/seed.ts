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
    {
      title: 'Reservasi Online Homecare Bidan Kala | Surabaya & Sidoarjo',
      slug: 'reservasi-online',
      headline: 'Si Kecil Lebih Tenang, Tidur Lebih Nyenyak, Tumbuh Lebih Optimal',
      subheadline: 'Layanan pijat & perawatan profesional untuk bayi dan ibu nifas langsung di rumah Bunda oleh bidan ber-STR resmi Kemenkes.',
      refCode: 'LP-RESERVASI-ONLINE',
      price: 'Mulai Rp60.000',
      duration: '40 - 100 Menit',
      active: true,
      layout: [
        {
          blockType: 'hero',
          badge: '✨ Pilihan #1 Orang Tua di Surabaya & Sidoarjo',
          headline: 'Si Kecil Lebih Tenang, Tidur Lebih Nyenyak, Tumbuh Lebih Optimal',
          subheadline: 'Layanan pijat & perawatan profesional untuk bayi dan ibu nifas langsung di rumah Bunda oleh bidan ber-STR resmi Kemenkes RI.',
          price: 'Mulai Rp60.000',
          duration: '40 - 100 Menit',
          ctaText: 'Konsultasi Gratis via WhatsApp',
          ctaMessage: 'Halo Bidan Kala, saya mau reservasi homecare untuk si kecil',
          bgStyle: 'gradient',
        },
        {
          blockType: 'painPoints',
          title: 'Apakah Bunda Kerap Khawatir dengan Kondisi Ini?',
          subtitle: 'Bunda tidak sendiri. Ratusan orang tua baru di Surabaya & Sidoarjo merasakan hal yang sama:',
          points: [
            { icon: '😭', title: 'Bayi Sering Rewel & Sulit Tidur', description: 'Si kecil terus menangis di malam hari akibat perut kembung atau kolik yang tak kunjung reda.' },
            { icon: '🚗', title: 'Mager Keluar Rumah & Macet', description: 'Membawa newborn ke luar rumah menembus kemacetan dan antrean klinik sangat melelahkan bagi Bunda pasca-persalinan.' },
            { icon: '⚠️', title: 'Khawatir Pijat Tradisional Sembarangan', description: 'Ragu dengan terapis pijat urut umum yang tidak memahami anatomi dan fisiologi bayi yang masih rentan.' },
            { icon: '🥺', title: 'Kelelahan & Cemas Tanpa Arahan', description: 'Butuh teman konsultasi seputar menyusui, tali pusat, dan tumbuh kembang anak yang ramah tanpa menghakimi.' },
          ],
        },
        {
          blockType: 'solutions',
          title: 'Mengapa Memilih Layanan Homecare Bidan Kala?',
          subtitle: 'Bukan sekadar pijat relaksasi biasa, melainkan perawatan holistik berbasis kebidanan profesional.',
          items: [
            { icon: '👩‍⚕️', title: '100% Bidan Resmi Ber-STR', description: 'Ditangani langsung oleh bidan berijazah kebidanan dengan STR aktif Kemenkes RI dan bersertifikat baby massage.' },
            { icon: '🏡', title: 'Nyaman di Kamar Bunda', description: 'Bidan hadir tepat waktu ke rumah membawa seluruh perlengkapan steril (perlak, handuk bersih, dan minyak food-grade).' },
            { icon: '🌿', title: 'Minyak Organik Food-Grade', description: 'Tanpa minyak mineral sintetis atau pewangi keras. 100% aman untuk kulit sensitif bayi baru lahir.' },
          ],
          highlightQuote: {
            quote: 'Bidan Kala sangat telaten dan sabar. Bayiku yang tadinya rewel karena kembung langsung rileks dan tidur pulas 4 jam berturut-turut.',
            author: 'Bunda Nadhira & Baby Zayn (Surabaya)',
          },
        },
        {
          blockType: 'pricing',
          badge: 'Paket Favorit Bunda',
          title: 'Pilihan Paket Perawatan Terbaik Buah Hati & Bunda',
          subtitle: 'Semua paket sudah termasuk konsultasi kebidanan gratis dan peralatan steril lengkap.',
          packages: [
            {
              name: 'Pijat Ceria Newborn',
              target: 'Bayi 0 - 6 Bulan',
              price: 'Rp60.000',
              originalPrice: 'Rp80.000',
              duration: '40 Menit',
              description: 'Pijat stimulasi taktil lembut oleh bidan untuk meredakan kolik dan membantu si kecil tidur lelap.',
              isPopular: false,
              features: [
                { feature: 'Minyak food-grade steril' },
                { feature: 'Pijat perut ILU pereda kolik' },
                { feature: 'Evaluasi tumbuh kembang dasar' },
              ],
              ctaText: 'Pilih Paket Newborn',
              refCode: 'PKG-NEWBORN',
            },
            {
              name: 'Kala Bundle Duo (Mom & Baby)',
              target: '1 Ibu + 1 Bayi',
              price: 'Rp150.000',
              originalPrice: 'Rp190.000',
              duration: '100 Menit',
              description: 'Paket komplit relaksasi pasca-persalinan untuk Bunda dan pijat ceria untuk buah hati.',
              isPopular: true,
              popularBadge: 'Paling Diminati Bunda ⭐',
              features: [
                { feature: 'Pijat rileksasi nifas / laktasi Bunda' },
                { feature: 'Pijat ceria stimulasi bayi' },
                { feature: 'Konsultasi menyusui & pelekatan' },
                { feature: 'Peralatan higienis steril lengkap' },
              ],
              ctaText: 'Reservasi Paket Duo',
              refCode: 'PKG-DUO',
            },
            {
              name: 'Kala Bundle Selapan Full',
              target: 'Bayi 0 - 12 Bulan',
              price: 'Rp100.000',
              originalPrice: 'Rp155.000',
              duration: '80 Menit',
              description: 'Tradisi selapanan praktis dan higienis: cukur bersih dengan silet steril sekali pakai, pijat relaksasi, dan mandi air hangat.',
              isPopular: false,
              features: [
                { feature: 'Cukur gundul steril silet baru' },
                { feature: 'Pijat relaksasi bayi lembut' },
                { feature: 'Mandi air hangat aromaterapi' },
              ],
              ctaText: 'Pilih Paket Selapan',
              refCode: 'PKG-SELAPAN',
            },
          ],
        },
        {
          blockType: 'comparison',
          title: 'Beda Layanan Bidan Kala dengan Pijat Urut Biasa',
          subtitle: 'Keamanan dan ketenangan buah hati Bunda adalah prioritas utama kami.',
          kalaLabel: 'Kala Moms & Baby Spa',
          otherLabel: 'Pijat Urut Umum / Keliling',
          rows: [
            { feature: 'Kualifikasi Praktisi', kalaValue: '100% Bidan Lulusan Kebidanan & Ber-STR Kemenkes', otherValue: 'Terapis otodidak tanpa legalitas medis resmi' },
            { feature: 'Higienitas & Alat', kalaValue: 'Perlak steril, alat sekali pakai, cuci tangan aseptik', otherValue: 'Alat seadanya dan risiko kontaminasi silang' },
            { feature: 'Teknik Pemijatan', kalaValue: 'Sentuhan anatomis lembut berbasis stimulasi sensori', otherValue: 'Pijatan keras yang berisiko cedera otot/sendi bayi' },
            { feature: 'Konseling Bunda', kalaValue: 'Pendampingan ramah, empati, tanpa mom-shaming', otherValue: 'Kerap memberi komentar menghakimi seputar ASI/pola asuh' },
          ],
        },
        {
          blockType: 'steps',
          title: 'Cara Reservasi Mudah & Cepat',
          subtitle: 'Hanya perlu 3 langkah praktis dari ponsel Bunda:',
          steps: [
            { num: '1', title: 'Hubungi WhatsApp Bidan', description: 'Ceritakan usia si kecil, keluhan (bila ada), dan alamat rumah Bunda di Surabaya / Sidoarjo.' },
            { num: '2', title: 'Pilih Hari & Jam', description: 'Tentukan jadwal kunjungan yang paling nyaman sesuai waktu bangun dan tidur si kecil.' },
            { num: '3', title: 'Bidan Tiba di Rumah', description: 'Bidan kami hadir tepat waktu dengan seragam rapi dan perlengkapan higienis steril.' },
          ],
        },
        {
          blockType: 'testimonials',
          title: 'Apa Kata Bunda yang Telah Menggunakan Kala?',
          subtitle: 'Kepuasan dan kebahagiaan keluarga Anda adalah energi kami.',
          items: [
            { quote: 'Setelah sesi pertama baby massage, Zayn langsung tidur nyenyak 4 jam berturut-turut. Bidan sangat ramah dan telaten!', author: 'Bunda Nadhira', role: 'Mama dari Baby Zayn (3 minggu)', area: 'Waru, Sidoarjo' },
            { quote: 'Pasca operasi caesar gerak serba nyeri. Bidan Kala datang bantu pijat laktasi dan baby massage. ASI langsung lancar dan badan enteng!', author: 'Bunda Clarissa', role: 'Mama dari Baby Kenzo (1 bulan)', area: 'Wiyung, Surabaya Barat' },
            { quote: 'Pijatannya lembut banget, beda sama dukun urut zaman dulu. Bidan jelasin fungsi tiap gerakan dengan jelas. Sangat recommended!', author: 'Bunda Sarah', role: 'Mama dari Baby Arka (2 bulan)', area: 'Rungkut, Surabaya Timur' },
          ],
        },
        {
          blockType: 'guarantee',
          badge: '🛡️ Komitmen Kepuasan 100%',
          title: 'Garansi Kenyamanan Buah Hati Bunda',
          description: 'Jika si kecil rewel atau Bunda merasa pelayanan bidan kami tidak sesuai standar kebidanan ramah yang kami janjikan, kami sediakan sesi evaluasi ulang gratis tanpa ribet.',
          note: '*Kenyamanan dan ketenangan Bunda serta si kecil adalah kehormatan bagi kami.',
        },
        {
          blockType: 'faq',
          title: 'Pertanyaan yang Sering Diajukan',
          subtitle: 'Informasi lengkap seputar kunjungan homecare Bidan Kala.',
          faqs: [
            { q: 'Kapan waktu terbaik untuk memijat bayi?', a: 'Waktu terbaik adalah saat bayi dalam kondisi tenang dan tidak mengantuk berat, sekitar 45 menit setelah menyusui agar tidak muntah.' },
            { q: 'Apakah Bunda perlu menyiapkan peralatan khusus?', a: 'Tidak perlu repot. Bidan Kala membawa perlak steril, minyak food-grade, serta perlengkapan pendukung bersih. Bunda cukup sediakan pakaian ganti si kecil.' },
            { q: 'Bagaimana jika si kecil menangis saat treatment?', a: 'Bidan kami tidak pernah memaksakan tindakan. Kami akan memberi jeda, menenangkan si kecil, atau mempersilakan Bunda menyusui terlebih dahulu.' },
          ],
        },
        {
          blockType: 'cta',
          badge: 'Slot Terbatas Setiap Hari',
          headline: 'Berikan Sentuhan Terbaik untuk Tumbuh Kembang Buah Hati',
          description: 'Konsultasikan kebutuhan perawatan si kecil bersama Bidan Kala sekarang juga via WhatsApp.',
          buttonText: 'Chat Bidan Kala via WhatsApp',
          buttonMessage: 'Halo Bidan Kala, saya mau reservasi homecare untuk si kecil',
          footnote: '⚡ Balas cepat dalam 5 menit · Bebas mom-shaming',
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
    } else if ((lp as any).layout && existing.docs[0]) {
      console.log(`Updating landing page with layout: ${lp.title}`)
      await (payload.update as any)({
        collection: 'landing-pages',
        id: existing.docs[0].id,
        data: {
          layout: (lp as any).layout,
        },
      })
    }
  }

  // 6. Seed Custom Pages
  const initialPages = [
    {
      title: 'Syarat dan Ketentuan Layanan',
      slug: 'syarat-ketentuan',
      description: 'Ketentuan pemesanan, reservasi homecare, higienitas medis, dan pembatalan kunjungan bidan Kala Moms and Baby Spa.',
      showWhatsAppCta: true,
      whatsappCustomMessage: 'Halo Bidan Kala, saya mau tanya mengenai syarat dan ketentuan pemesanan',
      _status: 'published',
    },
  ]

  for (const pg of initialPages) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: pg.slug } },
    })
    if (existing.totalDocs === 0) {
      console.log(`Seeding custom page: ${pg.title}`)
      await (payload.create as any)({
        collection: 'pages',
        data: pg,
        draft: false,
      })
    }
  }

  // 7. Seed Block Templates (Pustaka Template Blok)
  const initialTemplates = [
    {
      name: 'Template Galeri Momen & Testimoni',
      slug: 'template-galeri-testimoni',
      category: 'galeri',
      description: 'Kombinasi blok dokumentasi foto tindakan bidan dan ulasan kepuasan Bunda untuk meningkatkan rasa percaya (social proof).',
      layout: [
        {
          blockType: 'gallery',
          badge: 'Dokumentasi Kala',
          title: 'Momen Hangat & Ceria Buah Hati Bersama Bidan',
          subtitle: 'Dokumentasi asli kenyamanan penanganan homecare langsung di kamar Bunda di Surabaya & Sidoarjo.',
          columns: '3',
          bgStyle: 'warm',
          images: [
            {
              imageUrlFallback: '/images/hero-baby.jpg',
              caption: 'Pijat kolik meredakan perut begah Baby Zayn',
              tag: 'Baby Massage · 1 Bulan',
            },
            {
              imageUrlFallback: '/images/hero-baby.jpg',
              caption: 'Stimulasi sensori taktil lembut untuk newborn',
              tag: 'Newborn Ceria · 2 Minggu',
            },
            {
              imageUrlFallback: '/images/hero-baby.jpg',
              caption: 'Pijat laktasi nifas melancarkan ASI Bunda',
              tag: 'Postpartum Mom Care',
            },
          ],
        },
        {
          blockType: 'testimonials',
          title: 'Apa Kata Bunda yang Telah Menggunakan Kala?',
          subtitle: 'Kepuasan dan kebahagiaan keluarga Anda adalah energi utama kami.',
          items: [
            {
              quote: 'Setelah sesi pertama baby massage, Zayn langsung tidur nyenyak 4 jam berturut-turut. Bidan sangat ramah dan telaten!',
              author: 'Bunda Nadhira',
              role: 'Mama dari Baby Zayn (3 minggu)',
              area: 'Waru, Sidoarjo',
            },
            {
              quote: 'Pasca operasi caesar gerak serba nyeri. Bidan Kala datang bantu pijat laktasi dan baby massage. ASI langsung lancar dan badan enteng!',
              author: 'Bunda Clarissa',
              role: 'Mama dari Baby Kenzo (1 bulan)',
              area: 'Wiyung, Surabaya Barat',
            },
          ],
        },
      ],
    },
    {
      name: 'Template Penawaran Promo & WhatsApp Langsung',
      slug: 'template-promo-kilat',
      category: 'promo',
      description: 'Template ringkas untuk promo kilat: Hero banner diskon langsung ke WhatsApp CTA.',
      layout: [
        {
          blockType: 'hero',
          badge: '⚡ Promo Terbatas Khusus Pekan Ini',
          headline: 'Booking Homecare Bidan Kala, Diskon Spesial Treatment Pertama',
          subheadline: 'Perawatan lembut penuh kasih untuk Bunda & Bayi langsung di rumah oleh bidan ber-STR resmi.',
          price: 'Mulai Rp60.000',
          duration: '40 Menit',
          ctaText: 'Klaim Promo via WhatsApp',
          ctaMessage: 'Halo Bidan Kala, saya mau klaim promo diskon treatment pertama',
          bgStyle: 'gradient',
        },
        {
          blockType: 'cta',
          badge: 'Slot Terbatas',
          headline: 'Amankan Jadwal Bidan ke Rumah Anda Sekarang',
          description: 'Tim kami merespons cepat setiap hari demi kenyamanan buah hati Anda.',
          buttonText: '💬 Chat WhatsApp Bidan Sekarang',
          buttonMessage: 'Halo Bidan Kala, saya mau reservasi homecare promo',
          footnote: '⚡ Respon cepat dalam 5 menit · Bebas mom-shaming',
        },
      ],
    },
  ]

  for (const tmpl of initialTemplates) {
    const existing = await payload.find({
      collection: 'block-templates',
      where: { slug: { equals: tmpl.slug } },
    })
    if (existing.totalDocs === 0) {
      console.log(`Seeding block template: ${tmpl.name}`)
      await (payload.create as any)({
        collection: 'block-templates',
        data: tmpl,
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
