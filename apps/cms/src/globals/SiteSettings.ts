import type { GlobalConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { normalizeWhatsAppNumber, validateWhatsAppNumber } from '../utilities/validators'
import { canManageSiteSettings, getUserRole } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Pengaturan Situs',
  admin: {
    group: 'Pengaturan & Bantuan',
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
    {
      type: 'tabs',
      tabs: [
        // ========================================================
        // TAB 1: 📊 Pelacakan, Pixel & Analitik Iklan Terpusat
        // ========================================================
        {
          label: '📊 Pelacakan & Pixel',
          description: 'Kelola seluruh ID pelacak iklan dan analitik website secara terpusat. Kosongkan platform yang belum digunakan. Perubahan otomatis memicu deploy ulang (~2 menit).',
          fields: [
            {
              name: 'analytics',
              type: 'group',
              label: 'ID Pelacakan & Analitik',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'gtmId',
                      type: 'text',
                      label: 'Google Tag Manager (GTM) Container ID',
                      admin: {
                        width: '50%',
                        placeholder: 'GTM-5J7NM8BG',
                        description: 'Format: GTM-XXXXXXX',
                      },
                    },
                    {
                      name: 'metaPixelId',
                      type: 'text',
                      label: 'Meta Pixel ID (Facebook & Instagram Ads)',
                      admin: {
                        width: '50%',
                        placeholder: '1382300863013984',
                        description: 'Format: 15-16 digit angka Pixel resmi',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ga4MeasurementId',
                      type: 'text',
                      label: 'Google Analytics 4 (GA4) Measurement ID',
                      admin: {
                        width: '50%',
                        placeholder: 'G-XXXXXXXXXX',
                        description: 'Format: G-XXXXXXXXXX (Opsional bila di-handle via GTM)',
                      },
                    },
                    {
                      name: 'gadsConversionId',
                      type: 'text',
                      label: 'Google Ads (AdWords) Conversion ID',
                      admin: {
                        width: '50%',
                        placeholder: 'AW-XXXXXXXXXX',
                        description: 'Format: AW-XXXXXXXXXX',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'tiktokPixelId',
                      type: 'text',
                      label: 'TikTok Pixel ID',
                      admin: {
                        width: '50%',
                        placeholder: 'CXXXXXXXXXXXXXXXXX',
                        description: 'ID Pixel dari TikTok Ads Manager',
                      },
                    },
                    {
                      name: 'clarityProjectId',
                      type: 'text',
                      label: 'Microsoft Clarity Project ID',
                      admin: {
                        width: '50%',
                        placeholder: 'XXXXXXXXXX',
                        description: 'Project ID dari Microsoft Clarity dashboard (heatmaps & session recordings)',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ========================================================
        // TAB 2: 📞 Kontak Resmi & Identitas Klinik
        // ========================================================
        {
          label: '📞 Kontak & Identitas',
          description: 'Identitas resmi kontak klinik untuk target klik konsultasi WhatsApp, nomor tampilan, dan media sosial.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'whatsappNumber',
                  type: 'text',
                  required: true,
                  label: 'Nomor WhatsApp Resmi (Target Klik Konsultasi)',
                  admin: {
                    width: '50%',
                    description: 'Format baku nomor WA. Contoh: 6281234567890. Sistem otomatis membersihkan spasi, tanda +, atau angka 0.',
                    placeholder: '6281234567890',
                  },
                  validate: validateWhatsAppNumber,
                },
                {
                  name: 'whatsappNumberFormatted',
                  type: 'text',
                  label: 'Nomor WhatsApp Tampilan (+62 8xx-xxx-xxxx)',
                  admin: {
                    width: '50%',
                    description: 'Tampilan ramah pengguna untuk teks footer dan tombol kontak. Contoh: +62 812-3456-7890',
                    placeholder: '+62 812-3456-7890',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'instagram',
                  type: 'text',
                  label: 'Akun Instagram Resmi (@kala.babyspa)',
                  admin: {
                    width: '50%',
                    description: 'Username akun Instagram resmi Kala. Contoh: @kala.babyspa',
                    placeholder: '@kala.babyspa',
                  },
                },
                {
                  name: 'operationalHours',
                  type: 'text',
                  label: 'Jam Layanan & Operasional (Display Teks)',
                  admin: {
                    width: '50%',
                    description: 'Jadwal pelayanan homecare yang tampil di footer web. Contoh: Senin - Minggu: 08.00 - 17.00 WIB',
                    placeholder: 'Senin - Minggu: 08.00 - 17.00 WIB',
                  },
                },
              ],
            },
          ],
        },

        // ========================================================
        // TAB 3: 📢 Banner Promo Pengumuman (Bar Atas)
        // ========================================================
        {
          label: '📢 Banner Promo',
          description: 'Pita pengumuman dan promo darurat di bar paling atas seluruh halaman website.',
          fields: [
            {
              name: 'bannerGroup',
              type: 'group',
              label: 'Pengaturan Banner Bar Atas',
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
                  type: 'row',
                  fields: [
                    {
                      name: 'bannerStartDate',
                      type: 'date',
                      label: 'Tanggal Mulai Tayang (Opsional)',
                      admin: {
                        width: '50%',
                        description: 'Banner hanya akan mulai tampil setelah tanggal ini.',
                      },
                    },
                    {
                      name: 'bannerEndDate',
                      type: 'date',
                      label: 'Tanggal Berakhir Tayang (Opsional)',
                      admin: {
                        width: '50%',
                        description: 'Banner otomatis hilang dari website setelah tanggal ini (mencegah banner kedaluwarsa tertinggal).',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ========================================================
        // TAB 4: 🏠 Salinan Teks Beranda (Homepage Copy)
        // ========================================================
        {
          label: '🏠 Teks Beranda',
          description: 'Kelola seluruh teks judul, keluhan, manfaat, promo, dan langkah reservasi di halaman depan (kalababyspa.com). Kosongkan untuk memakai teks default standar.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'heroBadgeText',
                  type: 'text',
                  label: 'Teks Badge di Bagian Hero Utama',
                  admin: {
                    width: '50%',
                    description: 'Badge penanda di atas judul beranda (contoh: ✨ 100% Bidan Resmi Ber-STR & Terverifikasi Kemenkes)',
                  },
                },
                {
                  name: 'socialProofText',
                  type: 'text',
                  label: 'Teks Social Proof (Bukti Kepercayaan)',
                  admin: {
                    width: '50%',
                    description: 'Statistik kepercayaan Bunda (contoh: Dipercaya 1000+ Bunda di Surabaya & Sidoarjo sejak 2020)',
                  },
                },
              ],
            },
            {
              name: 'homepage',
              type: 'group',
              label: 'Konten Spesifik Halaman Depan',
              fields: [
                {
                  name: 'heroHeadline',
                  type: 'text',
                  label: 'Judul Utama (H1 Hero Beranda)',
                  admin: {
                    placeholder: 'Perawatan Ibu & Bayi di Rumah oleh Bidan Profesional',
                  },
                },
                {
                  name: 'heroTagline',
                  type: 'text',
                  label: 'Tagline / Subjudul Empati',
                  admin: {
                    placeholder: 'Bunda Juga Berhak Dirawat dan Ditemani 🤍',
                  },
                },
                {
                  name: 'heroDescription',
                  type: 'textarea',
                  label: 'Paragraf Deskripsi Hero',
                  admin: {
                    placeholder: 'Menjadi ibu penuh kebahagiaan, tetapi terkadang juga melelahkan. Kala hadir langsung ke rumah untuk membantu Bunda merawat diri dan si kecil...',
                  },
                },
                {
                  name: 'painPoints',
                  type: 'array',
                  label: 'Section Keluhan Bunda ("Apakah ini yang Sedang Bunda Rasakan?")',
                  admin: {
                    description: 'Daftar poin keluhan/masalah yang dihadapi Bunda (Default: 6 poin standar jika dikosongkan).',
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Judul Masalah',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      required: true,
                      label: 'Deskripsi Singkat',
                    },
                  ],
                },
                {
                  name: 'benefits',
                  type: 'array',
                  label: 'Section Manfaat ("Yang biasa Bunda rasakan setelah sesi")',
                  admin: {
                    description: 'Daftar hasil positif & ketenangan setelah sesi homecare (Default: 5 poin jika dikosongkan).',
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Judul Manfaat',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      required: true,
                      label: 'Deskripsi Singkat',
                    },
                  ],
                },
                {
                  name: 'promotion',
                  type: 'group',
                  label: 'Banner Kotak Promo Reservasi Pertama',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'title',
                          type: 'text',
                          label: 'Judul Penawaran Promo',
                          admin: { width: '50%', placeholder: 'Promo treatment Kala' },
                        },
                        {
                          name: 'serviceName',
                          type: 'text',
                          label: 'Nama Layanan Promo',
                          admin: { width: '50%', placeholder: 'Kala Baby: Pijat Ceria Newborn' },
                        },
                      ],
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
                          label: 'Harga Promo (Display)',
                          admin: { width: '33%', placeholder: 'Rp60.000' },
                        },
                        {
                          name: 'originalPrice',
                          type: 'text',
                          label: 'Harga Asli Coret',
                          admin: { width: '33%', placeholder: 'Rp80.000' },
                        },
                        {
                          name: 'badge',
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
                          admin: { width: '50%', placeholder: 'Kuota harian maksimal 5 sesi agar setiap kunjungan tetap fokus dan higienis.' },
                        },
                      ],
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
                          admin: { width: '50%', placeholder: 'Halo Bidan Kala, saya mau ambil promo treatment Kala Baby Pijat Ceria Newborn Rp60.000 [ref: KALA-PROMO-INTRO]' },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'bookingSteps',
                  type: 'array',
                  label: 'Alur 4 Langkah Cara Reservasi Homecare',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Judul Langkah',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      required: true,
                      label: 'Deskripsi Langkah',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
