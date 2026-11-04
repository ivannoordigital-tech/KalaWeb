import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const HeadingBlock: Block = {
  slug: 'heading',
  labels: {
    singular: 'Judul Bagian (Heading)',
    plural: 'Judul Bagian (Heading)',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Label Kecil di Atas Judul (Opsional)',
      admin: {
        placeholder: 'Layanan Homecare',
        description: 'Teks pendek berwarna di atas judul, berguna sebagai penanda kategori.',
      },
    },
    {
      name: 'text',
      type: 'text',
      required: true,
      label: 'Teks Judul',
      admin: {
        placeholder: 'Pilihan Paket Perawatan Terbaik untuk Buah Hati',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subjudul / Penjelas (Opsional)',
      admin: {
        placeholder: 'Semua paket sudah termasuk konsultasi kebidanan gratis.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'level',
          type: 'select',
          defaultValue: 'h2',
          label: 'Tingkat Judul (SEO)',
          admin: {
            width: '33%',
            description: 'Satu halaman sebaiknya hanya punya satu H1 (biasanya di Hero).',
          },
          options: [
            { label: 'H2 — Bagian Utama', value: 'h2' },
            { label: 'H3 — Sub-bagian', value: 'h3' },
            { label: 'H4 — Sub-sub-bagian', value: 'h4' },
          ],
        },
        {
          name: 'size',
          type: 'select',
          defaultValue: 'md',
          label: 'Ukuran Tampilan',
          admin: { width: '33%' },
          options: [
            { label: 'Kecil', value: 'sm' },
            { label: 'Sedang (Rekomendasi)', value: 'md' },
            { label: 'Besar', value: 'lg' },
            { label: 'Sangat Besar', value: 'xl' },
          ],
        },
        {
          name: 'align',
          type: 'select',
          defaultValue: 'center',
          label: 'Perataan',
          admin: { width: '34%' },
          options: [
            { label: 'Tengah', value: 'center' },
            { label: 'Kiri', value: 'left' },
          ],
        },
      ],
    },
    ...blockSettingsFields,
  ],
}
