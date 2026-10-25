#!/usr/bin/env node

/**
 * KalaWeb - Automated WebP Converter
 * Converts JPG and PNG images in public/images directories to WebP.
 * Preserves favicons, apple touch icons, and handles incremental conversion.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const TARGET_DIRS = [
  path.resolve(ROOT_DIR, 'apps/web-kala/public/images'),
  path.resolve(ROOT_DIR, 'apps/cms/public/images'),
];

// Files that should NOT be converted or replaced
const IGNORE_PATTERNS = [
  /favicon/i,
  /apple-touch-icon/i,
  /icon-192/i,
  /icon-512/i,
];

const shouldDeleteOriginals = process.argv.includes('--delete-originals');

function isIgnored(filename) {
  return IGNORE_PATTERNS.some((pattern) => pattern.test(filename));
}

function getCandidateFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getCandidateFiles(fullPath, fileList);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext) && !isIgnored(entry.name)) {
        fileList.push(fullPath);
      }
    }
  }

  return fileList;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

async function convertImage(srcPath) {
  const ext = path.extname(srcPath);
  const webpPath = srcPath.slice(0, -ext.length) + '.webp';

  const srcStat = fs.statSync(srcPath);

  // Check if WebP already exists and is up-to-date
  if (fs.existsSync(webpPath)) {
    const webpStat = fs.statSync(webpPath);
    if (webpStat.mtimeMs >= srcStat.mtimeMs) {
      // Already up to date
      if (shouldDeleteOriginals && fs.existsSync(srcPath)) {
        fs.unlinkSync(srcPath);
        console.log(`🗑️  Deleted original: ${path.relative(ROOT_DIR, srcPath)}`);
      }
      return { skipped: true };
    }
  }

  // Convert to WebP
  await sharp(srcPath)
    .webp({ quality: 85, effort: 4 })
    .toFile(webpPath);

  const webpStat = fs.statSync(webpPath);
  const diffPercent = (((srcStat.size - webpStat.size) / srcStat.size) * 100).toFixed(1);

  console.log(
    `✅ Converted: ${path.relative(ROOT_DIR, srcPath)} -> ${path.basename(webpPath)} ` +
    `(${formatBytes(srcStat.size)} -> ${formatBytes(webpStat.size)}, -${diffPercent}%)`
  );

  if (shouldDeleteOriginals && fs.existsSync(srcPath)) {
    fs.unlinkSync(srcPath);
    console.log(`🗑️  Deleted original: ${path.relative(ROOT_DIR, srcPath)}`);
  }

  return {
    skipped: false,
    savedBytes: srcStat.size - webpStat.size,
  };
}

async function run() {
  console.log(`\n==================================================`);
  console.log(`🚀 [KalaWeb] Starting Automated WebP Conversion`);
  console.log(`==================================================\n`);

  let totalConverted = 0;
  let totalSaved = 0;
  let totalSkipped = 0;

  for (const dir of TARGET_DIRS) {
    const candidates = getCandidateFiles(dir);
    for (const file of candidates) {
      try {
        const result = await convertImage(file);
        if (result.skipped) {
          totalSkipped++;
        } else {
          totalConverted++;
          totalSaved += result.savedBytes;
        }
      } catch (err) {
        console.error(`❌ Failed to convert ${file}:`, err.message);
      }
    }
  }

  console.log(`\n--------------------------------------------------`);
  console.log(`📊 Summary:`);
  console.log(`   - Converted: ${totalConverted} images`);
  console.log(`   - Skipped (up-to-date): ${totalSkipped} images`);
  console.log(`   - Total Storage Saved: ${formatBytes(totalSaved)}`);
  console.log(`--------------------------------------------------\n`);
}

run().catch((err) => {
  console.error('Fatal error during WebP conversion:', err);
  process.exit(1);
});
