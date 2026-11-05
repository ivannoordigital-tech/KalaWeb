# Audit Admin CMS KalaWeb
### Perspektif Pengguna (UI/UX) & Perspektif Agent AI (Automation Readiness)

> **Audit lanjutan (5 November 2026):** audit UI/UX level mikro berbasis runtime produksi ada di [`audit-uiux-admin-cms-2026-11-05.md`](./audit-uiux-admin-cms-2026-11-05.md). Dokumen tersebut memuat temuan P0/P1/P2 terbaru, bukti Lighthouse, pengukuran kontras, dan checklist penerimaan.

**Tanggal audit:** 3 November 2026  
**Ruang lingkup:** `apps/cms` (Payload CMS 3.91 + Next.js 15) dan integrasinya ke `apps/web-kala` (Astro 5 SSG)  
**Metode:** code review menyeluruh, penelusuran alur data CMS → website, pembacaan konfigurasi, hooks, access control, komponen admin, dan pengecekan TypeScript (`tsc --noEmit` untuk CMS: lolos).  
**Batasan:** audit ini **belum** melakukan uji runtime ke database produksi, browser admin, Cloudflare Pages, maupun API eksternal. Temuan bertanda “perlu verifikasi runtime” dijelaskan di bagian bukti.

---

## 1. Ringkasan Eksekutif

CMS ini **jauh di atas rata-rata** dari sisi niat desain: label berbahasa Indonesia, deskripsi field panjang, dashboard kustom, panel SEO live, guard harga, validasi nomor WhatsApp, library 14 blok, template halaman, role 6 jenis, serta deploy hook otomatis. Secara tampilan, CMS terlihat serius dan siap operasional.

Namun, ada **jarak besar antara “bisa menyimpan data di CMS” dan “data itu benar-benar tampil benar di website”**:

1. **Artikel CMS tidak dipakai website.** Blog masih membaca file Markdown lokal. Menulis artikel di CMS tidak akan pernah muncul di `/blog`.
2. **Gambar hasil upload berpotensi 404** karena URL media dibiarkan relatif (`/api/media/file/...`) sementara website berada di domain berbeda.
3. **Ada dua sistem landing page yang saling menimpa.** Koleksi `landing-pages` disembunyikan dari admin, tetapi justru versi itulah yang menang di halaman `/sales`.
4. **Preview tidak bisa dipercaya.** Preview artikel mengarah ke halaman blog yang tidak memuat data CMS; preview halaman draft tidak menyertakan draft; “live preview” hanya mengganti judul, bukan blok.
5. **Ada celah eskalasi hak akses.** Pengguna biasa dapat mengubah `role` dirinya sendiri menjadi `superadmin` lewat API.
6. **Testimoni yang belum disetujui / nonaktif tetap bisa dibaca publik lewat API.**
7. **Kredensial sensitif tertanam di repo** (fallback password DB, password admin seed, API key bot).
8. **Menonaktifkan layanan/FAQ/testimoni/bidan/area tidak memicu deploy**, sehingga konten lama tetap tayang sampai build berikutnya.
9. **Harga tampilan bisa basi** karena `price` (teks) tidak disinkronkan ulang saat `numericPrice` berubah.
10. **Otomasi AI belum siap produksi**: tidak ada OpenAPI, MCP, idempotency, webhook event, audit log, scoped API key, dry-run validation, atau cara memverifikasi hasil render.

### Skor Kesehatan CMS

| Dimensi | Skor | Catatan singkat |
|---|---:|---|
| Fungsionalitas tugas end-to-end | **5/10** | CRUD banyak koleksi berjalan, tetapi artikel, media, landing page, dan preview terputus |
| UI/UX untuk operator/bidan | **6,5/10** | Ramah dan informatif, tetapi jargon teknis, duplikasi konsep, dan feedback menyesatkan |
| Konsistensi & integritas data | **4/10** | Sumber kebenaran ganda, field urutan tidak dipakai, harga bisa basi |
| Keamanan & privasi | **3,5/10** | Role escalation, konten belum consent terekspos, secret di repo |
| Perkakas SEO | **7/10** | Panel SEO & audit bagus, tetapi skor dangkal dan metrik tidak dipersistensi |
| Keamanan penerbitan (preview/rollback) | **3/10** | Preview tidak valid, tidak ada scheduled publish/autosave, versi hanya di 4 koleksi |
| Kesiapan otomasi AI | **3,5/10** | REST/GraphQL ada, tetapi kontrak, verifikasi, dan governance belum memadai |

**Kesimpulan singkat:** CMS **cukup capable untuk mengelola layanan, harga, area, bidan, FAQ, dan testimoni** (dengan catatan media & deploy). CMS **belum capable untuk alur inti “tulis artikel → preview → publish → tampil di website”** dan **belum aman untuk dijadikan target otomasi agen AI tanpa perbaikan P0.**

---

## 2. Peta Alur yang Diuji

```
Admin UI (Payload)
   ├── Articles ──────────► API /api/articles ──► [TIDAK DIPAKAI] Blog = Markdown lokal
   ├── Pages (standard) ──► /api/pages ─────────► /[slug] (renderer rich text terbatas)
   ├── Pages (landing) ───► /api/pages ─────────► /sales/[slug] (kalah oleh landing-pages)
   ├── LandingPages ──────► /api/landing-pages ─► /sales/[slug] (menang, tapi hidden di admin)
   ├── Services ──────────► /api/services ──────► /layanan, beranda
   ├── ServiceAreas ──────► /api/service-areas ─► /area
   ├── Midwives ──────────► /api/midwives ──────► /tim-bidan, /bidan
   ├── Testimonials ──────► /api/testimonials ──► beranda, blok
   ├── FAQ ───────────────► /api/faq ───────────► beranda, blok
   ├── SiteSettings ──────► /api/globals/... ───► seluruh layout
   └── Redirects ─────────► /api/redirects ─────► _redirects saat build
```

---

## 3. Temuan Kritis (P0) — Harus Diperbaiki Sebelum Dianggap “Siap Pakai”

### P0-1. Artikel CMS tidak pernah tampil di website

**Bukti**
- `apps/web-kala/src/pages/blog/index.astro:3-6` memakai `getCollection('blog')` dari Astro Content Collections (file Markdown lokal), bukan CMS.
- `apps/web-kala/src/pages/blog/[...slug].astro:2-11` juga memakai `getCollection('blog')`.
- `apps/web-kala/src/lib/payload.ts:230-243` mendefinisikan `fetchPayloadArticles()`, tetapi **tidak dipanggil di mana pun** (hasil grep hanya definisi).
- Query-nya pun salah: `where[status][equals]=published`, padahal koleksi drafts Payload memakai field `_status` (lihat `payload-types.ts:301`; tidak ada field `status`). Payload akan melempar `QueryError: The following path cannot be queried: status` (400).

**Dampak**
- Tugas utama “Tulis Artikel Edukasi” **gagal secara end-to-end**. Artikel tersimpan di CMS, skor SEO bertambah, deploy terpicu, tetapi tidak ada halaman baru di website.
- Jika `fetchPayloadArticles` nanti dipasang tanpa memperbaiki query, build produksi bisa gagal (`handleFetchError` sengaja menggagalkan build).
- Dashboard akan melaporkan “Artikel” dan “SEO” seolah aktif, padahal tidak berdampak ke situs. Ini **false sense of productivity**.

**Rekomendasi**
1. Pilih satu sumber kebenaran: migrasikan blog ke CMS, atau hapus/rename koleksi Articles menjadi arsip internal.
2. Jika migrasi: buat `apps/web-kala/src/pages/blog/[...slug].astro` yang mengambil `articles?where[_status][equals]=published&depth=2`, render Lexical, dan sediakan fallback Markdown selama transisi.
3. Perbaiki query menjadi `_status`.
4. Tambahkan test E2E: publish artikel → muncul di `/blog` dan `/blog/[slug]` setelah build.

**Effort:** L (1–2 minggu) untuk migrasi penuh; S (1 hari) hanya memperbaiki query.

---

### P0-2. URL media relatif → gambar CMS berpotensi tidak tampil di website

**Bukti**
- `apps/cms/src/payload.config.ts:49-162` **tidak menetapkan `serverURL`**.
- Payload membentuk URL file dengan `formatAdminURL`; bila `serverURL` kosong, hasilnya path relatif (`.deps`: `node_modules/payload/dist/utilities/formatAdminURL.js:12-17`).
- Frontend memakai URL tersebut langsung: `apps/web-kala/src/pages/[slug].astro:138-145` (`src={page.heroImage.url}`), `.../blocks/HeroBlock.astro:31-32,112`, `.../blocks/GalleryBlock.astro:56-66`.
- `NEXT_PUBLIC_SERVER_URL` di-set di `docker-compose.yml:15`, tetapi **tidak dibaca** oleh `buildConfig` (grep tidak menemukan pemakaian di Payload).
- `astro.config.mjs:58-70` mengizinkan remote image `admin.kalababyspa.com`, tetapi komponen CMS memakai `<img src>` biasa, bukan `<Image>` Astro, jadi konfigurasi ini tidak menolong.

