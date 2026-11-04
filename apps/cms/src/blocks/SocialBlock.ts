import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const SocialBlock: Block = {
  slug: 'social',
  labels: {
    singular: 'Media Sosial & Tombol Bagikan',
    plural: 'Media Sosial & Tombol Bagikan',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'icons',
      required: true,
      label: 'Jenis Tampilan',
      options: [
        { label: 'Ikon Media Sosial', value: 'icons' },
        { label: 'Tombol Bagikan Halaman', value: 'share' },
        { label: 'Keduanya', value: 'both' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Judul Seksi (Opsional)',
      admin: { placeholder: 'Ikuti keseharian Bunda & si kecil di Kala' },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Akun Media Sosial',
      admin: {
        description: 'Kosongkan untuk mengambil tautan dari Pengaturan Situs (Site Settings).',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          label: 'Platform',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Email', value: 'email' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Tautan Akun',
          admin: { placeholder: 'https://instagram.com/kalababyspa' },
        },
      ],
    },
    {
      name: 'shareLabel',
      type: 'text',
      defaultValue: 'Bagikan halaman ini',
      label: 'Teks Tombol Bagikan',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'align',
          type: 'select',
          defaultValue: 'center',
          label: 'Perataan',
          admin: { width: '50%' },
          options: [
            { label: 'Kiri', value: 'left' },
            { label: 'Tengah', value: 'center' },
          ],
        },
        {
          name: 'background',
          type: 'select',
          defaultValue: 'white',
          label: 'Latar Belakang',
          admin: { width: '50%' },
          options: [
            { label: 'Putih', value: 'white' },
            { label: 'Krem', value: 'cream' },
            { label: 'Peach', value: 'peach' },
          ],
        },
      ],
    },
    ...blockSettingsFields,
  ],
}
