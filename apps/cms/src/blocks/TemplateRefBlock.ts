import type { Block } from 'payload'

export const TemplateRefBlock: Block = {
  slug: 'templateRef',
  labels: {
    singular: '📦 Sisipkan Template Tersimpan (Pustaka Template)',
    plural: '📦 Sisipkan Template Tersimpan (Pustaka Template)',
  },
  fields: [
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'block-templates',
      required: true,
      label: 'Pilih Template dari Pustaka',
      admin: {
        description: 'Pilih salah satu template susunan blok yang telah dibuat dan disimpan di menu Pustaka Template Blok.',
      },
    },
  ],
}
