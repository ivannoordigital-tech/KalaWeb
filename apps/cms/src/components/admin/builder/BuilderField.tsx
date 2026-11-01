'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useForm, useFormFields, useDocumentInfo, useFormModified } from '@payloadcms/ui';
import {
  Undo2,
  Redo2,
  X,
  Sparkles,
  Layers,
  Sliders,
  ExternalLink,
  Save,
  Rocket,
  Loader2,
} from 'lucide-react';
import { SectionTree } from './SectionTree';
import { SectionSettings } from './SectionSettings';
import { AddSectionMenu } from './AddSectionMenu';
import { PreviewFrame } from './PreviewFrame';
import { useBuilderLayout, type LayoutBlock } from './useBuilderLayout';
import { useBuilderHistory } from './useBuilderHistory';
import { useBuilderSave } from './useBuilderSave';
import { BuilderValidationBanner } from './BuilderValidationBanner';
import { useFocusTrap } from './useFocusTrap';

export const BuilderField: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);

  const { dispatchFields, setModified } = useForm();
  const docInfo = useDocumentInfo();
  const modified = useFormModified();
  const {
    save,
    isSaving,
    intent: saveIntent,
    error: saveError,
    lastSavedAt,
    canSave,
    canPublish,
  } = useBuilderSave();

  useFocusTrap(portalRef, isOpen);

  // Read current layout from Payload Form State
  const rawLayout = useFormFields(([fields]) => fields?.layout?.value);
  const title = (useFormFields(([fields]) => fields?.title?.value) as string) || 'Halaman Baru';
  const slug = (useFormFields(([fields]) => fields?.slug?.value) as string) || '';
  const status = (useFormFields(([fields]) => fields?._status?.value) as string) || 'draft';

  const layout: LayoutBlock[] = useMemo(() => {
    return Array.isArray(rawLayout) ? (rawLayout as LayoutBlock[]) : [];
  }, [rawLayout]);

  // Synchronize state back to Payload Form State
  const updatePayloadLayout = useCallback(
    (newLayout: LayoutBlock[]) => {
      setModified(true);
      dispatchFields({
        type: 'UPDATE',
        path: 'layout',
        value: newLayout,
      });
    },
    [dispatchFields, setModified],
  );

  // Undo / Redo history
  const { canUndo, canRedo, pushSnapshot, undo, redo, resetHistory } =
    useBuilderHistory<LayoutBlock[]>(layout, (restoredLayout) => {
      setModified(true);
      dispatchFields({
        type: 'UPDATE',
        path: 'layout',
        value: restoredLayout,
      });
    });

  // Reset history when document is saved in Payload
  const lastUpdateTime = (docInfo as any)?.lastUpdateTime;
  useEffect(() => {
    if (docInfo?.id) {
      resetHistory();
    }
  }, [docInfo?.id, lastUpdateTime, resetHistory]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Layout mutation methods
  const {
    addSection,
    removeSection,
    duplicateSection,
    toggleDisabled,
    updateSection,
    reorderSections,
    addInnerItem,
    removeInnerItem,
    updateInnerItem,
    applyTemplate,
  } = useBuilderLayout(layout, updatePayloadLayout, pushSnapshot);

  const selectedBlock = useMemo(() => {
    if (!selectedSectionId) return null;
    return layout.find((b) => (b.id || b.blockType) === selectedSectionId) || null;
  }, [layout, selectedSectionId]);

  // Keyboard shortcut listener (Ctrl/Cmd+S, Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        e.stopPropagation();
        if (!isSaving && canSave) void save('draft');
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) redo(layout);
        } else {
          if (canUndo) undo(layout);
        }
      } else if (e.key === 'Escape') {
        if (isAddMenuOpen) {
          setIsAddMenuOpen(false);
        } else if (showCloseConfirm) {
          setShowCloseConfirm(false);
        } else if (selectedSectionId) {
          setSelectedSectionId(null);
        } else if (modified) {
          setShowCloseConfirm(true);
        } else {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    isAddMenuOpen,
    showCloseConfirm,
    selectedSectionId,
    canUndo,
    canRedo,
    undo,
    redo,
    layout,
    isSaving,
    canSave,
    save,
    modified,
  ]);

  const collectionSlug = (docInfo?.collectionSlug as 'landing-pages' | 'pages') || 'landing-pages';

  // Card displayed inside native Payload edit form
  const inFormCard = (
    <div
      className="kala-builder-in-card my-4 p-5 rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50/80 via-white to-amber-50/50 shadow-sm"
      style={{
        margin: '1.25rem 0',
        padding: '1.25rem',
        borderRadius: '0.75rem',
        border: '1px solid #99f6e4',
        background: 'linear-gradient(to right, rgba(240, 253, 250, 0.8), #ffffff, rgba(254, 243, 199, 0.4))',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="p-1.5 rounded-lg bg-teal-600 text-white shadow-sm inline-flex items-center justify-center"
              style={{ padding: '0.4rem', borderRadius: '0.5rem', backgroundColor: '#0d9488', color: '#fff' }}
            >
              <Sparkles size={18} />
            </span>
            <h3 className="font-bold text-sm text-slate-900" style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: '#0f172a' }}>
              Builder Visual Halaman
            </h3>
            <span
              className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full"
              style={{ fontSize: '0.75rem', backgroundColor: '#ccfbf1', color: '#115e59', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600 }}
            >
              {layout.length} Seksi Tersusun
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-xl" style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.35rem' }}>
            Susun halaman secara visual: drag-and-drop urutan seksi, ubah teks & gambar, serta lihat pratinjau live instan tanpa reload browser.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {canSave && modified && (
            <button
              type="button"
              onClick={() => void save('draft')}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-lg border border-teal-700 text-teal-800 text-xs font-bold hover:bg-teal-50 disabled:opacity-60 cursor-pointer transition-all"
            >
              {isSaving && saveIntent === 'draft' ? 'Menyimpan…' : 'Simpan Draf'}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: '#0f766e',
              color: '#fff',
              fontSize: '0.825rem',
              fontWeight: 700,
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 4px rgba(15, 118, 110, 0.25)',
            }}
          >
            <Layers size={16} />
            <span>Buka Visual Page Builder</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Fullscreen Portal Builder UI
  const portalModal =
    isOpen &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        ref={portalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Builder visual: ${title}`}
        className="kala-builder-portal fixed inset-0 z-[99999] bg-slate-900 flex flex-col font-sans select-none overflow-hidden transition-opacity duration-150"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          backgroundColor: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Narrow screen advisory banner */}
        <div className="md:hidden bg-amber-500/10 border-b border-amber-500/30 px-3 py-1.5 text-[11px] text-amber-200 text-center shrink-0">
          Layar sempit terdeteksi. Disarankan memakai laptop/desktop untuk pengalaman menyusun visual yang optimal.
        </div>

        {/* Top Navbar */}
        <header className="h-[52px] bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full bg-teal-400 motion-safe:animate-pulse shrink-0"
              aria-hidden="true"
            />
            <h1
              className="text-sm font-bold text-white truncate max-w-[150px] sm:max-w-[260px]"
              title={title}
            >
              {title}
            </h1>

            <span
              className={`text-[11px] px-2 py-0.5 rounded font-mono font-semibold uppercase shrink-0 ${
                status === 'published'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-800 text-amber-400 border border-slate-700'
              }`}
            >
              {status === 'published' ? 'Terbit' : 'Draf'}
            </span>

            <span className="hidden lg:inline text-[11px] text-slate-400" aria-live="polite">
              {isSaving
                ? saveIntent === 'publish'
                  ? 'Menerbitkan…'
                  : 'Menyimpan…'
                : modified
                ? '● Belum disimpan'
                : lastSavedAt
                ? `Tersimpan ${new Date(lastSavedAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : null}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => canUndo && undo(layout)}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Undo2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => canRedo && redo(layout)}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
              aria-label="Redo"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Redo2 size={16} />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1" aria-hidden="true" />

            {canSave && (
              <button
                type="button"
                onClick={() => void save('draft')}
                disabled={isSaving}
                className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-slate-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                aria-label="Simpan draf"
                title="Simpan Draf (Ctrl+S)"
              >
                {isSaving && saveIntent === 'draft' ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                <span className="hidden sm:inline">Simpan Draf</span>
              </button>
            )}

            {canPublish && (
              <button
                type="button"
                onClick={() => void save('publish')}
                disabled={isSaving}
                className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
                aria-label={docInfo?.hasPublishedDoc ? 'Terbitkan perubahan' : 'Terbitkan'}
              >
                {isSaving && saveIntent === 'publish' ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Rocket size={15} />
                )}
                <span className="hidden sm:inline">
                  {docInfo?.hasPublishedDoc ? 'Terbitkan Perubahan' : 'Terbitkan'}
                </span>
              </button>
            )}

            <div className="h-4 w-px bg-slate-700 mx-1" aria-hidden="true" />

            <button
              type="button"
              onClick={() => (modified ? setShowCloseConfirm(true) : setIsOpen(false))}
              className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              aria-label="Tutup builder"
            >
              <X size={15} />
              <span className="hidden sm:inline">Tutup</span>
            </button>
          </div>
        </header>

        {saveError && (
          <div role="alert" className="shrink-0 bg-red-950 border-b border-red-800 px-4 py-2 text-xs text-red-200">
            {saveError}
          </div>
        )}

        <BuilderValidationBanner
          layout={layout}
          onFocusSection={(id) => setSelectedSectionId(id)}
          onOpenFormMode={() => {
            setModified(true);
            dispatchFields({ type: 'UPDATE', path: 'editorMode', value: 'form' });
            setIsOpen(false);
            setShowCloseConfirm(false);
          }}
        />

        {/* Main 2-Column Split Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar (360px on desktop) */}
          <aside className="w-full md:w-[360px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-sm">
            {selectedBlock ? (
              <SectionSettings
                block={selectedBlock}
                onBack={() => setSelectedSectionId(null)}
                onUpdate={(updates) => selectedBlock.id && updateSection(selectedBlock.id, updates)}
                onAddInnerItem={(path, defaults) =>
                  selectedBlock.id && addInnerItem(selectedBlock.id, path, defaults)
                }
                onRemoveInnerItem={(path, idx) =>
                  selectedBlock.id && removeInnerItem(selectedBlock.id, path, idx)
                }
                onUpdateInnerItem={(path, idx, fields) =>
                  selectedBlock.id && updateInnerItem(selectedBlock.id, path, idx, fields)
                }
              />
            ) : (
              <SectionTree
                layout={layout}
                selectedId={selectedSectionId}
                onSelect={(id) => setSelectedSectionId(id)}
                onReorder={reorderSections}
                onToggleDisabled={toggleDisabled}
                onDuplicate={(id) => {
                  const newId = duplicateSection(id);
                  if (newId) setSelectedSectionId(newId);
                }}
                onDelete={(id) => {
                  removeSection(id);
                  if (selectedSectionId === id) setSelectedSectionId(null);
                }}
                onOpenAddMenu={() => setIsAddMenuOpen(true)}
              />
            )}
          </aside>

          {/* Right Canvas (Live Preview Frame) */}
          <main className="flex-1 overflow-hidden hidden md:block">
            <PreviewFrame
              collection={collectionSlug}
              docId={docInfo?.id}
              slug={slug}
              hasUnsavedChanges={modified}
              selectedSectionId={selectedSectionId}
              onSelectFromIframe={(sectionId) => setSelectedSectionId(sectionId)}
              lastSaved={lastUpdateTime}
              onSaveDraft={() => save('draft')}
              isSavingDraft={isSaving && saveIntent === 'draft'}
              canSaveDraft={canSave}
            />
          </main>
        </div>

        {/* Add Section Modal Catalog */}
        <AddSectionMenu
          isOpen={isAddMenuOpen}
          onClose={() => setIsAddMenuOpen(false)}
          onSelectBlock={(newSlug) => {
            const newId = addSection(newSlug);
            if (newId) setSelectedSectionId(newId);
          }}
          onSelectTemplate={(templateBlocks) => {
            const firstId = applyTemplate(templateBlocks, 'append');
            if (firstId) setSelectedSectionId(firstId);
          }}
        />

        {/* Close Confirmation Modal */}
        {showCloseConfirm && (
          <div
            className="absolute inset-0 z-[100000] flex items-center justify-center bg-slate-950/70 p-4"
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowCloseConfirm(false);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="kala-close-title"
              aria-describedby="kala-close-desc"
              className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl"
            >
              <h2 id="kala-close-title" className="text-base font-bold text-slate-900 m-0">
                Tutup builder?
              </h2>
              <p id="kala-close-desc" className="mt-2 text-xs leading-relaxed text-slate-600">
                Masih ada perubahan yang <strong>belum disimpan</strong>. Menutup builder tidak menghapus
                perubahan — perubahan tetap ada di formulir sampai Anda menekan <em>Simpan Draf</em>.
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={async () => {
                    const ok = await save('draft');
                    if (ok) {
                      setShowCloseConfirm(false);
                      setIsOpen(false);
                    }
                  }}
                  className="w-full rounded-lg bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 disabled:opacity-60 cursor-pointer transition-all"
                >
                  {isSaving ? 'Menyimpan…' : 'Simpan Draf & Tutup'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCloseConfirm(false);
                    setIsOpen(false);
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Tutup Tanpa Menyimpan
                </button>

                <button
                  type="button"
                  onClick={() => setShowCloseConfirm(false)}
                  className="w-full rounded-lg px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>,
      document.body,
    );

  return (
    <>
      {inFormCard}
      {portalModal}
    </>
  );
};
