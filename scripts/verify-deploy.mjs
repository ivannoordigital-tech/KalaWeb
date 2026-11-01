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
