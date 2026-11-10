import type { Block } from 'payload';
import { commonStyleFields } from '../commonStyleFields';

export const MapBlock: Block = {
  slug: 'map',
  labels: { singular: 'Widget: Peta Lokasi', plural: 'Widget: Peta Lokasi' },
  fields: [
    {
      name: 'embedUrl',
      type: 'text',
      required: true,
      label: 'URL Embed Google Maps',
      admin: {
        placeholder: 'https://www.google.com/maps/embed?pb=...',
        description: 'Ambil dari Google Maps → Share → Embed a map → salin src iframe.',
      },
    },
    {
      name: 'height',
      type: 'select',
      defaultValue: 'md',
      label: 'Tinggi Peta',
      options: [
        { label: 'Kecil (200px)', value: 'sm' },
        { label: 'Sedang (320px)', value: 'md' },
        { label: 'Besar (480px)', value: 'lg' },
      ],
    },
    ...commonStyleFields,
  ],
};
