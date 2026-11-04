import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const ButtonBlock: Block = {
  slug: 'button',
  labels: {
    singular: 'Tombol Aksi (Button)',
    plural: 'Tombol Aksi (Button)',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      defaultValue: 'Konsultasi Gratis via WhatsApp',
      label: 'Teks Tombol',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'action',
          type: 'select',
          defaultValue: 'whatsapp',
          label: 'Aksi Tombol',
          admin: { width: '50%' },
          options: [
            { label: '💬 Buka WhatsApp', value: 'whatsapp' },
            { label: '🔗 Buka Tautan / Halaman', value: 'url' },
          ],
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          label: 'Gaya Tombol',
          admin: { width: '50%' },
          options: [
            { label: 'Hijau WhatsApp (Utama)', value: 'primary' },
            { label: 'Terracotta (Sekunder)', value: 'secondary' },
            { label: 'Garis Tepi (Outline)', value: 'outline' },
          ],
        },
      ],
    },
    {
      name: 'whatsappMessage',
      type: 'text',
      label: 'Pesan Otomatis WhatsApp (Opsional)',
      admin: {
        condition: (data: any) => data?.action !== 'url',
        placeholder: 'Halo Bu Bidan, saya mau tanya paket perawatan',
      },
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL Tujuan',
      admin: {
        condition: (data: any) => data?.action === 'url',
        placeholder: '/layanan/bundle-duo atau https://...',
      },
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      defaultValue: false,
      label: 'Buka di Tab Baru',
      admin: {
        condition: (data: any) => data?.action === 'url',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'md',
          label: 'Ukuran Tombol',
          admin: { width: '50%' },
          options: [
            { label: 'Kecil', value: 'sm' },
            { label: 'Sedang (Rekomendasi)', value: 'md' },
            { label: 'Besar', value: 'lg' },
          ],
        },
        {
          name: 'align',
          type: 'select',
          defaultValue: 'center',
          label: 'Perataan',
          admin: { width: '50%' },
          options: [
            { label: 'Kiri', value: 'left' },
            { label: 'Tengah', value: 'center' },
            { label: 'Kanan', value: 'right' },
          ],
        },
      ],
    },
    {
      name: 'note',
      type: 'text',
      label: 'Catatan Kecil di Bawah Tombol (Opsional)',
      admin: {
        placeholder: '⚡ Balas cepat dalam 5 menit · Bebas mom-shaming',
      },
    },
    ...blockSettingsFields,
  ],
}
