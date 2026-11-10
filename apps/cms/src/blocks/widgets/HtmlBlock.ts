import type { Block } from 'payload';
import { commonStyleFields } from '../commonStyleFields';

export const HtmlBlock: Block = {
  slug: 'html',
  labels: { singular: 'Widget: Custom HTML / Embed', plural: 'Widget: Custom HTML / Embed' },
  fields: [
    {
      name: 'name',
      type: 'text',
      defaultValue: 'Custom HTML',
      label: 'Nama Blok di Builder',
    },
    {
      name: 'html',
      type: 'code',
      required: true,
      label: 'Kode HTML',
      admin: {
        language: 'html',
        description:
          'Gunakan untuk embed (iframe) atau markup khusus. Script dan <style> dilarang. Class Tailwind baru aktif setelah publish/rebuild.',
      },
    },
    ...commonStyleFields,
  ],
};
