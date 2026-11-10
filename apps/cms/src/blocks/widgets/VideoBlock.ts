import type { Block } from 'payload';
import { commonStyleFields } from '../commonStyleFields';

export const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Widget: Video', plural: 'Widget: Video' },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'URL Video (YouTube / Vimeo)',
      admin: { placeholder: 'https://www.youtube.com/watch?v=...' },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Keterangan Video (Opsional)',
    },
    {
      name: 'ratio',
      type: 'select',
      defaultValue: 'video',
      label: 'Rasio Video',
      options: [
        { label: '16:9 (Lanskap)', value: 'video' },
        { label: '9:16 (Vertikal)', value: 'vertical' },
        { label: '1:1 (Persegi)', value: 'square' },
      ],
    },
    ...commonStyleFields,
  ],
};
