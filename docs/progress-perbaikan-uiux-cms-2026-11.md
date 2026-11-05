# Progress Perbaikan UI/UX CMS — Eksekusi 5 November 2026

**Branch:** `fix/uiux-p0-stabilization` (sudah di-merge ke `main`)  
**Basis:** [`audit-uiux-admin-cms-2026-11-05.md`](./audit-uiux-admin-cms-2026-11-05.md) dan [`rencana-perbaikan-uiux-cms-2026-11.md`](./rencana-perbaikan-uiux-cms-2026-11.md)  
**Status:** **sudah di-deploy ke produksi** pada 5 November 2026 (±11.16 WIB). P0-02/P0-04/P1 tabel terverifikasi live; P0-01 tetap terbuka.

---

## 1. Ringkasan Status

| Item | Status | Catatan |
|---|---|---|
| P0-01 Group rendering | **Blocked** | Config sumber terbukti benar; produksi masih menampilkan group kosong. Perlu staging/parity/upgrade Payload. |
| P0-02 Builder crash | **Selesai & terverifikasi live** | Memilih Hero tanpa gambar tidak crash; panel settings tampil. |
| P0-03 SEO truth | **Sebagian** | Cell menampilkan `—` (bukan 0 palsu); dashboard tidak menampilkan progress dari metrik kosong. Backfill draft dibatalkan karena mengubah status menjadi draf. |
| P0-04 Dark mode | **Selesai sebagian & terverifikasi** | Kontras H1/nav/link di mode gelap 15–18:1. Komponen kustom lain perlu audit visual. |
| P1-01 Tabel overflow | **Selesai & terverifikasi live** | `.table-wrap` scroll; `docW = viewport`, tabel 1.377 px bisa di-scroll. |
| P1-02 Dashboard links/status | **Selesai & terverifikasi live** | Link draf/SEO/halaman, arsip legacy, status deploy jujur. |
| P1-03 Empty state | **Sebagian** | Copy i18n diperbaiki; data seed belum dijalankan. |
| P1-04 Tanggal/angka/boolean | **Selesai sebagian & terverifikasi** | Tanggal live: `24 Oktober 2026, 07.39`. |
| P1-05 A11y | **Sebagian** | Landmark dashboard, heading, aria-label builder, modal semantik. |
| P1-10 Media picker | **Selesai di kode** | Alt text wajib saat upload; tidak memakai nama file. |
| P1-12 IA/nav | **Belum** | Global search, item Dasbor, unified content. |
| P2 | **Belum** | Sesuai rencana rilis 0.3. |

---

## 2. Perubahan Kode

### P0-02 — Builder tidak lagi crash pada media kosong

**File baru**

- `apps/cms/src/components/admin/builder/media-utils.ts`
  - `hasMediaValue`, `getMediaThumbUrl`, `getMediaDisplay`.
  - Menangani `null`, `undefined`, string ID, angka, objek media.
- `apps/cms/src/components/admin/builder/BuilderErrorBoundary.tsx`
  - Menangkap error render per area.
  - Fallback Indonesia + tombol “Coba lagi”/“Kembali”.
  - `resetKey` agar pulih saat seksi berubah.

**File diubah**

- `SectionSettings.tsx`
  - Tidak lagi mengakses `value.alt` saat `value === null`.
  - Memakai helper media.
  - `aria-label` pada tombol hapus foto.
- `BuilderField.tsx`
  - `SectionSettings` dan `PreviewFrame` dibungkus error boundary.
  - Focus trap builder dinonaktifkan saat katalog seksi terbuka.

### P0-03 — Satu sumber skor SEO yang lebih jujur

**File baru**

- `apps/cms/src/lib/seo-engine/display.ts`
  - `hasUsableSeoMetrics()` mendeteksi metrik 0/default.
  - `resolveSeoScore()` memprioritaskan audit score, lalu seoScore, lalu cellData.
  - Skor `0` tanpa metrik/timestamp dianggap “belum diaudit”.

**File diubah**

- `SeoScoreCell.tsx`
  - Menampilkan `—` untuk dokumen belum diaudit.
  - Tidak lagi menampilkan `0 · Perlu diperbaiki` untuk data yang belum dihitung.
  - `aria-label` pada badge.
- `CustomDashboard.tsx`
  - Hanya menghitung progress bar dari dokumen yang metriknya valid.
  - Jika tidak ada metrik valid, tampil “Metrik rinci belum tersedia”.
  - Label “skor tersimpan vs metrik” lebih jelas.
  - Link draf menyebut jumlah draf artikel; link SEO memakai filter `seoScore < 80`; “Lihat semua halaman” tidak lagi menyamar sebagai semua dokumen.
  - Dokumen `landing-pages` legacy ditampilkan sebagai teks “ARSIP”, bukan link 404.
  - Status deploy: “Konten diperbarui … status deploy belum terverifikasi” jika Cloudflare API tidak dikonfigurasi.
  - Role `automation` ditambahkan ke badge.
