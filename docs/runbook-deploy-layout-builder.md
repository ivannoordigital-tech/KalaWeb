# Runbook — Deploy Layout & Widget Builder

Panduan deploy fitur **layout builder** (container 1–4 kolom + widget block)
dan pembuatan draft **Homepage 2** ke server produksi.

> Ruang lingkup: commit `feat(builder): layout container, widget blocks, and CMS homepage rendering`
> (branch `feat/layout-widget-builder`).
> Perubahan belum di-merge ke `main` dan belum menyentuh produksi.

---

## 0. Ringkasan Perubahan

| Area | Perubahan | Dampak deploy |
| --- | --- | --- |
| CMS schema | `ContainerBlock`, 11 widget block, 3 composite block (`featuredServices`, `valueProps`, `coverageArea`), field gaya | **Butuh tabel baru** di Postgres produksi |
| CMS UI | Tree builder, tab Konten/Gaya, `ContainerSettings` | Ikut image CMS baru |
| Web renderer | `ContainerBlock.astro`, widget `.astro`, composite `.astro`, sanitizer HTML | Ikut build web baru |
| Web homepage | `index.astro` memakai layout CMS bila ada Page `home` yang publish; jika tidak, fallback hardcoded | Aman: belum ada Page `home` publish → tampilan lama |
| CSP | `_headers` mengizinkan YouTube/Vimeo/Google Maps | Ikut deploy web |
| Build | `prebuild` menjalankan `scan-cms-html.mjs` (fetch CMS) | Build web butuh akses ke CMS produksi |
| Draft | "Homepage 2" dibuat via script (draft, tidak punya route publik) | Belum tampil ke pengunjung |

**Penting:** fitur ini menambah banyak tabel (block + versi draft) pada
`pages`, `_pages_v`, `landing_pages`, `_landing_pages_v`, `page_templates`,
dan `block_templates`. Produksi belum punya tabel tersebut.

---

## 1. Prasyarat

- Akses SSH ke VPS (`/var/www/kalaweb`).
- Akses `psql` ke database produksi (lewat container Postgres).
- Akses Cloudflare Dashboard (Worker `kalaweb`).
- Branch `feat/layout-widget-builder` sudah lulus CI (parity 29/29, tsc, test 20/20, build CMS + web).
- Service produksi dengan slug `baby-newborn`, `bundle-duo`, `bundle-selapan` sudah ada
  (dipakai blok *Layanan Unggulan*). Jika tidak ada, blok akan jatuh ke data `siteConfig`.

---

## 2. Backup Database (WAJIB, sebelum apa pun)

Di VPS:

```bash
/var/www/kalaweb/apps/cms/scripts/backup-postgres.sh
ls -lh /var/backups/kala-postgres | tail -5
```

Atau manual:

```bash
docker exec <postgres-container> pg_dump -U kala_cms_user -Fc kala_cms_db \
  > /var/backups/kala-postgres/manual-before-builder-$(date +%F-%H%M).dump
```

Catat juga daftar tabel saat ini sebagai pembanding:

```bash
docker exec <postgres-container> psql -U kala_cms_user -d kala_cms_db -c \
  "select count(*) from pg_tables where schemaname='public';"
```

---

## 3. Cek Schema Produksi Sebelum Deploy

Jalankan query ini pada DB produksi:

```sql
-- 1) Tabel builder sudah ada atau belum? (harus KOSONG sebelum deploy)
SELECT tablename FROM pg_tables
WHERE schemaname='public'
  AND tablename IN (
    'pages_blocks_container','pages_blocks_heading','pages_blocks_html',
    'pages_blocks_video','pages_blocks_featured_services',
    'pages_blocks_value_props','pages_blocks_coverage_area'
  );

-- 2) Tabel sisa yang bisa memicu prompt rename saat schema push
SELECT tablename FROM pg_tables
WHERE schemaname='public' AND tablename LIKE 'site_settings_coverage_areas%';

-- 3) Migrasi yang sudah tercatat
SELECT * FROM payload_migrations ORDER BY created_at;
```

