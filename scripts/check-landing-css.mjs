/**
 * Cek apakah CSS aktif di CMS (blok pertama Page 11) masih sama dengan snapshot
 * yang tersimpan di repo. Tujuannya mendeteksi drift: marketing mengubah CSS
 * langsung di CMS tanpa memperbarui snapshot/backup.
 *
 * Pemakaian:
 *   npm run check:landing-css
 *   STRICT=true npm run check:landing-css
 */
import fs from 'node:fs'
import https from 'node:https'

try {
  process.loadEnvFile('apps/cms/.env')
} catch {
  // Di CI, variabel bisa sudah disediakan lewat environment.
}

const CMS_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://admin.kalababyspa.com').replace(/\/$/, '')
const API_KEY = process.env.CMS_BOT_API_KEY
const SNAPSHOT_PATH = 'docs/assets/landing-page.cms-snapshot.css'
const PAGE_ID = process.env.PAGE_ID || '11'

if (!API_KEY) {
  console.error('CMS_BOT_API_KEY belum diset.')
  process.exitCode = 1
} else {
  const url = new URL(`${CMS_URL}/api/pages/${PAGE_ID}?depth=0&draft=true`)
  const page = await getJson(url, API_KEY)
  const html = String(page?.layout?.[0]?.html || '')
  const activeCss = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)?.[1] || '').trim()

  if (!activeCss) {
    console.error('Blok CSS tidak ditemukan di blok pertama halaman.')
    process.exitCode = 1
  } else if (!fs.existsSync(SNAPSHOT_PATH)) {
    console.error(`Snapshot tidak ditemukan: ${SNAPSHOT_PATH}`)
    process.exitCode = 1
  } else {
    const snapshot = fs.readFileSync(SNAPSHOT_PATH, 'utf8').trim()
    const normalize = (value) => value.replace(/\s+/g, ' ').trim()

    if (normalize(activeCss) === normalize(snapshot)) {
      console.log('CSS CMS sinkron dengan snapshot repo.')
    } else {
      console.warn('PERINGATAN: CSS CMS berbeda dengan snapshot repo.')
      console.warn(`- CMS: ${activeCss.length} byte`)
      console.warn(`- Snapshot: ${snapshot.length} byte`)
      console.warn('Perbarui snapshot setelah perubahan CSS yang disengaja.')
      if (process.env.STRICT === 'true') process.exitCode = 1
    }
  }
}

function getJson(url, apiKey) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          Authorization: `users API-Key ${apiKey}`,
          Accept: 'application/json',
          Connection: 'close',
        },
      },
      (response) => {
        let body = ''
        response.setEncoding('utf8')
        response.on('data', (chunk) => { body += chunk })
        response.on('end', () => {
          if (response.statusCode && response.statusCode >= 400) {
            reject(new Error(`HTTP ${response.statusCode}: ${body.slice(0, 300)}`))
            return
          }
          try {
            resolve(JSON.parse(body))
          } catch (error) {
            reject(error)
          }
        })
      }
    )
    request.on('error', reject)
    request.setTimeout(20000, () => {
      request.destroy(new Error('Timeout mengambil CSS dari CMS'))
    })
  })
}
