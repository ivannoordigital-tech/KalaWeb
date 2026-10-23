import type { CollectionConfig } from 'payload'
import { isSuperAdmin, getUserRole } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Pengguna & Tim',
    plural: 'Pengguna & Tim',
  },
  admin: {
    group: '⚙️ Pengaturan Website',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    hidden: ({ user }) => getUserRole(user) !== 'superadmin',
  },
  access: {
    create: isSuperAdmin,
    read: ({ req: { user } }) => {
      if (getUserRole(user) === 'superadmin') return true;
      return { id: { equals: user?.id } };
    },
    update: ({ req: { user } }) => {
      if (getUserRole(user) === 'superadmin') return true;
      return { id: { equals: user?.id } };
    },
    delete: isSuperAdmin,
  },
  auth: {
    useAPIKey: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Lengkap Pengguna',
      admin: {
        placeholder: 'Contoh: Bidan Annisa, S.Tr.Keb',
      },
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'operator',
      options: [
        { label: 'Super Admin (Akses Penuh)', value: 'superadmin' },
        { label: 'Admin Operasional (Layanan, Area, Banner, FAQ)', value: 'operator' },
        { label: 'Penulis Konten (Artikel Edukasi & Media)', value: 'author' },
        { label: 'SEO Specialist (Optimasi Metadata & Redirects)', value: 'seo' },
        { label: 'Koordinator Bidan (Data Tim Bidan & Ulasan)', value: 'midwife_coordinator' },
        { label: 'Marketing Specialist (Landing Pages, Pages & Templates)', value: 'marketing' },
      ],
      required: true,
      label: 'Peran & Hak Akses (Role)',
      admin: {
        description: 'Menentukan menu apa saja yang dapat dilihat dan diedit oleh pengguna ini di dashboard.',
      },
    },
  ],
}
