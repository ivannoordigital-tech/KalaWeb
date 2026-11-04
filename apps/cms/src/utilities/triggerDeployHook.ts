/**
 * Cloudflare Pages Deploy Hook Trigger with Real Status Sync, Debounce, and Admin Alerts
 * (DEP-001, DEP-002, DEP-003)
 *
 * Mengatasi masalah "success palsu" di mana pesan "Sudah Live" sebelumnya dikirim
 * saat webhook baru diterima Cloudflare, bukan saat build selesai.
 */

let lastTriggerTime = 0;
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY_MS = 60000; // 60 detik jendela debounce

let cachedPayload: any = null;

export function registerPayloadInstance(payload: any) {
  if (payload) cachedPayload = payload;
}

export function getCachedPayload() {
  return cachedPayload;
}

export interface TriggerOptions {
  resource: string;
  action: 'publish' | 'unpublish' | 'delete' | 'update_settings';
  slug?: string;
}

export interface DeployStatus {
  status: 'idle' | 'queued' | 'building' | 'success' | 'failed' | 'canceled';
  stage?: string;
  lastTriggeredAt?: string;
  lastCompletedAt?: string;
  lastReason?: string;
  error?: string;
  targetUrl?: string;
  source?: 'cloudflare_api' | 'webhook_estimate';
  realDeploymentId?: string;
}

export const currentDeployStatus: DeployStatus = {
  status: 'idle',
};

// Cache API Cloudflare selama 10 detik agar tidak membebani rate limit
let lastApiPollTime = 0;
const API_POLL_CACHE_MS = 10000;

export async function fetchRealCloudflareDeployStatus(
  payloadInstance?: any,
  deploymentDocId?: string | number | null
): Promise<DeployStatus | null> {
  const p = payloadInstance || cachedPayload;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const projectName = process.env.CLOUDFLARE_PROJECT_NAME || 'kala-web';

  if (!token || !accountId || !projectName) {
    return null; // Mode estimasi jika token API Cloudflare tidak dikonfigurasi
  }

  const now = Date.now();
  if (now - lastApiPollTime < API_POLL_CACHE_MS && currentDeployStatus.source === 'cloudflare_api') {
    return currentDeployStatus;
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments?per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) {
      console.warn(`[Cloudflare API] HTTP ${res.status} saat memeriksa status deploy.`);
      return null;
    }

    const json = await res.json();
    const deployment = json.result?.[0];
    if (!deployment) return null;

    lastApiPollTime = now;

    // Pemetaan status nyata Cloudflare Pages
    let mappedStatus: DeployStatus['status'] = 'idle';
    const latestStage = deployment.latest_stage || {};
    const stageName = latestStage.name || 'deploy';

    if (deployment.status === 'success') {
      mappedStatus = 'success';
    } else if (deployment.status === 'failure') {
      mappedStatus = 'failed';
    } else if (deployment.status === 'canceled') {
      mappedStatus = 'canceled';
    } else if (deployment.status === 'active' || latestStage.status === 'active') {
      mappedStatus = 'building';
    } else if (deployment.status === 'queued' || latestStage.status === 'idle') {
      mappedStatus = 'queued';
    }

    currentDeployStatus.status = mappedStatus;
    currentDeployStatus.stage = stageName;
    currentDeployStatus.realDeploymentId = deployment.id;
    currentDeployStatus.targetUrl = deployment.url || currentDeployStatus.targetUrl;
    currentDeployStatus.lastCompletedAt = deployment.modified_on || currentDeployStatus.lastCompletedAt;
    currentDeployStatus.source = 'cloudflare_api';

    // Sinkronkan ke koleksi Deployments di database
    if (p && typeof p.update === 'function') {
      try {
        if (deploymentDocId) {
          await p.update({
            collection: 'deployments',
            id: deploymentDocId,
            data: {
              status: mappedStatus,
              cloudflareDeploymentId: deployment.id,
              url: deployment.url || currentDeployStatus.targetUrl,
              completedAt: deployment.modified_on || new Date().toISOString(),
              durationSeconds: deployment.duration ? Math.round(deployment.duration / 1000) : undefined,
            },
          });
        } else if (deployment.id) {
          const existing = await p.find({
            collection: 'deployments',
            where: {
              cloudflareDeploymentId: { equals: deployment.id },
            },
            limit: 1,
          });
          if (existing.docs?.length > 0) {
            await p.update({
              collection: 'deployments',
              id: existing.docs[0].id,
              data: {
                status: mappedStatus,
                completedAt: deployment.modified_on || new Date().toISOString(),
              },
            });
          }
        }
      } catch (dbErr: any) {
        console.warn('[Deploy Hook] Gagal sinkronisasi DB deployments:', dbErr.message);
      }
    }

    return currentDeployStatus;
  } catch (err: any) {
    console.warn('[Cloudflare API] Gagal memuat status deployment:', err.message);
    return null;
  }
}

