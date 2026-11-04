#!/usr/bin/env node
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Server MCP harus tetap hidup meskipun database offline agar tool non-database
// (validate_content, get_seo_audit) tetap bisa dipakai dan tool database
// mengembalikan DATABASE_UNAVAILABLE yang eksplisit.
process.on('unhandledRejection', (reason) => {
  const message = reason instanceof Error ? reason.message : String(reason)
  console.error('[MCP] Unhandled rejection diabaikan agar server tetap hidup:', message)
})

let toolService;
try {
  const mod = await import('../services/toolService.js');
  toolService = mod.toolService;
} catch (err) {
  const distUrl = new URL('../../dist/services/toolService.js', import.meta.url).href;
  const mod = await import(distUrl);
  toolService = mod.toolService;
}

// Inisialisasi koneksi Payload CMS Local API saat server MCP dimulai.
// Catatan: payload.config hanya tersedia sebagai TypeScript, sehingga server MCP
// WAJIB dijalankan melalui tsx (lihat script "mcp" di package.json).
let payloadInstance = null;
{
  const configCandidates = [
    new URL('../../../cms/src/payload.config.ts', import.meta.url).href,
    new URL('../../../cms/src/payload.config.js', import.meta.url).href,
  ];

  let configModule = null;
  let configError = null;
  for (const url of configCandidates) {
    try {
      configModule = await import(url);
      break;
    } catch (err) {
      configError = err;
    }
  }

  if (!configModule?.default) {
    console.error(
      '[MCP] Gagal memuat payload.config. Jalankan MCP via `npm run mcp` (tsx) dan pastikan apps/cms/.env tersedia.',
      configError?.message || ''
    );
  } else {
    try {
      const { getPayload } = await import('payload');
      payloadInstance = await getPayload({ config: configModule.default });
      console.error('[MCP] Payload Local API terhubung.');
    } catch (err) {
      console.error('[MCP] Payload config ditemukan, tetapi koneksi database gagal:', err?.message);
    }
  }
}

/**
 * AUT-010: KalaWeb MCP Server (Model Context Protocol)
 * Mengizinkan Agen AI (Gemini, Claude, Antigravity) menjalankan 12 tool KalaWeb
 * melalui protokol JSON-RPC 2.0 terstandarisasi.
 */

const SERVER_INFO = {
  name: 'kala-automation-mcp',
  version: '1.0.0',
}

