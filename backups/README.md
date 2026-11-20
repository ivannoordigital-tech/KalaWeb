# Backup Konten Landing Page

Folder ini menyimpan salinan JSON dokumen CMS untuk pemulihan cepat jika konten di database berubah atau rusak.

## Daftar backup

| Tanggal | Dokumen | File |
|---|---|---|
| 2026-11-20 | Page ID 11 `promo-treatment` | `pages/page-11-promo-treatment-2026-11-20.json` |
| 2026-11-20 | Page ID 11 versi **published** (setelah patch CTA) | `pages/page-11-promo-treatment-2026-11-20-published.json` |
| 2026-11-20 | PageTemplate ID 1 `template-landing-ads-10-sections` | `page-templates/template-1-landing-ads-2026-11-20.json` |
| 2026-11-20 | HTML preview draft (baseline) | `render/promo-treatment-preview-2026-11-20.html` |
| 2026-11-20 | Hasil patch CTA (sebelum publish) | `render/pages-11-after-cta-patch-*.json` |
| 2026-11-20 | Screenshot live 375px | `render/live-mobile-375-2026-11-20.png` |
| 2026-11-20 | Screenshot live 1440px | `render/live-desktop-1440-2026-11-20.png` |
| 2026-11-20 | Screenshot build lokal Page 11 (375/1440) | `render/local-build-promo-*.png` |
| 2026-11-20 | Screenshot live setelah Fase 2 (375/1440) | `render/live-phase2-promo-*.png` |
| 2026-11-20 | Screenshot live setelah Fase 4 (375/1440) | `render/live-phase4-promo-*.png` |
| 2026-11-20 | Screenshot preview draft dengan CSP baru | `render/preview-after-csp.png` |
| 2026-11-20 | Halaman legacy sebelum/sesudah scoping CSS | `render/legacy-before-mobile-375.png`, `render/legacy-after-mobile-375.png`, `render/legacy-after-phase2-mobile-375.png` |
| 2026-11-20 | Snapshot CSS CMS (scoped) | `../docs/assets/landing-page.cms-snapshot.css` |
| 2026-11-20 | Screenshot consent desktop (setelah fix z-index) | `render/live-consent-desktop-1440-2026-11-20.png` |
| 2026-11-20 | Screenshot consent mobile (setelah fix z-index) | `render/live-consent-mobile-375-2026-11-20.png` |

## Cara membuat backup baru

Gunakan API key bot CMS (environment `CMS_BOT_API_KEY`):

```bash
curl -H "Authorization: users API-Key $CMS_BOT_API_KEY" \
  "https://admin.kalababyspa.com/api/pages/11?depth=0&draft=true" \
  -o backups/pages/page-11-$(date +%F).json
```

Untuk template:

```bash
curl -H "Authorization: users API-Key $CMS_BOT_API_KEY" \
  "https://admin.kalababyspa.com/api/page-templates/1?depth=0" \
  -o backups/page-templates/template-1-$(date +%F).json
```

## Cara restore

Restore hanya `layout` (blok), bukan seluruh dokumen, agar field lain tidak tertimpa:

```bash
node -e "const d=require('./backups/pages/page-11-promo-treatment-2026-11-20.json');require('fs').writeFileSync('/tmp/layout.json',JSON.stringify({layout:d.layout}))"

curl -X PATCH \
  -H "Authorization: users API-Key $CMS_BOT_API_KEY" \
  -H "Content-Type: application/json" \
  --data @/tmp/layout.json \
  "https://admin.kalababyspa.com/api/pages/11?draft=true"
```

Setelah restore, buka preview draft di CMS sebelum publish.

Catatan:

- Payload menyimpan maksimal 25 versi per dokumen (`maxPerDoc: 25`), jadi riwayat di CMS juga bisa dipakai sebagai lapisan pertama rollback.
- Jangan menyimpan API key di dalam file backup.