export function getDeployStatus(): DeployStatus & { isBuilding: boolean; estimatedSecondsRemaining: number } {
  const now = Date.now();
  const timeSinceTrigger = now - lastTriggerTime;
  const BUILD_DURATION_MS = 90000; // ~90 detik durasi rata-rata build

  // Jika status dipicu webhook tetapi API Cloudflare belum disinkronkan
  const isEstimatedBuilding = (currentDeployStatus.status === 'queued' || currentDeployStatus.status === 'building') && timeSinceTrigger < BUILD_DURATION_MS;
  const isBuilding = currentDeployStatus.source === 'cloudflare_api'
    ? (currentDeployStatus.status === 'queued' || currentDeployStatus.status === 'building')
    : isEstimatedBuilding;

  const estimatedSecondsRemaining = isBuilding
    ? Math.max(0, Math.round((BUILD_DURATION_MS - timeSinceTrigger) / 1000))
    : 0;

  // Jika waktu estimasi habis pada mode estimasi tanpa konfirmasi API,
  // ubah ke 'idle' dengan catatan estimasi, JANGAN klaim fake 'success'
  if (!isBuilding && currentDeployStatus.source !== 'cloudflare_api' && currentDeployStatus.status === 'building') {
    currentDeployStatus.status = 'idle';
    currentDeployStatus.lastCompletedAt = new Date().toISOString();
  }

  return {
    ...currentDeployStatus,
    isBuilding,
    estimatedSecondsRemaining,
  };
}

export interface DeadLetterEntry {
  timestamp: string;
  reason: string;
  error: string;
  attempts: number;
}

export const deadLetterDeployQueue: DeadLetterEntry[] = [];

async function sendNotificationAlert(title: string, bodyText: string, level: 'info' | 'error'): Promise<void> {
  // 1. Telegram Alert
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

  if (tgToken && tgChatId) {
    try {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: `${level === 'error' ? '❌' : '🚀'} <b>${title}</b>\n${bodyText}`,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.warn('[Deploy Hook] Gagal mengirim alert Telegram:', (err as Error).message);
    }
  }

  // 2. Slack / Discord / Webhook Alert (DEP-003)
  const webhookUrl = process.env.SLACK_WEBHOOK_URL || process.env.ALERT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `*${title}*\n${bodyText.replace(/<[^>]+>/g, '')}`,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (e: any) {
      console.warn('[Deploy Hook] Gagal mengirim alert Slack/Webhook:', e.message);
    }
  }
}

export function triggerCloudflareDeploy(options: TriggerOptions, payloadInstance?: any): void {
  if (payloadInstance) {
    registerPayloadInstance(payloadInstance);
  }

  const hookUrl = process.env.CLOUDFLARE_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    console.log(`[Deploy Hook] Dilewati: CLOUDFLARE_DEPLOY_HOOK_URL belum diset di environment.`);
    return;
  }

  const reason = `[${options.action.toUpperCase()}] ${options.resource}${options.slug ? ` (${options.slug})` : ''}`;
  const now = Date.now();
  const timeSinceLast = now - lastTriggerTime;

  if (timeSinceLast < DEBOUNCE_DELAY_MS) {
    console.log(`[Deploy Hook] Debounced trigger: ${reason}. Build lain baru saja diminta ${Math.round(timeSinceLast / 1000)} detik lalu. Menjadwalkan antrean berikutnya.`);
    
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      executeDeployWithRetry(hookUrl, options, `Deferred (Debounced): ${reason}`, payloadInstance || cachedPayload);
    }, DEBOUNCE_DELAY_MS - timeSinceLast);

    return;
  }

  // 2.5s safe delay to ensure database transaction is fully committed before Cloudflare starts pulling data
  console.log(`[Deploy Hook] Memicu build Cloudflare Pages dalam 2.5 detik untuk: ${reason}`);
  setTimeout(() => {
    executeDeployWithRetry(hookUrl, options, reason, payloadInstance || cachedPayload);
  }, 2500);
}

