# Rencana Perbaikan UI/UX Admin CMS KalaWeb

**Tanggal:** 5 November 2026  
**Basis temuan:** [`audit-uiux-admin-cms-2026-11-05.md`](./audit-uiux-admin-cms-2026-11-05.md)  
**Dokumen terkait:** [`rencana-perbaikan-cms-2026-11.md`](./rencana-perbaikan-cms-2026-11.md) (rencana fungsional menyeluruh) dan [`progress-perbaikan-cms.md`](./progress-perbaikan-cms.md)  
**Sifat:** rencana eksekusi UI/UX; tidak menggantikan rencana fungsional yang sudah ada.  
**Status eksekusi:** lihat [`progress-perbaikan-uiux-cms-2026-11.md`](./progress-perbaikan-uiux-cms-2026-11.md).

---

## 0. Tujuan & Hasil yang Diharapkan

### 0.1 Tujuan

Membuat admin CMS KalaWeb **stabil, dapat dipercaya, dan nyaman** digunakan oleh operator non-teknis, dengan urutan:

1. **Stabilkan** — hilangkan blocker yang membuat pekerjaan tidak bisa diselesaikan.
2. **Percaya** — satukan data dan status agar angka/tautan tidak menyesatkan.
3. **Nyaman** — perbaiki aksesibilitas, tipografi, microcopy, dan alur kerja.
4. **Efisien** — kurangi jumlah klik dan waktu untuk tugas umum.

### 0.2 Hasil akhir yang terukur

| Area | Kondisi sekarang | Target |
|---|---|---|
| Field SEO & Pengaturan Situs | Tidak bisa diedit | Semua field tampil dan tersimpan |
| Visual Builder | Crash saat media kosong | Tidak crash; ada error boundary |
| Skor SEO | 4 angka berbeda | 1 angka, konsisten di semua layar |
| Mode gelap | Kontras 1,03–2,43:1 | Semua teks ≥4,5:1 (AA) |
| Tabel | Meluber, kolom terpotong | Tidak ada horizontal scroll di body |
| Dashboard | Tautan 404 & angka tidak cocok | Semua tautan 200; angka sesuai filter |
| Aksesibilitas | Lighthouse 77–92 | ≥95 untuk dashboard/form/login |
| Konten inti | 6 koleksi kosong | Semua koleksi kunci terisi |
| Microcopy | Tanggal/angka/boolean mentah | Format `id-ID` konsisten |

### 0.3 Asumsi perencanaan

- **Tim minimum:** 1 senior full-stack developer (full-time), 0,5 QA, 0,25 designer/PM, 1 content ops (part-time).
- Jika tersedia **2 developer**, workstream P0 dapat diparalelkan; kalender turun sekitar 35–40%.
- Tersedia **staging** dengan salinan database produksi dan kredensial Cloudflare uji.
- Ada **feature flag** atau mekanisme rollback deploy.
- Publish konten dibekukan selama jendela rilis P0 (maksimal 2 jam per deploy).
- Estimasi memakai **dev-days** dan sudah termasuk unit/integration test, belum termasuk buffer.

### 0.4 Ringkasan kalender

| Rilis | Fokus | Effort | 1 developer | 2 developer |
|---|---|---:|---:|---:|
| **0.1 Darurat** | P0: group render, builder crash, SEO truth, dark mode | 14–18 dev-days | 3–4 minggu | 2 minggu |
| **0.2 Terpercaya** | P1: tabel, dashboard, empty state, microcopy, a11y, builder UX | 22–28 dev-days | 5–6 minggu | 3 minggu |
| **0.3 Nyaman** | P2/IA: global search, unified content, design system, onboarding | 25–35 dev-days | 6–7 minggu | 3–4 minggu |
| **Total** | | **61–81 dev-days** | **14–17 minggu** | **8–9 minggu** |

> **Rekomendasi:** jangan menunggu semuanya selesai. Rilis 0.1 harus keluar dalam **2–4 minggu** karena tiga dari empat P0 memblokir pekerjaan harian.

---

## 1. Prinsip Eksekusi

1. **Stabilkan sebelum merancang ulang.** Jangan menyentuh redesign/IA sebelum P0 selesai.
2. **Satu sumber kebenaran.** Skor SEO, status deploy, dan jumlah draf harus berasal dari satu query/agregasi.
3. **Reproduksi sebelum memperbaiki.** Setiap P0 harus punya langkah reproduksi dan regression test.
4. **Data adalah aset.** Backup database sebelum backfill/migrasi; semua skrip harus idempoten.
5. **Test di dua tema dan tiga viewport.** Terang/gelap; 1024/1366/1440 (plus 390 untuk mobile).
6. **Jangan menampilkan data palsu.** Lebih baik “Belum diaudit” daripada `0`; lebih baik “Status deploy tidak terverifikasi” daripada “Live”.
7. **Perbaikan kecil, rilis sering.** Satu workstream = satu PR + satu gate QA.
8. **Konten dan kode berjalan paralel.** Seed/migrasi konten tidak perlu menunggu perbaikan CSS.

