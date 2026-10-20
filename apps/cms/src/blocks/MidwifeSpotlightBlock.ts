import type { Block } from 'payload'

export const MidwifeSpotlightBlock: Block = {
  slug: 'midwifeSpotlight',
  labels: {
    singular: 'Profil Bidan Singkat (Midwife Spotlight)',
    plural: 'Profil Bidan Singkat',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Judul Seksi',
      required: true,
      defaultValue: 'Ditangani Langsung oleh Bidan Profesional Ber-STR Resmi',
      maxLength: 70,
      admin: {
        description: 'Contoh: Dipijat oleh bidan ber-STR yang sudah Anda kenal (maks 70 karakter).',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subjudul / Keterangan Tambahan',
      defaultValue: 'Tenaga kesehatan terdaftar Kemenkes RI yang berempati tinggi, komunikatif, dan menjamin kenyamanan Bunda tanpa mom-shaming.',
    },
    {
      name: 'midwives',
      type: 'relationship',
      relationTo: 'midwives',
      hasMany: true,
      minRows: 1,
      maxRows: 3,
      label: 'Bidan yang Ditampilkan (1-3 Bidan)',
      admin: {
        description: 'Pilih bidan yang bertugas melayani wilayah atau fokus pada tindakan ini.',
      },
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'cream',
      options: [
        { label: 'Putih Bersih', value: 'white' },
        { label: 'Krem Hangat (#FFF9F4)', value: 'cream' },
        { label: 'Peach Lembut (#FFEFE5)', value: 'peach' },
      ],
      admin: {
        description: 'Pilihan palet warna latar belakang.',
      },
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
    },
  ],
}
