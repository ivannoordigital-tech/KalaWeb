import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { canManageSiteSettings, getUserRole } from '../access/roles'
import { allBlocks } from '../blocks'

export const LandingPages: CollectionConfig = {
  slug: 'landing-pages',
  labels: {
    singular: 'Halaman Iklan (Landing Page)',
    plural: 'Halaman Iklan (Landing Pages)',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'refCode', 'price', 'active'],
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'author' || role === 'midwife_coordinator';
    },
  },
  access: {
    read: () => true,
    create: canManageSiteSettings,
    update: canManageSiteSettings,
    delete: canManageSiteSettings,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (doc.active) {
          triggerCloudflareDeploy({ resource: 'LandingPages', action: 'publish', slug: doc.slug });
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        triggerCloudflareDeploy({ resource: 'LandingPages', action: 'delete', slug: doc.slug });
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
      label: 'Slug URL Iklan (/lp/[slug])',
      admin: {
        position: 'sidebar',
        description: 'Alamat URL halaman kampanye iklan. Contoh: bayi-kolik (akan beralamat di kalababyspa.com/lp/bayi-kolik)',
        placeholder: 'bayi-kolik',
      },
    },
    {
      name: 'refCode',
      type: 'text',
      required: true,
      label: 'Kode Pelacak WhatsApp (Ref Code)',
      admin: {
        position: 'sidebar',
        description: 'Kode unik pelacak pesan WA agar tim CS/Admin tahu asal kampanye iklan. Contoh: LP-KOLIK-ADS',
        placeholder: 'LP-KOLIK-ADS',
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
    // 🧱 Flexible Block-Based Page Builder
    {
      name: 'layout',
      type: 'blocks',
      label: '🧱 Susunan Blok Halaman (Drag & Drop Page Builder)',
      admin: {
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
  ],
}
