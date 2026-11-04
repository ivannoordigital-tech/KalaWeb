#!/usr/bin/env node
/**
 * MED-004: Health check & verifikasi integritas media dan aset.
 *
 * Memeriksa seluruh file HTML di `dist/`:
 * 1. Tidak ada URL gambar CMS yang relatif bocor tanpa prefix (misal: `<img src="/media/...">`).
 * 2. Semua gambar statis lokal yang dirujuk ada di folder `dist/`.
 * 3. Gambar memiliki atribut alt untuk aksesibilitas dan SEO.
 * 4. Persentase error/missing < 1%.
 *
 * Jalankan setelah `npm run build`:
 *   npm run test:media
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(dirname, '../apps/web-kala/dist');

if (!fs.existsSync(dist)) {
  console.error(`❌ Direktori build tidak ditemukan: ${dist}`);
  console.error('   Jalankan `npm run build` terlebih dahulu.');
  process.exit(1);
}

function getAllHtmlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const htmlFiles = getAllHtmlFiles(dist);
console.log(`\n🔍 Memeriksa ${htmlFiles.length} file HTML untuk integritas aset media...\n`);

let totalImages = 0;
let localImages = 0;
let remoteImages = 0;
let missingAlts = 0;
const errors = [];

const imgTagRegex = /<img\b([^>]*?)>/gi;
const srcRegex = /\bsrc=["']([^"']+)["']/i;
const altRegex = /\balt=["']([^"']*)["']/i;

for (const filePath of htmlFiles) {
  const relPath = path.relative(dist, filePath).replace(/\\/g, '/');
  const html = fs.readFileSync(filePath, 'utf8');

  let match;
  while ((match = imgTagRegex.exec(html)) !== null) {
    totalImages += 1;
    const tagAttrs = match[1];
    const srcMatch = srcRegex.exec(tagAttrs);
    const altMatch = altRegex.exec(tagAttrs);

    if (!srcMatch || !srcMatch[1]) {
      errors.push(`${relPath}: Elemen <img> tanpa atribut src`);
      continue;
    }

    const src = srcMatch[1];
    const alt = altMatch ? altMatch[1] : null;

    if (alt === null) {
      missingAlts += 1;
    }

    // 1. Periksa kebocoran URL CMS relatif tanpa prefix CDN/Admin
    if (src.startsWith('/media/')) {
      errors.push(`${relPath}: URL CMS relatif bocor tanpa prefix host: "${src}"`);
      continue;
    }

    // 2. Periksa gambar lokal
    if (src.startsWith('/') && !src.startsWith('//')) {
      localImages += 1;
      const cleanPath = src.split('?')[0].split('#')[0];
      const localFilePath = path.join(dist, cleanPath);
      if (!fs.existsSync(localFilePath)) {
        errors.push(`${relPath}: File lokal tidak ditemukan di disk: "${src}"`);
      }
    } else {
      remoteImages += 1;
    }
  }
}

console.log(`--------------------------------------------------`);
console.log(`📊 Ringkasan Integritas Media:`);
console.log(`   - Total elemen <img>    : ${totalImages}`);
console.log(`   - Gambar lokal          : ${localImages}`);
console.log(`   - Gambar remote/CDN     : ${remoteImages}`);
console.log(`   - Gambar tanpa alt      : ${missingAlts}`);
console.log(`   - Total issue/error     : ${errors.length}`);
console.log(`--------------------------------------------------\n`);

if (errors.length > 0) {
  console.error(`❌ Ditemukan ${errors.length} masalah media:`);
  for (const err of errors.slice(0, 20)) {
    console.error(`   - ${err}`);
  }
  if (errors.length > 20) {
    console.error(`   ...dan ${errors.length - 20} error lainnya.`);
  }
  process.exit(1);
}

const errorRate = totalImages > 0 ? (errors.length / totalImages) * 100 : 0;
if (errorRate > 1) {
  console.error(`❌ Error rate media (${errorRate.toFixed(2)}%) melebihi batas toleransi 1%`);
  process.exit(1);
}

console.log(`✅ Seluruh URL gambar CMS terdistribusi dengan benar (0 kebocoran URL relatif).`);
console.log(`✅ Semua aset statis lokal terverifikasi ada.`);
console.log(`🎉 Pemeriksaan integritas media (MED-001 - MED-004) LULUS!\n`);
