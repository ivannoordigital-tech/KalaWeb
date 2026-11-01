export interface ParsedFieldPath {
  /** null = error level array `layout`, bukan baris tertentu */
  rowIndex: number | null;
  /** field di dalam blok, mis. 'title' atau 'images.2.alt' */
  fieldPath: string;
}

/**
 * Mengubah path form Payload menjadi info baris & field.
 * 'layout'                → { rowIndex: null, fieldPath: '' }
 * 'layout.3'              → { rowIndex: 3,    fieldPath: '' }
 * 'layout.3.title'        → { rowIndex: 3,    fieldPath: 'title' }
 * 'layout.3.images.0.alt' → { rowIndex: 3,    fieldPath: 'images.0.alt' }
 */
export function parseBuilderFieldPath(path: string): ParsedFieldPath | null {
  if (path !== 'layout' && !path.startsWith('layout.')) return null;
  if (path === 'layout') return { rowIndex: null, fieldPath: '' };

  const parts = path.split('.');
  const rowIndex = Number(parts[1]);

  if (!Number.isInteger(rowIndex) || rowIndex < 0) {
    return { rowIndex: null, fieldPath: parts.slice(1).join('.') };
  }

  return { rowIndex, fieldPath: parts.slice(2).join('.') };
}

export const BUILDER_FIELD_LABELS: Record<string, string> = {
  title: 'Judul',
  subtitle: 'Subjudul',
  badge: 'Badge',
  heading: 'Judul',
  description: 'Deskripsi',
  image: 'Gambar',
  imageAlt: 'Teks alternatif gambar',
  images: 'Galeri gambar',
  alt: 'Teks alternatif',
  caption: 'Keterangan',
  ctaLabel: 'Teks tombol',
  ctaHref: 'Tautan tombol',
  buttonText: 'Teks tombol',
  buttonLink: 'Tautan tombol',
  href: 'Tautan',
  url: 'URL',
  items: 'Daftar item',
  questions: 'Daftar pertanyaan',
  answer: 'Jawaban',
  name: 'Nama',
  price: 'Harga',
  slug: 'Slug',
  refCode: 'Kode referensi',
};

export function humanizeBuilderField(fieldPath: string): string {
  if (!fieldPath) return 'Susunan seksi';

  const segments = fieldPath.split('.').filter((s) => !/^\d+$/.test(s));
  const last = segments[segments.length - 1] || fieldPath;

  return BUILDER_FIELD_LABELS[last] ?? last.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}
