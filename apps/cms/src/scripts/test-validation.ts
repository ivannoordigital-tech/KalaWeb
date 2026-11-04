/**
 * Test Suite: Editorial & Validation Safeguards (ED-001, ED-002, ED-003, ED-004, ED-005, ED-006)
 *
 * Menguji:
 * 1. Validasi PageBuilder: penolakan halaman kosong, validasi galeri (images), penolakan klaim medis terlarang.
 * 2. Validasi Artikel: penolakan artikel kosong, kewajiban reviewer medis, penolakan klaim medis terlarang.
 * 3. Format error terstruktur (fieldErrors dengan path, code, message).
 * 4. Pengecekan konfigurasi autosave, schedulePublish, dan trash pada Articles & Pages.
 * 5. Pengecekan pendaftaran endpoint /api/validate pada Payload config.
 */
import {
  validatePageBuilderDoc,
  validateArticleDoc,
  DEFAULT_FORBIDDEN_HEALTH_WORDS,
} from '../utilities/pageBuilderValidators';
import { Articles } from '../collections/Articles';
import { Pages } from '../collections/Pages';
import configPromise from '../payload.config';

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean, detail = '') {
  if (condition) {
    console.log(`✅ LULUS: ${description}`);
    passed += 1;
  } else {
    console.error(`❌ GAGAL: ${description}${detail ? ` — ${detail}` : ''}`);
    failed += 1;
  }
}

console.log('\n========================================================================================');
console.log('🧪 PENGUJIAN SISTEM VALIDASI EDITORIAL & GUARD KLAIM MEDIS (ED-001 – ED-006)');
console.log('========================================================================================\n');

// --- 1. Pengujian Validasi Halaman (validatePageBuilderDoc) ---
console.log('--- 1. Pengujian Validasi Halaman (Pages & LandingPages) ---');

// Case 1A: Draft kosong harus diizinkan (editor sedang mengetik)
const emptyDraft = {
  title: 'Halaman Draf Sementara',
  slug: 'draf-sementara',
  _status: 'draft',
};
const res1A = validatePageBuilderDoc(emptyDraft);
assert('Draf kosong diizinkan tersimpan (isValid: true)', res1A.isValid);

// Case 1B: Publish halaman kosong harus DITOLAK (ED-001)
const emptyPublishedPage = {
  title: 'Halaman Kosong',
  slug: 'halaman-kosong',
  _status: 'published',
  layout: [],
  content: null,
};
const res1B = validatePageBuilderDoc(emptyPublishedPage);
assert('Publish halaman kosong DITOLAK (isValid: false)', !res1B.isValid);
assert(
  'Error memiliki kode EMPTY_PAGE_CONTENT',
  res1B.fieldErrors.some((fe) => fe.code === 'EMPTY_PAGE_CONTENT')
);

// Case 1C: Landing page kanvas tanpa CTA harus DITOLAK (ED-001)
const landingWithoutCta = {
  title: 'Promo Spesial',
  slug: 'promo-spesial',
  refCode: 'LP-PROMO',
  pageType: 'landing',
  pageLayout: 'canvas',
  showWhatsAppCta: false,
  _status: 'published',
  layout: [
    {
      blockType: 'hero',
      headline: 'Promo Spesial Pijat Bayi',
      subheadline: 'Layanan homecare bidan profesional',
    },
    {
      blockType: 'faq',
      items: [{ q: 'Ada promo?', a: 'Ada' }],
    },
  ],
};
const res1C = validatePageBuilderDoc(landingWithoutCta);
assert('Landing page tanpa CTA WhatsApp DITOLAK', !res1C.isValid);
assert(
  'Error memiliki kode MISSING_WHATSAPP_CTA',
  res1C.fieldErrors.some((fe) => fe.code === 'MISSING_WHATSAPP_CTA')
);

