import type { NormalizedSeoInput } from '../types'

export function landingPageSeoAdapter(doc: any): NormalizedSeoInput {
  const seo = doc.seo || {}
  const title = String(doc.title || '').trim()
  const metaTitle = String(seo.metaTitle || title).trim()
  const metaDescription = String(seo.metaDescription || doc.description || doc.subheadline || '').trim()
  const focusKeyword = String(seo.focusKeyword || '').trim()
  const slug = String(doc.slug || '').trim()
  const hasOgImage = Boolean(seo.ogImage || doc.heroImage)

  const layout = (Array.isArray(doc.layout) ? doc.layout : []).filter((b: any) => !b.disabled)

  // H1: Menghitung blok bertipe 'hero'
  const heroBlocks = layout.filter((b: any) => b.blockType === 'hero')
  let h1Count = heroBlocks.length

  // Fallback untuk LP format lama yang memiliki field headline langsung
  if (h1Count === 0 && doc.headline) {
    h1Count = 1
  }

  // Analisis Gambar di dalam blok (Hero, Gallery, Testimoni)
  let totalImages = 0
  let imagesWithoutAltCount = 0

  for (const block of layout) {
    // Blok Hero
    if (block.blockType === 'hero' && block.image) {
      totalImages++
      const hasAlt = Boolean(
        block.imageAlt ||
        (typeof block.image === 'object' && block.image?.alt)
      )
      if (!hasAlt) imagesWithoutAltCount++
    }

    // Blok Galeri
    if (block.blockType === 'gallery' && Array.isArray(block.items)) {
      for (const item of block.items) {
        if (item.image) {
          totalImages++
          const hasAlt = Boolean(
            item.alt ||
            (typeof item.image === 'object' && item.image?.alt)
          )
          if (!hasAlt) imagesWithoutAltCount++
        }
      }
    }

    // Blok Testimoni
    if (block.blockType === 'testimonials' && Array.isArray(block.items)) {
      for (const item of block.items) {
        if (item.avatar) {
          totalImages++
          const hasAlt = Boolean(
            item.avatarAlt ||
            (typeof item.avatar === 'object' && item.avatar?.alt)
          )
          if (!hasAlt) imagesWithoutAltCount++
        }
      }
    }
  }

  return {
    title,
    metaTitle,
    metaDescription,
    focusKeyword,
    slug,
    hasOgImage,
    h1Count,
    totalImages,
    imagesWithoutAltCount,
    isNoIndex: Boolean(seo.noIndex),
  }
}
