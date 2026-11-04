export type BuilderFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'number'
  | 'upload'
  | 'richtext'
  | 'array'
  | 'relationship'
  | 'date'
  | 'code';

export interface BuilderFieldMeta {
  name: string;
  label: string;
  type: BuilderFieldType;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  description?: string;
  relationTo?: 'midwives' | 'block-templates';
  hasMany?: boolean;
}

export interface BuilderInnerBlocks {
  path: string;
  label: string;
  itemTitleField: string;
  fields: BuilderFieldMeta[];
  min?: number;
  max?: number;
}

export type BuilderCategory =
  | 'layout'
  | 'hero'
  | 'offer'
  | 'proof'
  | 'content'
  | 'media'
  | 'conversion'
  | 'cta'
  | 'promo';

export interface BuilderColumnsMeta {
  path: string;
  label: string;
  maxColumns: number;
  blockSlugs: string[];
  widthOptions: Array<{ label: string; value: string }>;
  defaultWidth: string;
}

export interface BuilderBlockMeta {
  slug: string;
  label: string;
  icon: string;
  category: BuilderCategory;
  description: string;
  defaults: Record<string, unknown>;
  fields: BuilderFieldMeta[];
  innerBlocks?: BuilderInnerBlocks;
  presets?: Array<{ id: string; label: string; defaults: Record<string, unknown> }>;
  /** Disembunyikan dari katalog builder (masih dipakai untuk paritas). */
  hidden?: boolean;
  columns?: BuilderColumnsMeta;
}

const bgWhiteCreamPeach = [
  { label: 'Putih Bersih', value: 'white' },
  { label: 'Krem Hangat', value: 'cream' },
  { label: 'Peach Lembut', value: 'peach' },
];

const spacingOptions = [
  { label: 'Rapat', value: 'compact' },
  { label: 'Normal', value: 'normal' },
  { label: 'Longgar', value: 'spacious' },
];

