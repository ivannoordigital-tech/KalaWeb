# Rencana Perbaikan Visual Page Builder (Pasca-Audit)

**Tanggal:** 1 November 2026
**Basis:** audit commit `b24119a` + verifikasi live `admin.kalababyspa.com` & `kalababyspa.com`
**Prinsip:** tanpa migrasi schema, security-first, tanpa autosave, kompatibel dengan data lama.

---

## Ringkasan Temuan & Prioritas

| ID | Temuan | Dampak | Prioritas |
|---|---|---|---|
| P0-1 | Web produksi masih build lama → `/preview/*` 404 | Preview builder tidak bisa dipakai | Blocker |
| P0-2 | Default registry berisi nilai select tidak valid | Simpan gagal setelah tambah Hero/PainPoints/Midwife | Blocker |
| P0-3 | Media picker memanggil `onUpdate` 2x → foto hilang | Foto tidak terpasang | Blocker |
| P0-4 | Fallback secret JWT & API key hardcoded | Token preview bisa dipalsukan | Keamanan |
| P0-5 | `set:html` tanpa escape di RichTextBlock | Stored XSS | Keamanan |
| P1-1 | `preflight:false` tanpa reset → border tidak terlihat | Tampilan builder pucat | Kualitas |
| P1-2 | `h-13`, `backdrop-blur-xs`, `shadow-xs`, `animate-in` tidak valid | Detail visual rusak | Kualitas |
| P1-3 | Preview tidak auto-refresh setelah simpan | Admin melihat versi lama | UX |
| P1-4 | Native Live Preview Payload tanpa token | Iframe 401 | UX |
| P1-5 | `sass` hanya dependency transitif | Build rapuh | Maintainability |
| P2-1 | 14 mismatch tipe/opsi field registry | UI editor tidak konsisten | Kualitas |
| P2-2 | 6 kesalahan template (key array & nilai select) | Seksi kosong saat template dipakai | Fungsional |
| P2-3 | Tidak ada test & parity check tidak di CI | Regresi mudah lolos | Maintainability |

**Urutan eksekusi:** Fase 1 → 2 → 3 → 4 → 5 → 6 → 7.
Fase 1–3 adalah syarat minimum builder bisa dipakai end-to-end.

---

## Fase 0 — Persiapan (0,5 hari)

### T0.1 Pastikan mode deploy Cloudflare
- Cek dashboard **Workers & Pages** → project `kalaweb` / `web-kala`.
- Tentukan: **Pages (Git integration)** atau **Workers static assets**.
- Jika Workers: `wrangler.jsonc` saat ini **tidak punya `main`**, sehingga `dist/_worker.js` tidak dieksekusi.
- Jika Pages: pastikan *Build output directory* = `apps/web-kala/dist` dan framework preset Astro.

**Output:** keputusan mode deploy terdokumentasi di PR/issue.

### T0.2 Inventaris environment
Wajib ada di **Cloudflare (web)**:

| Variable | Contoh | Catatan |
|---|---|---|
| `PREVIEW_SECRET` | string acak ≥32 char | harus **sama** dengan CMS |
| `PREVIEW_API_URL` | `https://admin.kalababyspa.com` | |
| `PREVIEW_API_KEY` | API key user `preview-bot` | read-only |
| `PREVIEW_CF_ACCESS_CLIENT_ID/SECRET` | opsional | jika admin di balik Access |

Wajib ada di **CMS** (sudah terverifikasi ada): `PREVIEW_SECRET`, `PREVIEW_BASE_URL=https://kalababyspa.com`.

### T0.3 Backup & tag
```bash
# di server CMS
pg_dump "$DATABASE_URI" > /opt/backups/cms-pre-builder-fix-$(date +%F).sql
# di repo
git tag pre-builder-fix && git push --tags
```

**Exit criteria:** mode deploy diketahui, env lengkap, backup + tag dibuat.

---

## Fase 1 — P0: Hidupkan preview di produksi (0,5–1 hari)

### T1.1 Perbaiki konfigurasi deploy
Jika **Workers static assets**, ubah `apps/web-kala/wrangler.jsonc`:

```jsonc
{
  "name": "kalaweb",
  "main": "./dist/_worker.js/index.js",
  "compatibility_date": "2026-10-20",
  "assets": {
    "directory": "./dist",
    "run_worker_first": ["/preview/*", "/_image", "/_server-islands/*"]
  }
}
```