- `audit-backfill.ts`
  - **Perbaikan akar masalah:** sekarang menyimpan `metrics` dan `engineVersion`, bukan hanya `score`/`grade`/`issues`.

### P0-04 — Dark mode & token warna

- `custom.scss`
  - Warna sidebar, breadcrumb, label field, deskripsi, border tab memakai token `--theme-*`.
  - Tidak lagi memaksa `#0f172a`/`#475569` di tema gelap.
  - **Panel builder dipaksa `color-scheme: light`** agar input/textarea di panel putih tidak mewarisi teks putih dari portal builder bertema gelap.
- `CustomDashboard.tsx`
  - Root memakai `<main>` dan `var(--theme-text)`.
  - H1/subjudul mengikuti tema.
  - Link biru digelapkan ke `#0369a1` agar kontras di latar terang.
- `SeoPanelField.tsx`
  - Label counter diberi warna eksplisit `#334155` agar tidak mewarisi teks putih di tema gelap.
  - Warna aksen digelapkan.

### P1 — Perbaikan pendukung

- `.table { overflow-x: auto }` untuk mencegah kolom terpotong.
- `payload.config.ts`
  - `admin.dateFormat = 'd MMMM yyyy, HH.mm'`.
  - Override i18n: `noResults`, `noResultsDescription`, `noLabel`, `noValue`, `true`, `false`.
  - Flag `PAYLOAD_SKIP_MIGRATIONS=true` untuk pengujian lokal/CI.
- `Media.ts` — label tidak lagi membocorkan kode tiket `(MED-005)`.
- `Services.ts` + `PriceCell.tsx` — harga tampil `Rp100.000`.
- `AddSectionMenu.tsx` / `MediaPickerModal.tsx`
  - `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, Escape, klik backdrop.
  - Tombol tutup punya `aria-label`.
- `MediaPickerModal.tsx`
  - Upload wajib mengisi alt text; tidak lagi memakai nama file.
- `SortableSection.tsx` / `SectionTree.tsx`
  - `aria-label` pada aksi ikon.
  - Label “Nonaktif” menggantikan “Off”.
  - Konfirmasi hapus memakai label seksi, bukan `blockType`.
- `CustomDashboard.tsx`
  - Heading H1 → H2 → H3 (tidak lagi melompat ke H3/H4).
  - `<main>` sebagai landmark.

---

## 3. Verifikasi yang Sudah Dilakukan

### 3.1 Verifikasi lokal

| Pemeriksaan | Hasil |
|---|---|
| `npx tsc --noEmit` (`apps/cms`) | **Lulus** |
| `npm run build --workspace=cms-kala` | **Lulus** (warning dependency expression & Sass legacy, bukan error) |
| `npm run test:uiux --workspace=cms-kala` | **25 lulus, 0 gagal** |
| `git diff --check` | **Lulus** |
| Import map | `PriceCell` terdaftar |

Test `test:uiux` mencakup:

- media `null`/`undefined`/string/angka;
- skor SEO 0 vs null vs 80;
- metrik kosong vs valid;
- backfill menyimpan metrics;
- media picker tidak memakai nama file sebagai alt;
- config Artikel memiliki group `seo` dan field `metaTitle`;
- config SiteSettings memiliki group `analytics` dengan field anak.

### 3.2 Verifikasi produksi setelah deploy

Deploy production: commit `a7ac72b` → `60020ad` → `42d30b0` → `24dab37` → `e37fe5f` → `79eaac1`; container `kala-cms-app` di-recreate. Backup DB sebelum deploy: `kala_cms_db_20261105_pre_uiux.dump`; backup sebelum pembersihan versi: `kala_cms_db_20261105_pre_version_cleanup.dump`.

| Pemeriksaan live | Hasil |
|---|---|
| `https://admin.kalababyspa.com/admin/login` | **200** |
| `/api/pages` | **200** |
| Dashboard | Tampil; `main` landmark ada; heading berurutan |
| P0-02 Builder | **Lulus** — pilih Hero tanpa gambar, panel settings tampil, tidak ada “Application error” |
| P1-01 Tabel | **Lulus** — `docW = 1296`, `.table-wrap` `overflow-x:auto`, tabel 1.377 px dapat di-scroll |
| P0-04 Dark mode | **Lulus** — H1 18,42:1; label nav 18,42:1; link nav 15,45:1 |
| Builder panel terang | **Lulus** — input/textarea `color-scheme: light`, teks `#0f172a` di latar putih |
| P1-04 Tanggal | **Lulus** — `24 Oktober 2026, 07.39` |
| P1-02 Status deploy | **Lulus** — “status deploy belum terverifikasi” (tidak lagi klaim palsu) |
| P0-01 Group SEO | **Masih gagal** — `#field-seo .render-fields` tetap 0 child |
| Daftar Artikel | Skor draf tanpa audit tampil `—` (bukan `0 · Perlu diperbaiki`) |
| Lighthouse Dashboard | **100** (sebelumnya 92) — kontras, heading, landmark fixed; sisa `meta-description` |
| Lighthouse Edit Artikel | **81** (sebelumnya 77) — color-contrast hilang; sisa isu framework (`aria-hidden-focus`, `button-name`, `label`, `list`) |

