/**
 * Patch konten landing page ads (Page 11) untuk Fase 1:
 * 1. Guard CSS: floating WhatsApp disembunyikan di mobile (agar tidak menumpuk
 *    dengan MobileStickyBar) + offset anchor.
 * 2. Semua CTA ke app.kalababyspa.online/cta diberi kelas `kala-wa-btn` supaya
 *    ditangkap tracker.js (dataLayer, Meta, TikTok, Clarity).
 * 3. Setiap CTA diberi `data-ref-code` + parameter `ref` per section.
 *
 * Pemakaian (dari apps/cms):
 *   npm run patch:landing-cta            # dry-run, hanya menampilkan ringkasan
 *   APPLY=true npm run patch:landing-cta # simpan sebagai draft
 *   PUBLISH=true npm run patch:landing-cta # simpan + publish (memicu deploy)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { validatePageBuilderDoc } from '../utilities/pageBuilderValidators'

const PAGE_ID = 11
const COLLECTION = process.env.COLLECTION || 'pages'
const DOC_ID = Number(process.env.DOC_ID || PAGE_ID)
const IS_PAGE = COLLECTION === 'pages'
const CMS_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://admin.kalababyspa.com').replace(/\/$/, '')
const API_KEY = process.env.CMS_BOT_API_KEY || ''
const APPLY = process.env.APPLY === 'true'
const PUBLISH = process.env.PUBLISH === 'true'

const REF_BY_BLOCK: Record<number, string> = {
  4: 'KALA-LP-ADS-PROMO',
  5: 'KALA-LP-ADS-SERVICES',
  9: 'KALA-LP-ADS-FINAL',
  10: 'KALA-LP-ADS-FLOATING',
}

const CSS_MARKER = '/* [patch-2026-11-20] CTA mobile guard */'
const CSS_PATCH = `
${CSS_MARKER}
@media (max-width:767px){.float-wa{display:none!important}}
#booking,#layanan{scroll-margin-top:96px}
`

function applyCssPatch(html: string) {
  // Hapus patch lama (termasuk yang sebelumnya salah tempel di luar </style>).
  let base = html.split(CSS_PATCH).join('')
  base = base.split(CSS_PATCH.trim()).join('')

  const closeIndex = base.lastIndexOf('</style>')
  const next = closeIndex >= 0
    ? `${base.slice(0, closeIndex)}${CSS_PATCH}${base.slice(closeIndex)}`
    : `${base}<style>${CSS_PATCH}</style>`

  return { html: next, changed: next !== html }
}

const CTA_PATTERN = /<a\b[^>]*href="https:\/\/app\.kalababyspa\.online\/cta\?divisi=iklan-utama"[^>]*>/g

function decorateAnchors(html: string, refCode: string) {
  let count = 0
  const next = html.replace(CTA_PATTERN, (tag) => {
    count += 1
    let out = tag

    out = out.replace(/href="([^"]+)"/, (_match, href: string) => {
      if (href.includes('ref=')) return `href="${href}"`
      const separator = href.includes('?') ? '&' : '?'
      return `href="${href}${separator}ref=${refCode}"`
    })

    if (/\bclass="/.test(out)) {
      out = out.replace(/\bclass="([^"]*)"/, (_match, classes: string) => {
        if (classes.split(/\s+/).includes('kala-wa-btn')) return `class="${classes}"`
        return `class="${classes} kala-wa-btn"`
      })
    } else {
      out = out.replace(/^<a\b/, '<a class="kala-wa-btn"')
    }

    if (!/\bdata-ref-code=/.test(out)) {
      out = out.replace(/^<a\b/, `<a data-ref-code="${refCode}"`)
    }

    return out
  })

  return { html: next, count }
}

