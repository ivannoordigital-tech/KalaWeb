import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    // Memakai Chrome/Edge yang sudah terpasang; tidak perlu download browser.
    channel: process.env.PW_CHANNEL || 'chrome',
    headless: true,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: 'http://127.0.0.1:4321/sales/promo-treatment/',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