---

## 2. Dependency & Urutan Kerja

```
Gate 0: Backup + staging + deployment parity
   │
   ├── P0-01 Group rendering ───────────────┐
   │      (blocker SEO & settings)          │
   ├── P0-02 Builder crash ─────────────────┤
   │      (blocker halaman)                 ├── Release 0.1
   ├── P0-03 SEO truth ─────────────────────┤
   │      (blocker kepercayaan)             │
   └── P0-04 Dark mode tokens ──────────────┘
          (blocker aksesibilitas)
                     │
                     ▼
   P1-01 Tabel responsif
   P1-02 Dashboard links/status
   P1-03 Empty state + content health
   P1-04 Tanggal/angka/boolean
   P1-05 A11y baseline
   P1-06 Target size/typography
   P1-07 Builder micro UX
   P1-08 Dual authoring
   P1-09 Column picker
   P1-10 Media picker
   P1-11 Login/account
   P1-12 IA/navigation
   P1-13 Loading/error
   P1-14 Responsive
                     │
                     ▼
   P2: Global search, unified content, design system, onboarding
```

**Aturan dependency:**

- P0-01 harus selesai sebelum pekerjaan SEO lanjutan dan sebelum content ops mengisi metadata.
- P0-02 harus selesai sebelum UAT halaman/builder.
- P0-03 harus selesai sebelum dashboard dianggap “trusted”.
- P0-04 bisa berjalan paralel dengan P0-01/P0-02 karena menyentuh file berbeda, tetapi harus selesai sebelum rilis 0.1.
- P1-01 (tabel) sebaiknya setelah P0-03 selesai agar kolom skor SEO tidak berubah dua kali.
- P1-03 (seed konten) bisa mulai hari pertama oleh content ops.

---

## 3. Gate 0 — Persiapan (Hari 0–1)

**Tujuan:** memastikan perbaikan dilakukan di lingkungan yang aman dan tidak mengejar bug yang sebenarnya hanya masalah deploy.

| ID | Tugas | Output | Estimasi | Owner |
|---|---|---|---:|---|
| G0-01 | Backup database produksi + media | Dump SQL, arsip media, checksum | 0,5 d | DevOps |
| G0-02 | Buat staging dari snapshot produksi | URL staging + kredensial | 0,5 d | DevOps |
| G0-03 | Catat commit/version produksi | Commit hash, build ID, versi Payload/Next/React | 0,25 d | Tech lead |
| G0-04 | Bandingkan kode produksi vs repo | Daftar drift deploy | 0,5 d | Tech lead |
| G0-05 | Baseline audit ulang di staging | Screenshot/DOM/Lighthouse baseline | 0,5 d | QA |
| G0-06 | Siapkan feature flag & rollback | Flag untuk dashboard/SEO/theme | 0,25 d | Tech lead |
| G0-07 | Bekukan publish selama rilis P0 | Pengumuman ke tim konten | 0,1 d | PM |

**Gate 0 decision:**

- Jika kode produksi **berbeda** dari repo → redeploy dulu, lalu audit ulang. Mungkin P0-01 hilang tanpa perubahan kode.
- Jika kode sama dan bug tetap ada → lanjut diagnosis library/config.
- Jika tidak ada staging → **jangan mulai backfill data**; prioritaskan pembuatan staging.

---

## 4. Rilis 0.1 — “Darurat” (P0)

**Target:** semua blocker harian hilang; admin bisa mengedit SEO, settings, halaman, dan membaca UI di mode gelap.  
**Durasi:** 14–18 dev-days.  
**Gate rilis:** tidak ada P0 terbuka; regression test lulus; UAT 5 skenario inti.

### 4.1 Workstream A — Group rendering (P0-01)

**Masalah:** field teks/upload di dalam `group` tidak dirender; SEO, internal linking, analytics, banner, homepage, jam operasional, dan Do's & Don'ts tidak bisa diedit.

| ID | Tugas | Detail | Est. | Dependency |
|---|---|---|---:|---|
| A-01 | Reproduksi minimal | Buat halaman uji dengan satu `group` berisi 1 field teks; bandingkan dengan `group` di dalam `tabs` | 0,5 d | Gate 0 |
| A-02 | Audit parity build | Bandingkan bundle produksi vs build lokal; cek `.next`, `importMap`, versi Payload/React/Next | 0,5 d | A-01 |
| A-03 | Isolasi akar masalah | Uji versi Payload 3.91 vs versi terbaru/terdekat; uji `admin.description`, `position`, `tabs` | 1,0 d | A-02 |
| A-04 | Perbaiki/pin versi | Jika bug library → upgrade/pin. Jika konfigurasi → perbaiki config. Jika renderer → patch komponen | 1,5 d | A-03 |
| A-05 | Regression test group | Test untuk Artikel, Halaman, Layanan, Bidan, Area, Landing Page, SiteSettings, HelpCenter | 1,0 d | A-04 |
| A-06 | Interim guard | Sembunyikan tab/group kosong + banner “Bagian ini gagal dimuat. Data aman.” | 0,5 d | A-01 |
| A-07 | Verifikasi data | Pastikan nilai API tetap utuh dan bisa disimpan setelah field tampil | 0,5 d | A-04 |
| A-08 | Dokumentasi | Catat root cause, versi, dan cara mencegah regresi | 0,25 d | A-04 |

