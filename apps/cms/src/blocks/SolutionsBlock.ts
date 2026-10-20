import type { Block } from 'payload'

export const SolutionsBlock: Block = {
  slug: 'solutions',
  labels: {
    singular: 'Blok Solusi Medis & Manfaat',
    plural: 'Blok Solusi Medis & Manfaat',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Apa yang Berubah Setelah Perawatan di Kala?',
      label: 'Judul Seksi Solusi',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Bukan sekadar pijat biasa, melainkan stimulasi terapeutik yang menenangkan.',
      label: 'Sub-judul Penjelas',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Daftar Solusi / Manfaat',
      fields: [
        {
          name: 'icon',
          type: 'text',
          defaultValue: '😴',
          label: 'Emoji / Ikon',
          admin: { width: '20%' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Nama Manfaat / Solusi',
          admin: { width: '80%', placeholder: 'Tidur Lebih Nyenyak & Teratur' },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Penjelasan Medis & Keunggulan',
          admin: { placeholder: 'Pijat bayi merangsang produksi melatonin alami — 87% bayi tidur lebih lama.' },
        },
      ],
    },
    {
      name: 'highlightQuote',
      type: 'group',
      label: 'Kutipan Penegas Solusi (Opsional)',
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: 'Kutipan Testimoni Singkat',
          admin: { placeholder: 'Setelah massage, bayi saya yang dulu kolik berat sekarang jarang rewel!' },
        },
        {
          name: 'author',
          type: 'text',
          label: 'Nama Bunda',
          admin: { placeholder: 'Bunda Risa, Mama dari Baby Keenan (2 bulan)' },
        },
      ],
    },
  ],
}
