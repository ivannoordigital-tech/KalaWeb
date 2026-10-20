import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { buildSeoFields } from '../fields/seoFields'
import { canManagePagesAndLPs, getUserRole } from '../access/roles'
import { allBlocks } from '../blocks'
import { validatePageBuilderDoc } from '../utilities/pageBuilderValidators'

const RESERVED_SLUGS = [
  'admin',
  'api',
  'layanan',
  'area',
  'bidan',
  'blog',
  'lp',
  'segera-hadir',
  'tentang-kami',
  'kebijakan-privasi',
  'tim-bidan',
  '404',
  'rss.xml',
  'sitemap.xml',
  'sitemap-index.xml',
]

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Halaman Kustom (Page)',
    plural: 'Halaman Kustom (Pages)',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt', '_status'],
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'author' || role === 'midwife_coordinator';
    },
    preview: (doc) => {
      if (doc?.slug) {
        return `http://localhost:4321/preview/${doc.slug}`;
      }
      return null;
    },
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
  hooks: {
    beforeOperation: [
      ({ args, operation }) => {
        if (operation === 'create' && (args as any)?.duplicateFromID) {
          if (args.data) {
            if (args.data.title) {
              args.data.title = `${args.data.title} (Salinan Duplikat)`;
            }
            args.data.slug = '';
            args.data._status = 'draft';
          }
        }
        return args;
      },
    ],
    beforeChange: [
      async ({ data }) => {
        const { isValid, errors, warnings } = validatePageBuilderDoc(data, false);
        if (!isValid) {
          throw new Error(`[Validasi Publikasi Gagal]:\n• ${errors.join('\n• ')}`);
        }
        if (warnings.length > 0) {
          console.warn('[Pages Validation Warnings]:', warnings);
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc }) => {
        const isNowPublished = doc._status === 'published';
        const wasPublished = previousDoc?._status === 'published';

        if (isNowPublished && !wasPublished) {
          triggerCloudflareDeploy({ resource: 'Pages', action: 'publish', slug: doc.slug });
        } else if (!isNowPublished && wasPublished) {
          triggerCloudflareDeploy({ resource: 'Pages', action: 'unpublish', slug: doc.slug });
        } else if (isNowPublished && wasPublished) {
          triggerCloudflareDeploy({ resource: 'Pages', action: 'publish', slug: doc.slug });
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        if (doc._status === 'published') {
          triggerCloudflareDeploy({ resource: 'Pages', action: 'delete', slug: doc.slug });
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Judul Halaman',
      admin: {
        description: 'Judul utama halaman yang tampil di bagian atas. Contoh: Syarat dan Ketentuan Layanan',
        placeholder: 'Syarat dan Ketentuan Layanan Homecare Kala',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL (kalababyspa.com/[slug])',
      admin: {
        position: 'sidebar',
        description: 'Alamat URL halaman (huruf kecil dan tanda hubung). Contoh: syarat-ketentuan',
        placeholder: 'syarat-ketentuan',
      },
      validate: (val: any) => {
        if (!val) return 'Slug URL wajib diisi.'
        const cleanSlug = String(val).toLowerCase().trim()
        if (RESERVED_SLUGS.includes(cleanSlug)) {
          return `Slug "${cleanSlug}" sudah dipakai oleh sistem web. Silakan gunakan nama slug lain.`
        }
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) {
          return 'Slug hanya boleh menggunakan huruf kecil, angka, dan tanda hubung (-).'
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Ringkasan Deskripsi Halaman (Opsional)',
      admin: {
        description: 'Penjelasan singkat isi halaman untuk pembuka dan cuplikan mesin pencari.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto / Banner Utama Halaman (Opsional)',
      admin: {
        description: 'Unggah foto banner atas halaman (format WebP/JPG/PNG).',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Isi Konten Halaman Lengkap',
      admin: {
        description: 'Tulis isi halaman bebas: judul bab (H2/H3), teks paragraf, poin daftar, kutipan, dan link.',
      },
    },
    // 🧱 Flexible Block-Based Page Builder
    {
      name: 'layout',
      type: 'blocks',
      label: '🧱 Susunan Blok Halaman (Drag & Drop Page Builder)',
      admin: {
        description: 'Gunakan blok ini untuk menyusun seksi halaman secara visual (Hero, Masalah, Solusi, Paket Harga, Komparasi, FAQ, dll.). Jika diisi, susunan blok ini akan diprioritaskan tampil.',
      },
      blocks: allBlocks,
    },
    // Pengaturan CTA WhatsApp
    {
      name: 'showWhatsAppCta',
      type: 'checkbox',
      defaultValue: true,
      label: 'Tampilkan Kotak Banner Konsultasi WhatsApp di Bawah Halaman',
      admin: {
        position: 'sidebar',
        description: 'Centang jika ingin menyertakan tombol WhatsApp resmi di bagian akhir halaman.',
      },
    },
    {
      name: 'whatsappCustomMessage',
      type: 'text',
      label: 'Pesan Kustom WhatsApp (Opsional)',
      admin: {
        position: 'sidebar',
        description: 'Teks pesan otomatis saat tombol WA ditekan. Contoh: Halo Bidan Kala, saya mau tanya soal kemitraan',
      },
    },
    // Reusable SEO Fields
    buildSeoFields({ titleSourceField: 'title', descriptionSourceField: 'description' }),
  ],
}
