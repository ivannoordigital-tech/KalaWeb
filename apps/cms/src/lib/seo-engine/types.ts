export interface NormalizedSeoInput {
  title: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  slug: string
  hasOgImage: boolean
  h1Count: number
  totalImages: number
  imagesWithoutAltCount: number
  wordCount?: number
  isNoIndex?: boolean
}

export interface SeoIssue {
  code: string
  severity: 'critical' | 'warning'
  message: string
  targetField: string
}

export interface SeoAuditResult {
  score: number // 0 - 100
  grade: 'good' | 'fair' | 'poor'
  isUnrated?: boolean
  issues: SeoIssue[]
  metrics: {
    titleScore: number
    descScore: number
    keywordScore: number
    h1Score: number
    altScore: number
    slugScore: number
    ogScore: number
  }
}