**Dampak**
- Upload foto dari CMS bisa tampil di admin (karena admin satu origin) tetapi **broken di `kalababyspa.com`** karena browser meminta `https://kalababyspa.com/api/media/file/...` yang tidak ada.
- Editor mengira sudah upload benar; website menampilkan gambar rusak/alt text. Ini kesalahan yang sulit didiagnosis oleh non-teknis.
- Berlaku untuk hero artikel, hero halaman, galeri, foto bidan, foto testimoni, OG image.

**Rekomendasi**
1. Set `serverURL: process.env.NEXT_PUBLIC_SERVER_URL` di `payload.config.ts`.
2. Atau buat helper `mediaUrl(doc)` di frontend yang menambahkan `https://admin.kalababyspa.com` bila URL relatif.
3. Jangka menengah: pindahkan media ke Cloudflare R2/S3 + CDN, dan gunakan `astro:assets`/`<Image>` untuk optimasi LCP.
4. Tambahkan test: upload gambar → buka halaman publik → pastikan `naturalWidth > 0`.

**Effort:** S (set serverURL + helper) hingga M (R2/CDN).

---

### P0-3. Dua sistem landing page saling menimpa; yang menang justru yang tersembunyi

**Bukti**
- `apps/cms/src/collections/LandingPages.ts:20` → `hidden: () => true` (koleksi tidak pernah muncul di sidebar admin).
- `apps/cms/src/collections/Pages.ts:357-375` → `pageType: 'landing'` membuat landing page di dalam koleksi Pages yang terlihat.
- `apps/cms/src/scripts/seed.ts:519-540` membuat data di `landing-pages`, lalu `:590-613` membuat data dengan slug yang sama di `pages`.
- `apps/web-kala/src/pages/sales/[slug].astro:305-311` menggabungkan `cmsCampaigns` (dari `landing-pages`) lebih dulu, dan hanya menambahkan landing dari `pages` jika slug belum ada.
- `apps/web-kala/src/pages/preview/sales/[slug].astro:10-30` hanya mengambil `landing-pages`.

**Dampak**
- Untuk slug `bayi-kolik`, `pijat-newborn`, `reservasi-online`, editor mengedit “Halaman Penawaran” di menu Pages, menekan Terbitkan, melihat deploy sukses — tetapi **perubahan tidak muncul** karena versi `landing-pages` yang dipakai.
- Sebaliknya, versi yang menang **tidak bisa diedit dari UI** karena koleksinya hidden. Hanya bisa lewat API/seed.
- Dashboard menghitung keduanya → jumlah konten dan daftar “Aktivitas terakhir” bisa berisi duplikat dengan judul sama.
- Ini adalah sumber kebingungan paling berbahaya bagi tim marketing.

**Rekomendasi**
1. Konsolidasikan ke **satu** koleksi: pertahankan `Pages` dengan `pageType=landing` (karena sudah punya preview, SEO, blocks, draft), lalu migrasikan data `landing-pages` ke `pages`.
2. Hapus `LandingPages` dari config dan route, atau jadikan read-only legacy dengan banner “jangan diedit”.
3. Ubah `sales/[slug].astro` agar hanya membaca `pages` (dan tidak menimpa dengan data tersembunyi).
4. Tambahkan test: edit landing di admin → build → pastikan teks berubah di `/sales/[slug]`.

**Effort:** M–L (migrasi data + refactor route).

---

### P0-4. Eskalasi hak akses: pengguna dapat menjadikan dirinya `superadmin`

**Bukti**
- `apps/cms/src/collections/Users.ts:16-27` → untuk non-superadmin, `update` mengizinkan `{ id: { equals: user.id } }` (self-update).
- `apps/cms/src/collections/Users.ts:41-58` → field `role` **tanpa field-level access control**.
- Akibatnya, user dengan role `author`/`operator`/`marketing` dapat mengirim `PATCH /api/users/{id}` dengan `{ "role": "superadmin" }` dan langsung menjadi superadmin.
- API key bot (`Users.auth.useAPIKey`, `Users.ts:28-30`) juga mewarisi kemampuan ini; jika API key bocor, penyerang bisa mengambil alih CMS.

**Dampak**
- Seluruh model 6 role di `access/roles.ts` bisa dilewati.
- Penyerang dapat mengubah harga, menghapus konten, mengubah pengaturan situs, dan mengakses data pengguna.
- Ini bukan sekadar bug UX; ini **kegagalan kontrol akses**.

**Rekomendasi**
1. Tambahkan field-level access:
   ```ts
   {
     name: 'role',
     type: 'select',
     access: {
       update: ({ req: { user } }) => getUserRole(user) === 'superadmin',
     },
     // ...
   }
   ```
2. Tambahkan guard `beforeChange` yang menolak perubahan `role` bila aktor bukan superadmin.
3. Pisahkan API key bot ke role `automation` dengan akses terbatas (hanya testimonials/create, bukan pages/services).
4. Perluas `test-role-access.ts` untuk menguji update/delete dan percobaan eskalasi role.

**Effort:** S (1–2 jam) + test.

---

### P0-5. Preview tidak menggambarkan hasil publish (dan sebagian selalu 404)

**Bukti**
- `Articles.ts:23-29` → tombol preview mengarah ke `${PREVIEW_BASE_URL}/blog/{slug}/`, padahal blog memakai Markdown lokal (P0-1). Artikel CMS baru **tidak punya route** di sana → 404.
- `Pages.ts:44-79` → live preview ke `/preview/{slug}`.
- `apps/web-kala/src/lib/payload.ts:409-421` → `fetchPayloadPages()` hanya mengambil `_status=published`.
- `apps/web-kala/src/pages/preview/[slug].astro:6-24` → `getStaticPaths` dibangun dari halaman published; draft tidak masuk.
- `apps/web-kala/src/pages/preview/[slug].astro:74-98` → listener `postMessage` hanya mengganti `document.title` dan teks `h1`; blok, gambar, dan field lain **tidak berubah**.
- Tidak ada `preview`/`livePreview` untuk Services, ServiceAreas, Midwives.
- `PREVIEW_BASE_URL` tidak ada di `.env.example`; default-nya `http://localhost:4321` (`Articles.ts:25`, `Pages.ts:46/55`). Di Docker production nilainya di-set (`docker-compose.yml:16`), tetapi developer/instance baru bisa lupa.

**Dampak**
- Editor tidak bisa melihat hasil sebelum publish. Untuk konten medis dan harga, ini berisiko tinggi.
- “Live Preview” menciptakan ekspektasi salah: terlihat seperti side-by-side editor, tetapi isi blok tidak ikut berubah.
- Draft halaman tidak bisa direview sama sekali; satu-satunya cara adalah publish (yang langsung memicu deploy).

**Rekomendasi**
1. Buat route preview dinamis (SSR/on-demand, bukan SSG) yang memakai `draft=true` + token preview, misalnya `/preview/[collection]/[slug]?token=...`.
2. Render semua blok dan Lexical dengan renderer yang sama seperti halaman publik.
3. Gunakan mekanisme Live Preview Payload yang benar (postMessage seluruh `data`, re-render komponen), atau ganti label menjadi “Preview statis” agar tidak menyesatkan.
4. Tambahkan `PREVIEW_BASE_URL` ke `.env.example` dan validasi saat boot.
5. Sediakan preview untuk minimal Articles, Pages, Services, dan Areas.

**Effort:** M (2–4 hari) untuk preview SSR; L untuk live preview penuh.

---

### P0-6. Testimoni belum disetujui / nonaktif tetap dapat dibaca publik

**Bukti**
- `Testimonials.ts:20-25` → `read: () => true` (tanpa filter `active`/`permissionGranted`).
- `Testimonials.ts:107-116` → `permissionGranted` default `true` dan `required`.
- `Testimonials.ts:146-155` → `active` default `true`.
- Frontend memang memfilter (`payload.ts:266-279`), tetapi itu hanya lapisan tampilan. Siapa pun bisa memanggil `/api/testimonials` dan membaca **semua** testimoni, termasuk yang belum diberi izin.
- Pola serupa: `Services`, `ServiceAreas`, `Midwives`, `FAQ`, `Redirects` memakai `read: () => true` tanpa filter `active`; konten nonaktif tetap bisa diambil dari API.