**Acceptance criteria**

- [ ] `#field-seo .render-fields` memiliki minimal 7 field anak di Artikel/Halaman/Layanan.
- [ ] `metaTitle`, `metaDescription`, `focusKeyword`, `ogImage`, `canonicalUrl`, `noIndex` bisa diisi dan tersimpan.
- [ ] Group `analytics`, `bannerGroup`, `homepage`, `structuredHours`, `coverageCities` tampil di Pengaturan Situs.
- [ ] Group `internalLinking` tampil di Artikel.
- [ ] Group Do's & Don'ts tampil di Help Center.
- [ ] Tidak ada tab kosong tanpa pesan.
- [ ] Regression test berjalan di CI.

**Risiko khusus:** root cause tidak ditemukan dalam 2 hari. **Mitigasi:** timebox; jika perlu, pin ke versi Payload yang diketahui baik dan tunda upgrade fitur.

---

### 4.2 Workstream B — Builder crash (P0-02)

| ID | Tugas | Detail | Est. | Dependency |
|---|---|---|---:|---|
| B-01 | Null guard media | Guard `value && typeof value === 'object'` di `SectionSettings.tsx:447-449`; audit semua akses `.alt/.filename/.url` | 0,5 d | — |
| B-02 | Empty state media | Tampilkan “Belum ada gambar” + tombol pilih/unggah | 0,25 d | B-01 |
| B-03 | Error boundary | Bungkus `SectionSettings` dan area preview; pesan Indonesia + “Kembali ke daftar seksi” | 1,0 d | — |
| B-04 | Regression test | Unit test `image: null`, `heroImage: null`, `images: []`, media ID string | 0,5 d | B-01 |
| B-05 | Audit crash lain | Cari akses properti tanpa optional chaining di builder | 0,25 d | B-01 |
| B-06 | UAT builder | Buka semua 12 seksi, pilih tiap seksi, preview, simpan draf | 0,5 d | B-01–B-04 |

**Acceptance criteria**

- [ ] Memilih seksi Hero tanpa gambar tidak crash.
- [ ] Memilih seksi galeri kosong tidak crash.
- [ ] Error boundary muncul jika render gagal, dengan tombol pulih.
- [ ] Semua 12 seksi di halaman uji bisa dibuka.
- [ ] Console tidak memiliki uncaught exception.

---

### 4.3 Workstream C — SEO truth (P0-03)

| ID | Tugas | Detail | Est. | Dependency |
|---|---|---|---:|---|
| C-01 | Definisikan model skor | Tentukan `seoScore: number | null`, status “belum diaudit”, dan fungsi kalkulasi tunggal | 0,5 d | — |
| C-02 | Perbaiki `SeoScoreCell` | Baca nilai row yang benar; tampilkan `—` untuk null; jangan render 0 sebagai valid | 0,5 d | C-01 |
| C-03 | Hapus default 0 | Ubah `seoScoreField`/`seoAudit` agar tidak memaksa 0 | 0,25 d | C-01 |
| C-04 | Backfill metrik | Dry-run `audit:backfill`, verifikasi di staging, lalu apply di produksi | 1,0 d | C-01, Gate 0 |
| C-05 | Satukan dashboard | Progress bar memakai metrik tervalidasi; panel SEO dan daftar memakai kalkulasi yang sama | 1,0 d | C-04 |
| C-06 | Label live vs saved | Panel SEO menampilkan “Skor tersimpan” dan “Skor saat ini (live)” | 0,25 d | C-05 |
| C-07 | Consistency test | Test yang membandingkan `seoScore`, `seoAudit.score`, panel live, dashboard | 0,5 d | C-05 |
| C-08 | Dokumentasi | Jelaskan kapan skor dihitung dan apa arti 0/null | 0,25 d | C-05 |

**Acceptance criteria**

- [ ] Artikel 3: daftar, API, panel, dan dashboard menunjukkan angka yang sama.
- [ ] `seoAudit.metrics` tidak lagi semua 0 untuk dokumen yang diaudit.
- [ ] Dokumen baru menampilkan “Belum diaudit” sampai disimpan/diaudit.
- [ ] Progress dashboard 8/11/11/4 tidak lagi muncul jika metrik valid.
- [ ] Backfill idempoten dan punya log.
- [ ] Backup DB tersedia sebelum backfill.

