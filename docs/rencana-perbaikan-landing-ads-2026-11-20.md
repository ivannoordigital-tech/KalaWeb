# Rencana Perbaikan Landing Page Ads Modular (Page 11)

**Tanggal:** 20 November 2026
**Status:** Draft — menunggu approval
**Objek:** Page ID 11 (`promo-treatment`) + PageTemplate ID 1 (`template-landing-ads-10-sections`)
**Basis temuan:** audit kode `HtmlBlock.astro`, `landing-page.css`, `sales/[slug].astro`, `pageBuilderValidators.ts`, `registry.ts`, `triggerDeployHook.ts`
**Prinsip:** tidak ada big-bang rewrite. Pendekatan 11 blok HTML yang sudah live dipertahankan; perbaikan dilakukan bertahap, tiap fase bisa di-deploy dan di-rollback sendiri.

---

## 1. Ringkasan

Pekerjaan 20 November berhasil membuat halaman modular dan tampil sesuai desain. Namun audit menemukan empat hal yang harus diselesaikan sebelum halaman dianggap production-ready:

| # | Temuan | Dampak | Prioritas |
|---|---|---|---|
| 1 | Validator publish menolak halaman yang seluruhnya blok HTML (tidak ada blok `hero`/`cta` native) | Marketing bisa gagal publish saat mengubah konten | **P0** |
| 2 | CSS punya dua sumber (file repo + blok CMS) dan selector global bocor ke semua halaman `/sales/*` | Perubahan tidak konsisten, risiko regresi halaman kampanye lain | **P0** |
| 3 | Floating WhatsApp bisa tampil di mobile dan bertumpuk dengan `MobileStickyBar`; tracking CTA generik | Konversi & atribusi iklan terganggu | **P0** |
| 4 | 11 blok hanya ada di database production, tidak ada di repo/seed | Pekerjaan hilang jika DB di-restore | **P0** |
| 5 | `isRawLayout` rapuh terhadap perubahan background | Layout full-bleed patah tanpa error | P1 |
| 6 | `<style>` dari CMS = CSS arbitrer tanpa guard, sanitasi hanya saat render | Risiko deface/overlay/tracking via CSS oleh editor | P1 |
| 7 | Listener tinggi iframe menumpuk; `postMessage` tanpa cek origin | Fitur sandbox rusak saat dipakai | P2 |
| 8 | Gambar remote tanpa dimensi/srcset, dokumen admin usang, konflik dokumen rencana | CLS, kebingungan admin, keputusan tidak terdokumentasi | P2 |

**Estimasi total:** 6–8 hari kerja (bisa dipadatkan jadi ±4–5 hari jika Fase 1–3 dikerjakan paralel oleh 2 orang).

---

## 2. Keputusan yang Harus Diambil Dulu (Fase 0)

### 2.1 Konflik dokumen arsitektur

`docs/rencana-landing-page-ads-kala-2026-11.md` (16 Nov) memutuskan **native-first hybrid** dan secara eksplisit menyatakan pendekatan 10 `HtmlBlock` + `landing-page.css` global **tidak dipakai**. Implementasi 20 Nov justru memakai pendekatan tersebut.

**Tindakan:** pilih salah satu, jangan dibiarkan ambigu.

- **Opsi A (rekomendasi):** pertahankan pendekatan HTML modular (sudah live dan sesuai permintaan marketing), lalu terbitkan ADR `docs/adr-001-landing-html-modular.md` yang mencatat alasan pembalikan keputusan, konsekuensi keamanan, dan batas penggunaannya. Perbarui dokumen rencana lama dengan catatan "superseded".
- **Opsi B:** kembali ke native-first, artinya 11 blok HTML dibongkar dan pekerjaan 20 Nov dibatalkan. Tidak direkomendasikan karena halaman sudah live dan desain sudah disetujui.

### 2.2 Sumber kebenaran CSS

- **Opsi A (rekomendasi):** blok CMS "🎨 [CSS Global]" menjadi satu-satunya sumber. File repo dihapus dari import dan disimpan sebagai arsip/backup.
- **Opsi B:** file repo menjadi sumber, blok CMS dihapus. Perubahan CSS wajib lewat git/PR — bertentangan dengan tujuan awal "marketing bisa ubah tanpa deploy".

Keputusan ini menentukan isi Fase 2.

### 2.3 Backup & freeze

