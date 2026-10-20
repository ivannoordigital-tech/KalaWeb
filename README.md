# Kala Moms and Baby Spa — Web Platform (MVP)

Platform web resmi **Kala Moms and Baby Spa** (`kalababyspa.com`), dirancang dengan arsitektur modern berbasis **Astro + Tailwind CSS** di atas **Cloudflare Pages**. Dibangun untuk menjamin performa cepat (Core Web Vitals hijau), otoritas medis terpercaya (standar nakes ber-STR), dan pelacakan konversi WhatsApp yang presisi per halaman.

---

## 1. Fitur & Cakupan MVP yang Telah Diimplementasikan

### A. Landing Page Berorientasi Konversi (`/`)
- **Header & Navbar:** Logo Kala, navigasi responsif (Layanan, Tentang Bidan, Cerita Bunda, Area Layanan, Blog), dan tombol CTA WhatsApp terisi otomatis (`[ref: KALA-NAV]`).
- **Hero Section:**
  - H1 Tunggal: *"Layanan Perawatan Ibu & Bayi di Rumah oleh Bidan Profesional di Surabaya & Sidoarjo"*.
  - Tagline: *"Tumbuh Berkembang Bersama Kala — Bidan Sahabat Bunda"*.
  - Social Proof terverifikasi: *"Dipercaya 500+ Bunda di Surabaya & Sidoarjo"*.
  - Tombol WhatsApp utama: `[ref: KALA-HOME]`.
- **5 Pembeda Layanan:**
  1. Bidan resmi ber-STR dan berizin.
  2. Sesi ngobrol hangat 10–15 menit tanpa mom-shaming.
  3. Higienitas medis steril dan minyak alami food-grade.
  4. Edukasi stimulasi mandiri untuk orang tua di rumah.
  5. Nyaman murni homecare ke kediaman pasien.
- **3 Layanan Unggulan:**
  1. *Kala Bundle Duo (Mom & Baby Ceria)* — Rp150.000 (100 mnt, 1 Ibu + 1 Bayi).
  2. *Kala Baby – Pijat Ceria Newborn* — Rp60.000 (40 mnt, 0–6 bulan).
  3. *Kala Bundle Selapan Full* — Rp100.000 (80 mnt, Cukur + Ceria + Mandi).
  - Tautan katalog 39 layanan lengkap via WhatsApp (`[ref: KALA-KATALOG]`).
- **3 Cerita & Testimoni Nyata:** Kisah nyata Bunda di Surabaya & Sidoarjo dengan izin tayang.
- **Area Jangkauan (Teks HTML Biasa):** Surabaya (Barat, Timur, Selatan, Pusat, Utara) dan Kabupaten Sidoarjo untuk memastikan perayapan Googlebot & Bingbot optimal.
- **Footer:** Jam operasional (08.00–17.00 WIB), akun Instagram `@kala.babyspa`, dan tautan ke kebijakan privasi.

### B. CMS Sederhana & 3 Artikel Pilar (`/blog/`)
Konten dikelola melalui **Astro Content Collections** dengan validasi skema frontmatter konsisten di `src/content/config.ts`.
1. **`bayi-kolik-malam-hari.md`**
   - *Target Keyword:* `cara mengatasi bayi kolik malam hari`
   - *Pesan WhatsApp:* `Halo Bidan Kala, saya baca artikel kolik dan mau konsultasi [ref: KALA-ART-KOLIK]`
2. **`manfaat-pijat-oksitosin-ibu-menyusui.md`**
   - *Target Keyword:* `manfaat pijat oksitosin ibu menyusui`
   - *Pesan WhatsApp:* `Halo Bidan Kala, saya mau tanya soal pijat oksitosin [ref: KALA-ART-OKSITOSIN]`
3. **`panduan-memilih-pijat-bayi-homecare-surabaya.md`**
   - *Target Keyword:* `pijat bayi homecare surabaya`
   - *Pesan WhatsApp:* `Halo Bidan Kala, saya mau reservasi pijat bayi homecare [ref: KALA-ART-HOMECARE]`

> **Standar Konten Medis Terpenuhi:**
> - Ditinjau bidan ber-STR dengan pencantuman nama penulis dan tanggal pembaruan.
> - Menyertakan rujukan ilmiah (Kemenkes RI, IDAI, WHO).
> - Bagian wajib "Kapan Harus ke Dokter" (*Red Flags*) dan *Medical Disclaimer*.
> - Tautan silang antar artikel dan ke layanan terkait.