**Dampak**
- Risiko privasi dan kepatuhan UU PDP: testimoni pasien (termasuk nama anak, area, layanan) dapat terekspos sebelum consent.
- Konten nonaktif bisa diindeks/dikonsumsi pihak lain lewat API, meski tidak tampil di halaman.
- `permissionGranted` yang `required` + default `true` membuat tim cenderung “mengakali” dengan selalu mencentang, bukan benar-benar mencatat consent.

**Rekomendasi**
1. Ubah access read:
   ```ts
   read: ({ req: { user } }) =>
     user ? true : { active: { equals: true }, permissionGranted: { equals: true } }
   ```
   Terapkan juga untuk Services/Areas/Midwives/FAQ.
2. Default `permissionGranted` menjadi `false`, dan jangan jadikan satu-satunya mekanisme; tambahkan field `consentSource`, `consentDate`, `consentBy`.
3. Pisahkan status moderasi (`pending | approved | rejected`) dari `active`.
4. Untuk endpoint bot, paksa `active: false` dan `permissionGranted: false` di hook create.
5. Audit data lama: cari testimoni dengan `permissionGranted=true` yang tidak punya bukti.

**Effort:** S–M.

---

### P0-7. Secret dan kredensial tertanam di repository

**Bukti**
- `apps/cms/src/payload.config.ts:153-160` → fallback `DATABASE_URI` berisi password PostgreSQL nyata (`aDGmXtwqfYP4oAlrNB6vgpezj0LH529O`).
- `apps/cms/src/payload.config.ts:37-43` → fallback `PAYLOAD_SECRET` hardcoded untuk dev/build.
- `apps/cms/src/scripts/seed.ts:21-29` → password admin default `KalaAdminPassword2026!`.
- `apps/cms/src/scripts/seed.ts:53-63` → fallback API key bot `kala_bot_api_key_secure_2026_super_random_token`.
- `docker-compose.yml:13-16` menggunakan `${CMS_DB_PASSWORD}` (baik), tetapi fallback di config tetap ada.

**Dampak**
- Siapa pun yang punya akses repo bisa mencoba kredensial DB, login admin seed, atau memakai API key bot.
- Jika API key bot valid dan role escalation (P0-4) belum diperbaiki, dampaknya menjadi full CMS takeover.
- Rotasi secret menjadi sulit karena nilai lama tersebar di kode dan dokumentasi.

**Rekomendasi**
1. **Rotasi semua kredensial sekarang**: password DB, `PAYLOAD_SECRET`, password admin, API key bot.
2. Hapus semua fallback sensitif; gagalkan boot jika env tidak ada (kecuali mode test eksplisit).
3. Gunakan secret manager (Docker secrets, Vault, atau minimal `.env` yang tidak masuk git).
4. Tambahkan `gitleaks`/`trufflehog` di CI.
5. Untuk seed, minta password via env dan paksa `mustChangePassword`.

**Effort:** S (rotasi + hapus fallback), M (secret manager + CI scanning).

---

### P0-8. Menonaktifkan konten tidak memicu deploy → konten lama tetap tayang

**Bukti**
- `Services.ts:59-65` → deploy hanya jika `doc.active`.
- `ServiceAreas.ts:27-39` → idem.
- `Midwives.ts:27-39` → idem.
- `FAQ.ts:26-38` → idem.
- `Testimonials.ts:26-38` → deploy hanya jika `doc.active && doc.permissionGranted`.
- `BlockTemplates` tidak punya hook deploy sama sekali, padahal template dirender di halaman publik melalui `TemplateRefBlock`.

**Dampak**
- Admin menghapus centang “Status Aktif (Tampil di Website)”, menekan Save, dan mendapat pesan sukses. Namun website statis masih menampilkan layanan/FAQ/testimoni/bidan tersebut sampai build berikutnya (cron harian paling cepat).
- Untuk layanan yang sudah dihentikan atau testimoni yang izinnya dicabut, ini masalah serius.
- Untuk `BlockTemplates`, perubahan template tidak pernah memicu rebuild; halaman yang memakainya tetap menampilkan versi lama.

**Rekomendasi**
1. Trigger deploy pada **setiap** perubahan yang memengaruhi konten publik, termasuk saat `previousDoc.active === true && doc.active === false`.
2. Atau sederhananya: selalu panggil `triggerCloudflareDeploy` di `afterChange` untuk koleksi publik (debounce 60 detik sudah melindungi dari build storm).
3. Tambahkan hook serupa di `BlockTemplates`.
4. Tambahkan indikator “Perubahan ini akan mengubah situs live” di UI.

**Effort:** S.

---

## 4. Temuan Penting (P1) — Mengganggu Kepercayaan & Efisiensi

### P1-1. Harga tampilan bisa basi saat `numericPrice` berubah

**Bukti**
- `Services.ts:29-57` hanya mengisi `price` jika `price` kosong.
- Jika `price` sudah pernah terisi `Rp150.000`, lalu admin mengubah `numericPrice` menjadi `160000`, field `price` tetap `Rp150.000`.
- Hal yang sama untuk `duration` vs `durationMinutes`.
- Frontend memakai `price` (string) untuk tampilan (`FeaturedServices.astro`, `layanan/[slug].astro`), sementara schema/structured data bisa memakai nilai numerik → **harga di kartu, halaman, dan Google bisa berbeda**.

**Rekomendasi**
- Jadikan `price` dan `duration` **read-only / auto-derived** dari angka, atau sinkronkan setiap kali `numericPrice`/`durationMinutes` berubah.
- Tambahkan validasi konsistensi: jika `price` ada dan tidak sama dengan format `numericPrice`, blokir simpan atau tampilkan warning.
- Test: ubah harga → pastikan kartu beranda, halaman layanan, dan JSON-LD semuanya berubah.

**Effort:** S.

---

### P1-2. Field `order` dan `recommended` tidak berfungsi seperti yang dijanjikan

**Bukti**
- `Services.ts:253-260` menyediakan “Urutan Tampil”.
- `payload.ts:248-261` mengambil layanan **tanpa `sort=order`**.
- `FeaturedServices.astro:12-34` mengambil 3 pertama (`slice(0,3)`) lalu mengurutkan berdasarkan daftar slug hardcoded `['baby-newborn','bundle-duo','bundle-selapan']`.
- `recommended` hanya dipakai untuk border/aksen (`layanan/index.astro:61`), bukan untuk memilih layanan unggulan.
- `ServiceAreas` dan `Testimonials` juga punya `order`, tetapi fetch-nya tidak memakai `sort=order` (`payload.ts:302-315`, `266-279`). Hanya FAQ yang memakai `sort=order` (`payload.ts:286`).

**Dampak**
- Admin mengubah urutan, tetapi tampilan tidak berubah.
- Layanan baru tidak bisa masuk 3 unggulan beranda kecuali slug-nya cocok dengan daftar hardcoded.
- “Tandai sebagai Paket Unggulan” terasa tidak berfungsi.

**Rekomendasi**
- Tambahkan `sort=order` pada semua fetch terkait.
- Hapus `preferredOrder` hardcoded; gunakan `order` + `recommended` untuk memilih 3 unggulan.
- Tambahkan drag-and-drop order atau field `order` dengan preview urutan.
- Terapkan `defaultSort: 'order'` di admin list agar editor melihat urutan yang sama dengan website.

**Effort:** S.

---

### P1-3. Banner promo punya tanggal mulai/berakhir, tetapi tanggalnya diabaikan

**Bukti**
- `SiteSettings.ts:222-244` menyediakan `bannerStartDate` dan `bannerEndDate`.
- `BaseLayout.astro:89-102,168-172` hanya mengecek `announcementBanner` (string) dan langsung menampilkannya.
- SOP (`docs/sop-operasional.md:50-51`) menjanjikan banner otomatis hilang setelah tanggal berakhir.

**Dampak**
- Promo kedaluwarsa tetap tayang.
- Editor mengira sudah menjadwalkan, padahal tidak. Ini memicu komplain pelanggan dan risiko iklan menyesatkan.

**Rekomendasi**
- Terapkan filter tanggal di `BaseLayout` (atau di endpoint) dengan timezone `Asia/Jakarta`.
- Tambahkan validasi `start < end`.
- Tampilkan status banner di dashboard (“Aktif sampai …”, “Terjadwal”, “Kedaluwarsa”).
- Jadwalkan rebuild harian (sudah ada cron) agar perubahan tanggal ikut ter-apply.

**Effort:** S.

---

### P1-4. Validasi publish punya lubang; beberapa klaim medis hanya warning

