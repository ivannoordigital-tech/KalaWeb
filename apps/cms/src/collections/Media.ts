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
      const role = getUserRole(user)
      return role === 'superadmin' || role === 'operator'
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
      label: 'Teks Alternatif (Alt Text — Wajib)',
      admin: {
        description:
          'Wajib diisi untuk aksesibilitas pembaca layar dan perayap Google Images. Jelaskan apa yang terlihat di gambar.',
        placeholder: 'Contoh: Bidan Annisa memijat lembut bayi newborn di atas matras klinik...',
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
