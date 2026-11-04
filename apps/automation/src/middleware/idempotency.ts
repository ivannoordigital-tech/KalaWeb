import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export interface IdempotencyRecord {
  key: string
  payloadHash: string
  response: any
  statusCode: number
  createdAt: string
  expiresAt: number
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PERSIST_FILE = path.resolve(__dirname, '../../.cache/idempotency.json')

/**
 * AUT-004: Manajemen Idempotensi Operasi Tulis Agen
 * Mencegah eksekusi ganda jika bot/agen melakukan retry jaringan.
 * Dilengkapi penyimpanan persisten ke disk agar tetap utuh saat restart.
 */
class IdempotencyManager {
  private cache = new Map<string, IdempotencyRecord>()
  private ttlMs = 24 * 60 * 60 * 1000 // 24 Jam

  constructor() {
    this.loadFromDisk()
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(PERSIST_FILE)) {
        const raw = fs.readFileSync(PERSIST_FILE, 'utf8')
        const items: IdempotencyRecord[] = JSON.parse(raw)
        const now = Date.now()
        for (const item of items) {
          if (item.expiresAt > now) {
            this.cache.set(item.key, item)
          }
        }
      }
    } catch (err: any) {
      // Abaikan jika file belum ada atau korup
    }
  }

  private saveToDisk(): void {
    try {
      const dir = path.dirname(PERSIST_FILE)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      const records = Array.from(this.cache.values())
      fs.writeFileSync(PERSIST_FILE, JSON.stringify(records, null, 2), 'utf8')
    } catch (err: any) {
      // Fallback in-memory
    }
  }

  public computeHash(payload: any): string {
    const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload)
    return crypto.createHash('sha256').update(serialized).digest('hex')
  }

  public check(key: string, payload: any): { isHit: boolean; record?: IdempotencyRecord; error?: string } {
    const existing = this.cache.get(key)
    if (!existing) {
      return { isHit: false }
    }

    // Periksa apakah sudah kadaluwarsa
    if (Date.now() > existing.expiresAt) {
      this.cache.delete(key)
      this.saveToDisk()
      return { isHit: false }
    }

    // Periksa apakah payload sama
    const currentHash = this.computeHash(payload)
    if (existing.payloadHash !== currentHash) {
      return {
        isHit: false,
        error: 'IDEMPOTENCY_KEY_MISMATCH: Kunci idempotensi yang sama digunakan dengan data payload yang berbeda.',
      }
    }

    return { isHit: true, record: existing }
  }

  public store(key: string, payload: any, response: any, statusCode = 200): void {
    const record: IdempotencyRecord = {
      key,
      payloadHash: this.computeHash(payload),
      response,
      statusCode,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + this.ttlMs,
    }
    this.cache.set(key, record)
    this.saveToDisk()
  }

  public clear(): void {
    this.cache.clear()
    try {
      if (fs.existsSync(PERSIST_FILE)) {
        fs.unlinkSync(PERSIST_FILE)
      }
    } catch (e) {}
  }

  public size(): number {
    return this.cache.size
  }
}

export const idempotencyManager = new IdempotencyManager()
