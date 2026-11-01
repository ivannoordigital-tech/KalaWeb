# Rencana Induk Fase 9 — Stabilisasi Deploy + UX Polish Admin

**Tanggal:** 1 November 2026
**Basis audit:** HEAD `5d63160` (`fix(build): safe dynamic import for sharp…`), live `kalababyspa.com` & `admin.kalababyspa.com`
**Dokumen terkait:**
- `docs/rencana-eksekusi-builder.md` — rencana pembangunan builder (sprint 0–5), **sudah dieksekusi** (`7dbcc95`).
- `docs/rencana-perbaikan-builder.md` — plan remediasi Fase 0–7, **sudah dieksekusi** (`9637b66`); jadi basis audit di §0.
- `docs/rencana-ux-polish-admin.md` — **Part B / referensi kode** untuk WP-1…WP-9 (belum dieksekusi).

**Cara memakai dokumen ini:**
1. Baca §0 untuk memahami apa yang sudah beres dan apa yang belum.
2. Kerjakan §3 (Fase 9A) **berurutan**. Jangan lompat ke 9B sebelum Gate G-1 lulus.
3. §4 (9B) ditulis self-contained — kode lengkap ada di sini, tidak perlu membuka dokumen lain.
4. §5 (9C) adalah ringkasan eksekusi; buka `docs/rencana-ux-polish-admin.md` pada bagian yang dirujuk untuk kode lengkap.
5. Gunakan §10 sebagai checklist harian dan §9 sebagai kriteria selesai.

**Prinsip yang tidak boleh dilanggar:**
1. **Tanpa migrasi schema DB.** Tidak ada perubahan tabel/kolom. Penambahan opsi `select` (role) bersifat app-level.
2. **Tanpa autosave.** Penyimpanan hanya lewat aksi eksplisit (Simpan Draf / Terbitkan).
3. **`layout` blocks Payload dipertahankan.** Jangan mengganti arsitektur data builder.
4. **Security-first.** Tidak ada fallback secret, tidak ada `overrideAccess` baru, tidak ada penambahan role istimewa.
5. **Backward compatible.** Dokumen lama harus tetap terbuka, tersimpan, dan ter-render.
6. **Save/publish eksplisit.** Draft boleh tidak valid; publish wajib valid.

---

## 0. Status Hasil Audit (Ringkas)

### 0.1 Verifikasi otomatis yang sudah dijalankan

| Perintah | Hasil | Status |
|---|---|---|
| `npm run sync:builder` | 14/14 blok, paritas 100% | ✅ |
| `npm test --workspace=cms-kala` | 10 pass, 0 fail | ✅ |
| `npx tsc --noEmit` (`apps/cms`) | exit 0 | ✅ |
| `npm run build --workspace=web-kala` | exit 0; `dist/_worker.js/pages/preview/_slug_.astro.mjs` (5775 B) & `_image.astro.mjs` (1161 B) ada | ✅ |
| Live `admin.kalababyspa.com/admin` | 200 | ✅ |
| Live CSS `/_next/static/css/d29700de4a84ca94.css` | memuat `.kala-builder-portal … :where` | ✅ |
| Live `/api/preview-token`, `/api/preview-redirect` | 401 (tanpa sesi) | ✅ |
| Live `/api/deploy-status` | 200 | ✅ |

### 0.2 Status per fase lama

| Fase | Status | Catatan |
|---|---|---|
| 0 — Persiapan | ⚠️ | Tag `pre-builder-fix` ada; mode deploy (Pages vs Workers) masih ambigu |
| 1 — Deploy & preview | ❌ | Config benar, **tidak berefek di produksi** |
| 2 — Registry & template | ✅ | `terracotta`, `gradient`, `cream`, `items` sudah benar |
| 3 — Media picker | ✅ | `onUpdate(updates)` tunggal; history debounce 500 ms; `layoutRef` |
| 4 — Keamanan | ⚠️ | Fallback secret hilang, XSS test lulus, origin check ada — **least-privilege preview-bot salah** |
| 5 — Styling | ✅ | `h-13`/`backdrop-blur-xs`/`shadow-xs` hilang; scoped reset ada; `sass` dideklarasikan |
| 6 — UX preview | ✅ | Auto-refresh, token 14 menit, `livePreview` via `preview-redirect` |
| 7 — Test & CI | ⚠️ | Unit test ✅, parity ✅, **CI belum ada**, dokumentasi sebagian stale |

**Definition of Done lama: 6 dari 12 terpenuhi.**

### 0.3 Blocker produksi (bukti keras)

| Uji live | Seharusnya | Kenyataan |
|---|---|---|
| `GET /preview/zzz` | **401** | **404** |
| `GET /_image?href=%2Ffavicon.svg&w=64` | ditangani worker | **404** |
| HTML `/sales/babyMassage` | mengandung `data-use-capi` | **0 kemunculan** |
| CSS live | `_astro/_slug_.CP4I6QWa.css` (hasil build lokal) | `_astro/_slug_.CVqI8yZ7.css` (build lain) |

Build lokal **sudah benar**. Kesimpulan: **kode siap, deployment web yang belum jalan.**
CMS sudah ter-deploy (terbukti dari CSS Fase 5), jadi masalah terisolasi di web/Cloudflare.

### 0.4 Temuan sekunder

| ID | Temuan | Klasifikasi |
|---|---|---|
| S-1 | `preview-bot` ber-role `marketing` → punya create/update/delete halaman | Keamanan |
| S-2 | Tidak ada CI; `sync:builder`/`test`/`tsc` hanya manual | Maintainability |
| S-3 | `runbook-teknis.md` masih "Astro SSG – Statis Murni" + rollback Pages-only | Dokumentasi |
| S-4 | Dua `wrangler.jsonc` (root & `apps/web-kala`) dengan `name: "kalaweb"` sama | Konfigurasi |
| S-5 | `.wrangler/` tidak di-`.gitignore` (2 artefak untracked, ±2,8 MB) | Hygiene |
| S-6 | `onUpdateInnerItem` (galeri) tidak mengisi `imageAlt` otomatis | Aksesibilitas |
| S-7 | Plan UX Fase 8 **belum dieksekusi sama sekali** (0 file, 0 commit) | Scope |

---

## 1. Peta Fase Baru

```
FASE 9A — STABILISASI (BLOCKER + SECURITY + CI + DOCS)   [wajib duluan]
  9A-1  Perbaiki deployment web produksi          (blocker)
  9A-2  scripts/verify-deploy.mjs + npm run verify:deploy
  9A-3  Least privilege role `preview` (preview-bot)
  9A-4  CI: .github/workflows/ci.yml
  9A-5  Konsolidasi wrangler.jsonc
  9A-6  .gitignore .wrangler/
  9A-7  Sinkronisasi runbook + SOP
  9A-8  Auto-fill alt pada inner-item media
  9A-9  Smoke test E2E produksi
        ▼  GATE G-1 (deploy hijau + verify:deploy exit 0)
FASE 9B — UX MVP
  9B-1  WP-5  Media bisa dicari via nama file
  9B-2  WP-1  Simpan & Terbitkan di dalam builder
  9B-3  WP-3  Banner error validasi di dalam builder
        ▼  GATE G-2 (simpan/terbit dari builder terbukti di produksi)
FASE 9C — UX LANJUTAN
  9C-1  WP-2  CTA "Simpan Draf" di panel preview kosong
  9C-2  WP-8  Badge status deploy di halaman dokumen
  9C-3  WP-6  Token warna & dark-mode guard (mendahului WP-7)
  9C-4  WP-7  Akurasi & performa dashboard
  9C-5  WP-4  Unifikasi konsep "Buat Halaman"
  9C-6  WP-9  Bahasa, aksesibilitas, mobile
        ▼  GATE G-3 (Definition of Done Fase 9)
```

**Perubahan urutan dari plan UX lama:** WP-6 dijalankan **sebelum** WP-7, karena WP-7 memakai token `var(--kala-link)` yang diperkenalkan WP-6. WP-2 baru boleh dikerjakan setelah WP-1 (butuh `onSaveDraft`).

**Estimasi:** 9A ≈ 1–2 hari (60% menunggu akses dashboard Cloudflare) · 9B ≈ 2,5–3,5 hari · 9C ≈ 3,5–4,5 hari.

---

## 2. Aturan Eksekusi (wajib dipatuhi)

### 2.1 Konvensi commit

```
fix(deploy): <ringkasan>            → 9A-1, 9A-5, 9A-6
feat(ops): verify-deploy script     → 9A-2
fix(security): preview role read-only → 9A-3
ci: add cms + web quality gates     → 9A-4
docs(ops): sync runbook & sop       → 9A-7
fix(builder): alt autofill inner media → 9A-8
feat(admin-ux): <WP> <ringkasan>    → 9B-*, 9C-*
test(admin-ux): <ringkasan>         → test baru
```

Satu commit = satu unit yang bisa di-`git revert` sendiri. **Jangan gabungkan 9A-1 dengan perubahan kode lain** — kalau deploy bermasalah, revert harus bersih.

### 2.2 Perintah wajib sebelum setiap commit

```powershell
cd D:\Jobs\KalaWeb

# 1. Type-check CMS
cd apps\cms; npx tsc --noEmit; cd ..\..

# 2. Unit test
npm test --workspace=cms-kala

# 3. Parity builder (WAJIB setelah menyentuh registry/blocks/komponen path)
npm run sync:builder

# 4. Build web (WAJIB setelah menyentuh src web atau wrangler)
npm run build --workspace=web-kala

# 5. Import map (WAJIB setiap menambah komponen yang didaftarkan via path string)
npm run generate:importmap --workspace=cms-kala

# 6. Verifikasi deploy (setelah deploy)
npm run verify:deploy
```

> `npm run generate:importmap` **tidak** diperlukan untuk komponen builder yang di-import langsung sebagai React component (`BuilderValidationBanner`, `BuilderSaveButtons`, dll). Hanya diperlukan bila komponen didaftarkan lewat string path di `payload.config.ts` / collection config.

### 2.3 Aturan teknis

- **Warna:** jangan hardcode `slate-*`/`red-*` baru di komponen yang akan dimigrasikan WP-6. Untuk komponen baru di 9B, gunakan palet builder yang sudah ada (`bg-slate-900`, `bg-teal-600`) — konsisten dengan builder, lalu WP-6 memigrasikannya bersama.
- **Encoding:** file Indonesia memakai UTF-8. Jangan menyimpan ulang file lama dengan encoding berbeda (beberapa file docs punya karakter mojibake lama — biarkan).
- **Jangan pakai `ConfirmationModal` Payload di dalam builder portal** (z-index/container mismatch) — lihat §9B-2.
- **`dispatchFields` tidak menandai modified.** Selalu panggil `setModified(true)` bersamaan.
- **`useFormModified()`** adalah sumber kebenaran untuk status kotor (mencakup `title`, `slug`, `layout`, dll).

---

## 3. FASE 9A — Stabilisasi

### 9A-1. Perbaiki Deployment Web Produksi (BLOCKER)

**Tujuan:** `kalababyspa.com` menyajikan build dari commit `5d63160` atau lebih baru.
**Pemilik:** Lead Developer (butuh akses Cloudflare Dashboard).
**Risiko:** tinggi bila salah memindahkan custom domain (situs bisa down beberapa menit). Kerjakan di luar jam ramai.

#### 9A-1.1 Diagnosa (urutan eksekusi, hentikan saat ketemu penyebab)

**Langkah 1 — Tentukan worker/project yang menyajikan domain.**

Dashboard Cloudflare → **Workers & Pages**:
- Cari Worker bernama `kalaweb`.
- Cari Pages project bernama `kala-web` (nama lama) dan/atau `kalaweb`.

Catat untuk masing-masing:
- **Settings → Domains & Routes** → apakah `kalababyspa.com` / `www.kalababyspa.com` terpasang?
- **Deployments** → tanggal & commit deployment terakhir yang sukses.
- **Settings → Build** → *Root directory* (`.` atau `apps/web-kala`), *Build command*, *Deploy command*.

**Langkah 2 — Cek versi Worker langsung (bypass domain).**

Buka `https://kalaweb.<subdomain-akun>.workers.dev/preview/zzz`:

| Hasil | Arti | Aksi |
|---|---|---|
| **401** | Worker benar & baru; domain salah arah | → Langkah 4 (pindahkan domain) |
| **404** | Worker menyajikan build lama | → Langkah 3 (perbaiki build) |
| 5xx / tidak bisa diakses | Worker gagal deploy | → Langkah 3 & 5 |
| Halaman situs (200) | Routing Worker tidak menangkap `/preview/*` | → cek `assets.run_worker_first` |

