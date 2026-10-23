import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { buildSeoFields } from '../fields/seoFields'
import { canManageMidwives, getUserRole } from '../access/roles'

export const Midwives: CollectionConfig = {
  slug: 'midwives',
  labels: {
    singular: 'Bidan & Tenaga Medis',
    plural: 'Bidan & Tenaga Medis',
  },
  admin: {
    group: '🏥 Data Layanan & Klinik',
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'strNumber', 'experienceYears', 'active'],
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'author';
    },
  },
  access: {
    read: () => true,
    create: canManageMidwives,
    update: canManageMidwives,
    delete: canManageMidwives,
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
      label: 'Nama Lengkap Bidan',
      admin: {
        description: 'Contoh: Bidan Annisa Rahmawati',
        placeholder: 'Bidan Annisa Rahmawati',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Gelar Akademik & Profesi',
      admin: {
        description: 'Contoh: S.Tr.Keb, Bdn',
        placeholder: 'S.Tr.Keb, Bdn',
      },
    },
    {
      name: 'strNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Nomor Surat Tanda Registrasi (STR) Kemenkes RI (Unik)',
      admin: {
        description: 'Bukti legalitas nakes resmi Kemenkes untuk membangun otoritas medis (E-E-A-T) di Google dan foreign key bot klinik.',
        placeholder: 'Contoh: 160252120-3456789',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Profil Profesional Bidan',
      admin: {
        description: 'Unggah foto profil seragam bidan (resolusi tajam, rasio 1:1 atau 3:4).',
      },
    },
    {
      name: 'experienceYears',
      type: 'number',
      label: 'Pengalaman Praktik Klinis & Homecare (Tahun)',
      admin: {
        description: 'Lama pengalaman menangani ibu dan anak. Contoh: 5',
        placeholder: '5',
      },
    },
    {
      name: 'specialties',
      type: 'array',
      label: 'Keahlian Klinis & Sertifikasi',
      admin: {
        description: 'Daftar kompetensi khusus yang dimiliki bidan.',
      },
      fields: [
        {
          name: 'specialty',
          type: 'text',
          required: true,
          label: 'Keahlian / Sertifikasi',
          admin: {
            placeholder: 'Contoh: Pijat Oksitosin & Konselor Menyusui',
          },
        },
      ],
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      label: 'Profil Singkat & Komitmen Pendampingan',
      admin: {
        description: 'Komitmen pelayanan hangat tanpa mom-shaming kepada Bunda dan si kecil.',
      },
    },
    // Sidebar Fields
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL (/tim-bidan/[slug])',
      admin: {
        position: 'sidebar',
        description: 'Huruf kecil dan strip. Contoh: bidan-annisa',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Status Aktif (Tampil di Website)',
      admin: {
        position: 'sidebar',
        description: 'Hapus centang jika bidan sedang cuti atau tidak bertugas aktif.',
      },
    },
    // Reusable SEO Fields
    buildSeoFields({ titleSourceField: 'name', descriptionSourceField: 'bio' }),
  ],
}
