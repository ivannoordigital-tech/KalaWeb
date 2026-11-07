import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

/**
 * Area layanan homepage. Daftar wilayah disimpan langsung di blok agar admin
 * bisa menambah/menghapus area tanpa mengubah kode.
 */
export const CoverageAreaBlock: Block = {
  slug: 'coverageArea',
  labels: {
    singular: '📍 Area Layanan (Beranda)',
    plural: '📍 Area Layanan (Beranda)',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Jangkauan Homecare Langsung ke Rumah',
      label: 'Badge Atas Seksi',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Area Layanan Surabaya & Sidoarjo',
      label: 'Judul Seksi',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subjudul Seksi',
      admin: {
        placeholder:
          'Kala beroperasi murni sebagai layanan homecare tanpa antrean outlet fisik. Bidan profesional kami siap berkunjung langsung ke kediaman Anda di seluruh wilayah berikut:',
      },
    },
    {
      name: 'note',
      type: 'text',
      label: 'Catatan Bawah Daftar Area',
      admin: {
        placeholder:
          'Lokasi rumah Anda belum tercantum di atas? Hubungi admin untuk konfirmasi jangkauan dan ketersediaan terapis bidan.',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Cek Ketersediaan Bidan ke Rumah Saya',
      label: 'Teks Tombol WhatsApp',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaMessage',
          type: 'text',
          label: 'Pesan WhatsApp',
          admin: { width: '60%', placeholder: 'Halo Bu Bidan, saya mau tanya apakah lokasi saya dijangkau homecare Kala?' },
        },
        {
          name: 'refCode',
          type: 'text',
          label: 'Ref Code',
          admin: { width: '40%', placeholder: 'KALA-AREA-CHECK' },
        },
      ],
    },
    {
      name: 'areas',
      type: 'array',
      required: true,
      label: 'Daftar Wilayah Layanan',
      fields: [
        {
          name: 'region',
          type: 'text',
          required: true,
          label: 'Nama Wilayah',
          admin: { width: '40%', placeholder: 'Surabaya Barat' },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          label: 'Slug Halaman Area',
          admin: { width: '30%', placeholder: 'surabaya-barat' },
        },
        {
          name: 'areas',
          type: 'textarea',
          required: true,
          label: 'Daftar Kecamatan',
          admin: { width: '100%', placeholder: 'Wiyung, Sambikerep, Lakarsantri, ...' },
        },
      ],
    },
    ...blockSettingsFields,
  ],
}