// Case 1C-2: Landing page dengan showWhatsAppCta: true tapi layout tanpa blok CTA tetap harus DITOLAK (Gap 9 fix)
const landingWithCtaFlagOnly = {
  title: 'Promo Tanpa Blok CTA',
  slug: 'promo-tanpa-blok',
  refCode: 'LP-NO-BLOCK',
  pageType: 'landing',
  showWhatsAppCta: true, // flag true tidak boleh meloloskan landing page tanpa blok CTA
  _status: 'published',
  layout: [
    {
      blockType: 'hero',
      headline: 'Layanan Pijat Bayi',
      // tidak ada ctaText/buttonText
    },
  ],
};
const res1C2 = validatePageBuilderDoc(landingWithCtaFlagOnly);
assert('Landing page tanpa blok CTA nyata DITOLAK walau flag showWhatsAppCta=true', !res1C2.isValid);
assert(
  'Error 1C-2 berkode MISSING_WHATSAPP_CTA',
  res1C2.fieldErrors.some((fe) => fe.code === 'MISSING_WHATSAPP_CTA')
);

// Case 1D: Galeri foto dengan gambar tanpa Alt Text harus DITOLAK (ED-001 bug fix block.images)
const pageWithMissingGalleryAlt = {
  title: 'Halaman Galeri',
  slug: 'galeri-klinik',
  _status: 'published',
  layout: [
    {
      blockType: 'gallery',
      title: 'Galeri Foto Kami',
      images: [
        {
          image: { url: '/media/foto1.webp' }, // tanpa alt
        },
      ],
    },
  ],
};
const res1D = validatePageBuilderDoc(pageWithMissingGalleryAlt);
assert('Galeri foto tanpa Alt Text DITOLAK (cek field "images")', !res1D.isValid);
assert(
  'Error memiliki kode MISSING_ALT_TEXT dan path yang tepat',
  res1D.fieldErrors.some((fe) => fe.code === 'MISSING_ALT_TEXT' && fe.path.includes('images.0.alt'))
);

// Case 1E: Klaim medis terlarang "pasti sembuh" harus DIBLOKIR saat publish (ED-003)
const pageWithForbiddenClaim = {
  title: 'Terapi Kolik',
  slug: 'terapi-kolik',
  _status: 'published',
  layout: [
    {
      blockType: 'hero',
      headline: 'Solusi Tangis Kolik Bayi Pasti Sembuh Dalam 1 Jam',
      subheadline: 'Bidan hadir ke rumah',
    },
  ],
};
const res1E = validatePageBuilderDoc(pageWithForbiddenClaim);
assert('Halaman dengan klaim "pasti sembuh" DIBLOKIR saat publikasi', !res1E.isValid);
assert(
  'Error memiliki kode FORBIDDEN_MEDICAL_CLAIM',
  res1E.fieldErrors.some((fe) => fe.code === 'FORBIDDEN_MEDICAL_CLAIM')
);

// --- 2. Pengujian Validasi Artikel (validateArticleDoc) ---
console.log('\n--- 2. Pengujian Validasi Artikel Edukasi (Articles) ---');

// Case 2A: Publish artikel kosong harus DITOLAK
const emptyArticle = {
  title: 'Panduan Ibu',
  slug: 'panduan-ibu',
  description: 'Ringkasan panduan ibu menyusui',
  category: 'ibu-menyusui',
  medicalReviewer: 'Bidan Annisa',
  _status: 'published',
  content: null,
};
const res2A = validateArticleDoc(emptyArticle);
assert('Publish artikel kosong DITOLAK', !res2A.isValid);
assert(
  'Error memiliki kode EMPTY_ARTICLE_CONTENT',
  res2A.fieldErrors.some((fe) => fe.code === 'EMPTY_ARTICLE_CONTENT')
);

// Case 2B: Publish artikel tanpa reviewer medis harus DITOLAK (ED-003/ED-006)
const articleWithoutReviewer = {
  title: 'Panduan Menyusui',
  slug: 'panduan-menyusui',
  description: 'Ringkasan panduan menyusui bagi ibu baru melahirkan di Surabaya',
  category: 'ibu-menyusui',
  medicalReviewer: '',
  _status: 'published',
  content: {
    root: {
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Paragraf isi konten panduan...' }],
        },
      ],
    },
  },
};
const res2B = validateArticleDoc(articleWithoutReviewer);
assert('Artikel tanpa Reviewer Medis DITOLAK', !res2B.isValid);
assert(
  'Error memiliki kode MISSING_MEDICAL_REVIEWER',
  res2B.fieldErrors.some((fe) => fe.code === 'MISSING_MEDICAL_REVIEWER')
);

