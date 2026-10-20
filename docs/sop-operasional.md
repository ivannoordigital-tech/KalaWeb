# Standar Operasional Prosedur (SOP) Operasional & SEO KalaWeb

Panduan kerja resmi untuk tim **Bidan Penulis**, **Bidan Koordinator**, **Admin Operasional**, dan **SEO Specialist** dalam mengoperasikan konten, layanan, harga, serta optimasi pencarian di Kala Moms and Baby Spa.

---

## 1. SOP untuk Tim Bidan & Penulis Konten Edukasi

### 1.1 Struktur Standar Penulisan Artikel (Template Topic Cluster)
Setiap artikel edukasi yang ditulis di CMS (`/admin/collections/articles`) wajib mengikuti 6 pilar struktur:
1. **Pengantar Penuh Empati (Empathy Hook):** Menenangkan kecemasan Bunda tanpa nada menghakimi (*zero mom-shaming*).
2. **Penjelasan Medis Sederhana:** Menjelaskan fisiologi atau penyebab keluhan dengan bahasa awam yang mudah dipahami.
3. **Kapan Perlu ke Dokter / Red Flags (Tanda Bahaya Medis):** Poin tegas tanda bahaya bayi/ibu yang memerlukan penanganan IGD/dokter spesialis segera.
4. **Tindakan Mandiri yang Aman di Rumah:** Tips stimulasi, kompres, atau pijat lembut yang aman dilakukan orang tua.
5. **Rekomendasi Layanan Homecare Terkait (Internal Link CTA):** Menautkan ke minimal 1 layanan resmi Kala (misal: *Pijat Bayi Kolik*, *Pijat Laktasi*).
6. **FAQ Singkat (2-3 Pertanyaan):** Menjawab keraguan umum orang tua seputar topik tersebut.

### 1.2 Checklist Pra-Publish Artikel (Wajib Centang Mandiri)
Sebelum mengubah status artikel menjadi **Published**, pastikan checklist berikut terpenuhi:
- [ ] **Judul Artikel:** 30–60 karakter, memuat kata kunci utama di awal atau tengah judul.
- [ ] **Ringkasan Deskripsi:** 120–155 karakter, menjelaskan manfaat membaca artikel bagi Bunda.
- [ ] **Alt Text Foto Sampul:** Wajib diisi dengan deskripsi visual yang jelas (aksesibilitas & Google Image).
- [ ] **Penulis & Peninjau Medis:** Pilih nama Bidan ber-STR aktif yang bertanggung jawab atas validitas klinis.
- [ ] **Internal Linking (Hubungan Konten):**
  - Minimal 1 Layanan Terkait (`relatedServices`).
  - Minimal 2 Artikel Edukasi Terkait (`relatedArticles`).
  - Pilih apakah artikel ini **Artikel Pilar** atau artikel pendukung yang menunjuk ke **Pilar Induk**.
- [ ] **Status:** Simpan sebagai `Draft` terlebih dahulu untuk ditinjau. Ubah ke `Published` hanya jika telah siap tayang.

---

## 2. SOP untuk Admin Operasional & Koordinator Layanan

### 2.1 Mengubah Harga Layanan & Proteksi Keamanan
1. Buka menu **Services** di CMS (`/admin/collections/services`).
2. Pilih layanan yang akan diperbarui (misal: *Pijat Bayi Homecare Surabaya*).
3. Isi kolom **Harga Angka (Numeric Price)**:
   - Masukkan nominal murni berupa angka (misal: `125000`). Sistem otomatis memformat teks tampilan menjadi `Rp125.000` dan mengupdate Schema.org Google tanpa perlu diketik ulang.
4. **Harga Coret Promo (Original Price):**
   - Jika ada diskon, masukkan nominal asli sebelum diskon pada `Harga Coret`. Sistem memvalidasi harga coret harus selalu lebih besar dari harga jual.
5. **Proteksi Perubahan Harga Ekstrim (>30%):**
   - Jika harga berubah drastis lebih dari 30% (baik kenaikan maupun penurunan), sistem otomatis memblokir penyimpanan untuk mencegah salah ketik nol (misal Rp150.000 menjadi Rp15.000).
   - Untuk melanjutkan perubahan resmi, centang kotak **"Konfirmasi Perubahan Harga >30%"** di bagian bawah formulir.
6. Klik **Save**. Perubahan akan memicu build otomatis Cloudflare Pages.

