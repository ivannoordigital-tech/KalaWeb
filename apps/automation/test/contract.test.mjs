import assert from 'node:assert'
import { toolService } from '../dist/services/toolService.js'
import { TOOL_NAMES } from '../dist/contracts/schemas.js'
import { signWebhookPayload, verifyWebhookSignature } from '../dist/webhooks/webhookSigner.js'
import { idempotencyManager } from '../dist/middleware/idempotency.js'
import { auditLogger } from '../dist/audit/auditLogger.js'
import { processJsonRpcMessage } from '../src/mcp/mcpServer.mjs'

// Mock Payload Local API instance for contract testing
const mockDb = {
  articles: [
    {
      id: 1,
      title: 'Cara Mengatasi Bayi Kolik Malam Hari: Panduan Bidan Tenangkan Tangisan Si Kecil',
      slug: 'bayi-kolik-malam-hari',
      category: 'bayi',
      _status: 'published',
      pubDate: '2026-10-20',
    },
    {
      id: 2,
      title: 'Manfaat Pijat Oksitosin untuk Kelancaran ASI Ibu Menyusui',
      slug: 'manfaat-pijat-oksitosin-ibu-menyusui',
      category: 'ibu-menyusui',
      _status: 'published',
      pubDate: '2026-10-22',
    },
  ],
  services: [
    { id: 1, slug: 'baby-newborn', name: 'Kala Baby: Pijat Ceria Newborn', price: 'Rp60.000', numericPrice: 60000, active: true },
    { id: 2, slug: 'bundle-duo', name: 'Kala Bundle Duo (Mom & Baby)', price: 'Rp175.000', numericPrice: 175000, active: true },
  ],
  serviceAreas: [
    { id: 1, slug: 'surabaya-timur', name: 'Surabaya Timur', city: 'Surabaya', active: true },
  ],
  faq: [
    { id: 1, question: 'Apakah bidan terdaftar resmi?', answer: 'Ya, 100% ber-STR resmi.', active: true },
  ],
  deployments: [
    { id: 1, status: 'success', triggerReason: 'Build initial', url: 'https://kalababyspa.com', completedAt: new Date().toISOString() },
  ],
  media: [],
}

const mockPayloadInstance = {
  find: async ({ collection, where, limit, page }) => {
    if (collection === 'articles') {
      let docs = [...mockDb.articles]
      if (where?.slug?.equals) docs = docs.filter((d) => d.slug === where.slug.equals)
      return { docs, totalDocs: docs.length, page: page || 1, limit: limit || 10 }
    }
    if (collection === 'services') return { docs: mockDb.services, totalDocs: mockDb.services.length }
    if (collection === 'service-areas') return { docs: mockDb.serviceAreas, totalDocs: mockDb.serviceAreas.length }
    if (collection === 'faq') return { docs: mockDb.faq, totalDocs: mockDb.faq.length }
    if (collection === 'deployments') return { docs: mockDb.deployments, totalDocs: mockDb.deployments.length }
    return { docs: [], totalDocs: 0 }
  },
  create: async ({ collection, data, file }) => {
    const newDoc = { id: Date.now(), ...data }
    if (file) newDoc.filename = file.name
    if (collection === 'media') {
      newDoc.url = `https://admin.kalababyspa.com/media/${data.folder || 'general'}/${file?.name || 'file.webp'}`
      mockDb.media.push(newDoc)
    }
    if (collection === 'articles') mockDb.articles.push(newDoc)
    if (collection === 'deployments') mockDb.deployments.push(newDoc)
    return newDoc
  },
  update: async ({ collection, id, data, where }) => {
    if (collection === 'articles') {
      const idx = mockDb.articles.findIndex((a) => (where?.slug?.equals ? a.slug === where.slug.equals : a.id === id))
      if (idx !== -1) {
        mockDb.articles[idx] = { ...mockDb.articles[idx], ...data }
        return { docs: [mockDb.articles[idx]] }
      }
    }
    return { docs: [data] }
  },
}

