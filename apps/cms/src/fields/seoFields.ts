import type { Field } from 'payload'

export interface SeoFieldOptions {
  titleSourceField?: string;
  descriptionSourceField?: string;
}

/**
 * Paket Field SEO Terpadu (Reusable SEO Field Group)
 * Digunakan seragam di seluruh koleksi publik (Articles, Services, ServiceAreas, Midwives)
 * sesuai spesifikasi Track B - B1.
 */
export function buildSeoFields(options: SeoFieldOptions = {}): Field {
  const titleHint = options.titleSourceField 
    ? `Kosongkan untuk otomatis menggunakan isi dari "${options.titleSourceField}".` 
    : 'Judul yang tampil di tab browser dan hasil pencarian Google.';

  const descHint = options.descriptionSourceField 
    ? `Kosongkan untuk otomatis menggunakan isi dari "${options.descriptionSourceField}".` 
    : 'Cuplikan deskripsi di hasil pencarian Google.';

  return {
    name: 'seo',
    type: 'group',
    label: '🔍 Optimasi SEO & Social Share (Google & WhatsApp)',
    admin: {
      position: 'sidebar',
      description: 'Pengaturan metadata mesin pencari dan tampilan preview saat link dibagikan.',
    },
    fields: [
      {
        name: 'metaTitle',
        type: 'text',
        label: 'Judul di Google (Meta Title)',
        admin: {
          description: `Panjang ideal: 30–60 karakter. ${titleHint}`,
          placeholder: 'Contoh: Pijat Bayi Homecare Surabaya & Sidoarjo | Bidan Kala',
        },
        validate: (val: any) => {
          if (val && String(val).length > 70) {
            return `Judul terlalu panjang (${String(val).length} karakter). Google memotong judul di atas 60–70 karakter.`;
          }
          return true;
        },
      },
      {
        name: 'metaDescription',
        type: 'textarea',
        label: 'Deskripsi di Google (Meta Description)',
        admin: {
          description: `Panjang ideal: 120–155 karakter. ${descHint}`,
          placeholder: 'Deskripsi ringkas yang menarik perhatian orang tua saat melihat di Google...',
        },
        validate: (val: any) => {
          if (val && String(val).length > 165) {
            return `Deskripsi terlalu panjang (${String(val).length} karakter). Google biasanya memotong di atas 155–160 karakter.`;
          }
          return true;
        },
      },
      {
        name: 'focusKeyword',
        type: 'text',
        label: 'Kata Kunci Utama (Focus Keyword)',
        admin: {
          description: 'Satu frasa kata kunci utama target pencarian halaman ini. Contoh: pijat bayi homecare surabaya',
          placeholder: 'pijat bayi homecare surabaya',
        },
      },
      {
        name: 'ogImage',
        type: 'upload',
        relationTo: 'media',
        label: 'Gambar Saat Dibagikan (OG Image)',
        admin: {
          description: 'Ukuran ideal: 1200×630 pixel. Jika kosong, sistem otomatis memakai foto sampul halaman atau logo resmi.',
        },
      },
      {
        name: 'canonicalUrl',
        type: 'text',
        label: 'Canonical URL (Opsional)',
        admin: {
          description: 'Biarkan kosong untuk URL otomatis halaman ini. Isi hanya jika konten halaman ini menduplikasi halaman lain.',
          placeholder: 'https://kalababyspa.com/...',
        },
      },
      {
        name: 'noIndex',
        type: 'checkbox',
        defaultValue: false,
        label: 'Sembunyikan dari Google (No-Index)',
        admin: {
          description: '⚠️ HATI-HATI: Jangan centang ini kecuali halaman ini adalah landing page iklan rahasia yang tidak boleh diindeks Google.',
        },
      },
      {
        name: 'isSubstantiveUpdate',
        type: 'checkbox',
        defaultValue: false,
        label: 'Tandai sebagai Pembaruan Substantif',
        admin: {
          description: 'Centang jika pembaruan ini mengubah fakta medis/harga penting agar tanggal lastmod diperbarui untuk Google.',
        },
      },
    ],
  };
}
