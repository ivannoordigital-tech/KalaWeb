'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Smartphone, Tablet, Monitor, RotateCw, ExternalLink } from 'lucide-react';

interface PreviewFrameProps {
  collection: 'landing-pages' | 'pages';
  docId?: string | number;
  slug?: string;
  hasUnsavedChanges: boolean;
  selectedSectionId?: string | null;
  onSelectFromIframe?: (sectionId: string) => void;
  lastSaved?: number;
  onSaveDraft?: () => Promise<boolean>;
  isSavingDraft?: boolean;
  canSaveDraft?: boolean;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  collection,
  docId,
  slug,
  hasUnsavedChanges,
  selectedSectionId,
  onSelectFromIframe,
  lastSaved,
  onSaveDraft,
  isSavingDraft,
  canSaveDraft,
}) => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Compute allowed origin from previewUrl
  const previewOrigin = useMemo(() => {
    if (!previewUrl) return null;
    try {
      return new URL(previewUrl).origin;
    } catch {
      return null;
    }
  }, [previewUrl]);

  // Fetch signed preview token from CMS
  const fetchToken = useCallback(async () => {
    if (!docId) {
      setPreviewUrl(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/preview-token?collection=${collection}&id=${docId}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}: Gagal memuat token pratinjau`);
      }
      const data = await res.json();
      setPreviewUrl(`${data.url}&v=${Date.now()}`);

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setLastRefreshTime(`${hh}:${mm}:${ss}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [collection, docId]);

  // Initial load
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Auto-refresh when document is saved in CMS
  useEffect(() => {
    if (lastSaved && docId) {
      fetchToken();
    }
  }, [lastSaved, docId, fetchToken]);

  // Auto-refresh before 15m JWT expires (at 14 minutes)
  useEffect(() => {
    if (!docId) return;
    const interval = setInterval(() => {
      fetchToken();
    }, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, [docId, fetchToken]);

  // Notify iframe whenever selectedSectionId changes
  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'KALA_SELECT_SECTION',
          sectionId: selectedSectionId,
          scroll: true,
        },
        previewOrigin || '*',
      );
    } catch {}
  }, [selectedSectionId, previewOrigin]);

  // Listen for messages from iframe inspector with strict origin and source checks
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;
      if (iframeRef.current && event.source !== iframeRef.current.contentWindow) return;
      if (previewOrigin && event.origin !== previewOrigin) return;

      if (event.data.type === 'KALA_INSPECTOR_READY') {
        if (selectedSectionId && iframeRef.current?.contentWindow) {
          try {
            iframeRef.current.contentWindow.postMessage(
              {
                type: 'KALA_SELECT_SECTION',
                sectionId: selectedSectionId,
                scroll: false,
              },
              previewOrigin || '*',
            );
          } catch {}
        }
      }

      if (event.data.type === 'KALA_INSPECTOR_SELECT' && event.data.sectionId) {
        onSelectFromIframe?.(event.data.sectionId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSelectFromIframe, selectedSectionId, previewOrigin]);

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      case 'desktop':
      default:
        return '100%';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/80">
      {/* Top Controls Bar */}
      <div className="h-11 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
              device === 'desktop' ? 'bg-white shadow-sm text-teal-800' : 'text-slate-600 hover:text-slate-800'
            }`}
            title="Desktop (100% Fluid)"
            aria-label="Tampilan desktop"
          >
            <Monitor size={14} />
            <span className="hidden sm:inline text-[11px]">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
              device === 'tablet' ? 'bg-white shadow-sm text-teal-800' : 'text-slate-600 hover:text-slate-800'
            }`}
            title="Tablet (768px)"
            aria-label="Tampilan tablet"
          >
            <Tablet size={14} />
            <span className="hidden sm:inline text-[11px]">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
              device === 'mobile' ? 'bg-white shadow-sm text-teal-800' : 'text-slate-600 hover:text-slate-800'
            }`}
            title="Mobile (375px)"
            aria-label="Tampilan ponsel"
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline text-[11px]">Mobile</span>
          </button>
        </div>

        {/* Status indicator & Refresh */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges ? (
            <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
              Pratinjau = versi tersimpan
            </span>
          ) : lastRefreshTime ? (
            <span className="text-[11px] text-slate-600 font-mono hidden sm:inline">
              Diperbarui {lastRefreshTime}
            </span>
          ) : null}

          <button
            type="button"
            onClick={fetchToken}
            disabled={isLoading || !docId}
            className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
            title="Muat Ulang Pratinjau"
            aria-label="Muat ulang pratinjau"
          >
            <RotateCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>

          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Buka di Tab Baru"
              aria-label="Buka pratinjau di tab baru"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-3">
        {!docId ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-md text-center">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-3">
              <Monitor size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Pratinjau belum aktif</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Halaman ini belum punya versi tersimpan, jadi belum ada yang bisa dipratinjau.
              Simpan draf terlebih dahulu — halaman akan dimuat ulang, lalu buka builder kembali.
            </p>

            {canSaveDraft && (
              <button
                type="button"
                disabled={isSavingDraft}
                onClick={() => void onSaveDraft?.()}
                className="mt-4 w-full rounded-lg bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 disabled:opacity-60 cursor-pointer transition-all"
              >
                {isSavingDraft ? 'Menyimpan…' : 'Simpan Draf & Muat Ulang'}
              </button>
            )}

            <p className="mt-2 text-[11px] text-slate-400">
              Tidak ada autosave. Perubahan hanya tersimpan saat Anda menekan tombol simpan.
            </p>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-md text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              !
            </div>
            <h3 className="text-sm font-bold text-slate-800">Pratinjau gagal dimuat</h3>
            <p className="text-xs text-slate-600 mt-1">{error}</p>
            <button
              type="button"
              onClick={fetchToken}
              className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        ) : previewUrl ? (
          <div
            style={{ width: getContainerWidth() }}
            className="h-full bg-white rounded-lg shadow-lg border border-slate-300 overflow-hidden transition-all duration-200 flex flex-col"
          >
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-none"
              title="KalaWeb Landing Page Preview"
            />
          </div>
        ) : (
          <div className="text-slate-400 text-xs flex items-center gap-2">
            <RotateCw size={16} className="animate-spin text-teal-600" />
            <span>Menghubungkan ke pratinjau…</span>
          </div>
        )}
      </div>
    </div>
  );
};
