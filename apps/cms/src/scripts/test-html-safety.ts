/**
 * Test validasi keamanan blok HTML + dry-run terhadap layout Page 11.
 * Jalankan: npx tsx apps/cms/src/scripts/test-sanitize-html.ts <layout.json>
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { validateHtmlBlock, validatePageLayoutHtml } from '../utilities/validateHtmlBlock'

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

function expectThrow(description: string, html: string, expected: RegExp) {
  try {
    validateHtmlBlock(html)
    assert(description, false, 'tidak melempar error')
  } catch (error) {
    assert(description, expected.test((error as Error).message), (error as Error).message)
  }
}

// 1. HTML aman tidak diubah/ditolak.
{
  const html = '<!-- HERO --><style>html{scroll-behavior:smooth}.a>.b{color:red}</style><blockquote><cite>Bunda Risa</cite></blockquote>'
  let threw = false
  try {
    validateHtmlBlock(html)
  } catch {
    threw = true
  }
  assert('HTML aman lolos tanpa error', !threw)
}

// 2. Marker berbahaya ditolak.
expectThrow('script ditolak', '<div>x</div><script>alert(1)</script>', /<script>/i)
expectThrow('event handler ditolak', '<div onclick="x()">x</div>', /event handler/i)
expectThrow('javascript: ditolak', '<a href="javascript:alert(1)">x</a>', /javascript/i)
expectThrow('iframe ditolak', '<iframe src="https://x"></iframe>', /<iframe>/i)
expectThrow('form ditolak', '<form action="/x"></form>', /<form>/i)

// 3. CSS.
expectThrow(
  'url() host asing ditolak',
  '<style>.x{background:url(https://evil.example/track.gif)}</style>',
  /tidak diizinkan/i
)
expectThrow(
  'url() di atribut style ditolak',
  '<div style="background:url(https://evil.example/track.gif)">x</div>',
  /tidak diizinkan/i
)
expectThrow(
  '@import ditolak',
  '<style>@import url(https://fonts.googleapis.com/css2?family=Fredoka);</style>',
  /@import/i
)
{
  let threw = false
  try {
    validateHtmlBlock('<style>.x{background:url(https://cdn.scalev.id/x.webp)}</style>')
  } catch {
    threw = true
  }
  assert('url() cdn.scalev.id diizinkan', !threw)
}
{
  let threw = false
  try {
    validateHtmlBlock('<style>.x{background:url(/images/logo-kala.webp)}</style>')
  } catch {
    threw = true
  }
  assert('url() relatif diizinkan', !threw)
}

// 4. Layout: sandbox dikecualikan, nested diperiksa.
{
  const data = {
    layout: [
      { blockType: 'html', allowScripts: true, html: '<script>ok()</script>' },
      { blockType: 'html', html: '<div>aman</div>' },
    ],
  }
  let threw = false
  try {
    validatePageLayoutHtml(data)
  } catch {
    threw = true
  }
  assert('blok sandbox tidak divalidasi sebagai unsafe', !threw)
}
{
  const data = {
    layout: [{ blockType: 'section', columns: [{ blocks: [{ blockType: 'html', html: '<script>x</script>' }] }] }],
  }
  let threw = false
  try {
    validatePageLayoutHtml(data)
  } catch (error) {
    threw = /<script>/i.test((error as Error).message)
  }
  assert('blok html nested tetap ditolak', threw)
}

// --- Dry-run Page 11: validasi tidak boleh mengubah konten ---
const layoutPath =
  process.argv[2] ||
  process.env.LAYOUT_FILE ||
  path.resolve(process.cwd(), '..', '..', 'backups/render/pages-11-after-cta-patch-1795155252805.json')
try {
  const raw = readFileSync(layoutPath, 'utf8')
  const payload = JSON.parse(raw)
  const layout = payload.layout || payload
  const before = JSON.stringify(layout)
  const errors: string[] = []

  layout.forEach((block: any, index: number) => {
    if (block?.blockType !== 'html' || typeof block.html !== 'string' || block.allowScripts === true) return
    try {
      validateHtmlBlock(block.html)
    } catch (error) {
      errors.push(`#${index + 1}: ${(error as Error).message}`)
    }
  })

  console.log(`\nDry-run ${layoutPath}`)
  errors.forEach((line) => console.log(`  ${line}`))

  assert('Page 11 lolos validasi save', errors.length === 0, errors.join(' | '))
  assert('Validasi tidak mengubah konten', JSON.stringify(layout) === before)
} catch (error) {
  console.error(`Dry-run gagal: ${(error as Error).message}`)
  failed += 1
}

console.log(`\nHasil: ${passed} lulus, ${failed} gagal`)
if (failed > 0) process.exit(1)
