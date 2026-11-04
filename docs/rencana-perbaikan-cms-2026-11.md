# Rencana Perbaikan Menyeluruh — Admin CMS KalaWeb

**Tanggal:** 3 November 2026  
**Basis:** `docs/audit-admin-cms-2026-11.md`  
**Tujuan:** menutup seluruh temuan audit (8 P0, 15 P1, 40 P2) dan membuat CMS siap operasional serta siap otomasi AI.

---

## 1. Prinsip Eksekusi

1. **Satu sumber kebenaran per entitas.** Tidak ada dua koleksi yang sama-sama menjadi sumber konten publik.
2. **Keamanan lebih dulu.** Role, secret, dan akses publik diperbaiki sebelum menambah fitur.
3. **Preview sebelum publish.** Tidak ada konten yang tayang tanpa bisa dilihat hasil akhirnya.
4. **Verifikasi, bukan asumsi.** Setiap publish harus punya status build yang nyata dan bisa dicek.
5. **Perubahan kecil, sering, dan bisa di-rollback.** Gunakan feature flag dan migrasi bertahap.
6. **Jangan merusak yang sudah berjalan.** Setiap tahap harus menjaga website lama tetap live.
7. **Otomasi mengikuti kontrak.** API/tool dibangun setelah model data dan validasi stabil.

---

## 2. Ringkasan Tier & Timeline

> Asumsi: 1 dev-day = 6–7 jam produktif, termasuk implementasi + unit test, **belum termasuk UAT**.  
> Volume konten kecil (3 artikel, ±3 landing page, <100 media). Jika volume lebih besar, tambahkan 20–30%.

| Tier | Cakupan | Dev-days | Dengan 2 Dev + 0,5 QA | Outcome |
|---|---|---:|---:|---|
| **Tier 1 — Minimum Safe Release (MSR)** | Semua P0 + integrasi artikel/landing/media | **26** | **±3 minggu** | CMS bisa dipercaya untuk publish konten inti |
| **Tier 2 — Production-Grade** | Tier 1 + seluruh P1 | **71,5** | **±8 minggu** | Alur kerja lengkap, aman, dan nyaman |
| **Tier 3 — Automation-Ready & Complete** | Tier 2 + otomasi + seluruh P2 | **119,5** | **±13 minggu** (dengan 0,5 DevOps) | Siap diotomasi AI dan tahan jangka panjang |

Dengan buffer 15%: Tier 1 ±30 dev-days, Tier 2 ±82 dev-days, Tier 3 ±137 dev-days.

**Rekomendasi:** jalankan **Tier 1 sekarang**, lanjut **Tier 2** tanpa jeda, lalu putuskan **Tier 3** berdasarkan kesiapan tim dan prioritas bisnis.

---

## 3. Keputusan yang Harus Diambil di Minggu 1

| ID | Keputusan | Rekomendasi | Dampak jika salah |
|---|---|---|---|
| D1 | Sumber artikel: CMS atau Markdown? | **CMS** sebagai sumber utama; Markdown sebagai arsip/fallback sementara | Artikel tetap tidak tayang |
| D2 | Landing page: `Pages` atau `LandingPages`? | **`Pages`** (sudah punya preview, SEO, blocks, draft); migrasi data lama | Dua sumber kebenaran berlanjut |
| D3 | Preview: SSR hybrid atau aplikasi preview terpisah? | **Astro hybrid + Cloudflare adapter**, route `/preview/**` sebagai on-demand | Preview tetap statis/tidak akurat |
| D4 | Media: lokal atau object storage? | **Cloudflare R2 + CDN** | Media hilang saat migrasi server, LCP buruk |
| D5 | Otomasi: langsung ke Payload API atau service perantara? | **Service perantara + MCP** dengan kontrak tool | Agent mengakses API mentah tanpa guard |
| D6 | Role: tetap 6 atau tambah `automation`? | **Tambah `automation`** dengan least privilege | API key bot terlalu kuat |
| D7 | Editorial workflow: sederhana atau penuh? | **Status + reviewer sign-off** minimal | Konten medis tanpa jejak review |
| D8 | Migrasi DB: `push: true` atau migrations-only? | **Migrations-only di production** | Risiko schema drift/data loss |

**Output minggu 1:** dokumen RFC singkat berisi keputusan D1–D8, disetujui tech lead + pemilik bisnis.

---

## 4. Tier 1 — Minimum Safe Release (26 dev-days)

Target: **tidak ada lagi kejadian “simpan sukses, website tidak berubah / gambar rusak / preview bohong”.**

### 4.1 Phase 0 — Stabilisasi & Keamanan (5,5 dev-days)