1. Freeze edit konten page 11 selama pengerjaan.
2. Ekspor dokumen page 11 dan template 1 (JSON) dari REST API Payload ke:
   - `backups/pages/page-11-promo-treatment-2026-11-20.json`
   - `backups/page-templates/template-1-landing-ads-2026-11-20.json`
3. Simpan juga HTML hasil render preview sebagai baseline: `backups/render/promo-treatment-2026-11-20.html`.
4. Tambahkan folder `backups/` ke repo (bukan `.gitignore`) atau object storage tim.

**Acceptance Fase 0:** ADR/opsi tertulis disetujui, backup ada dan bisa dibuka, tidak ada perubahan konten selama fase berikutnya.

---

## 3. Fase 1 — Perbaikan Konversi & UX (P0, ±1 hari)

### 3.1 Verifikasi blok publish

**Masalah:** `pageBuilderValidators.ts` mewajibkan `hasCtaBlock` (blok `cta`/`pricing`/`hero`) untuk semua `pageType: 'landing'`, dan `MISSING_HERO_BLOCK` untuk `pageLayout: 'canvas'`. Page 11 hanya berisi blok `html`, sehingga publish berikutnya berpotensi ditolak.

**Langkah:**
1. Uji publish di staging/preview: ubah satu teks → klik Publish. Catat error yang muncul.
2. Jika gagal, perbaiki validator agar mengenali CTA dan H1 di dalam blok `html`:
   - deteksi `<h1` di `block.html` → memenuhi syarat hero;
   - deteksi `wa.me/`, `api.whatsapp.com`, atau `/cta?` pada `href` → memenuhi syarat CTA;
   - tetap pertahankan aturan untuk halaman berbasis blok native.
3. Tambahkan unit test di `apps/cms/src/scripts/test-validation.ts` untuk tiga kasus: HTML-only valid, HTML-only tanpa CTA (gagal), native landing (tetap valid).

**File:** `apps/cms/src/utilities/pageBuilderValidators.ts`, `apps/cms/src/scripts/test-validation.ts`

**Acceptance:** publish page 11 berhasil tanpa error; test validasi lulus.

### 3.2 Floating WhatsApp vs sticky bar mobile

**Masalah:** `MobileStickyBar` selalu dirender (`md:hidden`, z-40). `.float-wa` tidak punya aturan sembunyi di mobile (z-60, `bottom:16px`), sehingga berpotensi menutupi tombol sticky.

**Langkah:**
1. Cek HTML blok #11 di database. Jika memakai `10-floating-wa.html` apa adanya, ganti dengan versi yang mendukung desktop-only (`hidden md:flex`, seperti versi di `registry.ts`).
2. Tambahkan guard di CSS sebagai lapisan kedua:
   ```css
   @media (max-width: 767px) { .float-wa { display: none !important; } }
   ```
3. Pastikan sticky bar tetap jadi satu-satunya CTA mobile (sudah punya logika scroll + tracking).
4. Kembalikan atribut tracking pada float desktop: `data-capi-event="Contact"`, `data-ref-code="KALA-LP-ADS-FLOATING"`.

**File:** CSS block CMS, `apps/cms/src/blocks/registry.ts` (agar seed konsisten)

**Acceptance:** di 375px hanya ada satu CTA bawah; bounding box float dan sticky tidak overlap; klik float tetap mengirim event.

### 3.3 Atribusi per section

**Masalah:** semua CTA memakai URL identik `.../cta?divisi=iklan-utama`, sehingga tidak ada pembeda hero/promo/layanan/closing/float.

**Langkah:**
1. Tentukan konvensi parameter: `ref=KALA-LP-ADS-{SECTION}` (hero, promo, services, final, floating).
2. Terapkan ke setiap `href` di blok terkait; pertahankan `divisi=iklan-utama` untuk kompatibilitas.
3. Verifikasi endpoint `app.kalababyspa.online/cta` meneruskan parameter tersebut ke WhatsApp/CAPI. Jika tidak, tambahkan `data-ref-code` untuk GTM.
4. Perbarui tabel tracking di `docs/pedoman-landing-page.md`.

**Acceptance:** lima CTA menghasilkan lima ref berbeda; laporan klik per section bisa dibaca di analytics.

### 3.4 Anchor & copy CTA

