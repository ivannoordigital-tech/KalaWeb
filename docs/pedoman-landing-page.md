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