| ID | Task | Detail | Dep | Est | Acceptance Criteria |
|---|---|---|---|---:|---|
| FIX-001 | Set `serverURL` | Tambahkan `serverURL: process.env.NEXT_PUBLIC_SERVER_URL` di `payload.config.ts`; validasi env saat boot | — | 0,5 | URL media dimulai dengan `https://admin.kalababyspa.com` (atau CDN); tidak ada `src="/api/..."` di HTML publik |
| FIX-002 | Tutup eskalasi role | Field-level access `role` hanya superadmin; guard `beforeChange`; test API | — | 0,5 | `PATCH /api/users/{self}` dengan `role=superadmin` → 403; test otomatis lulus |
| FIX-003 | Filter akses publik | `read` anonim untuk Testimonials/Services/Areas/Midwives/FAQ mengembalikan `{active:true, permissionGranted:true}`; authenticated → semua | — | 0,5 | `GET /api/testimonials` anonim tidak memuat data nonaktif/non-consent |
| FIX-004 | Rotasi & hapus secret | Rotasi DB password, `PAYLOAD_SECRET`, password admin seed, API key bot; hapus fallback hardcoded | — | 0,5 | `grep` tidak menemukan password/key; boot gagal jika env kosong |
| FIX-005 | Deploy saat unpublish | Trigger deploy saat `active` berubah true→false (Services, Areas, Midwives, FAQ, Testimonials); tambah hook BlockTemplates | — | 0,5 | Uncheck “Tampil di Website” → build terpicu → konten hilang dari situs |
| FIX-006 | Hormati `order` | Tambah `sort=order` di semua fetch; hapus `preferredOrder` hardcoded; gunakan `recommended` untuk 3 unggulan | — | 0,5 | Mengubah `order`/`recommended` mengubah urutan situs |
| FIX-007 | Filter tanggal banner | Terapkan `bannerStartDate`/`bannerEndDate` di `BaseLayout` dengan timezone `Asia/Jakarta` | — | 0,5 | Banner hilang otomatis setelah tanggal berakhir |
| FIX-008 | Perbaiki query artikel | `where[status]` → `where[_status]`; tambahkan filter `_status=published` | — | 0,25 | Query tidak 400; hanya published yang diambil |
| FIX-009 | Sinkron harga/durasi | `price`/`duration` auto-derived dari `numericPrice`/`durationMinutes`; reset `confirmLargePriceChange` | — | 0,5 | Ubah angka → teks harga/durasi ikut berubah; guard harga tidak sticky |
| FIX-010 | Preview env & label | Tambah `PREVIEW_BASE_URL` ke `.env.example`; sembunyikan tombol preview yang belum valid | — | 0,25 | Preview tidak mengarah ke localhost di production |
| FIX-011 | Lindungi `/api/deploy-status` | Wajib user terautentikasi; atau hapus endpoint jika tidak dipakai | — | 0,25 | Request anonim → 401/403 |
| FIX-012 | Perluas test role | Uji read/create/update/delete + percobaan eskalasi untuk 6 role | — | 0,5 | Matriks role lulus; regresi role terdeteksi |
| FIX-013 | Backup pra-perubahan | Backup DB + media; verifikasi restore di staging | — | 0,25 | Restore berhasil; tercatat di runbook |

**Gate Phase 0:** semua test role lulus, tidak ada secret di repo, media tampil di staging.

---

### 4.2 Phase 1A — Artikel End-to-End (9 dev-days)

| ID | Task | Detail | Dep | Est | Acceptance Criteria |
|---|---|---|---|---:|---|
| ART-001 | RFC sumber artikel | Putuskan CMS sebagai sumber; definisikan kontrak field & fallback | D1 | 0,5 | RFC disetujui |
| ART-002 | Shared Lexical renderer | Ekstrak renderer dari `RichTextBlock`; dukung paragraph, heading, bold, italic, underline, link, list, quote, upload | — | 2 | Semua node yang didukung editor tampil benar |
| ART-003 | Route blog dari CMS | `blog/index.astro` + `blog/[...slug].astro` membaca `articles?where[_status][equals]=published&depth=2`; fallback Markdown saat kosong | ART-001, ART-002 | 2 | Artikel CMS muncul di `/blog` dan `/blog/[slug]` |
| ART-004 | Migrasi 3 artikel | Script Markdown → Lexical; map frontmatter, hero image, SEO, author, internal links | ART-003 | 1,5 | 3 artikel tampil identik/lebih baik; tidak ada broken link |
| ART-005 | Preview artikel | Route `/preview/blog/[slug]` dengan token; ambil draft | ART-003 | 1 | Draft terlihat sebelum publish |
| ART-006 | SEO & media artikel | OG image, canonical, JSON-LD Article, hero alt, `updatedDate` | ART-003 | 1 | Rich Results Test lolos; OG tampil di WhatsApp |
| ART-007 | E2E artikel | Playwright: create → preview → publish → live → unpublish | ART-003..006 | 1 | Test hijau di CI |

