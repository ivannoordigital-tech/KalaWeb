import type { NormalizedSeoInput } from '../types'

/**
 * Traverses Lexical JSON content to extract text word count and image alt text presence
 */
function inspectLexicalContent(content: any): { totalImages: number; imagesWithoutAlt: number; wordCount: number } {
  let totalImages = 0
  let imagesWithoutAlt = 0
  let textBuffer = ''

  function traverse(node: any) {
    if (!node) return

    if (node.type === 'text' && typeof node.text === 'string') {
      textBuffer += ' ' + node.text
    }

    if (node.type === 'upload') {
      totalImages++
      const hasAlt = Boolean(
        node.fields?.alt ||
        node.value?.alt ||
        (typeof node.alt === 'string' && node.alt.trim())
      )
      if (!hasAlt) {
        imagesWithoutAlt++
      }
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        traverse(child)
      }
    }
  }

  if (content?.root) {
    traverse(content.root)
  }

  const words = textBuffer.trim().split(/\s+/).filter(Boolean)

  return {
    totalImages,
    imagesWithoutAlt,
    wordCount: words.length,
  }
}

export function articleSeoAdapter(doc: any): NormalizedSeoInput {
  const seo = doc.seo || {}
  const title = String(doc.title || '').trim()
  const metaTitle = String(seo.metaTitle || title).trim()
  const metaDescription = String(seo.metaDescription || doc.description || '').trim()
  const focusKeyword = String(seo.focusKeyword || '').trim()
  const slug = String(doc.slug || '').trim()
  const hasOgImage = Boolean(seo.ogImage || doc.heroImage || doc.heroImageUrlFallback)

  // H1: Pada layout Astro artikel, title otomatis dirender sebagai H1 tunggal
  const h1Count = title ? 1 : 0

  // Analisis Gambar: Hero Image + Gambar di dalam Lexical
  let totalImages = 0
  let imagesWithoutAltCount = 0

  if (doc.heroImage || doc.heroImageUrlFallback) {
    totalImages++
    const hasHeroAlt = Boolean(
      doc.heroImageAlt ||
      (typeof doc.heroImage === 'object' && doc.heroImage?.alt)
    )
    if (!hasHeroAlt) {
      imagesWithoutAltCount++
    }
  }

  const contentInspection = inspectLexicalContent(doc.content)
  totalImages += contentInspection.totalImages
  imagesWithoutAltCount += contentInspection.imagesWithoutAlt

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
    wordCount: contentInspection.wordCount,
    isNoIndex: Boolean(seo.noIndex),
  }
}