### C. Halaman Pelengkap
- **Kebijakan Privasi (`/kebijakan-privasi`):** Transparansi data kesehatan, pelacakan klik, kerahasiaan rekam medis, dan hak pasien.
- **Halaman Segera Hadir (`/segera-hadir`):** Halaman transisi saat domain baru pertama kali dihubungkan ke Cloudflare.
- **Halaman 404 (`/404`):** Penanganan rute tidak valid dengan navigasi ramah.

### D. Technical SEO & Schema.org JSON-LD
- **Sitemap XML:** Otomatis digenerasi ke `/sitemap-index.xml` dan `/sitemap-0.xml`.
- **`robots.txt`:** Mengizinkan Googlebot, Bingbot, dan AI Crawlers (GPTBot, PerplexityBot, ClaudeBot), serta mengecualikan halaman sementara dan 404.
- **Schema JSON-LD Terintegrasi:**
  - `MedicalBusiness` & `HealthAndBeautyBusiness` di beranda dengan area layanan, jam buka, koordinat Waru Sidoarjo, dan daftar harga resmi yang cocok 100% dengan teks halaman.
  - `MedicalWebPage` & `BreadcrumbList` pada setiap artikel blog.
- **`llms.txt`:** Profil ringkas entitas Kala untuk mesin pencari AI (Perplexity, ChatGPT, Gemini).

### E. WhatsApp Lead Attribution & Click Tracker
Skrip `tracker.js` otomatis:
1. Menyimpan parameter kampanye (`utm_source`, `utm_medium`, `utm_campaign`, `fbclid`, `gclid`) ke dalam `sessionStorage`.
2. Menambahkan ringkasan atribusi ke dalam pesan WhatsApp secara dinamis saat tombol diklik:
   `[ref: KALA-HOME | src:meta cmp:spring fb:xxxx]`
3. Mengirimkan event analitik `lead_whatsapp_click` ke Microsoft Clarity / Cloudflare Web Analytics.
4. Mendorong event konversi `whatsapp_lead` ke `window.dataLayer` Google Tag Manager (GTM) untuk pelacakan serentak di GA4, Meta Pixel, dan Google Ads.

### F. Pembaruan Dokumen Revisi KalaWeb (Fase 0 – Fase 5)
1. **Fase 0 — Pengamanan & Keandalan Arsitektur:**
   - **Fail-Safe Build Fallback:** Pada production build Cloudflare Pages (`ALLOW_FALLBACK=false`), kegagalan komunikasi ke CMS akan sengaja menggagalkan proses build agar Cloudflare Pages mempertahankan deployment live sebelumnya (zero downtime). Mode fallback hanya aktif di dev lokal.
   - **Deploy Hook Cerdas:** Debounce 60 detik, jeda keselamatan transaksi PostgreSQL (2.5 detik), pemicu spesifik status draft/publish/unpublish, serta cron rebuild harian via GitHub Actions.
   - **Backup Otomatis VPS:** Script dump PostgreSQL harian (`backup-postgres.sh`) dengan kompresi gzip, retensi 30 hari, sinkronisasi R2, dan script pemulihan teruji (`restore-postgres.sh`).
   - **Pipeline Gambar Teroptimasi:** Dukungan remote domain Cloudflare/Payload di Astro Image dan OG default 1200×630 PNG.
2. **Fase 1 — Konten Komersial Mandiri di CMS:**
   - Koleksi Payload CMS lengkap: `Services`, `Testimonials`, `FAQ`, `ServiceAreas`, `Midwives`, dan `SiteSettings`.
   - Validasi regex nomor WhatsApp Indonesia (`628xxxxxxxxxx`) dan penegakan *alt text* wajib.
   - Runbook teknis (`docs/runbook-teknis.md`) dan SOP operasional (`docs/sop-operasional.md`).
