import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const LeadFormBlock: Block = {
  slug: 'leadForm',
  labels: {
    singular: 'Formulir Pemesanan (Lead Form)',
    plural: 'Formulir Pemesanan (Lead Form)',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Isi Data untuk Reservasi Cepat',
      label: 'Judul Formulir',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Penjelasan Singkat (Opsional)',
      admin: {
        placeholder: 'Isi data di bawah, lalu kirim lewat WhatsApp. Bidan kami akan membalas dalam 5 menit.',
      },
    },
    {
      name: 'fields',
      type: 'select',
      hasMany: true,
      label: 'Kolom yang Ditampilkan',
      defaultValue: ['name', 'phone', 'service', 'date', 'message'],
      options: [
        { label: 'Nama Bunda', value: 'name' },
        { label: 'Nomor WhatsApp', value: 'phone' },
        { label: 'Email (Opsional)', value: 'email' },
        { label: 'Layanan yang Diminati', value: 'service' },
        { label: 'Tanggal yang Diinginkan', value: 'date' },
        { label: 'Catatan / Keluhan', value: 'message' },
      ],
      admin: {
        description:
          'Kolom "Nama" dan "Nomor WhatsApp" selalu ditampilkan karena dibutuhkan untuk menghubungi Bunda.',
      },
    },
    {
      name: 'serviceOptions',
      type: 'array',
      label: 'Pilihan Layanan (Opsional)',
      admin: {
        description:
          'Kosongkan untuk mengambil daftar layanan aktif otomatis dari koleksi Layanan.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Nama Layanan',
          admin: { placeholder: 'Kala Bundle Duo' },
        },
      ],
    },
    {
      name: 'submitLabel',
      type: 'text',
      defaultValue: 'Kirim & Chat via WhatsApp',
      label: 'Teks Tombol Kirim',
    },
    {
      name: 'consentText',
      type: 'textarea',
      defaultValue:
        'Dengan mengirim formulir ini, Bunda setuju dihubungi oleh bidan Kala melalui WhatsApp terkait reservasi.',
      label: 'Teks Persetujuan (Consent)',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'background',
          type: 'select',
          defaultValue: 'cream',
          label: 'Latar Belakang',
          admin: { width: '50%' },
          options: [
            { label: 'Putih', value: 'white' },
            { label: 'Krem', value: 'cream' },
            { label: 'Peach', value: 'peach' },
          ],
        },
        {
          name: 'note',
          type: 'text',
          label: 'Catatan Kecil di Bawah Formulir',
          admin: { width: '50%', placeholder: 'Data Bunda hanya dipakai untuk reservasi.' },
        },
      ],
    },
    ...blockSettingsFields,
  ],
}