**Bukti**
- `pageBuilderValidators.ts:90` → seluruh validasi blok hanya berjalan `if (layout.length > 0)`. Canvas/landing dengan layout kosong **lolos** validasi.
- `pageBuilderValidators.ts:115-119` → `showWhatsAppCta` default `true` dianggap cukup sebagai CTA, meski tidak ada tombol nyata di blok.
- `pageBuilderValidators.ts:154-159` → pengecekan alt galeri memakai `block.items`, sedangkan field CMS bernama `images` (`GalleryBlock.ts:57-88`). Akibatnya pengecekan **tidak pernah berjalan**.
- `pageBuilderValidators.ts:141` → pengecekan circular reference membandingkan `template.id` dengan `doc.id` (ID template vs ID halaman), sehingga tidak mendeteksi apa pun.
- `pageBuilderValidators.ts:167-172` → kata terlarang medis hanya `warnings`, tidak memblokir publish.
- `Articles.ts:114-120` → `content` tidak `required`; artikel kosong bisa diterbitkan.
- `Pages.ts:207-225` → `content` dan `layout` sama-sama opsional; halaman kosong bisa diterbitkan.
- `GalleryBlock.ts` tidak punya field `alt` per gambar; hanya caption/tag. Untuk gambar fallback URL, tidak ada alt sama sekali.

**Dampak**
- Halaman kosong/rusak bisa tayang.
- Klaim seperti “pasti sembuh” atau “100% aman” bisa lolos ke website kesehatan.
- SEO gambar galeri tidak terlindungi.

**Rekomendasi**
1. Jalankan validasi publish terlepas dari `layout.length`.
2. Wajibkan minimal satu Hero + satu CTA nyata untuk landing/canvas.
3. Perbaiki `block.items` → `block.images`; tambahkan field `alt` wajib di GalleryBlock.
4. Untuk kata terlarang medis: blokir publish (bukan warning), atau wajibkan `medicalReviewApproved` oleh role reviewer.
5. Wajibkan `content`/`layout` minimal untuk publish.
6. Kembalikan error terstruktur per field, bukan satu string gabungan.

**Effort:** M.

---

### P1-5. Rich text halaman tidak dirender lengkap (bold, link, list, gambar hilang)

**Bukti**
- `apps/web-kala/src/pages/[slug].astro:61-81` → `renderRichText` hanya menangani `paragraph` dan `heading`; `list`, `link`, `bold`, `upload` diabaikan.
- `RichTextBlock.astro:11-74` punya renderer yang jauh lebih lengkap, tetapi **tidak dipakai** untuk field `content` halaman.
- Canvas branch (`[slug].astro:102-113`) juga memakai renderer terbatas yang sama.

**Dampak**
- Editor menulis daftar poin, tautan, dan teks tebal di “Isi Dokumen / Konten Teks Bebas”; website menampilkannya sebagai paragraf polos.
- Link internal/CTA hilang → konversi dan SEO turun.
- Inkonsistensi: blok `richText` tampil benar, field `content` tampil salah.

**Rekomendasi**
- Ekstrak satu `renderLexicalToHtml` bersama (mendukung bold/italic/underline/link/list/quote/upload) dan pakai di halaman, artikel, serta blok.
- Tambahkan test render untuk semua node Lexical yang didukung editor.
- Jangka panjang: gunakan `@payloadcms/richtext-lexical/react` atau converter resmi.

**Effort:** M.

---

### P1-6. Tidak ada auto-redirect saat slug berubah; URL lama menjadi 404

**Bukti**
- `Articles.ts:41-49` dan `Pages.ts:106-114` hanya mengisi slug jika kosong; tidak ada hook yang membuat redirect saat slug berubah.
- `Redirects` harus dibuat manual.
- `unique: true` pada slug; jika formatSlug menghasilkan slug yang sudah ada, error yang muncul adalah constraint DB, bukan pesan ramah.
- `formatSlug` memotong 60 karakter (`formatSlug.ts:13`), berpotensi menabrak slug lain.

**Dampak**
- Editor memperbaiki typo slug → semua tautan lama, iklan, dan hasil Google menjadi 404.
- Tidak ada peringatan “URL ini akan berubah, buat redirect?”.

**Rekomendasi**
- `afterChange` hook: jika `previousDoc.slug !== doc.slug` dan dokumen published, otomatis buat `Redirect` 301 dari slug lama.
- Tampilkan dialog konfirmasi saat slug diubah pada dokumen published.
- Auto-suffix `-2`, `-3` bila slug bentrok, dengan notifikasi.
- Tambahkan test link checker di CI.

**Effort:** M.

---

### P1-7. Tidak ada scheduled publish, autosave, atau alur review medis

**Bukti**
- `Articles.ts:37-39`, `Pages.ts:87-89`, `LandingPages.ts:62-64`, `BlockTemplates.ts:27-29` hanya `versions.drafts: true`.
- Tidak ada `autosave` atau `schedulePublish` di seluruh `apps/cms/src` (grep).
- `author`, `authorTitle`, `medicalReviewer` hanya teks bebas (`Articles.ts:230-256`); tidak ada status review, tanggal review, atau approval oleh role tertentu.
- `Midwives` punya `strNumber`, tetapi artikel tidak menautkan ke data bidan tersebut.

**Dampak**
- Penulisan artikel panjang rawan kehilangan pekerjaan.
- Tidak bisa menjadwalkan promo/publikasi.
- Tidak ada bukti tata kelola konten medis (siapa mereview, kapan, versi mana yang disetujui).
- Untuk bisnis kesehatan, ini gap kepatuhan yang serius.

**Rekomendasi**
- Aktifkan `autosave` dan `schedulePublish` (fitur Payload) pada Articles/Pages.
- Tambahkan status editorial: `draft → medical_review → approved → published`, dengan akses transisi per role.
- Ubah `author` dan `medicalReviewer` menjadi relationship ke `midwives`/`users`, lalu simpan `reviewedAt`, `reviewedBy`, `reviewNotes`.
- Wajibkan review sebelum publish untuk artikel dengan kategori tertentu.
- Tampilkan badge “Belum direview” di dashboard.

**Effort:** M–L.

---

### P1-8. Dashboard: angka, tautan, dan status bisa menyesatkan

**Bukti**
- `CustomDashboard.tsx:36-62` memakai `overrideAccess: true` dan mengambil `articles`, `pages`, **dan `landing-pages` yang hidden**.
- `:99-102` memfilter dokumen berjudul “test ads”/“test1” secara hardcoded — bisa menyembunyikan konten nyata.
- `:138-149` mengecek `doc.seoAudit.metrics`, tetapi field `metrics` **tidak ada** di `seoAuditFields.ts:36-90`. Akibatnya dashboard selalu menghitung ulang SEO untuk semua dokumen setiap render (mahal dan bisa berbeda dari skor tersimpan).
- `:405-452` kartu “Tulis Artikel Baru” selalu tampil, termasuk untuk `midwife_coordinator` yang tidak punya akses Articles (`Articles.ts:19-22`).
- `:455-502` kartu “Buat Halaman Baru” tampil untuk `author` yang tidak punya akses Pages (`Pages.ts:40-43`).
- `:689` “Lihat semua isu SEO” selalu mengarah ke `/admin/collections/articles`, padahal isu bisa berasal dari Pages.
- `:935` “Lihat semua dokumen” mengarah ke `/admin/collections/pages`, padahal tabel memuat artikel juga.
- `:369-391` “Lihat Website” hardcoded ke `https://kalababyspa.com` (tidak cocok untuk staging).
- `currentDeployStatus` disimpan di memori proses (`triggerDeployHook.ts:25-42`); `lastCompletedAt` di-set begitu webhook Cloudflare merespons (`:126-135`), bukan saat build selesai.
- Dashboard menampilkan “Situs Aktif & Tayang” berdasarkan state ini.

**Dampak**
- Editor melihat angka konten yang tidak sesuai dengan yang bisa mereka kelola.
- Klik kartu aksi → 403/not found.
- Status “Situs Aktif & Tayang” bisa menipu saat build masih berjalan, gagal di tengah, atau server CMS restart.
- Dashboard menjadi lambat saat konten bertambah.

**Rekomendasi**
- Dashboard role-aware: query hanya koleksi yang boleh dibaca; sembunyikan kartu aksi tanpa izin.
- Persist `metrics` di `seoAudit` (atau tabel ringkasan) dan tampilkan skor tersimpan; sediakan tombol “Hitung ulang”.
- Gunakan Cloudflare Pages API untuk status deployment nyata; simpan `deployId`, `status`, `startedAt`, `finishedAt`, `url`.
- Ganti tautan “Lihat semua” menjadi per-koleksi atau halaman audit terpadu.
- Hapus filter judul hardcoded; gunakan flag `isTest` atau arsip.
- Sediakan widget untuk Media, Services, Testimonials, FAQ, Redirects.
- Tambahkan auto-refresh status build dan tombol “Rebuild sekarang”.

