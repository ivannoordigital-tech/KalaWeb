import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { buildSeoFields } from '../fields/seoFields'
import { canManageAreas, getUserRole } from '../access/roles'

export const ServiceAreas: CollectionConfig = {
  slug: 'service-areas',
  labels: {
    singular: 'Wilayah Layanan',
    plural: 'Area Jangkauan',
  },
  admin: {
    group: 'Layanan & Klinik',
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'estimatedArrivalMinutes', 'active'],
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'author' || role === 'midwife_coordinator';
    },
  },
  access: {
    read: () => true,
    create: canManageAreas,
    update: canManageAreas,
    delete: canManageAreas,
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
      label: 'Nama Wilayah Layanan',
      admin: {
        description: 'Contoh: Surabaya Barat, Waru Sidoarjo, Rungkut & Surabaya Timur',
        placeholder: 'Surabaya Barat',
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
      label: 'Kota / Kabupaten Administrasi',
    },
    {
      name: 'uniqueDescription',
      type: 'textarea',
      required: true,
      label: 'Deskripsi Unik Wilayah (Local SEO Surabaya & Sidoarjo)',
      admin: {
        description: 'Tuliskan ulasan spesifik mengenai karakter wilayah, perumahan, dan aksesibilitas bidan. Hindari teks generik agar tidak dianggap thin-content oleh Google.',
        placeholder: 'Layanan homecare bidan menjangkau kawasan perumahan Surabaya Barat (CitraLand, Graha Famili, Pakuwon Indah, Wiyung)...',
      },
    },
    {
      name: 'landmarks',
      type: 'array',
      label: 'Kecamatan / Landmark Utama yang Dijangkau',
      admin: {
        description: 'Daftar perumahan besar, jalan protokol, atau kecamatan yang tercakup.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Kecamatan / Landmark',
          admin: {
            placeholder: 'Contoh: Wiyung, Lakarsantri, Sambikerep',
          },
        },
      ],
    },
    {
      name: 'estimatedArrivalMinutes',
      type: 'text',
      label: 'Estimasi Waktu Tiba Bidan',
      admin: {
        description: 'Perkiraan durasi perjalanan tim bidan tiba di kediaman pasien. Contoh: 20–35 Menit',
        placeholder: '20-35 Menit',
      },
    },
    {
      name: 'availableServices',
      type: 'array',
      label: 'Layanan yang Tersedia di Wilayah Ini',
      admin: {
        description: 'Paket perawatan yang dapat dipanggil ke wilayah ini.',
      },
      fields: [
        {
          name: 'serviceName',
          type: 'text',
          required: true,
          label: 'Nama Layanan',
          admin: {
            placeholder: 'Contoh: Pijat Ceria Newborn, Pijat Oksitosin Bunda',
          },
        },
      ],
    },
    // Sidebar Fields
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL (/area/[slug])',
      admin: {
        position: 'sidebar',
        description: 'Huruf kecil dan strip. Contoh: surabaya-barat',
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
    // Reusable SEO Fields
    buildSeoFields({ titleSourceField: 'name', descriptionSourceField: 'uniqueDescription' }),
  ],
}
