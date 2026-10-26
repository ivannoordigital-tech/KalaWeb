import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { buildSeoFields } from '../fields/seoFields'
import { seoScoreField, seoAuditFields } from '../fields/seoAuditFields'
import { articleSeoAdapter, calculateSeoScore } from '../lib/seo-engine'
import { canManageArticles, getUserRole } from '../access/roles'
import { formatSlug } from '../utilities/formatSlug'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Artikel Edukasi',
    plural: 'Artikel Edukasi',
  },
  admin: {
    group: 'Konten & Blog',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'seoScore', 'pubDate', '_status'],
    hidden: ({ user }) => {
      const role = getUserRole(user)
      return role === 'midwife_coordinator'
    },
    preview: (doc) => {
      if (doc?.slug) {
        const baseUrl = process.env.PREVIEW_BASE_URL || 'http://localhost:4321'
        return `${baseUrl}/blog/${doc.slug}/`
      }
      return null
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
    beforeValidate: [
      ({ data }) => {
        // Otomatis buat slug dari judul jika masih kosong
        if (data && !data.slug && data.title) {
          data.slug = formatSlug(data.title)
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, req, operation }) => {
        // Otomatis perbarui tanggal pembaruan saat dokumen diubah
        if (operation === 'update') {
          data.updatedDate = new Date().toISOString()
        }

        try {
          const normalized = articleSeoAdapter(data)
          const audit = calculateSeoScore(normalized)
          data.seoScore = audit.score
          data.seoAudit = {
            score: audit.score,
            grade: audit.grade,
            issues: audit.issues,
            lastAuditedAt: new Date().toISOString(),
          }
        } catch (err) {
          req.payload.logger.error({ err }, 'Error auditing SEO for article')
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc }) => {
        const isNowPublished = doc._status === 'published' || doc.status === 'published'
        const wasPublished = previousDoc?._status === 'published' || previousDoc?.status === 'published'

        if (isNowPublished && !wasPublished) {
          triggerCloudflareDeploy({ resource: 'Articles', action: 'publish', slug: doc.slug })
        } else if (!isNowPublished && wasPublished) {
          triggerCloudflareDeploy({ resource: 'Articles', action: 'unpublish', slug: doc.slug })
        } else if (isNowPublished && wasPublished) {
          triggerCloudflareDeploy({ resource: 'Articles', action: 'publish', slug: doc.slug })
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const wasPublished = doc._status === 'published' || doc.status === 'published'
        if (wasPublished) {
          triggerCloudflareDeploy({ resource: 'Articles', action: 'delete', slug: doc.slug })
        }
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Konten Artikel',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Judul Artikel',
              admin: {
                description: 'Judul artikel yang edukatif dan menenangkan Bunda.',
                placeholder: 'Cara Mengatasi Bayi Kolik Malam Hari: Panduan Bidan Tenangkan Tangisan Si Kecil',
              },
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Isi Konten Artikel Lengkap',
              admin: {
                description: 'Editor teks lengkap artikel. Tekan "/" untuk menyisipkan subjudul (H2/H3), daftar poin, kutipan, atau gambar.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Ringkasan Deskripsi Artikel',
              admin: {
                description: 'Ringkasan isi artikel (1–2 paragraf) untuk pembuka dan cuplikan kartu blog.',
                placeholder: 'Tulis ringkasan singkat artikel di sini...',
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
              name: 'heroImageAlt',
              type: 'text',
              required: true,
              label: 'Alt Text Foto Sampul (Wajib untuk Aksesibilitas & SEO)',
              admin: {
                description: 'Deskripsikan isi visual gambar secara jelas. Contoh: Bidan sedang mengedukasi teknik pijat ILU pada bayi.',
                placeholder: 'Deskripsikan isi gambar...',
              },
            },
          ],
        },
        {
          label: 'Optimasi SEO',
          fields: [
            buildSeoFields({
              titleSourceField: 'title',
              descriptionSourceField: 'description',
              position: 'main',
            }),
          ],
        },
        {
          label: 'Tautan Internal',
          fields: [
            {
              name: 'internalLinking',
              type: 'group',
              label: 'Struktur Internal Linking & Topic Cluster',
              admin: {
                description: 'Hubungkan artikel ini dengan layanan komersial dan artikel lain untuk memperkuat SEO & konversi reservasi.',
              },
              fields: [
                {
                  name: 'isPillarArticle',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Jadikan Sebagai "Artikel Pilar Induk" (Pillar Post)',
                  admin: {
                    description: 'Centang jika artikel ini adalah panduan komprehensif utama (pillar of content) untuk satu topik besar.',
                  },
                },
                {
                  name: 'parentPillar',
                  type: 'relationship',
                  relationTo: 'articles',
                  hasMany: false,
                  label: 'Artikel Induk Topik',
                  admin: {
                    condition: (data, siblingData) => !siblingData?.isPillarArticle,
                    description: 'Pilih artikel pilar yang menjadi induk dari artikel pendukung ini.',
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
          ],
        },
        {
          label: 'Pengaturan Lanjutan',
          fields: [
            {
              name: 'author',
              type: 'text',
              defaultValue: 'Bidan Annisa, S.Tr.Keb',
              required: true,
              label: 'Nama Penulis (Bidan Ber-STR)',
              admin: {
                description: 'Nama tenaga kesehatan resmi yang menyusun artikel.',
              },
            },
            {
              name: 'authorTitle',
              type: 'text',
              defaultValue: 'Bidan Praktisi Homecare Kala',
              required: true,
              label: 'Gelar / Jabatan Penulis',
            },
            {
              name: 'medicalReviewer',
              type: 'text',
              defaultValue: 'Tim Medis & Kebidanan Kala Moms and Baby Spa',
              required: true,
              label: 'Peninjau Medis (Medical Reviewer)',
              admin: {
                description: 'Otoritas medis yang memvalidasi kebenaran klinis isi artikel.',
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
              name: 'keywords',
              type: 'array',
              label: 'Target Kata Kunci Tambahan',
              admin: {
                description: 'Daftar variasi kata kunci sekunder untuk pengayaan semantik konten.',
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
              name: 'pubDate',
              type: 'date',
              required: true,
              defaultValue: () => new Date().toISOString(),
              label: 'Tanggal Terbit',
            },
            {
              name: 'updatedDate',
              type: 'date',
              required: true,
              defaultValue: () => new Date().toISOString(),
              label: 'Tanggal Pembaruan Terakhir',
              admin: {
                description: 'Otomatis diperbarui setiap kali artikel disimpan.',
              },
            },
          ],
        },
      ],
    },
    // Sidebar fields (Selalu terlihat di sisi kanan saat mengedit tab apapun)
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL (/blog/[slug])',
      admin: {
        position: 'sidebar',
        description: 'Alamat URL artikel (otomatis terisi dari judul jika kosong).',
        placeholder: 'cara-mengatasi-bayi-kolik',
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
    seoScoreField,
    seoAuditFields,
  ],
}
