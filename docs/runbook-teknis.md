# Runbook Teknis KalaWeb (Astro SSG & Payload CMS)

Dokumen panduan operasional teknis, pemulihan bencana (disaster recovery), rotasi rahasia (*secrets*), dan prosedur *deployment* untuk platform Kala Moms and Baby Spa.

---

## 1. Arsitektur Sistem

```
[Pengunjung Web] ──> [Cloudflare Pages CDN] (Astro SSG - Statis Murni)
                             ▲ (Build Hook saat Publish)
[Admin/Bidan]    ──> [Cloudflare Access / HTTPS]
                             │
                             ▼
                    [Payload CMS - VPS Ubuntu]
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
          [PostgreSQL DB]       [Cloudflare R2]
          (kala_cms_db)         (Media & Aset Gambar)
```

- **Frontend:** Astro 5 SSG di Cloudflare Pages / Workers.
- **CMS:** Payload CMS 3.x (Next.js 15) di VPS Linux via Docker (`kala-cms-app`).
- **Database:** PostgreSQL di VPS (`kala_cms_db` dengan user `kala_cms_user`).
- **Media Storage:** Cloudflare R2 via S3 Storage Adapter.
- **Deploy Trigger:** Debounced Deploy Hook (60s cooldown, 2.5s DB safety delay).

---

## 2. Backup & Restore Database PostgreSQL

### 2.1 Backup Otomatis Harian
Script backup otomatis terletak di:
`apps/cms/scripts/backup-postgres.sh`

Karakteristik:
- Dump terkompresi `gzip` disimpan secara lokal di `/var/backups/kala-postgres`.
- Rotasi lokal otomatis: menghapus backup yang lebih tua dari 30 hari.
- Diunggah ke bucket Cloudflare R2 (`s3cmd` / `aws cli` atau `rclone`).
- Penjadwalan via cron harian:
  ```bash
  # crontab -e
  0 2 * * * /var/www/kalaweb/apps/cms/scripts/backup-postgres.sh >> /var/log/kala-backup.log 2>&1
  ```

### 2.2 Prosedur Restore Database (Uji Terverifikasi)
Script restore terletak di:
`apps/cms/scripts/restore-postgres.sh`

Langkah-langkah:
1. Pastikan layanan Payload dihentikan sementara:
   ```bash
   cd /var/www/kalaweb/apps/cms && docker compose stop cms
   ```
2. Jalankan perintah restore dengan menentukan file backup:
   ```bash
   /var/www/kalaweb/apps/cms/scripts/restore-postgres.sh /var/backups/kala-postgres/kala_cms_db_20261020_020000.sql.gz
   ```
3. Verifikasi data:
   ```bash
   sudo -u postgres psql -d kala_cms_db -c "SELECT count(*) FROM articles;"
   sudo -u postgres psql -d kala_cms_db -c "SELECT count(*) FROM services;"
   ```
4. Nyalakan kembali layanan Payload CMS:
   ```bash
   cd /var/www/kalaweb/apps/cms && docker compose start cms
   ```

---

## 3. Rotasi Rahasia (*Secrets*) & Kunci Akses

Lakukan rotasi minimal setiap 6 bulan atau saat pergantian tim teknis:

### 3.1 Database Password
1. Ganti password di PostgreSQL:
   ```sql
   ALTER USER kala_cms_user WITH PASSWORD 'PasswordBaruYangSangatKuatDanPanjang123!';
   ```
2. Perbarui `DATABASE_URI` di file `apps/cms/.env`:
   ```env
   CMS_DB_PASSWORD=PasswordBaruYangSangatKuatDanPanjang123%21
   DATABASE_URI=postgresql://kala_cms_user:PasswordBaruYangSangatKuatDanPanjang123%21@postgres:5432/kala_cms_db
   ```
3. Restart CMS:
   ```bash
   cd /var/www/kalaweb/apps/cms && docker compose restart cms
   ```

### 3.2 Payload CMS Secret
1. Generate token baru:
   ```bash
   openssl rand -hex 32
   ```
