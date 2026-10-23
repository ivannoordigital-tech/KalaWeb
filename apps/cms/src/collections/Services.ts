import type { CollectionConfig } from 'payload'
import { triggerCloudflareDeploy } from '../utilities/triggerDeployHook'
import { validatePositiveInteger, validateOriginalPrice } from '../utilities/validators'
import { buildSeoFields } from '../fields/seoFields'
import { canManageServices, getUserRole } from '../access/roles'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Layanan & Paket Spa',
    plural: 'Layanan & Paket Spa',
  },
  admin: {
    group: '🏥 Data Layanan & Klinik',
    useAsTitle: 'name',
    defaultColumns: ['name', 'numericPrice', 'durationMinutes', 'recommended', 'active', 'order'],
    hidden: ({ user }) => {
      const role = getUserRole(user);
      return role === 'author' || role === 'midwife_coordinator';
    },
  },
  access: {
    read: () => true,
    create: canManageServices,
    update: canManageServices,
    delete: canManageServices,
  },
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc }) => {
        if (!data) return data;

        // Auto-format label harga jika string kosong tapi angka terisi
        if (data.numericPrice && (!data.price || data.price.trim() === '')) {
          data.price = `Rp${Number(data.numericPrice).toLocaleString('id-ID')}`;
        }

        // Auto-format label durasi jika menit terisi
        if (data.durationMinutes && (!data.duration || data.duration.trim() === '')) {
          data.duration = `${data.durationMinutes} Menit`;
        }

        // Proteksi salah ketik harga ekstrim (>30% naik/turun)
        if (originalDoc?.numericPrice && data.numericPrice) {
          const oldP = Number(originalDoc.numericPrice);
          const newP = Number(data.numericPrice);
          const changeRatio = Math.abs(newP - oldP) / oldP;
          if (changeRatio > 0.30 && !data.confirmLargePriceChange) {
            throw new Error(
              `⚠️ Peringatan Keamanan Harga: Harga berubah drastis lebih dari 30% (dari Rp${oldP.toLocaleString('id-ID')} menjadi Rp${newP.toLocaleString('id-ID')}). ` +
              `Untuk mencegah salah ketik yang merusak seluruh website, silakan centang kotak "Konfirmasi Perubahan Harga >30%" di bagian bawah form untuk menyimpan.`
            );
          }
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc }) => {
        if (doc.active) {
          triggerCloudflareDeploy({ resource: 'Services', action: 'publish', slug: doc.slug });
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        triggerCloudflareDeploy({ resource: 'Services', action: 'delete', slug: doc.slug });
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Layanan / Paket',
      admin: {
        description: 'Nama paket perawatan homecare. Contoh: Kala Bundle Duo (Mom & Baby Ceria)',
        placeholder: 'Kala Bundle Duo',
      },
    },
    {
      name: 'target',
      type: 'text',
      required: true,
      label: 'Target Pasien',
      admin: {
        description: 'Kelompok usia atau target tindakan. Contoh: 1 Ibu + 1 Bayi, Bayi 0 - 6 Bulan',
        placeholder: '1 Ibu + 1 Bayi',
      },
    },
    // Kelompok Harga & Durasi
    {
      type: 'row',
      fields: [
        {
          name: 'numericPrice',
          type: 'number',
          required: true,
          label: 'Harga Promo / Final (Angka Rp)',
          admin: {
            width: '50%',
            description: 'Masukkan angka saja tanpa titik/koma. Contoh: 150000',
            placeholder: '150000',
          },
          validate: (val: any) => validatePositiveInteger(val, 'Harga Promo'),
        },
        {
          name: 'price',
          type: 'text',
          label: 'Format Tampilan Harga (Opsional)',
          admin: {
            width: '50%',
            description: 'Kosongkan untuk auto-format dari angka di samping. Contoh: Rp150.000',
            placeholder: 'Rp150.000',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'originalPrice',
          type: 'text',
          label: 'Harga Coret / Asli (Opsional untuk Promo)',
          admin: {
            width: '50%',
            description: 'Jika ada promo diskon. Wajib lebih besar dari harga promo. Contoh: Rp190.000',
            placeholder: 'Rp190.000',
          },
          validate: (val: any, { siblingData }: any) => validateOriginalPrice(val, siblingData?.numericPrice),
        },
        {
          name: 'durationMinutes',
          type: 'number',
          label: 'Durasi Tindakan (Menit)',
          admin: {
            width: '25%',
            description: 'Contoh: 100, 80, 40',
            placeholder: '100',
          },
          validate: (val: any) => validatePositiveInteger(val, 'Durasi Menit'),
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Teks Durasi (Opsional)',
          admin: {
            width: '25%',
            description: 'Otomatis dari menit jika dikosongkan. Contoh: 100 Menit',
            placeholder: '100 Menit',
          },
        },
      ],
    },
    {
      name: 'confirmLargePriceChange',
      type: 'checkbox',
      defaultValue: false,
      label: '⚠️ Konfirmasi Perubahan Harga > 30%',
      admin: {
        description: 'Centang kotak ini jika Anda memang berniat mengubah harga lebih dari 30% dari harga sebelumnya.',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Deskripsi Singkat (Ringkasan Kartu)',
      admin: {
        description: 'Teks ringkas 1-2 kalimat untuk kartu di beranda. Contoh: Perawatan komplit relaksasi pasca-persalinan untuk Bunda dan stimulasi si kecil.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Deskripsi Lengkap Manfaat Layanan',
      admin: {
        description: 'Jelaskan manfaat klinis dan keunggulan tindakan ini secara mendalam untuk calon Bunda.',
      },
    },
    {
      name: 'includedItems',
      type: 'array',
      label: 'Apa Saja yang Termasuk dalam Layanan Ini?',
      admin: {
        description: 'Daftar rincian tindakan (misal: Pijat oksitosin, Pijat relaksasi bayi, Totok wajah ibu).',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
          label: 'Rincian Tindakan',
          admin: {
            placeholder: 'Contoh: Pijat Stimulasi Taktil Lembut dengan Minyak Food-Grade',
          },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Ilustrasi Layanan',
      admin: {
        description: 'Unggah foto resmi tindakan bidan (format WebP/JPG/PNG).',
      },
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Label Badge Khusus (Opsional)',
      admin: {
        description: 'Teks pemikat di atas kartu. Contoh: Paling Diminati Bunda, Tradisi Praktis Steril',
        placeholder: 'Paling Diminati Bunda',
      },
    },
    {
      name: 'recommended',
      type: 'checkbox',
      defaultValue: false,
      label: 'Tandai sebagai Paket Unggulan / Rekomendasi Utama',
      admin: {
        description: 'Jika dicentang, paket ini akan diberi bingkai warna aksen dan diprioritaskan di beranda.',
      },
    },
    // Pengaturan Lanjutan (Bisa Dilipat di Sidebar)
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL Halaman (/layanan/[slug])',
      admin: {
        position: 'sidebar',
        description: 'Alamat URL ramah SEO. Huruf kecil dan strip. Contoh: bundle-duo, baby-newborn',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Status Aktif (Tampil di Website)',
      admin: {
        position: 'sidebar',
        description: 'Hapus centang untuk menyembunyikan layanan ini sementara tanpa menghapus datanya.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 1,
      label: 'Urutan Tampil',
      admin: {
        position: 'sidebar',
        description: 'Angka lebih kecil akan tampil lebih awal di katalog (1, 2, 3...).',
      },
    },
    {
      name: 'refCode',
      type: 'text',
      required: true,
      unique: true,
      label: 'Kode Ref Tracking WhatsApp (Unik)',
      admin: {
        position: 'sidebar',
        description: 'Kode identifikasi unik untuk melacak konversi di bot WA. Contoh: KALA-SRV-DUO',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Draft Pesan WhatsApp saat Tombol Diklik',
      admin: {
        description: 'Draft pesan yang terisi otomatis di aplikasi WhatsApp pasien. Contoh: Halo Bidan Kala, saya mau reservasi...',
      },
    },
    // Reusable SEO Fields
    buildSeoFields({ titleSourceField: 'name', descriptionSourceField: 'shortDescription' }),
  ],
}