**Langkah 3 — Cek build log deployment terakhir.**

Di Deployments → deployment terakhir → **View build log**. Cari:

| Gejala di log | Penyebab | Perbaikan |
|---|---|---|
| `FATAL PRODUCTION ERROR: Failed to fetch … from CMS` | `ALLOW_FALLBACK=false` + CMS tidak terjangkau saat build | Pastikan `PAYLOAD_URL` benar; CMS hidup; atau set `ALLOW_FALLBACK=true` **sementara** |
| `sharp` / `node-gyp` error | native module di environment build | Sudah dimitigasi `5d63160` (dynamic import). Pastikan build memakai commit ≥ `5d63160` |
| `npm ERR!` / `Cannot find module` | Root directory salah | Root directory harus `.` (repo root) bila memakai `wrangler.jsonc` root |
| Build sukses tapi aset lama | Deployment tidak dipromosikan / domain masih ke Pages | → Langkah 4 |
| Tidak ada build baru sama sekali | Tidak ada auto-deploy on push | → Langkah 6 |

**Langkah 4 — Arahkan custom domain ke Worker yang benar.**

Ini penyebab paling mungkin.

1. Di **Pages project lama** (`kala-web`) → Settings → **Custom domains** → hapus `kalababyspa.com` dan `www.kalababyspa.com`.
2. Di **Worker `kalaweb`** → Settings → **Domains & Routes** → **Add** → **Custom domain**:
   - `kalababyspa.com`
   - `www.kalababyspa.com`
3. Tunggu status **Active** (biasanya < 2 menit; Cloudflare mengurus DNS otomatis karena zone sama).
4. Verifikasi:
   ```powershell
   curl.exe -s -o NUL -w "%{http_code}" https://kalababyspa.com/preview/zzz   # harus 401
   ```

> **Jangan** memakai "Route" (`kalababyspa.com/*`) kecuali domain sudah punya record DNS proxied. Untuk apex domain, **Custom domain** lebih aman.

> **Rollback Langkah 4:** hapus custom domain dari Worker, lalu tambahkan kembali di Pages project lama. Situs kembali ke versi lama dalam hitungan detik (belum ada downtime data).

**Langkah 5 — Pastikan environment variable Worker lengkap.**

Worker `kalaweb` → Settings → **Variables and Secrets** (Production):

| Nama | Tipe | Nilai | Wajib |
|---|---|---|---|
| `PREVIEW_SECRET` | Secret | 64 hex char, **identik** dengan CMS | ✅ |
| `PREVIEW_API_KEY` | Secret | API key user `preview-bot` (setelah 9A-3) | ✅ |
| `PREVIEW_API_URL` | Plain | `https://admin.kalababyspa.com` | ✅ |
| `PAYLOAD_URL` | Plain | `https://admin.kalababyspa.com` | ✅ |
| `PUBLIC_GTM_ID` | Plain | ID GTM produksi | ✅ |
| `ALLOW_FALLBACK` | Plain | `false` (produksi) | ✅ |
| `PREVIEW_CF_ACCESS_CLIENT_ID` | Secret | Service token Access | bila Access aktif |
| `PREVIEW_CF_ACCESS_CLIENT_SECRET` | Secret | Service token Access | bila Access aktif |

**Langkah 6 — Pasang auto-deploy on push.**

Pilih **satu** (jangan dua-duanya):

- **Opsi A (disarankan) — Cloudflare Workers Builds:** Worker → Settings → Build → hubungkan repository GitHub, branch `main`, root directory `.`, build command `npm run build`, deploy command `npx wrangler deploy`. Setiap push ke `main` memicu build.
- **Opsi B — GitHub Actions + `wrangler deploy`:** butuh secret `CLOUDFLARE_API_TOKEN` & `CLOUDFLARE_ACCOUNT_ID`. **Jangan** dikerjakan di 9A-4 (CI quality gate) — buat workflow terpisah `deploy-web.yml` hanya jika Opsi A tidak tersedia.

Setelah itu, `scheduled-build.yml` hanya relevan untuk rebuild konten terjadwal; jangan dijadikan satu-satunya jalur deploy.

**Langkah 7 — Purge cache Cloudflare.**

Dashboard → `kalababyspa.com` → Caching → **Purge Everything**.

Alasan: HTML lama ber-`Cache-Control: public, max-age=0, must-revalidate` masih bisa tersaji dari edge (`cf-cache-status: HIT`). Setelah purge, cek ulang.

#### 9A-1.2 Kriteria penerimaan 9A-1

- [ ] `GET https://kalababyspa.com/preview/zzz` → **401** (bukan 404)
- [ ] `GET https://kalababyspa.com/preview/zzz?token=invalid` → **401**
- [ ] `GET https://kalababyspa.com/sales/babyMassage/` mengandung `data-use-capi` minimal 1×
- [ ] Aset CSS di HTML live **sama** dengan `apps/web-kala/dist/index.html` (hash cocok)
- [ ] Deployments menampilkan commit ≥ `5d63160`
- [ ] Custom domain terpasang di **satu** tempat saja (Worker **atau** Pages)
- [ ] `npm run verify:deploy` (setelah 9A-2) exit 0

#### 9A-1.3 Rollback 9A-1

| Perubahan | Rollback |
|---|---|
| Pemindahan custom domain | Kembalikan domain ke Pages project lama |
| Perubahan env var | Catat nilai lama sebelum mengubah; restore |
| Purge cache | Tidak perlu rollback (cache terisi ulang otomatis) |
| Auto-deploy | Matikan integrasi di dashboard |

**Tidak ada perubahan kode** di 9A-1. Bila perlu revert kode, gunakan `git revert` pada commit terkait, lalu deploy ulang.

---

### 9A-2. `scripts/verify-deploy.mjs` + `npm run verify:deploy`

**Tujuan:** menjadikan audit manual (seperti §0.3) **dapat diulang 1 perintah**, dan bisa dipakai sebagai gate sebelum/sesudah deploy.

**File baru:** `scripts/verify-deploy.mjs`

```js
#!/usr/bin/env node
/**
 * KalaWeb — verifikasi deployment produksi.
 *
 * Memeriksa bahwa:
 *  1. Web hidup dan menyajikan HTML.
 *  2. /preview/* ditangani Worker (401), BUKAN 404 (build lama).
 *  3. Aset _astro di live cocok dengan hash build lokal (deteksi build basi).
 *  4. Endpoint CMS merespons sesuai harapan.
 *
 * Pemakaian:
 *   node scripts/verify-deploy.mjs
 *   node scripts/verify-deploy.mjs --base https://kalababyspa.com --cms https://admin.kalababyspa.com
 *   node scripts/verify-deploy.mjs --capi-path /sales/babyMassage/ --strict
 *
 * Exit code: 0 = semua hard-check lulus, 1 = ada yang gagal.
 */

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  const v = i >= 0 ? argv[i + 1] : undefined;
  return v && !v.startsWith('--') ? v : fallback;
};
const hasFlag = (name) => argv.includes(`--${name}`);

const BASE = opt('base', process.env.VERIFY_BASE || 'https://kalababyspa.com').replace(/\/+$/, '');
const CMS = opt('cms', process.env.VERIFY_CMS || 'https://admin.kalababyspa.com').replace(/\/+$/, '');
const DIST = opt('local-dist', process.env.VERIFY_LOCAL_DIST || 'apps/web-kala/dist');
const CAPI_PATH = opt('capi-path', '');
const TIMEOUT_MS = Number(opt('timeout', '25000'));
const STRICT = hasFlag('strict');

const results = [];

function add(name, ok, detail = '', soft = false) {
  results.push({ name, ok, detail, soft });
  const label = ok ? 'PASS' : soft && !STRICT ? 'WARN' : 'FAIL';
  console.log(`  [${label}] ${name}${detail ? ` — ${detail}` : ''}`);
}

async function request(url, { follow = false } = {}) {
  return fetch(url, {
    redirect: follow ? 'follow' : 'manual',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'cache-control': 'no-cache', pragma: 'no-cache' },
  });
}

async function getHtml(url) {
  const res = await request(url, { follow: true });
  return { status: res.status, html: await res.text(), headers: res.headers };
}

const assetSet = (html) =>
  new Set([...html.matchAll(/_astro\/[A-Za-z0-9_.\-]+\.(?:css|js)/g)].map((m) => m[0]));

async function main() {
  console.log('\nKalaWeb deploy verification');
  console.log(`  web  : ${BASE}`);
  console.log(`  cms  : ${CMS}`);
  console.log(`  dist : ${DIST}\n`);

  // ---------- WEB ----------
  console.log('WEB');
  let home = { status: 0, html: '', headers: null };
  try {
    home = await getHtml(`${BASE}/`);
    add('GET / → 200', home.status === 200, `status=${home.status}`);
  } catch (err) {
    add('GET / → 200', false, err.message);
  }
  if (home.html) {
    add('HTML mengandung <html>', /<html[\s>]/i.test(home.html), `len=${home.html.length}`);
  }

  const previewNoToken = await request(`${BASE}/preview/zzz`);
  add(
    'GET /preview/zzz tanpa token → 401',
    previewNoToken.status === 401,
    `status=${previewNoToken.status}${previewNoToken.status === 404 ? ' (build lama / worker tidak aktif)' : ''}`,
  );

  const previewBadToken = await request(`${BASE}/preview/zzz?token=invalid`);
  add('GET /preview/zzz?token=invalid → 401', previewBadToken.status === 401, `status=${previewBadToken.status}`);

  const cacheControl = previewNoToken.headers.get('cache-control') || '';
  add('/preview/* Cache-Control mengandung no-store', /no-store/i.test(cacheControl), cacheControl || '(kosong)');

  const image = await request(`${BASE}/_image?href=%2Ffavicon.svg&w=64`);
  add('/_image bukan 404', image.status !== 404, `status=${image.status}`, true);

  // Deteksi build basi: bandingkan hash aset lokal dengan live.
  const indexPath = path.join(DIST, 'index.html');
  if (fs.existsSync(indexPath)) {
    const localAssets = [...assetSet(fs.readFileSync(indexPath, 'utf8'))];
    const liveAssets = assetSet(home.html);
    const missing = localAssets.filter((a) => !liveAssets.has(a));
    add(
      'Build live = build lokal (hash aset)',
      localAssets.length > 0 && missing.length === 0,
      localAssets.length === 0
        ? 'tidak ada aset _astro di dist/index.html'
        : missing.length
          ? `tidak ada di live: ${missing.join(', ')}`
          : `${localAssets.length} aset cocok`,
    );
  } else {
    console.log(`  [SKIP] Perbandingan aset — ${indexPath} tidak ada (jalankan npm run build dulu)`);
  }

  for (const asset of [...assetSet(home.html)].slice(0, 5)) {
    const res = await request(`${BASE}/${asset}`);
    add(`Aset live ${asset} → 200`, res.status === 200, `status=${res.status}`);
  }

  if (CAPI_PATH) {
    const page = await getHtml(`${BASE}${CAPI_PATH.startsWith('/') ? '' : '/'}${CAPI_PATH}`);
    add(
      `${CAPI_PATH} memuat data-use-capi`,
      page.html.includes('data-use-capi'),
      `status=${page.status}`,
    );
  }

  // ---------- CMS ----------
  console.log('\nCMS');
  const previewToken = await request(`${CMS}/api/preview-token`);
  add('GET /api/preview-token tanpa sesi → 401', previewToken.status === 401, `status=${previewToken.status}`);

  const previewRedirect = await request(`${CMS}/api/preview-redirect?collection=pages&id=1`);
  add(
    'GET /api/preview-redirect tanpa sesi → 401',
    previewRedirect.status === 401,
    `status=${previewRedirect.status}`,
  );

  const deployStatus = await request(`${CMS}/api/deploy-status`);
  add('GET /api/deploy-status → 200', deployStatus.status === 200, `status=${deployStatus.status}`);

  // ---------- RINGKASAN ----------
  const hardFailures = results.filter((r) => !r.ok && !(r.soft && !STRICT));
  const warnings = results.filter((r) => !r.ok && r.soft && !STRICT);
  console.log(
    `\n${results.length - hardFailures.length - warnings.length}/${results.length} lulus` +
      (warnings.length ? ` · ${warnings.length} peringatan` : ''),
  );
  if (hardFailures.length) {
    console.log('Deployment BELUM siap. Perbaiki item FAIL di atas.');
    process.exit(1);
  }
  console.log('Deployment siap.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\nverify-deploy error:', err);
  process.exit(1);
});
```

**Daftarkan di root `package.json`** (sisipkan setelah `"sync:builder"`):