export const builderRegistry: Record<string, BuilderBlockMeta> = {
  section: {
    slug: 'section',
    label: 'Seksi & Kolom (Container)',
    icon: 'LayoutGrid',
    category: 'layout',
    description: 'Wadah 1–4 kolom untuk menyusun judul, gambar, tombol, dan blok lain berdampingan.',
    defaults: {
      blockType: 'section',
      label: 'Seksi Baru',
      background: 'white',
      padding: 'normal',
      maxWidth: 'normal',
      gap: 'normal',
      columns: [
        {
          width: 'half',
          content: [{ blockType: 'heading', eyebrow: '', text: 'Judul Kolom Kiri', subtitle: '', level: 'h3', size: 'md', align: 'left' }],
        },
        {
          width: 'half',
          content: [{ blockType: 'heading', eyebrow: '', text: 'Judul Kolom Kanan', subtitle: '', level: 'h3', size: 'md', align: 'left' }],
        },
      ],
      disabled: false,
    },
    fields: [
      { name: 'label', label: 'Nama Seksi (Penanda Admin)', type: 'text', placeholder: 'Seksi Paket & Harga' },
      {
        name: 'background',
        label: 'Latar Belakang',
        type: 'select',
        options: [
          { label: 'Putih Bersih', value: 'white' },
          { label: 'Krem Hangat', value: 'cream' },
          { label: 'Peach Lembut', value: 'peach' },
          { label: 'Gradasi Peach', value: 'gradient' },
        ],
      },
      {
        name: 'padding',
        label: 'Jarak Atas-Bawah',
        type: 'select',
        options: [
          { label: 'Tanpa Jarak', value: 'none' },
          { label: 'Rapat', value: 'compact' },
          { label: 'Normal', value: 'normal' },
          { label: 'Longgar', value: 'spacious' },
        ],
      },
      {
        name: 'maxWidth',
        label: 'Lebar Maksimal',
        type: 'select',
        options: [
          { label: 'Ramping (896px)', value: 'narrow' },
          { label: 'Normal (1152px)', value: 'normal' },
          { label: 'Lebar (1280px)', value: 'wide' },
          { label: 'Penuh Layar', value: 'full' },
        ],
      },
      {
        name: 'gap',
        label: 'Jarak Antar Kolom',
        type: 'select',
        options: spacingOptions,
      },
    ],
    columns: {
      path: 'columns',
      label: 'Kolom',
      maxColumns: 4,
      blockSlugs: [
        'heading',
        'image',
        'button',
        'divider',
        'video',
        'stats',
        'logos',
        'team',
        'tabs',
        'leadForm',
        'blogFeed',
        'countdown',
        'social',
        'richText',
        'html',
      ],
      widthOptions: [
        { label: 'Penuh (1 kolom)', value: 'full' },
        { label: '1/2', value: 'half' },
        { label: '1/3', value: 'third' },
        { label: '2/3', value: 'twoThirds' },
        { label: '1/4', value: 'quarter' },
      ],
      defaultWidth: 'half',
    },
  },

  hero: {
    slug: 'hero',
    label: 'Banner Utama (Hero)',
    icon: 'Sparkles',
    category: 'hero',
    description: 'Headline utama penawaran, subheadline, harga promo, dan tombol CTA WhatsApp.',
    defaults: {
      blockType: 'hero',
      badge: '100% Bidan Ber-STR Resmi',
      headline: 'Tangisan Bayi Kolik Mereda, Bunda Kembali Tenang',
      subheadline: 'Layanan homecare bidan profesional ke rumah Anda di Surabaya & Sidoarjo dengan sentuhan penuh kehangatan.',
      price: 'Rp150.000',
      originalPrice: 'Rp190.000',
      duration: '90 Menit',
      ctaText: 'Pesan Kunjungan Bidan',
      ctaMessage: 'Halo Bidan Kala, saya ingin reservasi layanan homecare untuk si kecil...',
      align: 'left',
      btnColor: 'terracotta',
      bgStyle: 'gradient',
      disabled: false,
    },
    presets: [
      {
        id: 'hero-kolik',
        label: 'Hero Promo Bayi Kolik',
        defaults: {
          badge: 'Penanganan Bayi Kolik & Kembung',
          headline: 'Bantu Redakan Perut Kembung Bayi dengan Sentuhan Medis Bidan',
          subheadline: 'Teknik stimulasi taktil pediatri steril tanpa obat kimia keras, langsung di rumah Anda.',
          price: 'Rp150.000',
          originalPrice: 'Rp190.000',
          duration: '90 Menit',
          ctaText: 'Hubungi Bidan Kami Sekarang',
        },
      },
      {
        id: 'hero-newborn',
        label: 'Hero Paket Pijat Newborn',
        defaults: {
          badge: 'Homecare Newborn Bersertifikat',
          headline: 'Pijat Nyaman Buah Hati Baru Lahir oleh Bidan Terpercaya',
          subheadline: 'Membantu stimulasi motorik dan tidur lebih lelap untuk bayi 0-3 bulan.',
          price: 'Rp135.000',
          originalPrice: 'Rp175.000',
          duration: '60 Menit',
          ctaText: 'Jadwalkan Kunjungan',
        },
      },
    ],
    fields: [
      { name: 'badge', label: 'Badge / Label Kecil Atas', type: 'text', placeholder: 'Contoh: 100% Bidan Ber-STR' },
      { name: 'headline', label: 'Judul Utama (H1)', type: 'text', required: true, placeholder: 'Maksimal 70 karakter' },
      { name: 'subheadline', label: 'Subjudul / Penjelasan', type: 'textarea', required: true },
      { name: 'price', label: 'Harga Promo', type: 'text', placeholder: 'Rp150.000' },
      { name: 'originalPrice', label: 'Harga Coret Asli', type: 'text', placeholder: 'Rp190.000' },
      { name: 'duration', label: 'Durasi Layanan', type: 'text', placeholder: '90 Menit' },
      { name: 'ctaText', label: 'Teks Tombol WhatsApp', type: 'text', placeholder: 'Pesan Sekarang' },
      { name: 'ctaMessage', label: 'Draft Pesan WhatsApp Otomatis', type: 'textarea' },
      {
        name: 'align',
        label: 'Perataan Konten',
        type: 'select',
        options: [
          { label: 'Rata Kiri', value: 'left' },
          { label: 'Rata Tengah', value: 'center' },
        ],
      },
      {
        name: 'btnColor',
        label: 'Warna Tombol CTA',
        type: 'select',
        options: [
          { label: 'Terracotta (Brand)', value: 'terracotta' },
          { label: 'Hijau WhatsApp', value: 'whatsapp' },
          { label: 'Cokelat Hangat', value: 'chocolate' },
        ],
      },
      {
        name: 'bgStyle',
        label: 'Warna Latar Belakang',
        type: 'select',
        options: [
          { label: 'Gradasi Peach', value: 'gradient' },
          { label: 'Krem Polos', value: 'plain' },
          { label: 'Putih Bersih', value: 'white' },
        ],
      },
      { name: 'image', label: 'Foto Hero Utama', type: 'upload' },
      { name: 'imageAlt', label: 'Alt Text Foto Hero', type: 'text', placeholder: 'Deskripsi gambar untuk aksesibilitas' },
    ],
  },

  painPoints: {
    slug: 'painPoints',
    label: 'Masalah & Kegelisahan (Pain Points)',
    icon: 'AlertCircle',
    category: 'content',
    description: 'Validasi keluhan dan rasa cemas calon Bunda (kolik, rewel, kelelahan nifas).',
    defaults: {
      blockType: 'painPoints',
      title: 'Apakah Ini yang Bunda Rasakan?',
      subtitle: 'Kekhawatiran yang Kerap Dialami Orang Tua Baru di Surabaya & Sidoarjo',
      columns: '2',
      background: 'cream',
      spacing: 'normal',
      points: [
        { icon: '😭', title: 'Bayi Menangis Tanpa Henti', description: 'Rewel tiap malam karena kembung atau kolik dan sulit ditenangkan.' },
        { icon: '🥺', title: 'Bunda Kelelahan Pasca Salin', description: 'Kurang tidur dan badan pegal tanpa bantuan pendamping yang terpercaya.' },
      ],
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'text' },
      {
        name: 'columns',
        label: 'Jumlah Kolom',
        type: 'select',
        options: [
          { label: '2 Kolom', value: '2' },
          { label: '3 Kolom', value: '3' },
        ],
      },
      { name: 'background', label: 'Warna Latar Belakang', type: 'select', options: bgWhiteCreamPeach },
      { name: 'spacing', label: 'Jarak Seksi', type: 'select', options: spacingOptions },
    ],
    innerBlocks: {
      path: 'points',
      label: 'Daftar Poin Masalah',
      itemTitleField: 'title',
      fields: [
        { name: 'icon', label: 'Ikon Emoji', type: 'text', placeholder: '😭' },
        { name: 'title', label: 'Judul Masalah', type: 'text', required: true },
        { name: 'description', label: 'Uraian Masalah', type: 'textarea', required: true },
      ],
    },
  },

  solutions: {
    slug: 'solutions',
    label: 'Solusi & Manfaat Layanan',
    icon: 'CheckCircle2',
    category: 'content',
    description: 'Solusi medis terstandar dan kehangatan sentuhan bidan pendamping.',
    defaults: {
      blockType: 'solutions',
      title: 'Apa yang Berubah Setelah Perawatan di Kala?',
      subtitle: 'Bukan sekadar pijat biasa, melainkan stimulasi terapeutik yang menenangkan.',
      items: [
        { icon: '👩‍⚕️', title: 'Terapi Sentuhan Lembut', description: 'Pijat bayi berbasis anatomi pediatri untuk meredakan kembung.' },
        { icon: '🌿', title: 'Alat & Minyak Steril', description: 'Minyak alami food-grade aman untuk kulit sensitif bayi baru lahir.' },
        { icon: '🤍', title: 'Edukasi Tanpa Menghakimi', description: 'Bidan mendampingi Bunda dengan empati penuh.' },
      ],
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'text' },
    ],
    innerBlocks: {
      path: 'items',
      label: 'Poin Solusi',
      itemTitleField: 'title',
      fields: [
        { name: 'icon', label: 'Ikon Emoji', type: 'text', placeholder: '🌿' },
        { name: 'title', label: 'Judul Manfaat', type: 'text', required: true },
        { name: 'description', label: 'Uraian Manfaat', type: 'textarea', required: true },
      ],
    },
  },

  pricing: {
    slug: 'pricing',
    label: 'Paket Harga & Promo',
    icon: 'Tag',
    category: 'offer',
    description: 'Transparansi tarif paket layanan, diskon promo, dan rincian fitur.',
    defaults: {
      blockType: 'pricing',
      badge: 'Promo Terbatas',
      title: 'Pilihan Paket Perawatan Buah Hati & Bunda',
      subtitle: 'Ditangani 100% oleh bidan resmi ber-STR Kemenkes menggunakan produk organik steril.',
      layoutStyle: 'cards',
      background: 'cream',
      spacing: 'normal',
      packages: [
        {
          name: 'Paket Newborn Ceria',
          target: 'Bayi 0-3 Bulan',
          price: 'Rp150.000',
          originalPrice: 'Rp190.000',
          duration: '60 Menit',
          description: 'Pijat relaksasi dan stimulasi kolik oleh bidan ber-STR.',
          isPopular: true,
          popularBadge: 'Paling Diminati',
          ctaText: 'Reservasi Paket Ini',
          refCode: 'KALA-PRICING-NEWBORN',
        },
      ],
      disabled: false,
    },
    fields: [
      { name: 'badge', label: 'Badge Atas', type: 'text' },
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'text' },
      {
        name: 'layoutStyle',
        label: 'Tampilan Paket',
        type: 'select',
        options: [
          { label: 'Kartu Berdampingan (Cards)', value: 'cards' },
          { label: 'Daftar Vertikal (List)', value: 'list' },
        ],
      },
      { name: 'background', label: 'Warna Latar Belakang', type: 'select', options: bgWhiteCreamPeach },
      { name: 'spacing', label: 'Jarak Seksi', type: 'select', options: spacingOptions },
    ],
    innerBlocks: {
      path: 'packages',
      label: 'Pilihan Paket Tarif',
      itemTitleField: 'name',
      fields: [
        { name: 'name', label: 'Nama Paket', type: 'text', required: true },
        { name: 'target', label: 'Target Usia / Pasien', type: 'text', placeholder: 'Contoh: Bayi 1-12 Bulan' },
        { name: 'price', label: 'Harga Promo', type: 'text', required: true, placeholder: 'Rp150.000' },
        { name: 'originalPrice', label: 'Harga Asli Coret', type: 'text', placeholder: 'Rp190.000' },
        { name: 'duration', label: 'Durasi Waktu', type: 'text', placeholder: '60 Menit' },
        { name: 'description', label: 'Keterangan Singkat', type: 'textarea' },
        { name: 'isPopular', label: 'Tandai Sebagai Populer', type: 'checkbox' },
        { name: 'popularBadge', label: 'Teks Badge Populer', type: 'text', placeholder: 'Paling Laris' },
        { name: 'ctaText', label: 'Teks Tombol', type: 'text', placeholder: 'Reservasi Paket Ini' },
        { name: 'refCode', label: 'Kode Ref Kampanye', type: 'text', placeholder: 'KALA-SRV-01' },
      ],
    },
  },

  comparison: {
    slug: 'comparison',
    label: 'Tabel Perbandingan',
    icon: 'TableProperties',
    category: 'proof',
    description: 'Komparasi keunggulan Bidan Homecare Kala vs pijat tradisional biasa.',
    defaults: {
      blockType: 'comparison',
      title: 'Mengapa Bunda Memilih Kala Dibandingkan yang Lain?',
      subtitle: 'Standar kebidanan medis higienis yang kami jaga demi ketenangan hati keluarga Anda.',
      kalaLabel: 'Kala Moms & Baby Spa',
      otherLabel: 'Pijat Keliling / Terapis Umum',
      rows: [
        { feature: 'Kualifikasi Praktisi', kalaValue: '100% Bidan Lulusan Kebidanan Ber-STR', otherValue: 'Tanpa sertifikasi medis resmi' },
        { feature: 'Higienitas Alat & Minyak', kalaValue: 'Steril & Minyak Alami Food Grade', otherValue: 'Minyak curah / tanpa standar' },
        { feature: 'Konsultasi Nifas & Laktasi', kalaValue: 'Gratis konsultasi menyusui & nifas', otherValue: 'Hanya pijat saja' },
      ],
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'text' },
      { name: 'kalaLabel', label: 'Label Kolom Kala', type: 'text' },
      { name: 'otherLabel', label: 'Label Kolom Pembanding', type: 'text' },
    ],
    innerBlocks: {
      path: 'rows',
      label: 'Baris Perbandingan',
      itemTitleField: 'feature',
      fields: [
        { name: 'feature', label: 'Fitur / Parameter', type: 'text', required: true },
        { name: 'kalaValue', label: 'Nilai di Kala', type: 'text', required: true },
        { name: 'otherValue', label: 'Nilai di Tempat Lain', type: 'text', required: true },
      ],
    },
  },

  steps: {
    slug: 'steps',
    label: 'Langkah Pemesanan (Steps Flow)',
    icon: 'Footprints',
    category: 'content',
    description: 'Alur praktis langkah memesan dan menyambut kunjungan bidan.',
    defaults: {
      blockType: 'steps',
      title: 'Mudah & Nyaman dari Rumah',
      subtitle: 'Alur praktis tanpa perlu keluar rumah dan tanpa antre.',
      steps: [
        { num: '1', title: 'Pilih Layanan & Waktu', description: 'Pilih paket yang sesuai dan tentukan jam kunjungan yang nyaman.' },
        { num: '2', title: 'Konfirmasi via WhatsApp', description: 'Admin kami mengonfirmasi jadwal dan menugaskan bidan terdekat.' },
        { num: '3', title: 'Bidan Tiba di Rumah', description: 'Bidan datang membawa perlengkapan steril lengkap.' },
      ],
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'text' },
    ],
    innerBlocks: {
      path: 'steps',
      label: 'Daftar Langkah',
      itemTitleField: 'title',
      fields: [
        { name: 'num', label: 'Nomor Langkah', type: 'text', placeholder: '1' },
        { name: 'title', label: 'Judul Langkah', type: 'text', required: true },
        { name: 'description', label: 'Keterangan Langkah', type: 'textarea', required: true },
      ],
    },
  },

  testimonials: {
    slug: 'testimonials',
    label: 'Ulasan & Testimoni Bunda',
    icon: 'Quote',
    category: 'proof',
    description: 'Cerita nyata kepuasan para Bunda di Surabaya & Sidoarjo.',
    defaults: {
      blockType: 'testimonials',
      title: 'Kata Mereka yang Sudah Merasakan Sentuhan Kala',
      subtitle: 'Ulasan asli dan terverifikasi dari orang tua yang memilih kenyamanan homecare kami.',
      items: [
        {
          quote: 'Setelah diterapi bidan Kala, tangis kolik si kecil langsung reda dan tidurnya nyenyak.',
          author: 'Bunda Sarah',
          role: 'Ibu dari Baby Arka (2 bulan)',
          area: 'Surabaya Timur',
        },
      ],
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'text' },
    ],
    innerBlocks: {
      path: 'items',
      label: 'Daftar Ulasan',
      itemTitleField: 'author',
      fields: [
        { name: 'quote', label: 'Isi Ulasan', type: 'textarea', required: true },
        { name: 'author', label: 'Nama Bunda', type: 'text', required: true },
        { name: 'role', label: 'Keterangan Anak / Usia', type: 'text', placeholder: 'Ibu dari Baby Ken (3 bulan)' },
        { name: 'area', label: 'Wilayah / Kota', type: 'text', placeholder: 'Surabaya Barat' },
      ],
    },
  },

  guarantee: {
    slug: 'guarantee',
    label: 'Garansi & Komitmen Higienis',
    icon: 'ShieldCheck',
    category: 'proof',
    description: 'Jaminan keamanan, higienitas alat steril, dan etika kebidanan resmi.',
    defaults: {
      blockType: 'guarantee',
      badge: '🛡️ Komitmen Kualitas Kala',
      title: 'Puas 100% atau Sesi Pengganti Gratis',
      description: 'Kami percaya pada kelembutan dan kualitas dedikasi bidan kami. Jika Bunda merasa kurang puas pada sesi pertama, kami sediakan sesi evaluasi pengganti gratis.',
      note: '*Kepercayaan dan ketenangan keluarga Bunda adalah prioritas utama kami.',
      disabled: false,
    },
    fields: [
      { name: 'badge', label: 'Badge Atas', type: 'text' },
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'description', label: 'Pernyataan Komitmen', type: 'textarea', required: true },
      { name: 'note', label: 'Catatan Jaminan', type: 'text' },
    ],
  },

  faq: {
    slug: 'faq',
    label: 'Tanya Jawab (FAQ Accordion)',
    icon: 'HelpCircle',
    category: 'content',
    description: 'Menjawab pertanyaan dan keraguan calon Bunda sebelum memesan.',
    defaults: {
      blockType: 'faq',
      title: 'Pertanyaan yang Sering Diajukan Bunda',
      subtitle: 'Jawaban transparan seputar kenyamanan dan higienitas homecare kami.',
      faqs: [
        { q: 'Usia berapa bayi aman untuk dipijat?', a: 'Bayi baru lahir (newborn) mulai usia 0 hari sudah aman mendapatkan sentuhan lembut oleh bidan ber-STR resmi kami.' },
        { q: 'Apakah ada tambahan biaya transportasi bidan?', a: 'Untuk seluruh wilayah Surabaya & Sidoarjo kota, biaya layanan sudah termasuk tarif kunjungan bidan.' },
      ],
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'text' },
    ],
    innerBlocks: {
      path: 'faqs',
      label: 'Daftar Pertanyaan',
      itemTitleField: 'q',
      fields: [
        { name: 'q', label: 'Pertanyaan', type: 'text', required: true },
        { name: 'a', label: 'Jawaban', type: 'textarea', required: true },
      ],
    },
  },

  cta: {
    slug: 'cta',
    label: 'Banner Call to Action (CTA)',
    icon: 'PhoneCall',
    category: 'cta',
    description: 'Banner penutup dengan tombol dorongan kuat untuk reservasi via WhatsApp.',
    defaults: {
      blockType: 'cta',
      badge: 'Langkah Pertama untuk Si Kecil',
      headline: 'Berikan Si Kecil Awal Terbaik dalam Hidupnya',
      description: 'Konsultasi gratis via WhatsApp sekarang. Bidan kami siap hadir ke rumah Anda di Surabaya & Sidoarjo.',
      buttonText: '💬 Chat WhatsApp Sekarang',
      buttonMessage: 'Halo Bidan Kala, saya ingin reservasi slot homecare untuk si kecil...',
      footnote: '⏰ Balas cepat dalam 5 menit · Bebas mom-shaming',
      disabled: false,
    },
    fields: [
      { name: 'badge', label: 'Badge / Label', type: 'text' },
      { name: 'headline', label: 'Judul Ajakan', type: 'text', required: true },
      { name: 'description', label: 'Uraian Dorongan', type: 'textarea' },
      { name: 'buttonText', label: 'Teks Tombol WhatsApp', type: 'text' },
      { name: 'buttonMessage', label: 'Draft Chat WhatsApp', type: 'textarea' },
      { name: 'footnote', label: 'Catatan Kaki Bawah Tombol', type: 'text' },
    ],
  },

  gallery: {
    slug: 'gallery',
    label: 'Galeri Foto Aktivitas',
    icon: 'Image',
    category: 'proof',
    description: 'Foto dokumentasi aktivitas bidan saat melakukan kunjungan homecare.',
    defaults: {
      blockType: 'gallery',
      badge: 'Dokumentasi Kala',
      title: 'Momen Nyaman & Ceria Si Kecil Bersama Bidan',
      subtitle: 'Dokumentasi asli kenyamanan dan kehangatan penanganan bidan resmi Kala.',
      columns: '3',
      bgStyle: 'white',
      images: [{ caption: 'Pijat Relaksasi Bayi', tag: 'Bayi Sehat' }],
      disabled: false,
    },
    fields: [
      { name: 'badge', label: 'Badge', type: 'text' },
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'textarea' },
      {
        name: 'columns',
        label: 'Jumlah Kolom',
        type: 'select',
        options: [
          { label: '2 Kolom', value: '2' },
          { label: '3 Kolom', value: '3' },
          { label: '4 Kolom', value: '4' },
        ],
      },
      {
        name: 'bgStyle',
        label: 'Warna Latar Belakang',
        type: 'select',
        options: [
          { label: 'Putih Bersih', value: 'white' },
          { label: 'Krem Hangat', value: 'warm' },
        ],
      },
    ],
    innerBlocks: {
      path: 'images',
      label: 'Daftar Foto',
      itemTitleField: 'caption',
      fields: [
        { name: 'image', label: 'File Foto', type: 'upload' },
        { name: 'imageUrlFallback', label: 'URL Foto Cadangan', type: 'text', placeholder: 'https://...' },
        { name: 'caption', label: 'Keterangan Foto', type: 'text' },
        { name: 'tag', label: 'Label Kategori', type: 'text' },
      ],
    },
  },

  midwifeSpotlight: {
    slug: 'midwifeSpotlight',
    label: 'Profil Bidan Pilihan',
    icon: 'UserCheck',
    category: 'proof',
    description: 'Menampilkan profil bidan dengan nomor STR resmi dari database tim bidan.',
    defaults: {
      blockType: 'midwifeSpotlight',
      heading: 'Ditangani Langsung oleh Bidan Profesional Ber-STR Resmi',
      subheading: 'Tenaga kesehatan terdaftar Kemenkes RI yang berempati tinggi, komunikatif, dan menjamin kenyamanan Bunda tanpa mom-shaming.',
      background: 'cream',
      spacing: 'normal',
      disabled: false,
    },
    fields: [
      { name: 'heading', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subheading', label: 'Subjudul Seksi', type: 'textarea' },
      { name: 'midwives', label: 'Pilih Bidan (Opsional)', type: 'relationship', relationTo: 'midwives', hasMany: true },
      { name: 'background', label: 'Warna Latar Belakang', type: 'select', options: bgWhiteCreamPeach },
      { name: 'spacing', label: 'Jarak Seksi', type: 'select', options: spacingOptions },
    ],
  },

  richText: {
    slug: 'richText',
    label: 'Teks Bebas (Rich Text)',
    icon: 'FileText',
    category: 'content',
    description: 'Paragraf penjelasan, panduan edukasi, atau syarat ketentuan.',
    defaults: {
      blockType: 'richText',
      content: null,
      containerWidth: 'normal',
      disabled: false,
    },
    fields: [
      { name: 'content', label: 'Isi Teks', type: 'richtext', required: true, description: 'Editor sederhana. Untuk tabel/link kompleks, gunakan Mode Formulir Klasik.' },
      {
        name: 'containerWidth',
        label: 'Lebar Kontainer',
        type: 'select',
        options: [
          { label: 'Ramping (672px)', value: 'narrow' },
          { label: 'Normal (896px)', value: 'normal' },
          { label: 'Lebar (1152px)', value: 'wide' },
        ],
      },
    ],
  },

  heading: {
    slug: 'heading',
    label: 'Judul Bagian (Heading)',
    icon: 'Type',
    category: 'content',
    description: 'Judul bagian dengan label kecil, subjudul, ukuran, dan perataan.',
    defaults: {
      blockType: 'heading',
      eyebrow: '',
      text: 'Judul Bagian Baru',
      subtitle: '',
      level: 'h2',
      size: 'md',
      align: 'center',
      disabled: false,
    },
    fields: [
      { name: 'eyebrow', label: 'Label Kecil di Atas Judul', type: 'text' },
      { name: 'text', label: 'Teks Judul', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul', type: 'textarea' },
      {
        name: 'level',
        label: 'Tingkat Judul (SEO)',
        type: 'select',
        options: [
          { label: 'H2 — Bagian Utama', value: 'h2' },
          { label: 'H3 — Sub-bagian', value: 'h3' },
          { label: 'H4 — Sub-sub-bagian', value: 'h4' },
        ],
      },
      {
        name: 'size',
        label: 'Ukuran Tampilan',
        type: 'select',
        options: [
          { label: 'Kecil', value: 'sm' },
          { label: 'Sedang', value: 'md' },
          { label: 'Besar', value: 'lg' },
          { label: 'Sangat Besar', value: 'xl' },
        ],
      },
      {
        name: 'align',
        label: 'Perataan',
        type: 'select',
        options: [
          { label: 'Tengah', value: 'center' },
          { label: 'Kiri', value: 'left' },
        ],
      },
    ],
  },

  image: {
    slug: 'image',
    label: 'Gambar Tunggal',
    icon: 'ImageIcon',
    category: 'media',
    description: 'Satu gambar dengan alt text, caption, tautan, dan pengaturan rasio.',
    defaults: {
      blockType: 'image',
      alt: 'Foto layanan Kala',
      caption: '',
      width: 'normal',
      align: 'center',
      ratio: 'auto',
      rounded: 'md',
      disabled: false,
    },
    fields: [
      { name: 'image', label: 'File Gambar', type: 'upload' },
      { name: 'imageUrlFallback', label: 'URL Gambar Cadangan', type: 'text', placeholder: '/images/contoh.webp' },
      { name: 'alt', label: 'Alt Text (Wajib)', type: 'text', placeholder: 'Bidan memijat bayi dengan lembut' },
      { name: 'caption', label: 'Keterangan Gambar', type: 'text' },
      { name: 'link', label: 'Tautan Saat Diklik', type: 'text', placeholder: '/layanan/bundle-duo' },
      {
        name: 'width',
        label: 'Lebar Gambar',
        type: 'select',
        options: [
          { label: 'Normal', value: 'normal' },
          { label: 'Lebar', value: 'wide' },
          { label: 'Penuh Layar', value: 'full' },
        ],
      },
      {
        name: 'align',
        label: 'Perataan',
        type: 'select',
        options: [
          { label: 'Tengah', value: 'center' },
          { label: 'Kiri', value: 'left' },
          { label: 'Kanan', value: 'right' },
        ],
      },
      {
        name: 'ratio',
        label: 'Rasio Gambar',
        type: 'select',
        options: [
          { label: 'Otomatis', value: 'auto' },
          { label: '16:9', value: '16:9' },
          { label: '4:3', value: '4:3' },
          { label: '1:1', value: '1:1' },
        ],
      },
      {
        name: 'rounded',
        label: 'Sudut Gambar',
        type: 'select',
        options: [
          { label: 'Tajam', value: 'none' },
          { label: 'Sedang', value: 'md' },
          { label: 'Sangat Melengkung', value: 'lg' },
        ],
      },
    ],
  },

  button: {
    slug: 'button',
    label: 'Tombol Aksi (Button)',
    icon: 'MousePointerClick',
    category: 'cta',
    description: 'Tombol WhatsApp atau tautan, dengan gaya, ukuran, dan perataan.',
    defaults: {
      blockType: 'button',
      text: 'Konsultasi Gratis via WhatsApp',
      action: 'whatsapp',
      style: 'primary',
      size: 'md',
      align: 'center',
      openInNewTab: false,
      disabled: false,
    },
    fields: [
      { name: 'text', label: 'Teks Tombol', type: 'text', required: true },
      {
        name: 'action',
        label: 'Aksi Tombol',
        type: 'select',
        options: [
          { label: 'Buka WhatsApp', value: 'whatsapp' },
          { label: 'Buka Tautan', value: 'url' },
        ],
      },
      { name: 'whatsappMessage', label: 'Pesan Otomatis WhatsApp', type: 'text' },
      { name: 'url', label: 'URL Tujuan', type: 'text', placeholder: '/layanan/bundle-duo' },
      { name: 'openInNewTab', label: 'Buka di Tab Baru', type: 'checkbox' },
      {
        name: 'style',
        label: 'Gaya Tombol',
        type: 'select',
        options: [
          { label: 'Hijau WhatsApp', value: 'primary' },
          { label: 'Terracotta', value: 'secondary' },
          { label: 'Garis Tepi', value: 'outline' },
        ],
      },
      {
        name: 'size',
        label: 'Ukuran Tombol',
        type: 'select',
        options: [
          { label: 'Kecil', value: 'sm' },
          { label: 'Sedang', value: 'md' },
          { label: 'Besar', value: 'lg' },
        ],
      },
      {
        name: 'align',
        label: 'Perataan',
        type: 'select',
        options: [
          { label: 'Kiri', value: 'left' },
          { label: 'Tengah', value: 'center' },
          { label: 'Kanan', value: 'right' },
        ],
      },
      { name: 'note', label: 'Catatan Kecil di Bawah Tombol', type: 'text' },
    ],
  },

  divider: {
    slug: 'divider',
    label: 'Pemisah / Jarak',
    icon: 'Minus',
    category: 'layout',
    description: 'Garis pemisah, titik-titik, atau ruang kosong antar bagian.',
    defaults: {
      blockType: 'divider',
      variant: 'line',
      spacing: 'md',
      width: 'normal',
      disabled: false,
    },
    fields: [
      {
        name: 'variant',
        label: 'Jenis Pemisah',
        type: 'select',
        options: [
          { label: 'Garis Tipis', value: 'line' },
          { label: 'Titik-titik', value: 'dots' },
          { label: 'Ruang Kosong Saja', value: 'space' },
        ],
      },
      {
        name: 'spacing',
        label: 'Tinggi Jarak',
        type: 'select',
        options: [
          { label: 'Rapat', value: 'sm' },
          { label: 'Normal', value: 'md' },
          { label: 'Longgar', value: 'lg' },
          { label: 'Sangat Longgar', value: 'xl' },
        ],
      },
      {
        name: 'width',
        label: 'Lebar Garis',
        type: 'select',
        options: [
          { label: 'Sempit', value: 'narrow' },
          { label: 'Normal', value: 'normal' },
          { label: 'Penuh', value: 'full' },
        ],
      },
    ],
  },

  video: {
    slug: 'video',
    label: 'Video (YouTube / Vimeo)',
    icon: 'PlayCircle',
    category: 'media',
    description: 'Sematkan video YouTube, Shorts, atau Vimeo langsung di halaman.',
    defaults: {
      blockType: 'video',
      url: '',
      title: 'Video Kala',
      caption: '',
      ratio: '16:9',
      maxWidth: 'normal',
      disabled: false,
    },
    fields: [
      { name: 'url', label: 'URL Video', type: 'text', required: true, placeholder: 'https://www.youtube.com/watch?v=...' },
      { name: 'title', label: 'Judul Video', type: 'text' },
      { name: 'caption', label: 'Keterangan di Bawah Video', type: 'textarea' },
      {
        name: 'ratio',
        label: 'Rasio Video',
        type: 'select',
        options: [
          { label: '16:9 (Lanskap)', value: '16:9' },
          { label: '9:16 (Vertikal)', value: '9:16' },
          { label: '4:3', value: '4:3' },
          { label: '1:1 (Persegi)', value: '1:1' },
        ],
      },
      {
        name: 'maxWidth',
        label: 'Lebar Maksimal',
        type: 'select',
        options: [
          { label: 'Sempit', value: 'narrow' },
          { label: 'Normal', value: 'normal' },
          { label: 'Lebar', value: 'wide' },
        ],
      },
    ],
  },

  stats: {
    slug: 'stats',
    label: 'Angka Pencapaian (Stats)',
    icon: 'BarChart3',
    category: 'proof',
    description: 'Tampilkan angka pencapaian seperti jumlah keluarga, rating, atau pengalaman.',
    defaults: {
      blockType: 'stats',
      title: 'Dipercaya Ribuan Orang Tua',
      subtitle: '',
      items: [
        { value: '1.000+', label: 'Keluarga terlayani', icon: '👶' },
        { value: '5', label: 'Tahun pengalaman', icon: '⭐' },
        { value: '4.9', label: 'Rating Bunda', icon: '💛' },
      ],
      columns: '3',
      background: 'cream',
      style: 'plain',
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text' },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'textarea' },
      {
        name: 'columns',
        label: 'Jumlah Kolom',
        type: 'select',
        options: [
          { label: '2 Kolom', value: '2' },
          { label: '3 Kolom', value: '3' },
          { label: '4 Kolom', value: '4' },
        ],
      },
      { name: 'background', label: 'Warna Latar Belakang', type: 'select', options: bgWhiteCreamPeach },
      {
        name: 'style',
        label: 'Gaya Tampilan',
        type: 'select',
        options: [
          { label: 'Polos', value: 'plain' },
          { label: 'Kartu', value: 'card' },
        ],
      },
    ],
    innerBlocks: {
      path: 'items',
      label: 'Daftar Angka',
      itemTitleField: 'label',
      fields: [
        { name: 'value', label: 'Angka / Nilai', type: 'text', required: true },
        { name: 'label', label: 'Keterangan Angka', type: 'text', required: true },
        { name: 'icon', label: 'Ikon Emoji', type: 'text', placeholder: '👶' },
      ],
    },
  },

  logos: {
    slug: 'logos',
    label: 'Logo Kepercayaan / Partner',
    icon: 'Building2',
    category: 'proof',
    description: 'Strip logo partner, media, atau komunitas untuk membangun kepercayaan.',
    defaults: {
      blockType: 'logos',
      title: 'Dipercaya oleh',
      items: [{ name: 'Partner Kala' }],
      columns: '4',
      background: 'white',
      grayscale: true,
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text' },
      {
        name: 'columns',
        label: 'Jumlah Kolom',
        type: 'select',
        options: [
          { label: '3 Kolom', value: '3' },
          { label: '4 Kolom', value: '4' },
          { label: '5 Kolom', value: '5' },
          { label: '6 Kolom', value: '6' },
        ],
      },
      {
        name: 'background',
        label: 'Warna Latar Belakang',
        type: 'select',
        options: [
          { label: 'Putih', value: 'white' },
          { label: 'Krem', value: 'cream' },
        ],
      },
      { name: 'grayscale', label: 'Tampilkan Hitam-Putih', type: 'checkbox' },
    ],
    innerBlocks: {
      path: 'items',
      label: 'Daftar Logo',
      itemTitleField: 'name',
      fields: [
        { name: 'image', label: 'File Logo', type: 'upload' },
        { name: 'imageUrlFallback', label: 'URL Logo Cadangan', type: 'text' },
        { name: 'name', label: 'Nama Partner / Media', type: 'text', required: true },
      ],
    },
  },

  team: {
    slug: 'team',
    label: 'Tim Bidan (Grid Profil)',
    icon: 'Users',
    category: 'proof',
    description: 'Grid profil bidan dinamis dari koleksi Bidan (dengan nama dan STR).',
    defaults: {
      blockType: 'team',
      heading: 'Kenali Bidan yang Akan Mendampingi Bunda',
      subheading: 'Semua bidan Kala ber-STR resmi Kemenkes RI dan berpengalaman menangani ibu & bayi.',
      columns: '3',
      background: 'white',
      showStr: true,
      disabled: false,
    },
    fields: [
      { name: 'heading', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subheading', label: 'Subjudul Seksi', type: 'textarea' },
      { name: 'midwives', label: 'Pilih Bidan (Kosongkan = semua aktif)', type: 'relationship', relationTo: 'midwives', hasMany: true },
      {
        name: 'columns',
        label: 'Jumlah Kolom',
        type: 'select',
        options: [
          { label: '2 Kolom', value: '2' },
          { label: '3 Kolom', value: '3' },
          { label: '4 Kolom', value: '4' },
        ],
      },
      { name: 'background', label: 'Warna Latar Belakang', type: 'select', options: bgWhiteCreamPeach },
      { name: 'showStr', label: 'Tampilkan Nomor STR', type: 'checkbox' },
      { name: 'ctaText', label: 'Teks Tombol Konsultasi', type: 'text' },
    ],
  },

  tabs: {
    slug: 'tabs',
    label: 'Tab Konten',
    icon: 'Columns3',
    category: 'content',
    description: 'Beberapa tab berisi konten berbeda untuk menghemat ruang halaman.',
    defaults: {
      blockType: 'tabs',
      title: 'Informasi Layanan',
      subtitle: '',
      tabs: [
        { label: 'Manfaat', content: null },
        { label: 'Proses', content: null },
      ],
      style: 'pills',
      background: 'white',
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text' },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'textarea' },
      {
        name: 'style',
        label: 'Gaya Tab',
        type: 'select',
        options: [
          { label: 'Tombol Bulat (Pills)', value: 'pills' },
          { label: 'Garis Bawah', value: 'underline' },
        ],
      },
      { name: 'background', label: 'Warna Latar Belakang', type: 'select', options: bgWhiteCreamPeach },
    ],
    innerBlocks: {
      path: 'tabs',
      label: 'Daftar Tab',
      itemTitleField: 'label',
      fields: [
        { name: 'label', label: 'Nama Tab', type: 'text', required: true },
        { name: 'content', label: 'Isi Tab', type: 'richtext', required: true },
      ],
    },
  },

  leadForm: {
    slug: 'leadForm',
    label: 'Formulir Pemesanan (Lead Form)',
    icon: 'ClipboardList',
    category: 'conversion',
    description: 'Formulir nama, WhatsApp, layanan, dan jadwal yang dikirim ke WhatsApp.',
    defaults: {
      blockType: 'leadForm',
      heading: 'Isi Data untuk Reservasi Cepat',
      description: 'Isi data di bawah, lalu kirim lewat WhatsApp. Bidan kami akan membalas dalam 5 menit.',
      fields: ['name', 'phone', 'service', 'date', 'message'],
      submitLabel: 'Kirim & Chat via WhatsApp',
      consentText: 'Dengan mengirim formulir ini, Bunda setuju dihubungi oleh bidan Kala melalui WhatsApp terkait reservasi.',
      background: 'cream',
      disabled: false,
    },
    fields: [
      { name: 'heading', label: 'Judul Formulir', type: 'text', required: true },
      { name: 'description', label: 'Penjelasan Singkat', type: 'textarea' },
      { name: 'submitLabel', label: 'Teks Tombol Kirim', type: 'text' },
      { name: 'consentText', label: 'Teks Persetujuan', type: 'textarea' },
      { name: 'background', label: 'Warna Latar Belakang', type: 'select', options: bgWhiteCreamPeach },
      { name: 'note', label: 'Catatan Kecil', type: 'text' },
    ],
    innerBlocks: {
      path: 'serviceOptions',
      label: 'Pilihan Layanan (kosongkan = ambil otomatis dari CMS)',
      itemTitleField: 'label',
      fields: [{ name: 'label', label: 'Nama Layanan', type: 'text', required: true }],
    },
  },

  blogFeed: {
    slug: 'blogFeed',
    label: 'Daftar Artikel (Blog Feed)',
    icon: 'Newspaper',
    category: 'content',
    description: 'Menampilkan artikel edukasi terbaru langsung dari CMS.',
    defaults: {
      blockType: 'blogFeed',
      heading: 'Bacaan Bermanfaat untuk Bunda',
      description: '',
      source: 'latest',
      limit: 3,
      columns: '3',
      background: 'white',
      showImage: true,
      showExcerpt: true,
      ctaText: 'Baca Artikel',
      disabled: false,
    },
    fields: [
      { name: 'heading', label: 'Judul Seksi', type: 'text' },
      { name: 'description', label: 'Deskripsi Singkat', type: 'textarea' },
      {
        name: 'source',
        label: 'Sumber Artikel',
        type: 'select',
        options: [
          { label: 'Artikel Terbaru', value: 'latest' },
          { label: 'Berdasarkan Kategori', value: 'category' },
        ],
      },
      {
        name: 'category',
        label: 'Kategori Artikel',
        type: 'select',
        options: [
          { label: 'Bayi & Newborn', value: 'bayi' },
          { label: 'Ibu Menyusui & Postpartum', value: 'ibu-menyusui' },
          { label: 'Layanan & Paket Homecare', value: 'layanan' },
          { label: 'Kehamilan & Persiapan Lahir', value: 'kehamilan' },
        ],
      },
      { name: 'limit', label: 'Jumlah Artikel', type: 'number' },
      {
        name: 'columns',
        label: 'Jumlah Kolom',
        type: 'select',
        options: [
          { label: '2 Kolom', value: '2' },
          { label: '3 Kolom', value: '3' },
        ],
      },
      {
        name: 'background',
        label: 'Warna Latar Belakang',
        type: 'select',
        options: [
          { label: 'Putih', value: 'white' },
          { label: 'Krem', value: 'cream' },
        ],
      },
      { name: 'showImage', label: 'Tampilkan Foto Sampul', type: 'checkbox' },
      { name: 'showExcerpt', label: 'Tampilkan Ringkasan', type: 'checkbox' },
      { name: 'ctaText', label: 'Teks Tautan Artikel', type: 'text' },
    ],
  },

  countdown: {
    slug: 'countdown',
    label: 'Hitung Mundur Promo',
    icon: 'Timer',
    category: 'promo',
    description: 'Hitung mundur menuju batas akhir promo dengan tombol WhatsApp.',
    defaults: {
      blockType: 'countdown',
      title: 'Promo Berakhir Dalam',
      subtitle: 'Harga spesial hanya sampai akhir bulan ini.',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      expiredText: 'Promo telah berakhir. Hubungi kami untuk penawaran terbaru.',
      ctaText: 'Ambil Promo Sekarang',
      background: 'peach',
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Hitung Mundur', type: 'text', required: true },
      { name: 'subtitle', label: 'Penjelasan Singkat', type: 'textarea' },
      { name: 'targetDate', label: 'Tanggal & Jam Berakhir', type: 'date', required: true },
      { name: 'expiredText', label: 'Teks Setelah Waktu Habis', type: 'text' },
      { name: 'ctaText', label: 'Teks Tombol', type: 'text' },
      { name: 'ctaMessage', label: 'Pesan Otomatis WhatsApp', type: 'text' },
      {
        name: 'background',
        label: 'Warna Latar Belakang',
        type: 'select',
        options: [
          { label: 'Peach', value: 'peach' },
          { label: 'Krem', value: 'cream' },
          { label: 'Gelap', value: 'dark' },
        ],
      },
    ],
  },

  social: {
    slug: 'social',
    label: 'Media Sosial & Bagikan',
    icon: 'Share2',
    category: 'promo',
    description: 'Ikon media sosial dan tombol bagikan halaman.',
    defaults: {
      blockType: 'social',
      variant: 'icons',
      title: 'Ikuti Kala',
      items: [
        { platform: 'instagram', url: 'https://instagram.com/kalababyspa' },
        { platform: 'tiktok', url: 'https://tiktok.com/@kalababyspa' },
      ],
      shareLabel: 'Bagikan halaman ini',
      align: 'center',
      background: 'white',
      disabled: false,
    },
    fields: [
      {
        name: 'variant',
        label: 'Jenis Tampilan',
        type: 'select',
        options: [
          { label: 'Ikon Media Sosial', value: 'icons' },
          { label: 'Tombol Bagikan', value: 'share' },
          { label: 'Keduanya', value: 'both' },
        ],
      },
      { name: 'title', label: 'Judul Seksi', type: 'text' },
      { name: 'shareLabel', label: 'Teks Tombol Bagikan', type: 'text' },
      {
        name: 'align',
        label: 'Perataan',
        type: 'select',
        options: [
          { label: 'Kiri', value: 'left' },
          { label: 'Tengah', value: 'center' },
        ],
      },
      { name: 'background', label: 'Warna Latar Belakang', type: 'select', options: bgWhiteCreamPeach },
    ],
    innerBlocks: {
      path: 'items',
      label: 'Akun Media Sosial',
      itemTitleField: 'platform',
      fields: [
        {
          name: 'platform',
          label: 'Platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Email', value: 'email' },
          ],
        },
        { name: 'url', label: 'Tautan Akun', type: 'text', required: true },
      ],
    },
  },

  html: {
    slug: 'html',
    label: 'HTML Kustom (Advanced)',
    icon: 'Code2',
    category: 'content',
    description: 'Tempel HTML/CSS khusus. Script hanya berjalan jika mode sandbox diaktifkan.',
    defaults: {
      blockType: 'html',
      label: 'HTML Kustom',
      html: '<div style="padding: 24px; border: 1px dashed #F6DCCD; border-radius: 16px;">\n  <h3 style="margin: 0 0 8px; color: #4B2E22;">Judul HTML Kustom</h3>\n  <p style="margin: 0; color: #86675A;">Tulis HTML atau CSS khusus di sini.</p>\n</div>',
      maxWidth: 'normal',
      padding: 'normal',
      background: 'transparent',
      allowScripts: false,
      disabled: false,
    },
    fields: [
      { name: 'label', label: 'Nama Blok (Penanda Admin)', type: 'text' },
      {
        name: 'html',
        label: 'Kode HTML',
        type: 'code',
        required: true,
        description:
          'Script, iframe, form, style, event handler, dan URL javascript: dibuang otomatis kecuali mode sandbox diaktifkan.',
      },
      {
        name: 'allowScripts',
        label: 'Jalankan JavaScript di dalam sandbox (Advanced)',
        type: 'checkbox',
        description:
          'Script berjalan di iframe sandbox tanpa akses ke DOM induk, cookie, atau localStorage. Hanya untuk kode tepercaya.',
      },
      {
        name: 'maxWidth',
        label: 'Lebar Maksimal',
        type: 'select',
        options: [
          { label: 'Sempit (768px)', value: 'narrow' },
          { label: 'Normal (1152px)', value: 'normal' },
          { label: 'Lebar (1280px)', value: 'wide' },
          { label: 'Penuh Layar', value: 'full' },
        ],
      },
      {
        name: 'padding',
        label: 'Jarak Atas-Bawah',
        type: 'select',
        options: [
          { label: 'Tanpa Jarak', value: 'none' },
          { label: 'Rapat', value: 'compact' },
          { label: 'Normal', value: 'normal' },
          { label: 'Longgar', value: 'spacious' },
        ],
      },
      {
        name: 'background',
        label: 'Latar Belakang',
        type: 'select',
        options: [
          { label: 'Transparan', value: 'transparent' },
          { label: 'Putih', value: 'white' },
          { label: 'Krem', value: 'cream' },
          { label: 'Peach', value: 'peach' },
        ],
      },
    ],
  },

  templateRef: {
    slug: 'templateRef',
    label: 'Template Seksi Tersimpan',
    icon: 'Copy',
    category: 'content',
    description: 'Menyisipkan susunan blok modular yang telah disimpan di Pustaka Template Blok.',
    defaults: {
      blockType: 'templateRef',
      disabled: false,
    },
    fields: [{ name: 'template', label: 'Pilih Template', type: 'relationship', relationTo: 'block-templates', required: true }],
  },
};

