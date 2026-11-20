/**
 * Backup JSON konten landing page ads (Page 11 + Template 1).
 *
 * Pemakaian:
 *   npm run backup:landing
 *
 * Cron produksi (contoh, setiap hari 03.00):
 *   0 3 * * * cd /opt/kalaweb && npm run backup:landing >> /var/log/kala-landing-backup.log 2>&1
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'

try {
  process.loadEnvFile('apps/cms/.env')
} catch {
  // Di server/CI env bisa sudah tersedia.
}

const CMS_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://admin.kalababyspa.com').replace(/\/$/, '')
const API_KEY = process.env.CMS_BOT_API_KEY
const KEEP = Number(process.env.BACKUP_KEEP || 30)

if (!API_KEY) {
  console.error('CMS_BOT_API_KEY belum diset.')
  process.exit(1)
}

const targets = [
  { collection: 'pages', id: 11, dir: 'backups/pages', prefix: 'page-11-promo-treatment', label: 'Page 11 promo-treatment' },
  { collection: 'page-templates', id: 1, dir: 'backups/page-templates', prefix: 'template-1-landing-ads', label: 'Template 1 landing-ads' },
]

const stamp = new Date().toISOString().replace(/[:.]/g, '-')

function getJson(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          Authorization: `users API-Key ${API_KEY}`,
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
    request.setTimeout(20000, () => request.destroy(new Error('timeout')))
  })
}

function prune(dir, prefix) {
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.startsWith(prefix) && file.endsWith('.json'))
    .sort()
  const excess = files.slice(0, Math.max(0, files.length - KEEP))
  excess.forEach((file) => fs.unlinkSync(path.join(dir, file)))
  return excess.length
}

for (const target of targets) {
  const query = target.collection === 'pages' ? '?depth=0&draft=true' : '?depth=0'
  const url = `${CMS_URL}/api/${target.collection}/${target.id}${query}`
  const doc = await getJson(url)
  const json = JSON.stringify(doc, null, 2)

  const dir = path.resolve(process.cwd(), target.dir)
  fs.mkdirSync(dir, { recursive: true })
  const filename = `${target.prefix}-${stamp}.json`
  const filePath = path.join(dir, filename)
  fs.writeFileSync(filePath, json, 'utf8')

  const hash = crypto.createHash('sha256').update(json).digest('hex').slice(0, 12)
  const blocks = Array.isArray(doc.layout) ? doc.layout.length : 0
  const pruned = prune(dir, target.prefix)

  console.log(
    `[backup] ${target.label}: ${filename} | blok=${blocks} | ${json.length} byte | sha=${hash}${pruned ? ` | prune=${pruned}` : ''}`
  )
}
