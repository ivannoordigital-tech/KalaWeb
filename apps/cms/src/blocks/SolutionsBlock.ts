import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const SolutionsBlock: Block = {
  slug: 'solutions',
  labels: {
    singular: 'Blok Solusi Medis & Manfaat',
    plural: 'Blok Solusi Medis & Manfaat',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      label: 'Gaya Tampilan Blok',
      options: [
        { label: 'Standar — Solusi & Manfaat', value: 'default' },
        { label: 'Manfaat Bernomor — Khusus Beranda', value: 'benefits' },
        { label: 'Nilai Pembeda — Khusus Beranda', value: 'differentiators' },
      ],
      admin: {
        description:
          'Pilih gaya khusus beranda agar tampilan section manfaat / keunggulan tetap sama seperti desain lama.',
      },
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Atas (Opsional)',
      admin: { placeholder: 'Solusi untuk Bunda dan Si Kecil' },
    },
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
          name: 'number',
          type: 'text',
          label: 'Nomor Urut (Opsional)',
          admin: { width: '20%', placeholder: '01' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Nama Manfaat / Solusi',
          admin: { width: '60%', placeholder: 'Tidur Lebih Nyenyak & Teratur' },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subjudul / Kategori (Opsional)',
          admin: { placeholder: 'Tenaga Kesehatan Berlatar Pendidikan Resmi' },
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
      name: 'note',
      type: 'textarea',
      label: 'Catatan Kaki (Opsional)',
      admin: {
        placeholder:
          'Setiap bayi memiliki respons yang berbeda terhadap pijat. Treatment Kala bertujuan mendukung relaksasi, stimulasi, dan kenyamanan si kecil, bukan menggantikan pemeriksaan atau penanganan medis.',
      },
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
    ...blockSettingsFields,
  ],
}
