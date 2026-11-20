/**
 * Kontrak layout untuk HtmlBlock.
 *
 * Mode `raw` (full-bleed) ditentukan oleh kombinasi yang sudah ada di CMS:
 *   maxWidth = 'full' DAN padding = 'none'
 *
 * Latar belakang TIDAK lagi menjadi syarat, sehingga marketing tetap bisa
 * memilih warna section tanpa membuat padding container muncul kembali.
 */
export type HtmlBlockLayoutInput = {
  maxWidth?: string | null
  padding?: string | null
  background?: string | null
}

export const HTML_BLOCK_BACKGROUND_HEX: Record<string, string> = {
  white: '#FFFFFF',
  cream: '#FFF9F4',
  peach: '#FFEFE5',
}

export function resolvesToRawLayout(block: HtmlBlockLayoutInput): boolean {
  return block.padding === 'none' && block.maxWidth === 'full'
}

export function rawBackgroundStyle(background?: string | null): string | undefined {
  if (!background || background === 'transparent') return undefined
  const hex = HTML_BLOCK_BACKGROUND_HEX[background]
  return hex ? `background:${hex}` : undefined
}
