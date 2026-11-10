import type { Block } from 'payload'

export const ValuePropsBlock: Block = {
  slug: 'valueProps',
  labels: {
    singular: 'Pembeda Layanan (Value Props)',
    plural: 'Pembeda Layanan (Value Props)',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Kenapa Memilih Kala?',
      label: 'Badge Header',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: '5 Hal yang Membuat Kala Berbeda',
      label: 'Judul Seksi',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Setiap kunjungan Kala menghadirkan perawatan profesional, perhatian yang tulus, dan kenyamanan untuk Bunda serta si kecil.',
      label: 'Subjudul Seksi',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Daftar Pembeda (Opsional)',
      admin: {
        description:
          'Kosongkan untuk memakai daftar bawaan situs. Isi untuk menyesuaikan isi pembeda dari CMS.',
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          defaultValue: '✓',
          label: 'Emoji / Ikon',
          admin: { placeholder: 'Contoh: ✓, 🧸, ✨, 🤍' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Judul Pembeda',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Penjelasan Singkat',
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          label: 'Sorot Kartu Ini',
        },
      ],
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'white',
      label: 'Latar Belakang',
      options: [
        { label: 'Putih Bersih', value: 'white' },
        { label: 'Krem Hangat', value: 'cream' },
        { label: 'Peach Lembut', value: 'peach' },
      ],
    },
  ],
}