async function api(pathname: string, init: RequestInit = {}) {
  const response = await fetch(`${CMS_URL}${pathname}`, {
    ...init,
    headers: {
      Authorization: `users API-Key ${API_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
  const text = await response.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = text
  }
  if (!response.ok) {
    throw new Error(`${init.method || 'GET'} ${pathname} -> ${response.status}: ${String(text).slice(0, 600)}`)
  }
  return json
}

async function main() {
  if (!API_KEY) throw new Error('CMS_BOT_API_KEY belum diset.')

  const page = await api(`/api/${COLLECTION}/${DOC_ID}?depth=0${IS_PAGE ? '&draft=true' : ''}`)
  if (!page?.layout?.length) throw new Error(`Layout ${COLLECTION}/${DOC_ID} kosong / tidak ditemukan.`)

  const layout = structuredClone(page.layout)
  const report: string[] = []
  let totalAnchors = 0

  if (process.env.CSS_FILE && layout[0]?.blockType === 'html') {
    layout[0].html = readFileSync(process.env.CSS_FILE, 'utf8')
    report.push(`CSS block: diganti dari ${process.env.CSS_FILE}`)
  } else if (layout[0]?.blockType === 'html') {
    const cssResult = applyCssPatch(String(layout[0].html))
    if (cssResult.changed) {
      layout[0].html = cssResult.html
      report.push('CSS block: guard mobile + scroll-margin ditambahkan di dalam <style>')
    } else {
      report.push('CSS block: guard sudah benar, dilewati')
    }
  }

  for (const [indexRaw, refCode] of Object.entries(REF_BY_BLOCK)) {
    const index = Number(indexRaw)
    const block = layout[index]
    if (!block || block.blockType !== 'html') continue
    const { html, count } = decorateAnchors(String(block.html), refCode)
    if (count > 0) {
      block.html = html
      totalAnchors += count
      report.push(`Blok #${index + 1} (${refCode}): ${count} CTA diperbarui`)
      if (process.env.VERBOSE === 'true') {
        console.log(`  contoh: ${String(html).match(/<a\b[^>]*>/)?.[0] || '-'}`)
      }
    }
  }

  console.log(`\nRingkasan patch ${COLLECTION}/${DOC_ID}:`)
  report.forEach((line) => console.log(`- ${line}`))
  console.log(`- Total CTA diperbarui: ${totalAnchors}`)

  if (IS_PAGE) {
    const candidate = { ...page, layout, _status: 'published' }
    const validation = validatePageBuilderDoc(candidate, true)
    console.log(`- Validasi publish: ${validation.isValid ? 'LULUS' : 'GAGAL'}`)
    if (!validation.isValid) {
      console.error(JSON.stringify(validation.fieldErrors, null, 2))
      process.exit(1)
    }
    if (validation.warnings.length > 0) {
      validation.warnings.forEach((warning) => console.warn(`  ! ${warning}`))
    }
  } else {
    console.log('- Validasi publish: dilewati (dokumen template)')
  }

  if (!APPLY) {
    console.log('\nDry-run selesai. Jalankan dengan APPLY=true untuk menyimpan draft.')
    return
  }

  const snapshotDir = path.resolve(process.cwd(), '..', '..', 'backups', 'render')
  mkdirSync(snapshotDir, { recursive: true })
  const snapshotPath = path.join(snapshotDir, `${COLLECTION}-${DOC_ID}-after-cta-patch-${Date.now()}.json`)
  writeFileSync(snapshotPath, JSON.stringify({ layout }, null, 2), 'utf8')
  console.log(`\nSnapshot hasil transformasi: ${snapshotPath}`)

  if (!IS_PAGE) {
    await api(`/api/${COLLECTION}/${DOC_ID}`, {
      method: 'PATCH',
      body: JSON.stringify({ layout }),
    })
    console.log(`Template ${COLLECTION}/${DOC_ID} berhasil diperbarui.`)
    return
  }

  if (PUBLISH) {
    await api(`/api/${COLLECTION}/${DOC_ID}`, {
      method: 'PATCH',
      body: JSON.stringify({ layout, _status: 'published' }),
    })
    console.log(`Page ${DOC_ID} berhasil di-PUBLISH. Cloudflare build akan terpicu otomatis.`)
  } else {
    await api(`/api/${COLLECTION}/${DOC_ID}?draft=true`, {
      method: 'PATCH',
      body: JSON.stringify({ layout }),
    })
    console.log(`Draft Page ${DOC_ID} berhasil diperbarui (belum publish).`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
