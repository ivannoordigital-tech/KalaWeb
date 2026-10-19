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

---

## 2. Struktur Direktori Proyek

```
KalaWeb/
├── .gitignore
├── package.json               # Root monorepo workspace
├── README.md                  # Dokumentasi proyek & SOP Go-Live
└── apps/
    └── web-kala/              # Aplikasi Astro marketing & SEO
        ├── package.json
        ├── astro.config.mjs   # Konfigurasi Astro, Tailwind, & Sitemap
        ├── tailwind.config.mjs# Brand color palette Kala & typography
        ├── tsconfig.json
        ├── public/
        │   ├── _headers       # Header keamanan & caching Cloudflare Pages
        │   ├── _redirects     # 301 Redirect canonical (www & .online -> .com)
        │   ├── favicon.svg    # Monogram logo Kala
        │   ├── llms.txt       # Profil entitas untuk AI search
        │   ├── robots.txt     # Crawler rules
        │   └── images/
        │       ├── logo-kala.svg
        │       ├── og-kala-homecare.svg
        │       └── blog/      # Hero SVG untuk tiap artikel pilar
        └── src/
            ├── config/
            │   └── site.ts    # Single source of truth info bisnis & nomor WA
            ├── content/
            │   ├── config.ts  # Zod schema Content Collections
            │   └── blog/      # 3 artikel pilar Markdown
            ├── components/
            │   ├── CoverageArea.astro
            │   ├── FeaturedServices.astro
            │   ├── Footer.astro
            │   ├── Hero.astro
            │   ├── JsonLd.astro
            │   ├── Navbar.astro
            │   ├── SEO.astro
            │   ├── Testimonials.astro
            │   ├── ValueProps.astro
            │   └── WhatsAppButton.astro
            ├── layouts/
            │   ├── BaseLayout.astro
            │   └── BlogPostLayout.astro
            ├── pages/
            │   ├── 404.astro
            │   ├── index.astro
            │   ├── kebijakan-privasi.astro
            │   ├── segera-hadir.astro
            │   └── blog/
            │       ├── index.astro
            │       └── [...slug].astro
            ├── scripts/
            │   └── tracker.js # Script penangkap UTM & pelacakan klik WA
            └── styles/
                └── global.css # Custom brand styling & prose
```

---

## 3. Menjalankan di Lingkungan Lokal

```bash
# Pindah ke direktori proyek
cd c:\Users\User\Documents\KalaWeb

# Jalankan server pengembangan lokal (Astro)
npm run dev

# Bangun aset produksi (Static HTML)
npm run build

# Uji hasil build lokal
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