Jika **Pages**, jangan gunakan `wrangler deploy`; cukup build & deploy lewat Git integration, dan pastikan `_worker.js` ikut terunggah.

### T1.2 Deploy web-kala
```bash
npm run build --workspace=web-kala
# jika Workers:
npx wrangler deploy --config apps/web-kala/wrangler.jsonc
# jika Pages: trigger deploy hook / push ke branch produksi
```

### T1.3 Verifikasi (wajib sebelum lanjut)
```bash
# harus 401, BUKAN 404
curl -s -o /dev/null -w "%{http_code}\n" https://kalababyspa.com/preview/zzz
curl -s -o /dev/null -w "%{http_code}\n" "https://kalababyspa.com/preview/zzz?token=invalid"
# endpoint SSR lain
curl -s -o /dev/null -w "%{http_code}\n" "https://kalababyspa.com/_image?href=%2Ffavicon.svg&w=64"
# penanda build baru
curl -s https://kalababyspa.com/sales/babyMassage | grep -c "data-use-capi"   # harus > 0
```

Lalu **purge cache** Cloudflare (HTML di-cache dengan aturan yang mengabaikan query string).

### T1.4 Uji end-to-end manual
1. Login admin → Pages → buka dokumen → Simpan Draf.
2. Klik **Buka Visual Page Builder**.
3. Iframe harus menampilkan halaman + banner "PRATINJAU DRAFT".
4. Klik seksi di iframe → panel kiri ikut berpindah.

**Exit criteria:** `/preview/zzz` = 401, iframe tampil, klik-seksi berfungsi.
**Rollback:** rollback deployment Cloudflare ke versi sebelumnya.

---

## Fase 2 — P0: Perbaiki default registry & template (0,5 hari)

### T2.1 Default nilai select
`apps/cms/src/blocks/registry.ts`:

| Baris | Sekarang | Menjadi |
|---|---|---|
| 60 | `btnColor: 'primary'` | `btnColor: 'terracotta'` |
| 61 | `bgStyle: 'default'` | `bgStyle: 'gradient'` |
| 136 | `background: 'soft'` (painPoints) | `background: 'cream'` |
| 523 | `background: 'soft'` (midwifeSpotlight) | `background: 'cream'` |

### T2.2 Perbaiki template
- `standard-sales` & `quick-lead`: ganti key `solutions: [...]` → `items: [...]`.
- `standard-sales`: `testimonials: [...]` → `items: [...]`.
- Hapus `pricing.columns` (field tidak ada) atau tambahkan field-nya ke blok Pricing.
- Samakan `bgStyle`/`background` template dengan opsi valid (`gradient`, `cream`).

### T2.3 Jadikan parity check permanen
Pindahkan skrip pembanding (registry vs konfigurasi blok vs template) menjadi
`apps/cms/scripts/check-builder-parity.ts`, dengan aturan:
- semua key `defaults` harus ada di field blok;
- nilai `select` harus ada di `options`;
- tipe field registry = tipe field Payload;
- semua key template valid, termasuk nested array;
- exit code 1 jika ada mismatch.

### T2.4 Pasang di pipeline
- Tambahkan ke `sync:builder` **atau** job CI terpisah.
- Jalankan pada PR yang menyentuh `apps/cms/src/blocks/**`.

**Exit criteria:** tambah 14 blok satu per satu → simpan sukses; terapkan 2 template → simpan sukses; parity check 0 issue.

---

## Fase 3 — P0: Media picker & integritas state (0,5 hari)

### T3.1 Satu kali update
`SectionSettings.tsx:327-337` — gabungkan menjadi satu objek:

```tsx
const updates: Record<string, any> = { [fieldName]: media.id };
if (hasAltField && !block.imageAlt && media.alt) updates.imageAlt = media.alt;
onUpdate(updates); // atau onUpdateInnerItem sekali
```

### T3.2 Atomic update di hook
`useBuilderLayout.ts` — pastikan update berikutnya tidak memakai snapshot basi:
- ubah `setLayout` menjadi functional (`setLayout(prev => ...)`), atau
- tambahkan helper `updateSectionMany(id, updates)` yang menulis sekali.

### T3.3 History yang manusiawi
- Debounce `recordHistory` ±500 ms per field (bukan per ketikan).
- Tetap simpan snapshot untuk aksi struktural (tambah/hapus/duplikat/urutkan).