2. Perbarui `PAYLOAD_SECRET` di `apps/cms/.env`.
3. Restart CMS. *(Catatan: Sesi login admin aktif akan ter-logout otomatis).*

### 3.3 Cloudflare Pages Deploy Hook
1. Masuk ke Dashboard Cloudflare Pages > KalaWeb > Settings > Builds & Deployments > Deploy hooks.
2. Buat deploy hook baru, catat URL-nya, lalu hapus hook lama.
3. Perbarui `CLOUDFLARE_DEPLOY_HOOK_URL` di `apps/cms/.env`.
4. Uji publish artikel di CMS untuk memverifikasi pemicuan build baru.

---

## 4. Rollback & Penanganan Kegagalan Build

### 4.1 Fail-Safe Build Protection
- Pada `apps/web-kala/src/lib/payload.ts`, di mode production (`ALLOW_FALLBACK=false`), jika CMS mati/tidak bisa diakses saat build, proses build **sengaja digagalkan (exit 1)**.
- **Hasil:** Cloudflare Pages otomatis mempertahankan versi situs sebelumnya yang masih sehat. Pengunjung tidak akan pernah melihat situs rusak (*white screen* / data kosong).

### 4.2 Rollback Manual Cloudflare Pages
1. Buka Cloudflare Dashboard > Pages > `kala-web`.
2. Klik tab **Deployments**.
3. Cari deployment sukses terakhir sebelum masalah terjadi.
4. Klik tombol **Manage Deployment** > **Rollback to this deployment**.
5. Situs langsung aktif kembali dalam hitungan detik.

---

## 5. Integrasi Database Bersama (PostgreSQL VPS ↔ WA Clinic Bot)

### 5.1 Isolasi Multi-Database
PostgreSQL di VPS melayani dua sistem secara independen dalam 1 Docker network (`wa-clinic-bot_default`):
- `wa_clinic_db` (Milik Bot WA: Pasien, Chat, Booking, Penugasan Bidan)
- `kala_cms_db` (Milik CMS: Master Katalog Layanan, Artikel E-E-A-T, Testimoni, Settings)

User `kala_cms_user` hanya memiliki hak akses ke `kala_cms_db` dan schema `public`-nya, tidak bisa mengakses tabel percakapan/medis bot.

### 5.2 Referensi Kunci Alami (Natural Keys)
- **Layanan:** `services.refCode` (unik, misal: `KALA-SRV-DUO`)
- **Bidan:** `midwives.strNumber` (unik, nomor STR Kemenkes RI)
- **Area Layanan:** `service-areas.slug` (unik, misal: `surabaya-barat`)
- **Jam Kerja:** `site-settings.operationalSchedule` (format JSON terstruktur)

### 5.3 Akses Bot ke API CMS
Bot WA memanggil CMS via internal Docker URL:
- Header: `Authorization: users API-Key <CMS_BOT_API_KEY>`
- Ambil Katalog: `GET http://kala-cms-app:3000/api/services?where[active][equals]=true&sort=order&depth=0&limit=100`
- Kirim Feedback Pasien: `POST http://kala-cms-app:3000/api/testimonials` (status otomatis `active: false` untuk di-review admin)

---

## 6. Proteksi & Hardening VPS

1. **Firewall (UFW):**
   - Hanya buka port `22` (SSH, disarankan non-standar), `80` (HTTP), dan `443` (HTTPS).
   - Port `5432` (Postgres) **dilarang dibuka ke publik** (bind ke internal docker / `127.0.0.1`).
2. **Cloudflare Zero Trust / Access:**
   - Pasang proteksi Cloudflare Access di depan `admin.kalababyspa.com` (OTP via email/2FA).
3. **Fail2ban:**
   - Aktifkan perlindungan terhadap brute force SSH dan rate limit login admin.