**Effort:** M.

---

### P1-9. Konsep “status” tidak konsisten di seluruh CMS

**Bukti**
- Articles/Pages/LandingPages/BlockTemplates memakai `_status` (draft/published).
- Services/Areas/Midwives/FAQ/Testimonials memakai `active` (boolean).
- LandingPages punya `active` **dan** `_status`.
- Pages punya `pageType` yang mengubah perilaku publish.
- `Redirects` punya `active`.

**Dampak**
- Editor harus mempelajari 3 model status berbeda.
- “Terbitkan” di satu koleksi, “centang aktif” di koleksi lain, “publish + active” di koleksi ketiga.
- Sulit membuat otomasi yang seragam.

**Rekomendasi**
- Standarkan menjadi `status: draft | in_review | scheduled | published | archived` + `publishedAt`.
- Untuk koleksi tanpa drafts, minimal gunakan `status` yang sama dan migrasikan `active`.
- Tampilkan status yang sama di list, dashboard, dan API.

**Effort:** M–L (migrasi data).

---

### P1-10. Data relasi masih berupa teks bebas → duplikasi dan typo

**Bukti**
- `Articles.author` dan `medicalReviewer` teks (`Articles.ts:230-256`), padahal ada koleksi `Midwives` dengan STR.
- `Testimonials.service` teks + `relatedService` relationship (`Testimonials.ts:61-79`) → dua sumber.
- `ServiceAreas.availableServices` array teks (`ServiceAreas.ts:101-119`), bukan relationship ke `Services`.
- `LandingPages` legacy fields (`price`, `headline`, `painPoints`, `solutions`, `steps`, `testimonial`, `faqs`) menduplikasi blok baru (`LandingPages.ts:261-425`).

**Dampak**
- Nama bidan/layanan bisa berbeda antar halaman.
- Laporan dan schema tidak konsisten.
- Editor bingung field mana yang dipakai (“Mode Klasik” vs blok).

**Rekomendasi**
- Ubah author/reviewer menjadi relationship; auto-fill nama/gelar/STR.
- `availableServices` → relationship hasMany ke Services.
- Hapus `Testimonials.service` teks setelah migrasi ke `relatedService`.
- Hapus legacy fields LandingPages setelah migrasi; sisakan satu model konten.

**Effort:** M.

---

### P1-11. Homepage hanya sebagian bisa dikelola dari CMS

**Bukti**
- `SiteSettings` mengelola hero, pain points, benefits, promo, booking steps.
- Namun banyak teks masih hardcoded:
  - Judul section “Apakah ini yang Sedang Bunda Rasakan?” (`index.astro:143-146`).
  - Judul “Yang biasa Bunda rasakan setelah sesi” dan disclaimer (`index.astro:169-200`).
  - 5 pembeda di `ValueProps.astro` dari `siteConfig.differentiators` (bukan CMS).
  - Trust badge di `Hero.astro:70-80` hardcoded.
  - Banyak heading CTA dan label kecil di `index.astro`.
- `coverageAreas` dibaca dari CMS (`BaseLayout.astro:90`), tetapi **tidak ada field `coverageAreas` di SiteSettings**; nilainya selalu fallback ke `siteConfig`.
- `operationalSchedule` ada di interface `payload.ts:189-198`, tetapi tidak ada di CMS.
- `JsonLd.astro:60` memakai `siteConfig.coverageAreas`, bukan area dari CMS, sehingga menambah area baru di CMS tidak memperbarui schema.

**Dampak**
- Marketing tidak bisa mengubah seluruh copy homepage tanpa developer.
- Area baru di CMS tidak masuk structured data.
- Jam operasional hanya teks, tidak terstruktur untuk Google.

**Rekomendasi**
- Pindahkan homepage ke Page dengan block builder, atau lengkapi SiteSettings (differentiators, section headings, trust badges, structured hours, coverage areas).
- Gunakan `coverageAreas` dari CMS di `JsonLd`.
- Tambahkan preview homepage sebelum publish.

**Effort:** M.

---

### P1-12. Media: penyimpanan lokal, tanpa folder/crop, dan tidak dioptimasi frontend

**Bukti**
- `Media.ts:29-38` → `staticDir: path.resolve(dirname, '../../public/media')`, format WebP.
- `apps/cms/package.json` tidak memiliki adapter S3/R2 (`@payloadcms/storage-s3`).
- `docs/runbook-teknis.md:26` mengklaim “Media Storage: Cloudflare R2 via S3 Storage Adapter”, tetapi implementasinya lokal.
- `docker-compose.yml:18-19` memakai volume `cms_media`, jadi data bertahan selama volume tidak hilang — tetapi tidak ada CDN/replikasi.
- Tidak ada folder, crop, focal point, batas ukuran, atau dukungan PDF.
- Frontend memakai `<img>` biasa untuk media CMS, bukan `<Image>` Astro.

**Dampak**
- Media tidak ter-backup bersama DB (runbook hanya backup PostgreSQL), risiko hilang saat migrasi server.
- Media berat memperlambat LCP/Core Web Vitals.
- Editor tidak bisa mengelola aset dalam jumlah besar.

**Rekomendasi**
- Gunakan `@payloadcms/storage-s3` ke Cloudflare R2; set `serverURL`/`publicURL` ke CDN.
- Tambahkan folder media, pencarian, crop/focal point, dan validasi ukuran.
- Gunakan `<Image>` Astro atau `srcset` untuk media CMS.
- Backup media secara terjadwal (rclone ke R2).
- Dukung PDF/brosur jika dibutuhkan operasional.

**Effort:** M–L.

---

### P1-13. Beberapa koleksi tidak punya versi/rollback

**Bukti**
- `Services`, `ServiceAreas`, `Midwives`, `Testimonials`, `FAQ`, `Redirects`, `HelpCenter`, `PageTemplates` tidak memiliki `versions`.
- Articles/Pages/LandingPages/BlockTemplates punya drafts, tetapi bukan riwayat versi penuh dengan UI restore? Payload menyediakan versions; drafts menyimpan versi.
- Tidak ada fitur `trash`/soft delete; delete langsung permanen (kecuali restore DB).

**Dampak**
- Salah edit harga/FAQ/testimoni tidak bisa dikembalikan dari UI.
- Menghapus layanan/testimoni tidak bisa di-undo.
- Tidak ada jejak “siapa mengubah apa”.

**Rekomendasi**
- Aktifkan `versions: { drafts: true, maxPerDoc: 20 }` pada semua koleksi konten.
- Aktifkan `trash: true` untuk soft delete.
- Tambahkan `updatedBy` otomatis.
- Tambahkan audit log terpisah untuk aksi publish/delete.

**Effort:** M.

---

### P1-14. Navigasi dan hak akses tidak selalu selaras dengan UI

**Bukti**
- `Redirects.hidden` hanya menyembunyikan dari `author` dan `midwife_coordinator` (`Redirects.ts:15-19`), tetapi `create/update/delete` hanya untuk `superadmin/operator/marketing` (`access/roles.ts:56-59`). Role `seo` melihat menu Redirects tetapi tidak bisa mengedit.
- `SiteSettings.hidden` menyembunyikan dari `seo` (`SiteSettings.ts:11-14`), padahal SEO mungkin perlu mengatur canonical/analytics; sebaliknya `seo` bisa mengelola semua konten.
- `Users` hidden untuk non-superadmin, tetapi `Testimonial`/`FAQ` read-only untuk role tertentu tetap tampil tanpa indikator “read-only”.
- Dashboard menampilkan aksi yang tidak diizinkan (lihat P1-8).

**Dampak**
- Pengguna mengklik menu lalu menemukan form read-only atau error; tidak ada penjelasan.
- Role `seo` punya wewenang konten sangat luas tetapi tidak bisa mengatur redirect yang justru bagian dari SEO.

**Rekomendasi**
- Definisikan matriks role → koleksi → aksi secara eksplisit dan uji otomatis.
- Sembunyikan menu yang tidak bisa diedit, atau tampilkan badge “Hanya lihat”.
- Beri `seo` akses ke Redirects (dan mungkin SiteSettings bagian analytics), tetapi batasi field yang sensitif.
- Tampilkan pesan “Role Anda tidak memiliki izin untuk mengubah bagian ini” di form, bukan hanya error saat save.

**Effort:** S–M.

---

### P1-15. Skor SEO bagus secara tampilan, tetapi dangkal secara substansi

