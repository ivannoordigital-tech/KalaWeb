import type { Block } from 'payload'

export const FaqAccordionBlock: Block = {
  slug: 'faq',
  labels: {
    singular: 'Blok Tanya Jawab (FAQ Accordion)',
    plural: 'Blok Tanya Jawab (FAQ Accordion)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Pertanyaan yang Sering Diajukan Bunda',
      label: 'Judul Seksi FAQ',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Jawaban transparan seputar kenyamanan dan higienitas homecare kami.',
      label: 'Sub-judul Penjelas',
    },
    {
      name: 'faqs',
      type: 'array',
      required: true,
      label: 'Daftar Tanya Jawab',
      fields: [
        {
          name: 'q',
          type: 'text',
          required: true,
          label: 'Pertanyaan',
          admin: { placeholder: 'Kapan waktu terbaik untuk pijat bayi?' },
        },
        {
          name: 'a',
          type: 'textarea',
          required: true,
          label: 'Jawaban Bidan',
          admin: { placeholder: 'Paling aman dilakukan di antara jadwal minum (sekitar 45 menit setelah menyusui).' },
        },
      ],
    },
  ],
}
