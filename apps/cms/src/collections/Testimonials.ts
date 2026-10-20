import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { canManageTestimonials, getUserRole } from '../access/roles'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimoni Bunda',
    plural: 'Testimoni Bunda',
  },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'area', 'service', 'permissionGranted', 'active', 'order'],
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'author';
    },
  },
  access: {
    read: () => true,
    create: canManageTestimonials,
    update: canManageTestimonials,
    delete: canManageTestimonials,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (doc.active && doc.permissionGranted) {
          triggerCloudflareDeploy({ resource: 'Testimonials', action: 'publish' });
        }
      },
    ],
    afterDelete: [
      async () => {
        triggerCloudflareDeploy({ resource: 'Testimonials', action: 'delete' });
      },
    ],
  },
  fields: [
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Nama Bunda & Anak (Boleh inisial)',
      admin: {
        description: 'Contoh: Bunda Sarah & Baby Arka (2 bulan)',
        placeholder: 'Bunda Sarah & Baby Arka (2 bulan)',
      },
    },
    {
      name: 'area',
      type: 'text',
      required: true,
      label: 'Wilayah / Area Pasien',
      admin: {
        description: 'Wilayah tempat tinggal pasien. Contoh: Rungkut, Surabaya Timur',
        placeholder: 'Rungkut, Surabaya Timur',
      },
    },
    {
      name: 'service',
      type: 'text',
      required: true,
      label: 'Nama Layanan yang Digunakan',
      admin: {
        description: 'Nama paket perawatan. Contoh: Kala Bundle Duo',
        placeholder: 'Kala Bundle Duo',
      },
    },
    {
      name: 'relatedService',
      type: 'relationship',
      relationTo: 'services',
      label: 'Tautkan ke Paket Layanan Resmi (Opsional)',
      admin: {
        description: 'Jika ditautkan, testimoni ini akan otomatis tampil di halaman detail layanan tersebut.',
      },
    },
    {
      name: 'relatedArea',
      type: 'relationship',
      relationTo: 'service-areas',
      label: 'Tautkan ke Wilayah Layanan Resmi (Opsional)',
      admin: {
        description: 'Jika ditautkan, testimoni ini akan otomatis tampil di halaman area wilayah tersebut.',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Isi Cerita & Ulasan Pengalaman Bunda',
      admin: {
        description: 'Cerita nyata pengalaman mendapatkan pelayanan homecare dari Bidan Kala.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Momen Perawatan (Opsional)',
      admin: {
        description: 'Pastikan telah mendapatkan izin tayang tertulis dari orang tua sebelum mengunggah foto bayi.',
      },
    },
    {
      name: 'permissionGranted',
      type: 'checkbox',
      defaultValue: true,
      required: true,
      label: 'Sudah Memperoleh Izin Publikasi Resmi dari Pasien (Etika Medis)',
      admin: {
        description: 'Wajib dicentang demi mematuhi UU Perlindungan Data Pribadi (UU PDP) dan etika kerahasiaan medis.',
      },
    },
    // Sidebar
    {
      name: 'date',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      label: 'Tanggal Ulasan',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 1,
      label: 'Urutan Tampil',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Status Aktif (Tampil di Website)',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
