'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Tablet, Monitor, RotateCw, ExternalLink } from 'lucide-react';

interface PreviewFrameProps {
  collection: 'landing-pages' | 'pages';
  docId?: string | number;
  slug?: string;
  hasUnsavedChanges: boolean;
  selectedSectionId?: string | null;
  onSelectFromIframe?: (sectionId: string) => void;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  collection,
  docId,
  slug,
  hasUnsavedChanges,
  selectedSectionId,
  onSelectFromIframe,
}) => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch signed preview token from CMS
  const fetchToken = async () => {
    if (!docId) {
      setError('Simpan draft terlebih dahulu untuk mengaktifkan preview visual.');
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
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, [docId, collection]);

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
        '*',
      );
    } catch {}
  }, [selectedSectionId]);

  // Listen for messages from iframe inspector
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'KALA_INSPECTOR_READY') {
        if (selectedSectionId && iframeRef.current?.contentWindow) {
          try {
            iframeRef.current.contentWindow.postMessage(
              {
                type: 'KALA_SELECT_SECTION',
                sectionId: selectedSectionId,
                scroll: false,
              },
              '*',
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
  }, [onSelectFromIframe, selectedSectionId]);

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
              device === 'desktop' ? 'bg-white shadow-xs text-teal-800' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Desktop (100% Fluid)"
          >
            <Monitor size={14} />
            <span className="hidden sm:inline text-[11px]">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
              device === 'tablet' ? 'bg-white shadow-xs text-teal-800' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Tablet (768px)"
          >
            <Tablet size={14} />
            <span className="hidden sm:inline text-[11px]">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
              device === 'mobile' ? 'bg-white shadow-xs text-teal-800' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline text-[11px]">Mobile</span>
          </button>
        </div>

        {/* Status indicator & Refresh */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
              Preview = Versi Tersimpan
            </span>
          )}

          <button
            type="button"
            onClick={fetchToken}
            disabled={isLoading || !docId}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40"
            title="Muat Ulang Preview"
          >
            <RotateCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>

          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Buka di Tab Baru"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-3">
        {error ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-md text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              !
            </div>
            <h3 className="text-sm font-bold text-slate-800">Pratinjau Belum Aktif</h3>
            <p className="text-xs text-slate-500 mt-1">{error}</p>
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
            <span>Menghubungkan ke server preview...</span>
          </div>
        )}
      </div>
    </div>
  );
};
