import type { Block } from 'payload';
import { commonStyleFields } from '../commonStyleFields';

export const IconBoxBlock: Block = {
  slug: 'iconBox',
  labels: { singular: 'Widget: Ikon + Teks', plural: 'Widget: Ikon + Teks' },
  fields: [
    {
      name: 'icon',
      type: 'text',
      defaultValue: '✓',
      label: 'Emoji / Ikon',
      admin: { placeholder: 'Contoh: ✓, 🧸, ✨, 🤍' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Judul Keunggulan',
      label: 'Judul',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Jelaskan manfaat atau keunggulan ini secara singkat.',
      label: 'Deskripsi',
    },
    ...commonStyleFields,
  ],
};
