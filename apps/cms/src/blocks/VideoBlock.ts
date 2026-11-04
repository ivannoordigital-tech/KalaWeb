import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const VideoBlock: Block = {
  slug: 'video',
  labels: {
    singular: 'Video (YouTube / Vimeo)',
    plural: 'Video (YouTube / Vimeo)',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'URL Video',
      admin: {
        placeholder: 'https://www.youtube.com/watch?v=xxxxxxxxxxx',
        description:
          'Tempel tautan YouTube, Vimeo, atau Shorts. Video akan diputar di dalam halaman (tanpa keluar situs).',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Judul Video (Opsional)',
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Keterangan di Bawah Video (Opsional)',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ratio',
          type: 'select',
          defaultValue: '16:9',
          label: 'Rasio Video',
          admin: { width: '50%' },
          options: [
            { label: '16:9 (Lanskap)', value: '16:9' },
            { label: '9:16 (Vertikal / Reels)', value: '9:16' },
            { label: '4:3', value: '4:3' },
            { label: '1:1 (Persegi)', value: '1:1' },
          ],
        },
        {
          name: 'maxWidth',
          type: 'select',
          defaultValue: 'normal',
          label: 'Lebar Maksimal',
          admin: { width: '50%' },
          options: [
            { label: 'Sempit (640px)', value: 'narrow' },
            { label: 'Normal (896px)', value: 'normal' },
            { label: 'Lebar (1152px)', value: 'wide' },
          ],
        },
      ],
    },
    ...blockSettingsFields,
  ],
}
