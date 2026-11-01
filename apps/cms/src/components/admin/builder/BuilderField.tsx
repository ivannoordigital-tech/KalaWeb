'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useForm, useFormFields, useDocumentInfo } from '@payloadcms/ui';
import { Undo2, Redo2, X, Sparkles, Layers, Sliders, ExternalLink } from 'lucide-react';
import { SectionTree } from './SectionTree';
import { SectionSettings } from './SectionSettings';
import { AddSectionMenu } from './AddSectionMenu';
import { PreviewFrame } from './PreviewFrame';
import { useBuilderLayout, type LayoutBlock } from './useBuilderLayout';
import { useBuilderHistory } from './useBuilderHistory';

export const BuilderField: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { dispatchFields } = useForm();
  const docInfo = useDocumentInfo();

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
      setHasUnsavedChanges(true);
      dispatchFields({
        type: 'UPDATE',
        path: 'layout',
        value: newLayout,
      });
    },
    [dispatchFields],
  );

  // Undo / Redo history
  const { canUndo, canRedo, pushSnapshot, undo, redo, resetHistory } = useBuilderHistory<LayoutBlock[]>(
    layout,
    (restoredLayout) => {
      dispatchFields({
        type: 'UPDATE',
        path: 'layout',
        value: restoredLayout,
      });
    },
  );

  // Reset unsaved changes flag when document is saved
  useEffect(() => {
    if (docInfo?.id) {
      setHasUnsavedChanges(false);
      resetHistory();
    }
  }, [docInfo?.id]);

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

  // Keyboard shortcut listener (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
        } else if (selectedSectionId) {
          setSelectedSectionId(null);
        } else {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isAddMenuOpen, selectedSectionId, canUndo, canRedo, undo, redo, layout]);

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
              className="p-1.5 rounded-lg bg-teal-600 text-white shadow-xs inline-flex items-center justify-center"
              style={{ padding: '0.4rem', borderRadius: '0.5rem', backgroundColor: '#0d9488', color: '#fff' }}
            >
              <Sparkles size={18} />
            </span>
            <h3 className="font-bold text-sm text-slate-900" style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: '#0f172a' }}>
              Shopify-Style Visual Builder
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
  );

  // Fullscreen Portal Builder UI
  const portalModal = isOpen && typeof document !== 'undefined' && createPortal(
    <div
      className="kala-builder-portal fixed inset-0 z-[99999] bg-slate-900 flex flex-col font-sans select-none overflow-hidden animate-in fade-in duration-150"
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
      {/* Top Navbar */}
      <header className="h-13 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <h1 className="text-sm font-bold text-white truncate max-w-[280px]">
              {title}
            </h1>
          </div>

          <span className={`text-[11px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
            status === 'published' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-amber-400 border border-slate-700'
          }`}>
            {status}
          </span>
        </div>

        {/* Undo / Redo & Close Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => canUndo && undo(layout)}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 transition-colors"
          >
            <Undo2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => canRedo && redo(layout)}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 transition-colors"
          >
            <Redo2 size={16} />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <X size={15} />
            <span>Tutup & Kembali</span>
          </button>
        </div>
      </header>

      {/* Main 2-Column Split Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (360px) */}
        <aside className="w-[360px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-sm">
          {selectedBlock ? (
            <SectionSettings
              block={selectedBlock}
              onBack={() => setSelectedSectionId(null)}
              onUpdate={(updates) => selectedBlock.id && updateSection(selectedBlock.id, updates)}
              onAddInnerItem={(path, defaults) => selectedBlock.id && addInnerItem(selectedBlock.id, path, defaults)}
              onRemoveInnerItem={(path, idx) => selectedBlock.id && removeInnerItem(selectedBlock.id, path, idx)}
              onUpdateInnerItem={(path, idx, fields) => selectedBlock.id && updateInnerItem(selectedBlock.id, path, idx, fields)}
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
        <main className="flex-1 overflow-hidden">
          <PreviewFrame
            collection={collectionSlug}
            docId={docInfo?.id}
            slug={slug}
            hasUnsavedChanges={hasUnsavedChanges}
            selectedSectionId={selectedSectionId}
            onSelectFromIframe={(sectionId) => setSelectedSectionId(sectionId)}
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