---

### 4.3 Phase 1B — Konsolidasi Landing Page (6 dev-days)

| ID | Task | Detail | Dep | Est | Acceptance Criteria |
|---|---|---|---|---:|---|
| LP-001 | Inventaris & mapping | Bandingkan `landing-pages` vs `pages` per slug; petakan field legacy → blok | D2 | 1 | Dokumen mapping disetujui marketing |
| LP-002 | Script migrasi | Migrasikan data ke `Pages`; pertahankan `refCode`, `variant`, `activePixels`, `pageLayout` | LP-001 | 2 | Semua slug ada di Pages; tidak ada duplikat |
| LP-003 | Konsolidasi route | `sales/[slug].astro` hanya membaca Pages; hapus prioritas `landing-pages` | LP-002 | 1 | Edit Pages → `/sales/[slug]` berubah |
| LP-004 | Deprekasi koleksi | Sembunyikan/hapus `LandingPages` dari config; banner legacy read-only | LP-003 | 0,5 | Tidak ada menu LandingPages di admin |
| LP-005 | Visual diff & QA | Bandingkan HTML/screenshot semua `/sales/*` sebelum vs sesudah | LP-003 | 1 | Tidak ada regresi visual |
| LP-006 | E2E landing | Create/duplicate → edit → preview → publish → live | LP-003..005 | 0,5 | Test hijau |

---

### 4.4 Phase 1C — Media & Aset (5,5 dev-days)

| ID | Task | Detail | Dep | Est | Acceptance Criteria |
|---|---|---|---|---:|---|
| MED-001 | Helper URL media | `mediaUrl()` absolut + terapkan di semua komponen | FIX-001 | 0,5 | Semua gambar CMS memakai URL absolut |
| MED-002 | R2 + CDN | Pasang `@payloadcms/storage-s3`; bucket R2; copy file lama; `publicURL` CDN | D4, MED-001 | 2 | Upload baru masuk R2; file lama tetap tampil |
| MED-003 | Astro Image | Gunakan `<Image>`/`srcset` untuk media CMS | MED-002 | 2 | LCP membaik; tidak ada layout shift |
| MED-004 | Backup & monitor media | Backup R2 terjadwal; monitor 404 gambar | MED-002 | 1 | Alert 404 < 1% pada 50 halaman teratas |

**Gate Tier 1:** E2E artikel, landing, media hijau; build produksi lolos; UAT dengan 1 operator + 1 marketing.

---

## 5. Tier 2 — Production-Grade (45,5 dev-days tambahan)

Target: alur kerja lengkap, aman, nyaman, dan bisa dipertanggungjawabkan.

### 5.1 Editorial & Validasi (11,5 dev-days)

| ID | Task | Detail | Dep | Est | Acceptance Criteria |
|---|---|---|---|---:|---|
| ED-001 | Overhaul validasi publish | Validasi selalu berjalan; wajib Hero + CTA nyata untuk landing; wajib content/layout; perbaiki `block.items`→`images`; tambah field alt galeri | — | 2 | Halaman kosong/landing tanpa CTA ditolak dengan pesan jelas |
| ED-002 | Error per field | Kembalikan `{errors:[{path,code,message}]}`; endpoint `/api/validate` dry-run | ED-001 | 2 | Agent/UI tahu field mana yang salah |
| ED-003 | Guard klaim medis | Blokir publish untuk kata terlarang; wajib reviewer sign-off | ED-001 | 3 | “pasti sembuh” tidak bisa publish |
| ED-004 | Autosave & schedule | Aktifkan `autosave` + `schedulePublish` di Articles/Pages | — | 1 | Draft tersimpan otomatis; publish terjadwal |
| ED-005 | Versions & trash | Versions + `trash: true` untuk semua koleksi konten | — | 1 | Restore/undo tersedia di UI |
| ED-006 | Author/reviewer relation | Relationship ke `midwives`/`users`; simpan `reviewedAt`, `reviewedBy`, `reviewNotes` | ED-003 | 1 | Profil penulis/reviewer konsisten |

### 5.2 Preview & Deploy (11 dev-days)

