import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const DividerBlock: Block = {
  slug: 'divider',
  labels: {
    singular: 'Pemisah / Jarak (Divider & Spacer)',
    plural: 'Pemisah / Jarak (Divider & Spacer)',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'line',
      label: 'Jenis Pemisah',
      options: [
        { label: 'Garis Tipis', value: 'line' },
        { label: 'Titik-titik', value: 'dots' },
        { label: 'Ruang Kosong Saja (Spacer)', value: 'space' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'spacing',
          type: 'select',
          defaultValue: 'md',
          label: 'Tinggi Jarak',
          admin: { width: '50%' },
          options: [
            { label: 'Rapat', value: 'sm' },
            { label: 'Normal', value: 'md' },
            { label: 'Longgar', value: 'lg' },
            { label: 'Sangat Longgar', value: 'xl' },
          ],
        },
        {
          name: 'width',
          type: 'select',
          defaultValue: 'normal',
          label: 'Lebar Garis',
          admin: { width: '50%', condition: (data: any) => data?.variant !== 'space' },
          options: [
            { label: 'Sempit', value: 'narrow' },
            { label: 'Normal', value: 'normal' },
            { label: 'Penuh', value: 'full' },
          ],
        },
      ],
    },
    ...blockSettingsFields,
  ],
}
