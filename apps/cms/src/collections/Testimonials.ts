import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'location', 'service'],
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Kutipan Testimoni Bunda',
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Nama Bunda & Bayi (contoh: Bunda Sarah & Baby Arka (2 bulan))',
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      label: 'Lokasi Pasien (contoh: Rungkut, Surabaya Timur)',
    },
    {
      name: 'service',
      type: 'text',
      required: true,
      label: 'Layanan yang Diambil (contoh: Kala Bundle Duo)',
    },
  ],
}
