import type { Block } from 'payload';
import { commonStyleFields } from '../commonStyleFields';

export const SpacerBlock: Block = {
  slug: 'spacer',
  labels: { singular: 'Widget: Jarak (Spacer)', plural: 'Widget: Jarak (Spacer)' },
  fields: [
    {
      name: 'height',
      type: 'select',
      defaultValue: 'md',
      label: 'Tinggi Jarak',
      options: [
        { label: 'Kecil (1rem)', value: 'sm' },
        { label: 'Sedang (2rem)', value: 'md' },
        { label: 'Besar (4rem)', value: 'lg' },
        { label: 'Sangat Besar (6rem)', value: 'xl' },
      ],
    },
    ...commonStyleFields,
  ],
};
