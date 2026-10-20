import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'

export const Midwives: CollectionConfig = {
  slug: 'midwives',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'strNumber', 'experienceYears', 'active'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (doc.active) {
          triggerCloudflareDeploy({ resource: 'Midwives', action: 'publish', slug: doc.slug });
        }
      },
    ],
    afterDelete: [
      async () => {
        triggerCloudflareDeploy({ resource: 'Midwives', action: 'delete' });
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Lengkap Bidan (contoh: Bidan Annisa Rahmawati)',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL (contoh: bidan-annisa)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Gelar Akademik & Profesi (contoh: S.Tr.Keb, Bdn)',
    },
    {
      name: 'strNumber',
      type: 'text',
      required: true,
      label: 'Nomor Surat Tanda Registrasi (STR) Kemenkes RI',
      admin: {
        description: 'Bukti legalitas tenaga kesehatan resmi Kemenkes untuk membangun E-E-A-T Google',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Profil Profesional Bidan',
    },
    {
      name: 'experienceYears',
      type: 'number',
      label: 'Pengalaman Praktik Klinis & Homecare (Tahun)',
    },
    {
      name: 'specialties',
      type: 'array',
      label: 'Peminatan & Sertifikasi Klinis',
      fields: [
        {
          name: 'specialty',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      label: 'Profil Singkat & Komitmen Pendampingan Tanpa Mom-Shaming',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif Tampil di Halaman Tim Bidan',
    },
  ],
}
