# Audit UI/UX Admin CMS KalaWeb — Level Mikro

**Tanggal audit:** 5 November 2026  
**Objek:** `apps/cms` (Payload CMS 3.91 + Next.js 15.4) di `https://admin.kalababyspa.com`  
**Metode:** audit runtime read-only di admin produksi, snapshot aksesibilitas, pengukuran DOM/computed style, Lighthouse, cross-check REST API, dan review kode sumber.  
**Skill/perkakas yang dipakai:** skill **Browser** untuk audit runtime, **Lighthouse** untuk aksesibilitas, serta pembacaan kode `apps/cms/src`.  
**Sifat audit:** tidak ada publish, simpan, unggah, hapus, atau perubahan data. Semua temuan berasal dari layar yang dibuka tanpa menyimpan.

---

## 0. Ringkasan Eksekutif

CMS ini punya **niat desain yang jauh di atas rata-rata**: label berbahasa Indonesia, deskripsi field yang panjang dan ramah, dashboard kustom, panel SEO live, visual page builder, preview draft, role badge, validasi publish, dan pusat bantuan. Secara konsep, ini bukan CMS “asal jadi”.

Namun pada kondisi produksi saat audit, **lapisan UI/UX-nya tidak dapat dipercaya sebagai satu kesatuan**:

1. **Field di dalam `group` tidak dirender sama sekali** di banyak layar. Akibatnya tab SEO kosong, SEO tidak bisa diedit, dan sebagian besar Pengaturan Situs (analytics, banner, homepage, jam operasional) tidak bisa diubah. Data tetap ada di API, tetapi UI-nya seperti halaman rusak.
2. **Visual Page Builder crash** saat memilih seksi yang memiliki media kosong (`null`), dengan error `Cannot read properties of null (reading 'alt')`. Seluruh builder berubah menjadi layar “Application error” tanpa jalan pulang.
3. **Skor SEO saling bertentangan** untuk dokumen yang sama: daftar menampilkan `0`, API `80`, panel SEO `40`, dashboard `82`. Tidak ada satu angka yang bisa dipercaya.
4. **Mode gelap membuat navigasi dan dashboard hampir tidak terbaca**: kontras teks 1,03:1 sampai 2,43:1. Ini bukan sekadar “kurang cantik”, tetapi kegagalan aksesibilitas.
5. **Tabel daftar meluber ke luar layar** (hingga 1.802 px pada viewport 1.296 px) sementara `body` memakai `overflow: hidden`, sehingga kolom status dan aksi tidak dapat dijangkau.
6. **Dashboard menautkan ke koleksi yang disembunyikan** (`landing-pages`) dan menampilkan tautan yang 404. Beberapa label tautan juga tidak cocok dengan hasil filternya.
7. **Enam koleksi inti kosong** (media, FAQ, bidan, area, template halaman, riwayat deploy), tetapi dashboard tetap menyatakan “Situs Live & Sinkron”.
8. **Microcopy dan format angka/tanggal belum dilokalisasi dengan benar**: “Oktober ke-24 2026, 7:39 AM”, `<Tidak ada Judul Halaman>`, `benar/salah`, `100000`, dan pesan kosong yang membingungkan.

**Verdict:** CMS ini **belum siap dipakai mandiri oleh operator non-teknis**. Konsep dan struktur datanya kuat, tetapi keandalan rendering, konsistensi data, aksesibilitas, dan kualitas microcopy-nya belum berada pada level “production-grade”. Sebagian besar temuan P0 terlihat seperti **regresi build/deploy atau bug rendering**, bukan kelemahan desain fundamental; jika sumbernya ditemukan, perbaikannya bisa relatif cepat.

### Skor UI/UX

| Dimensi | Skor | Catatan singkat |
|---|---:|---|
| Arsitektur informasi & navigasi | **5,0 / 10** | Pengelompokan menu masuk akal, tetapi tidak ada item Dasbor/global search, dan ada koleksi legacy tersembunyi yang masih ditautkan. |
| Dashboard | **4,5 / 10** | Kartu aksi dan role badge bagus; angka, tautan, dan klaim status tidak dapat dipercaya. |
| Daftar & tabel | **4,0 / 10** | Pencarian dan filter ada; tabel meluber, boolean mentah, harga mentah, skor SEO salah. |
| Form & edit | **3,5 / 10** | Deskripsi field sangat baik; tetapi tab SEO kosong, group settings kosong, dan ada dua mode authoring yang membingungkan. |
| Visual Page Builder | **5,0 / 10** | Konsep dan fitur (undo, preview, focus trap) bagus; crash, teks 9,75–11 px, target 20–23 px, dan modal tanpa semantik. |
| Aksesibilitas | **3,5 / 10** | Lighthouse dashboard 92, edit artikel 77; kontras gelap, landmark, heading, label, dan nama tombol bermasalah. |
| Desain visual & tema | **4,0 / 10** | Komponen kustom memakai warna hardcoded; mode gelap rusak; builder selalu gelap. |
| Microcopy & lokalisasi | **3,0 / 10** | Banyak istilah teknis, placeholder framework bocor, tanggal salah format, status tidak konsisten. |
| Kepercayaan data | **2,5 / 10** | Skor SEO ganda, metrik nol, “Live & Sinkron” tanpa verifikasi, tautan 404. |
| Responsif / mobile | **4,0 / 10** | Builder memberi peringatan layar sempit (baik); tabel dan target sentuh belum siap. |
| **Rata-rata** | **4,1 / 10** | **Belum production-ready untuk operator non-teknis.** |

### 10 temuan paling penting

| # | Temuan | Severity |
|---|---|---:|
| 1 | Semua field teks/upload di dalam `group` tidak dirender; SEO dan sebagian besar Pengaturan Situs tidak bisa diedit | **P0** |
| 2 | Visual Builder crash saat memilih seksi dengan media `null` | **P0** |
| 3 | Empat skor SEO berbeda untuk dokumen yang sama | **P0** |
| 4 | Mode gelap: teks navigasi/dashboard/panel SEO berkontras 1,03–2,43:1 | **P0** |
| 5 | Tabel daftar meluber dan kolom kanan tidak dapat dijangkau | **P1** |
| 6 | Dashboard menautkan ke `landing-pages` tersembunyi (404) dan CTA tidak sesuai filter | **P1** |
| 7 | Enam koleksi inti kosong, tetapi dashboard mengklaim situs live & sinkron | **P1** |
| 8 | Tanggal, angka, boolean, dan placeholder framework belum dilokalisasi | **P1** |
| 9 | Target sentuh 18–27 px dan teks 9,75–13 px di area utama | **P1** |
| 10 | Tidak ada `<main>` di dashboard/login, heading melompat, tombol ikon tanpa nama aksesibel | **P1** |

### Yang sudah baik dan perlu dipertahankan

- **Deskripsi field sangat kaya.** Hampir setiap field punya penjelasan, contoh, dan konteks. Ini jauh di atas rata-rata CMS.
- **Label berbahasa Indonesia** dan nada komunikasi yang hangat (“Bunda”, “Si Kecil”).
- **Dashboard berbasis role** dengan badge peran dan kartu aksi yang relevan.
- **Konsep Visual Page Builder** kuat: full-screen, drag-and-drop, undo/redo, preview iframe, indikator simpan, dan peringatan layar sempit.
- **Preview draft** memakai banner jelas “PRATINJAU DRAFT HALAMAN”.
- **Validasi publish** dan guard harga sudah ada; pesan validasi dapat ditindaklanjuti.
- **Pusat Bantuan Admin** berisi panduan kerja, bukan sekadar dokumentasi teknis.
- **Grid dashboard responsif** memakai `auto-fit minmax(280px, 1fr)`.
- **Focus trap builder** dan konfirmasi tutup sudah diimplementasikan dengan benar.

---

## 1. Ruang Lingkup, Metode, dan Batasan

### 1.1 Layar yang diaudit

| Area | URL / layar | Status audit |
|---|---|---|
| Login | `/admin/login` | Runtime |
| Lupa kata sandi | `/admin/forgot` | Runtime |
| Dashboard | `/admin` | Runtime + Lighthouse |
| Artikel (daftar) | `/admin/collections/articles` | Runtime |
| Artikel (edit) | `/admin/collections/articles/3` | Runtime + Lighthouse |
| Artikel (buat) | `/admin/collections/articles/create` | Runtime |
| Halaman (daftar) | `/admin/collections/pages` | Runtime |
| Halaman (edit) | `/admin/collections/pages/4` | Runtime |
| Layanan (daftar/edit) | `/admin/collections/services`, `/1` | Runtime |
| Testimoni | `/admin/collections/testimonials`, `/1` | Runtime |
| Media | `/admin/collections/media`, `/create` | Runtime |
| FAQ, Bidan, Area | Daftar | Runtime |
| Template halaman/blok | Daftar | Runtime |
| Pengalihan URL | Daftar | Runtime |
| Riwayat deploy | Daftar | Runtime |
| Pusat bantuan | Daftar + detail `/3` | Runtime |
| Pengguna | Daftar + edit `/1` | Runtime |
| Pengaturan Situs | `/admin/globals/site-settings` | Runtime |
| Akun | `/admin/account` | Runtime |
| Versi dokumen | `/admin/collections/articles/3/versions` | Runtime |
| Visual Builder | Dialog pada halaman `/4` | Runtime |
| Katalog seksi | Modal di dalam Builder | Runtime |
| Pemilih media | Modal di dalam Builder | Runtime + review kode |
| Koleksi legacy | `/admin/collections/landing-pages/...` | Runtime (404) |

### 1.2 Bukti yang dikumpulkan

- Snapshot accessibility tree dan pembacaan DOM langsung.
- Pengukuran `getBoundingClientRect`, `scrollWidth`, `clientWidth`, `fontSize`, `fontWeight`, `color`, dan `backgroundColor`.
- Perhitungan rasio kontras WCAG untuk teks yang terlihat.
- Lighthouse: dashboard, edit artikel, login.
- Cross-check REST API (`/api/articles`, `/api/globals/site-settings`) untuk membandingkan data vs yang tampil.
- Review kode sumber untuk mengonfirmasi baris dan komponen penyebab.
- Pengukuran navigasi: TTFB ±504 ms, DOMContentLoaded ±638 ms, load ±814 ms; ±2,5 MB JS decoded untuk dashboard.

### 1.3 Batasan

- Audit dilakukan **read-only**; tidak menguji simpan, publish, upload, delete, atau rollback.
- Tidak ada screenshot visual karena tab browser di lingkungan audit tidak berada dalam keadaan “visible” untuk capture; analisis visual memakai DOM, computed style, accessibility tree, dan Lighthouse.
- Viewport yang teramati: 1.296 × 886 dan sempat 1.000 × 700. Emulasi 375/768 px tidak tersedia.
- Hanya role **Super Administrator** yang diuji. Perilaku UI per role lain dianalisis dari kode, bukan runtime.
- Cloudflare deploy tidak dipicu; status deploy dianalisis dari kode dan data koleksi `deployments`.
- Data produksi dapat berubah setelah tanggal audit.

---

## 2. Peta Informasi & Navigasi

