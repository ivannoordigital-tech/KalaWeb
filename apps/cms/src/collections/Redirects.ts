import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { canManageSiteSettings, getUserRole } from '../access/roles'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: {
    singular: 'Peralihan URL (Redirect)',
    plural: 'Manajemen Redirects',
  },
  admin: {
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'type', 'active'],
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'author' || role === 'midwife_coordinator';
    },
  },
  access: {
    read: () => true,
    create: canManageSiteSettings,
    update: canManageSiteSettings,
    delete: canManageSiteSettings,
  },
  hooks: {
    afterChange: [
      async () => {
        triggerCloudflareDeploy({ resource: 'Redirects', action: 'update_settings' });
      },
    ],
    afterDelete: [
      async () => {
        triggerCloudflareDeploy({ resource: 'Redirects', action: 'delete' });
      },
    ],
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      label: 'URL Asal (Path Lama)',
      admin: {
        description: 'URL lama yang ingin dialihkan. Contoh: /promo-selapan atau /layanan-lama',
        placeholder: '/promo-lama',
      },
      validate: (val: any, { siblingData }: any) => {
        if (!val) return 'URL asal wajib diisi.';
        if (!val.startsWith('/')) return 'URL asal wajib diawali dengan garis miring (/)';
        if (siblingData?.to && val === siblingData.to) {
          return 'Terjadi redirect loop! URL asal dan URL tujuan tidak boleh sama.';
        }
        return true;
      },
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      label: 'URL Tujuan (Path Baru)',
      admin: {
        description: 'URL halaman baru tujuan pengalihan. Contoh: /layanan/bundle-selapan',
        placeholder: '/layanan/bundle-selapan',
      },
      validate: (val: any, { siblingData }: any) => {
        if (!val) return 'URL tujuan wajib diisi.';
        if (!val.startsWith('/') && !val.startsWith('http')) {
          return 'URL tujuan wajib diawali garis miring (/) atau URL lengkap (https://...)';
        }
        if (siblingData?.from && val === siblingData.from) {
          return 'Terjadi redirect loop! URL asal dan URL tujuan tidak boleh sama.';
        }
        return true;
      },
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: '301',
      required: true,
      options: [
        { label: '301 (Permanen — Sangat disarankan untuk SEO)', value: '301' },
        { label: '302 (Sementara — Hanya untuk masa uji coba promo)', value: '302' },
      ],
      label: 'Tipe Pengalihan HTTP Status Code',
      admin: {
        description: 'Pilih 301 agar Google mentransfer otoritas ranking lama ke URL baru.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Status Aktif (Terapkan di Cloudflare)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'text',
      label: 'Catatan Alasan Pengalihan (Opsional)',
      admin: {
        placeholder: 'Contoh: Migrasi brosur lama Instagram tahun 2025',
      },
    },
  ],
}
