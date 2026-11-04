import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  resource: string
  docId?: string | number
  slug?: string
  timestamp: string
  ip: string
  payloadHash: string
  status: 'success' | 'failure'
  error?: string
  diff?: {
    before?: any
    after?: any
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const LOG_FILE = path.resolve(__dirname, '../../.cache/audit-trail.jsonl')

/**
 * AUT-012: Audit Trail Terpadu Aksi Agen Otomasi & Bot
 * Mencatat setiap aksi tulis/baca penting dari sistem otomasi.
 * Dilengkapi penyimpanan file persisten (JSON Lines) agar tidak hilang saat restart.
 */
class AuditLogger {
  private logs: AuditLogEntry[] = []
  private maxLogs = 1000

  constructor() {
    this.loadFromDisk()
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(LOG_FILE)) {
        const raw = fs.readFileSync(LOG_FILE, 'utf8')
        const lines = raw.split('\n').filter((l) => l.trim().length > 0)
        this.logs = lines.slice(-this.maxLogs).map((l) => JSON.parse(l)).reverse()
      }
    } catch (e) {
      // Abaikan jika belum ada
    }
  }

  private appendToDisk(entry: AuditLogEntry): void {
    try {
      const dir = path.dirname(LOG_FILE)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n', 'utf8')
    } catch (e) {
      // Fallback in-memory
    }
  }

  public log(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'payloadHash'> & { payload?: any }): AuditLogEntry {
    const serialized = typeof entry.payload === 'string' ? entry.payload : JSON.stringify(entry.payload || {})
    const payloadHash = crypto.createHash('sha256').update(serialized).digest('hex').substring(0, 16)

    const fullEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      payloadHash,
      actor: entry.actor,
      action: entry.action,
      resource: entry.resource,
      docId: entry.docId,
      slug: entry.slug,
      ip: entry.ip,
      status: entry.status,
      error: entry.error,
      diff: entry.diff,
    }

    this.logs.unshift(fullEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs.pop()
    }

    this.appendToDisk(fullEntry)

    return fullEntry
  }

  public getRecentLogs(limit = 50): AuditLogEntry[] {
    return this.logs.slice(0, limit)
  }

  public getLogsByResource(resource: string): AuditLogEntry[] {
    return this.logs.filter((l) => l.resource === resource)
  }

  public clear(): void {
    this.logs = []
    try {
      if (fs.existsSync(LOG_FILE)) {
        fs.unlinkSync(LOG_FILE)
      }
    } catch (e) {}
  }
}

export const auditLogger = new AuditLogger()
