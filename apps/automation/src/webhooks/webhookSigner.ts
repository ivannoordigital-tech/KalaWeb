import crypto from 'node:crypto'

/**
 * AUT-011: Outbound Webhook Signer & Verifier dengan HMAC-SHA256
 * Memastikan konsumen (n8n, webhook listener) dapat memverifikasi keaslian pesan.
 */

export interface SignedWebhookPayload {
  payload: any
  signature: string
  timestamp: number
  header: {
    'X-Kala-Signature': string
    'X-Kala-Timestamp': string
    'Content-Type': string
  }
}

export function signWebhookPayload(secret: string, payload: any, timestamp = Math.floor(Date.now() / 1000)): SignedWebhookPayload {
  const bodyString = typeof payload === 'string' ? payload : JSON.stringify(payload)
  const signaturePayload = `${timestamp}.${bodyString}`

  const signature = crypto
    .createHmac('sha256', secret)
    .update(signaturePayload)
    .digest('hex')

  return {
    payload,
    signature,
    timestamp,
    header: {
      'X-Kala-Signature': `sha256=${signature}`,
      'X-Kala-Timestamp': String(timestamp),
      'Content-Type': 'application/json',
    },
  }
}

export function verifyWebhookSignature(
  secret: string,
  rawBody: string,
  receivedSignatureHeader: string,
  receivedTimestampHeader: string,
  toleranceSeconds = 300 // 5 Menit toleransi clock drift
): boolean {
  if (!secret || !rawBody || !receivedSignatureHeader || !receivedTimestampHeader) {
    return false
  }

  const timestamp = Number(receivedTimestampHeader)
  if (isNaN(timestamp)) return false

  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - timestamp) > toleranceSeconds) {
    return false // Mencegah Replay Attack
  }

  const cleanSignature = receivedSignatureHeader.replace(/^sha256=/, '')
  const expectedPayload = `${timestamp}.${rawBody}`
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(expectedPayload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(cleanSignature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}