**Exit criteria:** pilih foto ber-alt → foto + alt tersimpan; undo tidak mundur per karakter.

---

## Fase 4 — P0: Keamanan (1 hari)

### T4.1 Hapus fallback secret
- `apps/web-kala/src/lib/preview.ts:14-18` → hanya `secret` dari env; jika kosong, lempar error eksplisit.
- `apps/cms/src/endpoints/preview.ts:52` → `process.env.PREVIEW_SECRET` wajib; gagal jelas jika tidak ada.
- Validasi panjang minimal 32 karakter saat startup.

### T4.2 Rotasi kredensial bot
- Generate `PREVIEW_API_KEY` baru; simpan di CMS & Cloudflare.
- Pastikan `preview-bot` hanya punya akses **read** ke `pages`, `landing-pages`, `media`.
- Hapus fallback API key di `preview.ts:46`.

### T4.3 Escape RichText
`RichTextBlock.astro`:
- `escapeHtml()` untuk semua `node.text`;
- escape atribut `href` dan validasi skema (`http`, `https`, `mailto`, `tel`);
- whitelist `node.tag` ke `h1..h4`;
- tambah unit test payload `<img src=x onerror=alert(1)>`.

### T4.4 Validasi `postMessage`
- Parent: cek `event.origin === PREVIEW_ORIGIN` dan `event.source === iframe.contentWindow`.
- Child: kirim ke `window.parent` dengan origin admin eksplisit, bukan `'*'`.
- Tolak pesan bertipe tidak dikenal.

**Exit criteria:** token dengan secret fallback lama ditolak; payload XSS tampil sebagai teks; pesan dari origin lain diabaikan.

---

## Fase 5 — P1: Styling & build (0,5 hari)

### T5.1 Scoped reset (pengganti preflight)
Tambahkan di `apps/cms/src/app/(payload)/custom.scss`:

```scss
.kala-builder-portal,
.kala-builder-in-card {
  :where(*, ::before, ::after) { border-style: solid; border-width: 0; }
  :where(h1,h2,h3,h4,h5,h6,p,ul,ol,li,figure,blockquote,dl,dd) { margin: 0; }
  :where(button,input,select,textarea) { font: inherit; color: inherit; }
}
```

### T5.2 Perbaiki kelas tidak valid
- `h-13` → `h-[52px]` (BuilderField header).
- `backdrop-blur-xs` → `backdrop-blur-sm` (MediaPickerModal).
- `shadow-xs` → `shadow-sm`; `py-0.2` → `py-0.5`.
- `animate-in fade-in zoom-in-95` → tambah `tailwindcss-animate` **atau** hapus kelasnya.

### T5.3 Deklarasikan `sass`
`apps/cms/package.json` → `devDependencies: { "sass": "^1.77.4" }` (versi sama dengan transitive saat ini).

### T5.4 QA visual
Checklist desktop/tablet/mobile:
- border kartu & divider terlihat;
- header 52px, tidak menumpuk;
- input/select/textarea punya border;
- modal media center + overlay;
- tidak ada warning Tailwind di console/build.

**Exit criteria:** build dari `node_modules` bersih sukses; checklist visual lulus.

---

## Fase 6 — P1: UX preview (0,5 hari)

### T6.1 Auto-refresh setelah simpan
- Deteksi status simpan dari form Payload (mis. `savedDocumentData`/`lastUpdateTime` di `useDocumentInfo`).
- Saat tersimpan: `fetchToken()` ulang dan set `hasUnsavedChanges = false`.
- Pertahankan tombol refresh manual.

### T6.2 Native Live Preview
`Pages.ts:51-57`, `LandingPages.ts:31-35`:
- arahkan `livePreview.url` ke `/api/preview-redirect?collection=...&id=...` (menandatangani token), **atau**
- nonaktifkan `livePreview` dan andalkan builder.

### T6.3 Indikator status
- Tampilkan "Preview diperbarui HH:mm:ss".
- Token 15 menit: refresh otomatis saat mendekati kedaluwarsa.

**Exit criteria:** simpan → preview berubah tanpa klik manual; badge "Versi Tersimpan" hilang.

---

## Fase 7 — QA, test, dan CI (1 hari)

### T7.1 Unit test
- Parity registry/template.
- Sign & verify JWT (termasuk penolakan secret lama).
- Escape RichText (XSS payload).
- Reducer builder: add/duplicate/remove/reorder/inner item.

