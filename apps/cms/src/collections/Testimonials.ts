import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { canManageTestimonials, getUserRole } from '../access/roles'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimoni Bunda',
    plural: 'Testimoni Bunda',
  },
  defaultSort: 'order',
  admin: {
    group: 'Layanan & Klinik',
    useAsTitle: 'author',
    defaultColumns: ['author', 'area', 'service', 'permissionGranted', 'active', 'externalRef', 'order'],
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'author';
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return {
        active: { equals: true },
        permissionGranted: { equals: true },
      };
    },
    create: canManageTestimonials,
    update: canManageTestimonials,
    delete: canManageTestimonials,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => {
        const isLive = Boolean(doc.active && doc.permissionGranted);
        const wasLive = Boolean(previousDoc?.active && previousDoc?.permissionGranted);
        if (isLive || wasLive) {
          triggerCloudflareDeploy({
            resource: 'Testimonials',
            action: isLive ? 'publish' : 'unpublish',
          });
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
      defaultValue: false,
      label: 'Sudah Memperoleh Izin Publikasi Resmi dari Pasien (Etika Medis)',
      admin: {
        description: 'Wajib dicentang sebelum testimoni boleh tampil di website. Biarkan kosong selama izin pasien belum terverifikasi.',
      },
    },
    // MED-006: Catatan Verifikasi Persetujuan Medis (Patient Consent Audit)
    {
      name: 'consentMethod',
      type: 'select',
      defaultValue: 'whatsapp',
      label: 'Metode Persetujuan Pasien (Informed Consent)',
      admin: {
        condition: (data) => Boolean(data?.permissionGranted),
        description: 'Bentuk bukti persetujuan orang tua/pasien untuk penayangan testimoni.',
      },
      options: [
        { label: '💬 Chat WhatsApp (Tangkapan Layar/Pesan)', value: 'whatsapp' },
        { label: '📝 Formulir Tertulis / Surat Fisik', value: 'written' },
        { label: '🌐 Formulir Ulasan Online Resmi', value: 'online_form' },
      ],
    },
    {
      name: 'consentDate',
      type: 'date',
      label: 'Tanggal Persetujuan Pasien Diberikan',
      admin: {
        condition: (data) => Boolean(data?.permissionGranted),
      },
    },
    // Sidebar
    {
      name: 'externalRef',
      type: 'text',
      unique: true,
      label: 'ID Referensi Eksternal (Bot / Booking ID)',
      admin: {
        position: 'sidebar',
        description: 'ID unik dari booking bot WA (contoh: booking-20261023-001) untuk mencegah duplikasi webhook (idempotency).',
      },
    },
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
      defaultValue: false,
      label: 'Status Aktif (Tampil di Website)',
      admin: {
        position: 'sidebar',
        description: 'Centang HANYA setelah admin memverifikasi kelayakan dan izin publikasi ulasan.',
      },
    },
  ],
}