4. **Monitoring Uptime:**
   - Pasang UptimeRobot atau Better Stack pada:
     - `https://kalababyspa.com` (Target respons < 300ms)
     - `https://admin.kalababyspa.com/api/deploy-status`
   - Integrasikan alert langsung ke WhatsApp/Telegram PIC.

---

## 7. Matriks Kontak & Eskalasi Darurat

| Peran | Tanggung Jawab | Jalur Komunikasi |
| :--- | :--- | :--- |
| **Lead Developer** | Infrastruktur, VPS, DB, Cloudflare | WA Tim Darurat & Email |
| **Ops Admin** | Jadwal Bidan, Verifikasi Order WA | Grup WA Operasional |
| **Bidan Koordinator** | Validasi Konten Medis & STR | WA Medis |
| **Marketing Lead** | Kampanye Ads, GTM, Meta Pixel | WA Marketing |

---

## 8. Arsitektur Visual Builder, Environment & Akun Layanan Preview (Sprint 0)

### 8.1 Environment Variables
Untuk mendukung SSR Preview aman dengan Signed JWT dan fetching draft terisolasi:

**CMS (`apps/cms/.env`):**
- `PREVIEW_SECRET`: Kunci rahasia minimal 32 karakter untuk menandatangani JWT preview (wajib identik dengan web).
- `PREVIEW_BASE_URL`: URL website publik (default: `https://kalababyspa.com` atau `http://localhost:4321` di dev).
- `CMS_PUBLIC_URL`: URL admin CMS (default: `https://admin.kalababyspa.com`).
- `PREVIEW_API_KEY`: API Key akun `preview-bot`.

**Web (`apps/web-kala` / Cloudflare Pages):**
- `PREVIEW_SECRET`: Kunci JWT yang sama dengan CMS untuk verifikasi token.
- `PREVIEW_API_URL`: URL CMS untuk fetch draft (`https://admin.kalababyspa.com`).
- `PREVIEW_API_KEY`: API Key `preview-bot` (hanya digunakan server-side SSR, tidak pernah diexpose ke browser client).
- `PREVIEW_CF_ACCESS_CLIENT_ID` & `PREVIEW_CF_ACCESS_CLIENT_SECRET`: Service token Cloudflare Access untuk bypass auth Zero Trust khusus request preview internal.

### 8.2 Akun Service `preview-bot`
- **Email:** `preview-bot@kalababyspa.com`
- **Role:** `marketing` (Least Privilege: hanya membaca LandingPages & Pages draft, tidak memiliki hak delete/admin).
- **API Key:** Dikelola via field `apiKey` di koleksi `users`.

---

## 9. Matriks Semantik Deploy Hook vs Draft Save (Sprint 0 - S0-03)

Mekanisme `afterChange` di `LandingPages.ts` dan `Pages.ts` memiliki proteksi khusus agar penyimpanan draft pada dokumen yang sudah published **TIDAK memicu unpublish deploy tak sengaja** ke Cloudflare:

| Kondisi `previousDoc` | Kondisi `doc` (Baru) | Versi Published di DB | Aksi Admin di CMS | Pemicu Deploy Cloudflare | Keterangan & Dampak |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `draft` | `draft` | Tidak ada | Edit / Simpan Draft | **TIDAK** | Perubahan internal; hanya dilihat via `/preview/*`. |
| `draft` | `published` | Ada (baru terbit) | Klik "Publish" | **YA (action: 'publish')** | Memicu build Cloudflare untuk merilis halaman live. |
| `published` | `published` | Ada | Klik "Publish Changes" | **YA (action: 'publish')** | Memicu build Cloudflare untuk memperbarui konten publik. |
| `published` | `draft` | **ADA (masih aktif)** | Klik "Save Draft" | **TIDAK (Dilewati)** | Live site tetap menyajikan versi live; draft baru siap dipreview privat. |
| `published` | `draft` | **TIDAK ADA** | Klik "Unpublish" | **YA (action: 'unpublish')** | Menghapus halaman dari produksi publik. |
| (apa saja) | (deleted) | Was published | Klik "Delete" | **YA (action: 'delete')** | Menghapus rute dari produksi publik. |

