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

  // Strict Preview Guard: Never execute attribution or track CAPI/GTM on preview routes (Sprint 0 - S0-01)
  if (window.location.pathname.startsWith('/preview/')) return;

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

  // 1b. Landing Page & A/B Variant Detection (Sprint 5 - P9)
  let lpContext = null;
  try {
    const path = window.location.pathname;
    const isLP = path.startsWith('/sales/') || path.startsWith('/preview/sales/') || path.startsWith('/lp/') || path.startsWith('/preview/lp/');
    if (isLP) {
      const metaSlug = document.querySelector('meta[name="kala:lp-slug"]');
      const metaVariant = document.querySelector('meta[name="kala:variant"]');
      const metaRef = document.querySelector('meta[name="kala:ref-code"]');

      let lpSlug = metaSlug ? metaSlug.getAttribute('content') : '';
      if (!lpSlug) {
        const parts = path.replace(/\/$/, '').split('/');
        lpSlug = parts[parts.length - 1];
      }

      let variant = metaVariant ? metaVariant.getAttribute('content') : '';
      if (!variant) {
        const urlParams = new URLSearchParams(window.location.search);
        variant = urlParams.get('v') || urlParams.get('variant') || (lpSlug.endsWith('-b') ? 'B' : lpSlug.endsWith('-c') ? 'C' : 'A');
      }

      const refCode = metaRef ? metaRef.getAttribute('content') : '';

      lpContext = { lpSlug, variant, refCode };
      window.__KALA_LP_CONTEXT__ = lpContext;

      // Google Tag Manager Event: landing_page_view
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'landing_page_view',
        lp_slug: lpSlug,
        variant: variant,
        ref_code: refCode,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }
  } catch (err) {
    console.debug('[KalaTracker] LP view tracking error:', err);
  }

  // Helper to get raw browser cookie (for _fbp, _fbc)
  function getRawCookie(name) {
    try {
      const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[2]) : null;
    } catch (_) {
      return null;
    }
  }

  // 1c. Server-Side PageView Beacon (CAPI Deduplication with twin eventID)
  function sendPageViewBeacon(lpCtx, activeAttr) {
    if (window.__KALA_PAGEVIEW_BEACON_SENT__) return;
    window.__KALA_PAGEVIEW_BEACON_SENT__ = true;

    try {
      const pvEventId = window.__KALA_PV_EVENT_ID__ || ('pv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8));
      window.__KALA_PV_EVENT_ID__ = pvEventId;

      const urlParams = new URLSearchParams(window.location.search);
      const fbclid = urlParams.get('fbclid') || activeAttr?.fbclid || null;
      const fbp = urlParams.get('fbp') || getRawCookie('_fbp') || null;
      const fbc = urlParams.get('fbc') || getRawCookie('_fbc') || null;

      const payload = {
        eventID: pvEventId,
        tenantId: 'default-tenant',
        landingUrl: window.location.href,
        referrer: document.referrer || null,
        fbclid,
        fbp,
        fbc,
        utm_source: urlParams.get('utm_source') || activeAttr?.utm_source || null,
        utm_medium: urlParams.get('utm_medium') || activeAttr?.utm_medium || null,
        utm_campaign: urlParams.get('utm_campaign') || activeAttr?.utm_campaign || null,
        utm_content: urlParams.get('utm_content') || activeAttr?.utm_content || null,
        utm_term: urlParams.get('utm_term') || activeAttr?.utm_term || null,
        utm_id: urlParams.get('utm_id') || activeAttr?.utm_id || null,
      };

      const endpoint = 'https://app.kalababyspa.online/api/tracking/pageview';
      const jsonStr = JSON.stringify(payload);
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([jsonStr], { type: 'text/plain;charset=UTF-8' });
        navigator.sendBeacon(endpoint, blob);
      } else if (typeof fetch === 'function') {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: jsonStr,
          keepalive: true,
          mode: 'cors',
        }).catch(() => {});
      }
    } catch (e) {
      console.debug('[KalaTracker] PageView beacon error:', e);
    }
  }

  if (lpContext) {
    const stored = loadStoredAttribution();
    const activeAttr = stored ? (stored.lastTouch || stored.firstTouch) : null;
    sendPageViewBeacon(lpContext, activeAttr);
  }

  // 1d. Evaluasi apakah tombol WhatsApp dialihkan ke Meta CAPI Gateway (/cta) atau langsung Direct WA
  function shouldRouteViaCta(btn, lpCtx, activeAttr) {
    // 1. Pengaturan eksplisit pada komponen tombol (data-use-capi="true" atau "false")
    const explicitCapi = btn.getAttribute('data-use-capi');
    if (explicitCapi === 'false' || explicitCapi === '0') return false;
    if (explicitCapi === 'true' || explicitCapi === '1') return true;

    // 2. Landing Page iklan (/sales/*, /lp/*) selalu menggunakan CAPI gateway
    if (lpCtx) return true;

    // 3. Pengaturan meta level halaman (<meta name="kala:use-capi" content="true">)
    const metaCapi = document.querySelector('meta[name="kala:use-capi"]');
    if (metaCapi && metaCapi.getAttribute('content') === 'true') return true;

    // 4. Enrich data: pengunjung yang memiliki parameter kampanye / ad click / bio IG (fbclid, gclid, utm_source, utm_campaign)
    // Tetap ditangkap via gateway untuk memperkaya analitik atribusi
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const hasIncomingAttr = !!(
        urlParams.get('fbclid') ||
        urlParams.get('gclid') ||
        urlParams.get('utm_source') ||
        urlParams.get('utm_campaign') ||
        activeAttr?.fbclid ||
        activeAttr?.gclid ||
        activeAttr?.utm_source ||
        activeAttr?.utm_campaign
      );
      if (hasIncomingAttr) return true;
    } catch (_) {}

    // Default: langsung ke Direct WhatsApp (bukan via gateway) untuk pengunjung organik umum
    return false;
  }

  function cleanLeadMessage(rawMsg) {
    let msg = rawMsg || 'Halo Bu Bidan, saya mau reservasi homecare';
    msg = msg.replace(/^Halo Bidan Kala/i, 'Halo Bu Bidan');
    msg = msg.replace(/\s*\[ref:\s*[^\]]+\]/gi, '').trim();
    // Sanitasi tag promo lama/statis agar tidak bertumpuk
    msg = msg.replace(/^(?:Promo\s*)?\[\s*[\w\s-]{2,32}?\s*\]\s*/i, '').trim();
    return msg;
  }

  function buildDirectWaUrl(btn) {
    const phone = btn.getAttribute('data-phone') || '6285794210526';
    const cleanPhone = phone.replace(/\D/g, '');
    const baseMsg = cleanLeadMessage(btn.getAttribute('data-base-msg'));
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(baseMsg)}`;
  }

  // CTA Gateway URL Builder (Bridges to wa-clinic-bot /cta & Meta CAPI)
  function buildCtaGatewayUrl(btn, lpCtx, activeAttr) {
    const refCode = btn.getAttribute('data-ref-code') || (lpCtx?.refCode) || 'LP-BABYMASSAGE-PROMO';
    let lpSlug = btn.getAttribute('data-cta-slug') || (lpCtx?.lpSlug) || 'baby-massage';
    if (lpSlug === 'babyMassage') lpSlug = 'baby-massage';

    const baseMsg = cleanLeadMessage(btn.getAttribute('data-base-msg'));

    try {
      const ctaUrl = new URL('https://app.kalababyspa.online/cta');
      ctaUrl.searchParams.set('slug', lpSlug);
      ctaUrl.searchParams.set('msg', baseMsg);
      ctaUrl.searchParams.set('refCode', refCode);
      ctaUrl.searchParams.set('landing_url', window.location.href);

      const urlParams = new URLSearchParams(window.location.search);
      const fbclid = urlParams.get('fbclid') || activeAttr?.fbclid;
      if (fbclid) ctaUrl.searchParams.set('fbclid', fbclid);

      const fbp = urlParams.get('fbp') || getRawCookie('_fbp');
      if (fbp) ctaUrl.searchParams.set('fbp', fbp);

      const fbc = urlParams.get('fbc') || getRawCookie('_fbc');
      if (fbc) ctaUrl.searchParams.set('fbc', fbc);

      const trackedKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'gclid', 'ttclid'];
      trackedKeys.forEach((key) => {
        const val = urlParams.get(key) || activeAttr?.[key];
        if (val) ctaUrl.searchParams.set(key, val);
      });

      return ctaUrl.toString();
    } catch (_) {
      return buildDirectWaUrl(btn);
    }
  }

  function updateAllCtaButtons() {
    try {
      const stored = loadStoredAttribution();
      const activeAttr = stored ? (stored.lastTouch || stored.firstTouch) : null;
      const buttons = document.querySelectorAll('.kala-wa-btn');
      buttons.forEach((btn) => {
        if (shouldRouteViaCta(btn, lpContext, activeAttr)) {
          const gatewayUrl = buildCtaGatewayUrl(btn, lpContext, activeAttr);
          btn.setAttribute('href', gatewayUrl);
          btn.setAttribute('data-cta-gateway-applied', '1');
        } else {
          const directUrl = buildDirectWaUrl(btn);
          btn.setAttribute('href', directUrl);
          btn.setAttribute('data-cta-gateway-applied', '0');
        }
      });
    } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAllCtaButtons);
  } else {
    updateAllCtaButtons();
  }

  if (typeof window.MutationObserver === 'function') {
    let obsTimer = null;
    const observer = new MutationObserver(() => {
      if (obsTimer) return;
      obsTimer = setTimeout(() => {
        obsTimer = null;
        updateAllCtaButtons();
      }, 250);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
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

    const refCode = btn.getAttribute('data-ref-code') || (lpContext?.refCode) || 'KALA-GEN';
    let baseMsg = btn.getAttribute('data-base-msg') || 'Halo Bu Bidan, saya mau reservasi homecare';
    const phone = btn.getAttribute('data-phone') || '6285794210526';

    try {
      const stored = loadStoredAttribution();
      const activeAttr = stored ? (stored.lastTouch || stored.firstTouch) : null;

      // Clean message: human-friendly greeting & remove robotic tracking tags from visible WhatsApp text
      baseMsg = cleanLeadMessage(baseMsg);

      // Microsoft Clarity Event
      if (typeof window.clarity === 'function') {
        window.clarity('event', 'lead_whatsapp_click');
      }

      // Custom window event for general observers
      window.dispatchEvent(
        new CustomEvent('kala_lead_whatsapp', {
          detail: {
            refCode,
            message: baseMsg,
            lpSlug: lpContext?.lpSlug,
            variant: lpContext?.variant,
          },
        })
      );

      // Google Tag Manager dataLayer push (Analytics & Meta Pixel track invisibly in background)
      window.dataLayer = window.dataLayer || [];

      // Event 1: whatsapp_lead (standard GA4 lead event with campaign & A/B variant breakdown)
      window.dataLayer.push({
        event: 'whatsapp_lead',
        event_category: 'Conversion',
        event_label: refCode,
        whatsapp_ref_code: refCode,
        lp_slug: lpContext?.lpSlug || undefined,
        variant: lpContext?.variant || undefined,
        page_location: window.location.href,
        utm_source: activeAttr?.utm_source || undefined,
        utm_medium: activeAttr?.utm_medium || undefined,
        utm_campaign: activeAttr?.utm_campaign || undefined,
        fbclid: activeAttr?.fbclid || undefined,
        gclid: activeAttr?.gclid || undefined,
      });

      // Event 2: whatsapp_contact (Meta Pixel InitiateContact / Contact)
      window.dataLayer.push({
        event: 'whatsapp_contact',
        event_category: 'Contact',
        event_label: refCode,
        lp_slug: lpContext?.lpSlug || undefined,
        variant: lpContext?.variant || undefined,
      });

      // Native Direct Pixel Events (in addition to or fallback if GTM tag is unconfigured)
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Contact', {
          content_name: 'WhatsApp Contact',
          content_category: refCode,
          variant: lpContext?.variant || undefined,
        });
      }

      if (typeof window.ttq === 'object' && typeof window.ttq.track === 'function') {
        window.ttq.track('Contact', {
          content_name: 'WhatsApp Contact',
          content_id: refCode,
        });
      }

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'Contact',
          event_label: refCode,
        });
      }

      // Dynamically attach final CTA URL (Routes via bot /cta gateway for Meta CAPI attribution)
      const finalUrl = buildCtaGatewayUrl(btn, lpContext, activeAttr);
      btn.setAttribute('href', finalUrl);
    } catch (err) {
      console.debug('[KalaTracker] Click handler error:', err);
    }
  });

  // 3. Scroll Depth Tracking (25%, 50%, 75%, 90%) with rAF throttling
  const scrollMilestones = [25, 50, 75, 90];
  const trackedMilestones = new Set();
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        if (scrollY > 50) {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (scrollHeight > 0) {
            const scrollPercent = Math.round((scrollY / scrollHeight) * 100);
            scrollMilestones.forEach((milestone) => {
              if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                trackedMilestones.add(milestone);
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  event: 'scroll_depth',
                  scroll_depth_threshold: milestone,
                  page_path: window.location.pathname,
                  lp_slug: lpContext?.lpSlug || undefined,
                  variant: lpContext?.variant || undefined,
                });
              }
            });
          }
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
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
        lp_slug: lpContext?.lpSlug || undefined,
        variant: lpContext?.variant || undefined,
      });
    }
  });
})();
