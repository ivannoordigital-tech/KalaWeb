import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: {
    singular: 'Blok Galeri Foto (Dokumentasi Layanan)',
    plural: 'Blok Galeri Foto (Dokumentasi Layanan)',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Dokumentasi Kala',
      label: 'Badge Header (Di atas judul)',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Momen Nyaman & Ceria Si Kecil Bersama Bidan',
      label: 'Judul Seksi Galeri',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Dokumentasi asli kenyamanan dan kehangatan penanganan bidan resmi Kala di rumah para Bunda di Surabaya & Sidoarjo.',
      label: 'Subjudul Penjelas',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          options: [
            { label: '2 Kolom (Foto Besar)', value: '2' },
            { label: '3 Kolom (Standar Seimbang)', value: '3' },
            { label: '4 Kolom (Banyak Foto)', value: '4' },
          ],
          label: 'Jumlah Kolom Tampilan',
          admin: { width: '50%' },
        },
        {
          name: 'bgStyle',
          type: 'select',
          defaultValue: 'white',
          options: [
            { label: 'Putih Bersih', value: 'white' },
            { label: 'Krem Hangat', value: 'warm' },
          ],
          label: 'Warna Latar Belakang',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      label: 'Daftar Foto Galeri',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'File Foto',
        },
        {
          name: 'imageUrlFallback',
          type: 'text',
          label: 'URL Foto Cadangan (Jika tidak upload file)',
          admin: { placeholder: 'https://images.unsplash.com/...' },
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Keterangan Singkat Foto (Opsional)',
          admin: { placeholder: 'Pijat kolik meredakan perut begah Baby Zayn' },
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Tag / Label Foto (Opsional)',
          admin: { placeholder: 'Baby Massage · 1 Bulan' },
        },
      ],
    },
  ],
}
