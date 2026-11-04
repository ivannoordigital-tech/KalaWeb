import type { CollectionConfig } from 'payload'
import { getUserRole } from '../access/roles'

/**
 * DEP-001 & DEP-002: Koleksi Riwayat Build & Deploy Cloudflare Pages
 * Menyimpan status riwayat build nyata agar tim editor mengetahui
 * apakah perubahan telah sukses tayang di publik atau mengalami kegagalan build.
 */
export const Deployments: CollectionConfig = {
  slug: 'deployments',
  labels: {
    singular: 'Riwayat Deploy',
    plural: 'Riwayat Deploy Website',
  },
  admin: {
    group: 'Pengaturan & Bantuan',
    useAsTitle: 'triggerReason',
    defaultColumns: ['status', 'triggerReason', 'url', 'durationSeconds', 'createdAt'],
    description: 'Catatan riwayat build Cloudflare Pages dan sinkronisasi konten publik.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => {
      const role = getUserRole(user)
      return role === 'superadmin' || role === 'operator'
    },
    update: ({ req: { user } }) => {
      const role = getUserRole(user)
      return role === 'superadmin' || role === 'operator'
    },
    delete: ({ req: { user } }) => {
      const role = getUserRole(user)
      return role === 'superadmin'
    },
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'queued',
      options: [
        { label: '🕒 Dalam Antrean (Queued)', value: 'queued' },
        { label: '⚙️ Sedang Dibangun (Building)', value: 'building' },
        { label: '✅ Berhasil Tayang (Success)', value: 'success' },
        { label: '❌ Gagal Build (Failed)', value: 'failed' },
        { label: '⏹️ Dibatalkan (Canceled)', value: 'canceled' },
      ],
      admin: {
        description: 'Status aktual proses build di Cloudflare Pages.',
      },
    },
    {
      name: 'triggerReason',
      type: 'text',
      required: true,
      label: 'Penyebab Build (Trigger)',
      admin: {
        description: 'Aksi konten yang memicu build. Contoh: [PUBLISH] Articles (bayi-kolik)',
      },
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL Pratinjau Deploy (Cloudflare)',
      admin: {
        description: 'Tautan spesifik untuk pratinjau commit/build ini.',
      },
    },
    {
      name: 'cloudflareDeploymentId',
      type: 'text',
      label: 'Cloudflare Deployment ID',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'environment',
      type: 'select',
      defaultValue: 'production',
      options: [
        { label: 'Production', value: 'production' },
        { label: 'Preview', value: 'preview' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'durationSeconds',
      type: 'number',
      label: 'Durasi Build (Detik)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
      label: 'Waktu Mulai Build',
    },
    {
      name: 'completedAt',
      type: 'date',
      label: 'Waktu Selesai Build',
    },
    {
      name: 'errorMessage',
      type: 'textarea',
      label: 'Pesan Kesalahan Build (Jika Gagal)',
      admin: {
        condition: (data) => data?.status === 'failed',
      },
    },
  ],
}
