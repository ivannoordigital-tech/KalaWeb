import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

/**
 * Banner promo reservasi pertama.
 * Dirancang khusus untuk homepage agar tampilan banner promo tetap sama
 * seperti desain statis lama, tetapi seluruh isinya bisa diedit dari CMS.
 */
export const PromoBannerBlock: Block = {
  slug: 'promoBanner',
  labels: {
    singular: '🎁 Banner Promo Reservasi (Beranda)',
    plural: '🎁 Banner Promo Reservasi (Beranda)',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Penawaran Reservasi Pertama',
      label: 'Badge Atas Banner',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Promo treatment Kala',
      label: 'Judul Promo',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Deskripsi Promo',
      admin: { placeholder: 'Khusus Bunda di Surabaya & Sidoarjo.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'text',
          label: 'Harga Promo',
          admin: { width: '33%', placeholder: 'Rp60.000' },
        },
        {
          name: 'originalPrice',
          type: 'text',
          label: 'Harga Coret Asli',
          admin: { width: '33%', placeholder: 'Rp80.000' },
        },
        {
          name: 'discountBadge',
          type: 'text',
          label: 'Badge Diskon',
          admin: { width: '34%', placeholder: 'Hemat 25%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'note',
          type: 'text',
          label: 'Catatan Jadwal',
          admin: { width: '50%', placeholder: 'Konfirmasi jadwal dan area via WhatsApp.' },
        },
        {
          name: 'capacityNote',
          type: 'text',
          label: 'Catatan Kuota',
          admin: {
            width: '50%',
            placeholder: 'Kuota harian maksimal 5 sesi agar setiap kunjungan tetap fokus dan higienis.',
          },
        },
      ],
    },
    {
      name: 'serviceName',
      type: 'text',
      label: 'Nama Layanan Promo',
      admin: { placeholder: 'Kala Baby: Pijat Ceria Newborn' },
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Ambil Promo via WhatsApp',
      label: 'Teks Tombol WhatsApp',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'refCode',
          type: 'text',
          label: 'Kode Pelacak Ref WhatsApp',
          admin: { width: '50%', placeholder: 'KALA-PROMO-INTRO' },
        },
        {
          name: 'message',
          type: 'text',
          label: 'Template Pesan WhatsApp',
          admin: {
            width: '50%',
            placeholder: 'Halo Bu Bidan, saya mau ambil promo treatment Kala',
          },
        },
      ],
    },
    ...blockSettingsFields,
  ],
}
