# Panduan Modular Landing Page Kala Baby Spa (Per Section)

File `index.html` telah berhasil dipisah menjadi **10 modul section terpisah** yang siap dimasukkan ke dalam CMS/Page Builder KalaWeb (`apps/cms` & `apps/web-kala`).

---

## 📁 Daftar File Section (1 Section = 1 Blok)

1. [01-hero.html](file:///d:/Jobs/KalaWeb/landing-page-sections/01-hero.html) — **Hero Section** (Logo Kala, Trust Badge, Headline, Subheadline, Tombol Konsultasi & Layanan, 3 Statistik Singkat)
2. [02-concerns.html](file:///d:/Jobs/KalaWeb/landing-page-sections/02-concerns.html) — **Kekhawatiran Orang Tua / Pain Points** (3 Kartu Masalah Bayi Rewel, Bingung Stimulasi, Kolik & Kembung)
3. [03-benefits.html](file:///d:/Jobs/KalaWeb/landing-page-sections/03-benefits.html) — **Manfaat & Solusi** (4 Grid Manfaat, Quote Bunda Risa, 4 Box Statistik Hasil)
4. [04-promo.html](file:///d:/Jobs/KalaWeb/landing-page-sections/04-promo.html) — **Promo Treatment Pertama** (Box Diskon Rp 120k -> Rp 60k Hemat 50%, Benefit Pijat + Gym)
5. [05-services.html](file:///d:/Jobs/KalaWeb/landing-page-sections/05-services.html) — **Pilihan Layanan Terfavorit** (3 Kartu Layanan: Baby Massage, Pediatric Massage, Perawatan Ibu Nifas)
6. [06-steps.html](file:///d:/Jobs/KalaWeb/landing-page-sections/06-steps.html) — **4 Langkah Mudah dari Rumah** (Konsultasi -> Pilih Jadwal -> Terapis Datang -> Pantau Perkembangan)
7. [07-testimonials.html](file:///d:/Jobs/KalaWeb/landing-page-sections/07-testimonials.html) — **Testimoni Orang Tua** (Review Bintang 5 dari Bunda Maharani, Papa Dimas, Bunda Clarisa)
8. [08-guarantee.html](file:///d:/Jobs/KalaWeb/landing-page-sections/08-guarantee.html) — **Garansi Kepuasan** (Jaminan Puas 100% atau Sesi Pengganti Gratis)
9. [09-final-cta.html](file:///d:/Jobs/KalaWeb/landing-page-sections/09-final-cta.html) — **Call to Action Penutup** (Heading, Link WhatsApp CS, Note respon cepat)
10. [10-floating-wa.html](file:///d:/Jobs/KalaWeb/landing-page-sections/10-floating-wa.html) — **Tombol Melayang (Floating WA)** (Tombol pojok kanan bawah)
11. [landing-page.css](file:///d:/Jobs/KalaWeb/landing-page-sections/landing-page.css) — **File CSS Styling Lengkap** (Warna, typography Fredoka/Nunito, tombol, grid responsif)

---

## 🛠️ Pilihan Implementasi di CMS KalaWeb

### Pilihan A: Menggunakan "Insert HTML" (`HtmlBlock`) per Section
Jika Anda ingin mempertahankan 100% struktur desain dari `index.html`:

1. Buka Admin CMS KalaWeb (`/admin`) -> menu **Semua Halaman (Pages)**.
2. Buat Halaman Baru (atau edit halaman yang diinginkan), pilih **Page Builder**.
3. Tambahkan blok **HTML Kustom (Advanced)** (`HtmlBlock`) untuk setiap section (total 9 atau 10 blok).
4. Beri nama penanda pada field **Nama Blok (Penanda Admin)**, misalnya: `[LP] 01 - Hero`, `[LP] 02 - Kekhawatiran`, dst.
5. Tempelkan isi file HTML masing-masing (`01-hero.html`, `02-concerns.html`, dst.) ke field **Kode HTML**.
6. **Pengaturan Layout di Blok**:
   - **Lebar Maksimal**: `Penuh Layar (full)` (agar wrap max-width 1120px diatur oleh CSS section).
   - **Jarak Atas-Bawah**: `Tanpa Jarak (none)` (karena section sudah memiliki padding bawaan 76px).
7. **Pengaturan CSS/Styling**:
   - Jika ingin terisolasi mandiri, Anda dapat mencentang **"Jalankan JavaScript di dalam sandbox (Advanced)"** dan menyertakan tag `<style>` dari `landing-page.css` di blok tersebut.
   - Atau masukkan isi `landing-page.css` ke stylesheet global website (`apps/web-kala/src/styles/`).

---

### Pilihan B: Menggunakan "Blok Jadi" Bawaan CMS (Native Blocks)
KalaWeb sebenarnya sudah memiliki blok-blok siap pakai yang memetakan setiap section ini secara sempurna:

| Section di `index.html` | Blok Bawaan KalaWeb CMS | Keuntungan Menggunakan Blok Jadi |
| :--- | :--- | :--- |
| **01 - Hero** | `HeroBlock` (`hero`) | Edit headline, subheadline, tombol CTA, dan stats langsung dari form tanpa kode. |
| **02 - Kekhawatiran** | `PainPointsBlock` (`painPoints`) | Menambah/mengurangi kartu masalah, ganti foto dan icon langsung via Media Library. |
| **03 - Manfaat & Stats** | `SolutionsBlock` (`solutions`) + `StatsBlock` (`stats`) | Tampilan rapi, tipografi terintegrasi langsung dengan tema website Kala. |
| **04 - Promo** | `PromoBannerBlock` (`promoBanner`) / `PricingPackagesBlock` | Pengaturan harga coret, diskon, dan timer promo terintegrasi. |
| **05 - Layanan** | `FeaturedServicesBlock` (`featuredServices`) | Terhubung dengan database layanan riil KalaBabySpa. |
| **06 - Alur Langkah** | `StepsFlowBlock` (`steps`) | Alur 1-2-3-4 dengan nomor otomatis dan desain bersih. |
| **07 - Testimoni** | `TestimonialsBlock` (`testimonials`) | Mengambil data testimoni terverifikasi dari koleksi Testimonials. |
| **08 - Garansi** | `GuaranteeBlock` (`guarantee`) | Komponen garansi resmi Kala dengan badge perlindungan. |
| **09 - Final CTA** | `CallToActionBlock` (`cta`) | Call to action dengan parameter tracking WhatsApp divisi iklan. |

---

## 🎯 Cara Adjust Posisi & Layout Per Section
Karena setiap section sekarang sudah menjadi **1 blok terpisah**:
- **Ubah Urutan Posisi**: Pada editor CMS, klik dan seret (drag & drop) blok ke atas atau ke bawah. Anda bisa memindahkan Promo ke paling atas, atau menaruh Testimoni tepat di bawah Hero.
- **Hapus / Sembunyikan**: Jika ingin menjalankan campaign tanpa promo, cukup nonaktifkan atau hapus blok `04-promo` tanpa merusak section lainnya.
- **Duplikasi**: Ingin menambahkan 2 section layanan berbeda? Cukup tambahkan blok baru di posisi yang diinginkan.
