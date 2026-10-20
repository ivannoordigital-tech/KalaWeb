import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Blok Teks Bebas (Rich Text)',
    plural: 'Blok Teks Bebas (Rich Text)',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Isi Konten Teks Bebas',
      admin: {
        description: 'Tulis paragraf, judul, kutipan, dan link secara bebas.',
      },
    },
    {
      name: 'containerWidth',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Ramping (Maksimal 672px - Fokus Baca)', value: 'narrow' },
        { label: 'Standar (Maksimal 896px)', value: 'normal' },
        { label: 'Lebar (Maksimal 1152px)', value: 'wide' },
      ],
      label: 'Lebar Kontainer Teks',
    },
  ],
}
