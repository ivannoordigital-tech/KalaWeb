import type { NormalizedSeoInput, SeoAuditResult, SeoIssue } from './types'

export function calculateSeoScore(input: NormalizedSeoInput): SeoAuditResult {
  const issues: SeoIssue[] = []
  const effectiveTitle = (input.metaTitle || input.title || '').trim()
  const effectiveDesc = (input.metaDescription || '').trim()
  const keyword = (input.focusKeyword || '').trim().toLowerCase()
  const slug = (input.slug || '').trim().toLowerCase()

  // 1. Meta Title (Bobot: 20 Poin)
  let titleScore = 0
  const titleLen = effectiveTitle.length
  if (titleLen === 0) {
    issues.push({
      code: 'TITLE_EMPTY',
      severity: 'critical',
      message: 'Judul SEO (Meta Title) belum diisi.',
      targetField: 'metaTitle',
    })
  } else if (titleLen >= 30 && titleLen <= 60) {
    titleScore = 20
  } else if ((titleLen >= 20 && titleLen < 30) || (titleLen > 60 && titleLen <= 70)) {
    titleScore = 10
    if (titleLen > 60) {
      issues.push({
        code: 'TITLE_TOO_LONG',
        severity: 'warning',
        message: `Judul SEO (${titleLen} karakter) idealnya maksimal 60 karakter agar tidak terpotong di Google.`,
        targetField: 'metaTitle',
      })
    } else {
      issues.push({
        code: 'TITLE_TOO_SHORT',
        severity: 'warning',
        message: `Judul SEO (${titleLen} karakter) sedikit pendek. Idealnya 30–60 karakter.`,
        targetField: 'metaTitle',
      })
    }
  } else {
    titleScore = 0
    issues.push({
      code: 'TITLE_SUBOPTIMAL',
      severity: 'critical',
      message: titleLen > 70 
        ? `Judul SEO (${titleLen} karakter) terlalu panjang. Google akan memotong judul ini.` 
        : `Judul SEO (${titleLen} karakter) terlalu pendek (minimal 20 karakter).`,
      targetField: 'metaTitle',
    })
  }

  // 2. Meta Description (Bobot: 20 Poin)
  let descScore = 0
  const descLen = effectiveDesc.length
  if (descLen === 0) {
    issues.push({
      code: 'DESC_EMPTY',
      severity: 'critical',
      message: 'Meta description belum diisi. Google akan memilih potongan teks sendiri.',
      targetField: 'metaDescription',
    })
  } else if (descLen >= 120 && descLen <= 155) {
    descScore = 20
  } else if ((descLen >= 80 && descLen < 120) || (descLen > 155 && descLen <= 165)) {
    descScore = 10
    if (descLen > 155) {
      issues.push({
        code: 'DESC_TOO_LONG',
        severity: 'warning',
        message: `Deskripsi (${descLen} karakter) melebihi panjang ideal 155 karakter.`,
        targetField: 'metaDescription',
      })
    } else {
      issues.push({
        code: 'DESC_A_BIT_SHORT',
        severity: 'warning',
        message: `Deskripsi (${descLen} karakter) agak singkat. Idealnya 120–155 karakter.`,
        targetField: 'metaDescription',
      })
    }
  } else {
    descScore = 0
    issues.push({
      code: 'DESC_SUBOPTIMAL',
      severity: 'critical',
      message: descLen > 165 
        ? `Deskripsi (${descLen} karakter) terlalu panjang dan berisiko dipotong Google.` 
        : `Deskripsi (${descLen} karakter) terlalu pendek (minimal 80 karakter).`,
      targetField: 'metaDescription',
    })
  }

  // 3. Kata Kunci Fokus di Judul (Bobot: 15 Poin)
  let keywordScore = 0
  if (!keyword) {
    issues.push({
      code: 'KEYWORD_EMPTY',
      severity: 'warning',
      message: 'Kata kunci fokus belum ditentukan.',
      targetField: 'focusKeyword',
    })
  } else {
    const titleLower = effectiveTitle.toLowerCase()
    if (titleLower.includes(keyword)) {
      keywordScore = 15
    } else {
      const words = keyword.split(/\s+/).filter(Boolean)
      const matches = words.filter((w) => titleLower.includes(w))
      if (matches.length > 0 && matches.length >= words.length / 2) {
        keywordScore = 8
        issues.push({
          code: 'KEYWORD_PARTIAL',
          severity: 'warning',
          message: 'Hanya sebagian kata kunci fokus yang ditemukan di dalam Judul SEO.',
          targetField: 'focusKeyword',
        })
      } else {
        keywordScore = 0
        issues.push({
          code: 'KEYWORD_NOT_FOUND',
          severity: 'warning',
          message: `Kata kunci fokus "${keyword}" tidak ditemukan di dalam Judul SEO.`,
          targetField: 'focusKeyword',
        })
      }
    }
  }

  // 4. Struktur H1 Tunggal (Bobot: 15 Poin)
  let h1Score = 0
  if (input.h1Count === 1) {
    h1Score = 15
  } else if (input.h1Count === 0) {
    h1Score = 0
    issues.push({
      code: 'H1_MISSING',
      severity: 'critical',
      message: 'Halaman belum memiliki judul utama H1.',
      targetField: 'title',
    })
  } else {
    h1Score = 0
    issues.push({
      code: 'H1_MULTIPLE',
      severity: 'critical',
      message: `Terdeteksi ${input.h1Count} judul H1. Setiap halaman hanya boleh memiliki tepat 1 H1.`,
      targetField: 'title',
    })
  }

  // 5. Kelengkapan Teks Alt Gambar (Bobot: 15 Poin)
  let altScore = 0
  if (input.totalImages === 0) {
    altScore = 15 // Halaman tanpa gambar dianggap tidak ada pelanggaran alt
  } else if (input.imagesWithoutAltCount === 0) {
    altScore = 15
  } else {
    const validRatio = (input.totalImages - input.imagesWithoutAltCount) / input.totalImages
    if (validRatio >= 0.7) {
      altScore = 8
      issues.push({
        code: 'SOME_ALT_MISSING',
        severity: 'warning',
        message: `${input.imagesWithoutAltCount} dari ${input.totalImages} gambar belum memiliki teks alt.`,
        targetField: 'media',
      })
    } else {
      altScore = 0
      issues.push({
        code: 'ALT_MISSING',
        severity: 'critical',
        message: `Gambar utama tidak punya teks alt (${input.imagesWithoutAltCount} gambar tanpa teks alt).`,
        targetField: 'media',
      })
    }
  }

  // 6. Kerapian Slug URL (Bobot: 10 Poin)
  let slugScore = 0
  if (!slug) {
    issues.push({
      code: 'SLUG_EMPTY',
      severity: 'critical',
      message: 'Slug URL belum diisi.',
      targetField: 'slug',
    })
  } else if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    if (slug.length <= 50) {
      slugScore = 10
    } else if (slug.length <= 70) {
      slugScore = 6
      issues.push({
        code: 'SLUG_A_BIT_LONG',
        severity: 'warning',
        message: `Slug URL (${slug.length} karakter) agak panjang. Lebih baik < 50 karakter.`,
        targetField: 'slug',
      })
    } else {
      slugScore = 2
      issues.push({
        code: 'SLUG_TOO_LONG',
        severity: 'warning',
        message: `Slug URL (${slug.length} karakter) terlalu panjang.`,
        targetField: 'slug',
      })
    }
  } else {
    slugScore = 0
    issues.push({
      code: 'SLUG_INVALID',
      severity: 'critical',
      message: 'Format slug tidak valid. Hanya boleh huruf kecil, angka, dan tanda hubung (-).',
      targetField: 'slug',
    })
  }

  // 7. Gambar Media Sosial / Open Graph (Bobot: 5 Poin)
  let ogScore = 0
  if (input.hasOgImage) {
    ogScore = 5
  } else {
    ogScore = 0
    issues.push({
      code: 'OG_IMAGE_MISSING',
      severity: 'warning',
      message: 'Gambar Open Graph untuk media sosial belum diatur (memakai default situs).',
      targetField: 'ogImage',
    })
  }

  const totalScore = Math.min(100, Math.max(0, 
    titleScore + descScore + keywordScore + h1Score + altScore + slugScore + ogScore
  ))

  const grade: 'good' | 'fair' | 'poor' = 
    totalScore >= 80 ? 'good' : totalScore >= 60 ? 'fair' : 'poor'

  return {
    score: totalScore,
    grade,
    issues,
    metrics: {
      titleScore,
      descScore,
      keywordScore,
      h1Score,
      altScore,
      slugScore,
      ogScore,
    },
  }
}