```
Sidebar
├── Konten & Blog
│   ├── Artikel Edukasi
│   └── Pustaka Media
├── Halaman Website
│   ├── Semua Halaman
│   ├── Template Halaman
│   └── Template Blok
├── Layanan & Klinik
│   ├── Paket Layanan & Spa
│   ├── Bidan & Tenaga Medis
│   ├── Area Jangkauan
│   ├── Testimoni Bunda
│   └── Tanya Jawab (FAQ)
└── Pengaturan & Bantuan
    ├── Riwayat Deploy Website
    ├── Pengalihan URL
    ├── Pusat Bantuan Admin
    ├── Pengguna & Hak Akses
    └── Pengaturan Situs
```

**Catatan IA:**

- **Tidak ada item “Dasbor” di sidebar.** Dasbor hanya bisa dicapai lewat ikon rumah kecil di header atau logo. Pengguna yang sedang berada di koleksi tertentu harus menebak.
- **Tidak ada pencarian global.** Dengan 15 item menu dan 4 kelompok, pengguna harus masuk ke koleksi satu per satu.
- **`landing-pages` disembunyikan dari sidebar tetapi datanya muncul di dashboard.** Ini menciptakan tautan mati dan dua sumber kebenaran.
- **“Template Halaman” kosong**, sementara Builder menawarkan template hardcoded. Pengguna melihat dua konsep template yang berbeda.
- **“Riwayat Deploy Website” berada di kelompok Pengaturan & Bantuan**, padahal erat kaitannya dengan publikasi konten.
- **Istilah teknis bercampur**: “Versi”, “API”, “webhook”, “idempotency”, “slug”, “ID Anchor”, “STEPS”, “pixel”, “GTM”, “GA4”, “Schema.org”.
- **Status terlalu banyak istilah**: “Terbit”, “Diterbitkan”, “Draf”, “Draf (memiliki versi yang dipublikasikan)”, “Aktif”, “Tayang”, “Live”, “Sinkron”, “Off”.

---

## 3. Temuan Kritis (P0)

### P0-01 — Field di dalam `group` tidak dirender; SEO dan Pengaturan Situs tidak bisa diedit

**Severity:** P0 — blocker operasional  
**Area:** Artikel, Halaman, Layanan, Pengaturan Situs, Pusat Bantuan

**Bukti runtime**

| Layar | Yang terlihat | Bukti DOM |
|---|---|---|
| Artikel `/3` → tab “Optimasi SEO” | Hanya judul “🔍 Optimasi SEO & Social Share” + deskripsi | `#field-seo .render-fields` memiliki **0 child** |
| Artikel `/create` → tab “Optimasi SEO” | Sama, kosong | `childCount: 0` |
| Layanan `/1` | Group SEO kosong | `childCount: 0` |
| Halaman `/4` → tab “Optimasi SEO” | Group kosong | `childCount: 0` |
| Pengaturan Situs → tab “Pelacakan & Pixel” | Hanya “ID Pelacakan & Analitik” | `childCount: 0` |
| Pengaturan Situs → tab “Banner Promo” | Hanya “Pengaturan Banner Bar Atas” | `childCount: 0` |
| Pengaturan Situs → tab “Teks Beranda” | Hanya “Konten Spesifik Halaman Depan” | `childCount: 0` |
| Pengaturan Situs → tab “Kontak & Identitas” | Field WhatsApp tampil, group “Jam Operasional Terstruktur” kosong | `childCount: 0` |
| Pusat Bantuan `/3` | “Aturan Boleh vs Tidak Boleh (Do's & Don'ts)” hanya judul | Tidak ada field anak |

**Data sebenarnya tetap ada**

- `GET /api/articles/3` mengembalikan objek `seo` lengkap (`metaTitle`, `metaDescription`, `focusKeyword`, `ogImage`, `canonicalUrl`, `noIndex`, `isSubstantiveUpdate`) — meskipun nilainya masih `null`.
- `GET /api/globals/site-settings` mengembalikan:
  - `analytics.gtmId = "GTM-5J7NM8BG"`
  - `analytics.metaPixelId = "1465457801784141"`
  - `whatsappNumber = "6285794210526"`
  - `bannerGroup`, `homepage`, `structuredHours`, `coverageCities`
- RSC payload halaman edit tetap memuat definisi field `metaTitle`, `metaDescription`, `focusKeyword`, `ogImage`, dan seterusnya.

Artinya: **config dan data ada, tetapi renderer group gagal menampilkan field anak.** Ini bukan kasus “field belum dibuat”.

**Dampak**

- Tim SEO/marketing **tidak dapat mengisi meta title, meta description, focus keyword, OG image, canonical, noindex, dan tanda pembaruan substantif** di Artikel, Halaman, Layanan, Bidan, Area, maupun Landing Page.
- **Pengaturan Situs tidak bisa dikelola**: GTM, Meta Pixel, banner promo, teks homepage, jam operasional terstruktur, dan kota cakupan tidak dapat diubah dari UI.
- **Tautan internal artikel tidak bisa diatur** (group “Struktur Internal Linking & Topic Cluster” kosong).
- **Panduan Pusat Bantuan tidak lengkap** (group Do's & Don'ts kosong).
- Panel SEO live menampilkan instruksi seperti “Tentukan kata kunci target di kolom Kata Kunci Utama”, padahal kolom tersebut **tidak ada di UI**. Ini dead-end yang membuat pengguna mengira dirinya salah tempat.
- Tab yang kosong terlihat seperti loading/error, tanpa pesan apa pun.

**Rekomendasi**

1. Reproduksi di lokal dengan build bersih: `rm -rf .next`, `npm run generate:importmap`, `npm run build`, lalu buka form yang sama. Bandingkan dengan produksi.
2. Bandingkan versi deploy dengan commit repo; pastikan build produksi benar-benar memakai kode `fields/seoFields.ts` dan `globals/SiteSettings.ts` yang sekarang.
3. Periksa renderer `render-fields`/group pada kombinasi Payload 3.91 + React 19 + Next 15.4; jika ini bug library, pin/upgrade ke versi yang sudah diperbaiki.
4. Tambahkan **regression test** yang membuka tiap form dan memastikan field anak group benar-benar ada:
   - Artikel → `#field-seo` minimal berisi `metaTitle`, `metaDescription`, `focusKeyword`, `ogImage`.
   - Pengaturan Situs → `analytics`, `bannerGroup`, `homepage`, `structuredHours`.
   - Layanan, Halaman, Bidan, Area, Landing Page.
5. Sementara belum diperbaiki, **jangan tampilkan tab kosong**. Ganti dengan banner: “Bagian ini sedang tidak dapat dimuat. Data Anda aman; hubungi admin teknis.” Sembunyikan CTA yang mengarah ke sana.
6. Jangan melakukan migrasi/penulisan massal sebelum bug ini diperbaiki; data API masih utuh, tetapi UI tidak boleh dianggap sumber kebenaran.

**Effort:** M (diagnosis 1–3 hari; perbaikan bisa S jika akar masalahnya build/version).

---

### P0-02 — Visual Page Builder crash saat memilih seksi dengan media `null`

**Severity:** P0 — kehilangan pekerjaan / blocker builder  
**Area:** Visual Page Builder → Section Settings

**Bukti runtime**

Langkah: buka `/admin/collections/pages/4` → “Buka Visual Page Builder” → pilih seksi **“Banner Utama (Hero)”**.

Hasil:

```
Application error: a client-side exception has occurred while loading
admin.kalababyspa.com (see the browser console for more information).
```

Console:

```
TypeError: Cannot read properties of null (reading 'alt')
```

Stack mengarah ke chunk `561-…js`, yang dipicu oleh renderer media di `SectionSettings`.

**Penyebab di kode**

`apps/cms/src/components/admin/builder/SectionSettings.tsx:447-449`:

```ts
const hasMedia = value !== null && value !== undefined && value !== '';
const thumbUrl = typeof value === 'object' ? value?.url : ...;
const mediaDisplay = typeof value === 'object'
  ? value.alt || value.filename || `Media #${value.id}`
  : ...