---

### 4.4 Workstream D — Dark mode & token warna (P0-04)

| ID | Tugas | Detail | Est. | Dependency |
|---|---|---|---:|---|
| D-01 | Token sidebar | Ganti warna hardcoded `custom.scss` dengan `var(--theme-*)`; tambah override dark | 1,0 d | — |
| D-02 | Token dashboard | Ganti 35 warna hardcoded di `CustomDashboard.tsx` | 1,5 d | D-01 |
| D-03 | Token SEO panel | Ganti 8 warna hardcoded; beri warna eksplisit pada label counter | 0,5 d | D-01 |
| D-04 | Token builder card | Selaraskan kartu builder dengan tema; atau dokumentasikan builder selalu gelap | 0,5 d | D-01 |
| D-05 | Contrast test | Axe/Playwright untuk kedua tema; target 4,5:1 teks normal, 3:1 teks besar | 0,5 d | D-02–D-04 |
| D-06 | Visual review | Review dashboard, artikel, settings, builder di terang/gelap | 0,25 d | D-05 |

**Acceptance criteria**

- [ ] Tidak ada teks dengan kontras <4,5:1 di dashboard/sidebar/form.
- [ ] “Karakter Judul SEO:” dan “Karakter Deskripsi:” terbaca di kedua tema.
- [ ] `data-theme="dark"` dan `light` sama-sama lolos Lighthouse contrast.
- [ ] Tidak ada `!important` baru untuk warna.
- [ ] Semua komponen kustom memakai token.

---

### 4.5 Gate Rilis 0.1

Rilis hanya jika:

- [ ] Semua acceptance criteria A–D terpenuhi.
- [ ] Tidak ada P0 terbuka.
- [ ] Regression test group, builder, SEO, contrast lulus.
- [ ] UAT dengan 1 admin + 1 operator pada 5 skenario:
  - [ ] Mengisi SEO artikel dan menyimpan.
  - [ ] Mengubah GTM/Meta Pixel/banner di Pengaturan Situs.
  - [ ] Membuka semua seksi builder tanpa crash.
  - [ ] Melihat skor SEO yang sama di daftar/panel/dashboard.
  - [ ] Membaca sidebar/dashboard di mode gelap.
- [ ] Backup + rollback plan siap.
- [ ] Deployment staging → produksi dengan smoke test.
- [ ] Pengumuman ke tim konten.

---

## 5. Rilis 0.2 — “Terpercaya” (P1)

**Target:** tabel bisa dipakai, dashboard tidak menyesatkan, empty state jelas, microcopy dan aksesibilitas membaik.  
**Durasi:** 22–28 dev-days.

### 5.1 Workstream E — Tabel & daftar

| ID | Tugas | Detail | Est. |
|---|---|---|---:|
| E-01 | Wrapper scroll | `.table-wrapper { overflow-x:auto }`; hapus ketergantungan pada body | 0,5 d |
| E-02 | Ringkas header | “Izin Publikasi”, “Paket Unggulan”, “Tata Letak”, “Slug” | 0,5 d |
| E-03 | Default columns | Kurangi kolom default; pindahkan detail ke edit | 0,5 d |
| E-04 | Responsive cards | Di <768 px, tampilkan 3–4 kolom prioritas atau kartu | 1,5 d |
| E-05 | Sticky kolom | Sticky judul/status jika memungkinkan | 0,5 d |
| E-06 | Visual test | 1024/1280/1366/1440; pastikan tidak ada body scroll horizontal | 0,5 d |

**AC:** tabel Pages/Testimoni tidak meluber; semua kolom terjangkau; tidak ada `docW > vw`.

### 5.2 Workstream F — Dashboard & status

| ID | Tugas | Detail | Est. |
|---|---|---|---:|
| F-01 | Perbaiki link draf | Filter semua koleksi atau ubah label “Lihat draf artikel (1)” | 0,5 d |
| F-02 | Perbaiki link SEO | Filter `seoScore < 80` atau halaman laporan SEO | 0,5 d |
| F-03 | Perbaiki “semua dokumen” | Halaman konten terpadu atau label “Lihat semua halaman” | 0,5 d |
| F-04 | Hapus link legacy | Jangan tautkan `landing-pages`; migrasikan data | 0,5 d |
| F-05 | Status deploy jujur | “Tidak terverifikasi” jika API token tidak ada; timestamp deploy nyata | 0,5 d |
| F-06 | Badge jenis | Tampilkan Artikel/Halaman pada item “Tanpa Judul” | 0,25 d |
| F-07 | `aria-label` unik | “Perbaiki SEO: <judul>” | 0,25 d |

**AC:** semua tautan dashboard 200; jumlah draf = isi halaman tujuan; tidak ada klaim live tanpa verifikasi.

### 5.3 Workstream G — Empty state & content health

