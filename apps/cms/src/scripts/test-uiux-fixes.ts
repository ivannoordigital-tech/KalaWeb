/**
 * Test regresi untuk perbaikan UI/UX P0:
 * - media kosong tidak boleh menyebabkan crash
 * - skor SEO 0/default tidak boleh disalahartikan sebagai skor valid
 */
import {
  getMediaDisplay,
  getMediaThumbUrl,
  hasMediaValue,
} from '../components/admin/builder/media-utils';
import {
  hasUsableSeoMetrics,
  resolveSeoScore,
} from '../lib/seo-engine/display';
import { readFileSync } from 'node:fs';
import { Articles } from '../collections/Articles';
import { SiteSettings } from '../globals/SiteSettings';

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean) {
  if (condition) {
    console.log(`✓ LULUS: ${description}`);
    passed += 1;
  } else {
    console.error(`✗ GAGAL: ${description}`);
    failed += 1;
  }
}

console.log('\n=== Media utils (P0-02) ===');
assert('getMediaDisplay(null) tidak melempar error', getMediaDisplay(null) === '');
assert('getMediaDisplay(undefined) aman', getMediaDisplay(undefined) === '');
assert('getMediaDisplay({ alt }) memakai alt', getMediaDisplay({ alt: 'Bayi tidur' }) === 'Bayi tidur');
assert('getMediaDisplay({ filename }) memakai filename', getMediaDisplay({ filename: 'foto.webp' }) === 'foto.webp');
assert('getMediaDisplay({ id }) memakai fallback id', getMediaDisplay({ id: 7 }) === 'Media #7');
assert('getMediaDisplay("12") menjadi ID Media', getMediaDisplay('12') === 'ID Media: 12');
assert('getMediaThumbUrl(null) mengembalikan null', getMediaThumbUrl(null) === null);
assert('getMediaThumbUrl({ url }) mengembalikan url', getMediaThumbUrl({ url: '/media/a.webp' }) === '/media/a.webp');
assert('hasMediaValue(null) false', hasMediaValue(null) === false);
assert('hasMediaValue(0) true (ID media 0 tetap nilai)', hasMediaValue(0) === true);

console.log('\n=== SEO display (P0-03) ===');
const emptyMetrics = {
  titleScore: 0,
  descScore: 0,
  keywordScore: 0,
  h1Score: 0,
  altScore: 0,
  slugScore: 0,
  ogScore: 0,
  contentScore: 0,
  wordCount: 0,
};

const validMetrics = { ...emptyMetrics, titleScore: 15, descScore: 10 };

assert('metrik kosong tidak dianggap valid', hasUsableSeoMetrics(emptyMetrics) === false);
assert('metrik dengan satu nilai > 0 dianggap valid', hasUsableSeoMetrics(validMetrics) === true);
assert('skor 0 tanpa metrik menjadi null', resolveSeoScore({ seoScore: 0, metrics: emptyMetrics }) === null);
assert('skor 0 dengan metrik valid tetap 0', resolveSeoScore({ seoScore: 0, metrics: validMetrics }) === 0);
assert('skor 80 dengan metrik kosong tetap 80', resolveSeoScore({ seoScore: 80, metrics: emptyMetrics }) === 80);
assert('skor dari auditScore diprioritaskan', resolveSeoScore({ seoScore: 50, auditScore: 82 }) === 82);
assert('tanpa skor menjadi null', resolveSeoScore({}) === null);

console.log('\n=== Regresi sumber (P0-02/P0-03) ===');
const backfillSource = readFileSync(new URL('./audit-backfill.ts', import.meta.url), 'utf8');
const mediaPickerSource = readFileSync(
  new URL('../components/admin/builder/MediaPickerModal.tsx', import.meta.url),
  'utf8',
);

assert(
  'backfill menyimpan metrics audit',
  backfillSource.includes('metrics: audit.metrics'),
);
assert(
  'backfill menyimpan engineVersion audit',
  backfillSource.includes("engineVersion: audit.engineVersion || '2.1.0'"),
);
assert(
  'media picker tidak memakai nama file sebagai alt',
  !mediaPickerSource.includes("formData.append('alt', file.name"),
);
assert(
  'media picker mengirim alt melalui _payload (Payload multipart)',
  mediaPickerSource.includes("formData.append('_payload'"),
);

console.log('\n=== Config field group (P0-01) ===');

function findField(fields: any[] | undefined, name: string): any | null {
  for (const field of fields || []) {
    if (field?.name === name) return field;
    if (Array.isArray(field?.fields)) {
      const nested = findField(field.fields, name);
      if (nested) return nested;
    }
    if (Array.isArray(field?.tabs)) {
      for (const tab of field.tabs) {
        const nested = findField(tab?.fields, name);
        if (nested) return nested;
      }
    }
  }
  return null;
}

const articleSeoGroup = findField(Articles.fields as any[], 'seo');
const analyticsGroup = findField(SiteSettings.fields as any[], 'analytics');

assert('config Artikel memiliki group seo', Boolean(articleSeoGroup));
assert(
  'group seo memiliki field anak',
  Array.isArray(articleSeoGroup?.fields) && articleSeoGroup.fields.length > 0,
);
assert(
  'group seo memiliki metaTitle',
  Boolean(findField(articleSeoGroup?.fields, 'metaTitle')),
);
assert('config SiteSettings memiliki group analytics', Boolean(analyticsGroup));
assert(
  'group analytics memiliki field anak',
  Array.isArray(analyticsGroup?.fields) && analyticsGroup.fields.length > 0,
);

console.log(`\nHasil: ${passed} lulus, ${failed} gagal\n`);
if (failed > 0) process.exit(1);