```

`typeof null === 'object'`, sehingga saat `value === null`, ekspresi `value.alt` melempar `TypeError`. `hasMedia` sudah dihitung, tetapi tidak dipakai sebagai guard.

**Dampak**

- Builder **crash total**, bukan hanya satu field. Pengguna kehilangan konteks dan perubahan yang belum disimpan.
- Sangat mudah terpicu: hero image kosong, galeri kosong, atau media relationship apa pun yang `null`. Pada kondisi data saat audit, **Pustaka Media kosong**, sehingga hampir semua seksi bergambar berpotensi memicu crash.
- Tidak ada error boundary yang menangkap error ini; pengguna berakhir di layar error default Next.js berbahasa Inggris.

**Rekomendasi**

1. Guard eksplisit:
   ```ts
   const isMediaObject = value && typeof value === 'object';
   const mediaDisplay = isMediaObject
     ? value.alt || value.filename || `Media #${value.id}`
     : value ? `ID Media: ${value}` : '';
   ```
2. Bungkus `SectionSettings` dan area preview dengan **error boundary** yang menampilkan:
   - “Seksi ini gagal ditampilkan.”
   - tombol “Kembali ke daftar seksi”.
   - detail teknis yang bisa disalin.
3. Tambahkan unit test untuk `image: null`, `heroImage: null`, `images: []`, dan media yang hanya berupa ID string.
4. Tambahkan empty state media: “Belum ada gambar. Unggah atau pilih gambar.” Jangan render thumbnail yang mengasumsikan objek.
5. Audit semua akses `value.alt`, `value.filename`, `value.url` di `SectionSettings` dan `MediaPickerModal`.

**Effort:** S (guard) + S (error boundary) + S (test).

---

### P0-03 — Empat skor SEO berbeda untuk satu dokumen

**Severity:** P0 — integritas keputusan  
**Area:** Daftar Artikel, Panel SEO, Dashboard, API

**Bukti**

Untuk Artikel ID 3 (“Panduan Memilih Jasa Pijat Bayi Homecare…”):

| Sumber | Nilai yang terlihat | Keterangan |
|---|---:|---|
| Daftar Artikel | **0 / 100** + “Perlu diperbaiki” | Badge merah di tabel |
| REST API `/api/articles/3` | **80** | `seoScore: 80`, `seoAudit.score: 80` |
| Panel SEO live | **40 / 100** + “2 dari 7 pemeriksaan lolos” | Dihitung dari form state |
| Dashboard | **82 / 100** rata-rata + “Baik” | Rata-rata skor terbit |
| Progress dashboard | **8% / 11% / 11% / 4%** | Dari `seoAudit.metrics` |
| REST API `seoAudit.metrics` | **semua 0** | `titleScore`, `descScore`, `keywordScore`, `h1Score`, `altScore`, `slugScore`, `ogScore`, `contentScore`, `wordCount` |

Contoh lain: Artikel 1 = 91, Artikel 2 = 90 di API, tetapi daftar tetap menampilkan `0`.

**Kenapa ini terjadi (indikasi kode)**

- `SeoScoreCell` memprioritaskan `cellData`; field `seoScore` punya `defaultValue: 0` dan `admin.hidden: true`. Di daftar, nilai yang diterima cell tampaknya `0` (default), bukan nilai tersimpan 80/90/91.
- Dashboard memakai `seoAudit.metrics` yang tersimpan, tetapi metriknya semua `0` sementara `score` tersimpan 80+. Akibatnya skor total “Baik” tetapi semua progress bar merah hampir nol.
- Panel SEO menghitung skor **live** dari form state, yang tidak sama dengan skor tersimpan.
- Tidak ada label “live” vs “tersimpan”, tidak ada status “belum pernah diaudit”, dan `0` diperlakukan sebagai skor valid — padahal 0 bisa berarti “belum dihitung”.

**Dampak**

- Pengguna tidak tahu mana yang harus dipercaya. Bisa memicu pekerjaan SEO yang salah, atau sebaliknya mengabaikan masalah nyata.
- Dashboard “Kesehatan SEO 82/100 Baik” bertentangan langsung dengan panel “40/100 Perlu diperbaiki” dan daftar “0”.
- Rincian progress 8%/11%/11%/4% tidak masuk akal dibanding skor total 82.

**Rekomendasi**

1. Tetapkan **satu fungsi sumber kebenaran** untuk skor SEO (server-side), dipakai oleh daftar, panel, dashboard, dan API.
2. Bedakan tiga status secara eksplisit:
   - `null` / “Belum diaudit” — tampil “—” abu-abu.
   - `0–59` — “Perlu diperbaiki”.
   - `60–100` — “Cukup/Baik”.
3. Hapus `defaultValue: 0` pada `seoScore`, atau ubah tipe menjadi nullable; jangan pernah menampilkan `0` jika metrik belum pernah dihitung.
4. Jalankan backfill `npm run audit:backfill` dan pastikan `metrics` benar-benar terisi. Tambahkan test yang membandingkan `seoScore`, `seoAudit.score`, dan hasil kalkulasi live.
5. Di panel SEO, tampilkan dua label: **“Skor tersimpan”** dan **“Skor saat ini (live)”**, beserta penjelasan singkat. Jika berbeda, tampilkan “Belum disimpan”.
6. Perbaiki `SeoScoreCell` agar membaca nilai row yang benar (bukan default field) atau menghitung dari `seoAudit` yang tersedia.
7. Dashboard progress bar harus memakai metrik yang sudah tervalidasi; jika metrik kosong, tampilkan “Metrik belum tersedia”, bukan 8%.

**Effort:** M (1–2 hari) + backfill.

---

### P0-04 — Mode gelap membuat navigasi, dashboard, dan panel SEO tidak terbaca

**Severity:** P0 — aksesibilitas & keterbacaan  
**Area:** Sidebar, Dashboard, Panel SEO, breadcrumb

Pada kondisi audit, preferensi sistem adalah **gelap** dan admin memakai `data-theme="dark"`. Komponen kustom tetap memakai warna light-mode yang di-hardcode.

**Bukti kontras (WCAG)**

| Elemen | Warna teks | Latar | Rasio | Standar |
|---|---|---|---:|---:|
| Judul H1 “Dasbor” | `#0f172a` | `#141414` | **1,03:1** | 3:1 (large text) |
| Subjudul dashboard | `#475569` | `#141414` | **2,43:1** | 4,5:1 |
| Label grup sidebar | `#0f172a` | `#141414` | **1,03:1** | 4,5:1 |
| Link sidebar | `#334155` | `#141414` | **1,78:1** | 4,5:1 |
| Breadcrumb/step-nav | `#475569` | `#141414` | **2,43:1** | 4,5:1 |
| Deskripsi field | `#475569` | `#141414` | **2,43:1** | 4,5:1 |
| “Karakter Judul SEO:” | `#ffffff` | `#fffbeb` | **1,03:1** | 4,5:1 |
| “Karakter Deskripsi:” | `#ffffff` | `#fffbeb` | **1,03:1** | 4,5:1 |
| Link “Buka SOP” | `#0284c7` | `#f0f9ff` | **3,84:1** | 4,5:1 |
| Link “Lihat semua dokumen” | `#0284c7` | `#ffffff` | **4,09:1** | 4,5:1 |

Lighthouse juga menandai node-node ini secara eksplisit pada dashboard dan halaman edit artikel.

**Penyebab kode**

- `apps/cms/src/app/(payload)/custom.scss:12-62` memakai warna hardcoded (`#0f172a`, `#334155`, `#f8fafc`, `#f0f9ff`) dengan `!important`, tanpa override `[data-theme="dark"]`.
- `apps/cms/src/components/admin/CustomDashboard.tsx` memiliki **35** deklarasi warna light-mode hardcoded (putih, slate, amber, emerald).
- `apps/cms/src/components/admin/SeoPanelField.tsx` memiliki **8** warna hardcoded serupa; label counter tidak diberi warna sehingga mewarisi teks putih dari tema gelap, sementara latarnya tetap `#fffbeb`.
- Tidak ada `prefers-color-scheme` atau `[data-theme='dark']` di komponen kustom.

**Dampak**

- Pengguna dengan mode gelap (atau preferensi “Otomatis” + OS gelap) melihat sidebar dan judul dashboard seperti teks hilang.
- Panel SEO menampilkan label counter yang tidak terbaca.
- Ini kegagalan WCAG 1.4.3 dan bisa membuat admin tidak bisa bernavigasi.

**Rekomendasi**

1. Ganti semua warna hardcoded di komponen kustom dengan token tema:
   - `var(--theme-text)`, `var(--theme-elevation-*)`, `var(--theme-success-*)`.
   - Untuk latar kartu: `var(--theme-elevation-0)` / `var(--theme-elevation-50)`.
2. Tambahkan override khusus:
   ```scss
   [data-theme='dark'] {
     .nav-group__label { color: var(--theme-elevation-1000); }
     .nav__link-label { color: var(--theme-elevation-800); }
     .kala-dashboard { ... }
   }
   ```
3. Hapus `!important` yang tidak perlu; biarkan tema Payload bekerja.
4. Untuk label SEO counter, set `color: #475569` (atau token) secara eksplisit; jangan mewarisi.
5. Tambahkan uji kontras otomatis (axe/Lighthouse) untuk **kedua tema** di CI.
6. Uji ulang minimal: dashboard, sidebar, Artikel edit (tab SEO), Pengaturan Situs, Builder.

**Effort:** M (1–2 hari) untuk semua komponen; S untuk nav saja.

---

## 4. Temuan Penting (P1)

### P1-01 — Tabel daftar meluber; kolom status/aksi tidak dapat dijangkau

**Severity:** P1  
**Layar:** Semua Halaman, Testimoni, kemungkinan Layanan/Bidan/Area pada lebar tertentu.

**Bukti**

| Layar | Viewport | Lebar tabel | `scrollWidth` dokumen | Kondisi |
|---|---:|---:|---:|---|
| Semua Halaman | 1.296 px | **1.377 px** | **1.437 px** | Melebihi viewport |
| Testimoni Bunda | 1.296 px | **1.802 px** | **1.862 px** | Melebihi viewport 566 px |
| Artikel Edukasi | 1.296 px | muat | 1.296 px | Tidak meluber |

Computed:

```
.table { overflow-x: visible; }
body { overflow-x: hidden; }
```

Akibatnya tabel yang lebih lebar dari layar **terpotong**, dan karena `body` menyembunyikan overflow, pengguna tidak bisa scroll horizontal untuk mencapai kolom kanan (Status, Urutan Tampil, aksi).

**Penyebab**

- Tidak ada wrapper `overflow-x: auto` pada tabel.
- Header kolom sangat panjang, misalnya:
  - “Sudah Memperoleh Izin Publikasi Resmi dari Pasien (Etika Medis)”
  - “Tandai sebagai Paket Unggulan / Rekomendasi Utama”
  - “Pilihan Tata Letak Halaman (Layout)”
  - “Slug URL (kalababyspa.com/[slug])”
- Nilai sel panjang (misalnya “Kanvas Bersih (100% Kosong tanpa navigasi & footer — cocok untuk penawaran iklan)”) memaksa lebar kolom.
- Baris pages bisa setinggi **104 px** karena wrapping.

**Rekomendasi**

1. Bungkus tabel dalam `.table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }`.
2. Set `min-width` tabel dan `white-space: nowrap` hanya pada kolom pendek; biarkan kolom panjang wrap.
3. Ringkas header:
   - “Izin Publikasi Pasien”
   - “Paket Unggulan”
   - “Tata Letak”
   - “Slug”
4. Default columns lebih sedikit; pindahkan detail ke halaman edit.
5. Buat mode kartu untuk <768 px, atau tampilkan 3–4 kolom prioritas.
6. Sticky kolom judul dan status.
7. Tambahkan test visual pada 1024, 1280, 1366, dan 1440 px.

**Effort:** S–M.

---

### P1-02 — Dashboard tidak dapat dipercaya: tautan mati, CTA tidak cocok, status “Live” tanpa verifikasi

**Severity:** P1  
**Area:** Dashboard

**Temuan per elemen**

| Elemen | Masalah | Bukti |
|---|---|---|
| “Lihat Draf →” | Menampilkan **6 dokumen draf** (artikel + halaman + landing legacy), tetapi tautan hanya memfilter **artikel** dan menampilkan **1** baris | `CustomDashboard.tsx:719` → `/admin/collections/articles?where[_status][equals]=draft` |
| “Lihat semua 4 isu SEO selengkapnya →” | Mengarah ke semua artikel, tanpa filter skor/isu | `CustomDashboard.tsx:958` → `/admin/collections/articles` |
| “Lihat semua dokumen →” | Hanya mengarah ke **Pages**; artikel tidak termasuk | `CustomDashboard.tsx:1204` → `/admin/collections/pages` |
| Aktivitas terakhir | Menautkan ke `/admin/collections/landing-pages/3` dan `/2`, tetapi koleksi disembunyikan dan URL menghasilkan **404** | `CustomDashboard.tsx:1308` memakai `doc._collSlug` |
| “Situs Live & Sinkron” | Ditampilkan setiap kali status bukan failed/building; tidak ada verifikasi Cloudflare karena env tidak punya API token | `CustomDashboard.tsx:757`; `fetchRealCloudflareDeployStatus` mengembalikan `null` jika token tidak ada |
| “Situs Aktif & Tayang (5 Nov, 02.39)” | Timestamp fallback berasal dari `updatedAt` dokumen, bukan waktu deploy | `CustomDashboard.tsx:299-306` |
| Daftar “Perlu perhatian SEO” | Dua item berjudul “Tanpa Judul” (artikel & halaman) tampil tanpa jenis koleksi, sehingga tidak bisa dibedakan | Runtime |
| Semua tombol “Perbaiki” | Nama aksesibel identik; screen reader tidak tahu item mana | Runtime + Lighthouse |

**Dampak**

- Pengguna mengira sudah melihat semua draf, padahal hanya 1 dari 6.
- Klik dari dashboard bisa berakhir di 404.
- Klaim “Live & Sinkron” menimbulkan rasa aman palsu saat konten belum ter-deploy.
- “Lihat semua dokumen” tidak sesuai janji.

**Rekomendasi**

