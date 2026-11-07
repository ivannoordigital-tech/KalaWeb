# Homepage via Page Builder

Mulai sekarang beranda **bisa disusun lewat Page Builder CMS**, tanpa mengubah kode.

## Cara kerjanya

- Beranda builder disimpan sebagai dokumen di koleksi **Halaman (`pages`)** dengan slug **`home`**.
- Frontend `apps/web-kala/src/pages/index.astro` mengambil halaman tersebut:
  - Jika halaman `home` **published** dan punya minimal satu blok → seluruh isi beranda dirender dari blok CMS.
  - Jika belum ada / layout kosong → frontend memakai **desain statis lama** (fallback), jadi tidak ada perubahan mendadak.
- URL tetap `https://kalababyspa.com/`. Slug `home` **tidak** menghasilkan halaman `/home` dan tidak masuk sitemap.
- Preview builder tetap memakai route `/editor-view/home` dengan token CMS.

## Cara membuat beranda builder

### Opsi A — lewat terminal (paling cepat)

```bash
npm run seed:homepage:dry   # cek tanpa menulis ke database
npm run seed:homepage       # buat halaman "home" + publish (aman dijalankan ulang)
# hanya jika benar-benar ingin menimpa layout yang sudah diedit:
npm run seed:homepage:force
```

Script ini memakai template **Homepage Kala Moms & Baby Spa** yang berisi 12 blok lengkap
(Hero, keluhan, manfaat, testimoni, promo, layanan unggulan, nilai pembeda, alur reservasi,
area layanan, FAQ, dan CTA). Jika halaman `home` sudah punya blok, script akan **melewatinya**
agar editan manual dari Page Builder tidak hilang.

### Opsi B — lewat CMS

1. Buka **CMS → Halaman Website → Semua Halaman → Create New**.
2. Isi:
   - **Judul Halaman**: `Beranda`
   - **Slug URL**: `home`
   - **Tujuan Halaman**: Halaman Informasi Umum
3. Pastikan **Mode Editor Halaman** = **Builder Visual**.
4. Buka tab **Template Halaman Siap Pakai**, pilih **Homepage Kala Moms & Baby Spa**.
5. Sesuaikan teks/gambar/urutan section, lalu **Publish**.

## Section yang tersedia untuk beranda

| Section | Blok | Catatan |
|---|---|---|
| Hero | `hero` | Badge, headline, subheadline, CTA WhatsApp |
| Keluhan Bunda | `painPoints` | Daftar masalah + ikon |
| Manfaat setelah sesi | `solutions` (variant **benefits**) | Badge, judul, 5 kartu manfaat, catatan kaki |
| Testimoni | `testimonials` | Kutipan, nama Bunda, area |
| Banner promo | `promoBanner` | Harga promo, harga coret, badge diskon, kuota |
| Layanan unggulan | `featuredServices` | Data layanan otomatis dari koleksi `Services` |
| Nilai pembeda | `solutions` (variant **differentiators**) | 5 kartu bernomor + subjudul |
| Alur reservasi | `steps` + `button` | 4 langkah + tombol konsultasi |
| Area layanan | `coverageArea` | Daftar wilayah + tombol cek area |
| FAQ | `faq` | Accordion tanya jawab |
| CTA penutup | `cta` | Banner ajakan + tombol WhatsApp |

Blok generik lain (gambar, video, galeri, stats, tabel perbandingan, dll.) juga tetap bisa
ditambahkan dari katalog builder.

## Catatan penting

- **Jangan hapus** halaman `home` saat beranda builder sedang dipakai. Jika dihapus/di-unpublish,
  frontend otomatis kembali ke desain statis lama.
- Perubahan halaman `home` memicu deploy Cloudflare lewat hook `afterChange` di koleksi `Pages`
  (sama seperti halaman CMS lainnya).
- Teks di **Pengaturan Situs → 🏠 Teks Beranda** tetap dipakai oleh fallback statis dan oleh
  beberapa komponen global (mis. nomor WhatsApp, social proof, jam operasional).
- Jika ingin kembali ke desain statis, cukup unpublish halaman `home`.

## File terkait

- `apps/web-kala/src/pages/index.astro` — renderer beranda + fallback
- `apps/web-kala/src/lib/payload.ts` — `fetchHomepagePage()`
- `apps/cms/src/blocks/registry.ts` — template `homepage-kala`
- `apps/cms/src/scripts/seed-homepage.ts` — seeding halaman `home`
- `apps/cms/src/blocks/{PromoBanner,FeaturedServices,CoverageArea}Block.ts` — blok khusus beranda