| ID | Task | Detail | Dep | Est | Acceptance Criteria |
|---|---|---|---|---:|---|
| PRV-001 | Preview SSR | Astro hybrid + Cloudflare adapter; route `/preview/**` on-demand; token JWT singkat | D3 | 3 | Draft tampil utuh (blok + Lexical) |
| PRV-002 | Preview semua koleksi | Articles, Pages, Services, Areas | PRV-001, ART-002 | 2 | Setiap koleksi punya preview |
| PRV-003 | Live preview benar | Kirim seluruh `data` via postMessage dan re-render; atau ganti label | PRV-001 | 2 | Perubahan blok terlihat real-time |
| DEP-001 | Status deploy nyata | Koleksi `deployments`; Cloudflare API; poll/webhook; simpan status | — | 2 | Status = status Cloudflare sebenarnya |
| DEP-002 | Dashboard status | Tampilkan pending/building/success/failed + URL + waktu | DEP-001 | 1 | Tidak ada “success palsu” |
| DEP-003 | Notifikasi & retry | Telegram/Slack + retry + dead-letter | DEP-001 | 1 | Build gagal diketahui < 1 menit |

### 5.3 UX & Dashboard (9 dev-days)

| ID | Task | Detail | Dep | Est | Acceptance Criteria |
|---|---|---|---|---:|---|
| UX-001 | Dashboard role-aware | Query sesuai izin; sembunyikan aksi tanpa izin; tautan per koleksi | FIX-002 | 2 | Tidak ada 403 dari dashboard |
| UX-002 | Persist SEO metrics | Simpan `metrics` + `engineVersion`; tombol recount | — | 1 | Dashboard tidak menghitung ulang tiap load |
| UX-003 | Terminology cleanup | Satukan istilah: Halaman, Landing Page, Status, Blok; hapus “Elementor/Mode Klasik” | — | 2 | Glosarium disetujui tim |
| UX-004 | Role matrix UI | Badge read-only; pesan izin; menu tidak usable disembunyikan | FIX-012 | 1 | Semua role bisa menjelaskan aksesnya |
| UX-005 | Contextual help | Link dari field kompleks ke Help Center; tooltip | — | 1 | 10 field tersulit punya bantuan |
| UX-006 | Inbox status | “Perlu review”, “Perlu deploy”, “Gagal build” | DEP-001, ED-006 | 2 | Editor tahu apa yang harus dikerjakan |

### 5.4 Konten & SEO (5,5 dev-days)

| ID | Task | Detail | Dep | Est | Acceptance Criteria |
|---|---|---|---|---:|---|
| CMS-001 | Homepage copy lengkap | Differentiators, section headings, trust badges, CTA copy di CMS | — | 2 | Marketing bisa ubah tanpa developer |
| CMS-002 | Jam & area terstruktur | Field hours + coverage areas; JSON-LD memakai data CMS | — | 1 | Schema area/jam sesuai CMS |
| SEO-001 | Skor SEO substantif | Word count, keyword di body/H1/desc, internal links, readability | — | 1 | Artikel 50 kata tidak bisa skor 100 |
| SEO-002 | Sitemap lastmod | Gunakan `updatedAt` per halaman | — | 0,5 | `lastmod` akurat |
| SEO-003 | Halaman audit SEO | Daftar isu lintas koleksi + filter + “Perbaiki” | UX-002 | 1 | Tidak perlu kembali ke dashboard |

### 5.5 Media Lanjutan & Data (7,5 dev-days)

| ID | Task | Detail | Dep | Est | Acceptance Criteria |
|---|---|---|---|---:|---|
| MED-005 | Media library | Folder, pencarian, crop/focal point, batas ukuran, PDF | MED-002 | 3 | Editor bisa kelola 100+ aset |
| MED-006 | Orphan & consent | Cleanup media yatim; migrasi consent testimoni | FIX-003 | 1 | Tidak ada media yatim; consent tercatat |
| DAT-005 | Standarisasi status | `draft/in_review/scheduled/published/archived` semua koleksi | ED-004 | 1 | Satu model status |
| DAT-006 | Relasi layanan | `availableServices` → relationship; hapus teks duplikat | — | 1,5 | Tidak ada layanan “hantu” |
| DAT-007 | Slug & redirect | Auto-redirect saat slug berubah; suffix unik; validator slug semua koleksi | — | 1 | URL lama tidak 404 |
| DAT-008 | Optimistic lock | Cegah overwrite saat dua editor | ED-005 | 1 | Konflik terdeteksi |

**Gate Tier 2:** UAT penuh dengan bidan, operator, marketing, SEO; semua E2E hijau; tidak ada P0/P1 terbuka; rollback teruji.

---