```json
    "sync:builder": "npm run sync:builder --workspace=cms-kala",
    "verify:deploy": "node scripts/verify-deploy.mjs"
```

**Pemakaian:**

```powershell
# Cek standar
npm run verify:deploy

# Cek + deteksi penanda build baru pada halaman LP
npm run verify:deploy -- --capi-path /sales/babyMassage/

# Jadikan /_image sebagai hard failure juga
npm run verify:deploy -- --strict

# Cek environment lain (staging)
node scripts/verify-deploy.mjs --base https://staging.kalababyspa.com --cms https://staging-admin.kalababyspa.com
```

**Kriteria penerimaan 9A-2:**
- [ ] Script exit 0 saat produksi sehat, exit 1 saat `/preview/zzz` = 404.
- [ ] Output menampilkan PASS/FAIL per item, bukan stack trace.
- [ ] Bisa dijalankan tanpa dependency baru (Node ≥ 20, `fetch` global).
- [ ] `npm run verify:deploy` terdokumentasi di runbook (9A-7).

**Rollback:** hapus file + script npm. Tidak ada efek lain.

---

### 9A-3. Least Privilege: Role `preview` untuk `preview-bot`

**Masalah:** `docs/runbook-teknis.md` §8.2 mengklaim `preview-bot` ber-role `marketing` bersifat read-only. Faktanya `canManagePagesAndLPs` mengizinkan `marketing` **create + update + delete**. API key yang bocor = seluruh halaman bisa dihapus.

**Solusi:** tambah role baru `preview` yang **tidak** termasuk dalam access function manapun, sehingga otomatis read-only terhadap Pages/LandingPages (yang `read: () => true`) dan tidak bisa menulis apa pun.

#### Patch 1 — `apps/cms/src/access/roles.ts`

```diff
-export type UserRole = 'superadmin' | 'operator' | 'author' | 'seo' | 'midwife_coordinator' | 'marketing';
+export type UserRole =
+  | 'superadmin'
+  | 'operator'
+  | 'author'
+  | 'seo'
+  | 'midwife_coordinator'
+  | 'marketing'
+  | 'preview'; // mesin/integrasi: read-only, tidak boleh menulis apa pun
```

Tambahkan helper dokumentatif di akhir file:

```ts
/**
 * Role `preview` sengaja TIDAK dimasukkan ke access function mana pun.
 * `read` pada Pages/LandingPages sudah `() => true`, sehingga preview-bot bisa
 * mengambil draft, tetapi create/update/delete otomatis false.
 *
 * Jangan tambahkan `preview` ke canManagePagesAndLPs / canManageSiteSettings /
 * canManageArticles — itu akan membatalkan least privilege.
 */
export const PREVIEW_MACHINE_ROLE = 'preview' as const;
```

> Tidak perlu mengubah `Pages.access`, `LandingPages.access`, `Media.access`, dsb. Semua `create`/`update`/`delete` memakai allow-list eksplisit, sehingga role baru otomatis ditolak.

#### Patch 2 — `apps/cms/src/collections/Users.ts`

Tambahkan opsi pada `role.options` (setelah baris `marketing`):

```ts
        { label: 'Marketing Specialist (Landing Pages, Pages & Templates)', value: 'marketing' },
        { label: 'Preview Bot (Mesin — hanya baca, tanpa tulis)', value: 'preview' },
```

#### Patch 3 — `apps/cms/src/endpoints/preview.ts` (JANGAN diubah untuk menambah role)

`ALLOWED_ROLES = ['superadmin', 'operator', 'marketing', 'seo']` **tetap**. Role `preview` tidak boleh mencetak token preview manusia.

Tambahkan komentar di atas konstanta agar tidak "diperbaiki" orang lain:

```ts
// Role `preview` sengaja TIDAK ada di sini: akun mesin tidak boleh membuat token preview.
const ALLOWED_ROLES = ['superadmin', 'operator', 'marketing', 'seo'];
```

#### Langkah data (bukan migrasi schema)

1. Login sebagai superadmin → **Pengguna & Hak Akses** → user `preview-bot@kalababyspa.com`.
2. Ubah **Peran** dari `Marketing Specialist` → `Preview Bot (Mesin — hanya baca…)`.
3. **Rotasi API key**: hapus/regenerate field `apiKey`.
4. Salin key baru ke:
   - `apps/cms/.env` → `PREVIEW_API_KEY`
   - Worker `kalaweb` → secret `PREVIEW_API_KEY`
5. Restart CMS (`docker compose restart cms`) dan redeploy Worker (env var berubah).
6. Hapus key lama dari semua tempat.

#### Verifikasi

```powershell
# 1. Baca draft harus BERHASIL
curl.exe -s -o NUL -w "%{http_code}`n" `
  -H "Authorization: users API-Key <KEY_BARU>" `
  "https://admin.kalababyspa.com/api/pages?limit=1&draft=true"

# 2. Create harus DITOLAK (403)
curl.exe -s -o NUL -w "%{http_code}`n" -X POST `
  -H "Authorization: users API-Key <KEY_BARU>" `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"x\",\"slug\":\"x\"}' `
  "https://admin.kalababyspa.com/api/pages"

# 3. Delete harus DITOLAK (403)
curl.exe -s -o NUL -w "%{http_code}`n" -X DELETE `
  -H "Authorization: users API-Key <KEY_BARU>" `
  "https://admin.kalababyspa.com/api/pages/1"
```

**Kriteria penerimaan 9A-3:**
- [ ] `GET /api/pages?...&draft=true` dengan API key baru → 200
- [ ] `POST /api/pages` → 403
- [ ] `DELETE /api/pages/:id` → 403
- [ ] `PATCH /api/pages/:id` → 403
- [ ] Preview builder di produksi tetap berfungsi (fetch draft via key baru)
- [ ] `npx tsc --noEmit` exit 0 (union type bertambah tidak merusak switch/record lain)
- [ ] Key lama sudah tidak valid

**Rollback:** kembalikan role user ke `marketing`, pulihkan key lama (bila masih disimpan). Revert commit kode.

---

### 9A-4. CI: `.github/workflows/ci.yml`

**Tujuan:** mencegah regresi seperti default registry tidak valid dan fallback secret lolos lagi.

**File baru:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  cms:
    name: CMS — parity, type-check, test
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: '.node-version'
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Regenerate builder registry + parity check
        run: npm run sync:builder

      - name: Fail if generated file is stale
        run: |
          if ! git diff --quiet -- apps/web-kala/src/components/blocks/registry.generated.json; then
            echo "::error::registry.generated.json tidak sinkron. Jalankan 'npm run sync:builder' dan commit hasilnya."
            git diff -- apps/web-kala/src/components/blocks/registry.generated.json
            exit 1
          fi

      - name: Type-check CMS
        working-directory: apps/cms
        run: npx tsc --noEmit

      - name: Unit tests CMS
        run: npm test --workspace=cms-kala

  web:
    name: Web — production build
    runs-on: ubuntu-latest
    timeout-minutes: 25
    env:
      # CI hanya memvalidasi kompilasi. Konten diambil dari CMS bila tersedia;
      # bila tidak, fallback diizinkan supaya build tidak flaky karena jaringan.
      ALLOW_FALLBACK: 'true'
      PAYLOAD_URL: 'https://admin.kalababyspa.com'
      PUBLIC_GTM_ID: ''
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: '.node-version'
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build web
        run: npm run build --workspace=web-kala

      - name: Assert SSR preview routes were generated
        run: |
          test -f apps/web-kala/dist/_worker.js/index.js \
            || { echo "::error::dist/_worker.js/index.js tidak ada — output bukan SSR."; exit 1; }
          test -f apps/web-kala/dist/_worker.js/pages/preview/_slug_.astro.mjs \
            || { echo "::error::Route /preview/[slug] tidak ter-build."; exit 1; }

      - name: Upload dist (debug)
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: web-dist-debug
          path: apps/web-kala/dist
          retention-days: 3
```

> **Catatan `ALLOW_FALLBACK=true`:** ini **hanya** untuk CI kompilasi. Deploy produksi tetap `false`. Dokumentasikan perbedaan ini di runbook agar tidak disalahpahami.

**Kriteria penerimaan 9A-4:**
- [ ] Workflow muncul di tab Actions setelah push.
- [ ] Job `cms` hijau pada commit bersih.
- [ ] Job `web` hijau, dan gagal bila `preview/_slug_.astro.mjs` dihapus (uji cepat: hapus `export const prerender = false` sementara → CI harus merah).
- [ ] Job `cms` gagal bila `registry.generated.json` diubah manual tanpa `sync:builder`.

**Rollback:** hapus file workflow. Tidak memengaruhi runtime.

---

### 9A-5. Konsolidasi `wrangler.jsonc`

**Masalah:** dua file dengan nama worker identik (`kalaweb`), `main` dan `assets.directory` berbeda. Salah pilih root directory di dashboard = deploy ke worker yang salah / aset tidak ketemu.

#### Langkah 1 — Tentukan root directory yang dipakai Cloudflare

Dashboard → Worker `kalaweb` → Settings → Build → **Root directory**.

| Root directory | File yang dibaca | Aksi |
|---|---|---|
| `.` (repo root) | `wrangler.jsonc` (root) | **Hapus** `apps/web-kala/wrangler.jsonc` |
| `apps/web-kala` | `apps/web-kala/wrangler.jsonc` | **Hapus** `wrangler.jsonc` (root), lalu sesuaikan langkah di bawah |

#### Langkah 2a — Jika root = repo root (disarankan)

