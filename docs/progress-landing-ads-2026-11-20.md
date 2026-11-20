# Progres Perbaikan Landing Page Ads — Fase 0, 1 & 2

**Tanggal:** 20 November 2026
**Ruang lingkup:** Page ID 11 (`promo-treatment`) + PageTemplate ID 1
**Referensi rencana:** `docs/rencana-perbaikan-landing-ads-2026-11-20.md`
**Commit:** `759e801` (validator + patch CTA), `90df638` (dokumentasi), `1a56121` (consent z-index + perbaikan sisip CSS), `199e1c0` (scoping CSS + hapus impor global)

---

## 1. Temuan kritis saat audit

| Temuan | Bukti | Dampak |
|---|---|---|
| Page 11 masih berstatus **draft** | `GET /api/pages/11` → `_status: draft` | URL publik `/sales/promo-treatment` mengembalikan **404**, bukan live seperti yang dilaporkan |
| Validator publish menolak halaman HTML-only | `MISSING_HERO_BLOCK` + `MISSING_WHATSAPP_CTA` | Publish dari admin akan gagal |
| Floating WhatsApp tampil di mobile | Blok #11 memakai `10-floating-wa.html` tanpa aturan responsif | Bertumpuk dengan `MobileStickyBar` (z-40 vs z-60) |
| CTA tidak ter-track | Tidak ada kelas `kala-wa-btn` / `data-ref-code`; semua URL identik | Klik tidak masuk dataLayer, Meta, TikTok, Clarity; tidak ada atribusi per section |
| Sumber CSS ganda | File repo + blok CMS | Risiko drift (diselesaikan di Fase 2) |
| Konten hanya ada di DB | Tidak ada di seed/repo | Risiko hilang saat restore (mitigasi: backup JSON) |

---

## 2. Tindakan yang dilakukan

### 2.1 Backup (Fase 0)

- `backups/pages/page-11-promo-treatment-2026-11-20.json`
- `backups/page-templates/template-1-landing-ads-2026-11-20.json`
- `backups/render/promo-treatment-preview-2026-11-20.html` (baseline render)
- `backups/render/*-after-cta-patch-*.json` (snapshot hasil transformasi)
- Prosedur restore: `backups/README.md`

### 2.2 Validator publish

`apps/cms/src/utilities/pageBuilderValidators.ts`:

- Mendeteksi `<h1>` di dalam blok `html` sebagai pemenuhan syarat hero.
- Mendeteksi CTA WhatsApp (`wa.me`, `api.whatsapp.com`, `whatsapp://`) atau tautan `kalababyspa.com|online/(cta|reservasi)` di blok `html`.
- Aturan blok native tidak berubah.

Test: `apps/cms/src/scripts/test-validation-html.ts` → **10/10 lulus** (`npm run test:validation-html`).

### 2.3 Patch konten Page 11 + Template 1

`apps/cms/src/scripts/patch-landing-page11-cta.ts` (idempoten, dry-run default):

- Menambahkan guard CSS:
  ```css
  @media (max-width:767px){.float-wa{display:none!important}}
  #booking,#layanan{scroll-margin-top:96px}
  ```
- Menambahkan kelas `kala-wa-btn` pada 8 CTA agar ditangkap `tracker.js`.
- Menambahkan `data-ref-code` + parameter `ref` per section:
  - `KALA-LP-ADS-PROMO`
  - `KALA-LP-ADS-SERVICES`
  - `KALA-LP-ADS-FINAL`
  - `KALA-LP-ADS-FLOATING`

Verifikasi di dokumen published:

- `kala-wa-btn`: 8
- `data-ref-code`: 8
- `ref=KALA-LP-ADS-*`: 8
- Guard mobile: ada
- iframe: 0

### 2.4 Deploy CMS & publish

1. Commit dipush ke `origin/main`.
2. VPS `klinik-server-baru` (`/opt/kalaweb`) di-`git pull`.
3. Container CMS dibangun ulang: `docker compose up -d --build cms` (selesai ~2 menit).
4. Page 11 di-publish via API.
5. Deploy hook Cloudflare menerima webhook **HTTP 200** untuk `[PUBLISH] Pages (promo-treatment)`.

---

## 3. Status halaman

| Item | Status |
|---|---|
| Status dokumen | `published` |
| Jumlah blok | 11 |
| iframe | 0 |
| Font | Fredoka / Nunito |
| CTA tracked | 8 |
| Template 1 | 11 blok, guard + 8 ref |
| URL publik | `https://kalababyspa.com/sales/promo-treatment/` → **HTTP 200** |

Catatan: URL tanpa trailing slash mengembalikan **307** ke versi ber-trailing-slash. Gunakan URL final di dashboard iklan agar tidak ada hop tambahan.

### 3.1 Verifikasi live (headless Chrome)

| Viewport | Overflow horizontal | Floating WA | Sticky bar | iframe | Font H1 |
|---|---|---|---|---|---|
| 375×812 | tidak | `display:none` | muncul setelah scroll | 0 | Fredoka |
| 1440×900 | tidak | `display:flex` | tidak tampil | 0 | Fredoka |

