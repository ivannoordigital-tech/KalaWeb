import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const BlogFeedBlock: Block = {
  slug: 'blogFeed',
  labels: {
    singular: 'Daftar Artikel (Blog Feed)',
    plural: 'Daftar Artikel (Blog Feed)',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Bacaan Bermanfaat untuk Bunda',
      label: 'Judul Seksi',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Deskripsi Singkat (Opsional)',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'latest',
          label: 'Sumber Artikel',
          admin: { width: '50%' },
          options: [
            { label: 'Artikel Terbaru', value: 'latest' },
            { label: 'Berdasarkan Kategori', value: 'category' },
          ],
        },
        {
          name: 'category',
          type: 'select',
          label: 'Kategori Artikel',
          admin: {
            width: '50%',
            condition: (data: any) => data?.source === 'category',
          },
          options: [
            { label: 'Bayi & Newborn', value: 'bayi' },
            { label: 'Ibu Menyusui & Postpartum', value: 'ibu-menyusui' },
            { label: 'Layanan & Paket Homecare', value: 'layanan' },
            { label: 'Kehamilan & Persiapan Lahir', value: 'kehamilan' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'limit',
          type: 'number',
          defaultValue: 3,
          min: 1,
          max: 6,
          label: 'Jumlah Artikel',
          admin: { width: '33%' },
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          label: 'Jumlah Kolom',
          admin: { width: '33%' },
          options: [
            { label: '2 Kolom', value: '2' },
            { label: '3 Kolom', value: '3' },
          ],
        },
        {
          name: 'background',
          type: 'select',
          defaultValue: 'white',
          label: 'Latar Belakang',
          admin: { width: '34%' },
          options: [
            { label: 'Putih', value: 'white' },
            { label: 'Krem', value: 'cream' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showImage',
          type: 'checkbox',
          defaultValue: true,
          label: 'Tampilkan Foto Sampul',
          admin: { width: '50%' },
        },
        {
          name: 'showExcerpt',
          type: 'checkbox',
          defaultValue: true,
          label: 'Tampilkan Ringkasan',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Baca Artikel',
      label: 'Teks Tautan Artikel',
    },
    ...blockSettingsFields,
  ],
}
