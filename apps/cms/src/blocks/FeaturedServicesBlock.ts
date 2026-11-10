import type { Block } from 'payload'

export const FeaturedServicesBlock: Block = {
  slug: 'featuredServices',
  labels: {
    singular: 'Layanan Unggulan (Featured Services)',
    plural: 'Layanan Unggulan (Featured Services)',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Layanan Favorit Keluarga',
      label: 'Badge Header',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Pilihan Layanan Terlaris untuk Si Kecil',
      label: 'Judul Seksi',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Dirancang khusus oleh bidan berpengalaman untuk kebutuhan harian bayi dan Bunda di rumah.',
      label: 'Subjudul Seksi',
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'cms',
      label: 'Sumber Data Layanan',
      options: [
        { label: 'Ambil dari koleksi Layanan di CMS (disarankan)', value: 'cms' },
        { label: 'Gunakan daftar bawaan situs', value: 'config' },
      ],
      admin: {
        description:
          'Jika memilih CMS, blok akan menampilkan layanan teratas dari koleksi Layanan. Jika kosong, otomatis memakai daftar bawaan.',
      },
    },
    {
      name: 'maxItems',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 6,
      label: 'Jumlah Layanan Ditampilkan',
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Lihat Semua Layanan',
      label: 'Teks Tombol Lihat Semua',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      defaultValue: '/layanan',
      label: 'URL Tombol Lihat Semua',
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'cream',
      label: 'Latar Belakang',
      options: [
        { label: 'Putih Bersih', value: 'white' },
        { label: 'Krem Hangat', value: 'cream' },
        { label: 'Peach Lembut', value: 'peach' },
      ],
    },
  ],
}
