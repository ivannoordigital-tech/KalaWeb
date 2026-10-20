import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'target', 'price', 'popular'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Layanan / Paket',
    },
    {
      name: 'serviceId',
      type: 'text',
      required: true,
      unique: true,
      label: 'ID Layanan (contoh: bundle-duo, baby-newborn)',
    },
    {
      name: 'target',
      type: 'text',
      required: true,
      label: 'Target Pasien (contoh: 1 Ibu + 1 Bayi)',
    },
    {
      name: 'duration',
      type: 'text',
      required: true,
      label: 'Durasi Tindakan (contoh: 100 Menit)',
    },
    {
      name: 'originalPrice',
      type: 'text',
      label: 'Harga Coret / Asli (contoh: Rp190.000)',
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
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Deskripsi Manfaat Layanan',
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Label Badge (contoh: Paling Diminati Bunda)',
    },
    {
      name: 'popular',
      type: 'checkbox',
      defaultValue: false,
      label: 'Tandai sebagai Layanan Terpopuler / Best Seller',
    },
    {
      name: 'refCode',
      type: 'text',
      required: true,
      label: 'Kode Ref Tracking WhatsApp (contoh: KALA-SRV-DUO)',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Draft Pesan WhatsApp saat Tombol Diklik',
    },
  ],
}
