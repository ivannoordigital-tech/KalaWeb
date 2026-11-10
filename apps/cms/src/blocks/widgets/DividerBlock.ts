import type { Block } from 'payload';
import { commonStyleFields } from '../commonStyleFields';

export const DividerBlock: Block = {
  slug: 'divider',
  labels: { singular: 'Widget: Garis Pemisah', plural: 'Widget: Garis Pemisah' },
  fields: [
    {
      name: 'color',
      type: 'select',
      defaultValue: 'line',
      label: 'Warna Garis',
      options: [
        { label: 'Krem Garis', value: 'line' },
        { label: 'Peach', value: 'peach' },
        { label: 'Terracotta', value: 'accent' },
        { label: 'Putih', value: 'white' },
      ],
    },
    {
      name: 'thickness',
      type: 'select',
      defaultValue: '1',
      label: 'Ketebalan',
      options: [
        { label: 'Tipis (1px)', value: '1' },
        { label: 'Sedang (2px)', value: '2' },
        { label: 'Tebal (4px)', value: '4' },
      ],
    },
    ...commonStyleFields,
  ],
};
