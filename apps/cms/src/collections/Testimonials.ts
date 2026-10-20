import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'area', 'service', 'permissionGranted', 'active', 'order'],
  },
  access: {
    read: () => true,
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
      label: 'Nama Bunda & Anak (boleh nama lengkap atau inisial)',
      admin: {
        placeholder: 'Bunda Sarah & Baby Arka (2 bulan)',
      },
    },
    {
      name: 'area',
      type: 'text',
      required: true,
      label: 'Wilayah / Area (contoh: Rungkut, Surabaya Timur)',
    },
    {
      name: 'service',
      type: 'text',
      required: true,
      label: 'Layanan yang Diambil (contoh: Kala Bundle Duo)',
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Isi Cerita / Kutipan Ulasan Bunda',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Momen / Bukti Layanan (Opsional, pastikan berizin)',
    },
    {
      name: 'date',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      label: 'Tanggal Ulasan',
    },
    {
      name: 'permissionGranted',
      type: 'checkbox',
      defaultValue: true,
      required: true,
      label: 'Sudah Memperoleh Izin Publikasi Resmi dari Pasien',
      admin: {
        description: 'Wajib dicentang sesuai standar etika medis & kerahasiaan pasien',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Tampilkan di Website',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 1,
      label: 'Urutan Tampil',
    },
  ],
}
