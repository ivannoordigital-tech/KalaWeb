# Pedoman Layout & Widget Builder (Homepage)

Panduan singkat untuk tim marketing mengubah **layout dan widget homepage** dari CMS, tanpa developer.

---

## 1. Ringkasan

Homepage bisa disusun dari dua jenis blok:

| Jenis | Contoh | Fungsi |
|---|---|---|
| **Layout** | `Layout / Container` | Membuat 1–4 kolom untuk menampung widget. |
| **Widget** | Judul, Paragraf, Gambar, Tombol, Ikon, Video, Peta, Kartu, HTML | Elemen dasar yang diletakkan di dalam kolom. |
| **Section siap pakai** | Hero, Layanan Unggulan, Pembeda, Area Layanan, Testimoni, FAQ | Bagian utuh yang sudah didesain, tinggal isi teks. |

Container hanya bisa berisi **widget dasar**. Container tidak bisa dimasukkan ke dalam container lain (maksimal 1 tingkat) agar halaman tetap aman di mobile.

---

## 2. Membuat / Mengubah Homepage

1. Buka **CMS → Collections → Pages**.
2. Pilih halaman dengan **slug `home`** dan **Tujuan Halaman = Beranda Utama**.
   - Jika belum ada, buat baru, isi judul, slug `home`, lalu pilih **Beranda Utama**.
   - Sistem akan menolak publish jika slug dan tipe halaman tidak cocok.
3. Klik **Edit** lalu buka **Layout Halaman (Builder)**.
4. Tambah blok lewat tombol **+ Tambah Seksi / Layout**.
5. Simpan **Draf** untuk melihat pratinjau, lalu **Publish** jika sudah siap.

> Selama halaman `home` belum ada atau layout-nya kosong, website otomatis menampilkan homepage lama. Ini adalah pengaman rollback.

---

## 3. Menambah Container dan Widget

### Langkah

1. Klik **+ Tambah Seksi / Layout** → pilih **Layout / Container**.
2. Di panel kanan, pilih jumlah kolom **1–4**.
3. Buka tab **Konten**, lalu pilih kolom yang ingin diisi.
4. Klik **Tambah Widget ke Kolom N**.
5. Pilih widget, misalnya **Widget: Judul**.
6. Isi teks/field, lalu atur tampilan di tab **Gaya**.

### Mengelola widget di dalam kolom

- **Geser urutan:** tombol panah atas/bawah pada daftar widget.
- **Duplikasi:** ikon salin.
- **Hapus:** ikon tempat sampah.
- **Pindah kolom:** dropdown **Pindah ke kolom…**.
- **Buka pengaturan widget:** klik nama widget.

Mengurangi jumlah kolom **tidak menghapus** isi kolom lain. Widget akan muncul lagi jika kolom ditambahkan kembali.

---

## 4. Tab Gaya (Style)

Setiap container dan widget punya tab **Gaya** dengan pilihan aman (tidak merusak desain):

- Latar belakang: transparan, krem, putih, peach, terracotta, cokelat, gradasi.
- Padding & margin: tanpa, rapat, normal, longgar.
- Sudut melengkung, bayangan.
- Perataan teks dan warna teks.
- Lebar maksimum.
- **Tampil di:** semua perangkat, desktop saja, tablet saja, mobile saja.

Pilihan ini memakai token desain Kala, jadi hasilnya konsisten dan tetap ringan.

---

## 5. Widget yang Tersedia

| Widget | Kegunaan | Catatan |
|---|---|---|
| **Judul** | Heading H1–H4 | H1 sebaiknya hanya satu per halaman (biasanya di Hero). |
| **Paragraf** | Teks penjelasan | Pisahkan paragraf dengan baris kosong. |
| **Gambar** | Foto | **Alt text wajib** untuk SEO & aksesibilitas. |
| **Tombol** | CTA WhatsApp atau URL biasa | Pilih **WhatsApp** agar tracking & refCode tetap jalan. |
| **Jarak (Spacer)** | Ruang vertikal | Tanpa konten visual. |
| **Garis Pemisah** | Garis horizontal | Pilih warna & ketebalan. |
| **Ikon + Teks** | Kartu keunggulan | Emoji/ikon, judul, deskripsi. |
| **Video** | YouTube/Vimeo | Pakai URL video biasa; sistem membuat embed aman. |
| **Peta** | Google Maps | Gunakan URL `https://www.google.com/maps/embed?...`. |
| **Kartu** | Foto + judul + deskripsi + tombol | Cocok untuk promo/layanan. |
| **Custom HTML** | Embed/kode khusus | **Script & `<style>` dilarang.** Lihat bagian 6. |

---

## 6. Custom HTML (Khusus)

Gunakan hanya jika widget lain tidak cukup.

**Yang diizinkan:** tag HTML umum, gambar, tabel, video, dan `iframe` dari YouTube, Vimeo, atau Google Maps.

**Yang diblokir otomatis:** `<script>`, atribut `on*` (mis. `onclick`), `<style>`, `javascript:`, dan iframe dari domain asing.

**Token aman** yang bisa dipakai di dalam HTML:

| Token | Diganti menjadi |
|---|---|
| `{{wa_link}}` | Link WhatsApp bertracking |
| `{{phone}}` | Nomor WhatsApp dari Site Settings |
| `{{ref_code}}` | Kode referensi halaman |

> **Catatan Tailwind:** class Tailwind baru di Custom HTML baru aktif **setelah publish dan rebuild** website. Di pratinjau draf, class baru bisa belum terlihat. Gunakan class yang sudah umum dipakai di website.

---

## 7. Pratinjau, Simpan, dan Publish

1. **Simpan Draf** — menyimpan versi kerja.
2. **Pratinjau** — membuka iframe dengan token aman; klik elemen untuk memilih blok terkait.
3. **Publish** — menerbitkan dan memicu rebuild Cloudflare otomatis (karena `home` adalah dokumen Pages).

Jika CMS tidak dapat diakses saat build, website tetap memakai homepage lama (fallback), sehingga situs tidak ikut down.

---

## 8. Aturan Aman (Guardrails)

- Maksimal **satu H1** per halaman.
- Setiap gambar wajib punya **alt text**.
- Halaman iklan (landing page) wajib punya **CTA WhatsApp**.
- Homepage wajib **slug `home` + tipe Beranda Utama**.
- Jangan memakai klaim medis berisiko (mis. "pasti sembuh", "menyembuhkan").
- Container maksimal **1 tingkat** (tidak ada container di dalam container).

---

## 9. Jika Ada Masalah

| Masalah | Solusi |
|---|---|
| Homepage tidak berubah | Pastikan halaman `home` berstatus **published** dan punya minimal 1 blok. |
| Publish ditolak | Periksa pesan validasi: slug/tipe halaman, H1 ganda, alt text, atau CTA. |
| Widget tidak muncul | Cek kolom benar, jumlah kolom mencukupi, dan widget tidak dinonaktifkan (ikon mata). |
| Style Custom HTML tidak muncul | Publish lalu tunggu rebuild selesai. |
| Ingin kembali ke homepage lama | Kosongkan layout halaman `home` atau unpublish — fallback otomatis aktif. |
