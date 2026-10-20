import type { Block } from 'payload'

export const GuaranteeBlock: Block = {
  slug: 'guarantee',
  labels: {
    singular: 'Blok Garansi Kepuasan (Risk Reversal)',
    plural: 'Blok Garansi Kepuasan (Risk Reversal)',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: '🛡️ Komitmen Kualitas Kala',
      label: 'Badge Header',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Puas 100% atau Sesi Pengganti Gratis',
      label: 'Judul Garansi Penjualan',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue: 'Kami percaya pada kelembutan dan kualitas dedikasi bidan kami. Jika Bunda merasa kurang puas pada sesi pertama, kami sediakan sesi evaluasi pengganti gratis demi ketenangan buah hati Anda.',
      label: 'Teks Penjelasan Garansi',
    },
    {
      name: 'note',
      type: 'text',
      defaultValue: '*Kepercayaan dan ketenangan keluarga Bunda adalah prioritas utama kami.',
      label: 'Catatan Kaki Garansi (Opsional)',
    },
  ],
}
