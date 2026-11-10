/**
 * One-off duplikasi homepage hardcoded menjadi draft Page "Homepage 2".
 *
 * Jalankan dari folder apps/cms:
 *   npm run create:homepage-2
 *
 * Script bersifat idempotent: jika slug "homepage-2" sudah ada, layout-nya
 * diperbarui dan tetap disimpan sebagai draft.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const painPoints = [
  {
    icon: '😟',
    title: 'Si Kecil Rewel & Sulit Tidur',
    description:
      'Sudah digendong dan ditenangkan, tapi si kecil masih gelisah? Bunda ingin membantunya merasa lebih nyaman.',
  },
  {
    icon: '🤧',
    title: 'Batuk Pilek Bikin Tidur Tak Nyenyak',
    description:
      'Hidung tersumbat, napas berbunyi, dan batuk pilek yang datang-pergi membuat si kecil tidak nyaman. Bunda khawatir, tapi tidak mau sembarangan menangani.',
  },
  {
    icon: '🍽️',
    title: 'GTM, Makan Jadi Drama',
    description:
      'Mulut tertutup, kepala menoleh, makanan ditolak. Bunda cemas apakah asupannya cukup.',
  },
  {
    icon: '🤱',
    title: 'ASI Terasa Kurang Lancar',
    description:
      'Bunda merasa ASI sulit keluar atau payudara terasa penuh dan tidak nyaman? Rasanya ingin menyusui lebih tenang, tanpa terus dibayangi rasa khawatir.',
  },
  {
    icon: '💭',
    title: 'Cemas, Takut Salah Merawat',
    description:
      'Setiap tangisan dan gerak si kecil bikin bertanya-tanya, “Ini normal atau tidak?” Bunda ingin yakin, tapi bingung harus tanya siapa.',
  },
  {
    icon: '🌱',
    title: 'Ingin Mendukung Tumbuh Kembang',
    description:
      'Bunda ingin memberikan stimulasi sesuai usia si kecil, sekaligus memahami cara perawatan sederhana di rumah.',
  },
]

const benefits = [
  {
    icon: '😴',
    title: 'Si Kecil Lebih Rileks',
    description:
      'Sentuhan lembut membantu si kecil lebih rileks menjelang waktu tidur. Saat si kecil nyaman, malam Bunda pun bisa terasa lebih tenang.',
  },
  {
    icon: '🌿',
    title: 'Lebih Nyaman Saat Batuk Pilek',
    description:
      'Saat hidung tersumbat membuat si kecil rewel, kami membantu memberikan kenyamanan melalui sentuhan lembut dan stimulasi aroma terapi serta panduan perawatan sederhana yang aman dilakukan di rumah.',
  },
  {
    icon: '🧠',
    title: 'Stimulasi Tumbuh Kembang',
    description:
      'Pijatan lembut yang disesuaikan dengan usia si kecil untuk mendukung gerak motorik dan tumbuh kembangnya secara alami.',
  },
  {
    icon: '🧸',
    title: 'Perawatan yang Lebih Personal',
    description:
      'Setiap Bunda dan si kecil memiliki kebutuhan berbeda. Kami menyesuaikan treatment dengan kondisi, usia, dan respons masing-masing agar perawatan terasa lebih nyaman.',
  },
  {
    icon: '✨',
    title: 'Bunda Lebih Tenang dan Percaya Diri',
    description:
      'Selain memberikan treatment, kami juga siap berbagi edukasi dan tips perawatan sederhana agar Bunda semakin percaya diri merawat si kecil di rumah.',
  },
]

const testimonials = [
  {
    author: 'Bunda Vita (Adek El & Kakak Al)',
    role: 'Pijat Bayi Homecare',
    area: 'Surabaya',
    quote:
      'Syukurlah kemarin habis massage tidurnya nyenyak, gak rewel lagi, bangun ngajak ngobrol trs tidur lagi gak pakai drama rewel lagi.',
  },
  {
    author: 'Bunda Viska & Adek Azel',
    role: 'Pijat Bayi Ceria',
    area: 'Rungkut, Surabaya',
    quote:
      'Biasanya kalo mau tidur harus dbf, kemarin setelah pijat alhamdulillah mau di nen tapi tiba2 tidur sendiri pules tanpa nen... Waktu malem juga mulai bisa tidur gak ngajak begadang lagi. Bakal langganan soalnya adek suka!',
  },
  {
    author: 'Bunda Irlandia (Arsya & Aira)',
    role: 'Terapi Batuk Pilek & Pijat',
    area: 'Wonokromo, Surabaya',
    quote:
      'Alhamdulillah setelah dipijat Arsya dan Aira nyenyak sekali tidurnya. Malamnya juga berkurang grok grok nya. Frekuensi melernya juga berkurang. Terima kasih treatmentnya Bubid.',
  },
]

const bookingSteps = [
  {
    num: '01',
    title: 'Konsultasi gratis',
    description:
      'Ceritakan usia dan kondisi si kecil. Bidan kami sarankan layanan yang paling sesuai.',
  },
  {
    num: '02',
    title: 'Pilih hari dan jam',
    description:
      'Kuota maksimal 5 sesi per hari. Jadwal dan area dikonfirmasi lewat WhatsApp.',
  },
  {
    num: '03',
    title: 'Bidan datang ke rumah',
    description:
      'Kami membawa semua perlengkapan. Bunda cukup menyiapkan ruang yang nyaman.',
  },
  {
    num: '04',
    title: 'Lanjutkan di rumah',
    description: 'Bunda mendapat panduan sederhana untuk stimulasi harian.',
  },
]

const coverageItems = [
  {
    region: 'Surabaya Barat',
    slug: 'surabaya-barat',
    areas: 'Wiyung, Sambikerep, Lakarsantri, Tandes, Sukomanunggal, Benowo, Pakal',
  },
  {
    region: 'Surabaya Timur',
    slug: 'surabaya-timur',
    areas: 'Rungkut, Gunung Anyar, Sukolilo, Mulyorejo, Gubeng, Tenggilis Mejoyo',
  },
  {
    region: 'Surabaya Selatan',
    slug: 'surabaya-selatan',
    areas: 'Wonokromo, Wonocolo, Jambangan, Gayungan, Karang Pilang, Sawahan',
  },
  {
    region: 'Surabaya Pusat',
    slug: 'surabaya-pusat',
    areas: 'Tegalsari, Genteng, Bubutan, Simokerto',
  },
  {
    region: 'Surabaya Utara',
    slug: 'surabaya-utara',
    areas: 'Kenjeran, Bulak, Pabean Cantian, Semampir, Krembangan',
  },
  {
    region: 'Kabupaten Sidoarjo',
    slug: 'sidoarjo',
    areas: 'Waru, Sedati, Gedangan, Candi, Buduran, Sidoarjo Kota, Sukodono, Taman, Krian',
  },
]

const faqs = [
  {
    q: 'Mulai usia berapa bayi boleh dipijat?',
    a: 'Kami melayani bayi baru lahir hingga anak 7 tahun. Teknik dan tekanan disesuaikan usia. Ceritakan kondisi si kecil saat konsultasi.',
  },
  {
    q: 'Apakah aman untuk bayi dengan kulit sensitif?',
    a: 'Kami memakai minyak dan sabun food-grade yang aman untuk kulit sensitif. Jika bayi punya riwayat alergi, sampaikan sebelum sesi agar produk disesuaikan.',
  },
  {
    q: 'Bagaimana jika bayi sedang demam atau sakit?',
    a: 'Sesi sebaiknya ditunda. Bayi yang demam atau tampak tidak sehat perlu diperiksa dokter terlebih dahulu.',
  },
  {
    q: 'Area mana saja yang dijangkau?',
    a: 'Surabaya Barat, Timur, Selatan, Pusat, Utara, dan Sidoarjo. Kirim lokasi Bunda lewat WhatsApp untuk memastikan jangkauan dan estimasi waktu kedatangan.',
  },
  {
    q: 'Apa yang perlu disiapkan di rumah?',
    a: 'Cukup ruang yang hangat dan tenang, serta alas yang nyaman. Perlengkapan lain dibawa oleh bidan.',
  },
  {
    q: 'Berapa sesi yang bisa dijadwalkan setiap hari?',
    a: 'Maksimal 5 sesi per hari agar setiap kunjungan tetap fokus dan higienis. Jadwal yang tersedia dikonfirmasi lewat WhatsApp.',
  },
  {
    q: 'Bagaimana cara pembayaran?',
    a: 'Pembayaran dapat dilakukan tunai, transfer bank, atau QRIS. Metode pembayaran dikonfirmasi saat booking lewat WhatsApp.',
  },
]

const spacing = 'normal' as const

const layout: any[] = [
  {
    blockType: 'hero',
    badge: 'HOMECARE IBU & BAYI • SURABAYA & SIDOARJO',
    headline: 'Perawatan Ibu & Bayi di Rumah oleh Bidan Profesional',
    subheadline:
      'Bunda Juga Berhak Dirawat dan Ditemani 🤍 — Menjadi ibu penuh kebahagiaan, tetapi terkadang juga melelahkan. Kala hadir langsung ke rumah untuk membantu Bunda merawat diri dan si kecil, dengan sentuhan lembut serta pendampingan yang hangat.',
    ctaText: 'Konsultasi via WhatsApp',
    ctaMessage: 'Halo Bu Bidan, saya mau konsultasi homecare untuk ibu dan bayi',
    align: 'left',
    btnColor: 'terracotta',
    bgStyle: 'gradient',
    disabled: false,
  },
  {
    blockType: 'painPoints',
    title: 'Apakah ini yang Sedang Bunda Rasakan?',
    subtitle: '',
    columns: '3',
    background: 'peach',
    spacing,
    points: painPoints,
    disabled: false,
  },
  {
    blockType: 'solutions',
    title: 'Yang biasa Bunda rasakan setelah sesi',
    subtitle:
      'Setiap sesi dirancang untuk menghadirkan pengalaman yang nyaman bagi si kecil dan ketenangan bagi Bunda.',
    items: benefits,
    highlightQuote: {
      quote:
        'Setiap bayi memiliki respons yang berbeda terhadap pijat. Treatment Kala bertujuan mendukung relaksasi, stimulasi, dan kenyamanan si kecil, bukan menggantikan pemeriksaan atau penanganan medis.',
      author: '',
    },
    disabled: false,
  },
  {
    blockType: 'testimonials',
    title: 'Kata Bunda yang Sudah Merasakan Sentuhan Kala',
    subtitle:
      'Dipercaya 1000+ Orang Tua di Surabaya & Sidoarjo · sejak 2020. Cerita dari Bunda di Surabaya dan Sidoarjo yang memilih kenyamanan homecare bersama bidan profesional kami.',
    items: testimonials,
    disabled: false,
  },
  {
    blockType: 'pricing',
    badge: 'Penawaran Reservasi Pertama',
    title: 'Promo treatment Kala',
    subtitle: 'Khusus Bunda di Surabaya & Sidoarjo.',
    layoutStyle: 'cards',
    background: 'cream',
    spacing,
    packages: [
      {
        name: 'Kala Baby: Pijat Ceria Newborn',
        target: 'Bayi 0 - 6 Bulan',
        price: 'Rp60.000',
        originalPrice: 'Rp80.000',
        duration: '40 Menit',
        description: 'Konfirmasi jadwal dan area via WhatsApp.',
        isPopular: true,
        popularBadge: 'Hemat 25%',
        features: [
          {
            feature:
              'Kuota harian maksimal 5 sesi agar setiap kunjungan tetap fokus dan higienis.',
          },
        ],
        ctaText: 'Ambil Promo via WhatsApp',
        refCode: 'KALA-PROMO-INTRO',
      },
    ],
    disabled: false,
  },
  {
    blockType: 'featuredServices',
    badge: 'Menu Layanan Terfavorit',
    title: '3 Layanan Unggulan Homecare Kala',
    subtitle:
      'Pilihan paling banyak dipesan oleh Bunda di Surabaya & Sidoarjo untuk memulihkan kebugaran ibu dan menstimulasi keceriaan si kecil.',
    source: 'cms',
    maxItems: 3,
    ctaText: 'Lihat Semua Layanan',
    ctaUrl: '/layanan',
    background: 'cream',
    disabled: false,
  },
  {
    blockType: 'valueProps',
    badge: 'Kenapa Memilih Kala?',
    title: '5 Hal yang Membuat Kala Berbeda',
    subtitle:
      'Setiap kunjungan Kala menghadirkan perawatan profesional, perhatian yang tulus, dan kenyamanan untuk Bunda serta si kecil.',
    items: [
      {
        icon: '01',
        title: 'Ditangani Langsung oleh Bidan Profesional',
        description:
          'Tenaga Kesehatan Berlatar Pendidikan Resmi. Setiap treatment ditangani oleh bidan dengan latar belakang pendidikan kebidanan dan kompetensi sesuai layanan, sehingga Bunda bisa merasa lebih tenang mempercayakan perawatan diri maupun si kecil.',
        highlight: false,
      },
      {
        icon: '02',
        title: 'Kami Mendengarkan',
        description:
          'Cerita Bunda Selalu Punya Tempat. Kami percaya setiap perjalanan menjadi ibu itu berbeda. Karena itu, kami selalu berusaha mendengarkan cerita, memahami kekhawatiran, dan selalu memberikan dukungan.',
        highlight: false,
      },
      {
        icon: '03',
        title: 'Kebersihan dan Kenyamanan Diutamakan',
        description:
          'Perawatan Lembut di Setiap Detail. Mulai dari kebersihan tangan, perlengkapan treatment, hingga pemilihan minyak pijat, kami memperhatikan setiap detail agar perawatan berlangsung higienis dan sesuai kebutuhan Bunda maupun si kecil.',
        highlight: false,
      },
      {
        icon: '04',
        title: 'Ada Edukasi yang Bisa Bunda Bawa Pulang',
        description:
          'Bekal Perawatan Mandiri untuk di Rumah. Kami senang berbagi tips perawatan, stimulasi sesuai usia, dan sentuhan sederhana yang bisa Bunda serta Ayah praktikkan di rumah. Karena perhatian untuk si kecil tidak berhenti setelah sesi selesai.',
        highlight: false,
      },
      {
        icon: '05',
        title: 'Kami yang Datang, Bunda Tinggal Nyaman',
        description:
          'Homecare Praktis Tanpa Perlu Keluar Rumah. Tak perlu repot menyiapkan perjalanan atau menghadapi kemacetan. Tim Kala datang langsung ke rumah Bunda di area jangkauan Surabaya dan Sidoarjo, sesuai jadwal yang disepakati.',
        highlight: false,
      },
    ],
    background: 'white',
    disabled: false,
  },
  {
    blockType: 'steps',
    title: 'Cara reservasi homecare',
    subtitle: 'Selesai dalam beberapa menit lewat WhatsApp, tanpa perlu keluar rumah.',
    steps: bookingSteps,
    disabled: false,
  },
  {
    blockType: 'coverageArea',
    badge: 'Jangkauan Homecare Langsung ke Rumah',
    title: 'Area Layanan Surabaya & Sidoarjo',
    subtitle:
      'Kala beroperasi murni sebagai layanan homecare tanpa antrean outlet fisik. Bidan profesional kami siap berkunjung langsung ke kediaman Anda di seluruh wilayah berikut:',
    items: coverageItems,
    ctaText: 'Cek Ketersediaan Bidan ke Rumah Saya',
    ctaMessage:
      'Halo Bu Bidan, saya mau tanya apakah lokasi saya dijangkau homecare Kala?',
    background: 'cream',
    disabled: false,
  },
  {
    blockType: 'faq',
    title: 'Pertanyaan yang sering muncul',
    subtitle:
      'Belum menemukan jawabannya? Bidan Kala siap membantu lewat WhatsApp pada jam operasional.',
    faqs,
    disabled: false,
  },
  {
    blockType: 'cta',
    badge: '',
    headline: 'Perawatan Nyaman untuk Bunda & Si Kecil 🤍',
    description:
      'Tak perlu keluar rumah untuk mendapatkan perawatan penuh perhatian. Ceritakan kebutuhan Bunda, kami bantu pilihkan treatment yang sesuai.',
    buttonText: 'Konsultasi via WhatsApp',
    buttonMessage:
      'Halo Bu Bidan, saya mau konsultasi perawatan untuk Bunda dan si kecil',
    footnote: '',
    disabled: false,
  },
]

const pageData = {
  title: 'Homepage 2',
  slug: 'homepage-2',
  description:
    'Duplikat draft homepage Kala Moms and Baby Spa: perawatan ibu & bayi homecare oleh bidan profesional di Surabaya & Sidoarjo.',
  pageType: 'standard' as const,
  pageLayout: 'default' as const,
  editorMode: 'builder' as const,
  showWhatsAppCta: false,
  seo: {
    metaTitle: 'Homepage 2 | Kala Moms and Baby Spa Surabaya & Sidoarjo',
    metaDescription:
      'Baby massage, pijat newborn, dan pijat nifas homecare di Surabaya & Sidoarjo oleh bidan profesional. Perawatan nyaman untuk Bunda dan si kecil langsung di rumah.',
  },
  layout,
  _status: 'draft' as const,
}

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'homepage-2' } },
    limit: 1,
    draft: true,
  })

  if (existing.totalDocs > 0) {
    const id = existing.docs[0].id
    await (payload.update as any)({
      collection: 'pages',
      id,
      data: pageData,
      draft: true,
    })
    console.log(`Draft "Homepage 2" diperbarui (id: ${id}, slug: homepage-2).`)
    return
  }

  const created = await (payload.create as any)({
    collection: 'pages',
    data: pageData,
    draft: true,
  })

  console.log(`Draft "Homepage 2" dibuat (id: ${created.id}, slug: homepage-2).`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Gagal membuat draft Homepage 2:', err)
    process.exit(1)
  })
