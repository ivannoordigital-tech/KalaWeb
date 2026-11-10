import type { Block } from 'payload';
import { commonStyleFields } from '../commonStyleFields';

export const TextBlock: Block = {
  slug: 'text',
  labels: { singular: 'Widget: Paragraf', plural: 'Widget: Paragraf' },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      defaultValue: 'Tulis paragraf penjelasan di sini.',
      label: 'Isi Paragraf',
      admin: { placeholder: 'Gunakan enter untuk memisahkan paragraf.' },
    },
    {
      name: 'textSize',
      type: 'select',
      defaultValue: 'base',
      label: 'Ukuran Teks',
      options: [
        { label: 'Kecil', value: 'sm' },
        { label: 'Normal', value: 'base' },
        { label: 'Besar', value: 'lg' },
      ],
    },
    ...commonStyleFields,
  ],
};
