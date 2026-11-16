# Rencana Implementasi Landing Page Ads Kala (Native-First Hybrid)

**Tanggal:** 16 November 2026  
**Status:** Draft — menunggu approval dan penentuan slug  
**Referensi audit:** `landing-page-sections/`, `apps/cms/src/blocks/`, `apps/web-kala/src/pages/sales/[slug].astro`, `apps/cms/src/utilities/pageBuilderValidators.ts`

---

## 1. Ringkasan Keputusan

| Topik | Keputusan |
|---|---|
| Tujuan halaman | **Landing page iklan berbayar** (bukan halaman SEO organik) |
| Slug | **Belum ditentukan**; akan diisi saat eksekusi |
| Pendekatan | **Native-first hybrid** — section memakai blok native Kala |
| File `landing-page-sections/` | Menjadi **referensi konten/copy**, bukan sumber render |
| Tombol WA/CAPI | Tombol tetap berupa link HTML/komponen; CAPI diatur manual menyusul |
| Editor utama | Tim marketing dengan kemampuan teknis dasar |
| Desain | Tidak harus 100% identik dengan desain HTML lama |

**Konsekuensi utama:** rencana lama yang memasukkan 10 `HtmlBlock` + `landing-page.css` global **tidak dipakai**. Pendekatan native menghilangkan blocker sanitizer `<style>`, full-bleed wrapper, CSS bocor, dan validasi publish.

---

## 2. Tujuan dan Non-Tujuan

### Tujuan

1. Halaman iklan yang bisa diubah tim marketing tanpa deploy.
2. Struktur blok modular yang bisa di-reorder.
3. LOLOS validasi publish landing page.
4. CTA WhatsApp siap diarahkan ke endpoint Meta CAPI tanpa mengubah struktur halaman.
5. Performa dan tampilan mobile yang baik.
6. Konten sesuai etika iklan kesehatan.

### Non-Tujuan

1. Meniru 100% desain `landing-page-sections/*.html`.
2. Mengganti halaman `reservasi-online` yang sudah live.
3. Membuat halaman SEO di `/promo-treatment` atau `/baby-spa-surabaya`.
4. Membangun server CAPI penuh pada fase ini.
5. Mengimpor `landing-page.css` ke `global.css`.

---

## 3. Arsitektur Halaman

### 3.1 Route dan tipe halaman

| Atribut | Nilai |
|---|---|
| URL | `/sales/{slug}` |
| `pageType` | `landing` |
| `pageLayout` | `canvas` |
| `editorMode` | `builder` |
| `refCode` | `KALA-LP-{SLUG}-A` |
| `variant` | `A` |
| `activePixels` | Minimal `meta`; tambah `google`/`tiktok` sesuai kampanye |
| `_status` | `draft` sampai review selesai |
| Indexing | Otomatis `noindex, nofollow` dari route landing |

Catatan: `reservasi-online` **tidak dipakai** karena sudah ada di `Pages` dan legacy landing page. Slug baru harus unik dan tidak termasuk reserved slug.

### 3.2 Blok yang dipakai

| # | Blok | Sumber konten | Catatan |
|---|---|---|---|
| 1 | `hero` | `01-hero.html` | Headline, subheadline, badge, CTA. Logo bisa via gambar hero. |
| 2 | `stats` | Statistik hero | 3 angka; selaraskan dengan data perusahaan. |
| 3 | `painPoints` | `02-concerns.html` | 3 poin. Foto tidak tersedia di blok ini. |
| 4 | `solutions` varian `benefits` | `03-benefits.html` | 4 manfaat. |
| 5 | `promoBanner` | `04-promo.html` | Harga promo, harga coret, badge diskon, CTA. |
| 6 | `featuredServices` | `05-services.html` | Mengambil 3 layanan dari koleksi `Services`. |
| 7 | `steps` | `06-steps.html` | 4 langkah. |
| 8 | `testimonials` | `07-testimonials.html` | 3 testimoni; data disimpan di blok, bukan koleksi. |
| 9 | `guarantee` | `08-guarantee.html` | Badge, judul, deskripsi, catatan. |
| 10 | `cta` | `09-final-cta.html` | Banner CTA penutup. |
| 11 | Blok HTML khusus | `10-floating-wa.html` | Floating CTA desktop; link `<a>` biasa. |
| 12 | `faq` (opsional) | Tambahan | Disarankan untuk landing page iklan. |