Hapus `apps/web-kala/wrangler.jsonc`, dan pastikan `wrangler.jsonc` root menjadi:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "kalaweb",
  "main": "./apps/web-kala/dist/_worker.js/index.js",
  "compatibility_date": "2026-10-20",
  "compatibility_flags": ["nodejs_compat"],
  "build": {
    "command": "npm run build"
  },
  "assets": {
    "directory": "./apps/web-kala/dist",
    "run_worker_first": ["/preview/*", "/_image", "/_server-islands/*"]
  },
  "observability": {
    "enabled": true
  }
}
```

> `"$schema"` opsional; berguna untuk validasi editor. `observability` membantu membaca log Worker saat debug preview.

#### Langkah 2b — Jika root = `apps/web-kala`

Hapus `wrangler.jsonc` root, dan `apps/web-kala/wrangler.jsonc` menjadi:

```jsonc
{
  "$schema": "../../node_modules/wrangler/config-schema.json",
  "name": "kalaweb",
  "main": "./dist/_worker.js/index.js",
  "compatibility_date": "2026-10-20",
  "compatibility_flags": ["nodejs_compat"],
  "build": {
    "command": "npm run build --workspace=web-kala"
  },
  "assets": {
    "directory": "./dist",
    "run_worker_first": ["/preview/*", "/_image", "/_server-islands/*"]
  },
  "observability": {
    "enabled": true
  }
}
```

> Perhatikan: bila root directory = `apps/web-kala`, `npm run build` **tidak** menemukan script root monorepo. Gunakan `npm run build --workspace=web-kala` **atau** `npm --prefix ../.. run build`. Uji dulu dengan `npx wrangler deploy --dry-run`.

#### Langkah 3 — Uji tanpa deploy

```powershell
cd D:\Jobs\KalaWeb
npx wrangler deploy --dry-run --outdir .wrangler/dry-run
```

Harus sukses dan melaporkan jumlah aset + entry worker.

**Kriteria penerimaan 9A-5:**
- [ ] Hanya ada **satu** `wrangler.jsonc` di repo.
- [ ] `npx wrangler deploy --dry-run` exit 0.
- [ ] Deploy berikutnya tetap menyajikan `/preview/*` = 401.
- [ ] Nama worker di dashboard = nama di file = `kalaweb`.

**Rollback:** `git revert` commit 9A-5 (file lama kembali).

---

### 9A-6. `.gitignore` untuk `.wrangler/`

Tambahkan ke `.gitignore` (setelah blok `# Build outputs`):

```gitignore

# Wrangler local state (dev/build artifacts)
.wrangler/
```

> Pola `.wrangler/` tanpa leading slash sudah cocok di semua kedalaman, termasuk `apps/web-kala/.wrangler/`.

**Verifikasi:**

```powershell
cd D:\Jobs\KalaWeb
git status --short   # .wrangler/ dan apps/web-kala/.wrangler/ harus HILANG dari daftar
```

**Rollback:** hapus baris tersebut.

---

### 9A-7. Sinkronisasi Dokumentasi

#### 9A-7.1 `docs/runbook-teknis.md`

**(a) Judul & §1 Arsitektur** — ganti baris 1 dan blok diagram:

```markdown
# Runbook Teknis KalaWeb (Astro Hybrid SSR & Payload CMS)
```

```markdown
## 1. Arsitektur Sistem

```
[Pengunjung Web]
        │
        ▼
[Cloudflare Worker "kalaweb" — Static Assets + SSR]
   ├── Aset statis  : apps/web-kala/dist (HTML, CSS, JS, gambar)
   ├── SSR on-demand: /preview/*, /_image, /_server-islands/*
   └── Cache/Header : public/_headers
        ▲
        │ (deploy hook / Workers Builds)
        │
[Payload CMS 3.x — VPS Ubuntu / Docker]
        │
        ├── PostgreSQL (kala_cms_db)
        └── Cloudflare R2 (media)
```

- **Frontend:** Astro 5 dengan **output hybrid** (`output: 'static'` + halaman `prerender = false`) di-deploy sebagai **Cloudflare Worker** (`main` = `dist/_worker.js/index.js`, `assets.directory` = `dist`, `run_worker_first` = `/preview/*`, `/_image`, `/_server-islands/*`).
- **Bukan lagi Pages-only.** Rollback harus lewat Worker versions/deployments.
```

**(b) §3.3 Deploy Hook** — ganti seluruh isi:

```markdown
### 3.3 Deploy Web (Workers Builds / Deploy Hook)

Ada dua jalur pemicu build web:

1. **Workers Builds (disarankan):** push ke branch `main` → Cloudflare membangun & men-deploy Worker `kalaweb` otomatis.
2. **Deploy Hook dari CMS:** CMS memanggil `CLOUDFLARE_DEPLOY_HOOK_URL` setelah publish/unpublish/delete (debounce 60 detik).

Prosedur rotasi hook:
1. Dashboard Cloudflare → **Workers & Pages** → `kalaweb` → Settings → Builds & Deployments → Deploy hooks.
2. Buat hook baru, catat URL, hapus hook lama.
3. Perbarui `CLOUDFLARE_DEPLOY_HOOK_URL` di `apps/cms/.env`.
4. Restart CMS, lalu publish satu halaman uji.
5. Verifikasi: `npm run verify:deploy`.

> Jangan mengandalkan cron harian (`scheduled-build.yml`) sebagai jalur deploy utama.
```

**(c) §4.1 Fail-Safe** — tambahkan catatan CI:

```markdown
> **Pengecualian:** workflow CI (`ci.yml`) menjalankan build dengan `ALLOW_FALLBACK=true` karena tujuannya hanya memvalidasi kompilasi, bukan merilis konten. Deploy produksi **wajib** `ALLOW_FALLBACK=false`.
```

**(d) §4.2 Rollback** — ganti seluruh isi:

```markdown
### 4.2 Rollback Deployment Web (Worker)

**Opsi A — Dashboard (tercepat):**
1. Cloudflare Dashboard → Workers & Pages → `kalaweb` → **Deployments**.
2. Pilih deployment sukses terakhir sebelum insiden.
3. Klik **Rollback** / **Deploy this version**.

**Opsi B — CLI:**
```bash
npx wrangler rollback --name kalaweb
npx wrangler deployments list --name kalaweb
```

**Opsi C — Revert kode:**
```bash
git revert <commit>
git push origin main
```

**Setelah rollback:**
1. Purge cache: Dashboard → Caching → Purge Everything.
2. Jalankan `npm run verify:deploy`.
3. Pastikan `/preview/zzz` = 401, bukan 404.

> Rollback versi Worker **tidak** menyentuh database CMS. Data yang sudah dipublish tetap ada.
```

**(e) §8.2 Akun Service `preview-bot`** — ganti seluruh isi:

```markdown
### 8.2 Akun Service `preview-bot`

- **Email:** `preview-bot@kalababyspa.com`
- **Role:** `preview` — role mesin **read-only**. Tidak termasuk `canManagePagesAndLPs`, `canManageSiteSettings`, maupun access function lain.
- **Hak:** hanya `GET` pada koleksi yang `read: () => true` (Pages, LandingPages, Media). **Tidak bisa** create/update/delete.
- **API Key:** dikelola via field `apiKey` di koleksi `users`.
- **Rotasi:** minimal setiap 6 bulan atau segera setelah pergantian tim. Prosedur: regenerate `apiKey` → perbarui `PREVIEW_API_KEY` di `apps/cms/.env` dan secret Worker `kalaweb` → restart CMS → redeploy Worker → hapus key lama.

> **Jangan** memberi role `marketing` pada akun ini. `marketing` memiliki create/update/delete halaman.
```

**(f) Bagian baru §11 — Verifikasi Deploy**

```markdown
## 11. Verifikasi Deploy (Wajib Setelah Setiap Deploy Web)

```bash
npm run verify:deploy
```

Pemeriksaan yang dijalankan:
| Item | Ekspektasi | Arti bila gagal |
|---|---|---|
| `GET /` | 200 | Worker/domain tidak aktif |
| `GET /preview/zzz` | 401 | **404 = build lama masih tayang** |
| `GET /preview/zzz?token=invalid` | 401 | Verifikasi token bocor/rusak |
| `Cache-Control` preview | mengandung `no-store` | Header `_headers` tidak terpasang |
| Hash aset `_astro/*` | sama dengan `dist/index.html` | Build live ≠ build lokal |
| `/api/preview-token` (CMS) | 401 | Endpoint publik / auth rusak |
| `/api/deploy-status` (CMS) | 200 | CMS down |

Tambahan:
```bash
npm run verify:deploy -- --capi-path /sales/babyMassage/
```
harus menemukan `data-use-capi` di HTML (penanda build ≥ 30 Okt 2026).
```

#### 9A-7.2 `docs/sop-operasional.md`

Perbarui bagian alur simpan (baris ~44 dan ~59) agar tidak menyebut "build otomatis Cloudflare Pages":

```markdown
6. Klik **Simpan Draf** untuk menyimpan tanpa menayangkan ke publik, atau **Terbitkan** untuk merilis.
   - **Simpan Draf**: hanya terlihat di `/preview/*` dan CMS. **Tidak** memicu deploy web.
   - **Terbitkan**: memicu deploy web (debounce 60 detik).
```

> Penambahan bagian "Membuat Halaman Baru" dikerjakan di **WP-4 (9C-5)**, bukan di 9A.

**Kriteria penerimaan 9A-7:**
- [ ] `rg -n "Astro SSG|Statis Murni|kala-web" docs/` tidak menemukan klaim usang.
- [ ] Runbook menyebut `verify:deploy`, role `preview`, dan rollback Worker.
- [ ] SOP membedakan Simpan Draf vs Terbitkan terkait deploy.

**Rollback:** `git revert` commit docs.

---

### 9A-8. Auto-fill `imageAlt` pada Inner-Item Media (Gallery)

**Masalah:** `SectionSettings.tsx` mengisi `imageAlt` otomatis untuk field media level blok, tetapi **tidak** untuk item galeri (`images[]`). Akibatnya galeri sering tersimpan tanpa alt → aksesibilitas & SEO turun.

**File:** `apps/cms/src/components/admin/builder/SectionSettings.tsx` (blok `onSelect` di baris ~328–340).

**Kondisi saat ini:**

```tsx
        onSelect={(media: MediaItem) => {
          if (!activeMediaTarget) return;
          if (activeMediaTarget.isInner && typeof activeMediaTarget.innerIndex === 'number' && activeMediaTarget.innerPath) {
            onUpdateInnerItem(activeMediaTarget.innerPath, activeMediaTarget.innerIndex, {
              [activeMediaTarget.fieldName]: media.id,
            });
          } else {
```

**Ganti dengan:**

```tsx
        onSelect={(media: MediaItem) => {
          if (!activeMediaTarget) return;

          if (
            activeMediaTarget.isInner &&
            typeof activeMediaTarget.innerIndex === 'number' &&
            activeMediaTarget.innerPath
          ) {
            const updates: Record<string, any> = { [activeMediaTarget.fieldName]: media.id };
            const currentItem = innerItems[activeMediaTarget.innerIndex] || {};

            // Isi alt dari media hanya bila item belum punya alt.
            if (
              inner?.fields?.some((f: any) => f.name === 'imageAlt') &&
              !currentItem.imageAlt &&
              media.alt
            ) {
              updates.imageAlt = media.alt;
            }

            onUpdateInnerItem(
              activeMediaTarget.innerPath,
              activeMediaTarget.innerIndex,
              updates,
            );
          } else {
```

> `inner` dan `innerItems` sudah tersedia di scope komponen (baris ~172–173). Jika registry galeri belum punya field `imageAlt`, guard `inner?.fields?.some(...)` membuat perubahan ini **no-op** (aman, backward compatible).

**Catatan registry (opsional, hanya bila ingin alt per foto):** `apps/cms/src/blocks/registry.ts` blok galeri (`path: 'images'`) dapat ditambah field:

```ts
        { name: 'imageAlt', label: 'Alt Text Foto', type: 'text', placeholder: 'Deskripsi foto untuk aksesibilitas' },
```

Bila ditambah, **wajib**:

```powershell
npm run sync:builder
npm run generate:importmap --workspace=cms-kala
npm test --workspace=cms-kala
```

> Menambah field registry **tidak** mengubah schema DB (data blok disimpan sebagai JSON di dalam `layout`).

**Kriteria penerimaan 9A-8:**
- [ ] Buka builder → pilih seksi galeri → pilih foto yang punya `alt` → field alt item terisi otomatis.
- [ ] Pilih foto lain pada item yang alt-nya sudah diisi manual → alt **tidak** tertimpa.
- [ ] Simpan draft → reload → alt tetap ada.
- [ ] `npm run sync:builder` tetap 14/14.

**Rollback:** `git revert` commit 9A-8.

---

### 9A-9. Smoke Test E2E Produksi

Dilakukan **manual** setelah 9A-1…9A-8 selesai dan ter-deploy.

**Skenario 1 — Halaman publik**
1. Buka `https://kalababyspa.com/` — tampil normal, tidak ada console error.
2. Buka `https://kalababyspa.com/sales/babyMassage/` — tombol WhatsApp ada, `data-use-capi` ada di view-source.

**Skenario 2 — Preview draft**
1. Login CMS → Landing Pages → buka salah satu draft.
2. Klik **Preview** (bukan tombol live preview Payload native).
3. Tab baru membuka `/preview/sales/<slug>?token=…` — banner **PRATINJAU DRAFT** tampil.
4. Hapus `?token=` dari URL → halaman menampilkan teks 401, bukan 404.

**Skenario 3 — Builder**
1. Buka dokumen → **Buka Visual Page Builder**.
2. Ubah judul hero → preview ter-update setelah simpan (perilaku Fase 6).
3. Tutup builder → form menunjukkan perubahan.

**Skenario 4 — Deploy**
1. Terbitkan perubahan → tunggu status deploy.
2. `npm run verify:deploy` → exit 0.
3. Buka halaman publik → perubahan tampil.

**Gate G-1 (wajib lulus sebelum 9B):**
- [ ] `npm run verify:deploy` exit 0
- [ ] `/preview/zzz` = 401
- [ ] Role `preview` terbukti read-only (403 untuk POST/DELETE)
- [ ] CI hijau di `main`
- [ ] Runbook & SOP tidak lagi menyebut "Pages-only"
- [ ] Hanya satu `wrangler.jsonc`
- [ ] `git status` bersih (tidak ada `.wrangler/`)

---

## 4. FASE 9B — UX MVP

> Detail kode lengkap WP-1 & WP-3 ada di bawah (disalin ke sini agar plan ini self-contained). Rujukan silang: `docs/rencana-ux-polish-admin.md` §5 dan §6.

### 9B-1. WP-5 — Media Bisa Dicari via Nama File

**Effort:** 15 menit · **Risiko:** sangat rendah · **DB:** tidak berubah

**File:** `apps/cms/src/collections/Media.ts`

**Patch:**

```diff
   admin: {
     group: 'Konten & Blog',
     useAsTitle: 'alt',
     defaultColumns: ['alt', 'filename', 'filesize', 'createdAt'],
+    listSearchableFields: ['alt', 'filename', 'caption'],
   },
```

**Kenapa:** tanpa `listSearchableFields`, kotak pencarian daftar Media tidak mencari `filename`. Admin yang ingat nama file (`promo-oktober.webp`) tapi lupa alt tidak bisa menemukannya.

**Kriteria penerimaan:**
- [ ] Di `/admin/collections/media`, cari potongan `filename` → hasil muncul.
- [ ] Cari potongan `alt` → hasil muncul.
- [ ] Cari potongan `caption` → hasil muncul.
- [ ] `npx tsc --noEmit` exit 0.

**Rollback:** hapus satu baris.

---

### 9B-2. WP-1 — Simpan & Terbitkan di Dalam Builder

**Effort:** 1,5–2 hari · **Risiko:** sedang · **DB:** tidak berubah
**Dependensi:** tidak ada (boleh jalan paralel dengan 9B-1)

#### 9B-2.1 Fakta teknis yang sudah diverifikasi (jangan diasumsikan ulang)

| Fakta | Konsekuensi |
|---|---|
| `submit({ overrides, skipValidation })` dari `useForm()` memakai `action` form edit view | Aman untuk create **dan** edit — jangan menulis fetch manual |
| `skipValidation: true` = perilaku tombol "Save Draft" Payload | Draft boleh invalid |
| `skipValidation: false` = validasi penuh (client + server) | Publish wajib valid |
| Sukses → Payload sudah memanggil `setModified(false)` | Tetap panggil eksplisit agar deterministik |
| `dispatchFields({type:'UPDATE'})` **tidak** menandai modified | Wajib `setModified(true)` |
| `useFormModified()` tersedia & akurat | Ganti `hasUnsavedChanges` lokal |
| `docInfo.hasSavePermission` / `hasPublishPermission` | Sumber kebenaran tombol mana yang tampil |
| `LeaveWithoutSaving` sudah menangani `beforeunload` + navigasi route | Jangan buat guard duplikat |
| `ConfirmationModal` Payload merender di root admin | **Jangan** dipakai di dalam portal builder (z-index) |
| `useDocumentInfo().lastUpdateTime` berubah setelah simpan | Pemicu auto-refresh `PreviewFrame` |

#### 9B-2.2 File

| File | Aksi |
|---|---|
| `apps/cms/src/components/admin/builder/useBuilderSave.ts` | **BARU** |
| `apps/cms/src/components/admin/builder/BuilderField.tsx` | Ubah import, state, header, shortcut, dialog, kartu form, `PreviewFrame` |
| `apps/cms/tests/ux-polish.test.ts` | **BARU** (test helper murni; lihat 9B-3) |

#### 9B-2.3 Langkah 1 — Hook `useBuilderSave.ts`

```tsx
'use client';

import { useCallback, useState } from 'react';
import { useDocumentInfo, useForm } from '@payloadcms/ui';

export type SaveIntent = 'draft' | 'publish';

export interface BuilderSaveApi {
  save: (intent: SaveIntent) => Promise<boolean>;
  isSaving: boolean;
  intent: SaveIntent | null;
  error: string | null;
  lastSavedAt: number | null;
  isNew: boolean;
  canSave: boolean;
  canPublish: boolean;
}

export function useBuilderSave(): BuilderSaveApi {
  const { submit, setModified } = useForm();
  const docInfo = useDocumentInfo();

  const [isSaving, setIsSaving] = useState(false);
  const [intent, setIntent] = useState<SaveIntent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const save = useCallback(
    async (next: SaveIntent): Promise<boolean> => {
      if (isSaving) return false;

      setIsSaving(true);
      setIntent(next);
      setError(null);

      try {
        // `submit` memakai `action` dari Form edit view (create & edit sama-sama benar).
        // Draft: boleh tidak valid (skipValidation) — sama seperti tombol Save Draft Payload.
        // Publish: validasi penuh dijalankan server & client.
        const result: any = await (submit as any)({
          overrides: { _status: next },
          skipValidation: next === 'draft',
        });

        const ok = Boolean(result?.res?.ok);

        if (!ok) {
          setError(
            next === 'publish'
              ? 'Penerbitan gagal. Periksa daftar kesalahan di banner merah.'
              : 'Penyimpanan gagal. Periksa daftar kesalahan di banner merah.',
          );
          return false;
        }

        setModified(false);
        setLastSavedAt(Date.now());
        return true;
      } catch (err) {
        setError((err as Error)?.message || 'Terjadi kesalahan tak terduga saat menyimpan.');
        return false;
      } finally {
        setIsSaving(false);
        setIntent(null);
      }
    },
    [isSaving, submit, setModified],
  );

  return {
    save,
    isSaving,
    intent,
    error,
    lastSavedAt,
    isNew: !docInfo?.id,
    canSave: docInfo?.hasSavePermission !== false,
    canPublish: docInfo?.hasPublishPermission === true,
  };
}
```

> **Jangan** menghapus `(submit as any)`. Tipe `Submit` di `@payloadcms/ui` generic; cast ini disengaja.

#### 9B-2.4 Langkah 2 — Import `BuilderField.tsx`

```tsx
import { useForm, useFormFields, useDocumentInfo, useFormModified } from '@payloadcms/ui';
import {
  Undo2, Redo2, X, Sparkles, Layers, Sliders, ExternalLink, Save, Rocket, Loader2,
} from 'lucide-react';
import { useBuilderSave } from './useBuilderSave';
```

> `Sliders` sudah dipakai di file saat ini — pertahankan agar tidak ada import hilang.

#### 9B-2.5 Langkah 3 — State & hook

Ganti blok state (baris ~14–21):

```tsx
export const BuilderField: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const { dispatchFields, setModified } = useForm();
  const docInfo = useDocumentInfo();
  const modified = useFormModified();
  const {
    save, isSaving, intent: saveIntent, error: saveError,
    lastSavedAt, canSave, canPublish, isNew,
  } = useBuilderSave();
```

**Hapus** `const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);` dan semua referensinya.

#### 9B-2.6 Langkah 4 — Tandai modified pada perubahan layout & undo/redo

```tsx
  const updatePayloadLayout = useCallback(
    (newLayout: LayoutBlock[]) => {
      setModified(true);
      dispatchFields({ type: 'UPDATE', path: 'layout', value: newLayout });
    },
    [dispatchFields, setModified],
  );
```

```tsx
  const { canUndo, canRedo, pushSnapshot, undo, redo, resetHistory } =
    useBuilderHistory<LayoutBlock[]>(layout, (restoredLayout) => {
      setModified(true);
      dispatchFields({ type: 'UPDATE', path: 'layout', value: restoredLayout });
    });
```

Effect reset history:

```tsx
  const lastUpdateTime = (docInfo as any)?.lastUpdateTime;

  useEffect(() => {
    if (docInfo?.id) resetHistory();
    // Sengaja tidak menyentuh `setModified` — itu urusan `submit` Payload.
  }, [docInfo?.id, lastUpdateTime, resetHistory]);
```

#### 9B-2.7 Langkah 5 — Shortcut `Ctrl/Cmd+S`

Di handler `keydown`, **paling atas** sebelum logika `z`:

```tsx
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      e.stopPropagation();
      if (!isSaving && canSave) void save('draft');
      return;
    }
```

Dependency array handler:

```tsx
  }, [isOpen, isAddMenuOpen, selectedSectionId, canUndo, canRedo, undo, redo, layout, isSaving, canSave, save]);
```

#### 9B-2.8 Langkah 6 — Escape menolak menutup builder kotor

```tsx
      } else if (e.key === 'Escape') {
        if (isAddMenuOpen) {
          setIsAddMenuOpen(false);
        } else if (showCloseConfirm) {
          setShowCloseConfirm(false);
        } else if (selectedSectionId) {
          setSelectedSectionId(null);
        } else if (modified) {
          setShowCloseConfirm(true);
        } else {
          setIsOpen(false);
        }
      }
```

#### 9B-2.9 Langkah 7 — Header baru

Ganti **seluruh** `<header>…</header>` (baris ~208–257):

```tsx
      <header className="h-[52px] bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 motion-safe:animate-pulse shrink-0" aria-hidden="true" />
          <h1 className="text-sm font-bold text-white truncate max-w-[150px] sm:max-w-[260px]" title={title}>
            {title}
          </h1>

          <span
            className={`text-[11px] px-2 py-0.5 rounded font-mono font-semibold uppercase shrink-0 ${
              status === 'published'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-800 text-amber-400 border border-slate-700'
            }`}
          >
            {status === 'published' ? 'Terbit' : 'Draf'}
          </span>

          <span className="hidden lg:inline text-[11px] text-slate-400" aria-live="polite">
            {isSaving
              ? saveIntent === 'publish' ? 'Menerbitkan…' : 'Menyimpan…'
              : modified
                ? '● Belum disimpan'
                : lastSavedAt
                  ? `Tersimpan ${new Date(lastSavedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                  : null}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => canUndo && undo(layout)}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 transition-colors"
          >
            <Undo2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => canRedo && redo(layout)}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 transition-colors"
          >
            <Redo2 size={16} />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" aria-hidden="true" />

          {canSave && (
            <button
              type="button"
              onClick={() => void save('draft')}
              disabled={isSaving}
              className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-slate-100 rounded-lg text-xs font-semibold transition-colors"
              aria-label="Simpan draf"
            >
              {isSaving && saveIntent === 'draft'
                ? <Loader2 size={15} className="animate-spin" />
                : <Save size={15} />}
              <span className="hidden sm:inline">Simpan Draf</span>
            </button>
          )}

          {canPublish && (
            <button
              type="button"
              onClick={() => void save('publish')}
              disabled={isSaving}
              className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              aria-label={docInfo?.hasPublishedDoc ? 'Terbitkan perubahan' : 'Terbitkan halaman'}
            >
              {isSaving && saveIntent === 'publish'
                ? <Loader2 size={15} className="animate-spin" />
                : <Rocket size={15} />}
              <span className="hidden sm:inline">
                {docInfo?.hasPublishedDoc ? 'Terbitkan Perubahan' : 'Terbitkan'}
              </span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-700 mx-1" aria-hidden="true" />

          <button
            type="button"
            onClick={() => (modified ? setShowCloseConfirm(true) : setIsOpen(false))}
            className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            aria-label="Tutup builder"
          >
            <X size={15} />
            <span className="hidden sm:inline">Tutup</span>
          </button>
        </div>
      </header>

      {saveError && (
        <div role="alert" className="shrink-0 bg-red-950 border-b border-red-800 px-4 py-2 text-xs text-red-200">
          {saveError}
        </div>
      )}
```

> Banner `saveError` ini **sementara**; 9B-3 menambahkan `BuilderValidationBanner` tepat setelahnya.

#### 9B-2.10 Langkah 8 — Dialog konfirmasi tutup

Tambahkan **sebelum** penutup `</div>` portal (setelah `<AddSectionMenu … />`):

```tsx
      {showCloseConfirm && (
        <div
          className="absolute inset-0 z-[100000] flex items-center justify-center bg-slate-950/70 p-4"
          role="presentation"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCloseConfirm(false); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="kala-close-title"
            aria-describedby="kala-close-desc"
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl"
          >
            <h2 id="kala-close-title" className="text-base font-bold text-slate-900 m-0">
              Tutup builder?
            </h2>
            <p id="kala-close-desc" className="mt-2 text-xs leading-relaxed text-slate-600">
              Masih ada perubahan yang <strong>belum disimpan</strong>. Menutup builder tidak menghapus
              perubahan — perubahan tetap ada di formulir sampai Anda menekan <em>Simpan Draf</em>.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={async () => {
                  const ok = await save('draft');
                  if (ok) { setShowCloseConfirm(false); setIsOpen(false); }
                }}
                className="w-full rounded-lg bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 disabled:opacity-60"
              >
                {isSaving ? 'Menyimpan…' : 'Simpan Draf & Tutup'}
              </button>

              <button
                type="button"
                onClick={() => { setShowCloseConfirm(false); setIsOpen(false); }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tutup Tanpa Menyimpan
              </button>

              <button
                type="button"
                onClick={() => setShowCloseConfirm(false)}
                className="w-full rounded-lg px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
```

#### 9B-2.11 Langkah 9 — Tombol simpan di kartu dalam formulir

Di `inFormCard`, bungkus tombol lama dan tambahkan tombol draf:

```tsx
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {canSave && modified && (
            <button
              type="button"
              onClick={() => void save('draft')}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-lg border border-teal-700 text-teal-800 text-xs font-bold hover:bg-teal-50 disabled:opacity-60"
            >
              {isSaving ? 'Menyimpan…' : 'Simpan Draf'}
            </button>
          )}

          {/* tombol "Buka Visual Page Builder" yang sudah ada */}
        </div>