3. **Fase 2 — Struktur Halaman & Penguatan SEO:**
   - **Halaman Layanan Individual:** `/layanan/[slug]` lengkap dengan Schema `Service` & `Offer`, transparansi biaya, dan alur prosedur 4 langkah.
   - **Halaman Area Spesifik:** `/area/[slug]` (Surabaya Timur, Barat, Selatan, Pusat, Utara, Sidoarjo) dengan landmark lokal dan estimasi waktu tempuh.
   - **Halaman Otoritas Klinis:** `/tentang-kami` dan `/tim-bidan` dengan nomor STR terverifikasi dan Schema `Person`.
   - **Landing Page Kampanye Ads:** `/lp/[slug]` (`/lp/bayi-kolik`, `/lp/pijat-newborn`) bebas distraksi navigasi, single CTA, dan `noindex: true`.
   - **RSS Feed & Breadcrumbs:** `/rss.xml` terintegrasi `@astrojs/rss`.
4. **Fase 3 & 4 — Atribusi Multi-Touch 30 Hari, Kepatuhan & Performa:**
   - **Atribusi Tahan Lama:** Pelacakan First-Touch & Last-Touch (`utm_source`, `utm_campaign`, `fbclid`, `gclid`) bertahan 30 hari via Cookie & localStorage.
   - **Debounce Double-Click & Event GTM:** Pencegahan double-fire klik WhatsApp dan pelacakan event scroll depth (25%, 50%, 75%, 90%).
   - **Kepatuhan Privasi UU PDP:** Komponen `ConsentBanner.astro` dengan penyimpanan persetujuan lokal.
   - **Mobile Sticky CTA Bar:** Tombol mengambang bawah ramah *tap target* (>44px) dan aman iPhone home bar.
   - **Header Keamanan Web:** HSTS, X-Content-Type-Options, Referrer-Policy, dan Content Security Policy di `_headers`.

---

## 2. Struktur Direktori Proyek Monorepo

```
KalaWeb/
├── .github/
│   └── workflows/
│       └── scheduled-build.yml # Cron rebuild harian Cloudflare Pages
├── .gitignore
├── package.json               # Root monorepo workspace
├── README.md                  # Dokumentasi proyek & panduan arsitektur
├── docs/
│   ├── runbook-teknis.md      # Panduan disaster recovery, restore DB, rotasi secret
│   └── sop-operasional.md     # SOP bidan, admin reservasi WA, & marketing ads
└── apps/
    ├── cms/                   # Payload CMS v3 (Next.js + Postgres)
    │   ├── package.json
    │   ├── .env.example       # Database URI & CLOUDFLARE_DEPLOY_HOOK_URL
    │   ├── scripts/
    │   │   ├── backup-postgres.sh  # Backup harian terkompresi & R2 sync
    │   │   └── restore-postgres.sh # Script restore DB teruji
    │   └── src/
    │       ├── payload.config.ts   # Konfigurasi koleksi & global
    │       ├── utilities/
    │       │   └── triggerDeployHook.ts # Debounced deploy trigger
    │       ├── globals/
    │       │   └── SiteSettings.ts # Nomor WA (regex), jam kerja, banner
    │       └── collections/
    │           ├── Articles.ts     # Artikel edukasi + SEO + deploy hook
    │           ├── FAQ.ts          # Tanya jawab seputar homecare
    │           ├── Media.ts        # Storage media
    │           ├── Midwives.ts     # Profil bidan + STR
    │           ├── ServiceAreas.ts # Wilayah Surabaya & Sidoarjo + estimasi waktu
    │           ├── Services.ts     # Katalog layanan + harga + durasi
    │           ├── Testimonials.ts # Ulasan Bunda terverifikasi
    │           └── Users.ts        # Role admin & penulis
    │
    └── web-kala/              # Aplikasi Astro marketing & SEO (Cloudflare Pages)
        ├── package.json
        ├── .env.example       # PAYLOAD_URL, PUBLIC_GTM_ID, ALLOW_FALLBACK
        ├── astro.config.mjs   # Astro, Tailwind, Image Remote, Sitemap filter
        ├── tailwind.config.mjs# Color palette & typography
        ├── tsconfig.json
        ├── public/
        │   ├── _headers       # HSTS, CSP, & security headers
        │   ├── _redirects     # 301 Redirects
        │   ├── favicon.svg    # Brand monogram
        │   ├── llms.txt       # Profil entitas untuk AI crawler
        │   ├── robots.txt     # Rules crawler
        │   └── images/
        │       ├── logo-kala.svg
        │       ├── og-kala-homecare.png # 1200x630 OG image standar WA/FB
        │       └── blog/      # Hero SVG artikel pilar
        └── src/
            ├── components/
            │   ├── ConsentBanner.astro   # Banner persetujuan UU PDP
            │   ├── CoverageArea.astro    # Grid wilayah dengan link ke /area/
            │   ├── FeaturedServices.astro# Menu layanan dengan link ke /layanan/
            │   ├── Footer.astro
            │   ├── Hero.astro
            │   ├── JsonLd.astro          # Schema MedicalBusiness, Service, Person, Article
            │   ├── MobileStickyBar.astro # Sticky bottom CTA bar mobile
            │   ├── Navbar.astro
            │   ├── SEO.astro
            │   ├── Testimonials.astro
            │   ├── ValueProps.astro
            │   └── WhatsAppButton.astro
            ├── config/
            │   └── site.ts    # Fallback data lokal
            ├── content/
            │   ├── config.ts  # Zod schema artikel
            │   └── blog/      # Markdown artikel awal
            ├── layouts/
            │   ├── BaseLayout.astro     # Deferred GTM, consent, mobile bar
            │   └── BlogPostLayout.astro # Layout artikel medis
            ├── lib/
            │   └── payload.ts # Client API CMS + proteksi build production
            ├── pages/
            │   ├── 404.astro
            │   ├── index.astro
            │   ├── kebijakan-privasi.astro
            │   ├── segera-hadir.astro
            │   ├── tentang-kami.astro    # Profil & standar klinis Kala
            │   ├── tim-bidan.astro       # Profil bidan + STR (Schema Person)
            │   ├── rss.xml.ts            # RSS feed blog
            │   ├── area/
            │   │   └── [slug].astro      # Landing page area lokal
            │   ├── blog/
            │   │   ├── index.astro
            │   │   └── [...slug].astro
            │   ├── layanan/
            │   │   └── [slug].astro      # Halaman per layanan (Schema Service)
            │   └── lp/
            │       └── [slug].astro      # Landing page kampanye iklan (noindex)
            ├── scripts/
            │   └── tracker.js # Multi-touch 30-day attribution & GTM pushes
            └── styles/
                └── global.css
```