const TOOLS_METADATA = [
  {
    name: 'get_articles',
    description: 'Mengambil daftar artikel edukasi kesehatan ibu dan bayi dengan filter.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Jumlah item per halaman (default 10)' },
        page: { type: 'number', description: 'Nomor halaman' },
        status: { type: 'string', enum: ['published', 'draft', 'all'] },
      },
    },
  },
  {
    name: 'get_article_by_slug',
    description: 'Mengambil konten detail artikel berdasarkan slug unik.',
    inputSchema: {
      type: 'object',
      required: ['slug'],
      properties: {
        slug: { type: 'string', description: 'Slug URL artikel' },
      },
    },
  },
  {
    name: 'create_article',
    description: 'Membuat draf artikel baru dari teks Markdown dengan pengecekan klaim medis Permenkes 1787.',
    inputSchema: {
      type: 'object',
      required: ['title', 'slug', 'excerpt', 'contentMarkdown', 'focusKeyword', 'idempotencyKey'],
      properties: {
        title: { type: 'string' },
        slug: { type: 'string' },
        excerpt: { type: 'string' },
        contentMarkdown: { type: 'string' },
        category: { type: 'string', enum: ['bayi', 'ibu-menyusui', 'layanan', 'kehamilan', 'newborn-care'] },
        focusKeyword: { type: 'string' },
        dryRun: { type: 'boolean' },
        idempotencyKey: { type: 'string' },
      },
    },
  },
  {
    name: 'update_article',
    description: 'Memperbarui konten draf artikel yang sudah ada.',
    inputSchema: {
      type: 'object',
      required: ['slug'],
      properties: {
        slug: { type: 'string' },
        title: { type: 'string' },
        contentMarkdown: { type: 'string' },
        excerpt: { type: 'string' },
        dryRun: { type: 'boolean' },
      },
    },
  },
  {
    name: 'validate_content',
    description: 'Validasi pra-tulis teks terhadap klaim medis terlarang dan kelengkapan struktur (Dry-Run).',
    inputSchema: {
      type: 'object',
      required: ['collection', 'title', 'content'],
      properties: {
        collection: { type: 'string', enum: ['articles', 'pages', 'services'] },
        title: { type: 'string' },
        content: { type: 'string' },
      },
    },
  },
  {
    name: 'get_services',
    description: 'Mengambil daftar resmi paket layanan homecare dan tarif transparan.',
    inputSchema: {
      type: 'object',
      properties: {
        includeInactive: { type: 'boolean', default: false },
      },
    },
  },
  {
    name: 'get_service_areas',
    description: 'Mengambil daftar jangkauan wilayah homecare Bidan Kala.',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'Filter kota (Surabaya atau Sidoarjo)' },
      },
    },
  },
  {
    name: 'get_faq',
    description: 'Mengambil daftar Tanya Jawab (FAQ) resmi seputar layanan, SOP bidan, dan keamanan bayi.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string' },
        search: { type: 'string' },
      },
    },
  },
  {
    name: 'upload_media',
    description: 'Mengunggah aset visual (foto/PDF) ke penyimpanan R2/CDN dengan Alt text wajib.',
    inputSchema: {
      type: 'object',
      required: ['filename', 'alt', 'folder', 'dataBase64'],
      properties: {
        filename: { type: 'string', description: 'Nama file dengan ekstensi .webp/.jpg/.png/.pdf' },
        alt: { type: 'string', description: 'Teks deskripsi aksesibilitas & SEO (minimal 5 karakter)' },
        folder: {
          type: 'string',
          enum: ['baby-newborn', 'moms-lactation', 'midwives-clinic', 'documents', 'banners-promo', 'general'],
        },
        dataBase64: { type: 'string', description: 'Konten file dalam format Base64' },
      },
    },
  },
  {
    name: 'get_seo_audit',
    description: 'Menjalankan audit kalkulasi SEO (skor, grade, isu, dan metrik) untuk draft.',
    inputSchema: {
      type: 'object',
      required: ['title', 'slug'],
      properties: {
        title: { type: 'string' },
        metaTitle: { type: 'string' },
        metaDescription: { type: 'string' },
        focusKeyword: { type: 'string' },
        slug: { type: 'string' },
        contentMarkdown: { type: 'string' },
      },
    },
  },
  {
    name: 'trigger_deploy',
    description: 'Memicu antrean build Cloudflare Pages saat ada konten baru yang siap dipublikasikan.',
    inputSchema: {
      type: 'object',
      required: ['reason'],
      properties: {
        reason: { type: 'string', description: 'Alasan pemicuan build (minimal 5 karakter)' },
        resource: { type: 'string', default: 'AutomationAgent' },
        slug: { type: 'string' },
      },
    },
  },
  {
    name: 'get_deploy_status',
    description: 'Memeriksa status deploy terkini di Cloudflare Pages.',
    inputSchema: {
      type: 'object',
      properties: {
        forceRefresh: { type: 'boolean', default: false },
      },
    },
  },
]

export async function processJsonRpcMessage(line, customCtx) {
  const ctx = customCtx || {
    actor: 'agent:mcp',
    ip: '127.0.0.1',
    payloadInstance,
  }

  let request
  try {
    request = JSON.parse(line)
  } catch (err) {
    return {
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error: format JSON tidak valid' },
    }
  }

  const { id, method, params } = request

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          serverInfo: SERVER_INFO,
          capabilities: {
            tools: {},
          },
        },
      }

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOLS_METADATA,
        },
      }

    case 'tools/call': {
      const { name, arguments: args } = params || {}
      return handleToolCall(id, name, args || {}, ctx)
    }

    default:
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` },
      }
  }
}

async function handleToolCall(id, name, args, ctx) {
  try {
    let result = null
    switch (name) {
      case 'get_articles':
        result = await toolService.getArticles(args, ctx)
        break
      case 'get_article_by_slug':
        result = await toolService.getArticleBySlug(args, ctx)
        break
      case 'create_article':
        result = await toolService.createArticle(args, ctx)
        break
      case 'update_article':
        result = await toolService.updateArticle(args, ctx)
        break
      case 'validate_content':
        result = await toolService.validateContent(args)
        break
      case 'get_services':
        result = await toolService.getServices(args, ctx)
        break
      case 'get_service_areas':
        result = await toolService.getServiceAreas(args, ctx)
        break
      case 'get_faq':
        result = await toolService.getFaq(args, ctx)
        break
      case 'upload_media':
        result = await toolService.uploadMedia(args, ctx)
        break
      case 'get_seo_audit':
        result = await toolService.getSeoAudit(args)
        break
      case 'trigger_deploy':
        result = await toolService.triggerDeploy(args, ctx)
        break
      case 'get_deploy_status':
        result = await toolService.getDeployStatus(args, ctx)
        break
      default:
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32602, message: `Unknown tool name: ${name}` },
        }
    }

    return {
      jsonrpc: '2.0',
      id,
      result: {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      },
    }
  } catch (err) {
    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32000, message: err.message },
    }
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  rl.on('line', async (line) => {
    if (!line.trim()) return
    const response = await processJsonRpcMessage(line)
    process.stdout.write(JSON.stringify(response) + '\n')
  })
}