Interpretasi:

- Query 1 kosong → normal, tabel akan dibuat saat CMS baru start.
- Query 2 **ada isinya** → cek `SELECT count(*) FROM site_settings_coverage_areas;`.
  Jika kosong, drop dulu agar Payload tidak menanyakan rename:
  ```sql
  DROP TABLE IF EXISTS site_settings_coverage_areas;
  ```
- Query 3: jika `20261025_141832_add_seo_audit` **belum** tercatat, jangan pakai
  jalur migrasi (lihat §9). Gunakan jalur schema push interaktif di §4.

---

## 4. Deploy CMS (VPS)

`apps/cms/src/payload.config.ts` memakai `push: true`. Artinya schema
disinkronkan otomatis saat start, tetapi **prompt interaktif** (mis. rename
tabel) bisa membuat container menggantung jika tidak ada TTY.

### 4.1 Update kode & build image

```bash
cd /var/www/kalaweb
git fetch origin
git checkout main
git pull --ff-only
cd apps/cms
docker compose build cms
```

### 4.2 Hentikan CMS lama

```bash
docker compose stop cms
```

### 4.3 Start pertama dengan TTY (schema push)

```bash
docker compose run --rm -it cms
```

- Tabel baru dibuat otomatis (tanpa prompt).
- Jika muncul prompt rename (mis. `site_settings_coverage_areas`), **jawab
  `create table` / batalkan**, jangan rename. Lebih aman: `Ctrl+C`, jalankan
  `DROP TABLE` di §3, lalu ulangi.
- Setelah log menunjukkan Payload siap (`Payload initialized` / listening),
  tekan `Ctrl+C`.

### 4.4 Jalankan service normal

```bash
docker compose up -d cms
docker compose logs -f --tail=100 cms
```

### 4.5 Verifikasi schema

```bash
docker exec <postgres-container> psql -U kala_cms_user -d kala_cms_db -c \
  "select count(*) from pg_tables where schemaname='public' and tablename like '%blocks_heading';"
```

Harapan: **7** (4 tabel utama + 3 tabel versi draft).

```bash
docker exec <postgres-container> psql -U kala_cms_user -d kala_cms_db -c \
  "select count(*) from pages_blocks_container;"
```

Harapan: `0` (tabel ada, belum ada data).

### 4.6 Verifikasi CMS hidup

- Buka `https://admin.kalababyspa.com/admin` → login.
- Buka koleksi **Pages** → editor mode builder tampil (tab Konten/Gaya, menu tambah blok).
- Cek endpoint: `curl -s https://admin.kalababyspa.com/api/pages?limit=1` → `200`.

---

## 5. Deploy Web (Cloudflare Worker)

Urutan **CMS dulu, web kemudian**. Web build menjalankan
`scan-cms-html.mjs` yang membaca dokumen publish dari CMS.

1. Merge branch ke `main` (setelah review/PR):
   ```bash
   git checkout main
   git merge --no-ff feat/layout-widget-builder
   git push origin main
   ```
2. Cloudflare → **Workers & Pages** → `kalaweb` → build otomatis dari `main`.
3. Pantau log build; pastikan `prebuild` (convert-webp + scan-cms-html) sukses
   dan `astro build` selesai.
4. Verifikasi:
   ```bash
   npm run verify:deploy
   ```
5. Cek manual:
   - `https://kalababyspa.com/` tampil normal (masih fallback hardcoded).
   - `https://kalababyspa.com/preview/homepage-2?token=...` → 401 tanpa token (Worker aktif).
   - Header CSP memuat `youtube.com`, `player.vimeo.com`, `google.com` (cek `curl -I`).

> Jika web sempat ter-deploy sebelum CMS baru, tidak masalah: `fetchHomepage()`
> fail-safe dan fallback ke homepage lama. Setelah CMS baru siap, picu rebuild.

---

## 6. Buat Draft "Homepage 2" di Produksi

Setelah schema CMS siap (dan minimal 1 user admin ada):