---

## 3. Menjalankan di Lingkungan Lokal

```bash
# Pindah ke direktori proyek
cd c:\Users\User\Documents\KalaWeb

# Jalankan server frontend web (Astro: http://localhost:4321)
npm run dev

# Jalankan server CMS Payload (Next.js: http://localhost:3005)
npm run dev:cms

# Bangun aset produksi frontend (Static HTML di apps/web-kala/dist)
npm run build

# Uji hasil build frontend lokal
npm run preview
```

---

## 4. Panduan Eksekusi Hari 1–5 (Go-Live & Cloudflare Setup)

### Hari 1: Setup Cloudflare Pages & Domain
1. **GitHub Repository:**
   - Unggah repository ini ke akun GitHub resmi Kala (misalnya `kala-moms-baby/web-kala`).
2. **Cloudflare Pages:**
   - Buka Cloudflare Dashboard -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
   - Pilih repository `web-kala`.
   - Konfigurasi Build:
     - **Framework preset:** `Astro`
     - **Build command:** `npm run build`
     - **Build output directory:** `apps/web-kala/dist`
     - **Root directory:** `/` (atau `apps/web-kala`)
3. **Nameserver Domain:**
   - Di registrar domain tempat membeli `kalababyspa.com`, ubah Nameserver ke Cloudflare (contoh: `alec.ns.cloudflare.com` & `claire.ns.cloudflare.com`).
   - Di Cloudflare DNS, pastikan record CNAME atau A diarahkan ke Pages project.
   - Atur **Always Use HTTPS** ke ON di Cloudflare SSL/TLS -> Edge Certificates.
   - File `_redirects` otomatis mengarahkan `www.kalababyspa.com` dan `kalababyspa.online` ke `https://kalababyspa.com/` (301).