> Jika foto pada section kekhawatiran dan layanan tetap ingin ditampilkan, tambahkan `gallery` atau `image` di posisi yang sesuai. Karena desain boleh berubah, ini opsional.

### 3.3 Hal yang tidak diimpor

- `landing-page-sections/landing-page.css` **tidak** dimasukkan ke `global.css`.
- Tidak ada `<style>` di dalam `HtmlBlock`.
- Tidak ada `allowScripts` / iframe sandbox untuk section.
- Tidak ada 10 `HtmlBlock` untuk seluruh halaman.

---

## 4. Spesifikasi Halaman di CMS

### 4.1 Metadata wajib

| Field | Nilai |
|---|---|
| Judul | `Kala Baby Spa – Promo Treatment Pertama` (sesuaikan kampanye) |
| Slug | Menunggu keputusan; contoh `promo-treatment` |
| Deskripsi | Ringkasan promo dan area layanan |
| `pageType` | `landing` |
| `pageLayout` | `canvas` |
| `refCode` | `KALA-LP-{SLUG}-A` |
| `variant` | `A` |
| `activePixels` | `meta` (tambahkan sesuai kebutuhan) |
| `showWhatsAppCta` | `false` atau tidak relevan karena layout blok yang dipakai |

### 4.2 Susunan blok awal

Gunakan urutan pada tabel 3.2. Nomor 11 (floating CTA) diletakkan paling akhir atau dirender terpisah oleh route, bukan sebagai section biasa.

---

## 5. Strategi CTA dan Meta CAPI

### 5.1 Prinsip

1. **Jangan memakai `onclick`, `<script>`, atau `javascript:` di dalam `HtmlBlock`.** Sanitizer akan membuang semuanya.
2. Tombol boleh berupa HTML, tetapi hanya `<a href="...">` dengan `class` dan `data-*`.
3. Meta CAPI sebaiknya dijalankan **server-side** melalui endpoint, bukan script inline di halaman.

### 5.2 Fase 1 — sebelum CAPI siap

- CTA native memakai `WhatsAppButton` / `promoBanner` / `cta` dengan pesan dan `refCode` yang tersedia.
- Floating CTA desktop memakai satu blok HTML berisi:

```html
<a
  href="https://app.kalababyspa.online/cta?divisi=iklan-utama"
  class="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-2 rounded-full bg-[#0E733D] px-5 py-3 text-sm font-bold text-white shadow-2xl"
  data-capi-event="Contact"
  data-ref-code="KALA-LP-{SLUG}-A"
>
  Chat WhatsApp
</a>
```

- Di mobile, gunakan `MobileStickyBar` yang sudah ada; floating HTML disembunyikan dengan `hidden md:flex`.

### 5.3 Fase 2 — saat CAPI siap

Pilih salah satu:

1. **Endpoint server (disarankan):** ganti `href` menjadi endpoint yang mengirim CAPI lalu redirect ke WhatsApp. Tidak perlu JavaScript di halaman.
2. **Listener global:** pertahankan `<a class="js-capi-cta" data-ref="...">`, lalu satu script global/GTM mengirim event saat diklik.
3. **Field native:** tambahkan `ctaUrl` dan `trackingId` pada blok CTA/hero/button, lalu marketing mengganti URL dari CMS.

### 5.4 Konsistensi kampanye

Semua CTA dalam satu halaman harus memakai `refCode` dan URL tujuan yang sama. Jika ingin satu titik ubah, tambahkan field page-level `ctaUrl` pada fase berikutnya. Untuk sekarang, catat daftar CTA di halaman agar tidak ada yang tertinggal saat CAPI dipasang.

---

## 6. Floating CTA

| Perangkat | Mekanisme |
|---|---|
| Mobile | `MobileStickyBar` existing (`sales/[slug].astro`) |
| Desktop | Blok HTML `hidden md:flex fixed ...` di atas |
| Tablet | Mengikuti desktop atau mobile sesuai desain |