1. Ganti label "Booking Gratis Konsultasi" menjadi "Lihat Promo Treatment" (karena mengarah ke `#booking` yang berisi kotak promo), atau arahkan langsung ke CTA promo.
2. Tambahkan `scroll-margin-top: 96px` pada `#booking` dan `#layanan` agar tidak tertutup banner preview sticky.
3. Pastikan `#layanan` dan `#booking` hanya ada satu di halaman.

**Acceptance:** klik kedua CTA hero mendarat tepat di section tujuan, tidak tertutup banner.

---

## 4. Fase 2 — Satu Sumber Kebenaran CSS (P0, ±1 hari)

### 4.1 Hapus duplikasi

Sesuai keputusan 2.2:

- Jika CMS kanonik: hapus `import '../../styles/landing-page.css'` dari `apps/web-kala/src/pages/sales/[slug].astro` dan `apps/web-kala/src/pages/editor-view/sales/[slug].astro`; pindahkan file ke `docs/assets/landing-page.reference.css` sebagai arsip.
- Jika repo kanonik: hapus blok CSS dari page 11 dan template 1, lalu dokumentasikan alur PR.

**File:** dua route Astro, blok CMS, `docs/assets/`

### 4.2 Scope selector

`landing-page.css` memakai selector global (`body`, `section`, `p`, `img`, `a`, `h1–h4`, `footer`) dan diimpor untuk **semua** halaman sales. Setelah dipindah ke CMS pun, blok `<style>` di body tetap global.

**Langkah:** bungkus aturan dengan `.kala-html-raw` (class yang sudah dipakai wrapper `HtmlBlock`):

```css
.kala-html-raw p { margin: 0 0 1em }
.kala-html-raw section { padding: 76px 0 }
.kala-html-raw img { max-width: 100%; display: block }
```

Pengecualian yang boleh tetap global: `:root` token (jika disepakati) dan `scroll-behavior`. Hapus `footer{padding:26px 0 90px}` karena halaman canvas tidak memakai footer.

**Acceptance:**
- Halaman `/sales/bayi-kolik` (atau campaign legacy lain) tidak berubah sebelum/sesudah (screenshot diff).
- `/sales/promo-treatment` tetap identik dengan baseline.

### 4.3 Guard sinkronisasi

Tambahkan script `scripts/check-landing-css.mjs` yang membandingkan hash CSS di CMS vs arsip repo, dijalankan di CI. Jika berbeda, keluarkan warning (bukan gagal) agar tim sadar ada perubahan yang belum diarsipkan.

**Acceptance:** CI menampilkan status sinkronisasi CSS.

---

## 5. Fase 3 — Layout Mode Eksplisit (P1, ±1 hari)

**Masalah:** `isRawLayout` menuntut `maxWidth: full` + `padding: none` + `background: transparent`. Marketing yang mengganti background ke `peach` akan memunculkan `px-4 sm:px-6` dan merusak full-bleed.

**Langkah:**
1. Tambah field `layoutMode` (`raw` | `contained`, default `contained`) di:
   - `apps/cms/src/blocks/HtmlBlock.ts`
   - `apps/cms/src/blocks/registry.ts` (defaults)
   - tipe `Props` di `apps/web-kala/src/components/blocks/HtmlBlock.astro`
2. Ubah logika:
   ```ts
   const isRawLayout = block.layoutMode === 'raw'
     || (block.layoutMode == null && block.padding === 'none'
         && block.maxWidth === 'full'
         && (!block.background || block.background === 'transparent'));
   ```
   Fallback terakhir menjaga 11 blok existing tetap bekerja tanpa migrasi data.
3. Pada mode raw, terapkan class background di wrapper tanpa padding horizontal:
   ```astro
   <div class={`kala-html-raw w-full ${backgroundClasses[block.background || 'transparent']}`} set:html={sanitized} />
   ```
4. Opsional: script backfill `layoutMode: 'raw'` untuk 11 blok page 11 dan template 1.

**Acceptance:** matriks uji (raw/contained × background transparan/peach/cream × padding none/normal) menghasilkan lebar penuh atau contained sesuai pilihan, tanpa padding tak terduga.

---

## 6. Fase 4 — Hardening Keamanan (P1, ±1,5 hari)

### 6.1 Batasi eksekusi & role

