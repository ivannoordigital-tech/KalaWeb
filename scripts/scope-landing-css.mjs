/**
 * Scope CSS landing page ke dalam wrapper `.kala-html-raw`.
 *
 * Latar belakang: blok CSS CMS dimuat di dalam halaman, sehingga selector global
 * (`body`, `section`, `img`, `a`, `p`, dst.) ikut memengaruhi shell halaman
 * (sticky bar, banner consent, header). Script ini membatasi semua rule ke
 * `.kala-html-raw`, kecuali `:root` (token) dan `html` (scroll behavior).
 *
 * Pemakaian:
 *   node scripts/scope-landing-css.mjs <input.html> <output.html> [output.css]
 */
import fs from 'node:fs'
import path from 'node:path'
import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'

const inputPath = process.argv[2]
const outputPath = process.argv[3]
const cssOutputPath = process.argv[4]

if (!inputPath || !outputPath) {
  console.error('Pemakaian: node scripts/scope-landing-css.mjs <input.html> <output.html> [output.css]')
  process.exit(1)
}

const html = fs.readFileSync(inputPath, 'utf8')
const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
if (!styleMatch) {
  console.error('Tag <style> tidak ditemukan di input.')
  process.exit(1)
}

const css = styleMatch[1]
const root = postcss.parse(css)
const ALLOWED = new Set([':root', 'html'])

root.walkRules((rule) => {
  if (rule.parent && rule.parent.type === 'atrule' && /keyframes/i.test(rule.parent.name)) return

  rule.selector = selectorParser((selectors) => {
    selectors.each((selector) => {
      const text = selector.toString().trim()
      if (!text) return
      if (ALLOWED.has(text)) return

      if (text === 'body') {
        selector.removeAll()
        selector.append(selectorParser.className({ value: 'kala-html-raw' }))
        return
      }

      selector.prepend(selectorParser.combinator({ value: ' ' }))
      selector.prepend(selectorParser.className({ value: 'kala-html-raw' }))
    })
  }).processSync(rule.selector)
})

const scopedCss = root.toString()

// Verifikasi: tidak boleh ada selector yang lolos ke luar scope.
const leaks = []
postcss.parse(scopedCss).walkRules((rule) => {
  if (rule.parent && rule.parent.type === 'atrule' && /keyframes/i.test(rule.parent.name)) return
  selectorParser((selectors) => {
    selectors.each((selector) => {
      const text = selector.toString().trim()
      if (!text) return
      const first = text.split(/[\s>+~:.[#]/).filter(Boolean)[0] || text
      if (text === ':root' || text.startsWith('html')) return
      if (!text.startsWith('.kala-html-raw')) leaks.push(text)
    })
  }).processSync(rule.selector)
})

if (leaks.length > 0) {
  console.error(`Ditemukan ${leaks.length} selector yang belum ter-scope:`)
  leaks.slice(0, 20).forEach((item) => console.error(`- ${item}`))
  process.exit(1)
}

const styleContentStart = styleMatch.index + styleMatch[0].indexOf('>') + 1
const styleContentEnd = styleContentStart + css.length
const outputHtml =
  html.slice(0, styleContentStart) + `\n${scopedCss}\n` + html.slice(styleContentEnd)

fs.writeFileSync(outputPath, outputHtml, 'utf8')
if (cssOutputPath) {
  fs.mkdirSync(path.dirname(cssOutputPath), { recursive: true })
  fs.writeFileSync(cssOutputPath, scopedCss, 'utf8')
}

let ruleCount = 0
postcss.parse(scopedCss).walkRules(() => { ruleCount += 1 })

console.log(`Scoped CSS ditulis ke ${outputPath}`)
console.log(`Jumlah rule: ${ruleCount}`)
console.log(`Selector lolos scope: ${leaks.length}`)
console.log(`Ukuran: ${css.length} -> ${scopedCss.length} byte`)