```

#### 9B-2.12 Langkah 10 — Teruskan status ke `PreviewFrame`

```tsx
          <PreviewFrame
            collection={collectionSlug}
            docId={docInfo?.id}
            slug={slug}
            hasUnsavedChanges={modified}
            selectedSectionId={selectedSectionId}
            onSelectFromIframe={(sectionId) => setSelectedSectionId(sectionId)}
            lastSaved={lastUpdateTime}
          />
```

> `onSaveDraft`/`isSavingDraft`/`canSaveDraft` ditambahkan di **9C-1 (WP-2)**.

#### 9B-2.13 Edge case wajib diuji

| Kasus | Perilaku benar |
|---|---|
| Dokumen baru (belum ada ID) | Tombol Simpan Draf tampil; setelah sukses Payload redirect ke edit view; buka builder → preview aktif |
| Role tanpa izin publish | Tombol Terbitkan **tidak tampil** |
| Role read-only | Kedua tombol tersembunyi; builder tetap bisa dibuka |
| Terbitkan gagal validasi | Tetap di builder; banner error muncul; tidak ada data hilang |
| Simpan draf dengan field wajib kosong | **Berhasil** (`skipValidation`) |
| Klik Tutup saat kotor | Dialog 3 opsi |
| Tutup tab / F5 saat kotor | Prompt bawaan browser (`LeaveWithoutSaving`) |
| Klik menu sidebar saat kotor | Modal "leave without saving" Payload |
| `Ctrl+S` ditekan cepat berulang | Hanya satu request (`isSaving` guard) |
| Simpan sukses | Badge "Tersimpan HH:mm"; preview auto-refresh |
| Simpan gagal (500) | Banner merah; status tetap "Belum disimpan"; data utuh |
| Dokumen `published` diedit | Header menampilkan "Terbitkan Perubahan" |

#### 9B-2.14 Kriteria penerimaan

- [ ] Builder punya tombol **Simpan Draf** & **Terbitkan**.
- [ ] `Ctrl/Cmd+S` menyimpan draf tanpa menutup builder.
- [ ] Badge: `● Belum disimpan` → `Tersimpan HH:mm`.
- [ ] Tutup saat kotor → dialog 3 opsi.
- [ ] `setModified(true)` terpanggil untuk perubahan layout **dan** undo/redo.
- [ ] Simpan dari builder → reload → perubahan persisted.
- [ ] Terbitkan dari builder → `_status = published`.
- [ ] Role `author`/`preview` tidak melihat tombol Terbitkan.
- [ ] `npx tsc --noEmit` exit 0.
- [ ] `npm test --workspace=cms-kala` hijau.

#### 9B-2.15 Rollback

`git revert` commit WP-1. **Tidak ada perubahan data.** `dispatchFields` lama tetap kompatibel; `hasUnsavedChanges` bisa dikembalikan tanpa menyentuh DB.

---

### 9B-3. WP-3 — Banner Error Validasi di Dalam Builder

**Effort:** 0,5–1 hari · **Risiko:** rendah · **DB:** tidak berubah
**Dependensi:** WP-1 (butuh `submit` untuk memicu `submitted`)

#### 9B-3.1 File

| File | Aksi |
|---|---|
| `apps/cms/src/components/admin/builder/validation-utils.ts` | **BARU** — fungsi murni |
| `apps/cms/src/components/admin/builder/BuilderValidationBanner.tsx` | **BARU** |
| `apps/cms/src/components/admin/builder/BuilderField.tsx` | Render banner |
| `apps/cms/tests/ux-polish.test.ts` | **BARU** — unit test parser |

#### 9B-3.2 `validation-utils.ts`

```ts
export interface ParsedFieldPath {
  /** null = error level array `layout`, bukan baris tertentu */
  rowIndex: number | null;
  /** field di dalam blok, mis. 'title' atau 'images.2.alt' */
  fieldPath: string;
}

