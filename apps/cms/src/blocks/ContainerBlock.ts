import type { Block, Field } from 'payload';
import { commonStyleFields } from './commonStyleFields';
import { widgetBlocks } from './widgets';

const columnFields: Field[] = [1, 2, 3, 4].map((index) => ({
  name: `column${index}`,
  type: 'blocks',
  label: `Kolom ${index}`,
  blocks: widgetBlocks,
  admin: {
    condition: (_: unknown, siblingData: Record<string, any>) =>
      Number(siblingData?.columns) >= index,
  },
}));

export const ContainerBlock: Block = {
  slug: 'container',
  labels: {
    singular: 'Layout / Container (1–4 Kolom)',
    plural: 'Layout / Container (1–4 Kolom)',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          defaultValue: '2',
          label: 'Jumlah Kolom',
          options: [
            { label: '1 Kolom', value: '1' },
            { label: '2 Kolom', value: '2' },
            { label: '3 Kolom', value: '3' },
            { label: '4 Kolom', value: '4' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'gap',
          type: 'select',
          defaultValue: 'md',
          label: 'Jarak Antar Kolom',
          options: [
            { label: 'Rapat', value: 'sm' },
            { label: 'Normal', value: 'md' },
            { label: 'Longgar', value: 'lg' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'reverseMobile',
      type: 'checkbox',
      defaultValue: false,
      label: 'Balik Urutan Kolom di Mobile',
      admin: {
        description: 'Aktifkan jika kolom kedua sebaiknya tampil lebih dulu di layar HP.',
      },
    },
    ...columnFields,
    ...commonStyleFields,
  ],
};