Jangan mengaktifkan floating desktop dan mobile sekaligus pada lebar yang sama. Uji di 640px, 768px, dan 1024px.

---

## 7. Font dan Styling

- Route landing **tidak memakai `BaseLayout`**, sehingga Fredoka/Nunito tidak termuat.
- Tambahkan preconnect, preload, dan link Google Fonts yang sama seperti `BaseLayout.astro` ke `<head>` `sales/[slug].astro`, atau buat komponen `FontLinks` yang dipakai bersama.
- Styling memakai kelas Tailwind native blok. Tidak ada CSS global baru.
- Jika ada penyesuaian kecil, gunakan class Tailwind pada blok, bukan stylesheet global.

---

## 8. Template dan Seed

### 8.1 Template builder

Tambahkan entri baru di `apps/cms/src/blocks/registry.ts`:

```ts
{
  id: 'landing-kala-ads',
  title: 'Landing Page Ads Kala (Promo)',
  badge: 'Iklan',
  description: 'Struktur landing page iklan: hero, statistik, keluhan, manfaat, promo, layanan, langkah, testimoni, garansi, CTA.',
  blocks: [ /* 11–12 blok native */ ],
}
```

Catatan: tombol “Terapkan Template Ini” **menambahkan** blok ke halaman yang sudah ada. Gunakan halaman kosong atau seed untuk menghindari duplikasi.

### 8.2 Seed script

Buat `apps/cms/src/scripts/seed-landing-ads.ts`:

- Membaca `LANDING_SLUG` dari environment/argumen.
- Jika slug kosong: hanya jalankan mode `DRY_RUN` dan tampilkan rencana.
- Mencari halaman berdasarkan slug.
- Jika sudah ada dan layout tidak kosong: lewati kecuali `OVERWRITE=true`.
- Membuat halaman dengan `pageType: landing`, `pageLayout: canvas`, `refCode`, `activePixels`, `variant`, dan layout dari template.
- Menyimpan sebagai **draft** terlebih dahulu.
- Tidak menyentuh `reservasi-online`.

Tambahkan script npm:

```json
"seed:landing-ads": "cross-env NODE_OPTIONS=--no-deprecation tsx --env-file=.env src/scripts/seed-landing-ads.ts",
"seed:landing-ads:dry": "cross-env DRY_RUN=true npm run seed:landing-ads"
```

### 8.3 Urutan eksekusi seed

1. Tentukan slug.
2. Jalankan `seed:landing-ads:dry`.
3. Jalankan seed.
4. Buka preview builder.
5. Review konten dan CTA.
6. Publish setelah checklist lolos.

---

## 9. Penyesuaian Konten Sebelum Publish

Wajib diselaraskan:

| Isu | Tindakan |
|---|---|
| Harga promo | Pilih satu: `Rp80.000 → Rp60.000` (25%) atau `Rp120.000 → Rp60.000` (50%). |
| Pengalaman | “3 Thn” vs `foundedYear 2020` vs “5 Tahun”. Gunakan satu angka yang benar. |
| Klaim 87% dan 3x | Hapus atau sertakan sumber yang bisa dipertanggungjawabkan. |
| “Puas 100%” | Pastikan garansi benar-benar dijalankan. |
| Testimoni | Pastikan ada consent dan nama yang digunakan valid. |
| “Terapis” vs “Bidan” | Gunakan “bidan ber-STR” secara konsisten. |
| Jumlah layanan | CMS punya 3 layanan; LP lama punya 5. Pilih 3 atau tambah 2 layanan ke CMS. |
| Nomor WhatsApp | Pastikan nomor dan pesan otomatis sesuai kampanye. |
| Ref code | Unik per kampanye, format kapital. |

---

## 10. QA Checklist

### Fungsional

- [ ] Publish berhasil tanpa error validasi.
- [ ] Halaman tampil di `/sales/{slug}`.
- [ ] `noindex, nofollow` aktif.
- [ ] Semua CTA membuka WhatsApp/endpoint yang benar.
- [ ] `refCode` dan `data-*` terbaca di inspector.
- [ ] Floating CTA tidak dobel di mobile/desktop.
- [ ] Font Fredoka/Nunito termuat.
- [ ] Tidak ada horizontal scroll.
- [ ] Blok bisa di-reorder dan preview ikut berubah.
- [ ] `MobileStickyBar` tidak menutupi CTA lain.

