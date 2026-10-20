import type { Block } from 'payload'

export const CallToActionBlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'Blok Penutup & WhatsApp CTA (Urgent Action)',
    plural: 'Blok Penutup & WhatsApp CTA (Urgent Action)',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Langkah Pertama untuk Si Kecil',
      label: 'Badge Header',
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      defaultValue: 'Berikan Si Kecil Awal Terbaik dalam Hidupnya',
      label: 'Headline Penutup Penjualan',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Konsultasi gratis via WhatsApp sekarang. Bidan kami siap hadir ke rumah Anda di Surabaya & Sidoarjo.',
      label: 'Deskripsi Penutup',
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: '💬 Chat WhatsApp Sekarang',
      label: 'Teks Tombol WhatsApp',
    },
    {
      name: 'buttonMessage',
      type: 'text',
      label: 'Pesan Otomatis WhatsApp (Opsional)',
      admin: { placeholder: 'Halo Bidan Kala, saya mau booking homecare' },
    },
    {
      name: 'footnote',
      type: 'text',
      defaultValue: '⏰ Balas cepat dalam 5 menit · Bebas mom-shaming',
      label: 'Catatan Kaki Bawah Tombol',
    },
  ],
}
