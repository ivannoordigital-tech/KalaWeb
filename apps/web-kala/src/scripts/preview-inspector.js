/**
 * Kala Web Landing Page Builder - Canvas Inspector Script
 * Runs only inside preview iframe to provide visual selection & two-way synchronization
 */
(function () {
  // Guard: Only activate when embedded inside an iframe
  if (typeof window === 'undefined' || window.self === window.top) {
    return;
  }

  // Inject inspector styles
  const STYLE_ID = 'kala-builder-inspector-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      [data-kala-section-id] {
        position: relative !important;
        transition: outline 0.15s ease, box-shadow 0.15s ease;
      }
      [data-kala-section-id]:hover {
        outline: 2px dashed rgba(13, 148, 136, 0.45) !important;
        outline-offset: -2px;
        cursor: pointer !important;
      }
      [data-kala-section-id].kala-section-hovered {
        outline: 2px dashed #0d9488 !important;
        outline-offset: -2px;
      }
      [data-kala-section-id].kala-section-selected {
        outline: 3px solid #0d9488 !important;
        outline-offset: -3px;
        box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.15) !important;
      }
      [data-kala-section-id].kala-section-selected::before {
        content: attr(data-kala-block-type);
        position: absolute;
        top: 0;
        left: 0;
        background-color: #0d9488;
        color: #ffffff;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.025em;
        padding: 3px 10px;
        border-bottom-right-radius: 6px;
        z-index: 999999;
        pointer-events: none;
        text-transform: capitalize;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      }
      [data-kala-disabled="true"] {
        opacity: 0.45 !important;
        filter: grayscale(0.7) !important;
      }
    `;
    document.head.appendChild(style);
  }

  function clearSelection() {
    document.querySelectorAll('.kala-section-selected').forEach((el) => {
      el.classList.remove('kala-section-selected');
    });
  }

  function selectElement(el, smoothScroll = false) {
    clearSelection();
    if (!el) return;
    el.classList.add('kala-section-selected');
    if (smoothScroll) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Intercept click on any section within the canvas
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const sectionEl = target.closest('[data-kala-section-id]');
      if (!sectionEl) return;

      // Prevent link jumps, form submits, or default actions while in customizer mode
      e.preventDefault();
      e.stopPropagation();

      const sectionId = sectionEl.getAttribute('data-kala-section-id');
      const blockType = sectionEl.getAttribute('data-kala-block-type');

      selectElement(sectionEl, false);

      try {
        window.parent.postMessage(
          {
            type: 'KALA_INSPECTOR_SELECT',
            sectionId,
            blockType,
          },
          '*',
        );
      } catch (err) {
        console.warn('[Builder Inspector] Failed to postMessage:', err);
      }
    },
    true, // Capture phase to prevent inner handlers
  );

  // Listen for messages from builder parent window
  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'KALA_SELECT_SECTION') {
      const { sectionId, scroll } = data;
      if (!sectionId) {
        clearSelection();
        return;
      }
      const targetEl = document.querySelector(`[data-kala-section-id="${sectionId}"]`);
      if (targetEl) {
        selectElement(targetEl, scroll !== false);
      }
    }

    if (data.type === 'KALA_HOVER_SECTION') {
      const { sectionId, hover } = data;
      const targetEl = document.querySelector(`[data-kala-section-id="${sectionId}"]`);
      if (targetEl) {
        if (hover) {
          targetEl.classList.add('kala-section-hovered');
        } else {
          targetEl.classList.remove('kala-section-hovered');
        }
      }
    }
  });

  // Signal parent that inspector is initialized
  try {
    window.parent.postMessage({ type: 'KALA_INSPECTOR_READY' }, '*');
  } catch {}
})();
