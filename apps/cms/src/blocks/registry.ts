export type BuilderFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'number'
  | 'upload'
  | 'richtext'
  | 'array';

export interface BuilderFieldMeta {
  name: string;
  label: string;
  type: BuilderFieldType;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  description?: string;
}

export interface BuilderInnerBlocks {
  path: string;
  label: string;
  itemTitleField: string;
  fields: BuilderFieldMeta[];
  min?: number;
  max?: number;
}

export interface BuilderBlockMeta {
  slug: string;
  label: string;
  icon: string;
  category: 'hero' | 'proof' | 'offer' | 'content' | 'cta';
  description: string;
  defaults: Record<string, unknown>;
  fields: BuilderFieldMeta[];
  innerBlocks?: BuilderInnerBlocks;
  presets?: Array<{ id: string; label: string; defaults: Record<string, unknown> }>;
}

export const builderRegistry: Record<string, BuilderBlockMeta> = {
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
      btnColor: 'primary',
      bgStyle: 'default',
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
        name: 'bgStyle',
        label: 'Warna Latar Belakang',
        type: 'select',
        options: [
          { label: 'Standar Krem (Hangat)', value: 'default' },
          { label: 'Putih Bersih', value: 'white' },
          { label: 'Krem Lembut', value: 'soft' },
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
      title: 'Apakah Bunda Mengalami Kekhawatiran Ini?',
      subtitle: 'Bunda tidak sendirian, fase adaptasi kelahiran memang penuh tantangan.',
      columns: '3',
      background: 'soft',
      spacing: 'normal',
      points: [
        { title: 'Bayi Menangis Tanpa Henti', description: 'Rewel tiap malam karena kembung atau kolik dan sulit ditenangkan.' },
        { title: 'Bunda Kelelahan Pasca Salin', description: 'Kurang tidur dan badan pegal tanpa bantuan pendamping yang terpercaya.' },
        { title: 'Cemas Merawat Tali Pusat', description: 'Masih ragu merawat tali pusat dan memandikan bayi baru lahir sendiri.' },
      ],
      disabled: false,
    },
    fields: [
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
        name: 'background',
        label: 'Warna Latar Belakang',
        type: 'select',
        options: [
          { label: 'Putih', value: 'white' },
          { label: 'Krem Lembut', value: 'soft' },
        ],
      },
    ],
    innerBlocks: {
      path: 'points',
      label: 'Daftar Poin Masalah',
      itemTitleField: 'title',
      fields: [
        { name: 'title', label: 'Judul Masalah', type: 'text', required: true },
        { name: 'description', label: 'Uraian Masalah', type: 'textarea', required: true },
        { name: 'icon', label: 'Pilihan Ikon', type: 'text', placeholder: 'baby, alert, heart, clock' },
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
      title: 'Solusi Hangat & Aman dari Bidan Kala',
      subtitle: 'Perawatan komprehensif di kenyamanan kamar Anda tanpa perlu macet ke klinik.',
      items: [
        { title: 'Terapi Sentuhan Lembut', description: 'Pijat bayi berbasis anatomi pediatri untuk meredakan kembung seketika.' },
        { title: 'Alat & Minyak Steril', description: 'Minyak alami food-grade aman untuk kulit sensitif bayi baru lahir.' },
        { title: 'Edukasi Tanpa Menghakimi', description: 'Bidan mendampingi Bunda dengan empati penuh (Zero Mom-Shaming).' },
      ],
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'textarea' },
    ],
    innerBlocks: {
      path: 'items',
      label: 'Poin Solusi',
      itemTitleField: 'title',
      fields: [
        { name: 'title', label: 'Judul Manfaat', type: 'text', required: true },
        { name: 'description', label: 'Uraian Manfaat', type: 'textarea', required: true },
        { name: 'icon', label: 'Ikon', type: 'text', placeholder: 'shield, spark, smile, heart' },
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
      title: 'Pilihan Paket Perawatan Terbaik',
      subtitle: 'Tarif transparan tanpa biaya tersembunyi untuk area Surabaya & Sidoarjo.',
      layoutStyle: 'cards',
      background: 'white',
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
          features: [{ feature: 'Pijat Kolik & Kembung' }, { feature: 'Perawatan Tali Pusat' }, { feature: 'Minyak Alami Food Grade' }],
          ctaText: 'Pilih Paket Ini',
          refCode: 'KALA-PRICING-NEWBORN',
        },
      ],
      disabled: false,
    },
    fields: [
      { name: 'badge', label: 'Badge Atas', type: 'text' },
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'textarea' },
      {
        name: 'layoutStyle',
        label: 'Tampilan Paket',
        type: 'select',
        options: [
          { label: 'Kartu Berdampingan (Cards)', value: 'cards' },
          { label: 'Daftar Vertikal (List)', value: 'list' },
        ],
      },
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
        { name: 'ctaText', label: 'Teks Tombol', type: 'text', placeholder: 'Pesan Paket Ini' },
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
      title: 'Mengapa Memilih Bidan Homecare Kala?',
      subtitle: 'Standar kebidanan medis resmi demi keselamatan buah hati tercinta.',
      kalaLabel: 'Bidan Homecare Kala',
      otherLabel: 'Pijat Tradisional Umum',
      rows: [
        { feature: 'Kualifikasi Praktisi', kalaValue: '100% Bidan Lulusan Kebidanan Ber-STR', otherValue: 'Tanpa sertifikasi medis resmi' },
        { feature: 'Higienitas Alat & Minyak', kalaValue: 'Steril & Minyak Alami Food Grade', otherValue: 'Minyak curah / tanpa standar' },
        { feature: 'Konsultasi Nifas & Laktasi', kalaValue: 'Gratis konsultasi menyusui & nifas', otherValue: 'Hanya pijat saja' },
      ],
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'textarea' },
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
      title: '3 Langkah Mudah Menghadirkan Bidan',
      subtitle: 'Praktis tanpa antre, bidan datang langsung ke rumah Anda.',
      steps: [
        { num: '01', title: 'Pilih Layanan & Waktu', description: 'Pilih paket yang sesuai dan tentukan jam kunjungan yang nyaman.' },
        { num: '02', title: 'Konfirmasi via WhatsApp', description: 'Admin kami mengonfirmasi jadwal dan menugaskan bidan terdekat.' },
        { num: '03', title: 'Bidan Tiba di Rumah', description: 'Bidan datang membawa perlengkapan steril lengkap dan siap merawat.' },
      ],
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'textarea' },
    ],
    innerBlocks: {
      path: 'steps',
      label: 'Daftar Langkah',
      itemTitleField: 'title',
      fields: [
        { name: 'num', label: 'Nomor Langkah', type: 'text', placeholder: '01' },
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
      title: 'Cerita Bunda yang Telah Terbantu',
      subtitle: 'Kepercayaan lebih dari 1000+ keluarga di Surabaya & Sidoarjo.',
      items: [
        {
          author: 'Bunda Sarah',
          role: 'Ibu dari Baby Arka (2 bulan)',
          area: 'Surabaya Timur',
          quote: 'Setelah diterapi bidan Kala, tangis kolik si kecil langsung reda dan tidurnya nyenyak sekali malam ini.',
        },
      ],
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'textarea' },
    ],
    innerBlocks: {
      path: 'items',
      label: 'Daftar Ulasan',
      itemTitleField: 'author',
      fields: [
        { name: 'author', label: 'Nama Bunda', type: 'text', required: true },
        { name: 'role', label: 'Keterangan Anak / Usia', type: 'text', placeholder: 'Ibu dari Baby Ken (3 bulan)' },
        { name: 'area', label: 'Wilayah / Kota', type: 'text', placeholder: 'Surabaya Barat' },
        { name: 'quote', label: 'Isi Ulasan', type: 'textarea', required: true },
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
      badge: 'Jaminan Higienitas & Etika',
      title: 'Komitmen Keselamatan Buah Hati Bunda',
      description: 'Seluruh bidan kami mematuhi protokol sterilisasi medis ketat, mencuci tangan standar medis, dan menggunakan minyak alami food grade.',
      note: 'Jika Bunda merasa kurang nyaman dengan pelayanan bidan kami, kami siap memberikan konsultasi evaluasi atau penjadwalan ulang tanpa biaya tambahan.',
      disabled: false,
    },
    fields: [
      { name: 'badge', label: 'Badge Atas', type: 'text' },
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'description', label: 'Pernyataan Komitmen', type: 'textarea', required: true },
      { name: 'note', label: 'Catatan Jaminan Tambahan', type: 'textarea' },
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
      title: 'Pertanyaan yang Sering Diajukan',
      subtitle: 'Semua jawaban atas keraguan Bunda seputar layanan homecare kami.',
      faqs: [
        {
          q: 'Usia berapa bayi aman untuk dipijat?',
          a: 'Bayi baru lahir (newborn) mulai usia 0 hari sudah aman mendapatkan sentuhan lembut oleh bidan ber-STR resmi kami.',
        },
        {
          q: 'Apakah ada tambahan biaya transportasi bidan?',
          a: 'Untuk seluruh wilayah Surabaya & Sidoarjo kota, biaya layanan sudah termasuk tarif kunjungan bidan.',
        },
      ],
      disabled: false,
    },
    fields: [
      { name: 'title', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subtitle', label: 'Subjudul Seksi', type: 'textarea' },
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
      badge: 'Slot Kunjungan Terbatas',
      headline: 'Siap Memberikan Perawatan Terbaik untuk Si Kecil?',
      description: 'Amankan jadwal bidan favorit Anda sekarang sebelum kuota kunjungan hari ini penuh.',
      buttonText: 'Chat WhatsApp Bidan Sekarang',
      buttonMessage: 'Halo Bidan Kala, saya ingin reservasi slot homecare untuk si kecil...',
      footnote: 'Respon cepat dalam 5 menit pada jam operasional (08.00 - 17.00)',
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
      badge: 'Dokumentasi Nyata',
      title: 'Momen Hangat Homecare Kala',
      subtitle: 'Sentuhan lembut bidan profesional kami dalam merawat si kecil di rumah.',
      columns: '3',
      bgStyle: 'white',
      images: [
        { caption: 'Pijat Relaksasi Bayi', tag: 'Bayi Sehat' },
      ],
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
    ],
    innerBlocks: {
      path: 'images',
      label: 'Daftar Foto',
      itemTitleField: 'caption',
      fields: [
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
      heading: 'Tim Bidan Berdedikasi Kala',
      subheading: 'Seluruh bidan berijazah kebidanan resmi dan memiliki STR aktif Kemenkes RI.',
      background: 'soft',
      spacing: 'normal',
      disabled: false,
    },
    fields: [
      { name: 'heading', label: 'Judul Seksi', type: 'text', required: true },
      { name: 'subheading', label: 'Subjudul Seksi', type: 'textarea' },
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
      containerWidth: 'normal',
      disabled: false,
    },
    fields: [
      {
        name: 'containerWidth',
        label: 'Lebar Kontainer',
        type: 'select',
        options: [
          { label: 'Normal (Tengah)', value: 'normal' },
          { label: 'Lebar (Wide)', value: 'wide' },
          { label: 'Penuh (Full Width)', value: 'full' },
        ],
      },
    ],
  },

  templateRef: {
    slug: 'templateRef',
    label: 'Template Seksi Tersimpan',
    icon: 'Copy',
    category: 'content',
    description: 'Menyisipkan susunan blok modular yang telah disimpan di Block Templates.',
    defaults: {
      blockType: 'templateRef',
      disabled: false,
    },
    fields: [],
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
        bgStyle: 'default',
      },
      {
        blockType: 'painPoints',
        title: 'Kekhawatiran yang Sering Dialami Bunda',
        subtitle: 'Bunda tidak perlu menghadapinya sendirian, kami hadir mendampingi.',
        columns: '3',
        background: 'soft',
        points: [
          { title: 'Bayi Sering Menangis & Kolik', description: 'Perut kembung yang membuat si kecil tidak nyaman sepanjang malam.' },
          { title: 'Kelelahan Pasca Melahirkan', description: 'Tubuh tegang dan butuh relaksasi stimulasi laktasi oksitosin.' },
          { title: 'Ragu Merawat Bayi Newborn', description: 'Perlu bimbingan bidan untuk perawatan tali pusat dan memandikan bayi.' },
        ],
      },
      {
        blockType: 'solutions',
        title: 'Solusi Medis Profesional dari Bidan Kala',
        subtitle: 'Standar pelayanan klinis terbaik langsung di kenyamanan rumah Bunda.',
        solutions: [
          { title: 'Bidan Berlisensi STR Resmi', description: 'Bukan sekadar terapis umum, seluruh staf adalah tenaga kesehatan kebidanan terlatih.' },
          { title: 'Peralatan Steril & Higienis', description: 'Minyak organik food-grade dan perlengkapan higienis bersertifikasi.' },
          { title: 'Edukasi & Konsultasi Gratis', description: 'Bunda bebas berkonsultasi seputar ASI, menyusui, dan tumbuh kembang si kecil.' },
        ],
      },
      {
        blockType: 'pricing',
        title: 'Pilihan Paket Layanan Favorit',
        subtitle: 'Harga transparan tanpa biaya tersembunyi dengan jaminan pelayanan memuaskan.',
        columns: '3',
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
          {
            name: 'Terapi Kolik & Batuk Pilek',
            target: 'Bayi & Balita',
            price: 'Rp150.000',
            originalPrice: 'Rp190.000',
            duration: '75 Menit',
            description: 'Teknik fisioterapi dada ringan dan pijat I Love U untuk melegakan pernapasan.',
            isPopular: false,
            ctaText: 'Pilih Terapi Kolik',
          },
        ],
      },
      {
        blockType: 'testimonials',
        title: 'Apa Kata Para Bunda di Surabaya?',
        subtitle: 'Ratusan testimoni asli dari keluarga yang telah merasakan kenyamanan Kala Homecare.',
        testimonials: [
          {
            author: 'Bunda Sarah & Baby Ken',
            role: 'Ibu dari Bayi 2 Bulan',
            area: 'Surabaya Timur',
            quote: 'Bidan Kala sangat telaten dan sabar. Baby Ken yang biasanya rewel langsung tidur lelap setelah dipijat. Pelayanannya juara!',
          },
          {
            author: 'Bunda Citra',
            role: 'Ibu Baru',
            area: 'Sidoarjo',
            quote: 'Pijat oksitosinnya luar biasa membantu produksi ASI saya yang awalnya seret. Bidan juga mengajarkan teknik perlekatan yang benar.',
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
            a: 'Ya, bidan Kala membawa minyak pijat organik, underpad steril, dan handuk bersih. Bunda hanya perlu menyiapkan ruang tidur yang nyaman.',
          },
          {
            q: 'Berapa hari sebelumnya saya harus memesan jadwal?',
            a: 'Disarankan memesan H-1 atau H-2 agar mendapatkan slot jam favorit pagi/sore hari.',
          },
        ],
      },
      {
        blockType: 'cta',
        badge: 'Jadwalkan Kunjungan Hari Ini',
        headline: 'Si Kecil Nyaman, Bunda Tenang. Hubungi Bidan Sekarang!',
        description: 'Slot kunjungan harian terbatas untuk menjaga kualitas pelayanan terbaik di tiap rumah.',
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
        blockType: 'solutions',
        title: 'Mengapa Memilih Kala Baby Spa?',
        subtitle: 'Kualitas medis rumah sakit di ruang keluarga Anda.',
        solutions: [
          { title: '100% Tenaga Bidan STR', description: 'Aman dan terstandar kesehatan.' },
          { title: 'Bahan Organik Hypoallergenic', description: 'Aman untuk kulit sensitif bayi.' },
          { title: 'Layanan Tepat Waktu', description: 'Bidan datang langsung ke rumah Anda.' },
        ],
      },
      {
        blockType: 'guarantee',
        badge: 'Jaminan Kepuasan',
        title: 'Garansi Pelayanan Medis Bersahabat & Nyaman',
        description: 'Jika Bunda merasa penanganan bidan kurang ramah atau tidak sesuai SOP medis, kami berikan penggantian sesi tanpa biaya tambahan.',
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
