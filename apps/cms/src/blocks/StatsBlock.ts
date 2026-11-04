import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const StatsBlock: Block = {
  slug: 'stats',
  labels: {
    singular: 'Angka Pencapaian (Stats & Counter)',
    plural: 'Angka Pencapaian (Stats & Counter)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Judul Seksi (Opsional)',
      admin: { placeholder: 'Dipercaya Ribuan Orang Tua' },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subjudul (Opsional)',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      label: 'Daftar Angka',
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Angka / Nilai',
          admin: { placeholder: '1.000+' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Keterangan Angka',
          admin: { placeholder: 'Keluarga terlayani' },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Ikon Emoji (Opsional)',
          admin: { placeholder: '👶' },
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      label: 'Jumlah Kolom',
      options: [
        { label: '2 Kolom', value: '2' },
        { label: '3 Kolom', value: '3' },
        { label: '4 Kolom', value: '4' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'background',
          type: 'select',
          defaultValue: 'cream',
          label: 'Latar Belakang',
          admin: { width: '50%' },
          options: [
            { label: 'Putih', value: 'white' },
            { label: 'Krem', value: 'cream' },
            { label: 'Peach', value: 'peach' },
          ],
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'plain',
          label: 'Gaya Tampilan',
          admin: { width: '50%' },
          options: [
            { label: 'Polos', value: 'plain' },
            { label: 'Kartu', value: 'card' },
          ],
        },
      ],
    },
    ...blockSettingsFields,
  ],
}
