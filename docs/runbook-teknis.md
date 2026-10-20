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
          (Data & Relasi)       (Media & Aset Gambar)
```

- **Frontend:** Astro 5 SSG di Cloudflare Pages.
- **CMS:** Payload CMS 3.x (Next.js) di VPS Linux.
- **Database:** PostgreSQL di VPS.
- **Media Storage:** Cloudflare R2 via S3 Storage Adapter.
- **Deploy Trigger:** Debounced Deploy Hook (60s cooldown, 2.5s DB safety delay).

---

## 2. Backup & Restore Database PostgreSQL

### 2.1 Backup Otomatis Harian
Script backup otomatis terletak di:
`apps/cms/scripts/backup-postgres.sh`

Karakteristik:
- Dump terkompresi `gzip` disimpan secara lokal di `/var/backups/postgres`.
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
   sudo systemctl stop kala-cms
   ```
2. Jalankan perintah restore dengan menentukan file backup:
   ```bash
   /var/www/kalaweb/apps/cms/scripts/restore-postgres.sh /var/backups/postgres/kala_cms_20261020_020000.sql.gz
   ```
3. Verifikasi data:
   ```bash
   sudo -u postgres psql -d kala_cms -c "SELECT count(*) FROM articles;"
   sudo -u postgres psql -d kala_cms -c "SELECT count(*) FROM services;"
   ```
4. Nyalakan kembali layanan Payload CMS:
   ```bash
   sudo systemctl start kala-cms
   sudo systemctl status kala-cms
   ```

---

## 3. Rotasi Rahasia (*Secrets*) & Kunci Akses

Lakukan rotasi minimal setiap 6 bulan atau saat pergantian tim teknis:

### 3.1 Database Password
1. Ganti password di PostgreSQL:
   ```sql
   ALTER USER kala_user WITH PASSWORD 'PasswordBaruYangSangatKuatDanPanjang123!';
   ```
2. Perbarui `DATABASE_URI` di file `apps/cms/.env`:
   ```env
   DATABASE_URI=postgresql://kala_user:PasswordBaruYangSangatKuatDanPanjang123!@127.0.0.1:5432/kala_cms
   ```
3. Restart CMS:
   ```bash
   sudo systemctl restart kala-cms
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

## 5. Proteksi & Hardening VPS

1. **Firewall (UFW):**
   - Hanya buka port `22` (SSH, disarankan non-standar), `80` (HTTP), dan `443` (HTTPS).
   - Port `5432` (Postgres) **dilarang dibuka ke publik** (bind ke `127.0.0.1`).
2. **Cloudflare Zero Trust / Access:**
   - Pasang proteksi Cloudflare Access di depan `admin.kalababyspa.com` (OTP via email/2FA).
3. **Fail2ban:**
   - Aktifkan perlindungan terhadap brute force SSH dan rate limit login admin.
4. **Monitoring Uptime:**
   - Pasang UptimeRobot atau Better Stack pada:
     - `https://kalababyspa.com` (Target respons < 300ms)
     - `https://admin.kalababyspa.com/api/health`
   - Integrasikan alert langsung ke WhatsApp/Telegram PIC.

---

## 6. Matriks Kontak & Eskalasi Darurat

| Peran | Tanggung Jawab | Jalur Komunikasi |
| :--- | :--- | :--- |
| **Lead Developer** | Infrastruktur, VPS, DB, Cloudflare | WA Tim Darurat & Email |
| **Ops Admin** | Jadwal Bidan, Verifikasi Order WA | Grup WA Operasional |
| **Bidan Koordinator** | Validasi Konten Medis & STR | WA Medis |
| **Marketing Lead** | Kampanye Ads, GTM, Meta Pixel | WA Marketing |
