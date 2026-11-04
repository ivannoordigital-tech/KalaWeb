import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const TeamBlock: Block = {
  slug: 'team',
  labels: {
    singular: 'Tim Bidan (Grid Profil)',
    plural: 'Tim Bidan (Grid Profil)',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Kenali Bidan yang Akan Mendampingi Bunda',
      label: 'Judul Seksi',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subjudul (Opsional)',
      admin: {
        placeholder: 'Semua bidan Kala ber-STR resmi Kemenkes RI dan berpengalaman menangani ibu & bayi.',
      },
    },
    {
      name: 'midwives',
      type: 'relationship',
      relationTo: 'midwives',
      hasMany: true,
      label: 'Pilih Bidan yang Ditampilkan',
      admin: {
        description:
          'Kosongkan untuk menampilkan semua bidan aktif. Data diambil otomatis dari koleksi Bidan (tidak perlu input ulang).',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          label: 'Jumlah Kolom',
          admin: { width: '50%' },
          options: [
            { label: '2 Kolom', value: '2' },
            { label: '3 Kolom', value: '3' },
            { label: '4 Kolom', value: '4' },
          ],
        },
        {
          name: 'background',
          type: 'select',
          defaultValue: 'white',
          label: 'Latar Belakang',
          admin: { width: '50%' },
          options: [
            { label: 'Putih', value: 'white' },
            { label: 'Krem', value: 'cream' },
            { label: 'Peach', value: 'peach' },
          ],
        },
      ],
    },
    {
      name: 'showStr',
      type: 'checkbox',
      defaultValue: true,
      label: 'Tampilkan Nomor STR (Membangun Kepercayaan)',
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Teks Tombol Konsultasi (Opsional)',
      admin: { placeholder: 'Konsultasi dengan Bidan Kala' },
    },
    ...blockSettingsFields,
  ],
}
