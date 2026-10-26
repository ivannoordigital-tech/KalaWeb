/**
 * Konstanta Terpusat Ambang Batas SEO KalaWeb
 * Digunakan secara konsisten oleh SeoPanelField (Client) dan calculateSeoScore (Server Hooks).
 */
export const SEO_THRESHOLDS = {
  // Ambang Batas Judul (Meta Title)
  TITLE_MIN_OPTIMAL: 30,
  TITLE_MAX_OPTIMAL: 60,
  TITLE_MIN_ACCEPTABLE: 20,
  TITLE_MAX_ACCEPTABLE: 70,

  // Ambang Batas Deskripsi (Meta Description)
  DESC_MIN_OPTIMAL: 70,
  DESC_MAX_OPTIMAL: 160,
  DESC_MIN_ACCEPTABLE: 50,
  DESC_MAX_ACCEPTABLE: 175,

  // Jumlah Kata Konten Minimum
  ARTICLE_MIN_WORDS: 300,
  ARTICLE_OPTIMAL_WORDS: 600,
} as const
