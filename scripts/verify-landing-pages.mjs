#!/usr/bin/env node
/**
 * Verifikasi hasil build landing page (/sales/*) dan preview (/preview/sales/*).
 *
 * Memastikan:
 * - Seluruh slug landing page dibangun dengan benar (bayi-kolik, pijat-newborn, reservasi-online).
 * - Setiap landing page memiliki tag meta pelacakan iklan (kala:lp-slug, kala:variant, kala:ref-code).
 * - Setiap landing page memiliki H1 dan CTA WhatsApp.
 * - Halaman preview draft dibangun dengan banner pratinjau dan tautan editor CMS.
 *
 * Jalankan setelah `npm run build`:
 *   npm run test:landing
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(dirname, '../apps/web-kala/dist');

const expectedSlugs = [
  'bayi-kolik',
  'pijat-newborn',
  'reservasi-online',
];

let failures = 0;

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`✅ ${label}`);
  } else {
    failures += 1;
    console.error(`❌ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

if (!fs.existsSync(dist)) {
  console.error(`❌ Direktori build tidak ditemukan: ${dist}`);
  console.error('   Jalankan `npm run build` terlebih dahulu.');
  process.exit(1);
}

for (const slug of expectedSlugs) {
  const salesPath = path.join(dist, 'sales', slug, 'index.html');
  const html = read(salesPath);

  check(`Halaman /sales/${slug} dibangun`, html.length > 0);
  check(`Halaman /sales/${slug} memiliki H1`, /<h1\b/i.test(html), 'H1 tidak ditemukan');
  check(`Halaman /sales/${slug} memiliki meta kala:lp-slug`, html.includes(`name="kala:lp-slug"`));
  check(`Halaman /sales/${slug} memiliki meta kala:variant`, html.includes(`name="kala:variant"`));
  check(`Halaman /sales/${slug} memiliki meta kala:ref-code`, html.includes(`name="kala:ref-code"`));
  check(`Halaman /sales/${slug} memiliki CTA WhatsApp`, /wa\.me|WhatsApp/i.test(html), 'CTA WhatsApp tidak ditemukan');
  check(`Halaman /sales/${slug} memiliki konten substansial`, html.length > 8000, `Panjang: ${html.length} karakter`);

  const previewPath = path.join(dist, 'preview/sales', slug, 'index.html');
  const preview = read(previewPath);
  check(`Preview /preview/sales/${slug} dibangun`, preview.length > 0);
  check(`Preview /preview/sales/${slug} memakai banner pratinjau`, preview.includes('PRATINJAU DRAFT'));
  check(`Preview /preview/sales/${slug} memiliki link editor CMS`, preview.includes('/admin/collections/pages') || preview.includes('/admin/collections/landing-pages'));
}

if (failures > 0) {
  console.error(`\n${failures} pemeriksaan landing page gagal.`);
  process.exit(1);
}

console.log('\n🎉 Semua pemeriksaan landing page lulus.');
