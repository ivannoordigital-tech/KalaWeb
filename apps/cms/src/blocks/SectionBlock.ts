import type { Block } from 'payload'
import { columnBlocks } from './leafBlocks'
import { blockSettingsFields } from './commonBlockFields'

export const SectionBlock: Block = {
  slug: 'section',
  labels: {
    singular: '🧱 Seksi & Kolom (Container)',
    plural: '🧱 Seksi & Kolom (Container)',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Nama Seksi (Penanda Admin)',
      admin: {
        description: 'Hanya tampil di admin untuk memudahkan navigasi, tidak tampil di website.',
        placeholder: 'Seksi Paket & Harga',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'background',
          type: 'select',
          defaultValue: 'white',
          label: 'Latar Belakang',
          admin: { width: '50%' },
          options: [
            { label: 'Putih Bersih', value: 'white' },
            { label: 'Krem Hangat', value: 'cream' },
            { label: 'Peach Lembut', value: 'peach' },
            { label: 'Gradasi Peach', value: 'gradient' },
          ],
        },
        {
          name: 'padding',
          type: 'select',
          defaultValue: 'normal',
          label: 'Jarak Atas-Bawah',
          admin: { width: '50%' },
          options: [
            { label: 'Tanpa Jarak', value: 'none' },
            { label: 'Rapat', value: 'compact' },
            { label: 'Normal', value: 'normal' },
            { label: 'Longgar', value: 'spacious' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'maxWidth',
          type: 'select',
          defaultValue: 'normal',
          label: 'Lebar Maksimal Konten',
          admin: { width: '50%' },
          options: [
            { label: 'Ramping (896px)', value: 'narrow' },
            { label: 'Normal (1152px)', value: 'normal' },
            { label: 'Lebar (1280px)', value: 'wide' },
            { label: 'Penuh Layar', value: 'full' },
          ],
        },
        {
          name: 'gap',
          type: 'select',
          defaultValue: 'normal',
          label: 'Jarak Antar Kolom',
          admin: { width: '50%' },
          options: [
            { label: 'Rapat', value: 'compact' },
            { label: 'Normal', value: 'normal' },
            { label: 'Longgar', value: 'spacious' },
          ],
        },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      label: 'Kolom & Isi',
      labels: { singular: 'Kolom', plural: 'Kolom' },
      admin: {
        description:
          'Tambahkan 1–4 kolom. Setiap kolom bisa diisi blok apa pun (judul, teks, gambar, tombol, video, dsb).',
      },
      fields: [
        {
          name: 'width',
          type: 'select',
          defaultValue: 'full',
          label: 'Lebar Kolom (Desktop)',
          options: [
            { label: 'Penuh (1 kolom)', value: 'full' },
            { label: '1/2', value: 'half' },
            { label: '1/3', value: 'third' },
            { label: '2/3', value: 'twoThirds' },
            { label: '1/4', value: 'quarter' },
          ],
        },
        {
          name: 'content',
          type: 'blocks',
          label: 'Isi Kolom',
          blocks: columnBlocks,
        },
      ],
    },
    ...blockSettingsFields,
  ],
}