1. Buat **satu halaman “Semua Konten”** yang menggabungkan artikel, halaman, dan landing page, dengan filter jenis + status.
2. Atau ubah label menjadi eksplisit: “Lihat draf artikel (1)”.
3. Jangan pernah menautkan ke koleksi `hidden`; migrasikan atau tampilkan landing legacy sebagai bagian Pages.
4. Untuk isu SEO, tambahkan filter `seoScore < 80` atau buat halaman laporan SEO.
5. Tambahkan `aria-label` unik pada tombol “Perbaiki” (`Perbaiki SEO: <judul>`).
6. Tampilkan jenis koleksi pada item “Tanpa Judul” (badge “Artikel”/“Halaman”).
7. Jika tidak ada Cloudflare API token, tampilkan “Status deploy tidak terverifikasi” alih-alih “Live & Sinkron”.
8. Tampilkan timestamp deploy terakhir yang nyata, atau label “Konten terakhir diubah”.

**Effort:** S untuk label/link; M untuk halaman konten terpadu.

---

### P1-03 — Enam koleksi inti kosong, empty state ambigu, dan dashboard tetap mengklaim sinkron

**Severity:** P1 — kesiapan konten  
**Area:** Media, FAQ, Bidan, Area, Template Halaman, Riwayat Deploy

**Matriks data saat audit**

| Koleksi | Jumlah | Catatan |
|---|---:|---|
| Artikel | 4 | 3 terbit, 1 draf “Tanpa Judul” |
| Halaman | 3 | 1 terbit, 2 draf |
| Layanan | 3 | — |
| Testimoni | 3 | — |
| Pengalihan URL | 1 | — |
| Pusat Bantuan | 3 | — |
| Template Blok | 2 | — |
| Pengguna | 3 | — |
| Landing Page legacy | 3 | Disembunyikan dari sidebar |
| **Media** | **0** | Pustaka kosong |
| **FAQ** | **0** | Kosong |
| **Bidan** | **0** | Kosong |
| **Area Jangkauan** | **0** | Kosong |
| **Template Halaman** | **0** | Kosong |
| **Riwayat Deploy** | **0** | Kosong |

**Empty state yang muncul (sama di semua koleksi kosong):**

> “Tidak Ada Hasil.  
> Baik tidak ada yang ada atau tidak ada yang cocok dengan filter yang telah Anda tentukan di atas.”

Copy ini secara eksplisit mengakui bahwa sistem **tidak tahu** apakah data kosong atau filter tidak cocok. Tidak ada tombol reset filter, tidak ada panduan setup, dan tidak ada perbedaan antara “belum ada data” dan “tidak ada hasil”.

**Dampak**

- Media kosong memicu crash builder (lihat P0-02).
- FAQ/Bidan/Area kosong berarti konten publik mungkin memakai fallback hardcoded, sementara CMS tampak “sudah jalan”.
- Template Halaman kosong bertentangan dengan tawaran “Template Halaman Siap Pakai” di builder.
- Riwayat Deploy kosong bertentangan dengan klaim “Situs Live & Sinkron”.
- Pengguna baru tidak tahu apa yang harus dilakukan pertama.

**Rekomendasi**

1. Empty state spesifik per koleksi:
   - Media: “Belum ada foto. Unggah foto pertama Anda.” + tombol utama.
   - FAQ: “Belum ada pertanyaan. Tambahkan FAQ pertama agar tampil di website.”
   - Bidan: “Belum ada profil bidan. Tambahkan data bidan ber-STR.”
2. Jika filter aktif, tampilkan “Tidak ada hasil untuk filter ini” + tombol **Reset filter**.
3. Tambahkan **checklist kesiapan konten** di dashboard: Media, FAQ, Bidan, Area, Halaman, Deploy.
4. Jalankan seed/migrasi untuk data minimum produksi sebelum menyatakan CMS siap.
5. Jangan tampilkan “Live & Sinkron” jika koleksi kunci kosong dan belum pernah ada deploy.

**Effort:** S untuk copy; M untuk seed/checklist.

---

### P1-04 — Tanggal, angka, boolean, dan placeholder belum dilokalisasi

**Severity:** P1 — kualitas microcopy & kepercayaan  
**Area:** Hampir semua daftar dan halaman edit

**Contoh nyata**

| Konteks | Teks yang tampil | Seharusnya |
|---|---|---|
| Tanggal dokumen | `Oktober ke-24 2026, 7:39 AM` | `24 Oktober 2026, 07.39` |
| Tanggal dokumen | `November ke-5 2026, 9:29 AM` | `5 November 2026, 09.29` |
| Dashboard | `5 Nov, 02.39` | Konsisten 24 jam: `5 Nov 2026, 02.39` |
| Judul kosong | `<Tidak ada Judul Halaman>` | `Tanpa Judul` atau `—` |
| Slug kosong | `<Tidak ada Slug URL (kalababyspa.com/[slug])>` | `Belum diisi` |
| Relasi kosong | `<Tidak ada ID Referensi Eksternal (Bot / Booking ID)>` | `—` |
| Durasi kosong | `<Tidak ada Durasi Tindakan (Menit)>` | `—` |
| Boolean | `benar` / `salah` | `Ya` / `Tidak` atau ikon centang |
| Harga | `100000` | `Rp100.000` |
| Tanggal versi | `Memuat...` (flash) | Skeleton atau tanggal server-rendered |

`html lang="id"` sudah benar, `dateFNSKey: "id"` juga ada, tetapi format tanggal memakai token yang salah untuk locale Indonesia (mis. `do` menjadi “ke-24”, `a` menjadi “AM”).

**Rekomendasi**

1. Set format tanggal admin secara eksplisit, misalnya `d MMMM yyyy, HH.mm` dengan locale `id-ID`.
2. Ganti `noLabel`/`noResults`/`untitled`/boolean di `payload.config.ts` → `i18n.translations.id`.
3. Format angka uang di cell `numericPrice` dengan `Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 })`.
4. Ganti boolean text dengan badge “Aktif/Nonaktif” atau ikon centang + teks.
5. Tambahkan test snapshot untuk tanggal, harga, dan empty state.

**Effort:** S.

---

### P1-05 — Baseline aksesibilitas belum memadai

**Severity:** P1  
**Area:** Dashboard, form edit, login

**Hasil Lighthouse**

| Layar | Accessibility | Temuan |
|---|---:|---|
| Dashboard | **92** | `color-contrast`, `heading-order`, `landmark-one-main`, `meta-description` |
| Edit Artikel | **77** | `aria-hidden-focus`, `button-name`, `color-contrast`, `heading-order`, `label-content-name-mismatch`, `label`, `list` |
| Login | **98** | `landmark-one-main`, `meta-description` |

**Temuan konkret**

- **Tidak ada `<main>`** di dashboard dan login. Pengguna screen reader tidak punya landmark utama.
- **Heading melompat**: dashboard `H1` → `H3` (kartu aksi) → `H2`; edit artikel `H1` → `H3` (group). Lighthouse menandai `heading-order`.
- **Tombol tanpa nama aksesibel**:
  - tombol split “Terbitkan” (popup arrow);
  - tombol kebab di dokumen;
  - tombol tutup katalog seksi;
  - tombol tutup pemilih media;
  - tombol ikon di Section Settings (hanya `title`, bukan `aria-label`).
- **`aria-hidden="true"` pada elemen fokusable** di komponen select (clear indicator & dropdown).
- **Form field tanpa label**: combobox relasi (mis. “Pilih Bidan Penulis”) tidak punya `<label>` eksplisit.
- **Label-content-name mismatch**: tab “Versi” ikon-only.
- **Struktur list tidak valid**: `<ul class="doc-tabs__tabs">` berisi `<div>`/`<a>` langsung.
- **Tab SEO tidak punya `role="tab"`, `aria-selected`, `aria-controls`.** Tab bar hanya `<button>` dengan class aktif.
- **Emoji dekoratif** (✍️, 📄, 🟡, 🔴) tidak diberi `aria-hidden`, sehingga dibacakan screen reader.

**Rekomendasi**

1. Tambahkan `<main id="main">` di dashboard/login; sediakan skip link “Lewati ke konten”.
2. Rapikan hierarki heading: `H1` halaman → `H2` seksi → `H3` kartu. Jangan pakai `H3` untuk kartu sebelum ada `H2`.
3. Beri `aria-label` pada semua tombol ikon; `title` saja tidak cukup.
4. Gunakan `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, dan navigasi panah pada tab Artikel/Halaman.
5. Tambahkan `<label htmlFor>` atau `aria-label` pada semua combobox relasi.
6. Hapus `tabindex` dari elemen `aria-hidden` atau sembunyikan dengan benar.
7. Tandai emoji dekoratif dengan `aria-hidden="true"`.
8. Jalankan `axe`/Lighthouse di CI; target minimal 95 untuk dashboard, form, dan login.

**Effort:** M (2–4 hari).

---

### P1-06 — Target sentuh dan ukuran teks terlalu kecil untuk operator

**Severity:** P1  
**Area:** Sidebar, tabel, builder, section settings, media picker

**Target sentuh yang terukur**

| Elemen | Ukuran |
|---|---:|
| Hamburger “Buka Menu” | 22 × 22 px |
| Akun di header | 25 × 25 px |
| Keluar | 18 × 21 px |
| Aksi seksi builder (geser/sembunyi/duplikat/hapus) | 19 × 20 s.d. 22 × 23 px |
| Aksi item di Section Settings | 20 × 27 px |
| Link “Per Halaman: 10” | tinggi 20 px |
| Link baris tabel | tinggi 17–20 px |
| Checkbox “Tampilkan di Perangkat” | 13 × 13 px |
| Tombol builder | 30–32 px |

WCAG 2.2 AA mensyaratkan target minimal **24 × 24 px**; praktik baik untuk admin adalah **36–44 px** untuk aksi utama. Banyak kontrol berada di bawah 24 px.

**Ukuran teks**

| Area | Ukuran yang teramati | Catatan |
|---|---|---|
| Label grup sidebar | 9,36–10,14 px | Terlalu kecil |
| Link sidebar | 10,5–11,375 px | Terlalu kecil |
| Dashboard | 9 node 11 px, 36 node 12 px, 27 node 13 px dari 96 node | Dominan 11–13 px |
| Section Settings | 14 node 9,75 px; 14 node 11 px | Teks utama panel 9,75–11 px |
| Deskripsi field | 10,56 px | Di bawah 12 px |
| SEO checklist | 11–13 px | Sulit dibaca |
| Empty state builder | 11–12 px | — |

Untuk pengguna bidan/operator di laptop 14", 9,75–11 px adalah **terlalu kecil** dan memicu zoom.

**Rekomendasi**

1. Skala tipografi minimal: 12 px metadata, 14 px body, 16 px judul kartu, 28–32 px H1.
2. Naikkan target aksi minimal 28–32 px; aksi utama 36–44 px.
3. Jangan gunakan `text-[10px]`/`text-[11px]` untuk teks yang harus dibaca; simpan untuk badge.
4. Uji di zoom 125% dan 150%.
5. Tambahkan `:focus-visible` yang jelas (outline 2 px + offset).

**Effort:** S–M.

---

### P1-07 — Micro-UX Visual Builder: konsep bagus, eksekusi belum nyaman

**Severity:** P1  
**Area:** Builder, katalog seksi, section settings, media picker

**Temuan**

| Temuan | Bukti |
|---|---|
| Katalog seksi tidak punya kolom pencarian, padahal ada 29 blok dalam 9 kategori | `AddSectionMenu.tsx`; runtime “Koleksi Blok (29)” tanpa input search |
| Modal katalog tidak punya `role="dialog"`, `aria-modal`, atau focus trap | `AddSectionMenu.tsx:136` hanya `<div className="fixed inset-0 ...">` |
| Tombol tutup katalog tanpa nama aksesibel | `AddSectionMenu.tsx:146-152` hanya ikon `<X>` |
| Fokus tetap di “Simpan draf” di belakang saat katalog terbuka | Runtime `document.activeElement` |
| Nama blok di template masih mentah (`hero`, `painPoints`, `solutions`, `pricing`, `testimonials`, `faq`, `cta`) | Runtime tab “Template Halaman Siap Pakai” |
| Hapus seksi memakai `confirm()` native dengan `blockType` teknis: “Hapus seksi heroBlock?” | `SectionTree.tsx:109` |
| Label seksi menampilkan `STEPS`, `PENGATURAN SEKSI`, `DAFTAR LANGKAH`, `PENGATURAN BLOK`, `Off` | Runtime; `SectionSettings` |
| Panel pengaturan 9,75–11 px dan tombol 20–27 px | Runtime + kode |
| Media picker tidak punya `role="dialog"`/focus trap; tombol tutup tanpa label | `MediaPickerModal.tsx:99-113` |
| Media picker mengisi `alt` otomatis dari nama file: `formData.append('alt', file.name.replace(...))` | `MediaPickerModal.tsx:69-71` |
| Media picker tidak punya filter folder/tag; pencarian hanya `alt` dan hanya saat Enter | `MediaPickerModal.tsx:42-44, 120-127` |
| Pesan “Tidak ada autosave” bertentangan dengan autosave 1.500 ms di koleksi Pages/Articles | `PreviewFrame.tsx:264` vs `Pages.ts:91-99` |
| Builder selalu bertema gelap, mengabaikan preferensi tema pengguna | `BuilderField.tsx:274` |
| Error builder tidak tertangkap error boundary | Runtime crash P0-02 |
| Validasi menyebut `blockType` teknis: “Seksi 2 · heroBlock” | `BuilderValidationBanner.tsx:72-74` |
| Preview “Menghubungkan ke pratinjau…” tanpa timeout/error state | `PreviewFrame.tsx:294-298` |

**Yang sudah baik**

- Builder punya `role="dialog"`, `aria-modal`, `aria-label`, focus trap.
- Ada Undo/Redo, shortcut Ctrl+S/Ctrl+Z, indikator “Belum disimpan”, “Tersimpan HH.mm”.
- Ada peringatan layar sempit.
- Preview memuat iframe nyata dan banner “PRATINJAU DRAFT HALAMAN”.
- Konfirmasi tutup builder jelas dan punya tiga pilihan.

**Rekomendasi**

1. Tambahkan search + filter kategori di katalog blok.
2. Jadikan katalog dan media picker dialog sungguhan: `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, Escape, dan kembalikan fokus ke pemicu.
3. Beri `aria-label` pada semua tombol ikon.
4. Ganti `confirm()` dengan modal konfirmasi yang menyebut **label seksi**, bukan `blockType`.
5. Ganti label `STEPS`/`Off`/`PENGATURAN SEKSI` dengan istilah Indonesia yang konsisten.
6. Saat upload dari picker, minta alt text (atau arahkan ke form media), jangan memakai nama file.
7. Tambahkan pencarian/filter folder dan tag.
8. Selaraskan pesan autosave dengan perilaku sebenarnya.
9. Tambahkan error boundary per seksi.
10. Naikkan ukuran teks/tombol panel pengaturan.

