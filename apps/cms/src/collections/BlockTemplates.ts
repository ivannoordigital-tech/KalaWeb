import type { CollectionConfig } from 'payload'
import { canManagePagesAndLPs, getUserRole } from '../access/roles'
import { baseBlocks } from '../blocks'

export const BlockTemplates: CollectionConfig = {
  slug: 'block-templates',
  labels: {
    singular: 'Template Blok Tersimpan',
    plural: '📁 Pustaka Template Blok',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'category', 'updatedAt'],
    hidden: ({ user }) => {
      const role = getUserRole(user)
      return role === 'author' || role === 'midwife_coordinator'
    },
    description: 'Pustaka template susunan blok yang dapat disimpan dan dipakai berulang kali di halaman mana pun tanpa perlu menyusun dari nol.',
  },
  access: {
    read: () => true,
    create: canManagePagesAndLPs,
    update: canManagePagesAndLPs,
    delete: canManagePagesAndLPs,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Template Blok',
      admin: {
        placeholder: 'Contoh: Template Galeri Foto Tipe A + Promo WA',
        description: 'Beri nama template yang mudah dikenali oleh tim admin Anda.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'ID Unik / Slug Template',
      admin: {
        position: 'sidebar',
        placeholder: 'template-galeri-tipe-a',
        description: 'Huruf kecil dan tanda hubung (-).',
      },
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'promo',
      options: [
        { label: '🔥 Promo & Penjualan (Sales)', value: 'promo' },
        { label: '🖼️ Galeri & Dokumentasi', value: 'galeri' },
        { label: '📚 Edukasi & Informasi', value: 'edukasi' },
        { label: '⭐ Social Proof & Testimoni', value: 'review' },
        { label: '📦 Umum / Serbaguna', value: 'umum' },
      ],
      label: 'Kategori Template',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Keterangan Fungsi Template (Opsional)',
      admin: {
        placeholder: 'Template ini cocok untuk kampanye kilat weekend yang butuh galeri foto dan langsung tombol booking WhatsApp.',
      },
    },
    // 🧱 Susunan Blok di dalam Template
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      label: '🧱 Susunan Blok di dalam Template Ini',
      admin: {
        description: 'Susun blok-blok yang ingin Anda jadikan template master (misal: Galeri + Testimoni + CTA). Blok yang Anda simpan di sini akan bisa disisipkan ke halaman mana pun.',
      },
      blocks: baseBlocks,
    },
  ],
}
