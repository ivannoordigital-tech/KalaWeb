/**
 * Cloudflare Pages Deploy Hook Trigger with Debounce and Status Check
 * Prevents build storms, race conditions, and unnecessary builds during drafts/autosaves.
 */

let lastTriggerTime = 0;
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY_MS = 60000; // 60 seconds debounce window

export interface TriggerOptions {
  resource: string;
  action: 'publish' | 'unpublish' | 'delete' | 'update_settings';
  slug?: string;
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
      executeDeploy(hookUrl, `Deferred (Debounced): ${reason}`);
    }, DEBOUNCE_DELAY_MS - timeSinceLast);

    return;
  }

  // Add 2.5s safe delay to ensure database transaction is fully committed before Cloudflare starts pulling data
  console.log(`[Deploy Hook] Triggering build in 2.5s for: ${reason}`);
  setTimeout(() => {
    executeDeploy(hookUrl, reason);
  }, 2500);
}

async function executeDeploy(hookUrl: string, reason: string): Promise<void> {
  lastTriggerTime = Date.now();
  try {
    const response = await fetch(hookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, timestamp: new Date().toISOString() }),
    });

    if (response.ok) {
      console.log(`[Deploy Hook] Cloudflare Pages build triggered successfully! Reason: ${reason} (Status ${response.status})`);
    } else {
      console.error(`[Deploy Hook] Cloudflare returned error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`[Deploy Hook] Failed to send deploy webhook:`, (error as Error).message);
  }
}
