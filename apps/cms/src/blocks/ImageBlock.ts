import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const ImageBlock: Block = {
  slug: 'image',
  labels: {
    singular: 'Gambar Tunggal',
    plural: 'Gambar Tunggal',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'File Gambar',
      admin: {
        description: 'Unggah foto (WebP/JPG/PNG). Jika kosong, isi URL cadangan di bawah.',
      },
    },
    {
      name: 'imageUrlFallback',
      type: 'text',
      label: 'URL Gambar Cadangan (Opsional)',
      admin: {
        placeholder: '/images/contoh.webp',
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text (Wajib untuk Aksesibilitas & SEO)',
      admin: {
        description: 'Deskripsikan isi gambar. Contoh: Bidan memijat bayi dengan lembut.',
      },
      validate: (val: any, { siblingData }: any) => {
        const hasImage = Boolean(siblingData?.image || siblingData?.imageUrlFallback)
        if (hasImage && !val) {
          return 'Alt Text wajib diisi karena gambar akan ditampilkan.'
        }
        return true
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Keterangan Gambar (Opsional)',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Tautan Saat Gambar Diklik (Opsional)',
      admin: {
        placeholder: '/layanan/bundle-duo',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'width',
          type: 'select',
          defaultValue: 'normal',
          label: 'Lebar Gambar',
          admin: { width: '50%' },
          options: [
            { label: 'Normal (Maks 896px)', value: 'normal' },
            { label: 'Lebar (Maks 1152px)', value: 'wide' },
            { label: 'Penuh Layar', value: 'full' },
          ],
        },
        {
          name: 'align',
          type: 'select',
          defaultValue: 'center',
          label: 'Perataan',
          admin: { width: '50%' },
          options: [
            { label: 'Tengah', value: 'center' },
            { label: 'Kiri', value: 'left' },
            { label: 'Kanan', value: 'right' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ratio',
          type: 'select',
          defaultValue: 'auto',
          label: 'Rasio Gambar',
          admin: { width: '50%' },
          options: [
            { label: 'Otomatis (Sesuai File)', value: 'auto' },
            { label: '16:9 (Lanskap)', value: '16:9' },
            { label: '4:3', value: '4:3' },
            { label: '1:1 (Persegi)', value: '1:1' },
          ],
        },
        {
          name: 'rounded',
          type: 'select',
          defaultValue: 'md',
          label: 'Sudut Gambar',
          admin: { width: '50%' },
          options: [
            { label: 'Tajam', value: 'none' },
            { label: 'Sedikit Melengkung', value: 'md' },
            { label: 'Sangat Melengkung', value: 'lg' },
          ],
        },
      ],
    },
    ...blockSettingsFields,
  ],
}