### T7.2 Smoke test (opsional, Playwright)
- Buka dokumen → buka builder → tambah Hero → simpan → reload → blok masih ada.
- Pilih media ber-alt → foto tetap terpasang.

### T7.3 CI
Workflow PR: `tsc --noEmit` (CMS), `npm run sync:builder`, unit test, parity check.

### T7.4 Dokumentasi
Perbarui `docs/sop-operasional.md` dan `docs/runbook-teknis.md`:
- cara deploy web (Pages/Workers),
- rotasi `PREVIEW_SECRET` & `PREVIEW_API_KEY`,
- prosedur purge cache.

**Exit criteria:** CI hijau, dokumentasi diperbarui, Definition of Done terpenuhi.

---

## Estimasi

| Fase | Durasi | Blocker produksi? |
|---|---|---|
| 0. Persiapan | 0,5 hari | — |
| 1. Deploy & preview | 0,5–1 hari | Ya |
| 2. Registry & template | 0,5 hari | Ya |
| 3. Media picker | 0,5 hari | Ya |
| 4. Keamanan | 1 hari | Sebagian |
| 5. Styling | 0,5 hari | Tidak |
| 6. UX preview | 0,5 hari | Tidak |
| 7. Test & CI | 1 hari | Tidak |
| **Total** | **±4,5–5 hari kerja** | |

MVP layak pakai (Fase 0–3): **±1,5–2 hari**.

---

## Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Mode deploy salah tebak → preview tetap 404 | Verifikasi via dashboard sebelum eksekusi; uji `/preview/zzz` = 401 |
| Cache HTML menyajikan versi lama | Purge cache; aktifkan bypass cache untuk `/preview/*` |
| `PREVIEW_SECRET` CMS ≠ web | Satu sumber nilai; dokumentasikan; uji token nyata |
| Perubahan registry merusak dokumen lama | Hanya mengubah `defaults` (bukan schema); dokumen lama tidak tersentuh |
| Scoped reset merusak UI Payload | Reset dibatasi ke `.kala-builder-portal` & `.kala-builder-in-card` |
| Rotasi API key memutus preview | Rotasi bersamaan di CMS + Cloudflare, lalu uji end-to-end |

---

## Definition of Done

- [ ] `/preview/zzz` mengembalikan **401** (bukan 404) di produksi.
- [ ] Iframe builder menampilkan halaman draft + banner pratinjau.
- [ ] Klik seksi di iframe memilih seksi di panel kiri.
- [ ] Tambah 14 blok → simpan sukses.
- [ ] Terapkan 2 template → simpan sukses, semua seksi terisi.
- [ ] Pilih foto ber-alt → foto + alt tersimpan.
- [ ] Token dengan fallback secret lama ditolak.
- [ ] Payload XSS di RichText tampil sebagai teks.
- [ ] Border & header builder tampil benar di desktop/tablet/mobile.
- [ ] Simpan dokumen → preview otomatis diperbarui.
- [ ] Parity check & unit test jalan di CI.
- [ ] Dokumentasi deploy & rotasi secret diperbarui.

---

## Checklist Eksekusi

**Fase 1**
- [ ] Tentukan mode deploy
- [ ] Perbaiki `wrangler.jsonc` / konfigurasi Pages
- [ ] Build & deploy web-kala
- [ ] Verifikasi 401 + `data-use-capi`
- [ ] Purge cache
- [ ] Uji end-to-end dari admin

**Fase 2**
- [ ] Perbaiki 4 default registry
- [ ] Perbaiki key & nilai template
- [ ] Buat `check-builder-parity.ts`
- [ ] Pasang di CI

**Fase 3**
- [ ] Satukan `onUpdate` media picker
- [ ] Functional update di `useBuilderLayout`
- [ ] Debounce history

**Fase 4**
- [ ] Hapus fallback secret & API key
- [ ] Rotasi kredensial bot
- [ ] Escape RichText
- [ ] Validasi origin `postMessage`

**Fase 5**
- [ ] Scoped reset CSS
- [ ] Perbaiki kelas Tailwind tidak valid
- [ ] Tambah `sass`
- [ ] QA visual

**Fase 6**
- [ ] Auto-refresh preview
- [ ] Reset flag unsaved
- [ ] Perbaiki/nonaktifkan native Live Preview

**Fase 7**
- [ ] Unit test
- [ ] Smoke test
- [ ] CI
- [ ] Dokumentasi
