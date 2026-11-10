import type { Block } from 'payload'

export const CoverageAreaBlock: Block = {
  slug: 'coverageArea',
  labels: {
    singular: 'Area Layanan (Coverage Area)',
    plural: 'Area Layanan (Coverage Area)',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Jangkauan Layanan',
      label: 'Badge Header',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Bidan Kala Siap Hadir di Surabaya & Sidoarjo',
      label: 'Judul Seksi',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Kunjungan homecare tersedia di banyak kecamatan. Cek apakah wilayah Bunda sudah termasuk.',
      label: 'Subjudul Seksi',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Daftar Wilayah (Opsional)',
      admin: {
        description:
          'Kosongkan untuk memakai daftar bawaan situs. Isi untuk menyesuaikan wilayah dari CMS.',
      },
      fields: [
        {
          name: 'region',
          type: 'text',
          required: true,
          label: 'Nama Wilayah',
          admin: { placeholder: 'Surabaya Barat' },
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug Wilayah',
          admin: { placeholder: 'surabaya-barat' },
        },
        {
          name: 'areas',
          type: 'textarea',
          label: 'Daftar Kecamatan',
          admin: { placeholder: 'Wiyung, Sambikerep, Lakarsantri, ...' },
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Cek Ketersediaan Wilayah Saya',
      label: 'Teks Tombol CTA',
    },
    {
      name: 'ctaMessage',
      type: 'textarea',
      label: 'Pesan Otomatis WhatsApp',
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