### Konten dan kepatuhan

- [ ] Harga dan diskon konsisten.
- [ ] Tidak ada klaim medis terlarang.
- [ ] Statistik punya dasar.
- [ ] Testimoni valid.
- [ ] Alt text gambar terisi.
- [ ] Tidak ada tautan mati.

### Teknis

- [ ] `npm run build` web-kala sukses.
- [ ] Tidak ada perubahan tak terduga di halaman lain.
- [ ] CSS `landing-page.css` tidak diimpor.
- [ ] Tidak ada `onclick`/`<script>` di blok HTML.
- [ ] Preview mobile/tablet/desktop sesuai.

---

## 11. File yang Akan Disentuh

| File | Perubahan |
|---|---|
| `apps/cms/src/blocks/registry.ts` | Tambah template `landing-kala-ads`. |
| `apps/cms/src/scripts/seed-landing-ads.ts` | Baru: seed halaman iklan. |
| `apps/cms/package.json` | Tambah script seed. |
| `package.json` (root) | Tambah alias script (opsional). |
| `apps/web-kala/src/pages/sales/[slug].astro` | Tambah font links; opsional floating desktop. |
| `apps/cms/src/blocks/CallToActionBlock.ts` | Opsional: tambah field `refCode`/`ctaUrl` untuk CAPI. |
| `apps/cms/src/blocks/HeroBlock.ts` | Opsional: tambah `ctaUrl` jika semua CTA harus ke endpoint CAPI. |
| CMS (data) | Halaman, blok, konten, gambar, layanan. |

Tidak perlu mengubah:

- `apps/web-kala/src/components/blocks/HtmlBlock.astro`
- `apps/cms/src/utilities/pageBuilderValidators.ts`
- `apps/web-kala/src/styles/global.css`
- `landing-page-sections/landing-page.css`

---

## 12. Estimasi dan Urutan Kerja

| Fase | Pekerjaan | Estimasi |
|---|---|---|
| 0 | Finalisasi slug, harga, layanan, keputusan CAPI | 0,5 hari |
| 1 | Template builder + seed + font links + floating CTA | 0,5–1 hari |
| 2 | Isi konten, selaraskan harga/klaim, review | 0,5 hari |
| 3 | QA publish, mobile, tracking, build | 0,5 hari |
| 4 | Publish + verifikasi produksi | 0,25 hari |

Total sekitar **2–2,5 hari kerja**, di luar pembuatan endpoint CAPI.

---

## 13. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Seed menimpa halaman yang sudah diedit | Cek layout kosong; `OVERWRITE=true` hanya manual. |
| Slug bentrok dengan `reservasi-online` | Slug baru; validasi unique; cek reserved slug. |
| Template ditambahkan dua kali | Mulai dari halaman kosong atau gunakan seed. |
| CAPI tidak jalan karena `onclick` | Gunakan `<a href>` endpoint atau listener global. |
| Floating CTA dobel | Satu mekanisme per breakpoint. |
| Font tidak termuat | Tambah link font di route landing. |
| Konten klaim tidak valid | Checklist konten dan review manual. |
| Halaman lain terpengaruh | Tidak ada CSS global baru; uji build. |

---

## 14. Rollback

- Unpublish atau hapus halaman baru; tidak ada migrasi database.
- Revert entri `builderTemplates` dan seed script jika tidak dipakai.
- Halaman `reservasi-online` tidak disentuh, sehingga tidak ada dampak ke kampanye lama.
- Tidak ada perubahan pada `HtmlBlock`, validator, atau CSS global.

---

## 15. Keputusan yang Masih Dibutuhkan

1. **Slug final** untuk `/sales/{slug}`.
2. **Harga promo resmi** dan persentase diskon.
3. **Jumlah layanan** yang ditampilkan (3 dari CMS atau 5 dengan menambah data).
4. **Endpoint CAPI** akan dibuat sendiri atau perlu pola integrasi dari tim web.
5. **Testimoni** mana yang sudah memiliki izin.
6. **Floating CTA** desktop: pakai blok HTML atau komponen route.
