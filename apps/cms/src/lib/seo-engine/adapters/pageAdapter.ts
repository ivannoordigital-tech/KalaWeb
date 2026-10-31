import type { NormalizedSeoInput } from '../types'

export function pageSeoAdapter(doc: any): NormalizedSeoInput {
  const seo = doc.seo || {}
  const title = String(doc.title || '').trim()
  const metaTitle = String(seo.metaTitle || title).trim()
  const metaDescription = String(seo.metaDescription || doc.description || '').trim()
  const focusKeyword = String(seo.focusKeyword || '').trim()
  const slug = String(doc.slug || '').trim()
  const hasOgImage = Boolean(seo.ogImage || doc.heroImage)

  const layout = (Array.isArray(doc.layout) ? doc.layout : []).filter((b: any) => !b.disabled)
  const heroBlocks = layout.filter((b: any) => b.blockType === 'hero')

  // H1: jika ada hero block di layout pakai hero, jika tidak pakai title halaman
  const h1Count = heroBlocks.length > 0 ? heroBlocks.length : (title ? 1 : 0)

  let totalImages = 0
  let imagesWithoutAltCount = 0

  if (doc.heroImage) {
    totalImages++
    const hasAlt = Boolean(
      doc.heroImageAlt ||
      (typeof doc.heroImage === 'object' && doc.heroImage?.alt)
    )
    if (!hasAlt) imagesWithoutAltCount++
  }

  for (const block of layout) {
    if (block.blockType === 'hero' && block.image) {
      totalImages++
      const hasAlt = Boolean(
        block.imageAlt ||
        (typeof block.image === 'object' && block.image?.alt)
      )
      if (!hasAlt) imagesWithoutAltCount++
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