### 3.3 Catatan backfill

Backfill dijalankan di container sementara `cms-builder-temp` dengan database produksi:

- update **published** untuk artikel 1–3 ditolak oleh validasi publikasi (konten kosong, reviewer medis generik, `reviewedAt` kosong);
- update **draft** berhasil dan sempat mengubah status artikel menjadi “Draf (memiliki versi yang dipublikasikan)”;
- untuk menghindari perubahan status yang membingungkan, versi draft yang baru dibuat dibersihkan kembali (4 versi artikel, 6 versi halaman, 12 versi landing page) dan `latest` dipulihkan;
- skor published artikel 1–3 tetap 80/90/91; skor halaman/landing page yang sempat diperbarui tetap tersimpan;
- **belum ada** backfill final yang aman sampai konten artikel dan reviewer medis dilengkapi.

---

## 4. Blocker & Hal yang Belum Bisa Diselesaikan

### B-01 — P0-01 group rendering masih terbuka di produksi

- Config sumber **terbukti benar** (test config lulus).
- Produksi tetap menampilkan group kosong setelah deploy ulang.
- Dugaan: **bug renderer Payload 3.91 / parity build**.
- **Butuh:** staging dengan snapshot produksi + uji upgrade/pin Payload, atau patch renderer group.
- Ini satu-satunya P0 yang belum selesai.

### B-02 — Backfill final tertahan validasi konten

- Artikel 1–3 tidak bisa di-update published karena validasi publikasi: konten kosong, reviewer medis generik, `reviewedAt` kosong.
- Draft backfill berhasil tetapi mengubah status menjadi “Draf (memiliki versi…)”; versi draft sudah dibersihkan.
- **Butuh:** lengkapi konten + reviewer medis, lalu jalankan backfill final; atau tambahkan opsi backfill `skipValidation` yang aman.

### B-03 — Lighthouse ulang sudah dilakukan

- Dashboard: **100** (naik dari 92).
- Edit Artikel: **81** (naik dari 77; color-contrast hilang).
- Login belum diukur ulang.
- Sisa isu artikel berasal dari komponen framework Payload (`aria-hidden-focus`, `button-name`, `label`, `list`), bukan komponen kustom utama.

### B-04 — Role & mobile belum diuji

- Hanya role superadmin yang diuji.
- Viewport 375/768 belum diuji.
- **Butuh:** matriks role dan UAT mobile.

---

## 5. Langkah Berikutnya (Urutan)

1. **P0-01:** buat staging dari snapshot produksi; uji minimal `group` di Payload 3.91; jika bug library, pin/upgrade. Ini satu-satunya P0 yang tersisa.
2. **Lengkapi konten artikel** (isi, reviewer medis ber-STR, `reviewedAt`) agar validasi publish tidak memblokir.
3. **Backfill final** SEO setelah konten valid; target metrics terisi dan status tetap “Diterbitkan”.
4. **Lighthouse/axe ulang** pada dashboard/artikel/login.
5. **UAT role & mobile** (superadmin/operator/author; 390/768/1024/1366).
6. Jika semua lulus, tutup P0/P1 dan lanjut rilis 0.2.

---

## 6. Catatan

- Deploy produksi dilakukan pada 5 November 2026; backup DB tersedia di `/opt/kalaweb/backups/`.
- Perubahan data produksi: skor halaman/landing page diperbarui oleh backfill; versi draft yang sempat dibuat sudah dibersihkan.
- Perubahan database lokal hanya pada `payload_migrations` untuk keperluan uji server lokal; sudah dikembalikan.
- Commit sudah di-merge ke `main` dan di-push ke GitHub.
