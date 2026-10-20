import type { CollectionConfig } from 'payload'
import { canManagePagesAndLPs, getUserRole } from '../access/roles'
import { allBlocks } from '../blocks'

export const PageTemplates: CollectionConfig = {
  slug: 'page-templates',
  labels: {
    singular: 'Template Halaman Utuh',
    plural: '📑 Pustaka Template Halaman',
  },
  admin: {
    group: '📢 Pemasaran & Iklan',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'updatedAt'],
    hidden: ({ user }) => {
      const role = getUserRole(user)
      return role === 'author' || role === 'midwife_coordinator'
    },
    description: 'Pustaka susunan halaman utuh lengkap (Full Page Blueprint). Membuat kampanye baru cukup dimulai dengan menyalin susunan blok dari template ini.',
  },
  access: {
    read: () => true,
    create: canManagePagesAndLPs,
    update: canManagePagesAndLPs,
    delete: canManagePagesAndLPs,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Template Halaman',
      admin: {
        placeholder: 'Contoh: LP Standar Kolik & Perut Kembung',
        description: 'Beri nama template yang mendeskripsikan target audiens kampanye.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug ID Template',
      admin: {
        position: 'sidebar',
        placeholder: 'template-kolik-standar',
      },
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'kolik',
      options: [
        { label: 'Bayi Kolik & Pencernaan', value: 'kolik' },
        { label: 'Bayi Baru Lahir (Newborn)', value: 'newborn' },
        { label: 'Ibu Menyusui & Laktasi', value: 'laktasi' },
        { label: 'Tradisi & Selapanan', value: 'selapanan' },
        { label: 'Promo Spesial / Seasonal', value: 'promo' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Keterangan Penggunaan Template',
      admin: {
        description: 'Kapan tim marketing harus memakai template halaman ini? Panduan singkat bagi tim iklan.',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      label: '🧱 Susunan Blok Halaman Lengkap',
      admin: {
        description: 'Rangkaian blok lengkap dari Hero, Masalah, Solusi, Paket Harga, Testimoni, FAQ, hingga CTA.',
      },
      blocks: allBlocks,
    },
  ],
}
