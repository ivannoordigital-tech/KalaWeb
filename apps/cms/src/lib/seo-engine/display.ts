export interface SeoMetricsLike {
  titleScore?: number | null;
  descScore?: number | null;
  keywordScore?: number | null;
  h1Score?: number | null;
  altScore?: number | null;
  slugScore?: number | null;
  ogScore?: number | null;
  contentScore?: number | null;
  wordCount?: number | null;
}

export interface SeoScoreInput {
  cellData?: unknown;
  seoScore?: unknown;
  auditScore?: unknown;
  metrics?: SeoMetricsLike | null;
  lastAuditedAt?: string | null;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/**
 * Metrik dianggap valid jika minimal satu komponen sudah dihitung.
 * Dokumen lama sering memiliki skor tersimpan tetapi seluruh metrik 0
 * karena backfill belum dijalankan.
 */
export function hasUsableSeoMetrics(metrics?: SeoMetricsLike | null): boolean {
  if (!metrics) return false;

  const values = [
    metrics.titleScore,
    metrics.descScore,
    metrics.keywordScore,
    metrics.h1Score,
    metrics.altScore,
    metrics.slugScore,
    metrics.ogScore,
    metrics.contentScore,
    metrics.wordCount,
  ];

  return values.some((value) => {
    const numeric = toFiniteNumber(value);
    return numeric !== null && numeric > 0;
  });
}

/**
 * Memilih skor yang paling dapat dipercaya dari data yang tersedia.
 * Mengembalikan null jika dokumen belum pernah diaudit.
 */
export function resolveSeoScore(input: SeoScoreInput): number | null {
  const auditScore = toFiniteNumber(input.auditScore);
  const seoScore = toFiniteNumber(input.seoScore);
  const cellData = toFiniteNumber(input.cellData);

  const score = auditScore ?? seoScore ?? cellData ?? null;
  if (score === null) return null;

  const hasAuditTimestamp = typeof input.lastAuditedAt === 'string' && input.lastAuditedAt.length > 0;

  // 0 bisa berarti "belum pernah dihitung" karena defaultValue field lama.
  // Jika tidak ada metrik valid dan tidak ada timestamp audit, jangan tampilkan 0.
  if (score === 0 && !hasUsableSeoMetrics(input.metrics) && !hasAuditTimestamp) {
    return null;
  }

  return score;
}

export function getSeoGrade(score: number | null): 'good' | 'fair' | 'poor' | 'unscored' {
  if (score === null) return 'unscored';
  if (score >= 80) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
}
