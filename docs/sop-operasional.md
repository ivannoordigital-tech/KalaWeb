# Standar Operasional Prosedur (SOP) Operasional KalaWeb

Panduan kerja praktis untuk tim **Bidan**, **Admin Operasional**, dan **Marketing** dalam mengoperasikan konten, layanan, serta atribusi reservasi di Kala Moms and Baby Spa.

---

## 1. SOP untuk Tim Bidan & Penulis Edukasi

### 1.1 Penulisan Artikel Baru di CMS
1. Buka `https://admin.kalababyspa.com/admin/collections/articles`.
2. Klik **Create New Article**.
3. **Judul & Slug:**
   - Gunakan judul ramah orang tua, contoh: *"Mengapa Bayi Sering Menangis di Jam Tertentu dan Cara Mengatasinya"*.
   - Slug otomatis terbentuk dalam huruf kecil dan tanda hubung.
4. **Validasi Gambar & Alt Text (Wajib):**
   - Setiap gambar **wajib** memiliki *Alt Text* deskriptif (contoh: *"Bidan Kala sedang menenangkan bayi baru lahir dengan teknik sentuhan taktil"*).
   - Format gambar: WebP/JPG/PNG (maksimal ukuran 2 MB).
5. **Medical Reviewer & Kredibilitas:**
   - Wajib memilih nama Bidan peninjau ber-STR aktif.
   - Status artikel akan tetap `draft` sampai disetujui oleh Bidan Koordinator.
6. **Penerbitan:**
   - Ubah status menjadi `Published` dan klik **Save**.
   - Sistem akan otomatis mendebounce (60 detik) dan memicu pembaruan website live tanpa bantuan developer.

---

## 2. SOP untuk Admin Operasional

### 2.1 Mengubah Harga Layanan & Banner Promo
1. Buka menu **Services** di CMS:
   - Pilih layanan yang akan diperbarui (misalnya: *Kala Bundle Duo*).
   - Ubah kolom **Harga** (tampilan) dan **Numeric Price** (untuk sistem & schema).
   - Jika ada promo, masukkan **Harga Coret** (`originalPrice`).
   - Ubah flag `Recommended` jika ingin menampilkan badge *Paling Diminati Bunda*.
2. Untuk banner pengumuman atas website:
   - Buka menu **Site Settings** (Global).
   - Masukkan pesan pada kolom `announcementBanner` (misalnya: *"Promo Bulan Ini: Free Minyak Telon Food-Grade untuk Reservasi Homecare Selapanan"*).
   - Kosongkan kolom jika tidak ada banner aktif.
3. Klik **Save**. Perubahan otomatis terdeploy dalam 1-2 menit.

### 2.2 Menangani Chat Reservasi & Kode Ref WhatsApp
Setiap pesan yang masuk dari website memiliki kode pelacak unik di dalam kurung siku `[ref: ...]`.

**Contoh Format Pesan:**
```
Halo Bidan Kala, saya mau reservasi Kala Bundle Duo (Mom & Baby Ceria) Rp150.000 [ref: KALA-SRV-DUO&f=google_cpc&l=ig_bio&gclid=Cj0K...]
```

**Langkah Penanganan CS/Admin:**
1. **Sapaan Hangat & Validasi:**
   - *"Halo Bunda! Selamat datang di Kala Moms and Baby Spa. Terima kasih sudah menghubungi kami..."*
2. **Pencatatan ke Spreadsheet / CRM Leads:**
   Catat lead masuk ke Google Sheet operasional:
   - **Tanggal & Jam:** Waktu pesan masuk.
   - **Nama Bunda & Area:** (Misal: Bunda Ratna - Surabaya Timur).
   - **Layanan:** (Misal: Kala Bundle Duo).
   - **Kode Ref Utama:** `KALA-SRV-DUO`
   - **Sumber Pertama (f):** `google_cpc` atau `direct`
   - **Sumber Terakhir (l):** `ig_bio`
   - **Status:** *Chatting -> Deal -> Jadwal Terkonfirmasi -> Selesai Layanan -> Repeat Order*.
   - **Nilai Transaksi (IDR):** Nilai nominal yang dibayarkan.
3. **Kepatuhan Privasi (UU PDP):**
   - Jangan menyebarkan nomor kontak atau riwayat kesehatan bayi di luar tim medis resmi Kala.

---

## 3. SOP untuk Tim Marketing & Ads

### 3.1 Menjalankan Iklan Meta / Google Ads
1. **Gunakan Halaman Kampanye Khusus (`/lp/[slug]`):**
   - Jangan arahkan trafik berbayar ke halaman beranda jika kampanye memiliki target spesifik.
   - Contoh URL kampanye:
     - `https://kalababyspa.com/lp/bayi-kolik?utm_source=meta_ads&utm_campaign=kolik_surabaya`
     - `https://kalababyspa.com/lp/pijat-newborn?utm_source=google_ads&utm_campaign=newborn_sidoarjo`
2. **Pelacakan Otomatis (30 Hari):**
   - Skrip tracker KalaWeb secara otomatis menyimpan `fbclid`, `gclid`, `utm_source`, dan `utm_campaign` ke dalam cookie 30 hari.
   - Parameter tersebut akan otomatis disertakan saat Bunda menekan tombol WhatsApp.
3. **Meta Pixel & Google Tag Manager:**
   - Semua tag iklan diinjeksikan lewat GTM Container ID.
   - Event tombol WhatsApp mengirim event `whatsapp_lead` dan `whatsapp_contact`.

---

## 4. Alur Evaluasi Kuartalan

1. **Audit SEO & Search Console:**
   - Cek impresi kata kunci di Google Search Console setiap akhir bulan.
   - Evaluasi halaman `/area/[slug]` dan `/layanan/[slug]` yang menghasilkan impresi tertinggi.
2. **Review Atribusi & Closing Rate:**
   - Bandingkan biaya iklan di Meta/Google dengan total nilai transaksi yang dicatat admin di Google Sheet (berdasarkan kode `[ref: ...]`).
   - Hentikan iklan dengan rasio klik tinggi tetapi closing rendah; tingkatkan anggaran pada kampanye dengan tingkat deal tertinggi.