async function executeDeployWithRetry(
  hookUrl: string,
  options: TriggerOptions,
  reason: string,
  payloadInstance?: any
): Promise<void> {
  const p = payloadInstance || cachedPayload;
  const MAX_RETRIES = 2;
  let attempts = 0;
  let lastErrorMsg = '';

  lastTriggerTime = Date.now();
  currentDeployStatus.status = 'queued';
  currentDeployStatus.stage = 'queued';
  currentDeployStatus.lastTriggeredAt = new Date().toISOString();
  currentDeployStatus.lastReason = reason;
  currentDeployStatus.source = 'webhook_estimate';

  const targetUrl = options.resource === 'LandingPages' && options.slug
    ? `https://kalababyspa.com/sales/${options.slug}`
    : options.resource === 'Pages' && options.slug
      ? `https://kalababyspa.com/${options.slug}`
      : 'https://kalababyspa.com';

  currentDeployStatus.targetUrl = targetUrl;

  // Catat record awal ke koleksi Deployments di database
  let deploymentDocId: string | number | null = null;
  if (p && typeof p.create === 'function') {
    try {
      const doc = await p.create({
        collection: 'deployments',
        data: {
          status: 'queued',
          triggerReason: reason,
          url: targetUrl,
          environment: 'production',
          startedAt: new Date().toISOString(),
        },
      });
      deploymentDocId = doc?.id;
    } catch (err: any) {
      console.warn('[Deploy Hook] Gagal mencatat record awal deployments:', err.message);
    }
  }

  await sendNotificationAlert(
    '[KalaWeb Build Dijadwalkan]',
    `Perubahan konten sedang diproses: <code>${reason}</code>\nCloudflare Pages akan membangun situs publik (${targetUrl}) dalam ~1–2 menit.`,
    'info'
  );

  while (attempts <= MAX_RETRIES) {
    attempts++;
    try {
      const response = await fetch(hookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, timestamp: new Date().toISOString(), attempt: attempts }),
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        currentDeployStatus.status = 'building';
        currentDeployStatus.stage = 'building';
        console.log(`[Deploy Hook] Cloudflare Pages menerima webhook build (percobaan ke-${attempts}). Alasan: ${reason} (HTTP ${response.status})`);
        
        if (deploymentDocId && p && typeof p.update === 'function') {
          try {
            await p.update({
              collection: 'deployments',
              id: deploymentDocId,
              data: {
                status: 'building',
              },
            });
          } catch (e) {}
        }

        setTimeout(() => {
          fetchRealCloudflareDeployStatus(p, deploymentDocId).catch(() => {});
        }, 5000);
        return;
      }

      lastErrorMsg = `HTTP ${response.status}: ${response.statusText}`;
      if (response.status < 500) {
        break;
      }
    } catch (err: any) {
      lastErrorMsg = err.message || 'Network Timeout';
    }

    if (attempts <= MAX_RETRIES) {
      console.warn(`[Deploy Hook] Percobaan ke-${attempts} gagal (${lastErrorMsg}). Menunggu 3 detik sebelum retry...`);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  // Jika semua percobaan gagal (Dead-Letter)
  currentDeployStatus.status = 'failed';
  currentDeployStatus.error = lastErrorMsg;
  console.error(`[Deploy Hook] Gagal memanggil webhook deploy setelah ${attempts} percobaan:`, lastErrorMsg);

  if (deploymentDocId && p && typeof p.update === 'function') {
    try {
      await p.update({
        collection: 'deployments',
        id: deploymentDocId,
        data: {
          status: 'failed',
          errorMessage: lastErrorMsg,
          completedAt: new Date().toISOString(),
        },
      });
    } catch (e) {}
  }

  deadLetterDeployQueue.push({
    timestamp: new Date().toISOString(),
    reason,
    error: lastErrorMsg,
    attempts,
  });

  await sendNotificationAlert(
    '[KalaWeb Build GAGAL Dimulai]',
    `Cloudflare deploy hook gagal setelah ${attempts} percobaan: <code>${lastErrorMsg}</code>\nSitus live tetap aman (Cloudflare mempertahankan deployment sebelumnya). Hubungi tim developer bila masalah berlanjut.`,
    'error'
  );
}