## 6. Tier 3 — Automation-Ready & Complete (48 dev-days tambahan)

Target: agent AI bisa bekerja aman, idempoten, dan terverifikasi; seluruh P2 tertutup.

### 6.1 Fondasi Otomasi (16 dev-days)

| ID | Task | Detail | Dep | Est | Acceptance Criteria |
|---|---|---|---|---:|---|
| AUT-001 | RFC otomasi | Pilih service perantara + MCP; definisikan aktor, izin, audit | D5 | 0,5 | RFC disetujui |
| AUT-002 | Service automation | `apps/automation` (Fastify/tRPC), service user least privilege | AUT-001 | 2 | Service bisa CRUD terbatas |
| AUT-003 | Tool contract | Zod schema + contoh payload untuk 12 tool | AUT-002 | 3 | Kontrak terdokumentasi & tervalidasi |
| AUT-004 | Idempotency | `Idempotency-Key` + hash payload + `externalId` unik | AUT-002 | 2 | Retry tidak membuat duplikat |
| AUT-005 | Dry-run validation | `/validate` memakai validator yang sama; error per field | ED-002, AUT-003 | 2 | Agent bisa validasi sebelum write |
| AUT-006 | Markdown & block helper | Markdown→Lexical; schema/contoh blok; template API | ART-002, AUT-003 | 3 | Agent bisa menulis artikel/blok tanpa menebak JSON |
| AUT-007 | Media tool | Upload + alt + URL absolut + transformasi | MED-002, AUT-003 | 1 | Upload terverifikasi |
| AUT-008 | Deploy job | Queue + `deployId` + status + retry | DEP-001, AUT-002 | 2 | Agent bisa menunggu build selesai |
| AUT-009 | OpenAPI | Generate dari Zod; publish `/openapi.json` | AUT-003 | 1 | Spec valid & bisa dipakai generator client |

### 6.2 Integrasi & Tata Kelola (14 dev-days)

| ID | Task | Detail | Dep | Est | Acceptance Criteria |
|---|---|---|---|---:|---|
| AUT-010 | MCP server | Expose tool contract via MCP; auth bearer; rate limit | AUT-003, AUT-009 | 3 | Agent bisa memanggil tool via MCP |
| AUT-011 | Outbound webhooks | `content.published`, `deploy.succeeded/failed`; HMAC + retry | DEP-001 | 2 | Konsumen menerima event terverifikasi |
| AUT-012 | Audit log | `actor`, `action`, `before/after`, `timestamp`, `ip` | AUT-002 | 2 | Semua write agent tercatat |
| AUT-013 | Scoped API key | Role `automation`; scope per koleksi; rotasi | FIX-002 | 2 | Key bot tidak bisa ubah harga/pages |
| AUT-014 | Sandbox | Staging DB anonim + seed reset + feature flag | — | 1 | Agent bisa uji tanpa menyentuh produksi |
| AUT-015 | Contract tests | Test setiap tool + skenario gagal/retry | AUT-003 | 2 | >95% tool test lulus |
| AUT-016 | Dokumentasi agent | Contoh prompt, alur, batasan, error handling | AUT-009 | 1 | Developer/agent bisa onboarding < 1 hari |

### 6.3 P2 Batches (13 dev-days)

| Batch | Item P2 | Fokus | Est |
|---|---|---|---:|
| P2-A | 1,3,4,5,6,7,8,9,10,15,16,22,23,24,30,31,33,37,38,39,40 | Validasi, slug, harga, default, duplikasi | 3 |
| P2-B | 2,11,12,13,14,17,18,19,25,26,27,28,32,35,36 | Ops, keamanan, SEO, dokumen | 3 |
| P2-C | 20,21,29,34 | Dark mode, CSS fragility, akses media, status ganda | 3 |
| P2-D | MED-006 lanjutan, consent, moderasi testimoni | Privasi & kebersihan data | 2 |
| P2-E | Dokumentasi, SOP, training, video singkat | Adopsi tim | 2 |

### 6.4 Hardening & Go-Live (5 dev-days)

| ID | Task | Est | Acceptance |
|---|---|---:|---|
| FIN-001 | Security review independen | 1 | Tidak ada critical/high |
| FIN-002 | Load test dashboard/API | 1 | 500 dokumen < 2 detik |
| FIN-003 | UAT 4 persona | 2 | Semua skenario lulus |
| FIN-004 | Go-live + monitoring 2 minggu | 1 | Tidak ada regresi P0/P1 |

---

## 7. Playbook Migrasi

### 7.1 Migrasi Artikel (Markdown → CMS)

**Pra-syarat:** FIX-001, ART-002, ART-003 selesai.

