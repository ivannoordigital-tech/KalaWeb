# Progres Perbaikan Landing Page Ads — Fase 0 & 1

**Tanggal:** 20 November 2026
**Ruang lingkup:** Page ID 11 (`promo-treatment`) + PageTemplate ID 1
**Referensi rencana:** `docs/rencana-perbaikan-landing-ads-2026-11-20.md`
**Commit:** `759e801` (fix(cms): dukung publish landing berbasis blok HTML + guard CTA mobile)

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
| URL publik | diverifikasi setelah build Cloudflare |

---

## 4. Pekerjaan tersisa (Fase 2–7)

1. **Fase 2:** hapus impor `landing-page.css` dari route sales; scope selector ke `.kala-html-raw`.
2. **Fase 3:** field `layoutMode` eksplisit.
3. **Fase 4:** role gate `allowScripts`, sanitasi saat simpan, CSP per path.
4. **Fase 5:** perbaikan listener iframe.
5. **Fase 6:** dimensi gambar, JSON-LD, disclaimer, link check.
6. **Fase 7:** Playwright smoke test, backup harian, dokumentasi.

---

## 5. Catatan operasional

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
