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
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          defaultValue: '2',
          options: [
            { label: '2 Kolom (Rekomendasi 2-4 Masalah)', value: '2' },
            { label: '3 Kolom (3 atau 6 Masalah)', value: '3' },
          ],
          label: 'Jumlah Kolom Grid',
          admin: { width: '33%' },
        },
        {
          name: 'background',
          type: 'select',
          defaultValue: 'cream',
          options: [
            { label: 'Krem Hangat (#FFF9F4)', value: 'cream' },
            { label: 'Putih Bersih', value: 'white' },
            { label: 'Peach Lembut (#FFEFE5)', value: 'peach' },
          ],
          label: 'Warna Latar',
          admin: { width: '33%' },
        },
        {
          name: 'spacing',
          type: 'select',
          defaultValue: 'normal',
          options: [
            { label: 'Rapat (Compact)', value: 'compact' },
            { label: 'Normal', value: 'normal' },
            { label: 'Longgar (Spacious)', value: 'spacious' },
          ],
          label: 'Jarak Seksi',
          admin: { width: '33%' },
        },
      ],
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