**Effort:** M.

---

### P1-08 — Dua mode authoring halaman membingungkan; sumber kebenaran tidak jelas

**Severity:** P1  
**Area:** Edit Halaman

Halaman edit menampilkan **sekaligus**:

1. “Isi Dokumen / Konten Teks Bebas” (rich text)
2. “Mode Editor Halaman” (Builder Visual / Formulir Blok Klasik)
3. “Builder Visual Halaman” card + tombol
4. “Susunan Blok Halaman” (hanya saat mode `form`)

Deskripsi kecil menyatakan: “Jika blok di bawah diisi, susunan blok akan diprioritaskan.” Ini berarti rich text bisa **diabaikan tanpa peringatan** ketika layout berisi blok.

**Dampak**

- Pengguna dapat menulis panjang di rich text, menyimpan, dan heran karena website tidak berubah.
- “Mode Editor” terlihat seperti pilihan eksklusif, tetapi kedua editor tetap tampil.
- Tidak ada indikator “Sumber konten yang dipakai: Builder” atau “Rich text diabaikan”.

**Rekomendasi**

1. Tampilkan hanya satu editor sesuai `editorMode`; sembunyikan yang lain sepenuhnya.
2. Jika keduanya harus ada, tampilkan banner status: “Halaman ini memakai 12 blok builder. Rich text tidak akan ditampilkan.”
3. Pindahkan pilihan mode ke paling atas, sebelum field konten.
4. Saat beralih mode, tampilkan konfirmasi dan jelaskan konsekuensinya.

**Effort:** S–M.

---

### P1-09 — Column picker membocorkan field audit internal dan memperparah tabel

**Severity:** P1  
**Area:** Daftar Artikel/Halaman → “Kolom”

Saat membuka “Kolom”, daftar berisi puluhan field internal:

- Hasil Audit SEO Otomatis > Skor Numerik (0 - 100)
- Hasil Audit SEO Otomatis > Tingkat Kesehatan SEO
- Hasil Audit SEO Otomatis > Daftar Masalah yang Terdeteksi
- Hasil Audit SEO Otomatis > Versi Mesin Audit
- Rincian Metrik Audit > Title Score, Desc Score, Keyword Score, H1 Score, Alt Score, Slug Score, Og Score, Content Score, Word Count
- Terakhir Diaudit
- Dibuat Pada / Dihapus Pada

**Dampak**

- Pengguna non-teknis dapat menambahkan kolom “Word Count”/“Og Score” yang tidak berguna ke tabel.
- Label campur Indonesia–Inggris.
- Menambah kolom memperparah overflow (P1-01).
- Menunjukkan internal model data yang seharusnya tidak perlu dilihat operator.

**Rekomendasi**

1. Sembunyikan field audit dari column picker (`admin.hidden` atau `disableBulkEdit` + `admin.components`).
2. Kelompokkan pilihan kolom dengan pencarian jika tetap banyak.
3. Gunakan label Indonesia yang ramah jika memang perlu ditampilkan.
4. Batasi maksimal kolom default.

**Effort:** S.

---

### P1-10 — Media: pustaka kosong, alt otomatis tidak bermakna, dan tidak ada alur perbaikan

**Severity:** P1  
**Area:** Media & Media Picker

**Temuan**

- Pustaka Media **0 item**.
- `Media.alt` wajib, tetapi upload dari builder mengisi alt dengan **nama file tanpa ekstensi**:
  ```ts
  formData.append('alt', file.name.replace(/\.[^/.]+$/, ''))
  ```
  Contoh: `hero-banner-2` bukan deskripsi gambar. Ini memenuhi validasi tetapi melanggar tujuan aksesibilitas.
- Setelah upload dari builder, tidak ada langkah untuk mengedit alt/caption/folder/tag.
- Pencarian media hanya berdasarkan `alt`, bukan filename/tag/folder.
- Folder dan tag ada di form media, tetapi tidak muncul sebagai filter di picker.
- Wajib alt pada artikel (`heroImageAlt`) meskipun `heroImage` opsional; pengguna bisa diminta mengisi alt untuk gambar yang tidak ada.

**Rekomendasi**

1. Setelah upload dari picker, tampilkan form mini: Alt Text (wajib), Caption, Folder, Tag.
2. Jangan gunakan nama file sebagai alt; gunakan placeholder “Deskripsikan gambar…” dan blokir simpan sampai diisi.
3. Tambahkan filter folder/tag dan pencarian multi-field.
4. Untuk `heroImageAlt`, gunakan `admin.condition` agar hanya wajib saat `heroImage` terisi.
5. Isi pustaka dengan aset awal/migrasi.

**Effort:** S–M.

---

### P1-11 — Login dan akun: aman secara dasar, tetapi kurang ramah

**Severity:** P1/P2  
**Area:** Login, Lupa Kata Sandi, Akun

**Temuan**

| Temuan | Bukti |
|---|---|
| Password memakai `autocomplete="off"` | Runtime: `#field-password` |
| Tidak ada tombol lihat/sembunyikan password | Runtime |
| `required=false` pada password meski label bertanda `*` | Runtime |
| Tidak ada “Tetap masuk” / remember me meski token 2 jam | Konfigurasi auth |
| Tema login selalu terang (`data-theme="light"`) meski OS gelap | Runtime |
| Akun tidak menampilkan login terakhir, sesi aktif, atau 2FA | Runtime `/admin/account` |
| “Paksa Buka Kunci” selalu tampil tanpa indikator status terkunci | Runtime |
| API key dapat dibuat oleh pengguna; tidak ada penjelasan risiko di UI | Runtime |

**Rekomendasi**

1. `autocomplete="current-password"` pada login; `new-password` pada reset.
2. Tambahkan tombol show/hide password.
3. Set `required` pada password.
4. Selaraskan tema login dengan preferensi tema.
5. Tambahkan “Tetap masuk” atau perpanjang sesi untuk admin operasional.
6. Tampilkan login terakhir dan sesi aktif; pertimbangkan 2FA.
7. Jelaskan risiko API key sebelum generate.

**Effort:** S–M.

---

### P1-12 — Navigasi & IA: tidak ada Dasbor di sidebar, tidak ada pencarian global, legacy masih hidup

**Severity:** P1/P2  
**Area:** Sidebar & header

- Tidak ada item “Dasbor” di sidebar.
- Tidak ada pencarian global (hanya pencarian per koleksi).
- Ikon rumah di header sangat kecil dan hanya punya `title="Dasbor"`.
- Koleksi `landing-pages` disembunyikan tetapi datanya ditautkan dari dashboard.
- “Template Halaman” kosong; builder memakai template hardcoded.
- “Riwayat Deploy” di kelompok Pengaturan.
- Tidak ada indikator jumlah item/draf di sidebar.
- Tidak ada “quick create” global; hanya dari dashboard.

**Rekomendasi**

1. Tambahkan “Dasbor” sebagai item pertama sidebar.
2. Tambahkan command palette/global search (Ctrl+K) untuk mencari dokumen, koleksi, dan aksi.
3. Tampilkan badge jumlah draf/isu di item nav.
4. Satukan atau hapus legacy landing page.
5. Pindahkan “Riwayat Deploy” ke kelompok Website atau dekat status publikasi.
6. Tambahkan “Buat Baru” global.

**Effort:** M.

---

### P1-13 — Loading, error, dan feedback state belum konsisten

**Severity:** P1/P2

- Tanggal di tabel menampilkan `Memuat...` saat hidrasi, lalu berubah; tidak ada skeleton.
- Builder crash menampilkan layar error default Next.js berbahasa Inggris.
- Preview builder punya loading spinner, tetapi tidak ada timeout.
- Tidak ada error state untuk group kosong (hanya blank).
- `lastSavedAt` ada di builder, tetapi status autosave di form utama tidak terlihat jelas.
- Empty state tidak membedakan “belum ada data” vs “filter tidak cocok”.

