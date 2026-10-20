import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { canManageFAQ, getUserRole } from '../access/roles'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  labels: {
    singular: 'Tanya Jawab (FAQ)',
    plural: 'Tanya Jawab (FAQ)',
  },
  admin: {
    group: '🏥 Data Layanan & Klinik',
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', 'active'],
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'author' || role === 'midwife_coordinator';
    },
  },
  access: {
    read: () => true,
    create: canManageFAQ,
    update: canManageFAQ,
    delete: canManageFAQ,
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
      admin: {
        description: 'Pertanyaan yang kerap ditanyakan orang tua seputar perawatan bayi dan ibu.',
        placeholder: 'Contoh: Berapa usia minimal bayi boleh dipijat?',
      },
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      label: 'Jawaban Penjelasan Medis / Operasional',
      admin: {
        description: 'Jawaban berbasis ilmu kebidanan yang menenangkan dan mudah dipahami.',
      },
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
      label: 'Kategori Topik Pertanyaan',
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Terkait Layanan Tertentu (Opsional)',
      admin: {
        description: 'Jika dipilih, FAQ ini akan otomatis tampil di halaman detail layanan tersebut.',
      },
    },
    {
      name: 'relatedAreas',
      type: 'relationship',
      relationTo: 'service-areas',
      hasMany: true,
      label: 'Terkait Wilayah Tertentu (Opsional)',
      admin: {
        description: 'Jika dipilih, FAQ ini akan otomatis tampil di halaman wilayah tersebut.',
      },
    },
    // Sidebar
    {
      name: 'order',
      type: 'number',
      defaultValue: 1,
      label: 'Urutan Tampil (Angka kecil di atas)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Status Aktif (Tampil di Website)',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
