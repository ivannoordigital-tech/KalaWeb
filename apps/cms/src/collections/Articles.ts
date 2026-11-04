import { APIError, type CollectionConfig } from 'payload'
import { validateArticleDoc } from '../utilities/pageBuilderValidators'
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
      // PRV-001 & PRV-002: Pratinjau draft dan publik artikel edukasi
      if (doc?.slug) {
        const baseUrl = process.env.PREVIEW_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://kalababyspa.com' : 'http://localhost:4321')
        return `${baseUrl}/preview/blog/${doc.slug}/`
      }
      return null
    },
  },
  access: {
    read: ({ req: { user } }) => {
      // Dokumen draft tidak boleh terekspos ke publik/API anonim.
      if (user) return true;
      return { _status: { equals: 'published' } };
    },
    create: canManageArticles,
    update: canManageArticles,
    delete: canManageArticles,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1500,
        showSaveDraftButton: true,
      },
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
  trash: true,
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
      async ({ data, req, operation, originalDoc }) => {
        // Otomatis perbarui tanggal pembaruan saat dokumen diubah
        if (operation === 'update') {
          data.updatedDate = new Date().toISOString()
        }

        // DAT-008: Cegah overwrite antar editor (Optimistic Lock)
        if (originalDoc?.updatedAt && (data as any)?._expectedUpdatedAt) {
          const originalTime = new Date(originalDoc.updatedAt).getTime()
          const expectedTime = new Date((data as any)._expectedUpdatedAt).getTime()
          if (originalTime > expectedTime) {
            throw new APIError('Konflik Simpan Terdeteksi: Dokumen ini telah diperbarui oleh pengguna lain. Silakan muat ulang halaman.', 409)
          }
        }

        // ED-001 & ED-003: Validasi kelengkapan konten dan proteksi klaim medis saat publish
        const { isValid, errors, warnings } = validateArticleDoc(data)
        if (!isValid) {
          throw new APIError(`[Validasi Publikasi Artikel Gagal]:\n• ${errors.join('\n• ')}`, 400)
        }
        if (warnings.length > 0) {
          req.payload.logger.warn({ warnings }, '[Article Validation Warnings]')
        }

        try {
          const normalized = articleSeoAdapter(data)
          const audit = calculateSeoScore(normalized)
          data.seoScore = audit.score
          data.seoAudit = {
            score: audit.score,
            grade: audit.grade,
            engineVersion: audit.engineVersion || '2.1.0',
            metrics: audit.metrics,
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
      async ({ doc, previousDoc, req }) => {
        const isNowPublished = doc._status === 'published' || doc.status === 'published'
        const wasPublished = previousDoc?._status === 'published' || previousDoc?.status === 'published'

        if (isNowPublished && !wasPublished) {
          triggerCloudflareDeploy({ resource: 'Articles', action: 'publish', slug: doc.slug })
        } else if (!isNowPublished && wasPublished) {
          triggerCloudflareDeploy({ resource: 'Articles', action: 'unpublish', slug: doc.slug })
        } else if (isNowPublished && wasPublished) {
          triggerCloudflareDeploy({ resource: 'Articles', action: 'publish', slug: doc.slug })
        }

        // DAT-007: Otomatis buat pengalihan URL 301 saat slug berubah
        if (previousDoc?.slug && doc.slug && previousDoc.slug !== doc.slug) {
          try {
            await req.payload.create({
              collection: 'redirects',
              data: {
                from: `/blog/${previousDoc.slug}`,
                to: `/blog/${doc.slug}`,
                type: '301',
                active: true,
              },
            })
            req.payload.logger.info(`[Auto-Redirect] Dibuat redirect /blog/${previousDoc.slug} -> /blog/${doc.slug}`)
          } catch (e: any) {
            req.payload.logger.warn(`[Auto-Redirect] Gagal membuat redirect: ${e.message}`)
          }
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
            // ED-006: Relasi ke Bidan & Reviewer Medis
            {
              name: 'authorMidwife',
              type: 'relationship',
              relationTo: 'midwives',
              label: 'Pilih Bidan Penulis (Opsional)',
              admin: {
                description: 'Pilih profil bidan terdaftar untuk otomatis mengisi nama dan gelar penulis.',
              },
            },
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
              name: 'reviewedByMidwife',
              type: 'relationship',
              relationTo: 'midwives',
              label: 'Bidan Peninjau Medis (Medical Reviewer)',
              admin: {
                description: 'Pilih profil bidan ber-STR resmi yang meninjau akurasi klinis isi artikel.',
              },
            },
            {
              name: 'medicalReviewer',
              type: 'text',
              required: true,
              label: 'Peninjau Medis (Medical Reviewer — Nama Display)',
              admin: {
                description: 'Otoritas medis (nama bidan bergelar) yang memvalidasi kebenaran klinis isi artikel.',
                placeholder: 'Contoh: Bidan Ayu Lestari, A.Md.Keb (STR: STR-KEMENKES-3578-2022-08912)',
              },
            },
            {
              name: 'reviewedAt',
              type: 'date',
              label: 'Tanggal Peninjauan Medis (Sign-off)',
              admin: {
                description: 'Tanggal saat artikel selesai divalidasi oleh reviewer medis.',
              },
            },
            {
              name: 'reviewNotes',
              type: 'textarea',
              label: 'Catatan Peninjau Medis (Internal)',
              admin: {
                description: 'Catatan verifikasi klinis internal dari bidan peninjau (tidak tampil di publik).',
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
