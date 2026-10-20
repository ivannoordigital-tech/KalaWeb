import type { GlobalConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Pengaturan Situs',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        triggerCloudflareDeploy({ resource: 'SiteSettings', action: 'update_settings' });
      },
    ],
  },
  fields: [
    // Kontak & Operasional
    {
      name: 'whatsappNumber',
      type: 'text',
      required: true,
      label: 'Nomor WhatsApp Resmi (Format: 628xxx)',
      admin: {
        description: 'Format baku tanpa spasi, tanda + atau 0 di depan. Contoh: 6281234567890',
        placeholder: '6281234567890',
      },
      validate: (val: any) => {
        if (!val) return 'Nomor WhatsApp wajib diisi';
        if (!/^628[0-9]{8,12}$/.test(val)) {
          return 'Format salah! Nomor WhatsApp harus diawali 628 (tanpa + atau 0) dengan 10–14 digit angka.';
        }
        return true;
      },
    },
    {
      name: 'whatsappNumberFormatted',
      type: 'text',
      label: 'Nomor WA Tampilan di Website (+62 8xx-xxx-xxxx)',
      admin: {
        description: 'Tampilan ramah pengguna untuk teks footer dan kontak. Contoh: +62 812-3456-7890',
        placeholder: '+62 812-3456-7890',
      },
    },
    {
      name: 'instagram',
      type: 'text',
      label: 'Handle Instagram (@kala.babyspa)',
      admin: {
        placeholder: '@kala.babyspa',
      },
    },
    {
      name: 'operationalHours',
      type: 'text',
      label: 'Jam Operasional Bidan',
      admin: {
        placeholder: 'Senin - Minggu: 08.00 - 17.00 WIB',
      },
    },
    // Teks Promosi Dinamis
    {
      name: 'heroBadgeText',
      type: 'text',
      label: 'Badge di Hero Section',
      admin: {
        description: 'Badge keunggulan di bagian atas beranda (contoh: ✨ 100% Bidan Resmi Ber-STR)',
      },
    },
    {
      name: 'socialProofText',
      type: 'text',
      label: 'Social Proof Teks',
      admin: {
        description: 'Contoh: Dipercaya 500+ Bunda di Surabaya & Sidoarjo',
      },
    },
    {
      name: 'announcementBanner',
      type: 'text',
      label: 'Teks Banner Pengumuman (Header)',
      admin: {
        description: 'Kosongkan jika tidak ada pengumuman aktif. Jika diisi, akan tampil di bar paling atas website.',
      },
    },
    // Area Layanan
    {
      name: 'coverageAreas',
      type: 'array',
      label: 'Area Jangkauan Homecare',
      fields: [{ name: 'area', type: 'text', required: true, label: 'Nama Wilayah' }],
    },
  ],
}
