import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const CountdownBlock: Block = {
  slug: 'countdown',
  labels: {
    singular: 'Hitung Mundur Promo (Countdown)',
    plural: 'Hitung Mundur Promo (Countdown)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Promo Berakhir Dalam',
      label: 'Judul Hitung Mundur',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Penjelasan Singkat (Opsional)',
      admin: { placeholder: 'Harga spesial hanya sampai akhir bulan ini.' },
    },
    {
      name: 'targetDate',
      type: 'date',
      required: true,
      label: 'Tanggal & Jam Berakhir',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Gunakan waktu WIB (Asia/Jakarta).',
      },
    },
    {
      name: 'expiredText',
      type: 'text',
      defaultValue: 'Promo telah berakhir. Hubungi kami untuk penawaran terbaru.',
      label: 'Teks Setelah Waktu Habis',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaText',
          type: 'text',
          label: 'Teks Tombol (Opsional)',
          admin: { width: '50%', placeholder: 'Ambil Promo Sekarang' },
        },
        {
          name: 'background',
          type: 'select',
          defaultValue: 'peach',
          label: 'Latar Belakang',
          admin: { width: '50%' },
          options: [
            { label: 'Peach', value: 'peach' },
            { label: 'Krem', value: 'cream' },
            { label: 'Gelap (Kontras Tinggi)', value: 'dark' },
          ],
        },
      ],
    },
    {
      name: 'ctaMessage',
      type: 'text',
      label: 'Pesan Otomatis WhatsApp (Opsional)',
      admin: {
        condition: (data: any) => Boolean(data?.ctaText),
        placeholder: 'Halo Bu Bidan, saya mau ambil promo yang masih berlaku',
      },
    },
    ...blockSettingsFields,
  ],
}