1. **Backup** DB + repo + file Markdown.
2. **Feature flag** `USE_CMS_ARTICLES=false`.
3. **Import script:**
   - Parse frontmatter (`title`, `description`, `pubDate`, `author`, `category`, `keywords`).
   - Konversi Markdown → Lexical (heading, list, link, bold, image, blockquote).
   - Upload hero image ke Media (atau set `heroImageUrlFallback`).
   - Map SEO (`metaTitle`, `metaDescription`, `focusKeyword`).
   - Set `_status=published` hanya setelah QA.
4. **Validasi:** bandingkan teks, link, gambar, dan struktur heading untuk 3 artikel.
5. **Staging:** aktifkan flag; jalankan E2E.
6. **Production:** aktifkan flag; rebuild; verifikasi.
7. **Soak 2 minggu:** pertahankan Markdown sebagai rollback.
8. **Cleanup:** hapus content collection atau jadikan arsip.

**Rollback:** matikan flag → Markdown kembali digunakan.

### 7.2 Migrasi Landing Page (`LandingPages` → `Pages`)

1. **Inventaris:** ekspor semua dokumen dari kedua koleksi; diff per slug.
2. **Mapping field legacy → blok:**
   - `headline/subheadline/price/duration` → `hero`
   - `painPoints` → `painPoints`
   - `solutions` → `solutions`
   - `steps` → `steps`
   - `testimonial` → `testimonials`
   - `faqs` → `faq`
   - `refCode/variant/activePixels/pageLayout` → field halaman.
3. **Migrasi** dengan `_status=published` hanya jika legacy `active=true`.
4. **Visual diff:** screenshot sebelum/sesudah untuk semua `/sales/*`.
5. **Feature flag** `USE_PAGES_FOR_SALES`; aktifkan di staging.
6. **Production:** aktifkan; monitor 1 minggu.
7. **Deprekasi:** sembunyikan `LandingPages`; setelah 30 hari hapus config (tabel DB disimpan untuk rollback).

**Rollback:** matikan flag → route kembali ke `landing-pages`.

### 7.3 Migrasi Media (Lokal → R2)

1. Provision bucket R2 + custom domain CDN.
2. Pasang adapter S3; set `publicURL`.
3. Copy `apps/cms/public/media/**` ke bucket dengan key yang sama.
4. Verifikasi semua URL lama (via mapping `serverURL`/`publicURL`).
5. Upload baru langsung ke R2.
6. Monitor 404 2 minggu; cleanup file lokal setelah yakin.
7. Backup R2 harian (versioning + lifecycle).

### 7.4 Perbaikan Role

1. Susun matriks role × koleksi × aksi (termasuk field-level).
2. Buat user uji per role di staging.
3. Implementasi access + field-level access.
4. Jalankan test matrix (read/create/update/delete + eskalasi).
5. Rotasi API key bot; buat role `automation`.
6. Dokumentasikan di Help Center.
7. Monitoring percobaan 403/eskalasi.

### 7.5 Migrasi DB & `push: true`

1. Ambil baseline schema dari DB produksi.
2. Nonaktifkan `push` di production.
3. Generate migration untuk semua perubahan tertunda.
4. Uji di salinan staging.
5. Backup → apply → verifikasi.
6. Rollback: restore snapshot + redeploy versi sebelumnya.
7. Tambahkan langkah migrasi ke pipeline deploy.

---

## 8. Strategi Testing

| Level | Alat | Cakupan | Gate |
|---|---|---|---|
| Unit | Vitest | Validator, SEO engine, slug, access function, konversi Markdown | Coverage ≥ 80% untuk modul kritis |
| Integration | Payload test + Postgres container | Hooks, publish/unpublish, versions, redirect, deploy trigger | Semua hook lulus |
| E2E | Playwright | Artikel, landing, media, preview, role, banner, harga | Semua skenario kritis |
| Role Matrix | Script/test | 6 role + `automation` × koleksi × aksi | Tidak ada akses tak terduga |
| Visual | Playwright screenshot | Blok, halaman, landing | Diff < threshold |
| Contract | Vitest + Zod | Tool automation | >95% lulus |
| Security | OWASP ZAP + manual | Auth, IDOR, role escalation, API publik | Tidak ada critical/high |
| Accessibility | axe-core | Admin & halaman publik | Tidak ada violation serius |
| Load | k6 | Dashboard 500 dokumen, API 100 RPS | P95 < 2 detik |
| DR | Restore drill | DB + media | RTO < 30 menit |

