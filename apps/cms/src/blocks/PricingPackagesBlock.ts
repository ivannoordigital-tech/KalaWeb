import type { Block } from 'payload'

export const PricingPackagesBlock: Block = {
  slug: 'pricing',
  labels: {
    singular: 'Blok Tabel Paket & Harga (Pricing)',
    plural: 'Blok Tabel Paket & Harga (Pricing)',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Header (Opsional)',
      admin: { placeholder: 'Pilihan Paket Perawatan Terbaik' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Pilihan Paket Perawatan Buah Hati & Bunda',
      label: 'Judul Seksi Paket',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Ditangani 100% oleh bidan resmi ber-STR Kemenkes menggunakan produk organik steril.',
      label: 'Sub-judul Penjelas',
    },
    {
      name: 'packages',
      type: 'array',
      required: true,
      label: 'Daftar Paket Penjualan',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nama Paket',
          admin: { width: '50%', placeholder: 'Baby Massage Homecare' },
        },
        {
          name: 'target',
          type: 'text',
          label: 'Target Pasien',
          admin: { width: '50%', placeholder: 'Bayi 0 - 12 Bulan' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'price',
              type: 'text',
              required: true,
              label: 'Harga Promo / Final',
              admin: { width: '33%', placeholder: 'Rp60.000' },
            },
            {
              name: 'originalPrice',
              type: 'text',
              label: 'Harga Coret Asli',
              admin: { width: '33%', placeholder: 'Rp120.000' },
            },
            {
              name: 'duration',
              type: 'text',
              label: 'Durasi Tindakan',
              admin: { width: '33%', placeholder: '± 40 Menit' },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Deskripsi Singkat Paket',
          admin: { placeholder: 'Pijat lembut menenangkan untuk meredakan kolik dan membantu si kecil tidur lelap.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'isPopular',
              type: 'checkbox',
              defaultValue: false,
              label: 'Sorot sebagai Paket Terpopuler',
              admin: { width: '50%' },
            },
            {
              name: 'popularBadge',
              type: 'text',
              label: 'Teks Badge Sorotan',
              admin: { width: '50%', placeholder: 'Terpopuler ⭐' },
            },
          ],
        },
        {
          name: 'features',
          type: 'array',
          label: 'Daftar Fasilitas / Manfaat Didapat',
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
              label: 'Fasilitas',
              admin: { placeholder: 'Minyak telon food-grade steril' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaText',
              type: 'text',
              defaultValue: 'Reservasi Paket Ini',
              label: 'Teks Tombol WhatsApp',
              admin: { width: '50%' },
            },
            {
              name: 'refCode',
              type: 'text',
              label: 'Ref Code WhatsApp',
              admin: { width: '50%', placeholder: 'PKG-BABY-MASSAGE' },
            },
          ],
        },
      ],
    },
  ],
}