export interface BuilderPageTemplate {
  id: string;
  title: string;
  badge: string;
  description: string;
  blocks: Array<Record<string, any>>;
}

export const builderTemplates: BuilderPageTemplate[] = [
  {
    id: 'standard-sales',
    title: 'Landing Page Penawaran Lengkap (Standar Konversi)',
    badge: 'Rekomendasi',
    description: 'Struktur landing page lengkap dengan Hero, Masalah, Solusi, Paket Harga, Testimoni, FAQ, dan Call to Action.',
    blocks: [
      {
        blockType: 'hero',
        badge: '100% Bidan Ber-STR Resmi',
        headline: 'Layanan Homecare Bidan Terpercaya di Surabaya & Sidoarjo',
        subheadline: 'Perawatan bayi baru lahir dan ibu pasca melahirkan dengan sentuhan medis profesional yang penuh kasih sayang.',
        price: 'Rp150.000',
        originalPrice: 'Rp190.000',
        duration: '90 Menit',
        ctaText: 'Pesan Kunjungan Sekarang',
        align: 'left',
        bgStyle: 'gradient',
      },
      {
        blockType: 'painPoints',
        title: 'Kekhawatiran yang Sering Dialami Bunda',
        subtitle: 'Bunda tidak perlu menghadapinya sendirian, kami hadir mendampingi.',
        columns: '3',
        background: 'cream',
        points: [
          { icon: '😭', title: 'Bayi Sering Menangis & Kolik', description: 'Perut kembung yang membuat si kecil tidak nyaman sepanjang malam.' },
          { icon: '🥺', title: 'Kelelahan Pasca Melahirkan', description: 'Tubuh tegang dan butuh relaksasi stimulasi laktasi oksitosin.' },
          { icon: '🤔', title: 'Ragu Merawat Bayi Newborn', description: 'Perlu bimbingan bidan untuk perawatan tali pusat dan memandikan bayi.' },
        ],
      },
      {
        blockType: 'solutions',
        title: 'Solusi Medis Profesional dari Bidan Kala',
        subtitle: 'Standar pelayanan klinis terbaik langsung di kenyamanan rumah Bunda.',
        items: [
          { icon: '👩‍⚕️', title: 'Bidan Berlisensi STR Resmi', description: 'Bukan sekadar terapis umum, seluruh staf adalah tenaga kesehatan kebidanan terlatih.' },
          { icon: '🧼', title: 'Peralatan Steril & Higienis', description: 'Minyak organik food-grade dan perlengkapan higienis bersertifikasi.' },
          { icon: '🤍', title: 'Edukasi & Konsultasi Gratis', description: 'Bunda bebas berkonsultasi seputar ASI, menyusui, dan tumbuh kembang si kecil.' },
        ],
      },
      {
        blockType: 'pricing',
        title: 'Pilihan Paket Layanan Favorit',
        subtitle: 'Harga transparan tanpa biaya tersembunyi dengan jaminan pelayanan memuaskan.',
        packages: [
          {
            name: 'Pijat Newborn Homecare',
            target: 'Bayi 0 - 3 Bulan',
            price: 'Rp135.000',
            originalPrice: 'Rp175.000',
            duration: '60 Menit',
            description: 'Pijat relaksasi lembut, senam bayi ringan, dan mandi air hangat.',
            isPopular: false,
            ctaText: 'Pilih Paket Newborn',
          },
          {
            name: 'Bundle Ibu & Bayi (Duo Nyaman)',
            target: 'Ibu Nifas & Bayi',
            price: 'Rp250.000',
            originalPrice: 'Rp320.000',
            duration: '120 Menit',
            description: 'Kombinasi pijat laktasi ibu dan relaksasi bayi dalam satu kunjungan hemat.',
            isPopular: true,
            popularBadge: 'Paling Laris',
            ctaText: 'Pesan Paket Bundling',
          },
        ],
      },
      {
        blockType: 'testimonials',
        title: 'Apa Kata Para Bunda di Surabaya?',
        subtitle: 'Ratusan testimoni asli dari keluarga yang telah merasakan kenyamanan Kala Homecare.',
        items: [
          {
            quote: 'Bidan Kala sangat telaten dan sabar. Baby Ken yang biasanya rewel langsung tidur lelap setelah dipijat.',
            author: 'Bunda Sarah & Baby Ken',
            role: 'Ibu dari Bayi 2 Bulan',
            area: 'Surabaya Timur',
          },
        ],
      },
      {
        blockType: 'faq',
        title: 'Pertanyaan yang Sering Diajukan (FAQ)',
        subtitle: 'Informasi praktis seputar reservasi dan persiapan sebelum bidan datang.',
        faqs: [
          {
            q: 'Apakah bidan membawa seluruh perlengkapan sendiri?',
            a: 'Ya, bidan Kala membawa minyak pijat organik, underpad steril, dan handuk bersih.',
          },
        ],
      },
      {
        blockType: 'cta',
        badge: 'Jadwalkan Kunjungan Hari Ini',
        headline: 'Si Kecil Nyaman, Bunda Tenang. Hubungi Bidan Sekarang!',
        description: 'Slot kunjungan harian terbatas untuk menjaga kualitas pelayanan terbaik.',
        buttonText: 'Konsultasi Gratis via WhatsApp',
        footnote: 'Respon cepat dalam 5-10 menit di jam operasional klinik.',
      },
    ],
  },
  {
    id: 'quick-lead',
    title: 'Landing Page Promo Kilat (Flash Sale / Singkat)',
    badge: 'Fokus Konversi Cepat',
    description: 'Format ringkas yang berfokus langsung pada penawaran terbatas dan tombol pesan cepat.',
    blocks: [
      {
        blockType: 'hero',
        badge: 'Promo Terbatas Minggu Ini',
        headline: 'Hemat Hingga 35% untuk Perawatan Pertama Si Kecil',
        subheadline: 'Klaim voucher kunjungan homecare bidan resmi sekarang sebelum kuota habis.',
        price: 'Rp99.000',
        originalPrice: 'Rp150.000',
        duration: '60 Menit',
        ctaText: 'Klaim Promo via WhatsApp',
        align: 'center',
        bgStyle: 'white',
      },
      {
        blockType: 'countdown',
        title: 'Promo Berakhir Dalam',
        subtitle: 'Jangan lewatkan harga spesial kunjungan pertama.',
        ctaText: 'Klaim Promo Sekarang',
        background: 'peach',
      },
      {
        blockType: 'solutions',
        title: 'Mengapa Memilih Kala Baby Spa?',
        subtitle: 'Kualitas medis rumah sakit di ruang keluarga Anda.',
        items: [
          { icon: '🩺', title: '100% Tenaga Bidan STR', description: 'Aman dan terstandar kesehatan.' },
          { icon: '🌿', title: 'Bahan Organik Hypoallergenic', description: 'Aman untuk kulit sensitif bayi.' },
          { icon: '⏰', title: 'Layanan Tepat Waktu', description: 'Bidan datang langsung ke rumah Anda.' },
        ],
      },
      {
        blockType: 'cta',
        badge: 'Promo Terbatas',
        headline: 'Amankan Jadwal Anda Sebelum Kuota Penuh!',
        buttonText: 'Chat Bidan Sekarang',
      },
    ],
  },
];
