import { APIError, type CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { buildSeoFields } from '../fields/seoFields'
import { seoScoreField, seoAuditFields } from '../fields/seoAuditFields'
import { pageSeoAdapter, calculateSeoScore } from '../lib/seo-engine'
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
    plural: 'Halaman (Pages)',
  },
  admin: {
    group: '📢 Pemasaran & Halaman',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'pageType', 'pageLayout', 'seoScore', 'updatedAt', '_status'],
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'author' || role === 'midwife_coordinator';
    },
    preview: (doc) => {
      if (doc?.slug) {
        const baseUrl = process.env.PREVIEW_BASE_URL || 'http://localhost:4321';
        const prefix = doc.pageType === 'landing' ? '/preview/sales' : '/preview';
        return `${baseUrl}${prefix}/${doc.slug}/`;
      }
      return null;
    },
    livePreview: {
      url: ({ data }) => {
        const slug = data?.slug || 'syarat-ketentuan';
        const baseUrl = process.env.PREVIEW_BASE_URL || 'http://localhost:4321';
        const prefix = data?.pageType === 'landing' ? '/preview/sales' : '/preview';
        return `${baseUrl}${prefix}/${slug}/`;
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
              args.data.title = `${args.data.title} (Salinan Duplikat)`;
            }
            args.data.slug = '';
            args.data.refCode = '';
            args.data._status = 'draft';
          }
        }
        return args;
      },
    ],
    beforeChange: [
      async ({ data, req }) => {
        const isLanding = data.pageType === 'landing';
        // Auto-generate refCode if empty for landing pages
        if (isLanding && !data.refCode && data.slug) {
          const cleanSlug = String(data.slug).toUpperCase().replace(/[^A-Z0-9]/g, '-');
          const variant = data.variant || 'A';
          data.refCode = `KALA-LP-${cleanSlug}-${variant}`;
        }

        const { isValid, errors, warnings } = validatePageBuilderDoc(data, isLanding);
        if (!isValid) {
          throw new APIError(`[Validasi Publikasi Gagal]:\n• ${errors.join('\n• ')}`, 400);
        }
        if (warnings.length > 0) {
          console.warn('[Pages Validation Warnings]:', warnings);
        }

        try {
          const normalized = pageSeoAdapter(data);
          const audit = calculateSeoScore(normalized);
          data.seoScore = audit.score;
          data.seoAudit = {
            score: audit.score,
            grade: audit.grade,
            issues: audit.issues,
            lastAuditedAt: new Date().toISOString(),
          };
        } catch (err) {
          req.payload.logger.error({ err }, 'Error auditing SEO for page');
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
        description: 'Judul utama halaman. Contoh: Promo Paket Newborn atau Syarat & Ketentuan',
        placeholder: 'Promo Spesial Pijat Newborn Homecare Surabaya',
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
        description: 'Alamat URL halaman (huruf kecil dan tanda hubung). Contoh: promo-newborn',
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
      label: '📌 Tipe Halaman (Page Type)',
      defaultValue: 'standard',
      options: [
        {
          label: 'Halaman Biasa (Website Umum: kalababyspa.com/[slug])',
          value: 'standard',
        },
        {
          label: 'Halaman Iklan (Landing Page / Sales Page: kalababyspa.com/sales/[slug])',
          value: 'landing',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Pilih tujuan fungsi halaman:\n• Halaman Biasa: Untuk konten web profil, info klinik, syarat layanan.\n• Halaman Iklan: Untuk kampanye iklan berbayar dengan pelacakan konversi WhatsApp & Pixel.',
      },
    },
    {
      name: 'pageLayout',
      type: 'radio',
      label: '🎨 Opsi Tampilan (Page Layout)',
      defaultValue: 'default',
      options: [
        {
          label: 'Default (Standar tema bawaan dengan header & footer)',
          value: 'default',
        },
        {
          label: 'Elementor Canvas (Blank Canvas: 100% kosong tanpa header & footer)',
          value: 'canvas',
        },
        {
          label: 'Elementor Full Width (Lebar penuh dengan header & footer bawaan)',
          value: 'full_width',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Pilih tata letak visual halaman seperti di Elementor:\n• Default: Layout standar tema dengan navbar & footer.\n• Elementor Canvas: 100% blank canvas tanpa header/footer tema.\n• Full Width: Memenuhi lebar layar dengan header/footer bawaan.',
      },
    },
    // Konfigurasi Iklan & Konversi (Sidebar - Khusus Halaman Iklan)
    {
      name: 'refCode',
      type: 'text',
      label: 'Kode Pelacak WhatsApp (Ref Code)',
      admin: {
        position: 'sidebar',
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
        { label: 'Varian A (Kontrol)', value: 'A' },
        { label: 'Varian B (Uji)', value: 'B' },
        { label: 'Varian C (Eksperimen)', value: 'C' },
      ],
      admin: {
        position: 'sidebar',
        condition: (data) => data?.pageType === 'landing',
        description: 'Identifikasi varian untuk evaluasi conversion rate.',
      },
    },
    {
      name: 'activePixels',
      type: 'select',
      hasMany: true,
      label: 'Pixel Iklan Aktif',
      defaultValue: ['meta', 'google'],
      options: [
        { label: 'Meta Pixel (Facebook/Instagram Ads)', value: 'meta' },
        { label: 'Google Ads Tag (GTM/AdWords)', value: 'google' },
        { label: 'TikTok Pixel', value: 'tiktok' },
      ],
      admin: {
        position: 'sidebar',
        condition: (data) => data?.pageType === 'landing',
        description: 'Pilih pixel pelacakan iklan yang aktif untuk halaman ini.',
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
      label: 'Isi Konten Artikel / Teks Lengkap (Opsional)',
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
        description: 'Gunakan blok visual ini untuk menyusun halaman sesuka hati (Hero, Masalah, Solusi, Paket Harga, Komparasi, FAQ, dll.). Jika diisi, susunan blok ini akan diprioritaskan tampil.',
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
        description: 'Teks pesan otomatis saat tombol WA ditekan. Contoh: Halo Bidan Kala, saya mau tanya promo ini',
      },
    },
    // Reusable SEO Fields & Audit Scoring
    buildSeoFields({ titleSourceField: 'title', descriptionSourceField: 'description' }),
    seoScoreField,
    seoAuditFields,
  ],
}