1. Field `allowScripts`: `access.update` hanya untuk role `admin` (bukan editor/marketing).
2. Blok `html` tetap boleh diedit editor, tetapi publish memunculkan warning (sudah ada) dan tercatat di audit log.
3. Sanitasi saat simpan: pindahkan sanitizer ke util bersama (`apps/cms/src/utilities/sanitizeHtmlBlock.ts` atau package shared) dan jalankan di `beforeChange` untuk koleksi Pages/LandingPages/PageTemplates saat `allowScripts === false`. Dengan begitu data di DB tidak menyimpan script mentah.

### 6.2 Guard CSS

Sudah diuji: `url(https://evil.example/track.gif)` lolos sanitizer. CSS tidak bisa diblokir total (justru fitur intinya), jadi lakukan:

1. Scan `<style>` saat publish:
   - `url(` yang mengarah ke host di luar allowlist (`cdn.scalev.id`, `kalababyspa.com`, `fonts.googleapis.com`, `fonts.gstatic.com`) → warning.
   - `position: fixed`, `position: sticky` dengan `inset` penuh, atau `z-index` > 50 → warning.
2. Tampilkan warning tersebut di UI admin (bukan hanya console).
3. Dokumentasikan bahwa `<style>` adalah fitur tepercaya, bukan input publik.

### 6.3 CSP per path

`apps/web-kala/public/_headers` saat ini memakai satu CSP untuk semua path dengan `style-src 'unsafe-inline'`. Pertahankan untuk `/sales/*` dan `/editor-view/*`, lalu buat aturan lebih ketat untuk path lain. Verifikasi juga `frame-ancestors` hanya mengizinkan admin/preview.

### 6.4 Perbaiki dokumentasi field

`apps/cms/src/blocks/HtmlBlock.ts` masih menyatakan `<style>` "dibuang otomatis". Perbarui agar sesuai perilaku baru: `<style>` diizinkan, `<script>`/`<iframe>`/`<form>`/event handler dibuang kecuali mode sandbox.

**Acceptance:** editor non-admin tidak bisa mengaktifkan sandbox; CSS ber-URL eksternal memunculkan warning publish; deskripsi field akurat.

---

## 7. Fase 5 — Perbaikan Listener Iframe (P2, ±0,5 hari)

**File:** `apps/web-kala/src/components/blocks/HtmlBlock.astro`

1. Daftarkan listener `message` **sekali** (guard `if (window.__kalaHtmlFramesInit) return`).
2. Jangan menyimpan snapshot `frames`; cari frame saat pesan diterima:
   ```ts
   const id = data.id
   const frame = document.querySelector(`[data-frame-id="${CSS.escape(id)}"]`)
   ```
3. Validasi `event.origin === 'null'` (sandbox opaque origin) dan pastikan `event.source === frame.contentWindow`.
4. Kirim tinggi hanya jika berubah (hindari loop ResizeObserver).
5. Tambah test unit untuk `buildSandboxDocument` (CSP ada, font link ada, `overflow-x:hidden`).

**Acceptance:** navigasi Astro berulang tidak menggandakan listener; iframe baru tetap dapat tinggi yang benar.

---

## 8. Fase 6 — Aset, SEO, Kepatuhan (P2, ±1 hari)

1. **Gambar:** tambahkan `width`/`height` (atau `aspect-ratio`) dan `srcset`/`sizes` untuk 8 gambar `cdn.scalev.id`; pertimbangkan migrasi ke Media CMS sendiri. Hero logo: `fetchpriority="high"`.
2. **Struktur data:** tambahkan JSON-LD `LocalBusiness` + `Service`; `Review`/`AggregateRating` hanya jika testimoni benar-benar terverifikasi.
3. **Kepatuhan:** tautan S&K promo, disclaimer bahwa baby massage bersifat komplementer (bukan pengganti layanan medis), persetujuan testimoni, dan kebijakan privasi untuk pixel/WA.
4. **Meta:** pastikan `noindex, nofollow` tetap ada (sudah ada di route), OG image khusus promo, deskripsi unik.
5. **Link check:** otomatiskan pemeriksaan seluruh `href` (anchor internal, `/cta`, WA) di CI.

**Acceptance:** Lighthouse mobile Performance ≥ 85, CLS < 0,1, tidak ada link mati, disclaimer tampil.

---

## 9. Fase 7 — Guardrail, Backup, Dokumentasi (P2, ±1 hari)

### 9.1 Smoke test Playwright

Buat `apps/web-kala/tests/landing-ads.spec.ts`:

