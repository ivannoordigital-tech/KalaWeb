import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

/**
 * Tiga layanan unggulan di homepage.
 * Data layanan tetap diambil dari koleksi Services agar harga dan deskripsi
 * selalu sinkron dengan halaman /layanan.
 */
export const FeaturedServicesBlock: Block = {
  slug: 'featuredServices',
  labels: {
    singular: '🏷️ Layanan Unggulan (Beranda)',
    plural: '🏷️ Layanan Unggulan (Beranda)',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Menu Layanan Terfavorit',
      label: 'Badge Atas Seksi',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: '3 Layanan Unggulan Homecare Kala',
      label: 'Judul Seksi',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subjudul Seksi',
      admin: {
        placeholder:
          'Pilihan paling banyak dipesan oleh Bunda di Surabaya & Sidoarjo untuk memulihkan kebugaran ibu dan menstimulasi keceriaan si kecil.',
      },
    },
    {
      name: 'catalogTitle',
      type: 'text',
      label: 'Judul Kotak Katalog Lengkap',
      admin: { placeholder: 'Mencari Layanan Lain? Tersedia 39 Menu Lengkap' },
    },
    {
      name: 'catalogDescription',
      type: 'textarea',
      label: 'Deskripsi Kotak Katalog Lengkap',
      admin: {
        placeholder:
          'Mulai dari tindik telinga bayi steril, terapi uap (nebulizer saline), infrared moksa, pijat lahap makan anak, prenatal yoga hamil, hingga breast care laktasi.',
      },
    },
    {
      name: 'catalogCtaText',
      type: 'text',
      label: 'Teks Tombol Katalog',
      admin: { placeholder: 'Minta Katalog Lengkap 39 Menu via WhatsApp' },
    },
    {
      name: 'catalogCtaMessage',
      type: 'text',
      label: 'Pesan WhatsApp Katalog',
      admin: { placeholder: 'Halo Bu Bidan, boleh minta pricelist dan katalog lengkap layanan Kala?' },
    },
    {
      name: 'catalogRefCode',
      type: 'text',
      label: 'Ref Code Katalog',
      admin: { placeholder: 'KALA-KATALOG' },
    },
    ...blockSettingsFields,
  ],
}
