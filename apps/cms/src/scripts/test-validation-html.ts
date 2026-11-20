/**
 * Unit test validasi publikasi untuk halaman berbasis blok HTML murni.
 *
 * Latar belakang: landing page ads modular (Page 11) seluruhnya tersusun dari
 * blok `html`. Validator sebelumnya hanya mengenali blok native `hero`/`cta`,
 * sehingga halaman seperti itu gagal di-publish walau sudah berisi H1 dan CTA.
 *
 * Jalankan: npm run test:validation-html --workspace=cms-kala
 */
import { validatePageBuilderDoc } from '../utilities/pageBuilderValidators'

let passed = 0
let failed = 0

function assert(description: string, condition: boolean, detail = '') {
  if (condition) {
    console.log(`LULUS: ${description}`)
    passed += 1
  } else {
    console.error(`GAGAL: ${description}${detail ? ` - ${detail}` : ''}`)
    failed += 1
  }
}

function makeDoc(overrides: Record<string, any> = {}) {
  return {
    title: 'Landing Test',
    slug: 'landing-test',
    pageType: 'landing',
    pageLayout: 'canvas',
    refCode: 'KALA-LP-TEST-A',
    _status: 'published',
    showWhatsAppCta: true,
    layout: [],
    ...overrides,
  }
}

function codesOf(result: { fieldErrors?: Array<{ code: string }> }) {
  return (result.fieldErrors || []).map((item) => item.code)
}

// 1. HTML murni dengan H1 + tautan wa.me -> valid
{
  const result = validatePageBuilderDoc(
    makeDoc({
      layout: [
        {
          blockType: 'html',
          html: '<section><h1>Promo Treatment Pertama</h1><a href="https://wa.me/628123">Chat</a></section>',
        },
      ],
    }),
    true
  )
  assert('HTML-only dengan H1 dan wa.me lolos publish', result.isValid, JSON.stringify(result.errors))
}

// 2. HTML murni dengan H1 + CTA aplikasi kalababyspa /cta -> valid
{
  const result = validatePageBuilderDoc(
    makeDoc({
      layout: [
        {
          blockType: 'html',
          html: '<h1>Promo</h1><a href="https://app.kalababyspa.online/cta?divisi=iklan-utama">Ambil</a>',
        },
      ],
    }),
    true
  )
  assert('HTML-only dengan H1 dan tautan /cta lolos publish', result.isValid, JSON.stringify(result.errors))
}

// 3. HTML murni tanpa H1 dan tanpa CTA -> dua error
{
  const result = validatePageBuilderDoc(
    makeDoc({ layout: [{ blockType: 'html', html: '<p>Hanya teks.</p>' }] }),
    true
  )
  const codes = codesOf(result)
  assert(
    'HTML-only tanpa H1 ditolak (MISSING_HERO_BLOCK)',
    codes.includes('MISSING_HERO_BLOCK'),
    JSON.stringify(codes)
  )
  assert(
    'HTML-only tanpa CTA ditolak (MISSING_WHATSAPP_CTA)',
    codes.includes('MISSING_WHATSAPP_CTA'),
    JSON.stringify(codes)
  )
}

// 4. HTML dengan H1 tetapi tanpa CTA -> hanya error CTA
{
  const result = validatePageBuilderDoc(
    makeDoc({ layout: [{ blockType: 'html', html: '<h1>Promo</h1><p>Tanpa tombol.</p>' }] }),
    true
  )
  const codes = codesOf(result)
  assert('H1 saja tidak memicu MISSING_HERO_BLOCK', !codes.includes('MISSING_HERO_BLOCK'), JSON.stringify(codes))
  assert('H1 tanpa CTA tetap ditolak', codes.includes('MISSING_WHATSAPP_CTA'), JSON.stringify(codes))
}

// 5. CTA saja tanpa H1 -> hanya error hero
{
  const result = validatePageBuilderDoc(
    makeDoc({
      layout: [{ blockType: 'html', html: '<a href="https://wa.me/628123">Chat</a>' }],
    }),
    true
  )
  const codes = codesOf(result)
  assert('CTA saja tidak memicu MISSING_WHATSAPP_CTA', !codes.includes('MISSING_WHATSAPP_CTA'), JSON.stringify(codes))
  assert('Tanpa H1 tetap ditolak di layout canvas', codes.includes('MISSING_HERO_BLOCK'), JSON.stringify(codes))
}

// 6. Halaman native (hero + cta) tetap valid seperti sebelumnya
{
  const result = validatePageBuilderDoc(
    makeDoc({
      layout: [
        { blockType: 'hero', title: 'Judul Hero', ctaText: 'Booking' },
        { blockType: 'cta', headline: 'Hubungi kami', buttonText: 'WhatsApp' },
      ],
    }),
    true
  )
  assert('Halaman native hero + cta tetap valid', result.isValid, JSON.stringify(result.errors))
}

// 7. Landing page tanpa CTA sama sekali tetap ditolak
{
  const result = validatePageBuilderDoc(
    makeDoc({
      pageType: 'landing',
      pageLayout: 'default',
      layout: [{ blockType: 'hero', title: 'Tanpa CTA' }],
    }),
    true
  )
  const codes = codesOf(result)
  assert('Landing page tanpa CTA tetap ditolak', codes.includes('MISSING_WHATSAPP_CTA'), JSON.stringify(codes))
}

console.log(`\nHasil: ${passed} lulus, ${failed} gagal`)
if (failed > 0) process.exit(1)
