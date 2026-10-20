/**
 * Cloudflare Pages Deploy Hook Trigger with Debounce, Status Tracking, and Admin Alerts
 * Prevents build storms, race conditions, and informs operational admins via Telegram/Console.
 */

let lastTriggerTime = 0;
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY_MS = 60000; // 60 seconds debounce window

export interface TriggerOptions {
  resource: string;
  action: 'publish' | 'unpublish' | 'delete' | 'update_settings';
  slug?: string;
}

export interface DeployStatus {
  status: 'idle' | 'triggered' | 'success' | 'failed';
  lastTriggeredAt?: string;
  lastCompletedAt?: string;
  lastReason?: string;
  error?: string;
}

export const currentDeployStatus: DeployStatus = {
  status: 'idle',
};

async function sendTelegramAlert(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.warn('[Deploy Hook] Failed to dispatch Telegram alert:', (err as Error).message);
  }
}

export function triggerCloudflareDeploy(options: TriggerOptions): void {
  const hookUrl = process.env.CLOUDFLARE_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    console.log(`[Deploy Hook] Skipped: CLOUDFLARE_DEPLOY_HOOK_URL not configured in environment.`);
    return;
  }

  const reason = `[${options.action.toUpperCase()}] ${options.resource}${options.slug ? ` (${options.slug})` : ''}`;
  const now = Date.now();
  const timeSinceLast = now - lastTriggerTime;

  if (timeSinceLast < DEBOUNCE_DELAY_MS) {
    console.log(`[Deploy Hook] Debounced trigger: ${reason}. A build was requested ${Math.round(timeSinceLast / 1000)}s ago. Scheduling deferred build.`);
    
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      executeDeploy(hookUrl, options, `Deferred (Debounced): ${reason}`);
    }, DEBOUNCE_DELAY_MS - timeSinceLast);

    return;
  }

  // 2.5s safe delay to ensure database transaction is fully committed before Cloudflare starts pulling data
  console.log(`[Deploy Hook] Triggering build in 2.5s for: ${reason}`);
  setTimeout(() => {
    executeDeploy(hookUrl, options, reason);
  }, 2500);
}

async function executeDeploy(hookUrl: string, options: TriggerOptions, reason: string): Promise<void> {
  lastTriggerTime = Date.now();
  currentDeployStatus.status = 'triggered';
  currentDeployStatus.lastTriggeredAt = new Date().toISOString();
  currentDeployStatus.lastReason = reason;

  const targetUrl = options.resource === 'LandingPages' && options.slug
    ? `https://kalababyspa.com/lp/${options.slug}`
    : options.resource === 'Pages' && options.slug
      ? `https://kalababyspa.com/${options.slug}`
      : 'https://kalababyspa.com';

  await sendTelegramAlert(
    `🚀 <b>[KalaWeb Build Dimulai]</b>\n` +
    `Perubahan konten sedang diproses: <code>${reason}</code>\n` +
    `Situs akan ter-update di ${targetUrl} dalam ~1–2 menit.`
  );

  try {
    const response = await fetch(hookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, timestamp: new Date().toISOString() }),
    });

    if (response.ok) {
      currentDeployStatus.status = 'success';
      currentDeployStatus.lastCompletedAt = new Date().toISOString();
      console.log(`[Deploy Hook] Cloudflare Pages build triggered successfully! Reason: ${reason} (Status ${response.status})`);

      const liveMessage = options.resource === 'LandingPages' && options.slug
        ? `✅ <b>[KalaWeb Sudah Live]</b>\nLP <code>/lp/${options.slug}</code> sudah live!\n🌐 Kunjungi: ${targetUrl}`
        : `✅ <b>[KalaWeb Sudah Live]</b>\nPerubahan <code>${reason}</code> berhasil diproses oleh Cloudflare Pages!\n🌐 Kunjungi: ${targetUrl}`;

      await sendTelegramAlert(liveMessage);
    } else {
      currentDeployStatus.status = 'failed';
      currentDeployStatus.error = `HTTP ${response.status}: ${response.statusText}`;
      console.error(`[Deploy Hook] Cloudflare returned error: ${response.status} ${response.statusText}`);

      await sendTelegramAlert(
        `❌ <b>[KalaWeb Build GAGAL]</b>\n` +
        `Cloudflare merespons status error: <code>${response.status} ${response.statusText}</code>\n` +
        `Situs live tetap aman (Cloudflare mempertahankan deployment sebelumnya). Hubungi tim developer bila masalah berlanjut.`
      );
    }
  } catch (error) {
    const msg = (error as Error).message;
    currentDeployStatus.status = 'failed';
    currentDeployStatus.error = msg;
    console.error(`[Deploy Hook] Failed to send deploy webhook:`, msg);

    await sendTelegramAlert(
      `❌ <b>[KalaWeb Build Network Error]</b>\n` +
      `Gagal menghubungi webhook Cloudflare: <code>${msg}</code>`
    );
  }
}
