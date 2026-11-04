import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const TabsBlock: Block = {
  slug: 'tabs',
  labels: {
    singular: 'Tab Konten (Tabs)',
    plural: 'Tab Konten (Tabs)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Judul Seksi (Opsional)',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subjudul (Opsional)',
    },
    {
      name: 'tabs',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      label: 'Daftar Tab',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Nama Tab',
          admin: { placeholder: 'Manfaat untuk Bayi' },
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          label: 'Isi Tab',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'pills',
          label: 'Gaya Tab',
          admin: { width: '50%' },
          options: [
            { label: 'Tombol Bulat (Pills)', value: 'pills' },
            { label: 'Garis Bawah (Underline)', value: 'underline' },
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
    ...blockSettingsFields,
  ],
}
