# Progress Perbaikan UI/UX CMS — Eksekusi 5 November 2026

**Branch:** `fix/uiux-p0-stabilization`  
**Basis:** [`audit-uiux-admin-cms-2026-11-05.md`](./audit-uiux-admin-cms-2026-11-05.md) dan [`rencana-perbaikan-uiux-cms-2026-11.md`](./rencana-perbaikan-uiux-cms-2026-11.md)  
**Status:** eksekusi P0/P1 awal selesai di kode; verifikasi produksi belum dilakukan.

---

## 1. Ringkasan Status

| Item | Status | Catatan |
|---|---|---|
| P0-01 Group rendering | **Sebagian / blocked** | Config sumber terbukti benar; bug hanya muncul di runtime produksi. Perlu staging/deploy parity. |
| P0-02 Builder crash | **Selesai di kode** | Null guard + error boundary + unit test. |
| P0-03 SEO truth | **Selesai di kode** | Cell/dashboard menangani skor 0 vs belum diaudit; backfill diperbaiki agar menyimpan metrics. |
| P0-04 Dark mode | **Selesai sebagian** | Sidebar, heading dashboard, subjudul, panel SEO, link kontras diperbaiki. Komponen kustom lain masih perlu audit visual. |
| P1-01 Tabel overflow | **Selesai di CSS** | `.table` sekarang `overflow-x: auto`. Perlu verifikasi visual. |
| P1-02 Dashboard links/status | **Selesai di kode** | Link draf/SEO/halaman diperjelas, link legacy tidak lagi 404, status deploy jujur. |
| P1-03 Empty state | **Sebagian** | Copy i18n diperbaiki; data seed belum dijalankan. |
| P1-04 Tanggal/angka/boolean | **Selesai sebagian** | Format tanggal admin, boolean, harga, placeholder. |
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

---

## 4. Blocker & Hal yang Belum Bisa Diselesaikan

### B-01 — P0-01 group rendering tidak dapat direproduksi lokal

- Config sumber **terbukti benar** (test config lulus).
- Produksi tetap menampilkan group kosong.
- Dugaan: **deploy parity / versi build / bug renderer Payload 3.91**.
- Lokal tidak bisa dijadikan bukti karena admin lokal tidak ter-hydrate di lingkungan ini (aset standalone sempat 404; setelah diperbaiki, halaman masih kosong).
- **Butuh:** staging dengan snapshot produksi + akses deploy untuk membandingkan commit/version dan mereproduksi.

**Tindakan berikutnya:** jalankan Gate 0 (parity deploy) di staging. Jangan mengubah data produksi sebelum ini selesai.

### B-02 — Backfill produksi belum dijalankan

- Script sudah diperbaiki, tetapi tidak dijalankan ke produksi.
- Database lokal yang tersedia lebih lama dari schema (kolom `deleted_at` tidak ada), sehingga backfill lokal gagal.
- **Butuh:** backup produksi + dry-run di staging, lalu `npm run audit:backfill --workspace=cms-kala`.

### B-03 — Verifikasi visual & Lighthouse ulang belum dilakukan

- Perubahan tema/tabel perlu deploy ke staging.
- Target: Lighthouse accessibility ≥95, tidak ada body horizontal scroll, kontras AA.
- **Butuh:** deploy staging + audit ulang.

### B-04 — Role & mobile belum diuji

- Hanya role superadmin yang diuji.
- Viewport 375/768 belum diuji di lingkungan ini.
- **Butuh:** matriks role dan UAT mobile.

---

## 5. Langkah Berikutnya (Urutan)

1. **Gate 0:** staging + snapshot produksi + parity commit/version.
2. **P0-01:** bandingkan build produksi vs repo; uji minimal group; upgrade/pin Payload bila perlu.
3. **Deploy staging** perubahan ini, lalu:
   - buka Artikel → SEO;
   - buka Pengaturan Situs;
   - buka Builder → pilih Hero kosong;
   - cek mode gelap;
   - cek tabel Testimoni/Halaman.
4. **Backfill SEO** di staging, verifikasi metrics terisi.
5. **Lighthouse ulang** dan UAT 8 skenario.
6. Jika semua lulus, deploy produksi dengan rollback plan.

---

## 6. Catatan

- Tidak ada data produksi yang diubah.
- Perubahan database lokal hanya pada `payload_migrations` untuk keperluan menjalankan server lokal; bukan bagian dari commit.
- Branch belum di-commit; perubahan menunggu review.
