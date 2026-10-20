import type { Block } from 'payload'

export const StepsFlowBlock: Block = {
  slug: 'steps',
  labels: {
    singular: 'Blok Alur Kerja (3-4 Langkah Booking)',
    plural: 'Blok Alur Kerja (3-4 Langkah Booking)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Mudah & Nyaman dari Rumah',
      label: 'Judul Seksi Alur Kerja',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Alur praktis tanpa perlu keluar rumah dan tanpa antre.',
      label: 'Sub-judul Penjelas',
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      label: 'Daftar Langkah Alur',
      fields: [
        {
          name: 'num',
          type: 'text',
          defaultValue: '1',
          label: 'Nomor Langkah',
          admin: { width: '15%' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Judul Langkah',
          admin: { width: '40%', placeholder: 'Konsultasi Gratis via WA' },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Penjelasan Langkah',
          admin: { width: '45%', placeholder: 'Ceritakan kondisi dan usia si kecil. Tim kami rekomendasikan paket paling pas.' },
        },
      ],
    },
  ],
}