**Rekomendasi**

1. Skeleton untuk sel tanggal/skor, bukan teks “Memuat…”.
2. Error boundary dengan pesan Indonesia + tombol pulih.
3. Empty state kontekstual.
4. Toast yang konsisten untuk simpan/terbit/gagal.
5. Indikator autosave di header form.

**Effort:** S–M.

---

### P1-14 — Responsif: tablet/mobile belum dirancang untuk tugas admin

**Severity:** P1/P2  
**Area:** Semua layar

**Teramati pada 1.000 px**

- Sidebar menjadi off-canvas; tombol “Buka Menu” hanya 22 px.
- Tidak ada item Dasbor di menu.
- Beberapa menu masih memakai font 10,5 px.
- Tabel kemungkinan besar meluber (lihat P1-01).

**Builder**

- Ada peringatan layar sempit: “Disarankan memakai laptop/desktop…” — ini **baik**.
- Namun layout sidebar 360 px + preview di bawah pada layar kecil bisa membuat preview tidak nyaman.

**Rekomendasi**

1. Uji 375, 390, 768, 1024, 1280, 1440 px.
2. Tabel → kartu pada <768 px.
3. Tombol mobile minimal 44 px.
4. Sidebar mobile dengan fokus terperangkap dan tombol tutup 44 px.
5. Form satu kolom dengan label di atas.

**Effort:** M.

---

## 5. Temuan Mikro (P2) — Tabel Lengkap

| ID | Area | Temuan | Rekomendasi |
|---|---|---|---|
| M-01 | Daftar Halaman | Tab “Semua Semua Halaman” duplikat | “Semua Halaman” |
| M-02 | Daftar kosong | “Tidak Ada Hasil. Baik tidak ada yang ada atau tidak ada yang cocok…” | Empty state spesifik + reset filter |
| M-03 | Media | “Buat Media baru” kapitalisasi tidak konsisten | “Buat Media Baru” |
| M-04 | Media | Label “Kategori Folder Media (MED-005)” membocorkan kode tiket | “Kategori Folder” |
| M-05 | Media | Label “Tag / Kata Kunci Pencarian (MED-005)” | “Tag Pencarian” |
| M-06 | Media | Pencarian hanya alt; folder/tag tidak bisa difilter | Filter multi-field |
| M-07 | Media | Upload builder mengisi alt dari nama file | Minta alt manual |
| M-08 | Testimoni | “ID Referensi Eksternal (Bot / Booking ID)” + deskripsi “webhook/idempotency” | “ID Booking” + penjelasan awam |
| M-09 | Testimoni | Kolom “Sudah Memperoleh Izin Publikasi Resmi dari Pasien (Etika Medis)” sangat panjang | “Izin Publikasi” + tooltip |
| M-10 | Semua tabel | Boolean tampil “benar/salah” | Badge “Ya/Tidak” |
| M-11 | Layanan | Harga tampil `100000` | `Rp100.000` |
| M-12 | Layanan | Placeholder `<Tidak ada Durasi Tindakan (Menit)>` | `—` |
| M-13 | Layanan | “Isian ini tidak memiliki Included Items” | “Belum ada rincian. Tambah item.” |
| M-14 | Layanan | “Tambah Included Item” campur bahasa | “Tambah Rincian” |
| M-15 | Artikel | “Tanggal Terbit” tampil “Oktober ke-24 2026, 7:39 AM” | Format `id-ID` 24 jam |
| M-16 | Artikel | `heroImageAlt` wajib meski `heroImage` opsional | `admin.condition` |
| M-17 | Artikel | Tombol pada dokumen terbit tetap “Terbitkan” | “Terbitkan Perubahan” |
| M-18 | Artikel | Tab SEO kosong | Perbaiki render + error state |
| M-19 | Artikel | Tab “Tautan Internal” kosong | Perbaiki render |
| M-20 | Artikel | “Tautan Internal” dan “Optimasi SEO” tanpa `role=tab` | ARIA tabs |
| M-21 | Edit dokumen | “Versi” dan “API” adalah fitur teknis di header | Sembunyikan di balik menu “Lainnya” |
| M-22 | Dashboard | “Perlu Review / Draft” campur bahasa | “Perlu Ditinjau / Draf” |
| M-23 | Dashboard | Dua item “Tanpa Judul” tanpa jenis koleksi | Badge jenis |
| M-24 | Dashboard | Semua tautan “Perbaiki” tanpa konteks | `aria-label` unik |
| M-25 | Dashboard | “Lihat semua dokumen” hanya Pages | “Lihat semua halaman” atau halaman terpadu |
| M-26 | Dashboard | “Situs Live & Sinkron” tanpa verifikasi | “Status deploy tidak terverifikasi” |
| M-27 | Dashboard | Persentase SEO 8/11/11/4 dengan skor 82 | Perbaiki metrik |
| M-28 | Dashboard | Angka 82 berukuran 44 px, teks kecil 11 px | Skala ulang |
| M-29 | Sidebar | Label grup 9,36–10,14 px | Minimal 12 px |
| M-30 | Sidebar | Grup toggle `tabindex="-1"` | Dapat difokus keyboard |
| M-31 | Sidebar | Tidak ada item Dasbor | Tambahkan |
| M-32 | Header | “Akun” 25 px, “Keluar” 18 px | 32–44 px |
| M-33 | Login | Password `autocomplete=off`, tanpa show/hide | Perbaiki |
| M-34 | Login | Tema terang saat OS gelap | Konsisten |
| M-35 | Builder | “Hapus seksi heroBlock?” | Label ramah |
| M-36 | Builder | Template menampilkan `hero`, `painPoints`, `faq` | Label Indonesia |
| M-37 | Builder | “Off” badge | “Nonaktif” |
| M-38 | Builder | “STEPS” dan “PENGATURAN SEKSI” | “Langkah” dan “Pengaturan Seksi” |
| M-39 | Builder | “Tidak ada autosave” bertentangan dengan autosave | Selaraskan |
| M-40 | Builder | `confirm()` native | Modal kustom |
| M-41 | Builder | Katalog tanpa pencarian | Tambahkan |
| M-42 | Builder | Panel settings 9,75 px | Minimal 12–13 px |
| M-43 | Builder | Tombol aksi 20–23 px | 28–32 px |
| M-44 | Builder | Media picker tanpa `role=dialog` | Perbaiki |
| M-45 | Builder | Media picker close tanpa `aria-label` | Perbaiki |
| M-46 | Builder | Preview spinner tanpa timeout | Tambahkan batas waktu |
| M-47 | Builder | Builder selalu gelap | Hormati tema |
| M-48 | Pengaturan Situs | Group analytics/banner/homepage kosong | Perbaiki render |
| M-49 | Pengaturan Situs | Direct field “Nomor WhatsApp” tampil, group jam kosong | Perbaiki group |
| M-50 | Help Center | Group Do's & Don'ts kosong | Perbaiki render |
| M-51 | Users | Role bot “Admin Operasional” padahal bot | Role “Agen Otomasi” |
| M-52 | Users | Label role sangat panjang di tabel | Ringkas |
| M-53 | Account | “Paksa Buka Kunci” tanpa status | Tampilkan hanya jika terkunci |
| M-54 | Account | Tidak ada login terakhir/2FA | Tambahkan |
| M-55 | Deployments | “Buat Riwayat Deploy baru” manual | Hapus/ubah |
| M-56 | 404 legacy | Judul “Mengedit - Landing Page Iklan” tetapi isi 404 | Redirect/404 konsisten |
| M-57 | Tanggal | “Memuat...” berkedip | Skeleton |
| M-58 | Tabel | Kolom “Per Halaman: 10” 20 px | 32 px |
| M-59 | Tabel | Header teknis “Slug URL (kalababyspa.com/[slug])” | “Slug” |
| M-60 | Form | Deskripsi field 10,56 px | 12–13 px |
| M-61 | Form | Tidak ada indikator sumber konten (builder vs rich text) | Banner status |
| M-62 | Form | Tabs tanpa indikator error per tab | Badge error |
| M-63 | Form | Required asterisk bagus, tetapi tidak ada ringkasan error di atas | Tambahkan |
| M-64 | Global | Emoji dekoratif dibacakan screen reader | `aria-hidden` |
| M-65 | Global | Semua warna custom hardcoded | Design token |

---

## 6. Evaluasi Heuristik Nielsen

| Heuristik | Skor | Bukti |
|---|---:|---|
| **Visibility of system status** | 4/10 | “Situs Live & Sinkron” tanpa verifikasi; skor SEO ganda; tanggal “Memuat”; autosave tidak jelas |
| **Match between system and real world** | 5/10 | Banyak istilah teknis: `STEPS`, `webhook`, `idempotency`, `blockType`, `slug`, `API`, `Anchor` |
| **User control and freedom** | 6/10 | Undo/redo, tutup builder dengan konfirmasi, draft; tetapi `confirm()` native dan tidak ada batal global |
| **Consistency and standards** | 4/10 | Status “Terbit/Diterbitkan/Live/Tayang/Aktif/Off”; tanggal beda format; tombol “Terbitkan” vs “Terbitkan Perubahan” |
| **Error prevention** | 5/10 | Validasi publish, guard harga; tetapi crash null media, alt wajib saat gambar kosong |
| **Recognition rather than recall** | 5/10 | Deskripsi field kaya; tetapi field SEO hilang, tidak ada pencarian global, tab kosong |
| **Flexibility and efficiency** | 5/10 | Filter/per page/search per koleksi; tidak ada saved view/global search/bulk actions yang jelas |
| **Aesthetic and minimalist design** | 5/10 | Kartu dashboard rapi; teks 9,75–11 px dan banyak panel padat |
| **Help users recognize, diagnose, recover from errors** | 3/10 | Error builder default Inggris; tab kosong tanpa pesan; link 404 |
| **Help and documentation** | 7/10 | Pusat Bantuan, deskripsi field, banner preview, panduan SOP |
| **Rata-rata** | **4,9/10** | Konsep baik, eksekusi belum konsisten |

---

## 7. Audit Aksesibilitas (WCAG 2.2)

| Kriteria | Status | Bukti |
|---|---|---|
| 1.4.3 Contrast (Minimum) | **Gagal** | Banyak teks 1,03–4,09:1 di mode gelap |
| 1.4.11 Non-text Contrast | **Berisiko** | Checkbox 13 px, border tipis, indikator select |
| 1.3.1 Info and Relationships | **Gagal sebagian** | Tidak ada `<main>`; `<ul>` tab berisi `<div>`/`<a>` |
| 2.4.1 Bypass Blocks | **Gagal** | Tidak ada skip link |
| 2.4.3 Focus Order | **Tidak terverifikasi** | Tab bar dan modal perlu uji keyboard |
| 2.4.6 Headings and Labels | **Gagal** | H1 → H3; komponen select tanpa label |
| 2.4.7 Focus Visible | **Tidak terverifikasi** | Perlu uji visual keyboard |
| 2.5.7 Dragging Movements | **Cukup** | Dnd-kit punya keyboard sensor; tetapi tombol alternatif belum jelas |
| 2.5.8 Target Size (Minimum) | **Gagal** | 18–23 px pada banyak aksi |
| 3.3.1 Error Identification | **Cukup** | Validation banner ada; tetapi istilah teknis |
| 3.3.2 Labels or Instructions | **Gagal sebagian** | Combobox relasi tanpa label; alt otomatis nama file |
| 4.1.2 Name, Role, Value | **Gagal** | Tombol tanpa nama; tab tanpa role/selected |
| 1.4.10 Reflow | **Gagal** | Tabel 1.802 px pada viewport 1.296 px, body overflow hidden |
| 1.4.4 Resize Text | **Berisiko** | Font 9,75–11 px; perlu uji zoom 200% |
| 1.1.1 Non-text Content | **Berisiko** | Alt media otomatis dari filename |