### 2.2 Memasang & Menghentikan Banner Pengumuman / Promo
1. Buka menu **Pengaturan Situs (Site Settings)** di CMS.
2. Buka grup **Banner Promo Pengumuman**:
   - **Teks Pengumuman:** Tulis teks promo singkat dan menarik (misal: *"Promo Bulan Ini: Free Minyak Telon Alami untuk Paket Selapanan"*).
   - **Tanggal Mulai Tayang (Opsional):** Jadwalkan kapan banner mulai aktif.
   - **Tanggal Berakhir Tayang (Opsional):** Tentukan batas akhir promo. Sistem otomatis menyembunyikan banner setelah tanggal ini berakhir, sehingga promo kedaluwarsa tidak tertinggal di website.
3. Untuk mematikan banner sewaktu-waktu: kosongkan kolom teks pengumuman lalu klik **Save**.

### 2.3 Nomor WhatsApp Resmi
- Kolom WhatsApp nomor diisi dengan format angka baku diawali `628` (contoh: `6281234567890`).
- Sistem otomatis menghapus karakter spasi, tanda plus `+`, tanda hubung `-`, atau angka `0` di depan.

### 2.4 Berapa Lama Perubahan Tampil di Website? (Status Build)
- Setelah menekan tombol **Save** / **Publish**, sistem akan mengirim sinyal build ke Cloudflare Pages.
- Perubahan biasanya aktif di website `https://kalababyspa.com` dalam waktu **1 hingga 2 menit**.
- **Jika situs belum berubah setelah 10 menit:**
  1. Bersihkan cache browser Bunda / buka via mode Incognito / Private Window.
  2. Periksa bot Telegram Notifikasi Deployment Kala (akan ada laporan apakah build berhasil atau gagal).
  3. Hubungi Lead Developer / Super Admin jika terdapat notifikasi error build.

---

## 3. SOP untuk SEO Specialist

### 3.1 Paket SEO Reusable (Articles, Services, Areas, Midwives)
Setiap halaman publik memiliki panel **Optimasi Mesin Pencari (SEO)** standar:
- **Meta Title:** Panjang ideal 30–60 karakter. Jika dikosongkan, sistem otomatis mengambil dari Judul Halaman.
- **Meta Description:** Panjang ideal 120–155 karakter. Jika dikosongkan, mengambil dari ringkasan halaman.
- **Kata Kunci Fokus (Primary Keyword):** Masukkan 1 frasa kata kunci utama (contoh: `pijat bayi surabaya homecare`).
- **Canonical URL:** Kosongkan untuk menggunakan URL default halaman sendiri. Hanya isi jika halaman merupakan duplikasi dari halaman lain.
- **Noindex:** Centang HANYA untuk halaman privat, draft khusus, atau halaman pengujian yang dilarang muncul di Google.
- **Revisi Substantif:** Centang kotak ini jika melakukan pembaruan konten besar agar Google memperbarui timestamp `dateModified` di schema.

### 3.2 Manajemen Redirects (Peralihan URL 301/302)
1. Buka menu **Manajemen Redirects** di CMS (`/admin/collections/redirects`).
2. Masukkan **URL Asal** (misal: `/promo-lama`). Wajib diawali garis miring `/`.
3. Masukkan **URL Tujuan** (misal: `/layanan/bundle-selapan`).
4. Pilih tipe:
   - **301 (Permanen):** Pilihan standar agar ranking Google dari URL lama dialihkan sepenuhnya ke URL baru.
   - **302 (Sementara):** Hanya untuk pengalihan sementara promo bulanan.
5. Sistem memiliki proteksi anti-loop: Anda tidak dapat mengarahkan URL ke dirinya sendiri (`from !== to`).
6. Saat build dijalankan, seluruh daftar redirect aktif akan diinjeksikan otomatis ke file Cloudflare `_redirects`.

---

## 4. Alur Penanganan Lead WhatsApp & Kode Atribusi

Setiap Bunda yang menekan tombol konsultasi di website akan mengirim pesan dengan format unik:
```
Halo Bidan Kala, saya mau reservasi Pijat Bayi Homecare Rp125.000 [ref: KALA-SRV-BAYI&f=google_cpc&l=ig_bio&gclid=Cj0K...]
```

**Langkah Penanganan Admin/CS:**
1. Balas dengan hangat dalam maksimal 5 menit:
   *"Halo Bunda! Selamat datang di Kala Moms and Baby Spa. Terima kasih sudah menghubungi kami. Bidan kami siap hadir ke rumah Bunda di Surabaya / Sidoarjo..."*
2. Catat lead ke Google Sheet Operasional:
   - Tanggal & Waktu
   - Nama Bunda & Wilayah / Kecamatan
   - Layanan & Ref Code (`KALA-SRV-BAYI`)
   - First Touch (`f=google_cpc`) dan Last Touch (`l=ig_bio`)
   - Status Reservasi (*Tanya Jawab -> Terjadwal -> Selesai -> Repeat Order*)
