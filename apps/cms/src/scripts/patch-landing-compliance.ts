/**
 * Patch konten Fase 6: atribut gambar + disclaimer kepatuhan.
 *
 * Pemakaian (dari apps/cms):
 *   npm run patch:landing-compliance            # dry-run
 *   APPLY=true npm run patch:landing-compliance # simpan draft
 *   PUBLISH=true npm run patch:landing-compliance # simpan + publish
 *   COLLECTION=page-templates DOC_ID=1 APPLY=true ... # template
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { validatePageBuilderDoc } from '../utilities/pageBuilderValidators'

const COLLECTION = process.env.COLLECTION || 'pages'
const DOC_ID = Number(process.env.DOC_ID || 11)
const IS_PAGE = COLLECTION === 'pages'
const CMS_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://admin.kalababyspa.com').replace(/\/$/, '')
const API_KEY = process.env.CMS_BOT_API_KEY || ''
const APPLY = process.env.APPLY === 'true'
const PUBLISH = process.env.PUBLISH === 'true'

const IMAGE_META: Record<string, { width: number; height: number }> = {
  '1776313751969-Kala-(3).webp': { width: 640, height: 431 },
  '1776314021285-kala4.webp': { width: 640, height: 503 },
  '1776313762625-Kala-(1).webp': { width: 640, height: 443 },
  '1776315708285-treatment-(2).webp': { width: 640, height: 391 },
  '1776315719436-treatment-(1).webp': { width: 640, height: 417 },
  '1776316177526-treatement5.webp': { width: 640, height: 410 },
  '1776315701108-treatment-(3).webp': { width: 640, height: 438 },
  '1776315693856-treatment-(4).webp': { width: 640, height: 385 },
}

const PROMO_TERMS =
  '<br>S&amp;K: promo berlaku untuk reservasi pertama, tidak dapat digabung dengan promo lain, dan kuota harian terbatas.'

const TESTI_NOTE =
  '<p class="testi-note" style="margin:24px auto 0;max-width:60ch;text-align:center;font-size:.85rem;line-height:1.6;color:var(--ink-soft)">Testimoni dari orang tua klien Kala. Hasil dapat berbeda pada setiap anak.</p>'

const HEALTH_NOTE =
  '<p class="health-note" style="margin:20px auto 0;max-width:60ch;font-size:.82rem;line-height:1.65;color:var(--ink-soft)">Layanan Kala bersifat komplementer untuk relaksasi dan stimulasi tumbuh kembang, bukan pengganti pemeriksaan atau pengobatan dokter. Hentikan sesi dan konsultasikan ke dokter anak bila si kecil demam, lemas, atau menunjukkan tanda bahaya.</p>'

function addAttribute(tag: string, name: string, value: string) {
  if (new RegExp(`\\b${name}=`).test(tag)) return tag
  return tag.replace(/<img\b/, `<img ${name}="${value}"`)
}

function patchImages(html: string) {
  let changed = 0
  const next = html.replace(/<img\b[^>]*>/gi, (tag) => {
    let out = tag
    if (tag.includes('/images/logo-kala.webp')) {
      const before = out
      out = addAttribute(out, 'fetchpriority', 'high')
      out = addAttribute(out, 'decoding', 'async')
      if (out !== before) changed += 1
      return out
    }

    const match = Object.entries(IMAGE_META).find(([key]) => tag.includes(key))
    if (!match) return out
    const [, meta] = match
    const before = out
    out = addAttribute(out, 'width', String(meta.width))
    out = addAttribute(out, 'height', String(meta.height))
    out = addAttribute(out, 'decoding', 'async')
    if (out !== before) changed += 1
    return out
  })

  return { html: next, changed }
}

function insertBeforeLastSection(html: string, fragment: string) {
  const index = html.lastIndexOf('</section>')
  if (index === -1) return html
  return `${html.slice(0, index)}${fragment}\n${html.slice(index)}`
}

function patchPromoTerms(html: string) {
  if (html.includes('S&amp;K: promo berlaku')) return { html, changed: false }
  const next = html.replace(/(<small class="fine">)([\s\S]*?)(<\/small>)/, (_match, open, content, close) => {
    return `${open}${content}${PROMO_TERMS}${close}`
  })
  return { html: next, changed: next !== html }
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
  if (!response.ok) throw new Error(`${init.method || 'GET'} ${pathname} -> ${response.status}: ${text.slice(0, 600)}`)
  return text ? JSON.parse(text) : null
}

async function main() {
  if (!API_KEY) throw new Error('CMS_BOT_API_KEY belum diset.')

  const doc = await api(`/api/${COLLECTION}/${DOC_ID}?depth=0${IS_PAGE ? '&draft=true' : ''}`)
  if (!doc?.layout?.length) throw new Error(`Layout ${COLLECTION}/${DOC_ID} kosong.`)

  const layout = structuredClone(doc.layout)
  const report: string[] = []
  let changedBlocks = 0

  layout.forEach((block: any, index: number) => {
    if (block?.blockType !== 'html' || typeof block.html !== 'string') return
    let html = block.html
    const notes: string[] = []

    const images = patchImages(html)
    if (images.changed > 0) {
      html = images.html
      notes.push(`${images.changed} gambar diberi width/height/decoding`)
    }

    if (index === 4) {
      const promo = patchPromoTerms(html)
      if (promo.changed) {
        html = promo.html
        notes.push('S&K promo')
      }
    }

    if (index === 7 && !html.includes('testi-note')) {
      html = insertBeforeLastSection(html, TESTI_NOTE)
      notes.push('disclaimer testimoni')
    }

    if (index === 9 && !html.includes('health-note')) {
      html = insertBeforeLastSection(html, HEALTH_NOTE)
      notes.push('disclaimer kesehatan')
    }

    if (html !== block.html) {
      block.html = html
      changedBlocks += 1
      report.push(`Blok #${index + 1}: ${notes.join(', ')}`)
    }
  })

  console.log(`\nRingkasan patch ${COLLECTION}/${DOC_ID}:`)
  report.forEach((line) => console.log(`- ${line}`))
  console.log(`- Blok berubah: ${changedBlocks}`)

  if (IS_PAGE) {
    const candidate = { ...doc, layout, _status: 'published' }
    const validation = validatePageBuilderDoc(candidate, true)
    console.log(`- Validasi publish: ${validation.isValid ? 'LULUS' : 'GAGAL'}`)
    if (!validation.isValid) {
      console.error(JSON.stringify(validation.fieldErrors, null, 2))
      process.exit(1)
    }
  }

  if (!APPLY) {
    console.log('\nDry-run selesai. Jalankan APPLY=true untuk menyimpan.')
    return
  }

  const snapshotDir = path.resolve(process.cwd(), '..', '..', 'backups', 'render')
  mkdirSync(snapshotDir, { recursive: true })
  const snapshotPath = path.join(snapshotDir, `${COLLECTION}-${DOC_ID}-compliance-${Date.now()}.json`)
  writeFileSync(snapshotPath, JSON.stringify({ layout }, null, 2), 'utf8')
  console.log(`- Snapshot: ${snapshotPath}`)

  if (!IS_PAGE) {
    await api(`/api/${COLLECTION}/${DOC_ID}`, { method: 'PATCH', body: JSON.stringify({ layout }) })
    console.log('Template berhasil diperbarui.')
    return
  }

  if (PUBLISH) {
    await api(`/api/${COLLECTION}/${DOC_ID}`, { method: 'PATCH', body: JSON.stringify({ layout, _status: 'published' }) })
    console.log('Page berhasil di-PUBLISH.')
  } else {
    await api(`/api/${COLLECTION}/${DOC_ID}?draft=true`, { method: 'PATCH', body: JSON.stringify({ layout }) })
    console.log('Draft berhasil diperbarui.')
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
