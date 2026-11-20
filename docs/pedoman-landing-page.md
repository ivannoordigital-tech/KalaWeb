# Pedoman Pembuatan Landing Page & Etika Iklan Kesehatan KalaWeb

Dokumen ini adalah panduan standar bagi tim **Marketing**, **Copywriter**, dan **Admin Operasional** dalam menyusun halaman kampanye iklan (`/sales/[slug]`) dan halaman kustom (`/[slug]`) di Kala Moms and Baby Spa.

---

## 1. Urutan Blok Standar Berorientasi Konversi (High-Converting Flow)

Landing page yang efektif memandu emosi calon Bunda dari rasa cemas menjadi tenang dan yakin:

```
[1. HeroBlock]           ──> Janji hasil & kredibilitas awal (100% Bidan Ber-STR)
       │
[2. PainPointsBlock]     ──> Validasi masalah nyata Bunda (bayi kolik, kembung, ibu lelah nifas)
       │
[3. SolutionsBlock]      ──> Solusi medis & kehangatan sentuhan bidan (tanpa mom-shaming)
       │
[4. PricingPackagesBlock]──> Transparansi tarif, harga coret promo, & rincian apa yang didapat
       │
[5. ComparisonTableBlock]──> Mengapa Bidan Homecare Kala > Pijat Tradisional Umum
       │
[6. TestimonialsBlock]   ──> Cerita nyata Bunda di Surabaya/Sidoarjo yang terbantu
       │
[7. FaqAccordionBlock]   ──> Menjawab keraguan (keamanan minyak, usia bayi, biaya transport)
       │
[8. GuaranteeBlock]      ──> Garansi higienitas alat steril & komitmen etika kebidanan
       │
[9. CallToActionBlock]   ──> Dorongan ramah untuk mengamankan slot kunjungan via WhatsApp
```

---

## 2. Aturan Bahasa Iklan Kesehatan (Regulasi Nakes Kemenkes RI)

Sebagai penyedia layanan kesehatan berstandar kebidanan resmi, teks iklan Kala **wajib mematuhi etika periklanan kesehatan**:

### 🚫 Kata & Klaim yang DILARANG:
1. **"Menyembuhkan" / "Pasti Sembuh":** Dilarang menjanjikan kesembuhan mutlak atas kondisi medis.
2. **"100% Aman Tanpa Risiko":** Dilarang mengklaim tanpa risiko medis sama sekali.
3. **"Terapi Medis Menggantikan Dokter":** Bidan homecare adalah mitra pemulihan dan stimulasi, bukan pengganti penanganan dokter spesialis anak jika ada tanda bahaya (*red flags*).
4. **"Dijamin Tidak Akan Sakit Lagi" / "Bebas Komplikasi".**

### ✅ Frasa Pendampingan yang DIANJURKAN:
- *"Membantu meredakan ketegangan adaptasi lahir dan begah perut bayi secara alami."*
- *"Stimulasi taktil lembut berbasis ilmu anatomi pediatri oleh bidan ber-STR resmi."*
- *"Mendampingi Bunda di rumah dengan penuh empati, tanpa sedikit pun nada menghakimi (Zero Mom-Shaming).'*
- *"Minyak alami food-grade steril yang aman untuk kulit sensitif bayi baru lahir."*

---

## 3. Checklist Sebelum Mempublikasikan (Pre-Publish Checklist)

Sistem CMS memiliki validasi otomatis (`beforeChange`), namun pastikan poin-poin berikut telah dicek:

- [ ] **Slug URL Unik:** Hanya huruf kecil, angka, dan tanda hubung (contoh: `bayi-kolik`). Tidak memakai rute sistem (`admin`, `layanan`, `blog`, dll).
- [ ] **Tepat 1 Hero Block:** Memastikan ada satu `<h1>` utama di atas halaman agar SEO dan struktur dokumen valid.
- [ ] **Panjang Judul Hero:** Maksimal 70 karakter agar tetap mudah dibaca dalam 2 baris di layar smartphone.
- [ ] **Minimal 1 WhatsApp CTA:** Tombol WhatsApp aktif di Hero, Paket Harga, atau Banner CTA.
- [ ] **Ref Code Kampanye Unik:** Format kapital seperti `LP-KOLIK-ADS-A`.
- [ ] **Alt Text Seluruh Gambar:** Semua foto di galeri dan hero wajib memiliki teks deskripsi.
- [ ] **Gunakan Mode Pratinjau:** Klik tombol **Pratinjau** di pojok kanan atas CMS untuk melihat tampilan live tanpa harus publish ke publik terlebih dahulu.

