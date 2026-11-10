import type { Block } from 'payload';
import { commonStyleFields } from '../commonStyleFields';

export const HeadingBlock: Block = {
  slug: 'heading',
  labels: { singular: 'Widget: Judul', plural: 'Widget: Judul' },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      defaultValue: 'Judul Baru',
      label: 'Teks Judul',
      admin: { placeholder: 'Contoh: Perawatan Nyaman untuk Bunda & Si Kecil' },
    },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'h2',
      label: 'Level Heading (SEO)',
      options: [
        { label: 'H1 — Judul Utama (maks. 1 per halaman)', value: 'h1' },
        { label: 'H2 — Judul Seksi', value: 'h2' },
        { label: 'H3 — Sub-seksi', value: 'h3' },
        { label: 'H4 — Sub-sub-seksi', value: 'h4' },
      ],
    },
    ...commonStyleFields,
  ],
};
