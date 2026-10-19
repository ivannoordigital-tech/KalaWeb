/**
 * Kala Web Attribution & WhatsApp Click Tracker
 * Automatically captures UTM parameters and fbclid, attaching them to WhatsApp reference links.
 */
(function initKalaTracker() {
  if (typeof window === 'undefined') return;

  const STORAGE_KEY = 'kala_attribution_data';

  // 1. Capture and store UTM & fbclid parameters on first visit
  try {
    const params = new URLSearchParams(window.location.search);
    const attributionData = {};
    const trackedKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
    
    let hasNewData = false;
    trackedKeys.forEach((key) => {
      const val = params.get(key);
      if (val) {
        attributionData[key] = val;
        hasNewData = true;
      }
    });

    if (hasNewData) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attributionData));
    }
  } catch (err) {
    console.debug('[KalaTracker] Attribution storage error:', err);
  }

  // 2. Delegate WhatsApp button clicks to append attribution and dispatch analytics
  document.addEventListener('click', (e) => {
    const target = e.target;
    const btn = target.closest ? target.closest('.kala-wa-btn') : null;
    if (!btn) return;

    const refCode = btn.getAttribute('data-ref-code') || 'KALA-GEN';
    let baseMsg = btn.getAttribute('data-base-msg') || 'Halo Bidan Kala, saya mau reservasi homecare';
    const phone = btn.getAttribute('data-phone') || '6281234567890';

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const attributionTags = [];
        if (parsed.utm_source) attributionTags.push(`src:${parsed.utm_source}`);
        if (parsed.utm_campaign) attributionTags.push(`cmp:${parsed.utm_campaign}`);
        if (parsed.fbclid) attributionTags.push(`fb:${parsed.fbclid.substring(0, 8)}`);

        if (attributionTags.length > 0 && !baseMsg.includes('|')) {
          // Replace [ref: XXX] with [ref: XXX | src:meta cmp:spring]
          baseMsg = baseMsg.replace(
            new RegExp(`\\[ref:\\s*${refCode}\\]`, 'g'),
            `[ref: ${refCode} | ${attributionTags.join(' ')}]`
          );
        }
      }

      // Track lead event
      if (typeof window.clarity === 'function') {
        window.clarity('event', 'lead_whatsapp_click');
      }

      // Custom window event for other third-party tags
      window.dispatchEvent(
        new CustomEvent('kala_lead_whatsapp', {
          detail: { refCode, message: baseMsg },
        })
      );

      // Update href dynamically right before navigation
      const finalUrl = `https://wa.me/${phone}?text=${encodeURIComponent(baseMsg)}`;
      btn.setAttribute('href', finalUrl);
    } catch (err) {
      console.debug('[KalaTracker] Click handler error:', err);
    }
  });
})();
