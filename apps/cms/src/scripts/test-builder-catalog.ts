/**
 * Unit test ringan untuk logika katalog Page Builder.
 * Jalankan: npm run test:builder-catalog --workspace=cms-kala
 */
import assert from 'node:assert/strict';
import {
  CATEGORY_LABELS,
  POPULAR_BLOCK_SLUGS,
  filterCatalogBlocks,
  getCatalogBlocks,
  getPopularBlocks,
  normalizeCatalogText,
} from '../components/admin/builder/catalog-utils';

let passed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}`);
    throw error;
  }
}

const blocks = getCatalogBlocks();

test('katalog berisi komponen dan tidak ada yang hidden', () => {
  assert.ok(blocks.length > 20, `jumlah komponen terlalu sedikit: ${blocks.length}`);
  assert.ok(blocks.every((block) => !block.hidden));
});

test('pencarian kosong mengembalikan semua komponen', () => {
  assert.equal(filterCatalogBlocks(blocks, '').length, blocks.length);
  assert.equal(filterCatalogBlocks(blocks, '   ').length, blocks.length);
});

test('pencarian "kolom" menemukan Baris Berkolom', () => {
  const result = filterCatalogBlocks(blocks, 'kolom');
  assert.ok(result.some((block) => block.slug === 'section'));
});

test('pencarian "gambar" menemukan komponen gambar', () => {
  const result = filterCatalogBlocks(blocks, 'gambar');
  assert.ok(result.some((block) => block.slug === 'image'));
});

test('pencarian tidak peka huruf besar/kecil dan diakritik', () => {
  assert.ok(filterCatalogBlocks(blocks, 'KOLOM').some((block) => block.slug === 'section'));
  assert.equal(normalizeCatalogText('  Baris   Berkolom  '), 'baris berkolom');
});

test('pencarian multi-kata memakai logika AND', () => {
  const result = filterCatalogBlocks(blocks, 'baris kolom');
  assert.ok(result.some((block) => block.slug === 'section'));
});

test('pencarian cocok dengan deskripsi dan kata kunci', () => {
  assert.ok(filterCatalogBlocks(blocks, 'berdampingan').some((block) => block.slug === 'section'));
  assert.ok(filterCatalogBlocks(blocks, 'grid').some((block) => block.slug === 'section'));
});

test('pencarian cocok dengan label kategori', () => {
  assert.ok(CATEGORY_LABELS.layout.toLowerCase().includes('tata letak'));
  assert.ok(filterCatalogBlocks(blocks, 'tata letak').some((block) => block.slug === 'section'));
});

test('pencarian tanpa hasil mengembalikan array kosong', () => {
  assert.equal(filterCatalogBlocks(blocks, 'zzz-tidak-ada').length, 0);
});

test('bagian "Sering dipakai" berisi komponen populer dan valid', () => {
  const popular = getPopularBlocks(blocks);
  assert.equal(popular.length, POPULAR_BLOCK_SLUGS.length);
  assert.equal(popular[0].slug, 'section');
  assert.ok(popular.some((block) => block.slug === 'image'));
  assert.ok(popular.some((block) => block.slug === 'button'));
});

test('batas jumlah komponen populer dihormati', () => {
  assert.equal(getPopularBlocks(blocks, 3).length, 3);
});

console.log(`\n✅ Semua ${passed} test katalog builder lulus.`);
