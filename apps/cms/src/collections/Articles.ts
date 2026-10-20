import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'pubDate', 'status'],
  },
  versions: {
    drafts: true,
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
      label: 'Alt Text Foto Sampul',
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
  ],
}
