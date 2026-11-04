#!/usr/bin/env node
/**
 * Verifikasi hasil build artikel blog.
 *
 * Memastikan:
 * - /blog/index.html ada dan memuat minimal satu kartu artikel.
 * - Setiap artikel yang diharapkan memiliki halaman dengan H1 dan konten.
 * - Halaman preview artikel ada dan memakai banner pratinjau.
 *
 * Jalankan setelah `npm run build`:
 *   npm run test:articles
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(dirname, '../apps/web-kala/dist');

const expectedSlugs = [
  'bayi-kolik-malam-hari',
  'manfaat-pijat-oksitosin-ibu-menyusui',
  'panduan-memilih-pijat-bayi-homecare-surabaya',
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

const blogIndex = read(path.join(dist, 'blog/index.html'));
check('Halaman /blog/index.html ada', blogIndex.length > 0);
check('Halaman /blog memuat kartu artikel', /<article\b/i.test(blogIndex), 'Tidak ada elemen <article>');

for (const slug of expectedSlugs) {
  const articlePath = path.join(dist, 'blog', slug, 'index.html');
  const html = read(articlePath);
  check(`Artikel /blog/${slug} dibangun`, html.length > 0);
  check(`Artikel /blog/${slug} memiliki H1`, /<h1\b/i.test(html), 'H1 tidak ditemukan');
  check(`Artikel /blog/${slug} memiliki konten substansial`, html.length > 12000, `Panjang ${html.length} karakter`);

  const previewPath = path.join(dist, 'preview/blog', slug, 'index.html');
  const preview = read(previewPath);
  check(`Preview /preview/blog/${slug} dibangun`, preview.length > 0);
  check(`Preview /preview/blog/${slug} memakai banner pratinjau`, preview.includes('Mode pratinjau'));
}

if (failures > 0) {
  console.error(`\n${failures} pemeriksaan gagal.`);
  process.exit(1);
}

console.log('\n🎉 Semua pemeriksaan artikel lulus.');
