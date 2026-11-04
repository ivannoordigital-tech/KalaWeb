import http from 'node:http'
import { URL } from 'node:url'
import { toolService, type ToolContext } from './services/toolService.js'

const PORT = process.env.AUTOMATION_PORT ? parseInt(process.env.AUTOMATION_PORT, 10) : 3008

/**
 * AUT-008: HTTP Server Gateway untuk OpenAPI & Agen AI
 * Mengimplementasikan seluruh rute REST yang didefinisikan dalam openapi.json.
 */
export const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  const pathname = parsedUrl.pathname
  const method = (req.method || 'GET').toUpperCase()

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Idempotency-Key')

  if (method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  // Parse Body
  let body: any = {}
  if (method === 'POST' || method === 'PUT') {
    try {
      const chunks: Buffer[] = []
      for await (const chunk of req) {
        chunks.push(chunk)
      }
      const raw = Buffer.concat(chunks).toString('utf8')
      if (raw.trim()) {
        body = JSON.parse(raw)
      }
    } catch (e: any) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid JSON body: ' + e.message }))
      return
    }
  }

  const queryParams: Record<string, any> = {}
  parsedUrl.searchParams.forEach((val, key) => {
    queryParams[key] = val
  })

  const ctx: ToolContext = {
    actor: (req.headers['x-actor'] as string) || 'http-agent',
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
  }

  res.setHeader('Content-Type', 'application/json')

  try {
    // Health Check
    if (pathname === '/health' || pathname === '/api/health') {
      res.writeHead(200)
      res.end(JSON.stringify({ status: 'ok', service: 'kala-automation-gateway', port: PORT }))
      return
    }

    // Tools Dispatcher
    if (pathname === '/api/tools/get_articles' || pathname === '/tools/get_articles') {
      const input = {
        limit: queryParams.limit ? parseInt(queryParams.limit, 10) : 10,
        page: queryParams.page ? parseInt(queryParams.page, 10) : 1,
        status: (queryParams.status as any) || 'published',
        category: queryParams.category,
      }
      const result = await toolService.getArticles(input, ctx)
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    if (pathname === '/api/tools/get_article_by_slug' || pathname === '/tools/get_article_by_slug') {
      const slug = queryParams.slug || body.slug
      const result = await toolService.getArticleBySlug({ slug }, ctx)
      res.writeHead(result.success ? 200 : 404)
      res.end(JSON.stringify(result))
      return
    }

    if (pathname === '/api/tools/create_article' || pathname === '/tools/create_article') {
      const result = await toolService.createArticle(body, ctx)
      const status = result.success ? 201 : 400
      res.writeHead(status)
      res.end(JSON.stringify(result))
      return
    }

    if (pathname === '/api/tools/update_article' || pathname === '/tools/update_article') {
      const result = await toolService.updateArticle(body, ctx)
      res.writeHead(result.success ? 200 : 400)
      res.end(JSON.stringify(result))
      return
    }

    if (pathname === '/api/tools/validate_content' || pathname === '/tools/validate_content') {
      const result = await toolService.validateContent(body)
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    if (pathname === '/api/tools/get_services' || pathname === '/tools/get_services') {
      const result = await toolService.getServices(queryParams as any, ctx)
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    if (pathname === '/api/tools/get_service_areas' || pathname === '/tools/get_service_areas') {
      const result = await toolService.getServiceAreas(queryParams as any, ctx)
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    if (pathname === '/api/tools/get_faq' || pathname === '/tools/get_faq') {
      const result = await toolService.getFaq(queryParams as any, ctx)
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    if (pathname === '/api/tools/upload_media' || pathname === '/tools/upload_media') {
      const result = await toolService.uploadMedia(body, ctx)
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    if (pathname === '/api/tools/get_seo_audit' || pathname === '/tools/get_seo_audit') {
      const result = await toolService.getSeoAudit(body)
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    if (pathname === '/api/tools/trigger_deploy' || pathname === '/tools/trigger_deploy') {
      const result = await toolService.triggerDeploy(body, ctx)
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    if (pathname === '/api/tools/get_deploy_status' || pathname === '/tools/get_deploy_status') {
      const result = await toolService.getDeployStatus(queryParams as any)
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    // 404 Not Found
    res.writeHead(404)
    res.end(JSON.stringify({ error: `Not Found: ${method} ${pathname}` }))
  } catch (err: any) {
    res.writeHead(500)
    res.end(JSON.stringify({ error: 'Internal Server Error: ' + err.message }))
  }
})

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[Kala Automation Gateway] Server running at http://localhost:${PORT}`)
  })
}
