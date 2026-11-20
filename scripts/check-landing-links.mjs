/**
 * Link & CTA checker untuk landing page.
 *
 * Pemakaian:
 *   node scripts/check-landing-links.mjs [url]
 *   npm run check:landing-links
 */
import http from 'node:http'
import https from 'node:https'

const BASE = process.argv[2] || 'https://kalababyspa.com/sales/promo-treatment/'
const BASE_HOST = new URL(BASE).hostname
const INTERNAL_HOSTS = new Set(['kalababyspa.com', 'www.kalababyspa.com', BASE_HOST])
const CTA_HOSTS = new Set(['app.kalababyspa.online'])
const SKIP_HOSTS = new Set(['wa.me', 'api.whatsapp.com', 'instagram.com', 'www.instagram.com', 'facebook.com', 'www.facebook.com'])

function request(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https:') ? https : http
    const req = lib.request(
      url,
      { method, headers: { 'User-Agent': 'KalaLinkCheck/1.0', Accept: 'text/html,application/json;q=0.9,*/*;q=0.8' } },
      (res) => {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          if (body.length < 300000) body += chunk
        })
        res.on('end', () => resolve({ status: res.statusCode || 0, headers: res.headers, body }))
      }
    )
    req.on('error', reject)
    req.setTimeout(15000, () => req.destroy(new Error('timeout')))
    req.end()
  })
}

const page = await request(BASE)
if (page.status !== 200) {
  console.error(`Gagal mengambil halaman: HTTP ${page.status} ${BASE}`)
  process.exit(1)
}

const html = page.body
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]))
const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1])
const uniqueHrefs = [...new Set(hrefs)]

const failures = []
const checked = []

for (const href of uniqueHrefs) {
  if (!href || href === '#') continue
  if (/^(mailto:|tel:|javascript:)/i.test(href)) continue

  if (href.startsWith('#')) {
    const id = href.slice(1)
    checked.push({ href, status: ids.has(id) ? 'anchor-ok' : 'anchor-missing' })
    if (!ids.has(id)) failures.push(`Anchor ${href} tidak ditemukan di halaman`)
    continue
  }

  let url
  try {
    url = new URL(href, BASE)
  } catch {
    failures.push(`URL tidak valid: ${href}`)
    continue
  }

  if (SKIP_HOSTS.has(url.hostname)) {
    checked.push({ href, status: 'skipped' })
    continue
  }

  if (!INTERNAL_HOSTS.has(url.hostname) && !CTA_HOSTS.has(url.hostname)) {
    checked.push({ href, status: 'external-skipped' })
    continue
  }

  try {
    const response = await request(url.toString())
    const ok = response.status >= 200 && response.status < 400
    checked.push({ href, status: response.status })
    if (!ok) failures.push(`${href} -> HTTP ${response.status}`)
  } catch (error) {
    checked.push({ href, status: 'error' })
    failures.push(`${href} -> ${error.message}`)
  }
}

// Cek CTA tracking.
const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map((match) => match[0])
const ctaAnchors = anchors.filter((tag) => /class="[^"]*\bkala-wa-btn\b/.test(tag))
const ctaWithoutRef = ctaAnchors.filter((tag) => !/data-ref-code="[^"]+"/.test(tag))
if (ctaWithoutRef.length > 0) {
  failures.push(`${ctaWithoutRef.length} CTA kala-wa-btn tidak memiliki data-ref-code`)
}

const uniqueRefs = new Set(
  [...html.matchAll(/data-ref-code="([^"]+)"/g)].map((match) => match[1]).filter(Boolean)
)

console.log(`\nLink check: ${BASE}`)
console.log(`- Link unik: ${uniqueHrefs.length}`)
console.log(`- Anchor internal valid: ${checked.filter((item) => item.status === 'anchor-ok').length}`)
console.log(`- CTA tracked: ${ctaAnchors.length}, ref unik: ${uniqueRefs.size}`)
console.log(`- Gagal: ${failures.length}`)
failures.forEach((line) => console.error(`  x ${line}`))

const slowOrSkipped = checked.filter((item) => item.status === 'skipped' || item.status === 'external-skipped')
if (slowOrSkipped.length > 0) {
  console.log(`- Dilewati (WhatsApp/sosial): ${slowOrSkipped.length}`)
}

if (failures.length > 0) process.exit(1)
console.log('Semua link dan CTA valid.')