**CI pipeline wajib:**
1. Lint + typecheck (`tsc --noEmit`).
2. Unit + integration.
3. Build CMS + frontend.
4. E2E terhadap staging.
5. Security scan + secret scan.
6. Deploy preview + smoke test.

---

## 9. Release & Rollback

### Urutan Deploy
1. Backup DB + media.
2. Jalankan migrasi DB (backward compatible).
3. Deploy CMS (fitur baru di balik flag).
4. Deploy frontend.
5. Smoke test.
6. Aktifkan flag.
7. Monitor 30 menit.

### Feature Flag
- `USE_CMS_ARTICLES`
- `USE_PAGES_FOR_SALES`
- `USE_R2_MEDIA`
- `USE_SSR_PREVIEW`
- `USE_NEW_DEPLOY_STATUS`

### Rollback
- **Konten:** matikan flag → build ulang versi sebelumnya.
- **Kode:** redeploy commit sebelumnya.
- **DB:** restore snapshot (hanya jika migrasi destruktif).
- **Media:** fallback ke `staticDir` lokal selama 30 hari.
- **Role:** jalankan `set:superadmin` darurat.

**Aturan:** tidak ada migrasi destruktif tanpa snapshot + uji restore.

---

## 10. Operasional & Monitoring

| Area | Alat/Metrik | Target |
|---|---|---|
| Error tracking | Sentry (CMS + frontend) | Error rate < 0,5% |
| Uptime | UptimeRobot/Cloudflare | 99,9% |
| Build | Cloudflare API + alert | Failure < 2% |
| Media 404 | Log + alert | 0 pada 50 halaman teratas |
| Publish latency | `deployments` | P95 < 3 menit |
| Publish success | `deployments` | ≥ 99% |
| SEO coverage | Audit engine | ≥ 80% konten skor ≥ 80 (versi baru) |
| Medical review | Workflow | 100% artikel direview |
| Agent success | Contract test | ≥ 95% |
| Security | Scan | 0 critical/high |

**Runbook baru wajib mencakup:** deploy status, preview token, R2 restore, role emergency, rollback flag.

---

## 11. Ownership & Cadence

| Peran | Tanggung jawab |
|---|---|
| Tech Lead / Backend | CMS, access, API, deploy, migrasi |
| Frontend | Astro routes, renderer, preview, images |
| DevOps | R2, Cloudflare, CI/CD, backup, monitoring |
| QA | Test plan, E2E, UAT, regression |
| Content Ops | Migrasi konten, QA editorial, SOP |
| Medical Reviewer | Sign-off konten medis |
| Marketing | Landing page, tracking, UAT |

**Cadence:**
- Daily standup 15 menit.
- Weekly demo ke stakeholder.
- Sprint review + retrospective tiap 2 minggu.
- Change freeze 3 hari sebelum go-live.
- Security review bulanan; DR drill kuartalan.

---

## 12. Risk Register

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Migrasi artikel kehilangan format | Konten rusak | Backup, visual diff, feature flag, soak 2 minggu |
| Migrasi landing mengubah tampilan | Konversi turun | Screenshot diff, canary 1 slug, rollback flag |
| R2 migration memutus gambar | Halaman rusak | Copy dulu, dual-read, monitor 404 |
| Perbaikan role mengunci user | Operasional berhenti | Uji staging, akun darurat, `set:superadmin` |
| `push` dimatikan, migration gagal | CMS down | Snapshot, uji restore, deploy bertahap |
| Preview SSR menambah biaya/latensi | Biaya naik | Token, cache, rate limit, hanya route preview |
| Otomasi disalahgunakan | Konten rusak | Scoped key, audit, approval publish, rate limit |
| Timeline melebar | Peluncuran tertunda | Tiering, P2 ditunda, buffer 15% |
| Cloudflare API rate limit | Status deploy telat | Poll 30 detik, cache, webhook |
| Konten medis salah | Risiko hukum | Reviewer sign-off, guard klaim, audit |

---

## 13. Traceability — Semua Temuan Audit

### P0

| Temuan | Task |
|---|---|
| P0-1 Artikel tidak tayang | ART-001..007, FIX-008 |
| P0-2 Media URL relatif | FIX-001, MED-001..004 |
| P0-3 Landing ganda | LP-001..006 |
| P0-4 Eskalasi role | FIX-002, AUT-013, FIX-012 |
| P0-5 Preview menyesatkan | PRV-001..003, ART-005, FIX-010 |
| P0-6 Testimoni belum consent terekspos | FIX-003, MED-006, ED-006 |
| P0-7 Secret di repo | FIX-004, FIN-001 |
| P0-8 Unpublish tidak deploy | FIX-005, DEP-003 |

