import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'duration', 'recommended', 'active', 'order'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (doc.active) {
          triggerCloudflareDeploy({ resource: 'Services', action: 'publish', slug: doc.slug });
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        triggerCloudflareDeploy({ resource: 'Services', action: 'delete', slug: doc.slug });
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Layanan / Paket',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL (contoh: bundle-duo, baby-newborn)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'target',
      type: 'text',
      required: true,
      label: 'Target Pasien (contoh: 1 Ibu + 1 Bayi, Bayi 0 - 6 Bulan)',
    },
    {
      name: 'duration',
      type: 'text',
      required: true,
      label: 'Durasi Tindakan (contoh: 100 Menit)',
    },
    {
      name: 'price',
      type: 'text',
      required: true,
      label: 'Harga Promo / Final (contoh: Rp150.000)',
    },
    {
      name: 'numericPrice',
      type: 'number',
      required: true,
      label: 'Harga Angka Nominal (contoh: 150000)',
    },
    {
      name: 'originalPrice',
      type: 'text',
      label: 'Harga Coret / Asli (contoh: Rp190.000)',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Deskripsi Singkat (Ringkasan Kartu)',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Deskripsi Lengkap Manfaat Layanan',
    },
    {
      name: 'includedItems',
      type: 'array',
      label: 'Apa Saja yang Termasuk dalam Layanan Ini?',
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Ilustrasi Layanan',
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Label Badge (contoh: Paling Diminati Bunda)',
    },
    {
      name: 'recommended',
      type: 'checkbox',
      defaultValue: false,
      label: 'Penanda "Direkomendasikan" / Best Seller',
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
    {
      name: 'order',
      type: 'number',
      defaultValue: 1,
      label: 'Urutan Tampil (Angka kecil tampil lebih dulu)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'refCode',
      type: 'text',
      required: true,
      label: 'Kode Ref Tracking WhatsApp (contoh: KALA-SRV-DUO)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Draft Pesan WhatsApp saat Tombol Diklik',
    },
  ],
}