- tidak ada `<iframe>` di `/sales/promo-treatment`;
- `font-family` elemen `h1` mengandung `Fredoka`, body `Nunito`;
- section hero selebar viewport, tanpa padding horizontal tak terduga;
- tidak ada scrollbar horizontal di 375/768/1440;
- di 375px: `#mobile-sticky-bar` dan `.float-wa` tidak overlap (cek bounding box);
- semua CTA mengembalikan status < 400;
- screenshot diff terhadap baseline Fase 0.

Jalankan di CI untuk PR yang menyentuh `apps/web-kala/**`, `apps/cms/src/blocks/**`, dan `landing-page-sections/**`.

### 9.2 Backup & seed

1. Jadwalkan ekspor harian page 11 + template 1 (JSON) ke `backups/` atau object storage.
2. Selaraskan `seed-landing-ads.ts` dengan struktur final. Pilih satu:
   - seed menghasilkan 11 blok HTML yang sama (konten versioned di repo), atau
   - seed tetap native, dan page 11 didokumentasikan sebagai pengecualian dengan backup wajib.
3. Hapus/arsipkan template duplikat agar tidak ada dua versi yang dipelihara manual.

### 9.3 Dokumentasi

- Perbarui `docs/pedoman-landing-page.md`:
  - bedakan "Simpan Draf" (hanya preview draft) vs "Publish" (memicu deploy otomatis, debounce 60 detik);
  - cara mengubah token warna di blok CSS;
  - kapan boleh mencentang mode sandbox;
  - batasan `<style>` dan larangan `url()` eksternal.
- Perbarui `docs/rencana-landing-page-ads-kala-2026-11.md` dengan status "superseded".
- Tambahkan bagian rollback di `docs/runbook-teknis.md`.

**Acceptance:** admin baru bisa mengikuti panduan tanpa bertanya; backup harian terbukti ada.

---

## 10. Matriks Regression Test

| Skenario | Alat | Target |
|---|---|---|
| Layout 375/768/1440 | Playwright + screenshot | identik baseline |
| Full-bleed & tanpa scrollbar ganda | Playwright (ukur `scrollWidth`) | `scrollWidth === clientWidth` |
| Font benar | `getComputedStyle` | Fredoka/Nunito |
| Tidak ada iframe | query DOM | 0 |
| CTA mobile tunggal | bounding box | tidak overlap |
| Publish page 11 | staging CMS | sukses |
| Sanitizer | unit test | `<script>` hilang, `<style>` tetap |
| Halaman sales lain | screenshot diff | tidak berubah |
| Publish → deploy | log Cloudflare | build terpicu ≤ 1 menit |

---

## 11. Rollback

| Level | Cara |
|---|---|
| Konten | Payload versions (`maxPerDoc: 25`) + restore JSON backup |
| CSS | kembalikan isi blok CSS dari arsip repo |
| Kode | `git revert` commit per fase (tiap fase satu PR) |
| Deploy | rollback ke deployment Cloudflare sebelumnya |

Syarat: setiap fase harus satu PR terpisah dengan commit yang bisa direvert independen.

---

## 12. Definition of Done

1. Page 11 bisa di-publish ulang tanpa error validasi.
2. Hanya ada satu sumber CSS; halaman sales lain tidak terpengaruh.
3. Mobile hanya punya satu CTA bawah; atribusi per section aktif.
4. Backup page 11 + template 1 ada di repo/object storage dan terjadwal.
5. Layout tidak rusak saat background section diubah.
6. `allowScripts` hanya bisa diaktifkan admin; CSS eksternal memunculkan warning.
7. Smoke test Playwright lulus di tiga viewport.
8. Dokumentasi admin dan ADR diperbarui.

---

## 13. Urutan & Timeline Ringkas

| Hari | Fase | Output |
|---|---|---|
| 1 | Fase 0 | Backup, ADR, keputusan CSS |
| 2 | Fase 1 | Publish lolos, CTA mobile & tracking |
| 3 | Fase 2 | CSS tunggal + scope |
| 4 | Fase 3 | `layoutMode` |
| 5–6 | Fase 4 | Hardening & CSP |
| 7 | Fase 5 + 6 | Listener, aset, SEO |
| 8 | Fase 7 | Test, backup otomatis, docs |

Fase 1 dan 2 boleh paralel jika ada dua orang. Fase 4 tidak boleh dimulai sebelum Fase 2 selesai (keduanya menyentuh kebijakan CSS).
