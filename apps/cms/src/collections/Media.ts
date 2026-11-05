import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { getUserRole } from '../access/roles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * MED-005: Pustaka Media Terpusat (Media Library)
 * Dilengkapi dengan kategori folder, pencarian tag, crop & focal point, serta dukungan PDF.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Pustaka Media',
  },
  admin: {
    group: 'Konten & Blog',
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'folder', 'filename', 'filesize', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => {
      const role = getUserRole(user)
      return role === 'superadmin' || role === 'operator'
    },
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    mimeTypes: ['image/*', 'application/pdf'],
    focalPoint: true,
    crop: true,
    adminThumbnail: 'thumbnail',
    formatOptions: {
      format: 'webp',
      options: {
        quality: 85,
      },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
      {
        name: 'hero',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 85,
          },
        },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Teks Alternatif (Alt Text — Wajib Aksesibilitas & SEO)',
      admin: {
        description:
          'Wajib diisi untuk aksesibilitas pembaca layar dan perayap Google Images. Jelaskan apa yang terlihat di gambar.',
        placeholder: 'Contoh: Bidan Annisa memijat lembut bayi newborn di atas matras klinik...',
      },
    },
    {
      name: 'folder',
      type: 'select',
      defaultValue: 'general',
      label: 'Kategori Folder Media',
      admin: {
        position: 'sidebar',
        description: 'Kelompokkan aset untuk memudahkan pencarian tim konten.',
      },
      options: [
        { label: '👶 Foto Bayi & Newborn', value: 'baby-newborn' },
        { label: '🤰 Bunda & Laktasi', value: 'moms-lactation' },
        { label: '👩‍⚕️ Tim Bidan & Klinik', value: 'midwives-clinic' },
        { label: '📄 Dokumen & Brosur (PDF)', value: 'documents' },
        { label: '🏷️ Banner & Promosi', value: 'banners-promo' },
        { label: '📁 Umum / Lainnya', value: 'general' },
      ],
    },
    {
      name: 'tags',
      type: 'text',
      label: 'Tag / Kata Kunci Pencarian',
      admin: {
        position: 'sidebar',
        description: 'Pisahkan dengan koma (contoh: kolik, pijat, homecare, surabaya)',
        placeholder: 'kolik, pijat, newborn',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Keterangan Gambar (Caption Opsional)',
      admin: {
        description: 'Keterangan singkat yang tampil di bawah foto jika disematkan dalam artikel.',
      },
    },
  ],
}