### Hari 4: Technical SEO & Pengajuan Indexing
1. **Google Search Console:**
   - Buka [Google Search Console](https://search.google.com/search-console).
   - Tambahkan properti Domain: `kalababyspa.com`.
   - Verifikasi melalui DNS TXT record di Cloudflare Dashboard.
   - Masuk ke menu **Sitemaps** -> Kirim `https://kalababyspa.com/sitemap-index.xml`.
   - Gunakan **URL Inspection** untuk mengajukan request indexing pada homepage dan 3 artikel:
     - `https://kalababyspa.com/`
     - `https://kalababyspa.com/blog/bayi-kolik-malam-hari`
     - `https://kalababyspa.com/blog/manfaat-pijat-oksitosin-ibu-menyusui`
     - `https://kalababyspa.com/blog/panduan-memilih-pijat-bayi-homecare-surabaya`
2. **Bing Webmaster Tools:**
   - Buka [Bing Webmaster Tools](https://www.bing.com/webmasters).
   - Masuk dan pilih opsi **Import from Google Search Console**.
   - Verifikasi bahwa `sitemap-index.xml` terdeteksi.
3. **Google Business Profile (GBP):**
   - Daftarkan profil dengan nama bisnis: **Kala Moms and Baby Spa**.
   - Pilih kategori: **Baby swimming school / Massage therapist / Home health care service**.
   - Pilih model bisnis: **Area Layanan (Service Area Business)** tanpa menampilkan alamat rumah pribadi secara publik.
   - Tambahkan wilayah layanan: Seluruh kecamatan di Kota Surabaya dan Kabupaten Sidoarjo.
   - Tautkan URL website ke `https://kalababyspa.com`.
   - Samakan jam buka (08.00–17.00) dan nomor WhatsApp bisnis format internasional.

### Hari 5: Uji Tracking WhatsApp & Peluncuran
1. **Uji Klik WhatsApp di Ponsel Android & iOS:**
   - Buka `https://kalababyspa.com/` di browser ponsel.
   - Klik tombol konsultasi di hero -> Pastikan WhatsApp terbuka dengan pesan terisi `[ref: KALA-HOME]`.
   - Buka `https://kalababyspa.com/?utm_source=meta&utm_campaign=kolik_test` -> Klik tombol -> Pastikan ref code terlampir ringkasan `[ref: KALA-HOME | src:meta cmp:kolik_test]`.
   - Buka artikel blog -> Pastikan kode ref berganti menjadi `[ref: KALA-ART-KOLIK]`, `[ref: KALA-ART-OKSITOSIN]`, dan `[ref: KALA-ART-HOMECARE]`.
2. **Uji PageSpeed Insights (Mobile):**
   - Buka [Google PageSpeed Insights](https://pagespeed.web.dev/).
   - Masukkan `https://kalababyspa.com/`.
   - Pastikan metrik LCP (Largest Contentful Paint), CLS (Cumulative Layout Shift), dan INP berada di **Zona Hijau**.

---

## 5. Panduan Operasional Fitur Sprint 2

### A. Cloudflare Pages Deploy Hook (Auto-Build CMS)
1. Buka Cloudflare Dashboard -> **Workers & Pages** -> Pilih project `web-kala` -> **Settings** -> **Builds & deployments**.
2. Di bagian **Deploy Hooks**, klik **Create deploy hook**.
   - Nama: `Payload CMS Publish`
   - Branch: `main`
3. Salin URL webhook dan masukkan ke `apps/cms/.env` pada server VPS:
   ```env
   CLOUDFLARE_DEPLOY_HOOK_URL=https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/YOUR_HOOK_ID
   ```
4. Setiap kali Bidan menerbitkan artikel atau memperbarui Pengaturan Situs di CMS, Cloudflare otomatis melakukan build dan deploy tanpa perlu intervensi developer.

### B. Google Tag Manager (GTM)
1. Container ID GTM dikonfigurasi melalui variabel lingkungan `PUBLIC_GTM_ID` di `apps/web-kala/.env` (default: `'GTM-XXXXXXX'`).
2. Setiap tombol WhatsApp yang diklik pengunjung memicu event konversi otomatis ke `window.dataLayer`:
   ```javascript
   {
     event: 'whatsapp_lead',
     event_category: 'Lead',
     event_label: refCode,
     whatsapp_ref_code: refCode
   }
   ```
3. Di dashboard [Google Tag Manager](https://tagmanager.google.com/), tim marketing dapat membuat trigger **Custom Event** dengan event name `whatsapp_lead` untuk menghubungkan GA4, Meta Pixel (Facebook & Instagram Ads), serta Google Ads Conversion tanpa perlu mengubah kode sumber website.
