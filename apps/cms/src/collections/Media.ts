import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { getUserRole } from '../access/roles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Pustaka Media',
  },
  admin: {
    group: 'Konten & Blog',
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'filesize', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => {
      const role = getUserRole(user);
      return role === 'superadmin' || role === 'operator';
    },
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    mimeTypes: ['image/*'],
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
      label: 'Teks Alternatif (Alt Text Wajib untuk Aksesibilitas & SEO)',
      admin: {
        description: 'Jelaskan isi visual gambar kepada pengguna tunanetra dan perayap Google. Contoh: Bidan mengoleskan minyak pijat food-grade pada punggung bayi.',
        placeholder: 'Deskripsi gambar untuk Google...',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Keterangan Gambar (Caption Opsional)',
      admin: {
        description: 'Keterangan singkat yang tampil di bawah foto jika ditampilkan di artikel.',
      },
    },
  ],
}
