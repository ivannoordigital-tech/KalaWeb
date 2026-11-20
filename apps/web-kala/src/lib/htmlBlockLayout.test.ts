/**
 * Unit test kontrak layout HtmlBlock.
 * Jalankan: npm run test:htmlblock-layout
 */
import {
  HTML_BLOCK_BACKGROUND_HEX,
  rawBackgroundStyle,
  resolvesToRawLayout,
} from './htmlBlockLayout'

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

// Raw hanya ditentukan oleh full + none, bukan background.
assert(
  'full + none + transparent = raw',
  resolvesToRawLayout({ maxWidth: 'full', padding: 'none', background: 'transparent' })
)
assert(
  'full + none + peach tetap raw',
  resolvesToRawLayout({ maxWidth: 'full', padding: 'none', background: 'peach' })
)
assert(
  'full + none + cream tetap raw',
  resolvesToRawLayout({ maxWidth: 'full', padding: 'none', background: 'cream' })
)
assert(
  'full + none tanpa background tetap raw',
  resolvesToRawLayout({ maxWidth: 'full', padding: 'none' })
)

// Kombinasi lain tetap contained.
assert(
  'full + normal = contained',
  !resolvesToRawLayout({ maxWidth: 'full', padding: 'normal' })
)
assert(
  'normal + none = contained',
  !resolvesToRawLayout({ maxWidth: 'normal', padding: 'none' })
)
assert(
  'default (tanpa field) = contained',
  !resolvesToRawLayout({})
)
assert(
  'narrow + compact = contained',
  !resolvesToRawLayout({ maxWidth: 'narrow', padding: 'compact' })
)

// Background inline untuk mode raw.
assert(
  'peach menghasilkan background inline',
  rawBackgroundStyle('peach') === `background:${HTML_BLOCK_BACKGROUND_HEX.peach}`
)
assert(
  'cream menghasilkan background inline',
  rawBackgroundStyle('cream') === `background:${HTML_BLOCK_BACKGROUND_HEX.cream}`
)
assert('transparent tidak menghasilkan style', rawBackgroundStyle('transparent') === undefined)
assert('background kosong tidak menghasilkan style', rawBackgroundStyle(undefined) === undefined)
assert('background tak dikenal diabaikan', rawBackgroundStyle('neon') === undefined)

console.log(`\nHasil: ${passed} lulus, ${failed} gagal`)
if (failed > 0) process.exit(1)
