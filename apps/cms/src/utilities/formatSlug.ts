/**
 * Helper pembuat slug ramah SEO dari judul teks
 * Contoh: "Cara Mengatasi Bayi Kolik" -> "cara-mengatasi-bayi-kolik"
 */
export function formatSlug(val: string): string {
  if (!val) return ''
  return val
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Hapus karakter non-alphanumeric selain spasi dan hyphen
    .replace(/[\s_-]+/g, '-')  // Ganti spasi/underscore dengan hyphen tunggal
    .replace(/^-+|-+$/g, '')   // Trim hyphen di awal dan akhir
    .substring(0, 60)
}
