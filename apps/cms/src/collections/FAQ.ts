import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', 'active'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (doc.active) {
          triggerCloudflareDeploy({ resource: 'FAQ', action: 'publish' });
        }
      },
    ],
    afterDelete: [
      async () => {
        triggerCloudflareDeploy({ resource: 'FAQ', action: 'delete' });
      },
    ],
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Pertanyaan Bunda (FAQ)',
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      label: 'Jawaban Penjelasan Medis / Operasional',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'layanan',
      options: [
        { label: 'Prosedur Layanan & Tindakan', value: 'layanan' },
        { label: 'Keamanan Medis & Higienitas Steril', value: 'keamanan-medis' },
        { label: 'Reservasi Homecare & Jadwal', value: 'reservasi-homecare' },
        { label: 'Biaya, Transport & Wilayah', value: 'biaya-wilayah' },
      ],
      label: 'Kategori Pertanyaan',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 1,
      label: 'Urutan Tampil',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif Tampil di Website',
    },
  ],
}
