import { APIError, type CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { buildSeoFields } from '../fields/seoFields'
import { seoScoreField, seoAuditFields } from '../fields/seoAuditFields'
import { landingPageSeoAdapter, calculateSeoScore } from '../lib/seo-engine'
import { canManagePagesAndLPs, getUserRole } from '../access/roles'
import { allBlocks } from '../blocks'
import { validatePageBuilderDoc } from '../utilities/pageBuilderValidators'

export const LandingPages: CollectionConfig = {
  slug: 'landing-pages',
  labels: {
    singular: 'Landing Page Iklan',
    plural: 'Landing Page Iklan',
  },
  admin: {
    group: 'Halaman Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'refCode', 'variant', 'seoScore', '_status', 'updatedAt'],
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'author' || role === 'midwife_coordinator';
    },
    preview: (doc) => {
      if (doc?.id) {
        const cmsUrl = process.env.CMS_PUBLIC_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
        return `${cmsUrl}/api/preview-redirect?collection=landing-pages&id=${doc.id}`;
      }
      return null;
    },
    livePreview: {
      url: ({ data }) => {
        const slug = data?.slug || 'bayi-kolik';
        const baseUrl = process.env.PREVIEW_BASE_URL || 'http://localhost:4321';
        return `${baseUrl}/preview/sales/${slug}/`;
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
        // Auto-generate standard refCode if empty
        if (!data.refCode && data.slug) {
          const cleanSlug = String(data.slug).toUpperCase().replace(/[^A-Z0-9]/g, '-');
          const variant = data.variant || 'A';
          data.refCode = `KALA-LP-${cleanSlug}-${variant}`;
        }

        const { isValid, errors, warnings } = validatePageBuilderDoc(data, true);
        if (!isValid) {
          throw new APIError(`[Validasi Publikasi Landing Page Gagal]:\n• ${errors.join('\n• ')}`, 400);
        }
        if (warnings.length > 0) {
          console.warn('[LandingPages Validation Warnings]:', warnings);
        }

        try {
          const normalized = landingPageSeoAdapter(data);
          const audit = calculateSeoScore(normalized);
          data.seoScore = audit.score;
          data.seoAudit = {
            score: audit.score,
            grade: audit.grade,
            issues: audit.issues,
            lastAuditedAt: new Date().toISOString(),
          };
        } catch (err) {
          req.payload.logger.error({ err }, 'Error auditing SEO for landing page');
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const isNowPublished = doc._status === 'published';
        const wasPublished = previousDoc?._status === 'published';

        if (isNowPublished && !wasPublished) {
          triggerCloudflareDeploy({ resource: 'LandingPages', action: 'publish', slug: doc.slug });
        } else if (!isNowPublished && wasPublished) {
          try {
            const publishedVersions = await req.payload.findVersions({
              collection: 'landing-pages',
              where: {
                parent: { equals: doc.id },
                'version._status': { equals: 'published' },
              },
              limit: 1,
            });

            if (publishedVersions.totalDocs === 0) {
              triggerCloudflareDeploy({ resource: 'LandingPages', action: 'unpublish', slug: doc.slug });
            } else {
              console.log(`[Deploy Hook] Dilewati: LandingPages (${doc.slug}) disimpan sebagai draft, versi live published tetap aktif.`);
            }
          } catch (err) {
            console.warn(`[Deploy Hook] Gagal memverifikasi versi published LandingPages (${doc.slug}):`, (err as Error).message);
          }
        } else if (isNowPublished && wasPublished) {
          triggerCloudflareDeploy({ resource: 'LandingPages', action: 'publish', slug: doc.slug });
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        if (doc._status === 'published') {
          triggerCloudflareDeploy({ resource: 'LandingPages', action: 'delete', slug: doc.slug });
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nama Kampanye / Judul Internal',
      admin: {
        description: 'Nama kampanye iklan untuk referensi internal. Contoh: Iklan Meta - Solusi Bayi Kolik Surabaya',
        placeholder: 'Solusi Tangis Kolik & Perut Kembung Bayi di Surabaya & Sidoarjo',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL Halaman Sales (/sales/[slug])',
      admin: {
        position: 'sidebar',
        description: 'Alamat URL halaman kampanye iklan. Contoh: bayi-kolik (akan beralamat di kalababyspa.com/sales/bayi-kolik)',
        placeholder: 'bayi-kolik',
      },
    },
    {
      name: 'refCode',
      type: 'text',
      required: false,
      label: 'Kode Pelacak WhatsApp (Ref Code)',
      admin: {
        position: 'sidebar',
        description: 'Kosongkan jika ingin dibuat otomatis: KALA-LP-[SLUG]-[VARIAN]. Pesan chat: "Halo Bidan Kala, saya mau reservasi... [ref: ...]"',
        placeholder: 'Otomatis dibuat jika kosong',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Status Aktif (Tampilkan di Website)',
      admin: {
        position: 'sidebar',
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
        { label: 'Google Ads & GTM (Tag Manager/AdWords)', value: 'google' },
        { label: 'TikTok Pixel', value: 'tiktok' },
        { label: 'Google Analytics 4 (GA4)', value: 'ga4' },
        { label: 'Microsoft Clarity', value: 'clarity' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Pilih pixel pelacakan konversi yang aktif. ID pixel dikonfigurasi terpusat di Site Settings.',
      },
    },
    {
      name: 'campaignBaseRef',
      type: 'text',
      label: 'Ref Induk Kampanye (A/B Test)',
      admin: {
        position: 'sidebar',
        description: 'Contoh: KALA-LP-KOLIK. Digunakan untuk mengelompokkan laporan perbandingan varian.',
        placeholder: 'KALA-LP-KOLIK',
      },
    },
    {
      name: 'pageLayout',
      type: 'radio',
      label: 'Opsi Tampilan (Page Layout)',
      defaultValue: 'canvas_minimal',
      options: [
        {
          label: 'Elementor Canvas Minimal (Header Minimalis Khusus Iklan/Sales: Logo + STR)',
          value: 'canvas_minimal',
        },
        {
          label: 'Elementor Canvas Murni (Blank Canvas: 100% Kosong Tanpa Header Apapun)',
          value: 'canvas',
        },
        {
          label: 'Default / Bawaan Tema (Header Navbar & Footer Web Lengkap)',
          value: 'default',
        },
        {
          label: 'Elementor Full Width (Lebar Penuh dengan Header & Footer Bawaan)',
          value: 'full_width',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Pilih tata letak seperti Elementor:\n• Canvas Minimal: Header sales ringkas tanpa menu keluar (standar iklan).\n• Canvas Murni: 100% kosong putih bersih tanpa elemen bawaan.\n• Default/Full Width: Menyertakan navbar & footer web utama.',
      },
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Varian Kampanye',
      defaultValue: 'A',
      options: [
        { label: 'Varian A (Kontrol)', value: 'A' },
        { label: 'Varian B (Uji)', value: 'B' },
        { label: 'Varian C (Eksperimen)', value: 'C' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Identifikasi varian untuk evaluasi conversion rate iklan.',
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
      label: '🧱 Susunan Blok Halaman (Drag & Drop Page Builder)',
      admin: {
        condition: (data) => data?.editorMode === 'form',
        description: 'Gunakan blok ini untuk menyusun seksi halaman sesuka hati (Hero, Masalah, Solusi, Paket Harga, Komparasi, Garansi, dll.). Jika blok diisi, sistem akan menampilkan susunan blok ini.',
      },
      blocks: allBlocks,
    },
    // Hero Box (Opsional bila menggunakan Block Builder)
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'text',
          label: 'Teks Harga Promo Tampilan (Mode Klasik)',
          admin: {
            width: '50%',
            placeholder: 'Rp60.000',
            description: 'Diabaikan jika Anda menggunakan Susunan Blok di atas.',
          },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Durasi Layanan (Mode Klasik)',
          admin: {
            width: '50%',
            placeholder: '40 Menit',
            description: 'Diabaikan jika Anda menggunakan Susunan Blok di atas.',
          },
        },
      ],
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Judul Headline Utama (Hero H1 - Mode Klasik)',
      admin: {
        description: 'Kalimat pemikat utama di bagian atas (diabaikan jika menggunakan Blok Hero di Page Builder).',
      },
    },
    {
      name: 'subheadline',
      type: 'textarea',
      label: 'Subheadline / Kalimat Empati (Mode Klasik)',
      admin: {
        description: 'Penjelasan pembuka 1-2 kalimat (diabaikan jika menggunakan Blok Hero di Page Builder).',
      },
    },
    // Pain Points
    {
      name: 'painPoints',
      type: 'array',
      label: 'Kecemasan / Masalah Bunda (Pain Points)',
      admin: {
        description: 'Daftar keluhan yang dialami calon pasien (tampil dengan tanda silang merah).',
      },
      fields: [
        {
          name: 'point',
          type: 'text',
          required: true,
          label: 'Keluhan / Masalah',
          admin: {
            placeholder: 'Bayi menangis histeris di sore atau malam hari dengan kaki menekuk ke dada',
          },
        },
      ],
    },
    // Solutions
    {
      name: 'solutions',
      type: 'array',
      label: 'Solusi Medis & Keunggulan Kala',
      admin: {
        description: '3 poin solusi klinis yang ditawarkan Bidan Kala.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Judul Solusi',
          admin: { placeholder: 'Teknik Pijat ILU Klinis & Gerakan Kayuh Sepeda' },
        },
        {
          name: 'desc',
          type: 'textarea',
          required: true,
          label: 'Penjelasan Solusi',
        },
      ],
    },
    // 3 Steps
    {
      name: 'steps',
      type: 'array',
      label: '3 Langkah Alur Kerja Praktis',
      fields: [
        {
          name: 'num',
          type: 'text',
          required: true,
          label: 'Nomor Langkah (1, 2, 3)',
          defaultValue: '1',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Judul Langkah',
        },
        {
          name: 'desc',
          type: 'textarea',
          required: true,
          label: 'Deskripsi Langkah',
        },
      ],
    },
    // Testimonial
    {
      name: 'testimonial',
      type: 'group',
      label: 'Testimoni Pasien Khusus Iklan Ini (Mode Klasik)',
      admin: {
        description: 'Diabaikan jika Anda menggunakan Blok Testimoni di Page Builder.',
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: 'Kutipan Testimoni',
        },
        {
          name: 'author',
          type: 'text',
          label: 'Nama Bunda & Anak',
          admin: {
            placeholder: 'Bunda Nadhira & Baby Zayn (3 minggu)',
          },
        },
        {
          name: 'area',
          type: 'text',
          label: 'Wilayah Pasien',
          admin: {
            placeholder: 'Waru, Sidoarjo',
          },
        },
      ],
    },
    // FAQs
    {
      name: 'faqs',
      type: 'array',
      label: 'Tanya Jawab Singkat (FAQ Iklan)',
      fields: [
        {
          name: 'q',
          type: 'text',
          required: true,
          label: 'Pertanyaan',
        },
        {
          name: 'a',
          type: 'textarea',
          required: true,
          label: 'Jawaban Bidan',
        },
      ],
    },
    // Reusable SEO Fields & Audit Scoring
    buildSeoFields({ titleSourceField: 'title', descriptionSourceField: 'headline' }),
    seoScoreField,
    seoAuditFields,
  ],
}