**Target perbaikan:** Lighthouse Accessibility ≥95 untuk dashboard, edit artikel, dan login; tidak ada pelanggaran `color-contrast`, `label`, `button-name`, `landmark-one-main`, `heading-order`; semua target ≥24 px.

---

## 8. Audit Visual & Design Token

### 8.1 Warna

| Token yang seharusnya | Kondisi sekarang | Risiko |
|---|---|---|
| `--theme-text` | Banyak `#0f172a`, `#334155`, `#475569` hardcoded | Tidak mengikuti tema |
| `--theme-elevation-0` | Banyak `#ffffff` / `#f8fafc` hardcoded | Kartu putih di tema gelap |
| `--theme-success-*` | `#15803d`, `#dcfce7`, `#10b981` hardcoded | Tidak konsisten |
| `--theme-error-*` | `#b91c1c`, `#fee2e2` hardcoded | Tidak konsisten |
| `--theme-warning-*` | `#b45309`, `#fffbeb` hardcoded | Teks putih di latar krem |

**Angka:** 35 warna hardcoded di `CustomDashboard.tsx`, 8 di `SeoPanelField.tsx`, puluhan `!important` di `custom.scss`.

### 8.2 Tipografi

Belum ada skala tipografi yang konsisten. Ukuran yang teramati: 9,36 / 9,75 / 10 / 10,14 / 10,5 / 10,56 / 11 / 11,375 / 12 / 13 / 14 / 15 / 16 / 17 / 18 / 20 / 24 / 28 / 32 / 44 px.

Rekomendasi skala:

| Peran | Ukuran |
|---|---|
| Caption/metadata | 12 px |
| Body/table | 13–14 px |
| Label field | 13 px |
| Judul kartu | 16 px |
| Judul seksi | 18–20 px |
| H1 | 28–32 px |
| Angka KPI | 40–44 px |

### 8.3 Spacing & layout

- Dashboard memakai grid `auto-fit minmax(280px, 1fr)` — baik.
- Tabel tidak memiliki wrapper scroll — buruk.
- Builder: sidebar 360 px, preview 916 px pada 1.296 px — proporsional.
- Form edit sangat panjang; tidak ada sticky action bar di mobile.
- Modal katalog/media tidak memakai semantic dialog.

### 8.4 Ikon & emoji

- Emoji dipakai sebagai ikon fungsional dan dekoratif tanpa `aria-hidden`.
- Ikon Lucide punya ukuran 12–18 px; banyak yang terlalu kecil.
- Tidak ada design system ikon yang konsisten antara Payload, builder, dan dashboard.

---

## 9. Audit Microcopy & Lokalisasi

### 9.1 Istilah yang perlu diganti

| Sekarang | Rekomendasi |
|---|---|
| `STEPS` | `Langkah Pemesanan` |
| `Off` | `Nonaktif` |
| `PENGATURAN SEKSI` | `Pengaturan Seksi` |
| `DAFTAR LANGKAH` | `Daftar Langkah` |
| `PENGATURAN BLOK` | `Pengaturan Blok` |
| `hero`, `painPoints`, `pricing`, `faq`, `cta` | Label Indonesia yang sudah ada di registry |
| `blockType` | Nama blok yang ramah |
| `webhook`, `idempotency` | “sinkronisasi otomatis” / “pencegah duplikasi” |
| `slug` | `URL halaman` (dengan contoh) |
| `ID Anchor` | `ID Tautan Langsung` |
| `Kategori Folder Media (MED-005)` | `Kategori Folder` |
| `Tag / Kata Kunci Pencarian (MED-005)` | `Tag Pencarian` |
| `Perlu Review / Draft` | `Perlu Ditinjau / Draf` |
| `Situs Live & Sinkron` | `Status deploy` (dengan status nyata) |
| `Hari ini` untuk tanggal tidak valid | `Tanggal tidak tersedia` |
| `Maaf—tidak ada...` | `Tidak ada hasil. Coba ubah filter.` |
| `Tidak ada autosave` | `Draf disimpan otomatis setiap 1,5 detik` (jika benar) |

### 9.2 Nada dan konsistensi

- Nada sudah hangat (“Bunda”, “Si Kecil”), tetapi bercampur dengan pesan robotik dari terjemahan framework.
- Gunakan istilah “Bunda” secara konsisten untuk audiens, tetapi jangan berlebihan di label sistem.
- Bedakan “konten” (artikel/halaman) vs “dokumen” (record CMS).
- Samakan “Terbit” vs “Diterbitkan” vs “Tayang”.
- Hindari ALL CAPS untuk instruksi; simpan untuk badge.

### 9.3 Placeholder dan pesan error

- Placeholder framework `<Tidak ada …>` harus diganti.
- Error “Application error: a client-side exception…” harus diganti dengan halaman pemulihan berbahasa Indonesia.
- Error validasi harus menyebut label field yang dilihat pengguna, bukan `blockType`.
- Empty state harus memberi langkah berikutnya, bukan hanya menjelaskan ketiadaan.

---

## 10. Catatan per Layar

### 10.1 Login

**Baik:** form sederhana, label jelas, input 40 px, link lupa password berfungsi, localized.
**Masalah:** password autocomplete off, tanpa show/hide, required false, tema terang saat OS gelap, tanpa “tetap masuk”.
**Prioritas:** P2.

### 10.2 Dashboard

**Baik:** H1 jelas, role badge, tiga kartu aksi, preview status, pusat bantuan, kartu SEO.
**Masalah:** skor SEO kontradiktif, “Live & Sinkron” palsu, link 404, CTA mismatch, teks 11 px, tanpa `<main>`, heading skip.
**Prioritas:** P0 (SEO) + P1 (tautan/status).

### 10.3 Daftar Artikel

**Baik:** pencarian, filter, kolom, per halaman, status, badge SEO.
**Masalah:** skor SEO 0, tanggal salah format, “Memuat…” flash, “0 · Perlu diperbaiki” untuk data yang sudah 80.
**Prioritas:** P0 (SEO) + P1 (tanggal).

### 10.4 Daftar Halaman

**Baik:** kolom tujuan/layout, status, filter.
**Masalah:** tabel 1.377 px, header panjang, `<Tidak ada…>`, status “Draf (memiliki versi yang dipublikasikan)”, 104 px row.
**Prioritas:** P1.

### 10.5 Daftar Layanan

**Baik:** kolom harga, durasi, unggulan, aktif, urutan.
**Masalah:** boolean “benar/salah”, harga mentah, `<Tidak ada Durasi…>`, header panjang.
**Prioritas:** P1.

### 10.6 Daftar Testimoni

**Baik:** kolom consent, wilayah, layanan, status.
**Masalah:** tabel 1.802 px, header sangat panjang, boolean mentah, relasi kosong `<Tidak ada…>`.
**Prioritas:** P1.

### 10.7 Edit Artikel

**Baik:** deskripsi field kaya, tab konten/SEO/internal/lanjutan, preview, versi, simpan draf/terbit, jadwal.
**Masalah:** tab SEO kosong, tautan internal kosong, tanggal salah, tab tanpa ARIA, tombol terbit tidak kontekstual, alt wajib tanpa gambar, panel SEO dead-end.
**Prioritas:** P0.

### 10.8 Edit Halaman

**Baik:** mode builder/form, preview live, layout, tujuan halaman, pelacakan.
**Masalah:** dual authoring, builder crash, tab SEO kosong, pilihan layout panjang, slug camelCase di data, mode radio di tengah form.
**Prioritas:** P0 + P1.

### 10.9 Edit Layanan

**Baik:** field harga + guard, durasi, included items, badge, WhatsApp, tracking.
**Masalah:** group SEO kosong, “Isian ini tidak memiliki Included Items”, label teknis.
**Prioritas:** P0 (SEO).

### 10.10 Media

**Baik:** alt wajib, folder, tag, caption, upload massal, WebP otomatis.
**Masalah:** pustaka kosong, list tidak bisa diuji, picker alt dari filename, tidak ada filter folder/tag.
**Prioritas:** P1.

### 10.11 Pengaturan Situs

**Baik:** tab jelas, deskripsi baik, field WhatsApp/Instagram berfungsi.
**Masalah:** group analytics/banner/homepage/jam kosong; data GTM/Pixel tidak bisa diedit; tab tampak rusak.
**Prioritas:** P0.

### 10.12 Pengguna & Akun

**Baik:** role, API key, reset preferensi, tema/bahasa.
**Masalah:** role panjang, bot sebagai operator, “Paksa Buka Kunci” tanpa status, tidak ada login terakhir/2FA.
**Prioritas:** P2.

### 10.13 Pusat Bantuan

**Baik:** 3 panduan, langkah kerja, takeaway.
**Masalah:** group Do's & Don'ts kosong, tanggal salah, “Memuat…”.
**Prioritas:** P0/P1 (group).

### 10.14 Deploy & Template

**Baik:** status deploy, riwayat (kosong), template blok 2.
**Masalah:** riwayat kosong, template halaman kosong, “Buat Riwayat Deploy baru” manual, status “Live” palsu.
**Prioritas:** P1.

### 10.15 Visual Builder

**Baik:** full-screen, preview, undo/redo, simpan draf, terbitkan, tutup dengan konfirmasi, peringatan layar sempit.
**Masalah:** crash, teks kecil, tombol kecil, modal tanpa semantik, copy teknis, native confirm, tanpa search, media picker alt.
**Prioritas:** P0 + P1.

---

## 11. Rencana Perbaikan

### 11.1 Quick wins (<1 hari per item)

| # | Aksi | Dampak |
|---|---|---|
| 1 | Guard `value && typeof value === 'object'` di `SectionSettings` | Mencegah crash builder |
| 2 | Error boundary builder + pesan Indonesia | Pemulihan dari crash |
| 3 | Ganti skor `0` menjadi “— / Belum diaudit” saat metrik kosong | Menghilangkan salah tafsir |
| 4 | Format tanggal `id-ID` 24 jam | Profesionalisme |
| 5 | Ganti placeholder `<Tidak ada…>` dan boolean “benar/salah” | Keterbacaan |
| 6 | Format harga `Rp100.000` | Keterbacaan |
| 7 | Tambah `aria-label` pada tombol ikon | Aksesibilitas |
| 8 | Tambah `<main>` dan perbaiki heading | Aksesibilitas |
| 9 | Bungkus tabel dengan `overflow-x:auto` | Kolom terjangkau |
| 10 | Perbaiki tautan dashboard / hapus tautan legacy | Menghilangkan 404 |
| 11 | Samakan label CTA dengan filter | Kepercayaan |
| 12 | Empty state spesifik + reset filter | Orientasi |
| 13 | Ganti copy `Tidak Ada Hasil…` | Kualitas |
| 14 | Tambah `autocomplete=current-password` + show/hide | Login |
| 15 | Ganti warna nav/dashboard dengan token | Dark mode |
| 16 | Sembunyikan field audit dari column picker | Fokus |

