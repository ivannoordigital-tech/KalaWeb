import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'

export const ServiceAreas: CollectionConfig = {
  slug: 'service-areas',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'estimatedArrivalMinutes', 'active'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (doc.active) {
          triggerCloudflareDeploy({ resource: 'ServiceAreas', action: 'publish', slug: doc.slug });
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        triggerCloudflareDeploy({ resource: 'ServiceAreas', action: 'delete', slug: doc.slug });
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Wilayah Layanan (contoh: Surabaya Barat, Waru Sidoarjo)',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL (contoh: surabaya-barat, sidoarjo-utara)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'city',
      type: 'select',
      required: true,
      defaultValue: 'Surabaya',
      options: [
        { label: 'Kota Surabaya', value: 'Surabaya' },
        { label: 'Kabupaten Sidoarjo', value: 'Sidoarjo' },
      ],
      label: 'Kota / Kabupaten',
    },
    {
      name: 'uniqueDescription',
      type: 'textarea',
      required: true,
      label: 'Deskripsi Unik Wilayah (Landmark, kebiasaan, & karakter area)',
      admin: {
        description: 'Tuliskan deskripsi otentik unik per wilayah untuk mendongkrak local SEO Google',
      },
    },
    {
      name: 'landmarks',
      type: 'array',
      label: 'Landmark / Kecamatan Utama yang Dijangkau',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'estimatedArrivalMinutes',
      type: 'text',
      label: 'Estimasi Waktu Tiba Bidan (contoh: 20-35 Menit)',
    },
    {
      name: 'availableServices',
      type: 'array',
      label: 'Layanan yang Tersedia di Wilayah Ini',
      fields: [
        {
          name: 'serviceName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif Tampil di Website',
    },
  ],
}