```bash
cd /var/www/kalaweb/apps/cms
docker compose exec cms npm run create:homepage-2
```

Output yang diharapkan:

```
Draft "Homepage 2" dibuat (id: <id>, slug: homepage-2).
```

Script bersifat idempotent: dijalankan ulang akan memperbarui layout draft
yang sama, tetap `_status: draft`.

Verifikasi di admin:

1. **Pages** → "Homepage 2" → status **Draft**.
2. Tab **Konten** → 11 blok berurutan:
   hero, painPoints, solutions, testimonials, pricing, featuredServices,
   valueProps, steps, coverageArea, faq, cta.
3. Tab **Gaya** pada container/widget berfungsi.
4. **Preview** (`/preview/homepage-2?token=...`) menampilkan halaman.

Alternatif: buat manual via admin (Pages → Create New → mode builder).

> "Homepage 2" memakai `pageType: standard` + `pageLayout: default`, sehingga
> **tidak** punya route publik `/homepage-2` selama draft. Ini disengaja.
> Jangan ubah `pageType` ke `home` sebelum siap go-live.

---

## 7. Go-Live Homepage (opsional, setelah approval)

Jika "Homepage 2" disetujui menjadi homepage:

1. Di admin, buka "Homepage 2".
2. Ubah **slug** menjadi `home` dan **pageType** menjadi `home`.
3. Pastikan tidak ada Page lain dengan slug `home`.
4. **Publish**.
5. Picu rebuild web (deploy hook otomatis atau push ke `main`).
6. Verifikasi:
   - `https://kalababyspa.com/` menampilkan layout baru.
   - Tombol WhatsApp tetap membawa `ref_code`.
   - Meta title/description & schema sesuai.
   - Cek mobile 360px: tidak ada overflow horizontal.

Rollback cepat: unpublish Page `home` → rebuild → homepage kembali ke
fallback hardcoded. Tidak perlu rollback kode.

---

## 8. Rollback

| Skenario | Tindakan |
| --- | --- |
| Web rusak | Cloudflare → Worker `kalaweb` → Deployments → rollback ke versi sebelumnya |
| CMS rusak (kode) | `cd /var/www/kalaweb && git checkout <commit-lama>` → `docker compose build cms` → `up -d` |
| Schema bermasalah | Stop CMS → restore dump §2 → checkout kode lama → start |
| Data "Homepage 2" salah | Hapus/ubah draft di admin; tidak memengaruhi halaman publik |

Restore DB:

```bash
cd /var/www/kalaweb/apps/cms
docker compose stop cms
/var/www/kalaweb/apps/cms/scripts/restore-postgres.sh <file-backup>
docker compose start cms
```

---

## 9. Catatan Teknis & Utang Teknis

1. **`push: true` di produksi.** Schema berubah otomatis saat start. Untuk
   jangka panjang, sebaiknya:
   - matikan push di produksi (`push: false`),
   - buat migrasi (`npx payload migrate:create`) yang diuji di salinan DB,
   - jalankan `npx payload migrate` saat deploy.
   Lakukan **hanya setelah** `payload_migrations` produksi diaudit, karena
   baseline migrasi lokal dan produksi bisa berbeda.
2. **Kredensial fallback di `payload.config.ts`.** `DATABASE_URI` punya
   default hardcoded (user/password lokal). Di produksi selalu set
   `DATABASE_URI` via `.env`; jangan andalkan fallback. Pertimbangkan
   menghapus fallback tersebut.
3. **`apps/web-kala/src/generated/`** adalah artefak build (di-`.gitignore`),
   dibuat ulang oleh `prebuild`.
4. **Tailwind + Custom HTML.** Class yang hanya ada di HTML CMS baru
   ter-compile setelah build web berikutnya (scan saat build). Setelah
   mengubah Custom HTML di CMS, picu rebuild.
5. **Isi draft "Homepage 2"** memakai data CMS (services, testimonials, FAQ,
   coverage area) yang ada di environment tujuan. Di produksi, angka/harga
   mengikuti koleksi produksi, bukan lokal.
