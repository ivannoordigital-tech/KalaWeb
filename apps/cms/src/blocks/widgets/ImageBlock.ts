import type { Block } from 'payload';
import { commonStyleFields } from '../commonStyleFields';

export const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: 'Widget: Gambar', plural: 'Widget: Gambar' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Foto',
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text (SEO & Aksesibilitas)',
      admin: { description: 'Deskripsikan isi foto. Contoh: Bidan memijat bayi dengan lembut.' },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Keterangan Foto (Opsional)',
    },
    {
      name: 'ratio',
      type: 'select',
      defaultValue: 'auto',
      label: 'Rasio Foto',
      options: [
        { label: 'Otomatis', value: 'auto' },
        { label: 'Persegi', value: 'square' },
        { label: 'Video (16:9)', value: 'video' },
        { label: 'Portrait (4:5)', value: 'portrait' },
      ],
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link Saat Foto Diklik (Opsional)',
      admin: { placeholder: '/layanan atau https://...' },
    },
    ...commonStyleFields,
  ],
};
