/**
 * Kala Web Attribution & Conversion Tracker (Sprint 2 - Fase 3)
 * - 30-Day persistent attribution (localStorage + first-party cookie fallback)
 * - In-app browser compatibility (Instagram & Facebook Webview)
 * - First-touch & Last-touch multi-touch tracking
 * - Double-click debounce prevention
 * - Google Tag Manager (dataLayer) events: whatsapp_lead, whatsapp_contact (InitiateContact), scroll_depth, faq_open
 * - Privacy-safe: zero sensitive medical data transmitted
 */

(function initKalaTracker() {
  if (typeof window === 'undefined') return;

  const STORAGE_KEY = 'kala_attribution_30d';
  const COOKIE_NAME = 'kala_attr_v2';
  const EXPIRY_DAYS = 30;

  // Helper: Set Cookie
  function setCookie(name, value, days) {
    try {
      const d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = 'expires=' + d.toUTCString();
      document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};${expires};path=/;SameSite=Lax`;
    } catch (e) {}
  }

  // Helper: Get Cookie
  function getCookie(name) {
    try {
      const cname = name + '=';
      const decoded = decodeURIComponent(document.cookie);
      const parts = decoded.split(';');
      for (let i = 0; i < parts.length; i++) {
        let c = parts[i].trim();
        if (c.indexOf(cname) === 0) {
          return JSON.parse(c.substring(cname.length));
        }
      }
    } catch (e) {}
    return null;
  }

  // Helper: Load persistent storage
  function loadStoredAttribution() {
    try {
      const rawLocal = localStorage.getItem(STORAGE_KEY);
      if (rawLocal) {
        const parsed = JSON.parse(rawLocal);
        // Check if not expired (30 days)
        if (Date.now() - (parsed.lastUpdated || 0) < EXPIRY_DAYS * 24 * 60 * 60 * 1000) {
          return parsed;
        }
      }
    } catch (e) {}

    // Fallback to cookie (useful in certain mobile in-app browsers)
    return getCookie(COOKIE_NAME);
  }

  // Helper: Save persistent storage
  function saveAttribution(data) {
    try {
      data.lastUpdated = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setCookie(COOKIE_NAME, data, EXPIRY_DAYS);
    } catch (e) {}
  }

  // 1. Capture and store UTM & Ad Click IDs (First-touch & Last-touch)
  try {
    const params = new URLSearchParams(window.location.search);
    const trackedKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
    const currentParams = {};
    let hasNewCampaign = false;

    trackedKeys.forEach((key) => {
      const val = params.get(key);
      if (val) {
        currentParams[key] = val;
        hasNewCampaign = true;
      }
    });

    const stored = loadStoredAttribution() || { firstTouch: null, lastTouch: null };

    if (hasNewCampaign) {
      currentParams.timestamp = new Date().toISOString();
      if (!stored.firstTouch) {
        stored.firstTouch = currentParams;
      }
      stored.lastTouch = currentParams;
      saveAttribution(stored);
    }
  } catch (err) {
    console.debug('[KalaTracker] Attribution capture error:', err);
  }

  // 2. Delegate WhatsApp button clicks with debounce and conversion tracking
  let isClickProcessing = false;

  document.addEventListener('click', (e) => {
    const target = e.target;
    const btn = target.closest ? target.closest('.kala-wa-btn') : null;
    if (!btn) return;

    // Prevent burst double-clicks
    if (isClickProcessing) {
      e.preventDefault();
      return;
    }
    isClickProcessing = true;
    setTimeout(() => { isClickProcessing = false; }, 1500);

    const refCode = btn.getAttribute('data-ref-code') || 'KALA-GEN';
    let baseMsg = btn.getAttribute('data-base-msg') || 'Halo Bidan Kala, saya mau reservasi homecare';
    const phone = btn.getAttribute('data-phone') || '6281234567890';

    try {
      const stored = loadStoredAttribution();
      const activeAttr = stored ? (stored.lastTouch || stored.firstTouch) : null;

      if (activeAttr) {
        const attributionTags = [];
        if (activeAttr.utm_source) attributionTags.push(`src:${activeAttr.utm_source}`);
        if (activeAttr.utm_campaign) attributionTags.push(`cmp:${activeAttr.utm_campaign}`);
        if (activeAttr.fbclid) attributionTags.push(`fb:${activeAttr.fbclid.substring(0, 8)}`);
        if (activeAttr.gclid) attributionTags.push(`g:${activeAttr.gclid.substring(0, 8)}`);

        if (attributionTags.length > 0 && !baseMsg.includes('|')) {
          baseMsg = baseMsg.replace(
            new RegExp(`\\[ref:\\s*${refCode}\\]`, 'g'),
            `[ref: ${refCode} | ${attributionTags.join(' ')}]`
          );
        }
      }

      // Microsoft Clarity Event
      if (typeof window.clarity === 'function') {
        window.clarity('event', 'lead_whatsapp_click');
      }

      // Custom window event for general observers
      window.dispatchEvent(
        new CustomEvent('kala_lead_whatsapp', {
          detail: { refCode, message: baseMsg },
        })
      );

      // Google Tag Manager dataLayer push
      window.dataLayer = window.dataLayer || [];

      // Event 1: whatsapp_lead (standard GA4 lead event)
      window.dataLayer.push({
        event: 'whatsapp_lead',
        event_category: 'Conversion',
        event_label: refCode,
        whatsapp_ref_code: refCode,
        page_location: window.location.href,
      });

      // Event 2: whatsapp_contact (Meta Pixel InitiateContact / Contact)
      window.dataLayer.push({
        event: 'whatsapp_contact',
        event_category: 'Contact',
        event_label: refCode,
      });

      // Dynamically attach final wa.me url
      const finalUrl = `https://wa.me/${phone}?text=${encodeURIComponent(baseMsg)}`;
      btn.setAttribute('href', finalUrl);
    } catch (err) {
      console.debug('[KalaTracker] Click handler error:', err);
    }
  });

  // 3. Scroll Depth Tracking (25%, 50%, 75%, 90%)
  const scrollMilestones = [25, 50, 75, 90];
  const trackedMilestones = new Set();

  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

    scrollMilestones.forEach((milestone) => {
      if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
        trackedMilestones.add(milestone);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'scroll_depth',
          scroll_depth_threshold: milestone,
          page_path: window.location.pathname,
        });
      }
    });
  }, { passive: true });

  // 4. FAQ / Accordion Interaction Tracking
  document.addEventListener('click', (e) => {
    const summary = e.target.closest ? e.target.closest('summary.kala-faq-summary') : null;
    if (summary) {
      const qText = summary.innerText || 'FAQ';
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'faq_open',
        faq_question: qText.substring(0, 100),
      });
    }
  });
})();
