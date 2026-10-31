import { APIError, type CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { buildSeoFields } from '../fields/seoFields'
import { seoScoreField, seoAuditFields } from '../fields/seoAuditFields'
import { pageSeoAdapter, calculateSeoScore } from '../lib/seo-engine'
import { canManagePagesAndLPs, getUserRole } from '../access/roles'
import { allBlocks } from '../blocks'
import { validatePageBuilderDoc } from '../utilities/pageBuilderValidators'
import { formatSlug } from '../utilities/formatSlug'

const RESERVED_SLUGS = [
  'admin',
  'api',
  'layanan',
  'area',
  'bidan',
  'blog',
  'lp',
  'sales',
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
    singular: 'Halaman',
    plural: 'Semua Halaman',
  },
  admin: {
    group: 'Halaman Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'pageType', 'pageLayout', 'seoScore', 'updatedAt', '_status'],
    hidden: ({ user }) => {
      const role = getUserRole(user)
      return role === 'author' || role === 'midwife_coordinator'
    },
    preview: (doc) => {
      if (doc?.id) {
        const cmsUrl = process.env.CMS_PUBLIC_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
        return `${cmsUrl}/api/preview-redirect?collection=pages&id=${doc.id}`;
      }
      return null;
    },
    livePreview: {
      url: ({ data }) => {
        const slug = data?.slug || 'syarat-ketentuan'
        const baseUrl = process.env.PREVIEW_BASE_URL || 'http://localhost:4321'
        const prefix = data?.pageType === 'landing' ? '/preview/sales' : '/preview'
        return `${baseUrl}${prefix}/${slug}/`
      },
      breakpoints: [
        {
          label: 'Mobile (375px)',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet (768px)',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop (1280px)',
          name: 'desktop',
          width: 1280,
          height: 800,
        },
      ],
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
              args.data.title = `${args.data.title} (Salinan Duplikat)`
            }
            args.data.slug = ''
            args.data.refCode = ''
            args.data._status = 'draft'
          }
        }
        return args
      },
    ],
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
      async ({ data, req }) => {
        const isLanding = data.pageType === 'landing'
        // Auto-generate refCode if empty for landing pages
        if (isLanding && !data.refCode && data.slug) {
          const cleanSlug = String(data.slug).toUpperCase().replace(/[^A-Z0-9]/g, '-')
          const variant = data.variant || 'A'
          data.refCode = `KALA-LP-${cleanSlug}-${variant}`
        }

        const { isValid, errors, warnings } = validatePageBuilderDoc(data, isLanding)
        if (!isValid) {
          throw new APIError(`[Validasi Publikasi Gagal]:\n• ${errors.join('\n• ')}`, 400)
        }
        if (warnings.length > 0) {
          console.warn('[Pages Validation Warnings]:', warnings)
        }

        try {
          const normalized = pageSeoAdapter(data)
          const audit = calculateSeoScore(normalized)
          data.seoScore = audit.score
          data.seoAudit = {
            score: audit.score,
            grade: audit.grade,
            issues: audit.issues,
            lastAuditedAt: new Date().toISOString(),
          }
        } catch (err) {
          req.payload.logger.error({ err }, 'Error auditing SEO for page')
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const isNowPublished = doc._status === 'published'
        const wasPublished = previousDoc?._status === 'published'

        if (isNowPublished && !wasPublished) {
          triggerCloudflareDeploy({ resource: 'Pages', action: 'publish', slug: doc.slug })
        } else if (!isNowPublished && wasPublished) {
          try {
            const publishedVersions = await req.payload.findVersions({
              collection: 'pages',
              where: {
                parent: { equals: doc.id },
                'version._status': { equals: 'published' },
              },
              limit: 1,
            });

            if (publishedVersions.totalDocs === 0) {
              triggerCloudflareDeploy({ resource: 'Pages', action: 'unpublish', slug: doc.slug });
            } else {
              console.log(`[Deploy Hook] Dilewati: Pages (${doc.slug}) disimpan sebagai draft, versi live published tetap aktif.`);
            }
          } catch (err) {
            console.warn(`[Deploy Hook] Gagal memverifikasi versi published Pages (${doc.slug}):`, (err as Error).message);
          }
        } else if (isNowPublished && wasPublished) {
          triggerCloudflareDeploy({ resource: 'Pages', action: 'publish', slug: doc.slug })
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        if (doc._status === 'published') {
          triggerCloudflareDeploy({ resource: 'Pages', action: 'delete', slug: doc.slug })
        }
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Konten Halaman',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Judul Halaman',
              admin: {
                description: 'Judul utama halaman. Contoh: Promo Spesial Pijat Newborn atau Syarat & Ketentuan.',
                placeholder: 'Promo Spesial Pijat Newborn Homecare Surabaya',
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
            // Pilihan Cara Mengisi Konten (Blok atau Teks Bebas)
            {
              name: 'content',
              type: 'richText',
              label: 'Isi Dokumen / Konten Teks Bebas',
              admin: {
                description:
                  'Gunakan untuk halaman informasi umum yang membutuhkan format teks bebas (paragraf, poin daftar, dan subjudul). Jika blok di bawah diisi, susunan blok akan diprioritaskan.',
              },
            },
            // 🧱 Flexible Block-Based Page Builder
            {
              name: 'builder',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/builder/BuilderField#BuilderField',
                },
                condition: (data) => data?.editorMode !== 'form',
              },
            },
            {
              name: 'layout',
              type: 'blocks',
              label: 'Susunan Blok Halaman (Page Builder Visual)',
              admin: {
                condition: (data) => data?.editorMode === 'form',
                description:
                  'Gunakan blok visual ini untuk menyusun halaman promo dan penawaran (Banner Utama, Masalah Bunda, Solusi, Paket Harga, Testimoni, FAQ).',
              },
              blocks: allBlocks,
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
          label: 'Tata Letak & Pelacakan',
          fields: [
            {
              name: 'pageLayout',
              type: 'radio',
              label: 'Pilihan Tata Letak Halaman (Layout)',
              defaultValue: 'default',
              options: [
                {
                  label: 'Standar Website (Lengkap dengan navigasi atas dan footer bawaan)',
                  value: 'default',
                },
                {
                  label: 'Kanvas Bersih (100% Kosong tanpa navigasi & footer — cocok untuk penawaran iklan)',
                  value: 'canvas',
                },
                {
                  label: 'Lebar Penuh Layar (Memenuhi layar dengan navigasi atas dan footer)',
                  value: 'full_width',
                },
              ],
              admin: {
                description:
                  '• Standar: Layout bawaan web dengan navbar & footer.\n• Kanvas Bersih: 100% blank canvas tanpa header/footer untuk fokus konversi.\n• Lebar Penuh: Konten melebar penuh dengan header/footer tema.',
              },
            },
            {
              name: 'showWhatsAppCta',
              type: 'checkbox',
              defaultValue: true,
              label: 'Tampilkan Tombol Konsultasi WhatsApp di Bawah Halaman',
              admin: {
                description: 'Centang jika ingin menyertakan tombol WhatsApp resmi di bagian akhir halaman.',
              },
            },
            {
              name: 'whatsappCustomMessage',
              type: 'text',
              label: 'Pesan Otomatis WhatsApp (Opsional)',
              admin: {
                description:
                  'Teks pesan otomatis saat pasien menekan tombol WA. Contoh: Halo Bidan Kala, saya mau tanya promo newborn',
              },
            },
            // Pelacakan Khusus Iklan
            {
              name: 'refCode',
              type: 'text',
              label: 'Kode Pelacak WhatsApp (Ref Code)',
              admin: {
                condition: (data) => data?.pageType === 'landing',
                description: 'Kode unik otomatis pelacak pesan WA masuk. Contoh: KALA-LP-PROMO-A',
                placeholder: 'Otomatis dibuat jika kosong',
              },
            },
            {
              name: 'variant',
              type: 'select',
              label: 'Varian Halaman (A/B Test)',
              defaultValue: 'A',
              options: [
                { label: 'Varian A (Kontrol Utama)', value: 'A' },
                { label: 'Varian B (Uji)', value: 'B' },
                { label: 'Varian C (Eksperimen)', value: 'C' },
              ],
              admin: {
                condition: (data) => data?.pageType === 'landing',
                description: 'Identifikasi varian untuk evaluasi efektivitas iklan.',
              },
            },
            {
              name: 'activePixels',
              type: 'select',
              hasMany: true,
              label: 'Pelacak Iklan Aktif (Pixels)',
              defaultValue: ['meta', 'google'],
              options: [
                { label: 'Meta Ads (Facebook & Instagram)', value: 'meta' },
                { label: 'Google Ads & GTM (Tag Manager/AdWords)', value: 'google' },
                { label: 'TikTok Ads', value: 'tiktok' },
                { label: 'Google Analytics 4 (GA4)', value: 'ga4' },
                { label: 'Microsoft Clarity', value: 'clarity' },
              ],
              admin: {
                condition: (data) => data?.pageType === 'landing',
                description: 'Pilih sistem analitik iklan yang aktif untuk halaman ini.',
              },
            },
          ],
        },
      ],
    },
    // Sidebar fields (Selalu terlihat di sisi kanan)
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL (kalababyspa.com/[slug])',
      admin: {
        position: 'sidebar',
        description: 'Alamat URL halaman (huruf kecil dan tanda hubung). Otomatis dibuat dari judul jika kosong.',
        placeholder: 'promo-newborn',
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
      name: 'pageType',
      type: 'radio',
      label: 'Tujuan Halaman',
      defaultValue: 'standard',
      options: [
        {
          label: 'Halaman Informasi Umum (kalababyspa.com/[slug])',
          value: 'standard',
        },
        {
          label: 'Halaman Penawaran Khusus / Iklan (kalababyspa.com/sales/[slug])',
          value: 'landing',
        },
      ],
      admin: {
        position: 'sidebar',
        description:
          '• Halaman Biasa: Untuk konten web profil, info klinik, syarat layanan.\n• Halaman Iklan: Untuk kampanye iklan berbayar dengan pelacakan WhatsApp & Pixel.',
      },
    },
    {
      name: 'editorMode',
      type: 'select',
      label: 'Mode Editor Halaman',
      defaultValue: 'builder',
      options: [
        { label: '✨ Shopify-Style Visual Builder', value: 'builder' },
        { label: '📝 Formulir Blok Klasik', value: 'form' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Pilih builder visual dengan live preview atau formulir blok standar.',
      },
    },
    seoScoreField,
    seoAuditFields,
  ],
}