- Floating WA dan sticky bar **tidak overlap** di mobile.
- 8 CTA memakai `ref` unik; 1 CTA tambahan berasal dari `MobileStickyBar` (`KALA-MOB-BAR`).
- Guard CSS sempat salah tempel di luar `</style>` pada publish pertama; sudah diperbaiki dan diverifikasi ulang (marker berada di dalam `<style>`).
- Banner consent dinaikkan ke `z-[70]` agar tombol "Saya Mengerti & Setuju" tidak tertutup floating WhatsApp di desktop.
- Verifikasi `elementFromPoint` pada tombol consent: desktop dan mobile sama-sama mengembalikan `#acceptConsentBtn` sebagai elemen teratas (banner z-index 70 > float 60).

---

## 4. Pekerjaan tersisa (Fase 4-7)

1. **Fase 4:** role gate `allowScripts`, sanitasi saat simpan, CSP per path.
2. **Fase 5:** perbaikan listener iframe.
3. **Fase 6:** dimensi gambar, JSON-LD, disclaimer, link check.
4. **Fase 7:** Playwright smoke test, backup harian, dokumentasi.

---

## 5. Fase 2 — Satu sumber kebenaran CSS

### 5.1 Perubahan

1. **Blok CSS CMS menjadi satu-satunya sumber styling.** Impor `landing-page.css` dihapus dari:
   - `apps/web-kala/src/pages/sales/[slug].astro`
   - `apps/web-kala/src/pages/editor-view/sales/[slug].astro`
2. File lama dipindahkan ke `docs/assets/landing-page.reference.css` sebagai arsip desain.
3. Selector CSS di CMS di-scope ke `.kala-html-raw`:
   - `body` → `.kala-html-raw`
   - `section`, `p`, `img`, `a`, `h1–h4`, `footer` → turunan `.kala-html-raw`
   - `:root` dan `html` tetap global (token warna dan smooth scroll)
   - 119 rule, **0 selector lolos scope**
4. Snapshot CSS aktif disimpan di `docs/assets/landing-page.cms-snapshot.css`.
5. Script baru:
   - `scripts/scope-landing-css.mjs` — transformasi CSS global → scoped.
   - `scripts/check-landing-css.mjs` (`npm run check:landing-css`) — deteksi drift antara CMS dan snapshot.

### 5.2 Verifikasi

| Cek | Hasil |
|---|---|
| Build lokal `npm run build --workspace=web-kala` | lulus |
| Page 11 di build lokal (375 & 1440) | identik dengan live: tanpa overflow, font Fredoka/Nunito, 0 iframe, 9 CTA |
| Halaman legacy `/sales/bayi-kolik` | tidak rusak; jarak section kembali ke padding Tailwind (menghapus efek samping `section{padding:76px 0}` global) |
| `npm run check:landing-css` | sinkron |
| Live setelah deploy (commit `199e1c0`) | Page 11 375/1440 identik, tanpa overflow, float mobile `none`, 0 iframe, 9 CTA |
| Bundle CSS live | landing CSS global tidak lagi dimuat (hanya 1 stylesheet, bukan 2) |
| Legacy live setelah deploy | sama dengan build lokal; header, kartu, CTA, consent tetap utuh |

Catatan: halaman legacy memang berubah sedikit (lebih rapat) karena efek bocor CSS global dihapus. Ini mengembalikan tampilan ke padding native Tailwind, bukan regresi.

---

## 6. Fase 3 — Layout mode eksplisit (tanpa migration)

**Keputusan:** tidak menambah kolom `layoutMode` karena adapter Postgres memakai `push: false`; kolom baru memerlukan migration production. Kontrak raw dibuat eksplisit dari kombinasi field yang sudah ada:

```
raw       = maxWidth: 'full' + padding: 'none'
contained = kombinasi lainnya
```

**Perubahan:**

1. Helper baru `apps/web-kala/src/lib/htmlBlockLayout.ts`:
   - `resolvesToRawLayout(block)` — mengabaikan `background`.
   - `rawBackgroundStyle(background)` — menghasilkan `background:#...` untuk mode raw.
2. `HtmlBlock.astro` memakai helper; wrapper raw mendapat inline style background.
3. Deskripsi field `maxWidth`, `padding`, dan `background` di CMS diperbarui.
4. Test baru `npm run test:htmlblock-layout` — **13/13 lulus**.
5. Verifikasi markup lewat fixture build:
   - raw peach → `<div class="kala-html-raw w-full" style="background:#FFEFE5">`
   - contained cream → `<section class="py-10 md:py-14 bg-[#FFF9F4]">`

**Dampak:** marketing bisa mengganti background section menjadi peach/cream tanpa memunculkan padding container; tidak ada perubahan data atau schema.

---

## 7. Catatan operasional

Deploy CMS (manual, jika diperlukan):

```bash
ssh klinik-server-baru
cd /opt/kalaweb && git pull --ff-only origin main
cd apps/cms && docker compose up -d --build cms
```

Rollback:

- Konten: restore `layout` dari backup JSON (lihat `backups/README.md`) atau versi Payload.
- Kode CMS: `git revert 759e801`, lalu build ulang container.
- Web: rollback deployment Cloudflare sebelumnya.