// Case 2C: Artikel dengan klaim "dijamin sembuh" harus DIBLOKIR (ED-003)
const articleWithForbiddenClaim = {
  title: 'Cara Mengobati Masalah ASI Dijamin Sembuh Total',
  slug: 'cara-mengobati-masalah-asi',
  description: 'Tips laktasi aman untuk ibu',
  category: 'ibu-menyusui',
  medicalReviewer: 'Bidan Ayu',
  _status: 'published',
  content: {
    root: {
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Teknik ini dijamin sembuh tanpa masalah.' }],
        },
      ],
    },
  },
};
const res2C = validateArticleDoc(articleWithForbiddenClaim);
assert('Artikel dengan klaim "dijamin sembuh" DIBLOKIR', !res2C.isValid);
assert(
  'Error memiliki kode FORBIDDEN_MEDICAL_CLAIM',
  res2C.fieldErrors.some((fe) => fe.code === 'FORBIDDEN_MEDICAL_CLAIM')
);

// Case 2D: Artikel valid dengan reviewer medis harus DITERIMA
const validArticle = {
  title: 'Panduan Posisi Pelekatan Menyusui yang Benar',
  slug: 'panduan-posisi-pelekatan-menyusui',
  description: 'Edukasi klinis teknik pelekatan bayi menyusui agar bebas lecet dan nyaman.',
  category: 'ibu-menyusui',
  medicalReviewer: 'Bidan Ayu Lestari, A.Md.Keb',
  reviewedAt: '2026-10-25',
  _status: 'published',
  content: {
    root: {
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Pelekatan yang tepat meminimalkan nyeri puting...' }],
        },
      ],
    },
  },
};
const res2D = validateArticleDoc(validArticle);
assert('Artikel lengkap dengan reviewer medis DITERIMA (isValid: true)', res2D.isValid);

// Case 2E: Artikel dengan reviewer generik placeholder tanpa relasi bidan DITOLAK (Gap 7 fix)
const articleWithGenericReviewer = {
  ...validArticle,
  slug: 'panduan-pelekatan-generik',
  medicalReviewer: 'Tim Medis & Kebidanan Kala Moms and Baby Spa',
  reviewedByMidwife: null,
};
const res2E = validateArticleDoc(articleWithGenericReviewer);
assert('Artikel dengan reviewer generik tanpa relasi bidan ber-STR DITOLAK', !res2E.isValid);
assert(
  'Error 2E berkode INVALID_MEDICAL_REVIEWER',
  res2E.fieldErrors.some((fe) => fe.code === 'INVALID_MEDICAL_REVIEWER')
);

// Case 2E-2: Artikel tanpa tanggal peninjauan klinis (reviewedAt) DITOLAK (Rekomendasi 6 fix)
const articleWithoutReviewDate = {
  ...validArticle,
  slug: 'panduan-pelekatan-tanpa-tanggal',
  reviewedAt: null,
};
const res2E2 = validateArticleDoc(articleWithoutReviewDate);
assert('Artikel tanpa tanggal peninjauan klinis (reviewedAt) DITOLAK', !res2E2.isValid);
assert(
  'Error 2E-2 berkode MISSING_REVIEW_DATE',
  res2E2.fieldErrors.some((fe) => fe.code === 'MISSING_REVIEW_DATE')
);

// Case 2F: Artikel edukatif dengan negasi klaim medis DISETUJUI (Gap 8 fix)
const articleWithNegatedClaim = {
  ...validArticle,
  slug: 'panduan-pelekatan-edukasi',
  content: {
    root: {
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Perlu diingat bahwa terapi pijat laktasi ini tidak menjamin pasti sembuh seketika tanpa perbaikan teknik pelekatan mandiri ibu.',
            },
          ],
        },
      ],
    },
  },
};
const res2F = validateArticleDoc(articleWithNegatedClaim);
assert('Artikel dengan bantahan/negasi edukatif ("tidak menjamin pasti sembuh") DITERIMA (isValid: true)', res2F.isValid);

// Case 2G: Artikel dengan relasi reviewedByMidwife terisi DITERIMA walau nama display default
const articleWithMidwifeRelation = {
  ...validArticle,
  slug: 'panduan-pelekatan-relasi',
  reviewedByMidwife: 'bidan-001',
};
const res2G = validateArticleDoc(articleWithMidwifeRelation);
assert('Artikel dengan relasi reviewedByMidwife terisi DITERIMA (isValid: true)', res2G.isValid);

