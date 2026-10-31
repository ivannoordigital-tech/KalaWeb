import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { builderRegistry } from '../src/blocks/registry';
import { allBlocks } from '../src/blocks/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 [sync-builder-registry] Memulai validasi paritas registry & blocks...');

const allBlockSlugs = allBlocks.map((b) => b.slug);
const registrySlugs = Object.keys(builderRegistry);

console.log(`📋 Total Blok Terdaftar di Payload allBlocks: ${allBlockSlugs.length}`);
console.log(`📋 Total Blok Terdaftar di Builder Registry: ${registrySlugs.length}`);

// Parity Check 1: Apakah semua block di Payload ada di registry?
const missingInRegistry = allBlockSlugs.filter((s) => !registrySlugs.includes(s));
if (missingInRegistry.length > 0) {
  console.error('❌ FATAL: Blok berikut ada di allBlocks tetapi BELUM terdaftar di builderRegistry:');
  console.error(missingInRegistry);
  process.exit(1);
}

// Parity Check 2: Apakah semua item di registry ada di allBlocks?
const extraInRegistry = registrySlugs.filter((s) => !allBlockSlugs.includes(s));
if (extraInRegistry.length > 0) {
  console.error('❌ FATAL: Item berikut ada di builderRegistry tetapi TIDAK ADA di allBlocks:');
  console.error(extraInRegistry);
  process.exit(1);
}

console.log('✅ Paritas 100% Cocok: 14/14 blok valid dan sinkron.');

// Target File: apps/web-kala/src/components/blocks/registry.generated.json
const targetPath = path.resolve(__dirname, '../../web-kala/src/components/blocks/registry.generated.json');
const targetDir = path.dirname(targetPath);

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const jsonContent = JSON.stringify(builderRegistry, null, 2) + '\n';
fs.writeFileSync(targetPath, jsonContent, 'utf-8');

console.log(`✅ File berhasil di-generate secara idempoten ke:\n   ${targetPath}`);
