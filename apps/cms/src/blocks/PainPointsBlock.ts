import type { Block } from 'payload'

export const PainPointsBlock: Block = {
  slug: 'painPoints',
  labels: {
    singular: 'Blok Masalah Bunda (Pain Points)',
    plural: 'Blok Masalah Bunda (Pain Points)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Apakah Ini yang Bunda Rasakan?',
      label: 'Judul Seksi Masalah',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Kekhawatiran yang Kerap Dialami Orang Tua Baru di Surabaya & Sidoarjo',
      label: 'Sub-judul Penjelas',
    },
    {
      name: 'points',
      type: 'array',
      required: true,
      label: 'Daftar Keluhan / Masalah',
      fields: [
        {
          name: 'icon',
          type: 'text',
          defaultValue: '😭',
          label: 'Emoji / Ikon',
          admin: { width: '20%' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Poin Masalah',
          admin: { width: '80%', placeholder: 'Bayi sering rewel & susah tidur' },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Deskripsi Detail Masalah',
          admin: { placeholder: 'Si kecil menangis terus tanpa sebab jelas, tengah malam pun sulit tidur lelap.' },
        },
      ],
    },
  ],
}
