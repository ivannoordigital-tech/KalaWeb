'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Sparkles,
  Tag,
  CheckCircle2,
  AlertCircle,
  Quote,
  HelpCircle,
  PhoneCall,
  ShieldCheck,
  Image,
  TableProperties,
  Footprints,
  FileText,
  Copy,
  UserCheck,
  LayoutTemplate,
  Layers,
  LayoutGrid,
  Type,
  MousePointerClick,
  Minus,
  PlayCircle,
  BarChart3,
  Building2,
  Users,
  Columns3,
  ClipboardList,
  Newspaper,
  Timer,
  Share2,
  Code2,
  Search,
  Star,
  ArrowRight,
} from 'lucide-react';
import { builderRegistry, builderTemplates, type BuilderBlockMeta, type BuilderPageTemplate } from '../../../blocks/registry';
import { useFocusTrap } from './useFocusTrap';
import {
  CATEGORY_LABELS,
  filterCatalogBlocks,
  getCatalogBlocks,
  getPopularBlocks,
} from './catalog-utils';

interface AddSectionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (slug: string) => void;
  onSelectTemplate?: (blocks: Array<Record<string, any>>) => void;
  /** Peran teknis boleh melihat komponen HTML kustom. */
  canUseAdvanced?: boolean;
}

export const AddSectionMenu: React.FC<AddSectionMenuProps> = ({
  isOpen,
  onClose,
  onSelectBlock,
  onSelectTemplate,
  canUseAdvanced = true,
}) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'templates'>('blocks');
  const [query, setQuery] = useState('');
  const [pendingTemplate, setPendingTemplate] = useState<BuilderPageTemplate | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useFocusTrap(dialogRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (pendingTemplate) {
        setPendingTemplate(null);
        return;
      }
      onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, pendingTemplate]);

  // Reset pencarian setiap katalog dibuka agar admin selalu mulai dari daftar lengkap.
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setPendingTemplate(null);
    }
  }, [isOpen]);

  const blocks = useMemo(
    () =>
      getCatalogBlocks().filter(
        (block) => canUseAdvanced || block.slug !== 'html',
      ),
    [canUseAdvanced],
  );
  const categories = ['layout', 'hero', 'offer', 'proof', 'content', 'media', 'conversion', 'promo', 'cta'];
  const popularBlocks = useMemo(() => getPopularBlocks(blocks), [blocks]);
  const filteredBlocks = useMemo(() => filterCatalogBlocks(blocks, query), [blocks, query]);
  const isSearching = query.trim().length > 0;

  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles size={18} className="text-amber-500" />;
      case 'Tag':
        return <Tag size={18} className="text-teal-600" />;
      case 'CheckCircle2':
        return <CheckCircle2 size={18} className="text-emerald-600" />;
      case 'AlertCircle':
        return <AlertCircle size={18} className="text-rose-500" />;
      case 'Quote':
        return <Quote size={18} className="text-purple-600" />;
      case 'HelpCircle':
        return <HelpCircle size={18} className="text-blue-500" />;
      case 'PhoneCall':
        return <PhoneCall size={18} className="text-emerald-700" />;
      case 'ShieldCheck':
        return <ShieldCheck size={18} className="text-emerald-600" />;
      case 'Image':
        return <Image size={18} className="text-sky-500" />;
      case 'TableProperties':
        return <TableProperties size={18} className="text-indigo-600" />;
      case 'Footprints':
        return <Footprints size={18} className="text-amber-600" />;
      case 'UserCheck':
        return <UserCheck size={18} className="text-teal-700" />;
      case 'Copy':
        return <Copy size={18} className="text-slate-600" />;
      case 'LayoutGrid':
        return <LayoutGrid size={18} className="text-teal-700" />;
      case 'Type':
        return <Type size={18} className="text-slate-700" />;
      case 'ImageIcon':
        return <Image size={18} className="text-sky-500" />;
      case 'MousePointerClick':
        return <MousePointerClick size={18} className="text-emerald-700" />;
      case 'Minus':
        return <Minus size={18} className="text-slate-500" />;
      case 'PlayCircle':
        return <PlayCircle size={18} className="text-rose-500" />;
      case 'BarChart3':
        return <BarChart3 size={18} className="text-indigo-600" />;
      case 'Building2':
        return <Building2 size={18} className="text-slate-600" />;
      case 'Users':
        return <Users size={18} className="text-teal-700" />;
      case 'Columns3':
        return <Columns3 size={18} className="text-blue-600" />;
      case 'ClipboardList':
        return <ClipboardList size={18} className="text-emerald-700" />;
      case 'Newspaper':
        return <Newspaper size={18} className="text-amber-700" />;
      case 'Timer':
        return <Timer size={18} className="text-orange-600" />;
      case 'Share2':
        return <Share2 size={18} className="text-purple-600" />;
      case 'Code2':
        return <Code2 size={18} className="text-slate-700" />;
      case 'FileText':
      default:
        return <FileText size={18} className="text-slate-600" />;
    }
  };

  const renderBlockCard = (block: BuilderBlockMeta) => (
    <button
      key={block.slug}
      type="button"
      onClick={() => {
        onSelectBlock(block.slug);
        onClose();
      }}
      className="flex items-start gap-3 p-3 text-left rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 hover:shadow-sm transition-all group cursor-pointer"
    >
      <div className="p-2 rounded-md bg-slate-100 group-hover:bg-white group-hover:shadow-sm transition-colors shrink-0">
        {getIcon(block.icon)}
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-xs text-slate-800 group-hover:text-teal-900">
          {block.label}
        </div>
        <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mt-0.5 font-normal">
          {block.description}
        </p>
      </div>
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kala-add-section-title"
        className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden transition-all duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 id="kala-add-section-title" className="text-sm font-bold text-slate-900">Katalog Komponen &amp; Template</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih komponen untuk ditambahkan ke halaman, atau terapkan template siap pakai.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup katalog"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-4 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('blocks')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'blocks'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers size={14} />
            <span>Komponen ({blocks.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'templates'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutTemplate size={14} />
            <span>Template Halaman ({builderTemplates.length})</span>
          </button>
        </div>

        {/* Search (komponen saja) */}
        {activeTab === 'blocks' && (
          <div className="px-4 py-3 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari komponen… (misal: kolom, gambar, tombol)"
                aria-label="Cari komponen"
                className="w-full text-xs pl-9 pr-9 py-2 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
              />
              {isSearching && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    searchRef.current?.focus();
                  }}
                  aria-label="Hapus pencarian"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'blocks' ? (
            isSearching ? (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Hasil pencarian “{query.trim()}” ({filteredBlocks.length})
                </h3>
                {filteredBlocks.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <Search size={28} className="mx-auto text-slate-300" aria-hidden="true" />
                    <p className="text-xs font-semibold text-slate-700 mt-3">
                      Tidak ada komponen yang cocok.
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Coba kata lain, misal <em>kolom</em>, <em>gambar</em>, atau <em>tombol</em>.
                    </p>
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="mt-3 text-[11px] font-bold text-teal-700 hover:text-teal-900 underline"
                    >
                      Tampilkan semua komponen
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredBlocks.map(renderBlockCard)}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {popularBlocks.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Star size={13} className="text-amber-500" />
                      Sering dipakai
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {popularBlocks.map(renderBlockCard)}
                    </div>
                  </div>
                )}

                {categories.map((cat) => {
                  const catBlocks = blocks.filter((b) => b.category === cat);
                  if (catBlocks.length === 0) return null;

                  return (
                    <div key={cat} className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {CATEGORY_LABELS[cat] || cat}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {catBlocks.map(renderBlockCard)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="space-y-4">
              {builderTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 bg-white hover:shadow-sm transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {tmpl.badge}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">{tmpl.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      {tmpl.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tmpl.blocks.map((b, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200"
                        >
                          {builderRegistry[b.blockType]?.label || b.blockType}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setPendingTemplate(tmpl)}
                      className="py-1.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
                    >
                      Terapkan Template Ini (+{tmpl.blocks.length} bagian)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Template confirmation */}
        {pendingTemplate && (
          <div
            className="absolute inset-0 z-10 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
            role="presentation"
            onClick={(event) => {
              if (event.target === event.currentTarget) setPendingTemplate(null);
            }}
          >
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="kala-template-confirm-title"
              aria-describedby="kala-template-confirm-desc"
              className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl"
            >
              <h2 id="kala-template-confirm-title" className="text-base font-bold text-slate-900 m-0">
                Terapkan template?
              </h2>
              <p id="kala-template-confirm-desc" className="mt-2 text-xs leading-relaxed text-slate-600">
                Template <strong>{pendingTemplate.title}</strong> akan menambahkan{' '}
                <strong>{pendingTemplate.blocks.length} bagian</strong> ke halaman ini. Perubahan
                belum tersimpan sampai Anda menekan <em>Simpan Draf</em>.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    if (onSelectTemplate) {
                      onSelectTemplate(pendingTemplate.blocks);
                      onClose();
                    }
                    setPendingTemplate(null);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 cursor-pointer transition-all"
                >
                  Ya, tambahkan {pendingTemplate.blocks.length} bagian
                  <ArrowRight size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingTemplate(null)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
              </div>
              <p className="mt-2 text-[10px] text-slate-500 text-center">
                Bisa dibatalkan dengan tombol Undo setelah diterapkan.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