### 11.2 Sprint 1 (1–2 minggu) — integritas & kepercayaan

1. **Perbaiki render group** di semua koleksi/global (P0-01). Ini prioritas tertinggi.
2. **Hilangkan crash builder** + error boundary + test media null (P0-02).
3. **Satukan skor SEO** (P0-03) dan jalankan backfill metrik.
4. **Audit mode gelap** seluruh komponen kustom; target kontras AA.
5. **Redesain tabel** agar responsif dan tidak memotong kolom.
6. **Perbaiki dashboard**: link, filter, status deploy, timestamp.
7. **Seed/migrasi konten minimum**: media, FAQ, bidan, area, template.
8. **A11y pass 1**: landmark, heading, label, button names, target size.
9. **Microcopy pass**: tanggal, harga, boolean, empty state, status.

### 11.3 Sprint 2 (2–4 minggu) — efisiensi & skala

1. **Halaman konten terpadu** + filter status/jenis.
2. **Global search / command palette** + item Dasbor di sidebar.
3. **Satukan mode authoring** halaman (builder vs rich text).
4. **Design system token** untuk warna, tipografi, spacing, status.
5. **Builder UX**: search katalog, modal semantik, alt prompt, label ramah, target besar.
6. **Role-based dashboard** dan badge jumlah draf/isu.
7. **Media library**: filter folder/tag, alt workflow, bulk actions.
8. **Checklist kesiapan konten** + status deploy nyata.
9. **Error/loading/empty state** standar.
10. **CI a11y & visual regression**.

### 11.4 Sprint 3 (4–8 minggu) — pengalaman premium

1. Onboarding wizard untuk operator baru.
2. Preview side-by-side yang benar-benar live untuk semua koleksi.
3. Riwayat versi dengan diff visual.
4. Scheduled publish & review workflow yang terlihat.
5. Dashboard personal per role.
6. Audit performa dan optimasi bundle.
7. Dokumentasi UI/UX dan panduan tone of voice.

---

## 12. Checklist Penerimaan (Definition of Done)

### Fungsional UI

- [ ] Semua field di dalam group tampil dan bisa diedit di Artikel, Halaman, Layanan, Bidan, Area, Landing Page, Pengaturan Situs, Pusat Bantuan.
- [ ] Memilih seksi dengan media `null` tidak crash; tampil empty state.
- [ ] Semua tombol di builder berfungsi dan punya label aksesibel.
- [ ] Skor SEO di daftar, panel, dashboard, dan API sama untuk dokumen yang sama.
- [ ] Metrik SEO tidak lagi 0 untuk dokumen yang sudah diaudit.
- [ ] Tidak ada tautan dashboard yang 404.
- [ ] “Lihat Draf” menampilkan jumlah yang sama dengan kartu draf.
- [ ] “Lihat semua dokumen” mencakup semua jenis konten atau labelnya diubah.
- [ ] Status deploy hanya “Live & Sinkron” jika diverifikasi API.

### Visual & tema

- [ ] Mode terang dan gelap sama-sama lolos kontras WCAG AA.
- [ ] Tidak ada teks putih di latar krem/putih.
- [ ] Tidak ada `#0f172a` pada latar gelap.
- [ ] Semua komponen kustom memakai token tema.
- [ ] Font minimum 12 px untuk metadata, 14 px untuk body.
- [ ] Target sentuh minimum 24 px; aksi utama 36–44 px.

### Aksesibilitas

- [ ] `<main>` ada di dashboard, login, dan form.
- [ ] Heading berurutan H1 → H2 → H3.
- [ ] Semua tombol ikon punya `aria-label`.
- [ ] Semua input/combobox punya label.
- [ ] Tab memakai `role=tablist/tab` dan `aria-selected`.
- [ ] Tidak ada `aria-hidden` pada elemen fokusable.
- [ ] Tidak ada emoji dekoratif yang dibacakan.
- [ ] Lighthouse Accessibility ≥95 untuk dashboard, artikel, login.
- [ ] Uji keyboard: tab, enter, escape, arrow keys, focus visible.

### Responsif

- [ ] Tidak ada horizontal scroll pada body di 1024/1280/1366/1440.
- [ ] Tabel bisa di-scroll horizontal di dalam wrapper.
- [ ] Tabel berubah menjadi kartu di <768 px.
- [ ] Sidebar mobile bisa dibuka/tutup dengan keyboard dan target 44 px.
- [ ] Form satu kolom di mobile.

### Microcopy

- [ ] Tanggal `d MMMM yyyy, HH.mm`.
- [ ] Harga `Rp100.000`.
- [ ] Boolean `Ya/Tidak`.
- [ ] Tidak ada `<Tidak ada …>`.
- [ ] Tidak ada “benar/salah” di tabel.
- [ ] Empty state spesifik + reset filter.
- [ ] Tidak ada istilah `blockType`, `webhook`, `idempotency`, `MED-005` di UI operator.
- [ ] Status konsisten: Draf / Terbit / Terjadwal / Nonaktif.

### Kepercayaan data

- [ ] Dashboard dan daftar mengambil dari satu query/agregasi.
- [ ] Tidak ada perbedaan angka antara kartu dan halaman tujuan.
- [ ] Deploy history terisi atau status “belum ada deploy”.
- [ ] Koleksi kunci tidak kosong.
- [ ] Audit log perubahan tersedia.

---

## 13. Lampiran Bukti

### 13.1 Endpoint yang diperiksa

| Endpoint | Hasil |
|---|---|
| `GET /api/articles?limit=10` | 4 dokumen; `seoScore` 0/80/90/91; `seoAudit.metrics` semua 0 |
| `GET /api/articles/3` | `seoScore: 80`, `seoAudit.score: 80`, `seo` object lengkap dengan nilai null |
| `GET /api/globals/site-settings` | `analytics.gtmId`, `analytics.metaPixelId`, `whatsappNumber` ada |
| `GET /api/pages?limit=10` | 3 dokumen; page 5 tanpa title/slug |
| `GET /api/services?limit=10` | 3 dokumen; `duration` ada, `durationText` kosong |

### 13.2 Lighthouse

| Layar | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|
| Dashboard | 92 | 100 | 83 |
| Edit Artikel | 77 | 100 | 100 |
| Login | 98 | 100 | 80 |

**Dashboard failures:** `color-contrast`, `heading-order`, `landmark-one-main`, `meta-description`.
**Article failures:** `aria-hidden-focus`, `button-name`, `color-contrast`, `heading-order`, `label-content-name-mismatch`, `label`, `list`.

### 13.3 Navigasi

| Metrik | Nilai |
|---|---:|
| TTFB | ±504 ms |
| DOMContentLoaded | ±638 ms |
| Load | ±814 ms |
| JS decoded | ±2,5 MB |
| JS transfer | ±800 KB |

### 13.4 Referensi kode utama

| Lokasi | Peran |
|---|---|
| `apps/cms/src/components/admin/builder/SectionSettings.tsx:447-449` | Crash `null.alt` |
| `apps/cms/src/components/admin/CustomDashboard.tsx:719` | Link draf hanya artikel |
| `apps/cms/src/components/admin/CustomDashboard.tsx:757` | Klaim “Situs Live & Sinkron” |
| `apps/cms/src/components/admin/CustomDashboard.tsx:958` | Link “isu SEO” tanpa filter |
| `apps/cms/src/components/admin/CustomDashboard.tsx:1204` | Link “semua dokumen” hanya Pages |
| `apps/cms/src/components/admin/CustomDashboard.tsx:1308` | Link ke `landing-pages` tersembunyi |
| `apps/cms/src/components/admin/SeoScoreCell.tsx:17-29` | Skor 0 dari cellData/default |
| `apps/cms/src/fields/seoAuditFields.ts:3-7` | `defaultValue: 0` pada skor |
| `apps/cms/src/app/(payload)/custom.scss:12-62` | Warna nav hardcoded |
| `apps/cms/src/components/admin/SeoPanelField.tsx:304-543` | Warna panel SEO hardcoded |
| `apps/cms/src/components/admin/builder/AddSectionMenu.tsx:136-152` | Modal tanpa role/label |
| `apps/cms/src/components/admin/builder/MediaPickerModal.tsx:69-71` | Alt dari filename |
| `apps/cms/src/components/admin/builder/MediaPickerModal.tsx:99-113` | Modal tanpa role/label |
| `apps/cms/src/components/admin/builder/SortableSection.tsx:57-117` | Tombol ikon kecil tanpa aria-label |
| `apps/cms/src/components/admin/builder/SectionTree.tsx:109` | `confirm()` dengan blockType |
| `apps/cms/src/components/admin/builder/BuilderValidationBanner.tsx:72-74` | Pesan error blockType |
| `apps/cms/src/components/admin/builder/PreviewFrame.tsx:264` | Pesan “Tidak ada autosave” |
| `apps/cms/src/collections/Pages.ts:91-99` | Autosave 1.500 ms |
| `apps/cms/src/collections/Pages.ts:233-252` | Dual authoring |
| `apps/cms/src/collections/Articles.ts:19` | `seoScore` di defaultColumns |
| `apps/cms/src/collections/Articles.ts:184-200` | Hero image opsional, alt wajib |
| `apps/cms/src/collections/Media.ts:88,105` | Kode tiket MED-005 |
| `apps/cms/src/globals/SiteSettings.ts:56,201,254,336` | Group settings |
| `apps/cms/src/components/admin/CustomDashboard.tsx:33-41` | Role label tanpa `automation` |
| `apps/cms/src/components/admin/CustomDashboard.tsx:317-1308` | Dashboard tanpa `<main>` |

---

## 14. Penutup

CMS ini memiliki **fondasi produk yang kuat** dan beberapa ide UX yang benar-benar bagus: deskripsi field yang membantu, dashboard berbasis peran, builder visual dengan preview, validasi publish, dan pusat bantuan. Masalahnya bukan pada visi, melainkan pada **keandalan rendering, konsistensi data, dan disiplin detail**.

Tiga hal harus dibereskan lebih dulu sebelum CMS disebut siap:

1. **Field group harus tampil** — tanpa ini, SEO dan Pengaturan Situs tidak berfungsi.
2. **Builder tidak boleh crash** — satu media kosong tidak boleh menghancurkan seluruh pekerjaan.
3. **Satu angka SEO yang benar** — pengguna harus bisa mempercayai dashboard.

Setelah tiga hal itu, perbaikan berikutnya bersifat sistematis: token tema, tabel responsif, lokalisasi, aksesibilitas, dan penyederhanaan alur. Dengan eksekusi yang disiplin, CMS ini bisa naik dari **4,1/10** menjadi **7,5–8/10** dalam 4–6 minggu kerja.

---

*Dokumen ini disusun dari audit read-only pada 5 November 2026. Tidak ada data produksi yang diubah.*

**Tindak lanjut:** rencana eksekusi perbaikan ada di [`rencana-perbaikan-uiux-cms-2026-11.md`](./rencana-perbaikan-uiux-cms-2026-11.md).