| ID | Tugas | Detail | Est. | Owner |
|---|---|---|---:|---|
| G-01 | Komponen empty state | Props: judul, deskripsi, CTA, reset filter | 0,5 d | Dev |
| G-02 | Copy per koleksi | Media/FAQ/Bidan/Area/Template/Deploy | 0,5 d | Content |
| G-03 | Deteksi filter aktif | “Tidak ada hasil untuk filter” + Reset | 0,25 d | Dev |
| G-04 | Seed/migrasi konten | Media, FAQ, bidan, area, template, deploy history | 3 d | Content/Dev |
| G-05 | Checklist kesiapan | Widget dashboard: media, FAQ, bidan, area, halaman, deploy | 1 d | Dev |
| G-06 | Verifikasi publik | Pastikan konten CMS tampil di website/preview | 1 d | QA |

**AC:** tidak ada koleksi kunci kosong; empty state membedakan “belum ada” vs “filter kosong”.

### 5.4 Workstream H — Microcopy & format

| ID | Tugas | Detail | Est. |
|---|---|---|---:|
| H-01 | Formatter tanggal | `d MMMM yyyy, HH.mm`, locale `id-ID` | 0,5 d |
| H-02 | Formatter uang | `Rp100.000` di cell dan detail | 0,5 d |
| H-03 | Boolean | “Ya/Tidak” atau badge | 0,25 d |
| H-04 | Placeholder | Hapus `<Tidak ada …>`; gunakan “—” | 0,25 d |
| H-05 | Microcopy pass | Status, tombol, jargon, empty state | 1,0 d |
| H-06 | Snapshot test | Tanggal/harga/boolean/empty state | 0,5 d |

**AC:** tidak ada `<Tidak ada`, `benar/salah`, `Oktober ke-24`, `100000` di UI utama.

### 5.5 Workstream I — Aksesibilitas

| ID | Tugas | Detail | Est. |
|---|---|---|---:|
| I-01 | Landmark | `<main>` + skip link di dashboard/login | 0,5 d |
| I-02 | Heading | H1→H2→H3; audit semua komponen | 0,5 d |
| I-03 | Nama tombol | `aria-label` untuk semua tombol ikon | 0,5 d |
| I-04 | Label form | Combobox relasi, search, media picker | 0,5 d |
| I-05 | ARIA tabs | `role=tablist/tab`, `aria-selected`, `aria-controls`, panah | 0,5 d |
| I-06 | `aria-hidden` focus | Perbaiki select indicator | 0,25 d |
| I-07 | Emoji dekoratif | `aria-hidden="true"` | 0,25 d |
| I-08 | Target & font | 24 px minimum; 12/14/16 px scale | 1,0 d |
| I-09 | Keyboard test | Tab/Enter/Escape/arrow; focus visible | 0,5 d |
| I-10 | CI a11y | axe + Lighthouse threshold | 0,5 d |

**AC:** Lighthouse ≥95; tidak ada pelanggaran `label`, `button-name`, `landmark-one-main`, `heading-order`, `color-contrast`.

### 5.6 Workstream J — Builder & media UX

| ID | Tugas | Detail | Est. |
|---|---|---|---:|
| J-01 | Search katalog | Cari blok/template; kategori tetap | 1,0 d |
| J-02 | Modal semantik | Katalog & media picker: `role=dialog`, focus trap, Escape, restore focus | 1,0 d |
| J-03 | Alt workflow | Minta alt setelah upload; jangan pakai filename | 0,5 d |
| J-04 | Filter media | Folder/tag; pencarian multi-field | 1,0 d |
| J-05 | Label ramah | Ganti `STEPS`, `Off`, `blockType`; template label Indonesia | 0,5 d |
| J-06 | Konfirmasi | Ganti `confirm()` dengan modal | 0,5 d |
| J-07 | Ukuran panel | Teks 12–13 px; tombol 28–32 px | 1,0 d |
| J-08 | Autosave copy | Selaraskan pesan dengan perilaku | 0,25 d |
| J-09 | Error boundary | Uji ulang + recovery | 0,25 d |

**AC:** katalog bisa dicari; modal dapat ditutup keyboard; alt tidak pernah nama file; tidak ada label teknis.

### 5.7 Workstream K — Authoring & login

| ID | Tugas | Detail | Est. |
|---|---|---|---:|
| K-01 | Satu editor | Tampilkan builder atau rich text sesuai `editorMode` | 1,0 d |
| K-02 | Banner sumber | “Halaman ini memakai 12 blok; rich text tidak ditampilkan” | 0,25 d |
| K-03 | Login autocomplete | `current-password`, `new-password` | 0,25 d |
| K-04 | Show password | Tombol lihat/sembunyikan | 0,25 d |
| K-05 | Required | Password `required` | 0,1 d |
| K-06 | Tema login | Konsisten dengan preferensi | 0,25 d |
| K-07 | Remember me | Opsional; sesi lebih panjang | 0,5 d |

