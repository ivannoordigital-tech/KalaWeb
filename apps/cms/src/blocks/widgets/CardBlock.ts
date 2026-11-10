import type { Block } from 'payload';
import { commonStyleFields } from '../commonStyleFields';

export const CardBlock: Block = {
  slug: 'card',
  labels: { singular: 'Widget: Kartu', plural: 'Widget: Kartu' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Kartu (Opsional)',
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text Foto',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Judul Kartu',
      label: 'Judul Kartu',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Deskripsi singkat kartu.',
      label: 'Deskripsi',
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Teks Tombol (Opsional)',
    },
    {
      name: 'buttonUrl',
      type: 'text',
      label: 'URL Tombol (Opsional)',
      admin: { placeholder: '/layanan' },
    },
    ...commonStyleFields,
  ],
};