**Bukti**
- `calculateSeoScore.ts` memberi bobot pada title (20), description (20), keyword di title (15), H1 (15), alt (15), slug (10), OG (5).
- `wordCount` dikirim oleh adapter (`articleAdapter.ts:91`) tetapi **tidak dipakai** dalam perhitungan.
- Keyword hanya dicek di title, bukan di meta description, H1, isi konten, atau URL.
- `SeoPanelField.tsx:43` mengirim `wordCount: 300` hardcoded untuk estimasi client.
- `seoAuditFields.ts` tidak menyimpan `metrics`, sehingga dashboard selalu menghitung ulang (P1-8).
- `isNoIndex` tidak memengaruhi skor (wajar), tetapi tidak ada peringatan “halaman noindex tidak akan muncul di Google” di dokumen.
- `seoScore` tidak memblokir publish; artikel 50 kata dengan title/desc/slug/alt/OG lengkap bisa mendapat 100.

**Dampak**
- Editor merasa “SEO sudah 100” padahal konten tipis dan keyword tidak ada di badan artikel.
- Skor tidak bisa dijadikan gate kualitas.

**Rekomendasi**
- Tambahkan skor untuk: jumlah kata (min 300/600), keyword di H1/description/100 kata pertama, internal links, gambar, FAQ/heading structure, dan readability.
- Simpan `metrics` + `engineVersion` agar historis konsisten.
- Tampilkan penjelasan bobot dan action item per field.
- Untuk konten medis, tambahkan checklist E-E-A-T (penulis, reviewer, referensi, red flags, disclaimer).

**Effort:** M.

---

## 5. Temuan Minor (P2) — Perbaikan Cepat & Housekeeping

| # | Temuan | Bukti | Rekomendasi |
|---|---|---|---|
| 1 | `Link`/rich text di halaman hilang | `[slug].astro:61-81` | Pakai renderer bersama |
| 2 | Banner start/end tidak dipakai | `SiteSettings.ts:222-244`, `BaseLayout.astro:102` | Filter tanggal |
| 3 | `formatSlug` memotong 60 char & bisa bentrok | `formatSlug.ts:13` | Cek unik + suffix |
| 4 | `confirmLargePriceChange` tetap true setelah dipakai | `Services.ts:159-166` | Reset setelah save / jadikan konfirmasi per transaksi |
| 5 | `throw new Error` di hook harga (bukan `APIError`) | `Services.ts:49-53` | Pakai `APIError(400)` agar pesan sampai ke UI |
| 6 | `Articles.heroImageAlt` wajib meski tanpa gambar | `Articles.ts:140-149` | `required` kondisional |
| 7 | `Midwives.experienceYears` bisa negatif | `Midwives.ts:83-90` | Validasi integer ≥ 0 |
| 8 | `Services.order` bisa negatif/0 | `Services.ts:253-260` | Validasi ≥ 1 |
| 9 | `Redirects` tidak cek duplikat `from` | `Redirects.ts:40-76` | Validasi unik |
| 10 | Analytics ID tidak divalidasi format | `SiteSettings.ts:26-33` | Regex GTM-/G-/AW-/C- |
| 11 | `/api/deploy-status` kemungkinan publik & membocorkan slug/error | `payload.config.ts:94-102` | Lindungi dengan user check |
| 12 | `admin.meta.openGraph` mengarah ke file yang tidak ada | `payload.config.ts:82-91`; `apps/cms/public` tidak punya `images/` | Tambahkan aset atau hapus |
| 13 | Sitemap `lastmod` hardcoded | `astro.config.mjs:54` | Gunakan `updatedAt` per halaman |
| 14 | `JsonLd` area memakai `siteConfig`, bukan CMS | `JsonLd.astro:60` | Ambil dari `service-areas` |
| 15 | `fetchPayloadArticles` query salah (`status`) | `payload.ts:232` | `_status` |
| 16 | `audit-backfill` memicu deploy berulang | `audit-backfill.ts:26-39` | Update tanpa trigger deploy / mode backfill |
| 17 | `seed.ts` membuat admin dengan password diketahui | `seed.ts:21-29` | Env + must change |
| 18 | `push: true` di production | `payload.config.ts:153-160` | Migrations-only di production |
| 19 | `payload.config.ts` fallback DB password | `:157-159` | Hapus; fail-fast |
| 20 | Custom dashboard memakai inline style terang | `CustomDashboard.tsx` | Cek dark mode; gunakan CSS variables |
| 21 | CSS menyembunyikan `.dashboard__modules` dengan selector internal | `custom.scss:63-68` | Risiko patah saat upgrade Payload |
| 22 | `defaultValues` blok berisi klaim medis/garansi | `GuaranteeBlock.ts:20-27` | Kosongkan default klaim berisiko |
| 23 | Testimoni bot bisa default `active=true` & `permissionGranted=true` | `Testimonials.ts:107-116,146-155` | Paksa false saat create via API key |
| 24 | `Testimonials.permissionGranted` required | `Testimonials.ts:108-116` | Ganti status moderasi |
| 25 | Tidak ada 2FA / rate limit login | konfigurasi `Users` | Cloudflare Access + 2FA + rate limit |
| 26 | `Users.read` untuk anonim mengembalikan query `id: undefined` | `Users.ts:18-21` | Return `false` bila tidak ada user |
| 27 | `HelpCenter` read publik | `HelpCenter.ts:16-20` | Tidak sensitif, tapi pertimbangkan auth |
| 28 | `Redirects.notes` publik | `Redirects.ts:20-25` | Sembunyikan field notes dari publik |
| 29 | `Media` delete hanya superadmin/operator | `Media.ts:24-27` | Izinkan author hapus milik sendiri / orphan cleanup |
| 30 | `Pages` reserved slug tidak memasukkan `preview`, `_blocks` | `Pages.ts:11-28` vs `pageBuilderValidators.ts:12-31` | Samakan daftar |
| 31 | `Services`/`Areas`/`Midwives` slug tanpa validasi format | koleksi terkait | Pakai validator slug bersama |
| 32 | `siteSettings` text replacement “500+ → 1000+” hardcoded | `payload.ts:347-352` | Hapus magic transform |
| 33 | `featuredServices` memakai 3 pertama, bukan pilihan editor | `FeaturedServices.astro:12-34` | Gunakan `recommended`/`order` |
| 34 | `LandingPages` `active` + `_status` ganda | `LandingPages.ts:62-64,172-179` | Konsolidasi |
| 35 | `PageTemplates`/`BlockTemplates` tidak punya preview | koleksi terkait | Tambahkan preview blok |
| 36 | `BlockTemplates` tidak memicu deploy | `BlockTemplates.ts` | Hook afterChange |
| 37 | `ServiceAreas.estimatedArrivalMinutes` teks bebas | `ServiceAreas.ts:93-100` | Format/rentang tervalidasi |
| 38 | `Pages` canvas tanpa layout bisa tanpa H1 | `[slug].astro:102-113` | Wajibkan minimal satu H1 |
| 39 | `LandingPages` legacy “Mode Klasik” membingungkan | `LandingPages.ts:261-425` | Hapus setelah migrasi |
| 40 | `Admin` dashboard filter judul “test ads” | `CustomDashboard.tsx:99-102` | Gunakan flag arsip |

---

## 6. Matriks Kapabilitas Tugas (Perspektif Pengguna)

Legenda: ✅ berfungsi baik · ⚠️ berfungsi sebagian / ada jebakan · ❌ gagal end-to-end

| # | Tugas pengguna | Status | Penjelasan singkat |
|---|---|---:|---|
| 1 | Menulis & menerbitkan artikel edukasi | ❌ | Artikel tidak dirender website; preview 404 |
| 2 | Mengedit copy beranda (hero, promo, pain points) | ⚠️ | Sebagian dari SiteSettings; banyak heading hardcoded |
| 3 | Mengelola layanan & harga | ⚠️ | CRUD jalan, tetapi `price` bisa basi, `order`/`recommended` tidak dipakai, tanpa preview |
| 4 | Mengelola area layanan | ⚠️ | CRUD jalan; `order` tidak dipakai; schema area tidak ikut CMS |
| 5 | Mengelola profil bidan & STR | ✅ | Berfungsi; tanpa versi/rollback |
| 6 | Mengelola testimoni | ⚠️ | CRUD jalan; consent default berisiko; nonaktif tidak memicu deploy; API terbuka |
| 7 | Mengelola FAQ | ⚠️ | CRUD jalan; nonaktif tidak memicu deploy |
| 8 | Membuat halaman informasi | ⚠️ | Bisa dibuat; rich text kehilangan list/link/bold; tanpa preview draft |
| 9 | Membuat landing page iklan | ❌ | Dua sumber kebenaran; versi hidden menang; preview tidak valid |
| 10 | Mengatur banner promo | ⚠️ | Tampil, tetapi tanggal mulai/berakhir diabaikan |
| 11 | Mengatur pixel/analytics | ✅ | ID terpusat di SiteSettings; tanpa validasi format |
| 12 | Mengatur redirect 301/302 | ✅ | Terinjeksi saat build; tidak otomatis saat slug berubah; role `seo` tidak bisa edit |
| 13 | Mengunggah & memakai media | ❌/⚠️ | Upload jalan; URL relatif berisiko 404; tanpa folder/crop/CDN |
| 14 | Mengelola pengguna & role | ❌ | UI jalan, tetapi role bisa dieskalasi sendiri |
| 15 | Melihat status deploy | ❌ | Status in-memory; “success” ≠ build selesai |
| 16 | Preview sebelum publish | ❌ | Draft tidak terlihat; live preview hanya judul |
| 17 | Rollback/version history | ⚠️ | Hanya 4 koleksi; sisanya tidak |
| 18 | Menjadwalkan publish | ❌ | Tidak tersedia |
| 19 | Review/approval konten medis | ❌ | Tidak ada workflow; hanya teks bebas |
| 20 | Bulk edit/import konten | ❌ | Tidak ada |
| 21 | Melihat “apa yang berubah & kapan tayang” | ❌ | Dashboard tidak akurat; tidak ada antrean publish |
| 22 | Mencari konten lintas koleksi | ⚠️ | Hanya search bawaan per list |