/**
 * Mengubah path form Payload menjadi info baris & field.
 * 'layout'                → { rowIndex: null, fieldPath: '' }
 * 'layout.3'              → { rowIndex: 3,    fieldPath: '' }
 * 'layout.3.title'        → { rowIndex: 3,    fieldPath: 'title' }
 * 'layout.3.images.0.alt' → { rowIndex: 3,    fieldPath: 'images.0.alt' }
 */
export function parseBuilderFieldPath(path: string): ParsedFieldPath | null {
  if (path !== 'layout' && !path.startsWith('layout.')) return null;
  if (path === 'layout') return { rowIndex: null, fieldPath: '' };

  const parts = path.split('.');
  const rowIndex = Number(parts[1]);

  if (!Number.isInteger(rowIndex) || rowIndex < 0) {
    return { rowIndex: null, fieldPath: parts.slice(1).join('.') };
  }

  return { rowIndex, fieldPath: parts.slice(2).join('.') };
}

export const BUILDER_FIELD_LABELS: Record<string, string> = {
  title: 'Judul',
  subtitle: 'Subjudul',
  badge: 'Badge',
  heading: 'Judul',
  description: 'Deskripsi',
  image: 'Gambar',
  imageAlt: 'Teks alternatif gambar',
  images: 'Galeri gambar',
  alt: 'Teks alternatif',
  caption: 'Keterangan',
  ctaLabel: 'Teks tombol',
  ctaHref: 'Tautan tombol',
  buttonText: 'Teks tombol',
  buttonLink: 'Tautan tombol',
  href: 'Tautan',
  url: 'URL',
  items: 'Daftar item',
  questions: 'Daftar pertanyaan',
  answer: 'Jawaban',
  name: 'Nama',
  price: 'Harga',
  slug: 'Slug',
  refCode: 'Kode referensi',
};

export function humanizeBuilderField(fieldPath: string): string {
  if (!fieldPath) return 'Susunan seksi';

  const segments = fieldPath.split('.').filter((s) => !/^\d+$/.test(s));
  const last = segments[segments.length - 1] || fieldPath;

  return BUILDER_FIELD_LABELS[last] ?? last.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}
```

#### 9B-3.3 `BuilderValidationBanner.tsx`

```tsx
'use client';

import React, { useMemo } from 'react';
import { AlertTriangle, ChevronRight, FormInput } from 'lucide-react';
import { useAllFormFields, useFormSubmitted } from '@payloadcms/ui';
import { parseBuilderFieldPath, humanizeBuilderField } from './validation-utils';
import type { LayoutBlock } from './useBuilderLayout';

interface BuilderValidationBannerProps {
  layout: LayoutBlock[];
  onFocusSection: (sectionId: string) => void;
  onOpenFormMode: () => void;
}

interface RowError {
  key: string;
  path: string;
  message: string;
  rowIndex: number | null;
  fieldPath: string;
}

