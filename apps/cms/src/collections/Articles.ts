import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { buildSeoFields } from '../fields/seoFields'
import { canManageArticles, getUserRole } from '../access/roles'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Artikel Edukasi & Blog',
    plural: 'Artikel Edukasi & Blog',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'pubDate', 'status'],
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'midwife_coordinator';
    },
  },
  access: {
    read: () => true,
    create: canManageArticles,
    update: canManageArticles,
    delete: canManageArticles,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => {
        const isNowPublished = doc._status === 'published' || doc.status === 'published';
        const wasPublished = previousDoc?._status === 'published' || previousDoc?.status === 'published';

        if (isNowPublished && !wasPublished) {
          triggerCloudflareDeploy({ resource: 'Articles', action: 'publish', slug: doc.slug });
        } else if (!isNowPublished && wasPublished) {
          triggerCloudflareDeploy({ resource: 'Articles', action: 'unpublish', slug: doc.slug });
        } else if (isNowPublished && wasPublished) {
          triggerCloudflareDeploy({ resource: 'Articles', action: 'publish', slug: doc.slug });
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const wasPublished = doc._status === 'published' || doc.status === 'published';
        if (wasPublished) {
          triggerCloudflareDeploy({ resource: 'Articles', action: 'delete', slug: doc.slug });
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Judul Artikel',
      admin: {
        description: 'Judul artikel yang edukatif dan menenangkan Bunda. Contoh: Cara Mengatasi Bayi Kolik Malam Hari',
        placeholder: 'Cara Mengatasi Bayi Kolik Malam Hari: Panduan Bidan Tenangkan Tangisan Si Kecil',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'bayi',
      options: [
        { label: 'Bayi & Newborn', value: 'bayi' },
        { label: 'Ibu Menyusui & Postpartum', value: 'ibu-menyusui' },
        { label: 'Layanan & Paket Homecare', value: 'layanan' },
        { label: 'Kehamilan & Persiapan Lahir', value: 'kehamilan' },
      ],
      label: 'Kategori Artikel',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'pubDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Tanggal Terbit',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'updatedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Tanggal Pembaruan Terakhir',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'Bidan Annisa, S.Tr.Keb',
      required: true,
      label: 'Nama Penulis (Bidan Ber-STR)',
      admin: {
        position: 'sidebar',
        description: 'Nama tenaga kesehatan resmi yang menyusun artikel.',
      },
    },
    {
      name: 'authorTitle',
      type: 'text',
      defaultValue: 'Bidan Praktisi Homecare Kala',
      required: true,
      label: 'Gelar / Jabatan Penulis',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'medicalReviewer',
      type: 'text',
      defaultValue: 'Tim Medis & Kebidanan Kala Moms and Baby Spa',
      required: true,
      label: 'Peninjau Medis (Medical Reviewer)',
      admin: {
        position: 'sidebar',
        description: 'Otoritas medis yang memvalidasi kebenaran klinis isi artikel.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Ringkasan Deskripsi Artikel',
      admin: {
        description: 'Ringkasan isi artikel (1–2 paragraf) untuk pembuka dan cuplikan kartu blog.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Sampul Utama (Hero Image)',
      admin: {
        description: 'Unggah foto resmi bidan / perawatan bayi (format WebP/JPG/PNG).',
      },
    },
    {
      name: 'heroImageUrlFallback',
      type: 'text',
      label: 'URL Gambar Sampul Fallback (Opsional)',
      admin: {
        description: 'URL gambar cadangan jika tidak mengunggah file media (misal: /images/blog/bayi-kolik.svg).',
      },
    },
    {
      name: 'heroImageAlt',
      type: 'text',
      required: true,
      label: 'Alt Text Foto Sampul (Wajib untuk Aksesibilitas & Google)',
      admin: {
        description: 'Deskripsikan isi visual gambar secara jelas. Contoh: Bidan sedang mengedukasi teknik pijat ILU pada bayi.',
      },
    },
    {
      name: 'keywords',
      type: 'array',
      label: 'Target Kata Kunci SEO',
      admin: {
        description: 'Daftar kata kunci pencarian Google yang relevan dengan artikel ini.',
      },
      fields: [
        {
          name: 'keyword',
          type: 'text',
          required: true,
          label: 'Kata Kunci',
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Isi Konten Artikel Lengkap',
    },
    // Pengaturan Lanjutan (Sidebar)
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL (/blog/[slug])',
      admin: {
        position: 'sidebar',
        description: 'Alamat URL artikel (huruf kecil dan tanda hubung). Contoh: bayi-kolik-malam-hari',
      },
    },
    // Internal Linking & Topic Cluster (Track B5)
    {
      name: 'internalLinking',
      type: 'group',
      label: 'Struktur Internal Linking & Topic Cluster',
      admin: {
        description: 'Hubungkan artikel ini dengan layanan komersial dan artikel lain untuk memperkuat SEO & konversi.',
      },
      fields: [
        {
          name: 'isPillarArticle',
          type: 'checkbox',
          defaultValue: false,
          label: 'Jadikan Sebagai "Artikel Pilar" (Pillar Post)',
          admin: {
            description: 'Centang jika artikel ini adalah panduan komprehensif utama (pillar of content) untuk satu topik besar.',
          },
        },
        {
          name: 'parentPillar',
          type: 'relationship',
          relationTo: 'articles',
          hasMany: false,
          label: 'Artikel Pilar Induk',
          admin: {
            condition: (data, siblingData) => !siblingData?.isPillarArticle,
            description: 'Pilih artikel pilar yang menjadi induk dari artikel pendukung (cluster content) ini.',
          },
        },
        {
          name: 'relatedServices',
          type: 'relationship',
          relationTo: 'services',
          hasMany: true,
          label: 'Layanan Terkait (Konversi CTA)',
          admin: {
            description: 'Sangat disarankan: hubungkan minimal 1 layanan relevan agar Bunda bisa langsung reservasi homecare.',
          },
        },
        {
          name: 'relatedArticles',
          type: 'relationship',
          relationTo: 'articles',
          hasMany: true,
          label: 'Artikel Terkait ("Baca Juga")',
          admin: {
            description: 'Pilih 2-4 artikel edukasi relevan untuk direkomendasikan kepada pembaca.',
          },
        },
        {
          name: 'relatedAreas',
          type: 'relationship',
          relationTo: 'service-areas',
          hasMany: true,
          label: 'Wilayah Layanan Terkait',
          admin: {
            description: 'Hubungkan dengan area jangkauan (misal: Surabaya Timur, Sidoarjo) jika artikel menyinggung lokasi.',
          },
        },
      ],
    },
    // Reusable SEO Fields
    buildSeoFields({ titleSourceField: 'title', descriptionSourceField: 'description' }),
  ],
}