// --- 3. Pengujian Konfigurasi Koleksi (ED-004, ED-005, ED-006) ---
console.log('\n--- 3. Pengujian Konfigurasi Koleksi (Autosave, SchedulePublish, Trash) ---');

// Articles
const artDrafts = typeof Articles.versions === 'object' && Articles.versions?.drafts;
const isArtAutosave = typeof artDrafts === 'object' && Boolean(artDrafts.autosave);
const isArtSchedule = typeof artDrafts === 'object' && Boolean(artDrafts.schedulePublish);
const isArtTrash = Boolean((Articles as any).trash);

assert('Articles memiliki konfigurasi autosave aktif (ED-004)', isArtAutosave);
assert('Articles memiliki konfigurasi schedulePublish aktif (ED-004)', isArtSchedule);
assert('Articles memiliki fitur trash (soft-delete) aktif (ED-005)', isArtTrash);

// Pages
const pageDrafts = typeof Pages.versions === 'object' && Pages.versions?.drafts;
const isPageAutosave = typeof pageDrafts === 'object' && Boolean(pageDrafts.autosave);
const isPageSchedule = typeof pageDrafts === 'object' && Boolean(pageDrafts.schedulePublish);
const isPageTrash = Boolean((Pages as any).trash);

assert('Pages memiliki konfigurasi autosave aktif (ED-004)', isPageAutosave);
assert('Pages memiliki konfigurasi schedulePublish aktif (ED-004)', isPageSchedule);
assert('Pages memiliki fitur trash (soft-delete) aktif (ED-005)', isPageTrash);

// Cek relasi penulis & reviewer medis pada Articles (ED-006)
const advancedTab = (Articles.fields as any)?.[0]?.tabs?.find((t: any) => t.label === 'Pengaturan Lanjutan');
const advancedFields = advancedTab?.fields || [];
const hasAuthorMidwife = advancedFields.some((f: any) => f.name === 'authorMidwife');
const hasReviewedByMidwife = advancedFields.some((f: any) => f.name === 'reviewedByMidwife');
const hasReviewedAt = advancedFields.some((f: any) => f.name === 'reviewedAt');

assert('Articles memiliki field relationship authorMidwife (ED-006)', hasAuthorMidwife);
assert('Articles memiliki field relationship reviewedByMidwife (ED-006)', hasReviewedByMidwife);
assert('Articles memiliki field tanggal reviewedAt (ED-006)', hasReviewedAt);

// --- 4. Pengujian Endpoint /api/validate (ED-002) ---
console.log('\n--- 4. Pengujian Endpoint /api/validate (ED-002) ---');

async function testEndpoint() {
  const config = await configPromise;
  const validateEndpoint = config.endpoints?.find((e) => e.path === '/validate');
  assert('Endpoint /validate terdaftar pada payload.config (ED-002)', Boolean(validateEndpoint));
  assert('Endpoint /validate menggunakan metode HTTP POST', validateEndpoint?.method === 'post');

  if (validateEndpoint && typeof validateEndpoint.handler === 'function') {
    // Simulasikan request dry-run validasi
    const mockReq = {
      json: async () => ({
        collection: 'articles',
        data: emptyArticle,
      }),
    };
    const response: any = await (validateEndpoint.handler as any)(mockReq);
    const body = await response.json();
    assert('Endpoint mengembalikan status validasi: valid = false', body.valid === false);
    assert(
      'Endpoint mengembalikan fieldErrors terstruktur',
      Array.isArray(body.fieldErrors) && body.fieldErrors.length > 0
    );
  }
}

testEndpoint().then(() => {
  console.log('\n========================================================================================');
  if (failed === 0) {
    console.log(`🎉 SEMUA ${passed} PENGUJIAN VALIDASI EDITORIAL & KLAIM MEDIS LULUS (0 GAGAL)!`);
    console.log('========================================================================================\n');
    process.exit(0);
  } else {
    console.error(`❌ TERDAPAT ${failed} PENGUJIAN GAGAL DARI TOTAL ${passed + failed}!`);
    console.log('========================================================================================\n');
    process.exit(1);
  }
});