**AC:** pengguna tidak bisa mengedit rich text yang diabaikan; login ramah password manager.

### 5.8 Gate Rilis 0.2

- [ ] Semua AC E–K terpenuhi.
- [ ] Lighthouse ≥95 di dashboard/artikel/login.
- [ ] Tidak ada body horizontal scroll di 1024/1366/1440.
- [ ] UAT 8 skenario (lihat §9).
- [ ] Content health: 6 koleksi kunci terisi.
- [ ] Tidak ada P0/P1 terbuka yang menghalangi tugas inti.

---

## 6. Rilis 0.3 — “Nyaman” (P2 & IA)

**Target:** efisiensi jangka panjang, konsistensi desain, dan onboarding.

| ID | Inisiatif | Detail | Est. |
|---|---|---|---:|
| N-01 | Global search / command palette | Ctrl+K; cari dokumen, koleksi, aksi | 4 d |
| N-02 | Item Dasbor di sidebar + badge draf | Navigasi jelas | 1 d |
| N-03 | Halaman konten terpadu | Artikel + halaman + landing; filter jenis/status | 4 d |
| N-04 | Deprecate legacy landing pages | Migrasi/redirect/hapus | 2 d |
| N-05 | Design system token | Warna, tipografi, spacing, status | 4 d |
| N-06 | Onboarding wizard | Checklist setup pertama | 3 d |
| N-07 | Dashboard per role | Widget relevan per role | 3 d |
| N-08 | Media library lanjutan | Bulk edit alt, folder, tag, pencarian | 3 d |
| N-09 | Scheduled publish/review UX | Timeline, status, notifikasi | 4 d |
| N-10 | Performance/bundle | Code split, lazy load, cache | 2 d |

**AC:** waktu menemukan dokumen turun; tidak ada duplikasi konsep landing page; onboarding bisa diselesaikan tanpa bantuan teknis.

---

## 7. Timeline Eksekusi (1 Developer)

| Minggu | Fokus | Output |
|---|---|---|
| **Minggu 0** | Gate 0 | Backup, staging, parity, baseline |
| **Minggu 1** | P0-01 + P0-02 | Group tampil atau root cause jelas; builder tidak crash |
| **Minggu 2** | P0-03 + P0-04 | Skor SEO konsisten; dark mode lolos kontras |
| **Minggu 3** | QA + rilis 0.1 | Rilis darurat; UAT |
| **Minggu 4** | P1 tabel + dashboard | Tabel responsif; link benar |
| **Minggu 5** | P1 microcopy + empty state | Format `id-ID`; konten dasar |
| **Minggu 6** | P1 a11y + builder | Lighthouse ≥95; builder nyaman |
| **Minggu 7** | QA + rilis 0.2 | Rilis terpercaya; UAT |
| **Minggu 8–10** | P2/IA | Search, unified content, design system |
| **Minggu 11** | Hardening + training | Dokumentasi, pelatihan, go-live |

**Dengan 2 developer:** P0-01/P0-02 paralel dengan P0-03/P0-04; rilis 0.1 di minggu 2, rilis 0.2 di minggu 4–5, rilis 0.3 di minggu 7–8.

---

## 8. Prioritas Backlog (MoSCoW + Effort)

| ID | Item | Prioritas | Effort | Dampak | Dependency |
|---|---|---|---:|---|---|
| P0-01 | Group rendering | Must | 4–6 d | Sangat tinggi | Gate 0 |
| P0-02 | Builder null crash | Must | 2–3 d | Sangat tinggi | — |
| P0-03 | SEO truth | Must | 3–4 d | Tinggi | P0-01? (tidak wajib) |
| P0-04 | Dark mode tokens | Must | 3–4 d | Tinggi | — |
| P1-01 | Tabel responsif | Should | 3 d | Tinggi | P0-03 |
| P1-02 | Dashboard links/status | Should | 2 d | Tinggi | — |
| P1-03 | Empty state + konten | Should | 3–4 d | Tinggi | Content ops |
| P1-04 | Format tanggal/angka | Should | 2 d | Sedang | — |
| P1-05 | A11y baseline | Should | 4 d | Tinggi | — |
| P1-06 | Target/font | Should | 2 d | Sedang | — |
| P1-07 | Builder micro UX | Should | 4 d | Sedang | P0-02 |
| P1-08 | Dual authoring | Should | 1,5 d | Sedang | — |
| P1-09 | Column picker | Could | 0,5 d | Sedang | — |
| P1-10 | Media picker | Should | 2 d | Sedang | P0-02 |
| P1-11 | Login/account | Could | 1,5 d | Rendah | — |
| P1-12 | IA/nav | Could | 3 d | Sedang | — |
| P1-13 | Loading/error | Should | 2 d | Sedang | — |
| P1-14 | Responsive | Should | 3 d | Tinggi | P1-01 |
| P2 | Global search, unified content, design system | Won't (rilis ini) | 20+ d | Tinggi jangka panjang | P1 |