### P1

| Temuan | Task |
|---|---|
| P1-1 Harga basi | FIX-009, DAT-001 (digabung) |
| P1-2 Order/recommended tidak dipakai | FIX-006, DAT-002 |
| P1-3 Banner tanggal diabaikan | FIX-007, CMS-002 |
| P1-4 Validasi publish bocor | ED-001..003 |
| P1-5 Rich text hilang format | ART-002 |
| P1-6 Slug berubah → 404 | DAT-007 |
| P1-7 Tidak ada schedule/autosave/review | ED-003..006 |
| P1-8 Dashboard menyesatkan | UX-001, UX-002, DEP-001..003 |
| P1-9 Status tidak konsisten | DAT-005 |
| P1-10 Relasi teks bebas | DAT-006, ED-006 |
| P1-11 Homepage sebagian hardcoded | CMS-001, CMS-002, SEO-003 |
| P1-12 Media lokal/tanpa optimasi | MED-002..005 |
| P1-13 Tanpa versions/rollback | ED-005, DAT-008 |
| P1-14 Navigasi vs izin tidak selaras | UX-004, FIX-012 |
| P1-15 Skor SEO dangkal | SEO-001..003, UX-002 |

### P2 — 40 Item

| Batch | Item | Task |
|---|---|---|
| P2-A | 1,3,4,5,6,7,8,9,10,15,16,22,23,24,30,31,33,37,38,39,40 | Validasi, slug, harga, default, duplikasi |
| P2-B | 2,11,12,13,14,17,18,19,25,26,27,28,32,35,36 | Ops, keamanan, SEO, dokumen |
| P2-C | 20,21,29,34 | Dark mode, CSS, media, status ganda |
| P2-D | Consent & moderasi testimoni | FIX-003, MED-006 |
| P2-E | Dokumentasi & training | FIN-003, AUT-016 |

---

## 14. 10 Hari Pertama — Rencana Harian

| Hari | Fokus | Output |
|---|---|---|
| 1 | Backup, rotasi secret, `serverURL`, role access | Phase 0 aman |
| 2 | Access filter, deploy saat unpublish, order, banner, harga | Phase 0 selesai |
| 3 | Test role + regression + deploy staging | Gate Phase 0 |
| 4 | RFC D1–D8, shared Lexical renderer | Keputusan & fondasi |
| 5 | Route blog CMS + fallback | Artikel bisa tayang |
| 6 | Import 3 artikel + preview | Konten CMS live di staging |
| 7 | E2E artikel + perbaikan | Gate artikel |
| 8 | Inventaris landing + mapping | Rencana migrasi |
| 9 | Script migrasi landing | Data pindah |
| 10 | Visual diff + demo stakeholder | Gate Tier 1 awal |

**Demo hari 10:** tunjukkan satu artikel CMS tayang, satu landing page diedit dari menu yang benar, satu gambar upload tampil, dan satu unpublish benar-benar hilang.

---

## 15. Definition of Done (Global)

Sebuah task dianggap selesai jika:
- [ ] Kode + test unit/integration lulus.
- [ ] Typecheck + lint lulus.
- [ ] E2E terkait lulus di staging.
- [ ] Tidak ada regresi akses role.
- [ ] Dokumentasi/SOP diperbarui.
- [ ] Monitoring/alert ditambahkan bila relevan.
- [ ] Rollback diuji.
- [ ] Product owner/QA menyetujui.

**Gate akhir “CMS siap”:**
- [ ] Tidak ada P0/P1 terbuka.
- [ ] Semua E2E kritis hijau.
- [ ] Media 404 = 0 pada halaman utama.
- [ ] Publish success ≥ 99% selama 2 minggu.
- [ ] Role matrix lulus.
- [ ] Review medis 100% untuk artikel baru.
- [ ] Agent contract test ≥ 95% (jika Tier 3).
- [ ] Backup + restore drill berhasil.
- [ ] Runbook & SOP diperbarui.

---

## 16. Penutup

Rencana ini sengaja dibuat **bertahap**, bukan “big bang”. Tier 1 sudah menghilangkan sebagian besar rasa frustrasi pengguna: artikel tayang, landing page bisa diedit, gambar tampil, preview jujur, dan unpublish benar-benar bekerja. Tier 2 membuat CMS nyaman dan aman untuk operasional harian. Tier 3 membuka otomasi AI yang terkendali.

Yang paling penting: **jangan menambah fitur baru sebelum lima fondasi ini beres** — satu sumber kebenaran, preview valid, status deploy nyata, izin yang tidak bisa dilewati, dan kontrak API yang jelas.