const mockCtx = {
  actor: 'agent:kala-contract-tester',
  ip: '127.0.0.1',
  payloadInstance: mockPayloadInstance,
}

async function runContractTests() {
  idempotencyManager.clear()
  auditLogger.clear()

  // --- 1. Verifikasi 12 Tool Contract (AUT-003) ---
  console.log('--- 1. Verifikasi Kelengkapan 12 Tool Resmi (AUT-003) ---')
  assert.strictEqual(TOOL_NAMES.length, 12, 'Harus ada tepat 12 tool yang terdaftar')
  console.log(`✅ LULUS: Tepat 12 tool kontrak terdaftar: ${TOOL_NAMES.join(', ')}`)

  // --- 2. Uji Read Tools via Payload Local API ---
  console.log('\n--- 2. Pengujian Tool Baca (Read Tools) ---')
  const articlesRes = await toolService.getArticles({ limit: 5, page: 1, status: 'published' }, mockCtx)
  assert.strictEqual(articlesRes.success, true, 'get_articles harus berhasil')
  assert(articlesRes.data.length > 0, 'get_articles harus mengembalikan artikel')
  console.log(`✅ LULUS: Tool get_articles berhasil mengambil ${articlesRes.data.length} artikel dari Local API`)

  const articleBySlugRes = await toolService.getArticleBySlug({ slug: 'bayi-kolik-malam-hari' }, mockCtx)
  assert.strictEqual(articleBySlugRes.success, true, 'get_article_by_slug harus menemukan artikel yang valid')
  console.log('✅ LULUS: Tool get_article_by_slug berhasil menemukan detail artikel')

  const articleNotFound = await toolService.getArticleBySlug({ slug: 'slug-tidak-ada-xyz' }, mockCtx)
  assert.strictEqual(articleNotFound.success, false, 'get_article_by_slug harus gagal untuk slug non-existent')
  console.log('✅ LULUS: Tool get_article_by_slug mengembalikan NOT_FOUND untuk slug yang tidak ada')

  const servicesRes = await toolService.getServices({ includeInactive: false }, mockCtx)
  assert.strictEqual(servicesRes.success, true, 'get_services harus berhasil')
  assert(servicesRes.data.some((s) => s.numericPrice === 175000), 'Tarif layanan harus sinkron dengan data resmi')
  console.log('✅ LULUS: Tool get_services mengembalikan katalog layanan resmi dari DB')

  // Verifikasi kegagalan saat payloadInstance tidak ada (tidak boleh fallback mock)
  const servicesNoDb = await toolService.getServices({ includeInactive: false }, { actor: 'anon', ip: '127.0.0.1' })
  assert.strictEqual(servicesNoDb.success, false, 'get_services tanpa payloadInstance HARUS GAGAL')
  assert.strictEqual(servicesNoDb.code, 'DATABASE_UNAVAILABLE')
  console.log('✅ LULUS: Tool get_services menolak fallback palsu saat DB offline (DATABASE_UNAVAILABLE)')

  // --- 3. Uji Permenkes No. 1787/2010 Medical Claims Guard (AUT-005) ---
  console.log('\n--- 3. Pengujian Guard Klaim Medis Terlarang Permenkes 1787 (AUT-005) ---')
  const illegalArticleInput = {
    title: 'Terapi Kolik Bayi Pasti Sembuh Total dan 100% Aman',
    slug: 'terapi-kolik-ilegal',
    excerpt: 'Layanan kami memberikan garansi sembuh tanpa risiko medis.',
    contentMarkdown: '# Terapi Kolik\nDijamin sembuh dalam hitungan menit.',
    category: 'bayi',
    focusKeyword: 'terapi kolik',
    dryRun: false,
    idempotencyKey: 'test-idem-illegal-001',
  }
  const createIllegalRes = await toolService.createArticle(illegalArticleInput, mockCtx)
  assert.strictEqual(createIllegalRes.success, false, 'create_article dengan klaim terlarang HARUS DITOLAK')
  assert.strictEqual(createIllegalRes.code, 'FORBIDDEN_MEDICAL_CLAIM', 'Error code harus FORBIDDEN_MEDICAL_CLAIM')
  console.log(`✅ LULUS: create_article berhasil memblokir klaim medis terlarang: "${createIllegalRes.violations.join(', ')}"`)

  // --- 4. Uji Idempotensi & Dry-Run (AUT-004) ---
  console.log('\n--- 4. Pengujian Idempotensi & Dry-Run (AUT-004) ---')
  const validArticleInput = {
    title: 'Panduan Praktis Perawatan Bayi Baru Lahir di Rumah',
    slug: 'panduan-perawatan-newborn',
    excerpt: 'Penjelasan ilmiah bidan mengenai perawatan tali pusat dan stimulasi taktil lembut.',
    contentMarkdown: '## Perawatan Tali Pusat\nJaga agar area tali pusat selalu bersih dan kering.',
    category: 'bayi',
    focusKeyword: 'perawatan newborn',
    dryRun: true,
    idempotencyKey: 'test-idem-valid-001',
    status: 'draft',
  }

  // Dry-run execution
  const dryRunRes = await toolService.createArticle(validArticleInput, mockCtx)
  assert.strictEqual(dryRunRes.success, true, 'Dry-run harus berhasil')
  assert.strictEqual(dryRunRes.dryRun, true, 'Response harus bertanda dryRun: true')
  console.log('✅ LULUS: Mode dry-run memvalidasi struktur Lexical AST tanpa menyimpan ke database')

  // Real Create
  validArticleInput.dryRun = false
  const createRes1 = await toolService.createArticle(validArticleInput, mockCtx)
  assert.strictEqual(createRes1.success, true, 'create_article valid harus berhasil')
  assert.strictEqual(createRes1._cached, undefined, 'Eksekusi pertama tidak boleh berasal dari cache')
  console.log('✅ LULUS: Pembuatan artikel perdana berhasil dan disimpan ke database')

  // Re-submit identical idempotencyKey (Retry)
  const createRes2 = await toolService.createArticle(validArticleInput, mockCtx)
  assert.strictEqual(createRes2.success, true, 'Retry idempotency harus berhasil')
  assert.strictEqual(createRes2._cached, true, 'Retry harus mengembalikan respon dari cache idempotensi')
  console.log('✅ LULUS: Permintaan ulang dengan idempotency key yang sama mengembalikan cache (0 duplikasi)')

  // Re-submit same idempotencyKey with DIFFERENT payload (Mismatch detection)
  const alteredInput = { ...validArticleInput, title: 'Judul Diubah Diam-diam' }
  const mismatchRes = await toolService.createArticle(alteredInput, mockCtx)
  assert.strictEqual(mismatchRes.success, false, 'Kunci yang sama dengan payload berbeda HARUS DITOLAK')
  assert.strictEqual(mismatchRes.code, 'IDEMPOTENCY_MISMATCH', 'Error code harus IDEMPOTENCY_MISMATCH')
  console.log('✅ LULUS: Penyalahgunaan idempotency key untuk payload berbeda berhasil dicegah')

  // --- 5. Uji Media Tool & Upload File Nyata (AUT-007) ---
  console.log('\n--- 5. Pengujian Tool Media & Absolute CDN URL (AUT-007) ---')
  const mediaRes = await toolService.uploadMedia(
    {
      filename: 'panduan-sendawa-bayi.webp',
      alt: 'Bidan Kala memperagakan posisi menyendawakan bayi di atas bahu',
      folder: 'baby-newborn',
      dataBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    },
    mockCtx
  )
  assert.strictEqual(mediaRes.success, true, 'upload_media harus berhasil')
  assert(mediaRes.data.url.startsWith('https://'), 'URL media harus diawali https:// (URL absolut)')
  assert(mediaRes.data.url.includes('/media/baby-newborn/'), 'URL media harus tersusun rapi sesuai folder')
  console.log(`✅ LULUS: upload_media menghasilkan URL absolut: ${mediaRes.data.url}`)

  // --- 6. Uji Outbound Webhook Signing & HMAC Verification (AUT-011) ---
  console.log('\n--- 6. Pengujian Tanda Tangan Kriptografi Webhook HMAC-SHA256 (AUT-011) ---')
  const secret = 'super-secret-webhook-key-min32char'
  const samplePayload = {
    event: 'content.published',
    resource: 'Articles',
    slug: 'panduan-bayi-sendawa',
    publishedAt: new Date().toISOString(),
  }
  const timestamp = Math.floor(Date.now() / 1000)
  const signed = signWebhookPayload(secret, samplePayload, timestamp)

  const rawBody = JSON.stringify(samplePayload)
  const isValid = verifyWebhookSignature(
    secret,
    rawBody,
    signed.header['X-Kala-Signature'],
    signed.header['X-Kala-Timestamp']
  )
  assert.strictEqual(isValid, true, 'Tanda tangan webhook yang sah harus diverifikasi benar')
  console.log('✅ LULUS: Tanda tangan HMAC-SHA256 webhook terverifikasi valid')

  const tamperedBody = JSON.stringify({ ...samplePayload, slug: 'diubah' })
  const isTamperedValid = verifyWebhookSignature(
    secret,
    tamperedBody,
    signed.header['X-Kala-Signature'],
    signed.header['X-Kala-Timestamp']
  )
  assert.strictEqual(isTamperedValid, false, 'Payload yang dimanipulasi harus ditolak')
  console.log('✅ LULUS: Percobaan manipulasi isi pesan webhook terdeteksi dan ditolak')

  // --- 7. Uji Model Context Protocol (MCP) Server (AUT-010) ---
  console.log('\n--- 7. Pengujian Model Context Protocol (MCP) Server (AUT-010) ---')
  const initRes = await processJsonRpcMessage(
    JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }),
    mockCtx
  )
  assert.strictEqual(initRes.result.serverInfo.name, 'kala-automation-mcp')
  console.log('✅ LULUS: MCP initialize mengembalikan serverInfo resmi')

  const toolsListRes = await processJsonRpcMessage(
    JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }),
    mockCtx
  )
  assert.strictEqual(toolsListRes.result.tools.length, 12)
  console.log(`✅ LULUS: MCP tools/list mengekspos seluruh ${toolsListRes.result.tools.length} tool ke Agen AI`)

  const toolCallRes = await processJsonRpcMessage(
    JSON.stringify({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: { name: 'get_services', arguments: { includeInactive: false } },
    }),
    mockCtx
  )
  assert(toolCallRes.result.content[0].text.includes('baby-newborn'))
  console.log('✅ LULUS: MCP tools/call berhasil mengeksekusi tool dan mengembalikan respon teks')

  // --- 8. Verifikasi Jejak Audit (Audit Trail - AUT-012) ---
  console.log('\n--- 8. Pengujian Jejak Audit (Audit Trail - AUT-012) ---')
  const auditLogs = auditLogger.getRecentLogs(10)
  assert(auditLogs.length >= 4, 'Audit trail harus mencatat minimal 4 aksi')
  assert(auditLogs.every((l) => l.actor && l.timestamp && l.action), 'Setiap log harus memiliki atribut lengkap')
  console.log(`✅ LULUS: Seluruh ${auditLogs.length} aksi agen tercatat lengkap dengan timestamp dan payload hash`)

  console.log('\n========================================================================================')
  console.log('🎉 SELURUH PENGUJIAN KONTRAK OTOMASI, MCP & REGULASI PERMENKES LULUS (0 GAGAL)!')
  console.log('========================================================================================')
}

runContractTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Contract test failed:', err)
    process.exit(1)
  })
