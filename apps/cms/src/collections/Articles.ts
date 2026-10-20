import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'pubDate', 'status'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        const isNowPublished = doc._status === 'published' || doc.status === 'published';
        const wasPublished = previousDoc?._status === 'published' || previousDoc?.status === 'published';

        if (isNowPublished && !wasPublished) {
          // 1. Dokumen baru diterbitkan (Draft -> Published)
          triggerCloudflareDeploy({ resource: 'Articles', action: 'publish', slug: doc.slug });
        } else if (!isNowPublished && wasPublished) {
          // 2. Dokumen ditarik / unpublish (Published -> Draft)
          triggerCloudflareDeploy({ resource: 'Articles', action: 'unpublish', slug: doc.slug });
        } else if (isNowPublished && wasPublished) {
          // 3. Pembaruan konten pada dokumen yang sudah published
          triggerCloudflareDeploy({ resource: 'Articles', action: 'publish', slug: doc.slug });
        }
        // Abaikan perubahan antar draft / autosave
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
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL (contoh: cara-mengatasi-bayi-kolik)',
      admin: {
        position: 'sidebar',
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
      label: 'Tanggal Pembaruan',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'Bidan Annisa, S.Tr.Keb',
      required: true,
      label: 'Nama Penulis (Bidan)',
      admin: {
        position: 'sidebar',
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
      label: 'Reviewer Medis (Otoritas Kesehatan)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Ringkasan Deskripsi (Meta Description untuk Google & Snippet)',
      admin: {
        description: 'Ideal 130–155 karakter. Muncul di bawah judul artikel di hasil pencarian Google.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Sampul Utama (Hero Image)',
    },
    {
      name: 'heroImageUrlFallback',
      type: 'text',
      label: 'URL Gambar Sampul Fallback (opsional jika foto lokal svg)',
    },
    {
      name: 'heroImageAlt',
      type: 'text',
      required: true,
      label: 'Alt Text Foto Sampul (Wajib untuk Aksesibilitas & SEO)',
      admin: {
        description: 'Deskripsikan isi gambar secara ringkas dan informatif (wajib)',
      },
    },
    {
      name: 'keywords',
      type: 'array',
      label: 'Target Kata Kunci SEO',
      fields: [
        {
          name: 'keyword',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Isi Konten Artikel',
    },
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO & Open Graph (Pengaturan Mesin Pencari)',
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title (Judul di Google, maks 60 karakter)',
          admin: { description: 'Kosongkan = pakai judul artikel otomatis' },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG Image (Thumbnail saat dibagikan ke WA/FB/IG)',
          admin: { description: 'Ideal: 1200×630px. Kosongkan = pakai hero image' },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          defaultValue: false,
          label: 'Sembunyikan dari Google (no-index)',
          admin: { description: 'Centang HANYA untuk halaman promo iklan khusus' },
        },
        {
          name: 'canonicalUrl',
          type: 'text',
          label: 'Canonical URL (opsional — jika konten ada di tempat lain juga)',
        },
      ],
    },
  ],
}
