import { expect, test, type Page } from '@playwright/test'

const LANDING = '/sales/promo-treatment/'
const LEGACY = '/sales/bayi-kolik/'

async function layoutMetrics(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    const h1 = document.querySelector('h1')
    const float = document.querySelector('.float-wa')
    const bar = document.getElementById('mobile-sticky-bar')
    return {
      overflow: doc.scrollWidth > doc.clientWidth + 1,
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      iframes: document.querySelectorAll('iframe').length,
      h1Font: h1 ? getComputedStyle(h1).fontFamily : '',
      bodyFont: getComputedStyle(document.body).fontFamily,
      floatDisplay: float ? getComputedStyle(float).display : null,
      barDisplay: bar ? getComputedStyle(bar).display : null,
    }
  })
}

test.describe('Landing promo treatment smoke test', () => {
  test('desktop 1440: layout, font, CTA, schema, disclaimer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(LANDING, { waitUntil: 'load' })
    await expect(page.locator('h1').first()).toBeVisible()

    const metrics = await layoutMetrics(page)
    expect(metrics.overflow, `horizontal overflow: ${metrics.scrollWidth}/${metrics.clientWidth}`).toBe(false)
    expect(metrics.iframes).toBe(0)
    expect(metrics.h1Font).toContain('Fredoka')
    expect(metrics.bodyFont).toContain('Nunito')
    expect(metrics.floatDisplay).not.toBe('none')
    expect(metrics.barDisplay).toBe('none')

    const ctas = page.locator('.kala-wa-btn')
    const ctaCount = await ctas.count()
    expect(ctaCount).toBeGreaterThanOrEqual(8)
    const refs = await ctas.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-ref-code')))
    refs.forEach((ref, index) => expect(ref, `CTA #${index + 1} tanpa data-ref-code`).toBeTruthy())

    await expect(page.locator('#booking')).toHaveCount(1)
    await expect(page.locator('#layanan')).toHaveCount(1)

    const images = page.locator('img[src*="cdn.scalev.id"]')
    const imageCount = await images.count()
    expect(imageCount).toBe(8)
    for (let i = 0; i < imageCount; i += 1) {
      const image = images.nth(i)
      expect(await image.getAttribute('width')).toBe('640')
      expect(await image.getAttribute('height')).toBeTruthy()
    }
    await expect(page.locator('img.hero-logo')).toHaveAttribute('fetchpriority', 'high')

    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent()
    const parsed = JSON.parse(jsonLd || '{}')
    expect(parsed['@graph']).toHaveLength(2)
    expect(JSON.stringify(parsed)).not.toContain('aggregateRating')

    await expect(page.locator('.testi-note')).toHaveCount(1)
    await expect(page.locator('.health-note')).toHaveCount(1)
    await expect(page.locator('.promo-box')).toContainText('S&K')
  })

  test('tablet 768: full width tanpa overflow', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto(LANDING, { waitUntil: 'load' })
    await expect(page.locator('h1').first()).toBeVisible()

    const metrics = await layoutMetrics(page)
    expect(metrics.overflow).toBe(false)
    expect(metrics.iframes).toBe(0)
    expect(metrics.floatDisplay).not.toBe('none')
    expect(metrics.barDisplay).toBe('none')
  })

  test('mobile 375: float disembunyikan dan sticky bar muncul', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(LANDING, { waitUntil: 'load' })
    await expect(page.locator('h1').first()).toBeVisible()

    const metrics = await layoutMetrics(page)
    expect(metrics.overflow).toBe(false)
    expect(metrics.iframes).toBe(0)
    expect(metrics.floatDisplay).toBe('none')
    expect(metrics.barDisplay).toBe('block')

    await page.evaluate(() => window.scrollTo(0, Math.round(document.body.scrollHeight * 0.35)))
    await page.waitForTimeout(800)

    const box = await page.locator('#mobile-sticky-bar').boundingBox()
    expect(box, 'sticky bar tidak ditemukan').not.toBeNull()
    expect(box!.height).toBeGreaterThan(0)
    expect(box!.y).toBeLessThan(812)

    const floatBox = await page.locator('.float-wa').boundingBox()
    expect(floatBox, 'floating WA masih tampil di mobile').toBeNull()
  })

  test('legacy /sales/bayi-kolik tetap tanpa overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(LEGACY, { waitUntil: 'load' })
    await expect(page.locator('h1').first()).toBeVisible()
    const metrics = await layoutMetrics(page)
    expect(metrics.overflow).toBe(false)
  })
})
