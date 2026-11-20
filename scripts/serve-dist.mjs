/**
 * Static server untuk dist Astro (Playwright smoke test).
 * Jalankan: node scripts/serve-dist.mjs
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'apps', 'web-kala', 'dist')
const PORT = Number(process.env.PORT || 4321)
const HOST = process.env.HOST || '127.0.0.1'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
}

const server = http.createServer((req, res) => {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  } catch {
    res.writeHead(400).end('bad request')
    return
  }

  if (pathname.endsWith('/')) pathname += 'index.html'
  const file = path.normalize(path.join(ROOT, pathname))
  if (!file.startsWith(path.normalize(ROOT))) {
    res.writeHead(403).end('forbidden')
    return
  }

  const candidates = [file, `${file}.html`, path.join(file, 'index.html')]
  const found = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
  if (!found) {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
    res.end('<h1>404</h1>')
    return
  }

  const ext = path.extname(found).toLowerCase()
  res.writeHead(200, {
    'content-type': TYPES[ext] || 'application/octet-stream',
    'cache-control': 'no-store',
  })
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  fs.createReadStream(found).pipe(res)
})

server.listen(PORT, HOST, () => {
  console.log(`[serve-dist] http://${HOST}:${PORT} -> ${ROOT}`)
})