export const BuilderValidationBanner: React.FC<BuilderValidationBannerProps> = ({
  layout,
  onFocusSection,
  onOpenFormMode,
}) => {
  const [fields] = useAllFormFields();
  const submitted = useFormSubmitted();

  const errors = useMemo<RowError[]>(() => {
    if (!submitted) return [];

    const out: RowError[] = [];
    for (const [path, state] of Object.entries(fields as Record<string, any>)) {
      if (!state || state.valid !== false) continue;

      const parsed = parseBuilderFieldPath(path);
      if (!parsed) continue;

      out.push({
        key: path,
        path,
        message: state.errorMessage || 'Nilai tidak valid.',
        rowIndex: parsed.rowIndex,
        fieldPath: parsed.fieldPath,
      });
    }
    return out;
  }, [fields, submitted]);

  if (!submitted || errors.length === 0) return null;

  const MAX_VISIBLE = 4;
  const visible = errors.slice(0, MAX_VISIBLE);
  const remaining = errors.length - visible.length;

  return (
    <div role="alert" className="shrink-0 bg-red-950/95 border-b border-red-800 px-4 py-2.5">
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="text-red-300 mt-0.5 shrink-0" aria-hidden="true" />

        <div className="min-w-0 flex-1">
          <p className="m-0 text-xs font-bold text-red-100">
            {errors.length} field perlu diperbaiki sebelum bisa disimpan/diterbitkan.
          </p>

          <ul className="mt-1.5 mb-0 list-none p-0 space-y-1">
            {visible.map((err) => {
              const block = err.rowIndex !== null ? layout[err.rowIndex] : null;
              const sectionId = block ? (block.id || block.blockType) : null;
              const sectionLabel = block
                ? `Seksi ${err.rowIndex! + 1} · ${block.blockType}`
                : 'Susunan seksi';

              return (
                <li key={err.key} className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-red-200 truncate">
                    <strong className="text-red-100">{sectionLabel}</strong>
                    {' → '}
                    {humanizeBuilderField(err.fieldPath)}: {err.message}
                  </span>

                  {sectionId && (
                    <button
                      type="button"
                      onClick={() => onFocusSection(String(sectionId))}
                      className="flex items-center gap-0.5 text-[11px] font-bold text-red-100 hover:text-white shrink-0"
                    >
                      Buka <ChevronRight size={12} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {remaining > 0 && (
            <p className="mt-1 mb-0 text-[11px] text-red-300">
              +{remaining} kesalahan lain. Buka mode formulir untuk melihat semuanya.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenFormMode}
          className="flex items-center gap-1 rounded-md border border-red-700 px-2 py-1 text-[11px] font-semibold text-red-100 hover:bg-red-900 shrink-0"
        >
          <FormInput size={12} />
          Mode Formulir
        </button>
      </div>
    </div>
  );
};
```

> **Perubahan dari plan UX lama:** guard `submitted` dipindah **ke dalam** `useMemo`, sehingga iterasi `useAllFormFields` tidak dilakukan sebelum submit. Ini menghilangkan catatan performa di plan lama.

#### 9B-3.4 Pasang di `BuilderField`

Tepat **setelah** blok `{saveError && …}`:

```tsx
      <BuilderValidationBanner
        layout={layout}
        onFocusSection={(id) => setSelectedSectionId(id)}
        onOpenFormMode={() => {
          setModified(true);
          dispatchFields({ type: 'UPDATE', path: 'editorMode', value: 'form' });
          setIsOpen(false);
          setShowCloseConfirm(false);
        }}
      />
```

Import:

```tsx
import { BuilderValidationBanner } from './BuilderValidationBanner';
```

> `editorMode` sudah ada di `Pages.ts` (~baris 405) dan `LandingPages.ts` (~baris 272).

#### 9B-3.5 Unit test `apps/cms/tests/ux-polish.test.ts`

```ts
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseBuilderFieldPath,
  humanizeBuilderField,
} from '../src/components/admin/builder/validation-utils';

describe('parseBuilderFieldPath', () => {
  test('mengenali error level array', () => {
    assert.deepEqual(parseBuilderFieldPath('layout'), { rowIndex: null, fieldPath: '' });
  });

  test('mengenali baris tanpa field', () => {
    assert.deepEqual(parseBuilderFieldPath('layout.3'), { rowIndex: 3, fieldPath: '' });
  });

  test('mengenali field di dalam blok', () => {
    assert.deepEqual(parseBuilderFieldPath('layout.0.title'), { rowIndex: 0, fieldPath: 'title' });
  });

  test('mengenali field bersarang di dalam inner item', () => {
    assert.deepEqual(parseBuilderFieldPath('layout.3.images.0.alt'), {
      rowIndex: 3,
      fieldPath: 'images.0.alt',
    });
  });

  test('mengabaikan path di luar layout', () => {
    assert.equal(parseBuilderFieldPath('title'), null);
    assert.equal(parseBuilderFieldPath('seo.meta.title'), null);
  });

  test('menangani indeks tidak valid', () => {
    assert.deepEqual(parseBuilderFieldPath('layout.abc'), {
      rowIndex: null,
      fieldPath: 'abc',
    });
  });
});

describe('humanizeBuilderField', () => {
  test('memakai label ramah', () => {
    assert.equal(humanizeBuilderField('imageAlt'), 'Teks alternatif gambar');
    assert.equal(humanizeBuilderField('layout.0.ctaLabel'), 'Teks tombol');
  });

  test('membuang segmen angka', () => {
    assert.equal(humanizeBuilderField('images.2.alt'), 'Teks alternatif');
  });

  test('fallback ke camelCase yang dirapikan', () => {
    assert.equal(humanizeBuilderField('someOddField'), 'Some Odd Field');
  });

  test('kosong berarti susunan seksi', () => {
    assert.equal(humanizeBuilderField(''), 'Susunan seksi');
  });
});
```

**Daftarkan test di `apps/cms/package.json`:**

```json
    "test": "cross-env NODE_OPTIONS=--no-deprecation tsx --test tests/security-and-parity.test.ts tests/ux-polish.test.ts"
```

#### 9B-3.6 Kriteria penerimaan

- [ ] Tambah blok Hero, kosongkan Judul, klik Terbitkan → banner muncul.
- [ ] Banner menyebut **nomor seksi + nama field + pesan**.
- [ ] Klik "Buka" → seksi terpilih di sidebar.
- [ ] Klik "Mode Formulir" → builder tertutup; form Payload menampilkan error field blocks.
- [ ] Banner **tidak** muncul saat mengetik normal sebelum submit.
- [ ] Banner hilang setelah error diperbaiki & simpan berhasil.
- [ ] `npm test --workspace=cms-kala` hijau (10 test lama + 10 test baru).
- [ ] `npx tsc --noEmit` exit 0.

#### 9B-3.7 Rollback

Hapus render `<BuilderValidationBanner />` + 2 file baru + entri test. Tidak ada efek samping.

**Gate G-2 (wajib lulus sebelum 9C):**
- [ ] Simpan draf dari builder → reload → persisted
- [ ] Terbitkan dari builder → perubahan tayang di produksi setelah deploy
- [ ] Banner validasi tampil pada publish invalid
- [ ] `verify:deploy` tetap exit 0 setelah deploy 9B
- [ ] Tidak ada regresi pada dokumen lama (buka 3 LP lama → render & simpan OK)

---

## 5. FASE 9C — UX Lanjutan

> Semua spesifikasi kode lengkap ada di `docs/rencana-ux-polish-admin.md`. Bagian di bawah adalah ringkasan yang **cukup untuk mengeksekusi**, dengan rujukan bagian.

### 9C-1. WP-2 — CTA "Simpan Draf" di Panel Preview Kosong

- **Ref:** `docs/rencana-ux-polish-admin.md` §7
- **File:** `apps/cms/src/components/admin/builder/PreviewFrame.tsx`, `BuilderField.tsx`
- **Inti perubahan:**
  1. Tambah props `onSaveDraft?: () => void`, `isSavingDraft?: boolean`, `canSaveDraft?: boolean`.
  2. Di `fetchToken`, saat `!docId`, jangan hanya `setError(...)`. Render empty state dengan tombol **Simpan Draf** (jika `canSaveDraft && onSaveDraft`).
  3. Teruskan props dari `BuilderField` (lihat 9B-2.12).
- **Kriteria penerimaan:**
  - [ ] Dokumen baru → panel preview menampilkan tombol Simpan Draf, bukan dead-end.
  - [ ] Klik tombol → dokumen tersimpan, `docId` terisi, preview otomatis load.
  - [ ] Role tanpa izin simpan → tombol tidak tampil, teks penjelasan tetap ada.
  - [ ] Setelah sukses, tombol hilang (preview sudah aktif).
- **Rollback:** hapus props + empty state baru.

### 9C-2. WP-8 — Badge Status Deploy di Halaman Dokumen

- **Ref:** `docs/rencana-ux-polish-admin.md` §8
- **File baru:** `apps/cms/src/components/admin/DeployStatusPill.tsx`
- **Daftarkan** sebagai `admin.components.edit.beforeDocumentControls` atau `edit.afterDocumentControls` pada `Pages.ts` & `LandingPages.ts` (pilih satu; jangan dua-duanya).
- **Endpoint:** `GET /api/deploy-status` (sudah ada di `payload.config.ts`, memakai `getDeployStatus()`).
- **Batasan yang WAJIB didokumentasikan di komponen:**
  - Status disimpan **in-memory** per instance Node (`let lastTriggerTime`), bukan di DB.
  - Restart CMS / multi-instance → status bisa `idle` padahal build berjalan.
  - Jadi badge bersifat **indikatif**, bukan sumber kebenaran. Sumber kebenaran = dashboard Cloudflare + `verify:deploy`.
- **Polling:** maksimal 1 request / 15 detik; berhenti saat `status !== 'triggered'`.
- **Kriteria penerimaan:**
  - [ ] Publish → badge "Deploy dipicu" muncul dalam ≤ 5 detik.
  - [ ] Tidak ada spam request (cek Network tab).
  - [ ] CMS restart → badge kembali `idle` (dokumentasikan sebagai known limitation).
  - [ ] Tidak crash bila endpoint 500.
- **Rollback:** hapus komponen + entri registrasi (`generate:importmap` bila didaftarkan via path string).

### 9C-3. WP-6 — Token Warna & Guard Dark Mode (dahulu WP-7)

- **Ref:** `docs/rencana-ux-polish-admin.md` §10
- **Kenapa didahulukan:** WP-7 memakai `var(--kala-link)`.
- **File baru:** `apps/cms/src/app/(payload)/kala-dashboard.scss` (import di `layout.tsx` setelah `custom.scss`)
- **Tahap A (wajib):** kunci tema terang — paksa `data-theme="light"` pada `html` admin, atau override `--theme-*` minimum. Tujuannya mencegah dark mode Payload membuat builder/teks tidak terbaca.
- **Tahap B:** definisikan token:
  ```scss
  :root {
    --kala-link: var(--theme-success-600, #0f766e);
    --kala-text-muted: var(--theme-elevation-600, #64748b);
    --kala-surface: var(--theme-elevation-0, #ffffff);
    --kala-border: var(--theme-elevation-150, #e2e8f0);
  }
  ```
- **Migrasi bertahap:** ganti warna hardcoded di `CustomDashboard.tsx` & komponen admin lain dengan token. **Jangan** menyentuh builder portal di WP ini (builder punya palet gelap sendiri, dimigrasikan terpisah bila perlu).
- **Kriteria penerimaan:**
  - [ ] Admin tampil konsisten di OS dark mode.
  - [ ] `rg -n "text-slate-500|text-slate-600" apps/cms/src/components/admin/CustomDashboard.tsx` menurun signifikan (target: 0 untuk teks utama).
  - [ ] `var(--kala-link)` tersedia dan dipakai minimal 1 tempat.
  - [ ] `npm run generate:importmap --workspace=cms-kala` tidak error (SCSS bukan komponen, tapi jalankan bila ada registrasi baru).
- **Rollback:** hapus import scss + file. Tampilan kembali ke `custom.scss` lama.

### 9C-4. WP-7 — Akurasi & Performa Dashboard

- **Ref:** `docs/rencana-ux-polish-admin.md` §9
- **File:** `apps/cms/src/components/admin/CustomDashboard.tsx`
- **Perbaikan wajib:**
  1. **Angka jujur:** `find()` dengan `limit: 50` mengembalikan `totalDocs` **pre-limit**. Tampilkan `totalDocs`, jangan `docs.length`. Saat ini copy di baris ~165/591/740/900 menyesatkan.
  2. **`overrideAccess: true`:** hanya untuk agregasi yang memang perlu lintas-role. Beri komentar eksplisit di setiap pemakaian dan alasan. Jangan menambah pemakaian baru.
  3. **Link salah:** baris ~689 (`/admin/collections/articles`) dan ~935 (`/admin/collections/pages`) harus menuju daftar terfilter yang benar (mis. `/admin/collections/articles?where[seoScore][less_than]=80`). Bila filter URL tidak didukung, arahkan ke daftar polos + hapus klaim "Lihat semua isu".
  4. **Filter hardcoded:** hapus asumsi `_status: 'published'` bila dashboard seharusnya menghitung draft juga — atau beri label eksplisit "hanya terbit".
- **Kriteria penerimaan:**
  - [ ] Angka di kartu = `totalDocs`, bukan jumlah 50 teratas.
  - [ ] Klik "Lihat semua" → daftar yang konsisten dengan angka.
  - [ ] Tidak ada klaim yang tidak bisa dibuktikan data.
  - [ ] Dashboard load < 2 detik pada data produksi.
- **Rollback:** `git revert`. Tidak ada perubahan data.

### 9C-5. WP-4 — Unifikasi Konsep "Buat Halaman"

- **Ref:** `docs/rencana-ux-polish-admin.md` §11
- **File:** `Pages.ts`, `LandingPages.ts`, `PageTypeGuide.tsx` (BARU), `CreatePagePrefill.tsx` (BARU, opsional), `docs/sop-operasional.md`
- **Inti:**
  1. Label & deskripsi dibedakan jelas: **Halaman Website** (SEO/organik, `Pages`) vs **Landing Page Iklan** (kampanye berbayar, `LandingPages`).
  2. Tambah `beforeList` guide yang menjelaskan kapan memakai yang mana, dengan tautan "Buat" langsung.
  3. Prefill `pageType` (opsional) — hanya jika D3 = Opsi B disetujui. Default: **jangan** prefill.
  4. Tambah bagian **"Membuat Halaman Baru"** di `docs/sop-operasional.md` (ini yang ditunda dari 9A-7).
- **Kriteria penerimaan:**
  - [ ] Admin baru bisa menentukan koleksi yang benar tanpa bertanya.
  - [ ] Guide tidak menghalangi form (collapsible / ringkas).
  - [ ] SOP punya langkah 1–N yang bisa diikuti.
  - [ ] `generate:importmap` dijalankan bila `PageTypeGuide` didaftarkan via path string.
- **Rollback:** hapus komponen + entri `beforeList` + revert docs.

### 9C-6. WP-9 — Bahasa, Aksesibilitas, Mobile

- **Ref:** `docs/rencana-ux-polish-admin.md` §12
- **Cakupan:**
  1. **Bahasa:** ganti istilah Inggris yang tidak perlu ("Correct invalid fields" → banner Indonesia sudah ditangani WP-3; sisanya di komponen admin).
  2. **A11y:** `aria-label` pada semua tombol ikon, `role="alert"` pada error, focus ring terlihat, `aria-live="polite"` pada status simpan (sudah di 9B-2).
  3. **Mobile/tablet:** sidebar builder 360px → full-width drawer di < 768px; header tidak overflow (sudah dipartisi di 9B-2.9).
  4. **Focus trap** untuk dialog tutup: `useFocusTrap.ts` (BARU) — Escape mengembalikan fokus ke tombol pemicu.
- **Kriteria penerimaan:**
  - [ ] Tab order logis; tidak ada focus trap bocor.
  - [ ] Semua tombol ikon punya nama aksesibel (cek dengan screen reader / axe).
  - [ ] Builder bisa dipakai di viewport 375px (tidak ada horizontal scroll pada header).
  - [ ] Kontras teks ≥ 4.5:1 untuk teks normal.
- **Rollback:** per WP; tidak ada perubahan data.

---

## 6. Matriks Uji

### 6.1 Unit test

| Test | File | Menjamin |
|---|---|---|
| JWT security (10 test lama) | `apps/cms/tests/security-and-parity.test.ts` | Tidak ada fallback secret; XSS escape |
| `parseBuilderFieldPath` (6) | `apps/cms/tests/ux-polish.test.ts` | Parser path benar |
| `humanizeBuilderField` (4) | `apps/cms/tests/ux-polish.test.ts` | Label ramah |

Perintah: `npm test --workspace=cms-kala`

### 6.2 Uji integrasi manual (per fase)

| Fase | Skenario | Bukti |
|---|---|---|
| 9A | `verify:deploy` | exit 0 + screenshot output |
| 9A | preview-bot POST/DELETE | 403 |
| 9B | Simpan draf dari builder | reload → data ada |
| 9B | Terbitkan invalid | banner + tidak ada data hilang |
| 9B | Dokumen baru | tombol Simpan Draf muncul (setelah 9C-1) |
| 9C | Dashboard angka | cocok dengan `totalDocs` |
| 9C | Mobile 375px | tidak ada horizontal scroll |

### 6.3 Regresi wajib (setelah SEMUA WP)

```powershell
npm run sync:builder
npm test --workspace=cms-kala
cd apps\cms; npx tsc --noEmit; cd ..\..
npm run build --workspace=web-kala
npm run verify:deploy
```

Plus manual:
- [ ] Buka 3 Landing Page lama → render benar, builder bisa dibuka, simpan OK.
- [ ] Buka 3 Halaman (`Pages`) lama → idem.
- [ ] Buat halaman baru dari nol → simpan draf → preview → terbitkan → tayang.
- [ ] Role `marketing` masih bisa kelola halaman.
- [ ] Role `preview` tidak bisa menulis.
- [ ] Role `author` tidak melihat menu Pages/LP.

---

## 7. Rollback

| Unit | Rollback | Dampak data |
|---|---|---|
| 9A-1 Deploy | Pindahkan domain kembali ke Pages lama; restore env | Tidak ada |
| 9A-2 Script | Hapus file + script npm | Tidak ada |
| 9A-3 Role | Kembalikan role user + key lama | Tidak ada (role = app-level) |
| 9A-4 CI | Hapus workflow | Tidak ada |
| 9A-5 Wrangler | `git revert` | Tidak ada |
| 9A-6 gitignore | Hapus baris | Tidak ada |
| 9A-7 Docs | `git revert` | Tidak ada |
| 9A-8 Alt | `git revert` | Data alt yang sudah terisi tetap ada (tidak dihapus) |
| 9B-1 WP-5 | Hapus 1 baris | Tidak ada |
| 9B-2 WP-1 | `git revert` | Tidak ada |
| 9B-3 WP-3 | Hapus render + 2 file | Tidak ada |
| 9C-1 WP-2 | Hapus props + empty state | Tidak ada |
| 9C-2 WP-8 | Hapus komponen + registrasi | Tidak ada |
| 9C-3 WP-6 | Hapus scss import | Tidak ada |
| 9C-4 WP-7 | `git revert` | Tidak ada |
| 9C-5 WP-4 | Hapus guide + revert docs | Tidak ada |
| 9C-6 WP-9 | Per WP | Tidak ada |

**Tidak ada satu pun langkah di Fase 9 yang memerlukan rollback database.**

---

## 8. Risiko & Mitigasi

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| Salah pindah custom domain → situs down | Sedang | Tinggi | Kerjakan di luar jam ramai; siapkan rollback Langkah 4 |
| Build Cloudflare gagal karena `sharp` | Sedang | Sedang | Sudah dimitigasi `5d63160`; `prebuild` men-skip sharp bila tidak tersedia |
| `ALLOW_FALLBACK=false` + CMS down → build gagal | Sedang | Rendah (situs lama tetap) | Dokumentasikan; build gagal = perilaku yang diinginkan |
| Role `preview` merusak preview produksi | Rendah | Tinggi | Uji `GET draft=true` sebelum mengganti key di Worker |
| `submit()` Payload berubah API di update minor | Rendah | Tinggi | Pin versi Payload; test manual sebelum upgrade |
| WP-1 menyebabkan form dirty palsu | Sedang | Sedang | Selalu `setModified(true)` hanya pada perubahan nyata; jangan di effect reset |
| `useAllFormFields` memperlambat builder | Rendah | Rendah | Guard `submitted` di dalam `useMemo` (sudah) |
| CI gagal karena `npm ci` butuh lockfile | Rendah | Rendah | `package-lock.json` root sudah ada |
| Dua developer mengedit `wrangler.jsonc` bersamaan | Rendah | Sedang | Konsolidasi di 9A-5 sebelum kerja paralel |

---

## 9. Definition of Done Fase 9

### Blocker (harus semua ✅)

- [ ] `https://kalababyspa.com/preview/zzz` → **401**
- [ ] `npm run verify:deploy` → **exit 0**
- [ ] `data-use-capi` ada di HTML halaman LP produksi
- [ ] Hash aset live = hash `dist/` lokal
- [ ] `preview-bot` role `preview`; POST/PATCH/DELETE → 403
- [ ] CI hijau di `main` (job `cms` + `web`)
- [ ] Hanya satu `wrangler.jsonc`
- [ ] `git status` bersih (`.wrangler/` ter-ignore)
- [ ] Runbook & SOP tidak lagi menyebut "Pages-only"/"SSG murni"
- [ ] Builder punya Simpan Draf + Terbitkan
- [ ] Banner validasi tampil saat publish invalid
- [ ] Dokumen lama (Pages & LP) tetap bisa dibuka, disimpan, dan ter-render

### Penting (disarankan)

- [ ] WP-2 (CTA simpan draf) selesai
- [ ] WP-8 (badge deploy) selesai
- [ ] WP-6 + WP-7 selesai
- [ ] WP-4 + WP-9 selesai
- [ ] Unit test `ux-polish.test.ts` hijau
- [ ] Tidak ada `console.error` di builder saat alur normal

### Bukti serah-terima

1. Output `npm run verify:deploy` (screenshot/teks).
2. Screenshot builder dengan header baru (Simpan Draf + Terbitkan + badge status).
3. Screenshot banner validasi.
4. Link commit per fase.
5. Catatan known limitation WP-8 (in-memory deploy status).

---

## 10. Checklist Eksekusi

### Persiapan (30 menit)
- [ ] `git status` bersih; commit/stash perubahan yang ada
- [ ] Catat nilai env Worker sebelum diubah
- [ ] Pastikan akses Cloudflare Dashboard + repo GitHub tersedia

### 9A-1 Deploy (1–4 jam, tergantung penyebab)
- [ ] Diagnosa Langkah 1–3
- [ ] Pindahkan custom domain (bila perlu)
- [ ] Lengkapi env var Worker
- [ ] Pasang auto-deploy
- [ ] Purge cache
- [ ] `/preview/zzz` = 401

### 9A-2 Script (30 menit)
- [ ] `scripts/verify-deploy.mjs`
- [ ] `package.json` → `verify:deploy`
- [ ] Uji exit 0 di produksi

### 9A-3 Role (1 jam)
- [ ] `roles.ts` union + konstanta
- [ ] `Users.ts` opsi
- [ ] `preview.ts` komentar
- [ ] Ganti role user + rotasi key
- [ ] Uji 200/403

### 9A-4 CI (45 menit)
- [ ] `.github/workflows/ci.yml`
- [ ] Push → cek Actions hijau
- [ ] Uji negative case (hapus `prerender = false`)

### 9A-5 Wrangler (30 menit)
- [ ] Tentukan root directory
- [ ] Hapus file duplikat
- [ ] `wrangler deploy --dry-run`
- [ ] Deploy & verifikasi

### 9A-6 Gitignore (5 menit)
- [ ] Tambah `.wrangler/`
- [ ] `git status` bersih

### 9A-7 Docs (1 jam)
- [ ] Runbook §1, §3.3, §4.1, §4.2, §8.2, §11
- [ ] SOP alur simpan
- [ ] `rg` memastikan tidak ada klaim usang

### 9A-8 Alt (20 menit)
- [ ] Patch `SectionSettings.tsx`
- [ ] Uji pilih foto galeri
- [ ] `sync:builder`

### 9A-9 Smoke test (45 menit)
- [ ] Skenario 1–4
- [ ] Gate G-1

### 9B-1 WP-5 (15 menit)
- [ ] `listSearchableFields`
- [ ] Uji cari filename/alt/caption

### 9B-2 WP-1 (1,5–2 hari)
- [ ] `useBuilderSave.ts`
- [ ] Import & state
- [ ] `setModified` pada layout + undo/redo
- [ ] `Ctrl+S`
- [ ] Escape guard
- [ ] Header baru
- [ ] Dialog konfirmasi
- [ ] Kartu form
- [ ] `PreviewFrame` props
- [ ] Uji 12 edge case
- [ ] `tsc` + `test`

### 9B-3 WP-3 (0,5–1 hari)
- [ ] `validation-utils.ts`
- [ ] `BuilderValidationBanner.tsx`
- [ ] Pasang di `BuilderField`
- [ ] `ux-polish.test.ts`
- [ ] Update script `test`
- [ ] Uji 7 kriteria

### 9C (3,5–4,5 hari)
- [ ] WP-2
- [ ] WP-8
- [ ] WP-6
- [ ] WP-7
- [ ] WP-4
- [ ] WP-9
- [ ] Regresi penuh §6.3
- [ ] Gate G-3

---

## 11. Lampiran

### 11.1 Peta file

**Fase 9A**

| File | Aksi |
|---|---|
| `scripts/verify-deploy.mjs` | BARU |
| `package.json` | +`verify:deploy` |
| `apps/cms/src/access/roles.ts` | +`preview` role |
| `apps/cms/src/collections/Users.ts` | +opsi role |
| `apps/cms/src/endpoints/preview.ts` | komentar guard |
| `.github/workflows/ci.yml` | BARU |
| `wrangler.jsonc` **atau** `apps/web-kala/wrangler.jsonc` | hapus salah satu |
| `.gitignore` | +`.wrangler/` |
| `docs/runbook-teknis.md` | §1, §3.3, §4.1, §4.2, §8.2, §11 |
| `docs/sop-operasional.md` | alur simpan |
| `apps/cms/src/components/admin/builder/SectionSettings.tsx` | inner alt |

**Fase 9B**

| File | Aksi |
|---|---|
| `apps/cms/src/collections/Media.ts` | +`listSearchableFields` |
| `apps/cms/src/components/admin/builder/useBuilderSave.ts` | BARU |
| `apps/cms/src/components/admin/builder/validation-utils.ts` | BARU |
| `apps/cms/src/components/admin/builder/BuilderValidationBanner.tsx` | BARU |
| `apps/cms/src/components/admin/builder/BuilderField.tsx` | header, shortcut, dialog, banner |
| `apps/cms/tests/ux-polish.test.ts` | BARU |
| `apps/cms/package.json` | script `test` |

**Fase 9C**

| File | Aksi |
|---|---|
| `apps/cms/src/components/admin/builder/PreviewFrame.tsx` | WP-2 |
| `apps/cms/src/components/admin/DeployStatusPill.tsx` | BARU (WP-8) |
| `apps/cms/src/app/(payload)/layout.tsx` | import scss (WP-6) |
| `apps/cms/src/app/(payload)/kala-dashboard.scss` | BARU (WP-6) |
| `apps/cms/src/components/admin/CustomDashboard.tsx` | WP-7 |
| `apps/cms/src/components/admin/PageTypeGuide.tsx` | BARU (WP-4) |
| `apps/cms/src/components/admin/CreatePagePrefill.tsx` | BARU opsional (WP-4) |
| `apps/cms/src/components/admin/builder/useFocusTrap.ts` | BARU (WP-9) |
| `apps/cms/src/collections/Pages.ts` | WP-4, WP-8 |
| `apps/cms/src/collections/LandingPages.ts` | WP-4, WP-8 |
| `docs/sop-operasional.md` | +"Membuat Halaman Baru" (WP-4) |

### 11.2 Perintah cepat

```powershell
# Dev
npm run dev:cms
npm run dev

# Type-check
cd apps\cms; npx tsc --noEmit; cd ..\..

# Test
npm test --workspace=cms-kala

# Parity builder
npm run sync:builder

# Import map (setelah registrasi komponen via path string)
npm run generate:importmap --workspace=cms-kala

# Build web
npm run build --workspace=web-kala

# Verifikasi deploy
npm run verify:deploy
npm run verify:deploy -- --capi-path /sales/babyMassage/

# Cek sisa warna hardcoded (WP-6)
rg -n "text-slate-(500|600)|bg-slate-100" apps/cms/src/components/admin/CustomDashboard.tsx

# Pastikan tidak ada klaim docs usang
rg -n "SSG|Statis Murni|kala-web" docs/

# Dry-run wrangler
npx wrangler deploy --dry-run --outdir .wrangler/dry-run
```

### 11.3 Environment variables (rujukan)

**CMS (`apps/cms/.env`)**

| Variabel | Wajib | Catatan |
|---|---|---|
| `DATABASE_URI` | ✅ | PostgreSQL |
| `PAYLOAD_SECRET` | ✅ | ≥ 32 char; rotasi = logout semua sesi |
| `PREVIEW_SECRET` | ✅ | ≥ 32 char; **identik** dengan Worker |
| `PREVIEW_API_KEY` | ✅ | API key `preview-bot` |
| `PREVIEW_BASE_URL` | ✅ | `https://kalababyspa.com` |
| `CMS_PUBLIC_URL` | ✅ | `https://admin.kalababyspa.com` |
| `CLOUDFLARE_DEPLOY_HOOK_URL` | ✅ | Deploy hook |
| `TELEGRAM_BOT_TOKEN` | opsional | Alert deploy |

**Worker `kalaweb`**

| Variabel | Tipe | Wajib |
|---|---|---|
| `PREVIEW_SECRET` | Secret | ✅ |
| `PREVIEW_API_KEY` | Secret | ✅ |
| `PREVIEW_API_URL` | Plain | ✅ |
| `PAYLOAD_URL` | Plain | ✅ |
| `PUBLIC_GTM_ID` | Plain | ✅ |
| `ALLOW_FALLBACK` | Plain | ✅ (`false` produksi, `true` CI) |
| `PREVIEW_CF_ACCESS_CLIENT_ID` | Secret | bila Access aktif |
| `PREVIEW_CF_ACCESS_CLIENT_SECRET` | Secret | bila Access aktif |

### 11.4 Keputusan yang harus diambil sebelum mulai

| ID | Pertanyaan | Default bila tidak diputuskan |
|---|---|---|
| D1 | Root directory Cloudflare: `.` atau `apps/web-kala`? | `.` (root) |
| D2 | Auto-deploy: Workers Builds atau GitHub Actions? | Workers Builds |
| D3 | WP-4 prefill `pageType`: ya/tidak? | **Tidak** |
| D4 | WP-8: `beforeDocumentControls` atau `afterDocumentControls`? | `afterDocumentControls` |
| D5 | WP-6 Tahap B (migrasi token) dikerjakan sekarang atau ditunda? | Dikerjakan (dibutuhkan WP-7) |

---

**Akhir dokumen.**
