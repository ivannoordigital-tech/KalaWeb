import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Blok Testimoni & Review Bunda',
    plural: 'Blok Testimoni & Review Bunda',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Kata Mereka yang Sudah Merasakan Sentuhan Kala',
      label: 'Judul Seksi Testimoni',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Ulasan asli dan terverifikasi dari orang tua yang memilih kenyamanan homecare kami.',
      label: 'Sub-judul Penjelas',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Daftar Ulasan Pasien',
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          label: 'Isi Kutipan Ulasan',
          admin: { placeholder: 'Setelah sesi pertama baby massage, putri saya yang 2 bulan langsung tidur lebih nyenyak dan tidak rewel lagi.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'author',
              type: 'text',
              required: true,
              label: 'Nama Bunda / Ayah',
              admin: { width: '33%', placeholder: 'Bunda Maharani' },
            },
            {
              name: 'role',
              type: 'text',
              label: 'Keterangan Anak',
              admin: { width: '33%', placeholder: 'Mama dari Baby Zahra (2 bulan)' },
            },
            {
              name: 'area',
              type: 'text',
              label: 'Wilayah Tempat Tinggal',
              admin: { width: '33%', placeholder: 'Surabaya Timur' },
            },
          ],
        },
      ],
    },
  ],
}