---

## 9. Rencana Pengujian

### 9.1 Unit test

- `SectionSettings` dengan media `null`, `undefined`, `{}`, ID string.
- `SeoScoreCell` untuk `null`, 0, 40, 80, 100.
- Formatter tanggal/uang/boolean.
- `applyTemplate` dan `updateSection` tidak mengubah data lain.
- Group renderer: snapshot field anak.

### 9.2 Integration test

- Simpan artikel dengan SEO lengkap → API mengembalikan nilai.
- Simpan Pengaturan Situs analytics/banner/homepage → API berubah.
- Backfill SEO idempoten (jalankan dua kali, hasil sama).
- Upload media dengan alt → media tampil dan alt benar.
- Publish artikel → deploy hook terpanggil (mock).

### 9.3 E2E (Playwright)

1. Login → dashboard → buka artikel → isi SEO → simpan draf → preview.
2. Buka Pengaturan Situs → ubah GTM → simpan → API terverifikasi.
3. Buka halaman → builder → pilih Hero kosong → tidak crash → tambah gambar.
4. Reorder seksi → undo → redo → simpan.
5. Buka daftar Testimoni → filter → reset.
6. Buka mode gelap → periksa kontras via axe.
7. Login → logout → login kembali.
8. Buka tautan dashboard → tidak ada 404.

### 9.4 Visual regression

- Viewport: 390, 768, 1024, 1366, 1440.
- Tema: light, dark.
- Layar: dashboard, artikel edit, halaman edit, settings, builder, media picker.
- Threshold: 0,1% pixel diff; review manual untuk perubahan yang disengaja.

### 9.5 Aksesibilitas

- axe-core di setiap E2E.
- Lighthouse CI: accessibility ≥95.
- Uji keyboard manual: Tab, Shift+Tab, Enter, Space, Escape, Arrow keys.
- Uji screen reader: NVDA/VoiceOver untuk dashboard, form, builder.

### 9.6 UAT (User Acceptance Test)

| # | Skenario | Kriteria lulus |
|---|---|---|
| 1 | Buat artikel + SEO + preview + publish | Selesai <10 menit; skor konsisten |
| 2 | Ubah banner/pixel/homepage | Tersimpan; tampil di preview |
| 3 | Tambah testimoni + consent | Muncul di halaman layanan |
| 4 | Edit halaman dengan builder + gambar | Tidak crash; preview benar |
| 5 | Upload media + alt | Alt tersimpan; tidak memakai filename |
| 6 | Cari draf + jadwalkan publish | Ditemukan; status benar |
| 7 | Buka mode gelap | Semua teks terbaca |
| 8 | Buka di tablet/mobile | Tidak ada horizontal scroll; target cukup |

---

## 10. Rollout, Backup, dan Rollback

### 10.1 Sebelum deploy

- Backup DB + media.
- Catat commit deploy.
- Pastikan staging identik.
- Siapkan feature flag untuk perubahan besar (dashboard/SEO/theme).
- Bekukan publish 1–2 jam.

### 10.2 Saat deploy

- Deploy ke staging → smoke test 15 menit.
- Deploy produksi → smoke test:
  - login;
  - buka artikel & SEO;
  - buka settings;
  - buka builder;
  - cek dashboard;
  - cek mode gelap;
  - cek tabel.
- Monitor error log & Cloudflare build.

### 10.3 Rollback

- Rollback image/commit sebelumnya.
- Restore DB hanya jika migrasi/backfill merusak data (bukan untuk rollback UI).
- Matikan feature flag.
- Umumkan status ke tim.

**Aturan:** jangan rollback DB untuk bug UI. Rollback DB hanya untuk perubahan data yang tidak idempoten.

---

## 11. Risk Register

| Risiko | Prob. | Dampak | Mitigasi | Owner |
|---|---|---|---|---|
| Root cause group render tidak ditemukan | Sedang | Tinggi | Timebox 2 hari; pin versi Payload; interim guard | Tech lead |
| Backfill SEO salah | Sedang | Tinggi | Dry-run staging; backup; idempoten; sampel 10 dokumen | Dev |
| Perubahan tema merusak brand | Rendah | Sedang | Token + review desain; feature flag | Design |
| Tabel responsif menghilangkan kolom penting | Sedang | Sedang | UAT; default kolom; sticky | QA |
| Konten seed tidak sesuai | Sedang | Sedang | Review content ops; verifikasi publik | Content |
| Role lain tidak teruji | Sedang | Sedang | Matriks role di staging | QA |
| Deploy Cloudflare gagal | Sedang | Sedang | Rollback; status jujur; retry | DevOps |
| Waktu developer tersedot bug lama | Tinggi | Sedang | Batasi scope; P0 dulu; backlog P2 | PM |
| Data produksi berubah saat audit | Rendah | Rendah | Snapshot staging; catat tanggal | QA |

---

## 12. RACI