### Penilaian UI/UX (Heuristik)

| Aspek | Skor | Catatan |
|---|---:|---|
| Konsistensi istilah | 4/10 | “Landing Page”, “Halaman Penawaran”, “Sales”, “Kanvas”, “Elementor”, “Mode Klasik” bercampur |
| Beban kognitif | 5/10 | 14 blok, 4 tab, banyak pilihan teknis; cocok untuk developer, berat untuk bidan |
| Umpan balik sistem | 5/10 | Deploy status menyesatkan; tidak ada progres build nyata; preview bohong |
| Pencegahan error | 7/10 | Regex WA, guard harga, alt wajib, reserved slug — kuat |
| Efisiensi tugas | 6/10 | Quick actions berguna, tetapi tidak role-aware; duplikasi konten |
| Aksesibilitas | 7/10 | Label/description jelas, kontras diperbaiki; emoji berlebihan di label |
| Kepercayaan & transparansi | 4/10 | Angka dashboard dan status build tidak bisa dipegang |
| Onboarding | 6/10 | Help Center & SOP ada; tidak kontekstual di field |
| Mobile admin | 6/10 | Responsif bawaan; block builder berat di layar kecil (belum diuji) |
| Dark mode | 5/10 | Dashboard kustom memakai warna inline terang |

**Kesimpulan UX:** CMS **cukup capable untuk operator menjalankan CRUD dasar** (layanan, area, bidan, FAQ, testimoni), tetapi **belum capable untuk alur kerja konten penuh** (tulis → review → preview → publish → verifikasi) dan **belum membangun kepercayaan** karena status/preview/urutan/harga bisa tidak sesuai kenyataan.

---

## 7. Perspektif Agent AI: Kesiapan Otomasi

### 7.1 Skor Kesiapan

| Dimensi | Skor | Alasan |
|---|---:|---|
| Ketersediaan API | 6/10 | REST + GraphQL aktif; API key tersedia |
| Penemuan skema | 4/10 | Tidak ada OpenAPI; GraphQL introspection membantu, tetapi blok/Lexical kompleks |
| Autentikasi & scoping | 4/10 | API key = role operator penuh; tidak ada scope per koleksi; role escalation |
| Authoring konten | 2/10 | Harus menyusun Lexical JSON + nested block JSON; tidak ada Markdown |
| Ergonomi validasi | 3/10 | Error gabungan, bukan per field; tidak ada dry-run |
| Idempotency | 2/10 | Hanya `Testimonials.externalRef`; artikel/halaman tidak punya external ID |
| Verifikasi hasil | 2/10 | Tidak ada preview token; status build tidak akurat; render statis delay |
| Media | 3/10 | Upload multipart; URL relatif; tanpa transformasi/alt otomatis |
| Governance & audit | 3/10 | Tidak ada approval medis; tidak ada audit log; versi terbatas |
| **Total** | **3,5/10** | **Cukup untuk CRUD internal, belum untuk otonomi produksi** |

### 7.2 Yang Sudah Mudah untuk Agent

- CRUD `services`, `service-areas`, `midwives`, `faq`, `testimonials`, `redirects` via REST.
- Membaca `site-settings` dan konten publik.
- Upload media (multipart) — meski hasil URL bermasalah.
- Menemukan field via GraphQL introspection (`/api/graphql`) karena endpoint GraphQL tersedia.
- Menggunakan API key (`Users.auth.useAPIKey`) untuk otentikasi server-ke-server.
- Memicu deploy tidak langsung: publish/update memanggil hook Cloudflare.
- Menghindari duplikasi testimoni via `externalRef` (satu-satunya idempotency yang ada).

### 7.3 Yang Membuat Agent Sulit/Sangat Sulit

1. **Membuat artikel yang benar-benar tayang** — harus memperbaiki query `_status`, menulis renderer Lexical, dan menambah route; saat ini mustahil lewat CMS saja.
2. **Menulis rich text** — tidak ada endpoint Markdown/HTML. Agent harus menghasilkan struktur Lexical JSON yang benar (paragraph, heading, list, link, upload) dan memahami format `format` bitmask.
3. **Menyusun blok halaman** — 14 block type dengan field berbeda, array bersarang, relationship, dan validasi publish. Tidak ada schema/OpenAPI resmi; agent harus membaca config atau introspection.
4. **Memverifikasi hasil** — tidak ada preview draft, tidak ada signed preview URL, dan build statis butuh 1–2 menit. Agent tidak bisa memastikan “sudah benar” sebelum/after publish.
5. **Mengetahui kapan build selesai** — `deploy-status` hanya state memori; sukses webhook ≠ sukses build.
6. **Retry tanpa duplikasi** — tidak ada idempotency key di create article/page/service. Retry karena timeout bisa membuat duplikat.
7. **Memperbaiki error** — validasi publish melempar satu string berisi bullet; tidak ada `field path`. Agent tidak tahu field mana yang harus diubah.
8. **Menghubungkan relasi** — harus query ID terlebih dahulu; tidak ada resolusi by slug pada write.
9. **Mengelola media** — URL relatif, tidak ada alt generation, tidak ada transformasi; agent harus menebak domain.
10. **Tata kelola konten medis** — agent bisa publish klaim berisiko tanpa approval; tidak ada guard yang memadai.
11. **Skala** — tidak ada bulk create/update, tidak ada job queue, tidak ada rate-limit header, tidak ada cursor pagination yang didokumentasikan.
12. **Audit** — tidak ada log “agent X mengubah harga Y pada waktu Z” untuk koleksi non-versioned.

### 7.4 Contoh Alur Agent dan Titik Gagalnya

```
Agent ingin membuat artikel "Cara Mengatasi Bayi Kolik"
  1. POST /api/articles            ✅ berhasil
  2. isi content Lexical JSON      ⚠️ harus tahu format internal
  3. publish (_status=published)   ✅ berhasil, deploy terpicu
  4. cek /blog/cara-mengatasi...   ❌ 404 (blog Markdown lokal)
  5. cek gambar hero               ❌ URL relatif / 404
  6. cek status build              ⚠️ "success" palsu / tidak ada deployId
  7. retry kalau timeout           ❌ duplikat artikel
```

### 7.5 Arsitektur Otomasi yang Disarankan

```
┌──────────────┐     ┌──────────────────────────────┐     ┌──────────────────┐
│ Agent / LLM  │ ──► │ Automation API / MCP Server  │ ──► │ Payload REST/    │
└──────────────┘     │ - typed tools                │     │ GraphQL          │
                     │ - dry-run validation         │     └────────┬─────────┘
                     │ - idempotency                │              │
                     │ - policy & medical guard     │              ▼
                     └──────────────┬───────────────┘     ┌──────────────────┐
                                    │                     │ PostgreSQL       │
                                    ▼                     └──────────────────┘
                     ┌──────────────────────────────┐
                     │ Job Queue (publish/build)    │
                     │ - deployId, status, retry    │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │ Cloudflare Pages API         │
                     │ + Preview URL verifier       │
                     └──────────────────────────────┘
```

**Kontrak tool minimal yang perlu disediakan:**

| Tool | Fungsi |
|---|---|
| `search_content` | Cari lintas koleksi berdasarkan judul/slug/status |
| `get_content` | Ambil dokumen by id/slug, termasuk draft |
| `validate_content` | Dry-run validasi → error per field (tanpa menyimpan) |
| `create_content` | Create dengan `idempotencyKey` + `externalId` |
| `update_content` | Update parsial, optimistic locking (`updatedAt`) |
| `publish_content` | Publish/schedule, kembalikan `deployId` |
| `unpublish_content` | Unpublish + trigger build |
| `create_redirect` | Otomatis saat slug berubah |
| `upload_media` | Upload + alt + kembalikan URL absolut |
| `get_deploy_status` | Status nyata dari Cloudflare + URL live |
| `preview_url` | Signed preview untuk draft |
| `list_relations` | ID/nama layanan, bidan, area, kategori |