---

## 4. Panduan Uji Variasi (A/B Testing)

Untuk membandingkan performa 2 copywriting atau tawaran:
1. Buat LP Varian A: `/sales/bayi-kolik-a` dengan Ref Code: `LP-KOLIK-A` (pilih Varian: A).
2. Klik tombol **Duplicate** pada Varian A untuk membuat Varian B.
3. Beri slug baru: `bayi-kolik-b` dan Ref Code: `LP-KOLIK-B` (pilih Varian: B).
4. Ubah variabel yang diuji (misal: judul headline atau paket harga).
5. Pada dashboard iklan Meta/Google, bagi budget 50:50 ke URL `/sales/bayi-kolik-a` dan `/sales/bayi-kolik-b`.
6. Evaluasi performa berdasarkan jumlah chat WhatsApp yang masuk dengan kode ref masing-masing.

---

## 5. Halaman Landing Modular Berbasis Blok HTML

Sebagian landing page (contoh: `promo-treatment`) disusun dari blok **HTML Kustom**, bukan blok native. Aturan khusus:

### 5.1 Simpan Draf vs Publish

| Aksi | Yang terjadi |
|---|---|
| **Simpan Draf** | Perubahan hanya tampil di **Pratinjau Draft** (`/editor-view/sales/{slug}?token=...`). Halaman publik belum berubah. |
| **Publish** | CMS memicu build Cloudflare otomatis (debounce 60 detik). Perubahan tampil di publik setelah build selesai (±2–5 menit). |
| **Unpublish** | Halaman publik dihapus pada build berikutnya (404). |

Jangan menganggap "Simpan Draf" sudah mengubah halaman publik.

### 5.2 Sumber CSS

- Styling terpusat di blok **`🎨 [CSS Global] Styling, Warna & Font`** (blok pertama).
- Ubah token warna di bagian `:root`; seluruh section mengikuti.
- Jangan menambahkan `@import` atau `url()` ke domain eksternal tanpa persetujuan teknis.
- File `landing-page.css` di repo hanyalah arsip; perubahan CSS dilakukan di CMS.

### 5.3 CTA dan tracking

- Setiap CTA wajib memiliki kelas `kala-wa-btn` dan `data-ref-code` unik per section, contoh:
  `KALA-LP-ADS-HERO`, `KALA-LP-ADS-PROMO`, `KALA-LP-ADS-SERVICES`, `KALA-LP-ADS-FINAL`, `KALA-LP-ADS-FLOATING`.
- Tanpa kelas tersebut, klik tidak tercatat di dataLayer, Meta, TikTok, maupun Clarity.
- Tombol melayang WhatsApp hanya tampil di desktop. Di mobile, gunakan sticky bar bawah agar tidak bertumpuk.

### 5.4 Keamanan

- Biarkan opsi **"Jalankan JavaScript di dalam sandbox"** tidak dicentang untuk section tampilan.
- Centang hanya untuk widget yang benar-benar membutuhkan JavaScript (kalkulator, form pihak ketiga). Script berjalan di iframe terisolasi tanpa akses cookie/DOM induk.
- `<script>`, `<iframe>`, `<form>`, event handler, dan `javascript:` otomatis dibuang pada mode non-sandbox.
- Role yang boleh mengaktifkan sandbox: admin/operator teknis.

### 5.5 Checklist khusus halaman HTML

- [ ] Ada tepat satu `<h1>` di salah satu blok section.
- [ ] Ada minimal satu tautan CTA WhatsApp (`wa.me`, `api.whatsapp.com`, atau `/cta`).
- [ ] Semua gambar memiliki `alt`, `width`, dan `height`.
- [ ] Floating WhatsApp tidak diaktifkan untuk mobile.
- [ ] Preview draft diuji di 375px, 768px, dan 1440px sebelum publish.

### 5.6 Backup & smoke test

- Backup konten: `npm run backup:landing` (lokal) atau `bash scripts/backup-landing-docker.sh` (VPS tanpa Node.js). Script menyimpan Page 11 + Template 1 dengan pruning 30 file.
- Sebelum publish perubahan besar:

```bash
npm run build --workspace=web-kala
npm run test:smoke
npm run check:landing-css
npm run check:landing-links
```

- `test:smoke` memakai Chrome yang terpasang dan menguji 375/768/1440, CTA tracking, JSON-LD, serta disclaimer.
- CI `.github/workflows/landing-smoke.yml` menjalankan build + smoke test pada perubahan web/blok.
