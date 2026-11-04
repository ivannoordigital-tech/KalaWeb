import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const LogosBlock: Block = {
  slug: 'logos',
  labels: {
    singular: 'Logo Kepercayaan / Partner (Trust Strip)',
    plural: 'Logo Kepercayaan / Partner (Trust Strip)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Judul Seksi (Opsional)',
      admin: { placeholder: 'Dipercaya oleh komunitas & media' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      label: 'Daftar Logo',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'File Logo',
        },
        {
          name: 'imageUrlFallback',
          type: 'text',
          label: 'URL Logo Cadangan (Opsional)',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nama Partner / Media',
          admin: {
            description: 'Dipakai sebagai alt text logo untuk aksesibilitas dan SEO.',
            placeholder: 'Kominfo',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          defaultValue: '4',
          label: 'Jumlah Kolom',
          admin: { width: '50%' },
          options: [
            { label: '3 Kolom', value: '3' },
            { label: '4 Kolom', value: '4' },
            { label: '5 Kolom', value: '5' },
            { label: '6 Kolom', value: '6' },
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
          ],
        },
      ],
    },
    {
      name: 'grayscale',
      type: 'checkbox',
      defaultValue: true,
      label: 'Tampilkan Logo Hitam-Putih (Lebih Kalem)',
    },
    ...blockSettingsFields,
  ],
}