| Aktivitas | Tech Lead | Developer | QA | Content Ops | Design/PM |
|---|---|---|---|---|---|
| Gate 0 & backup | A/R | C | I | I | I |
| P0-01 Group | A | R | C | I | I |
| P0-02 Builder | A | R | C | I | I |
| P0-03 SEO | A/R | R | C | C | I |
| P0-04 Theme | A | R | C | I | C |
| P1 Tabel | A | R | C | I | C |
| P1 Konten | I | C | C | A/R | I |
| P1 A11y | A | R | R | I | C |
| UAT | I | C | A/R | C | C |
| Rilis | A/R | R | C | I | I |

Keterangan: **R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed.

---

## 13. Rencana 5 Hari Pertama

### Hari 1 — Amankan & ukur

- Backup DB/media.
- Buat staging dari snapshot.
- Catat commit/version produksi.
- Baseline Lighthouse & DOM.
- Bekukan publish.

**Output:** staging siap, baseline terdokumentasi, rollback plan.

### Hari 2 — Reproduksi P0-01

- Buat halaman uji group minimal.
- Bandingkan group di root vs dalam tabs.
- Cek parity bundle produksi vs lokal.
- Timebox diagnosis: 1 hari.

**Output:** root cause atau hipotesis utama + rencana fix/pin.

### Hari 3 — Fix P0-01 + test

- Implementasi fix/pin/upgrade.
- Regression test field group.
- Verifikasi di staging untuk Artikel, Settings, Help Center.
- Interim guard jika belum selesai.

**Output:** field SEO/settings tampil; test lulus.

### Hari 4 — P0-02

- Null guard media.
- Error boundary builder.
- Unit test media null.
- UAT builder 12 seksi.

**Output:** builder tidak crash; ada recovery.

### Hari 5 — P0-03 & demo

- Definisikan model skor null/0.
- Perbaiki cell & dashboard.
- Dry-run backfill di staging.
- Demo ke stakeholder.

**Output:** rencana backfill disetujui; skor konsisten di staging.

---

## 14. Metrik Keberhasilan

| Metrik | Baseline | Target 0.1 | Target 0.2 |
|---|---:|---:|---:|
| P0 terbuka | 4 | 0 | 0 |
| P1 terbuka | 14 | ≤10 | 0 |
| Lighthouse a11y dashboard | 92 | ≥95 | ≥98 |
| Lighthouse a11y artikel | 77 | ≥90 | ≥95 |
| Kontras gagal (axe) | >10 | 0 | 0 |
| Body horizontal scroll | Ada | Tidak | Tidak |
| Skor SEO konsisten | Tidak | Ya | Ya |
| Waktu buat artikel + SEO | Tidak terukur | <15 menit | <10 menit |
| Koleksi kunci kosong | 6 | ≤3 | 0 |
| Tautan dashboard 404 | 2+ | 0 | 0 |
| Error builder | 1 | 0 | 0 |

---

## 15. Definition of Done Global

Sebuah task dianggap selesai jika:

- [ ] Kode di-review minimal 1 reviewer.
- [ ] Unit/integration test ditambahkan dan lulus.
- [ ] E2E/visual test diperbarui jika menyentuh alur.
- [ ] Lighthouse/axe tidak menurun.
- [ ] Diuji di light & dark.
- [ ] Diuji di 1024 dan 1440 (plus 390 jika relevan).
- [ ] Tidak ada console error.
- [ ] Dokumentasi/help center diperbarui.
- [ ] Feature flag/rollback tersedia untuk perubahan besar.
- [ ] Product/QA menyetujui acceptance criteria.

---

## 16. Hal yang Harus Dihentikan Sekarang

1. Menampilkan `0` sebagai skor SEO valid.
2. Menampilkan “Situs Live & Sinkron” tanpa verifikasi.
3. Menautkan koleksi `hidden` dari dashboard.
4. Menampilkan `<Tidak ada …>` dan `benar/salah` ke pengguna.
5. Memakai `confirm()` native dengan `blockType`.
6. Memakai `alt` dari nama file.
7. Menambah warna hardcoded baru.
8. Merilis tanpa uji kontras dan keyboard.
9. Mengubah data produksi tanpa backup.
10. Menutup tiket P0 tanpa regression test.

---

## 17. Penutup

Rencana ini sengaja **tidak dimulai dari redesign**. Urutannya adalah:

1. **Perbaiki yang rusak** (P0).
2. **Buat data bisa dipercaya** (P1).
3. **Baru poles pengalaman** (P2).

Jika P0 selesai dalam 2–4 minggu, CMS ini sudah berada di level “layak dipakai dengan pendampingan”. Jika P1 selesai, CMS berada di level “layak dipakai mandiri”. P2 adalah investasi untuk efisiensi jangka panjang.

**Langkah berikutnya:** setujui scope Rilis 0.1, siapkan staging + backup, lalu mulai Gate 0.
