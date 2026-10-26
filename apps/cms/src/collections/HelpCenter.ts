import type { CollectionConfig } from 'payload'
import { getUserRole } from '../access/roles'

export const HelpCenter: CollectionConfig = {
  slug: 'help-center',
  labels: {
    singular: 'Panduan SOP',
    plural: 'Pusat Bantuan Admin',
  },
  admin: {
    group: 'Pengaturan & Bantuan',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order', 'updatedAt'],
    description: 'Pusat panduan kerja operasional admin KalaWeb. Baca panduan di bawah ini untuk mempelajari cara membuat landing page, etika bahasa iklan kesehatan, dan format foto.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      const role = getUserRole(user);
      return role === 'superadmin' || role === 'operator' || role === 'marketing';
    },
    update: ({ req: { user } }) => {
      const role = getUserRole(user);
      return role === 'superadmin' || role === 'operator' || role === 'marketing';
    },
    delete: ({ req: { user } }) => {
      const role = getUserRole(user);
      return role === 'superadmin';
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Judul Panduan',
      admin: {
        placeholder: 'Contoh: Tutorial 3 Menit: Membuat Landing Page Baru dari Template',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'panduan-lp',
      label: 'Kategori Panduan',
      options: [
        { label: '🚀 Pembuatan Landing Page', value: 'panduan-lp' },
        { label: '⚖️ Regulasi & Etika Bahasa Medis', value: 'etika-iklan-medis' },
        { label: '📸 Panduan Foto & Media', value: 'standar-foto-media' },
        { label: '💬 Pelacakan & WhatsApp Ref Code', value: 'pelacakan-wa' },
        { label: '❓ FAQ & Solusi Kendala', value: 'faq-kendala' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 1,
      label: 'Nomor Urut Tampil',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      label: 'Ringkasan Cepat (Takeaway 10 Detik)',
      admin: {
        placeholder: 'Poin penting yang harus diingat admin sebelum memulai...',
      },
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Langkah Kerja Mandiri',
      fields: [
        {
          name: 'stepNumber',
          type: 'text',
          label: 'Nomor / Urutan',
          defaultValue: '1',
          admin: { width: '20%' },
        },
        {
          name: 'stepTitle',
          type: 'text',
          required: true,
          label: 'Aktivitas yang Dilakukan',
          admin: { width: '80%' },
        },
        {
          name: 'stepDetail',
          type: 'textarea',
          required: true,
          label: 'Penjelasan Praktis & Contoh',
        },
      ],
    },
    {
      name: 'dosAndDonts',
      type: 'group',
      label: 'Aturan Boleh vs Tidak Boleh (Do\'s & Don\'ts)',
      fields: [
        {
          name: 'dos',
          type: 'array',
          label: '✅ Hal yang Dianjurkan (Do)',
          fields: [
            {
              name: 'item',
              type: 'text',
              required: true,
              label: 'Poin Anjuran',
            },
          ],
        },
        {
          name: 'donts',
          type: 'array',
          label: '❌ Hal yang Dilarang (Don\'t)',
          fields: [
            {
              name: 'item',
              type: 'text',
              required: true,
              label: 'Poin Larangan',
            },
          ],
        },
      ],
    },
  ],
}