**Yang perlu diaktifkan di Payload:**
- `serverURL` (mutlak untuk media, CSRF, preview).
- Field-level access untuk `role`.
- `versions.drafts.autosave` dan `schedulePublish`.
- `trash: true` + `versions` di semua koleksi konten.
- `externalId` unik + idempotency di koleksi yang diotomasi.
- API key per integrasi dengan role `automation` (least privilege).
- Outbound webhook `content.published`, `content.updated`, `deploy.succeeded`, `deploy.failed` dengan HMAC + retry.
- Audit log collection (`actor`, `action`, `collection`, `docId`, `before`, `after`, `timestamp`).
- OpenAPI (plugin) atau minimal dokumentasi kontrak + contoh payload per block.
- Endpoint `POST /api/validate` yang mengembalikan `{ errors: [{ path, code, message }] }`.
- Preview token (JWT singkat) untuk route SSR draft.

---

## 8. Roadmap Perbaikan

### 8.1 Quick Wins (< 1 hari, dampak besar)

| # | Aksi | Dampak |
|---|---|---|
| 1 | Set `serverURL` di `payload.config.ts` | Gambar CMS langsung tampil |
| 2 | Field-level access untuk `role` + guard `beforeChange` | Menutup eskalasi hak akses |
| 3 | Access read testimoni/services/areas/FAQ: filter `active` | Menutup kebocoran konten |
| 4 | Rotasi & hapus fallback secret | Menutup kebocoran kredensial |
| 5 | Trigger deploy saat `active` berubah true→false | Unpublish benar-benar unpublish |
| 6 | `sort=order` di semua fetch + hapus `preferredOrder` | Urutan CMS berfungsi |
| 7 | Filter tanggal banner | Promo kedaluwarsa hilang |
| 8 | Perbaiki query `_status` di `fetchPayloadArticles` | Menghilangkan latent 400 |
| 9 | Reset `confirmLargePriceChange` setelah save | Guard harga tidak bisa dilewati |
| 10 | Sinkronkan `price`/`duration` dari numeric | Harga tidak basi |

### 8.2 Sprint 1 (1–2 minggu): Integritas & Kepercayaan

- Migrasi/penghubungan Articles ke website + renderer Lexical.
- Konsolidasi LandingPages → Pages; hapus koleksi hidden.
- Preview draft SSR + token; perbaiki label “Live Preview”.
- Persist `seoAudit.metrics`; dashboard role-aware & tautan benar.
- Status deploy nyata (Cloudflare API + DB).
- Auto-redirect saat slug berubah.
- Versi + trash untuk semua koleksi konten.
- Test E2E: publish artikel/halaman/landing, preview, unpublish, redirect.

### 8.3 Sprint 2 (2–4 minggu): UX & Tata Kelola

- Workflow editorial: draft → medical_review → approved → scheduled → published.
- Author/reviewer sebagai relationship + sign-off.
- Homepage copy lengkap di CMS (differentiators, headings, structured hours, areas).
- Media: R2/CDN, folder, crop, alt, `<Image>`.
- Validasi publish lengkap + error per field.
- Role matrix diuji otomatis; menu read-only diberi badge.
- Dashboard: antrean review, “perubahan belum tayang”, status build live.
- Perbaiki semua P2 prioritas tinggi.

### 8.4 Sprint 3 (4–8 minggu): Automation-Ready

- Automation API/MCP server dengan tool contract di atas.
- OpenAPI + schema blok terdokumentasi.
- Idempotency + externalId + optimistic locking.
- Outbound webhook bertanda tangan + retry.
- Scoped API key + rate limit + audit log.
- Sandbox/staging + seed reset + contract tests.
- Observability: Sentry, structured logs, healthcheck, alert build.
- Migrasi dari `push: true` ke migrations-only.
- Backup media + uji restore end-to-end.

---

## 9. Checklist QA Sebelum Menyatakan CMS “Siap”

- [ ] Artikel CMS muncul di `/blog` dan `/blog/[slug]`, termasuk gambar, list, link, dan bold.
- [ ] Mengubah slug artikel/halaman membuat redirect 301 otomatis; URL lama tidak 404.
- [ ] Upload gambar dari CMS tampil di domain publik (hero, galeri, bidan, testimoni, OG).
- [ ] Preview draft menampilkan seluruh blok dan teks terbaru, bukan hanya judul.
- [ ] Mengedit landing page di menu yang terlihat benar-benar mengubah `/sales/[slug]`.
- [ ] Menonaktifkan layanan/FAQ/testimoni/bidan menghilangkan konten dari situs setelah build.
- [ ] Mengubah `numericPrice` mengubah semua tampilan harga dan JSON-LD.
- [ ] Mengubah urutan/recommended mengubah urutan di beranda dan katalog.
- [ ] Banner promo berhenti tampil setelah tanggal berakhir.
- [ ] Pengguna non-superadmin tidak bisa mengubah role-nya sendiri (uji via API).
- [ ] `/api/testimonials` tidak mengembalikan testimoni `active=false`/`permissionGranted=false` untuk anonim.
- [ ] Status build di dashboard sesuai dengan status deployment Cloudflare sebenarnya.
- [ ] Semua role dapat mengakses menu yang tampil, dan menu read-only diberi indikator.
- [ ] Publish halaman kosong/landing tanpa CTA diblokir dengan pesan yang jelas.
- [ ] `npm run build:cms` dan `npm run build` lolos; tidak ada error tipe.
- [ ] `npm run seed` di lingkungan bersih menghasilkan konten yang konsisten (tanpa duplikat landing).

---

## 10. Lampiran: Peta Bukti Utama

| Area | File |
|---|---|
| Config CMS | `apps/cms/src/payload.config.ts` |
| Access control | `apps/cms/src/access/roles.ts` |
| Users/role | `apps/cms/src/collections/Users.ts` |
| Articles | `apps/cms/src/collections/Articles.ts` |
| Pages/Landing | `apps/cms/src/collections/Pages.ts`, `LandingPages.ts` |
| Layanan/Area/Bidan/Testimoni/FAQ | `apps/cms/src/collections/*.ts` |
| SiteSettings | `apps/cms/src/globals/SiteSettings.ts` |
| Dashboard | `apps/cms/src/components/admin/CustomDashboard.tsx` |
| SEO | `apps/cms/src/fields/*`, `apps/cms/src/lib/seo-engine/*` |
| Validasi page builder | `apps/cms/src/utilities/pageBuilderValidators.ts` |
| Deploy | `apps/cms/src/utilities/triggerDeployHook.ts` |
| Media | `apps/cms/src/collections/Media.ts` |
| Frontend client | `apps/web-kala/src/lib/payload.ts` |
| Blog | `apps/web-kala/src/pages/blog/*` |
| Pages renderer | `apps/web-kala/src/pages/[slug].astro` |
| Sales renderer | `apps/web-kala/src/pages/sales/[slug].astro` |
| Preview | `apps/web-kala/src/pages/preview/**` |
| Blocks | `apps/web-kala/src/components/blocks/*` |
| Layout/SEO | `apps/web-kala/src/layouts/BaseLayout.astro`, `components/JsonLd.astro` |
| Config Astro | `apps/web-kala/astro.config.mjs` |
| Dokumentasi | `docs/sop-operasional.md`, `docs/runbook-teknis.md` |

---

## 11. Penutup

CMS ini punya **fondasi yang kuat dan ambisi yang tepat**. Yang kurang bukan sekadar “polish UI”, melainkan **penyambungan sumber kebenaran, verifikasi hasil, dan tata kelola penerbitan**. Selama tiga hal itu belum diperbaiki, tim akan mengalami pola yang melelahkan: menyimpan data berhasil, melihat pesan sukses, tetapi website tidak berubah — atau berubah dengan gambar rusak.

Prioritas tertinggi bukan menambah fitur baru, melainkan:
1. **Satu sumber kebenaran** untuk artikel dan landing page.
2. **Satu jalur preview** yang benar-benar menampilkan draft.
3. **Satu status deploy** yang benar-benar berarti.
4. **Satu model izin** yang tidak bisa dilewati.
5. **Satu kontrak API** yang bisa dipakai agent tanpa menebak.

Setelah lima hal itu beres, CMS ini bisa menjadi salah satu CMS kesehatan yang sangat matang — dan siap untuk otomasi AI yang aman.
