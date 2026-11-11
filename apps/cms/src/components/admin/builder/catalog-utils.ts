import { builderRegistry, type BuilderBlockMeta } from '../../../blocks/registry';

export const CATEGORY_LABELS: Record<string, string> = {
  layout: 'Tata Letak & Struktur',
  hero: 'Banner Utama (Hero)',
  offer: 'Penawaran & Paket Harga',
  proof: 'Bukti Kredibilitas & Kepercayaan',
  content: 'Konten, Masalah & Edukasi',
  media: 'Gambar & Video',
  conversion: 'Formulir & Konversi',
  cta: 'Ajakan Aksi (Call to Action)',
  promo: 'Promosi & Media Sosial',
};

/**
 * Komponen yang paling sering dipakai admin baru. Ditampilkan di bagian
 * "Sering dipakai" supaya tidak perlu mencari di seluruh katalog.
 */
export const POPULAR_BLOCK_SLUGS = [
  'section',
  'hero',
  'heading',
  'image',
  'button',
  'richText',
];

export function normalizeCatalogText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getCatalogBlocks(
  registry: Record<string, BuilderBlockMeta> = builderRegistry,
): BuilderBlockMeta[] {
  return Object.values(registry).filter((block) => !block.hidden);
}

function getSearchHaystack(block: BuilderBlockMeta): string {
  const categoryLabel = CATEGORY_LABELS[block.category] || block.category;
  return normalizeCatalogText(
    [block.label, block.description, block.slug, categoryLabel, ...(block.keywords || [])].join(' '),
  );
}

/**
 * Filter katalog berdasarkan kata kunci. Semua kata yang diketik harus cocok
 * (AND), sehingga "gambar tunggal" tetap menemukan "Gambar Tunggal".
 */
export function filterCatalogBlocks(
  blocks: BuilderBlockMeta[],
  query: string,
): BuilderBlockMeta[] {
  const normalized = normalizeCatalogText(query);
  if (!normalized) return blocks;

  const tokens = normalized.split(' ').filter(Boolean);
  return blocks.filter((block) => {
    const haystack = getSearchHaystack(block);
    return tokens.every((token) => haystack.includes(token));
  });
}

export function getPopularBlocks(
  blocks: BuilderBlockMeta[],
  max = POPULAR_BLOCK_SLUGS.length,
): BuilderBlockMeta[] {
  const bySlug = new Map(blocks.map((block) => [block.slug, block]));
  return POPULAR_BLOCK_SLUGS.map((slug) => bySlug.get(slug))
    .filter((block): block is BuilderBlockMeta => Boolean(block))
    .slice(0, max);
}