---

## 10. Panduan Penggunaan Visual Builder (Shopify-Style Customizer)

### 10.1 Membuka Visual Builder
1. Masuk ke Payload CMS Admin di `/admin`.
2. Buka menu **Landing Page Iklan** (`LandingPages`) atau **Halaman Website** (`Pages`).
3. Di panel formulir, klik tombol **"Buka Visual Page Builder"** (atau ikon ✨ di header card blok).
4. Editor layar penuh (full-screen customizer) akan terbuka dengan tata letak split 2 kolom:
   - **Sisi Kiri (360px):** Pohon susunan seksi (*Section Tree*), pengaturan detail seksi (*Section Settings*), dan katalog blok/template.
   - **Sisi Kanan:** Kanvas *Live Preview* responsif Astro SSR.

### 10.2 Navigasi & Fitur Utama Builder
- **Pohon Seksi & Drag & Drop:**
  - Urutkan ulang seksi sesuka hati dengan menarik gagang drag (ikon 6 titik).
  - Sembunyikan seksi tanpa menghapusnya menggunakan tombol mata (*Hide/Show Toggle*).
  - Duplikasi seksi dengan tombol duplikat (*Duplicate*).
  - Hapus seksi dengan tombol tempat sampah (*Delete*).
- **Sinkronisasi Dua Arah (Canvas ↔ Sidebar):**
  - Mengarahkan kursor ke item sidebar akan menandai seksi di kanvas preview.
  - Mengklik seksi mana saja di dalam kanvas preview langsung membuka pengaturan seksi tersebut di sidebar.
- **Pustaka Media Terintegrasi:**
  - Pada field gambar/foto (misal Foto Hero Utama atau Foto Galeri), klik *"Pilih Foto dari Media..."*.
  - Cari foto di pustaka media atau unggah foto WebP baru langsung dari modal.
- **Template Halaman Siap Pakai:**
  - Klik **"+ Tambah Seksi"** lalu pilih tab **"Template Halaman Siap Pakai"**.
  - Tersedia pilihan template:
    1. *Landing Page Penawaran Lengkap (Standar Konversi)*: Hero, Masalah, Solusi, Paket Harga, Testimoni, FAQ, dan Call to Action.
    2. *Landing Page Promo Kilat (Flash Sale / Singkat)*: Hero Promo Kilat, Solusi, Garansi Kepuasan, dan CTA WhatsApp.
  - Klik *"Terapkan Template Ini"* untuk langsung menyusun seluruh seksi dalam 1 klik.
- **Breakpoint Switcher:**
  - Di bilah atas kanvas preview, pilih mode tampilan:
    - **Desktop:** Lebar 100% fluida
    - **Tablet:** Lebar 768px
    - **Mobile:** Lebar 375px (standar perangkat smartphone pengunjung iklan)
- **Riwayat Undo / Redo & Pintasan Keyboard:**
  - `Ctrl + Z` (atau `Cmd + Z` di Mac): Membatalkan perubahan terakhir (*Undo*).
  - `Ctrl + Shift + Z` (atau `Cmd + Shift + Z` di Mac): Mengulangi perubahan (*Redo*).
  - `Escape`: Menutup modal katalog, kembali ke pohon seksi, atau menutup builder.
  - Builder menyimpan hingga 20 langkah riwayat perubahan lokal tanpa memicu build Cloudflare prematur.

### 10.3 Mode Formulir Blok Klasik (Fallback)
Jika editor menginginkan tampilan formulir isian Payload CMS tradisional:
1. Pada sidebar kanan halaman dokumen di CMS, cari field **"Mode Editor Halaman"**.
2. Ubah pilihan dari **"✨ Shopify-Style Visual Builder"** menjadi **"📝 Formulir Blok Klasik"**.
3. Sistem secara otomatis menyembunyikan customizer visual dan menampilkan accordion blok standar bawaan Payload. Semua data blok 100% identik dan tidak ada data yang hilang.
