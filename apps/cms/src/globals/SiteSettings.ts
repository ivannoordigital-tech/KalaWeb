import type { GlobalConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { normalizeWhatsAppNumber, validateWhatsAppNumber } from '../utilities/validators'
import { canManageSiteSettings, getUserRole } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Pengaturan Situs & Kontak',
  admin: {
    group: '⚙️ Pengaturan Website',
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'author' || role === 'midwife_coordinator' || role === 'seo';
    },
  },
  access: {
    read: () => true,
    update: canManageSiteSettings,
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.whatsappNumber) {
          data.whatsappNumber = normalizeWhatsAppNumber(data.whatsappNumber);
        }
        return data;
      },
    ],
    afterChange: [
      async () => {
        triggerCloudflareDeploy({ resource: 'SiteSettings', action: 'update_settings' });
      },
    ],
  },
  fields: [
    // Kontak & Operasional (Perubahan otomatis terbit ke situs dalam ~2 menit)
    {
      name: 'whatsappNumber',
      type: 'text',
      required: true,
      label: 'Nomor WhatsApp Resmi (Target Klik Konsultasi)',
      admin: {
        description: 'Format baku nomor WA. Contoh: 6281234567890. Sistem otomatis membersihkan spasi, tanda +, atau angka 0. (Setelah Simpan, situs live Cloudflare ter-update ~2 menit).',
        placeholder: '6281234567890',
      },
      validate: validateWhatsAppNumber,
    },
    {
      name: 'whatsappNumberFormatted',
      type: 'text',
      label: 'Nomor WhatsApp Tampilan (+62 8xx-xxx-xxxx)',
      admin: {
        description: 'Tampilan ramah pengguna untuk teks footer dan tombol kontak. Contoh: +62 812-3456-7890',
        placeholder: '+62 812-3456-7890',
      },
    },
    {
      name: 'instagram',
      type: 'text',
      label: 'Akun Instagram Resmi (@kala.babyspa)',
      admin: {
        description: 'Username akun Instagram resmi Kala. Contoh: @kala.babyspa',
        placeholder: '@kala.babyspa',
      },
    },
    {
      name: 'operationalHours',
      type: 'text',
      label: 'Jam Layanan & Operasional (Display Teks)',
      admin: {
        description: 'Jadwal pelayanan homecare yang tampil di footer web. Contoh: Senin - Minggu: 08.00 - 17.00 WIB',
        placeholder: 'Senin - Minggu: 08.00 - 17.00 WIB',
      },
    },
    // Jadwal Operasional Terstruktur (Untuk Bot WhatsApp)
    {
      name: 'operationalSchedule',
      type: 'group',
      label: '🕒 Jadwal Operasional Terstruktur (Integrasi Bot WA)',
      admin: {
        description: 'Jadwal terstruktur yang dibaca langsung oleh Kala Clinic Bot untuk kalkulasi ketersediaan live CS vs antrean luar jam kerja.',
      },
      fields: [
        {
          name: 'timezone',
          type: 'text',
          defaultValue: 'Asia/Jakarta',
          label: 'Zona Waktu (Default: Asia/Jakarta)',
          admin: {
            placeholder: 'Asia/Jakarta',
          },
        },
        {
          name: 'days',
          type: 'array',
          label: 'Jadwal per Hari',
          fields: [
            {
              name: 'day',
              type: 'select',
              required: true,
              options: [
                { label: 'Minggu (0)', value: '0' },
                { label: 'Senin (1)', value: '1' },
                { label: 'Selasa (2)', value: '2' },
                { label: 'Rabu (3)', value: '3' },
                { label: 'Kamis (4)', value: '4' },
                { label: 'Jumat (5)', value: '5' },
                { label: 'Sabtu (6)', value: '6' },
              ],
              label: 'Hari',
            },
            {
              name: 'closed',
              type: 'checkbox',
              defaultValue: false,
              label: 'Libur / Tutup pada hari ini',
            },
            {
              name: 'open',
              type: 'text',
              defaultValue: '08:00',
              label: 'Jam Buka (Format HH:mm)',
              admin: {
                placeholder: '08:00',
              },
            },
            {
              name: 'close',
              type: 'text',
              defaultValue: '17:00',
              label: 'Jam Tutup (Format HH:mm)',
              admin: {
                placeholder: '17:00',
              },
            },
          ],
        },
        {
          name: 'afterHoursAnnouncement',
          type: 'textarea',
          label: 'Pesan Antrean di Luar Jam Operasional',
          defaultValue: 'Terima kasih telah menghubungi Kala Moms & Baby Spa. Layanan konsultasi saat ini sedang di luar jam operasional (08.00–17.00 WIB). Pesan Bunda telah tercatat dalam antrean dan akan segera dihubungi oleh Bidan kami besok pagi.',
          admin: {
            description: 'Pesan otomatis yang dikirimkan oleh Bot WA jika pasien chat di luar jam kerja.',
          },
        },
      ],
    },
    // Teks Promosi Dinamis
    {
      name: 'heroBadgeText',
      type: 'text',
      label: 'Teks Badge di Bagian Hero Utama',
      admin: {
        description: 'Badge penanda di atas judul beranda (contoh: ✨ 100% Bidan Resmi Ber-STR & Terverifikasi Kemenkes)',
      },
    },
    {
      name: 'socialProofText',
      type: 'text',
      label: 'Teks Social Proof (Bukti Kepercayaan)',
      admin: {
        description: 'Statistik kepercayaan Bunda (contoh: Dipercaya 500+ Bunda di Surabaya & Sidoarjo)',
      },
    },
    // Banner Pengumuman & Promo
    {
      name: 'bannerGroup',
      type: 'group',
      label: '📢 Banner Promo Pengumuman (Bar Atas Website)',
      fields: [
        {
          name: 'announcementBanner',
          type: 'text',
          label: 'Isi Teks Pengumuman',
          admin: {
            description: 'Kosongkan jika tidak ada promo aktif. Jika diisi, akan tampil di bar paling atas website.',
            placeholder: 'Promo Bulan Ini: Free Minyak Telon Alami Food-Grade untuk Reservasi Homecare Selapanan',
          },
        },
        {
          name: 'bannerStartDate',
          type: 'date',
          label: 'Tanggal Mulai Tayang (Opsional)',
          admin: {
            description: 'Banner hanya akan mulai tampil setelah tanggal ini.',
          },
        },
        {
          name: 'bannerEndDate',
          type: 'date',
          label: 'Tanggal Berakhir Tayang (Opsional)',
          admin: {
            description: 'Banner otomatis hilang dari website setelah tanggal ini (mencegah banner kedaluwarsa tertinggal).',
          },
        },
      ],
    },
    // Area Layanan
    {
      name: 'coverageAreas',
      type: 'array',
      label: 'Daftar Wilayah Jangkauan Homecare',
      admin: {
        description: 'Kecamatan / wilayah kota yang dilayani di Surabaya dan Sidoarjo.',
      },
      fields: [
        {
          name: 'area',
          type: 'text',
          required: true,
          label: 'Nama Wilayah / Kecamatan',
          admin: {
            placeholder: 'Contoh: Surabaya Barat (Wiyung, Lakarsantri)',
          },
        },
      ],
    },
  ],
}
