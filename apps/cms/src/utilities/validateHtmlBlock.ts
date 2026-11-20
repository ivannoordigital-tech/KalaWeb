import { APIError } from 'payload'

/**
 * Validasi blok HTML saat disimpan.
 *
 * Pendekatan: tolak konten berbahaya, jangan menulis ulang HTML yang aman.
 * Dengan begitu komentar/format asli admin tidak hilang, sementara database
 * tetap tidak menyimpan <script>/<iframe>/event handler mentah.
 *
 * Sanitasi saat render tetap berjalan di HtmlBlock.astro sebagai lapisan kedua.
 */

const ALLOWED_CSS_URL_HOSTS = new Set([
  'kalababyspa.com',
  'www.kalababyspa.com',
  'admin.kalababyspa.com',
  'cdn.scalev.id',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
])

const UNSAFE_MARKERS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /<script\b/i, label: '<script>' },
  { pattern: /<iframe\b/i, label: '<iframe>' },
  { pattern: /<object\b/i, label: '<object>' },
  { pattern: /<embed\b/i, label: '<embed>' },
  { pattern: /<form\b/i, label: '<form>' },
  { pattern: /\son[a-z]+\s*=/i, label: 'event handler (onclick dll)' },
  { pattern: /javascript\s*:/i, label: 'URL javascript:' },
]

function assertSafeCss(html: string) {
  // Pindai seluruh HTML, bukan hanya <style>, agar url() di atribut style
  // (mis. <div style="background:url(...)">) juga tertangkap.
  const css = html

  if (/@import\b/i.test(css)) {
    throw new APIError('CSS pada blok HTML memakai @import. Muat font/gaya lewat <link> atau inline CSS.', 400)
  }

  const urls = [...css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi)].map((match) => match[2].trim())
  for (const rawUrl of urls) {
    if (!rawUrl) continue
    if (rawUrl.startsWith('data:') || rawUrl.startsWith('#') || rawUrl.startsWith('/') || rawUrl.startsWith('.')) {
      continue
    }
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('//')) {
      let host = ''
      try {
        host = new URL(rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl).hostname.toLowerCase()
      } catch {
        throw new APIError(`CSS memuat URL yang tidak valid: ${rawUrl.slice(0, 120)}`, 400)
      }
      if (!ALLOWED_CSS_URL_HOSTS.has(host)) {
        throw new APIError(
          `CSS memuat url() dari host yang tidak diizinkan: ${host}. Gunakan cdn.scalev.id, kalababyspa.com, atau data: URI.`,
          400,
        )
      }
    }
  }
}

export function validateHtmlBlock(html: string): void {
  const found = UNSAFE_MARKERS.filter((item) => item.pattern.test(html)).map((item) => item.label)
  if (found.length > 0) {
    throw new APIError(
      `Blok HTML mengandung ${found.join(', ')}. Hapus kode tersebut, atau aktifkan mode "Jalankan JavaScript di dalam sandbox" bila memang diperlukan.`,
      400,
    )
  }

  assertSafeCss(html)
}

function walk(value: unknown) {
  if (Array.isArray(value)) {
    value.forEach(walk)
    return
  }
  if (!value || typeof value !== 'object') return

  const record = value as Record<string, any>
  if (record.blockType === 'html' && typeof record.html === 'string' && record.allowScripts !== true) {
    validateHtmlBlock(record.html)
  }

  for (const [key, child] of Object.entries(record)) {
    if (key === 'html') continue
    walk(child)
  }
}

/**
 * Memeriksa seluruh blok html non-sandbox di layout halaman/template.
 * Melempar APIError 400 jika ada konten berbahaya.
 */
export function validatePageLayoutHtml(data: any): void {
  if (!data || typeof data !== 'object') return
  walk(data.layout)
}
