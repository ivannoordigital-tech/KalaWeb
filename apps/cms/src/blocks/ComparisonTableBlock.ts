import type { Block } from 'payload'

export const ComparisonTableBlock: Block = {
  slug: 'comparison',
  labels: {
    singular: 'Blok Tabel Komparasi (Kala vs Lainnya)',
    plural: 'Blok Tabel Komparasi (Kala vs Lainnya)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Mengapa Bunda Memilih Kala Dibandingkan yang Lain?',
      label: 'Judul Seksi Komparasi',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Standar kebidanan medis higienis yang kami jaga demi ketenangan hati keluarga Anda.',
      label: 'Sub-judul Penjelas',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'kalaLabel',
          type: 'text',
          defaultValue: 'Kala Moms & Baby Spa',
          label: 'Label Kolom Kala',
          admin: { width: '50%' },
        },
        {
          name: 'otherLabel',
          type: 'text',
          defaultValue: 'Pijat Keliling / Terapis Umum',
          label: 'Label Kolom Pembanding',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      required: true,
      label: 'Daftar Poin Perbandingan',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          label: 'Aspek yang Dibandingkan',
          admin: { width: '30%', placeholder: 'Kualifikasi Tenaga' },
        },
        {
          name: 'kalaValue',
          type: 'text',
          required: true,
          label: 'Keunggulan di Kala (Positif)',
          admin: { width: '35%', placeholder: '100% Bidan Berijazah & Ber-STR Kemenkes' },
        },
        {
          name: 'otherValue',
          type: 'text',
          required: true,
          label: 'Kondisi di Tempat Lain',
          admin: { width: '35%', placeholder: 'Terapis umum tanpa legalitas medis resmi' },
        },
      ],
    },
  ],
}
