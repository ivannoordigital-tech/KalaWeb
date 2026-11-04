# Dokumen Mapping Migrasi Landing Pages → Pages (LP-001)

**Tanggal:** 3 November 2026  
**Status:** Disetujui (Approved)  
**Referensi:** `docs/rencana-perbaikan-cms-2026-11.md` (P0-3, LP-001 hingga LP-006)  

---

## 1. Latar Belakang & Masalah

Sebelum migrasi ini, terdapat dua koleksi di Payload CMS yang sama-sama mengelola halaman penawaran `/sales/[slug]`:
1. **`LandingPages` (`landing-pages`):** Koleksi lama yang di-hide dari menu admin (`hidden: () => true`), namun ironisnya diprioritaskan di route `sales/[slug].astro`.
2. **`Pages` (`pages`):** Koleksi modern yang aktif di menu admin ("Semua Halaman"), memiliki dukungan blok fleksibel (`allBlocks`), SEO engine, status draft/publish, dan live preview.

Hal ini menyebabkan **P0-3**: Perubahan yang dilakukan marketing di menu admin Pages tidak pernah tayang di `/sales/[slug]` karena ditimpa oleh data `landing-pages` yang tersembunyi.

---

## 2. Inventaris Dokumen (Production & Lokal)

| Slug | Status di `landing-pages` | Status di `pages` | Sumber Blok/Data | Target Akhir |
|---|---|---|---|---|
| `reservasi-online` | Aktif (10 blok lengkap) | Draft/Metadata saja | Blok dari `landing-pages` | `Pages` (pageType: landing) |
| `pijat-newborn` | Aktif (mode klasik) | Draft/Metadata saja | Dikonversi menjadi 7 blok | `Pages` (pageType: landing) |
| `bayi-kolik` | Aktif (mode klasik) | Draft/Metadata saja | Dikonversi menjadi 7 blok | `Pages` (pageType: landing) |
| `babyMassage` | Tidak ada | Aktif di Pages | Blok di `pages` | `Pages` (dipertahankan) |
| `syarat-ketentuan` | Tidak ada | Aktif di Pages | Standar | `Pages` (pageType: standard) |

---

## 3. Pemetaan Field (Field Mapping Matrix)

### 3.1 Metadata Halaman

| Field Sumber (`landing-pages`) | Field Target (`pages`) | Aturan Transformasi / Catatan |
|---|---|---|
| `title` | `title` | Disalin langsung |
| `slug` | `slug` | Disalin langsung (kunci unik) |
| `refCode` | `refCode` | Disalin langsung; default: `KALA-LP-[SLUG]-[VARIAN]` |
| `variant` | `variant` | Disalin langsung ('A', 'B', 'C'; default 'A') |
| `activePixels` | `activePixels` | Disalin langsung (array: `['meta', 'google']`, dll.) |
| `campaignBaseRef` | N/A | Dimasukkan ke metadata ref code |
| `pageLayout` | `pageLayout` | `canvas_minimal` / `canvas` → `canvas`; `default` → `default`; `full_width` → `full_width` |
| `active` | `_status` | `active === true` → `_status = 'published'`; `false` → `draft` |
| `seo.*` | `seo.*` | Disalin langsung ke grup SEO |
| N/A | `pageType` | Di-set ke `'landing'` |

### 3.2 Transformasi Konten Mode Klasik → Blok Page Builder

Untuk dokumen legacy yang belum memiliki susunan `layout` blok (`bayi-kolik` dan `pijat-newborn`), field mode klasik dikonversi otomatis menjadi blok modern:

| Field Klasik Legacy | Blok Target (`layout`) | Properti Blok |
|---|---|---|
| `headline`, `subheadline`, `price`, `duration` | **`hero`** | `headline`, `subheadline`, `price`, `duration`, `ctaText: 'Chat Bidan via WhatsApp'`, `ctaMessage: '...'`, `bgStyle: 'gradient'` |
| `painPoints` (array of string/point) | **`painPoints`** | `title`, `subtitle`, `points: [{ icon: '😭', title, description }]` |
| `solutions` (array of {title, desc}) | **`solutions`** | `title`, `subtitle`, `items: [{ icon: '🌿', title, description }]`, `highlightQuote` |
| `steps` (array of {num, title, desc}) | **`steps`** | `title`, `subtitle`, `steps: [{ num, title, description }]` |
| `testimonial` ({quote, author, area}) | **`testimonials`** | `title`, `subtitle`, `items: [{ quote, author, role, area }]` |
| `faqs` (array of {q, a}) | **`faq`** | `title`, `subtitle`, `faqs: [{ q, a }]` |
| Tombol WhatsApp CTA Bawah | **`cta`** | `badge`, `headline`, `description`, `buttonText`, `buttonMessage`, `footnote` |

Dokumen yang sudah memiliki `layout` (seperti `reservasi-online`) akan menyalin array blok secara langsung tanpa modifikasi.

---

## 4. Strategi Route & Feature Flag

Route `/sales/[slug].astro` diperbarui dengan arsitektur satu sumber kebenaran:
1. **Sumber Utama:** `fetchPayloadPages()` dengan filter `pageType === 'landing'`.
2. **Prioritas:** Slug yang ditemukan di `Pages` selalu menang.
3. **Fallback Transisi:** Jika suatu slug ada di `landing-pages` lama tetapi belum ada di `Pages`, sistem tetap merendernya (zero downtime).
4. **Feature Flag:** `USE_PAGES_FOR_SALES` (default: `true`). Jika diset `false`, sistem kembali ke urutan legacy untuk keperluan rollback darurat.

---

## 5. Prosedur Deprekasi `LandingPages`

1. Koleksi `LandingPages` tetap tersembunyi dari menu admin (`hidden: () => true`).
2. Ditambahkan deskripsi peringatan bahwa koleksi ini adalah arsip legacy yang telah dimigrasikan.
3. Dashboard CMS menduplikasi pencegahan: dokumen dengan slug yang sudah ada di `Pages` tidak akan ditampilkan dua kali di dashboard.
4. Tabel database tetap dipertahankan selama masa transisi 30 hari untuk jaminan rollback.
