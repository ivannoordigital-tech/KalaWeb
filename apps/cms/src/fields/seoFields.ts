import type { Field } from 'payload'
import { SEO_THRESHOLDS } from '../lib/seo-engine/constants'

export interface SeoFieldOptions {
  titleSourceField?: string
  descriptionSourceField?: string
  position?: 'sidebar' | 'main'
}

/**
 * Paket Field SEO Terpadu (Reusable SEO Field Group)
 * Digunakan seragam di seluruh koleksi publik (Articles, Pages, LandingPages, Services, ServiceAreas)
 * Dilengkapi dengan Interactive Real-time SEO Panel & Google Search Result Preview.
 */
export function buildSeoFields(options: SeoFieldOptions = {}): Field {
  const titleHint = options.titleSourceField
    ? `Kosongkan untuk otomatis menggunakan isi dari "${options.titleSourceField}".`
    : 'Judul yang tampil di tab browser dan hasil pencarian Google.'

  const descHint = options.descriptionSourceField
    ? `Kosongkan untuk otomatis menggunakan isi dari "${options.descriptionSourceField}".`
    : 'Cuplikan deskripsi di hasil pencarian Google.'

  const adminConfig: any = {
    description: 'Pengaturan metadata mesin pencari, live Google preview, dan checklist skor SEO.',
  }

  if (options.position === 'sidebar') {
    adminConfig.position = 'sidebar'
  }

  return {
    name: 'seo',
    type: 'group',
    label: '🔍 Optimasi SEO & Social Share',
    admin: adminConfig,
    fields: [
      {
        name: 'seoPanelLive',
        type: 'ui',
        admin: {
          components: {
            Field: '/components/admin/SeoPanelField#SeoPanelField',
          },
        },
      },
      {
        name: 'metaTitle',
        type: 'text',
        label: 'Judul di Google (Meta Title)',
        admin: {
          description: `Panjang ideal: ${SEO_THRESHOLDS.TITLE_MIN_OPTIMAL}–${SEO_THRESHOLDS.TITLE_MAX_OPTIMAL} karakter. ${titleHint}`,
          placeholder: 'Contoh: Pijat Bayi Homecare Surabaya & Sidoarjo | Bidan Kala',
        },
        validate: (val: any) => {
          if (val && String(val).length > SEO_THRESHOLDS.TITLE_MAX_ACCEPTABLE) {
            return `Judul terlalu panjang (${String(val).length} karakter). Google memotong judul di atas ${SEO_THRESHOLDS.TITLE_MAX_OPTIMAL}–${SEO_THRESHOLDS.TITLE_MAX_ACCEPTABLE} karakter.`
          }
          return true
        },
      },
      {
        name: 'metaDescription',
        type: 'textarea',
        label: 'Deskripsi di Google (Meta Description)',
        admin: {
          description: `Panjang ideal: ${SEO_THRESHOLDS.DESC_MIN_OPTIMAL}–${SEO_THRESHOLDS.DESC_MAX_OPTIMAL} karakter. ${descHint}`,
          placeholder: 'Deskripsi ringkas yang menarik perhatian orang tua saat melihat di Google...',
        },
        validate: (val: any) => {
          if (val && String(val).length > SEO_THRESHOLDS.DESC_MAX_ACCEPTABLE) {
            return `Deskripsi terlalu panjang (${String(val).length} karakter). Google biasanya memotong di atas ${SEO_THRESHOLDS.DESC_MAX_OPTIMAL} karakter.`
          }
          return true
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
  }
}
