#!/usr/bin/env node
/**
 * Pemeriksaan cepat domain admin CMS.
 * Mendeteksi kasus Cloudflare 525/521/522 (SSL/routing putus) sebelum
 * dianggap "CMS rusak".
 *
 * Jalankan: npm run test:admin-domain
 */

const TARGETS = [
  { name: 'Admin CMS', url: 'https://admin.kalababyspa.com/admin', ok: (s) => s >= 200 && s < 400 },
  { name: 'Login CMS', url: 'https://admin.kalababyspa.com/admin/login', ok: (s) => s === 200 },
  { name: 'API CMS', url: 'https://admin.kalababyspa.com/api/pages?limit=1', ok: (s) => s < 500 },
  { name: 'Homepage', url: 'https://kalababyspa.com/', ok: (s) => s === 200 },
];

const CLOUDFLARE_SSL_ERRORS = new Set([521, 522, 523, 524, 525, 526]);

function hint(status) {
  if (CLOUDFLARE_SSL_ERRORS.has(status)) {
    return 'Cloudflare tidak bisa handshake ke origin. Cek Caddy: blok admin.kalababyspa.com ada, lalu restart container caddy.';
  }
  if (status === 502 || status === 503) {
    return 'Origin/CMS tidak merespons. Cek container kala-cms-app dan log-nya.';
  }
  return '';
}

async function check(target) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(target.url, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
      headers: { 'user-agent': 'KalaWeb-AdminDomainCheck/1.0' },
    });
    const status = res.status;
    const passed = target.ok(status);
    console.log(`${passed ? '✅' : '❌'} ${target.name}: ${status} ${target.url}`);
    if (!passed) {
      const h = hint(status);
      if (h) console.log(`   ↳ ${h}`);
    }
    return passed;
  } catch (error) {
    console.log(`❌ ${target.name}: ERROR ${error.message}`);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

const results = [];
for (const target of TARGETS) {
  results.push(await check(target));
}

const failed = results.filter((ok) => !ok).length;
if (failed > 0) {
  console.error(`\n❌ ${failed} pemeriksaan gagal.`);
  process.exit(1);
}
console.log('\n✅ Semua domain merespons normal.');
