'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { builderRegistry, builderTemplates, type BuilderPageTemplate } from '../../../blocks/registry';

interface AddSectionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (slug: string) => void;
  onSelectTemplate?: (blocks: Array<Record<string, any>>) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  hero: 'Banner Utama (Hero)',
  offer: 'Penawaran & Paket Harga',
  proof: 'Bukti Kredibilitas & Kepercayaan',
  content: 'Konten, Masalah & Edukasi',
  cta: 'Ajakan Aksi (Call to Action)',
};

export const AddSectionMenu: React.FC<AddSectionMenuProps> = ({
  isOpen,
  onClose,
  onSelectBlock,
  onSelectTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'templates'>('blocks');

  if (!isOpen) return null;

  const blocks = Object.values(builderRegistry);
  const categories = ['hero', 'offer', 'proof', 'content', 'cta'];

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
      case 'FileText':
      default:
        return <FileText size={18} className="text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Katalog Seksi & Template</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih komponen seksi individual atau terapkan template halaman siap pakai.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
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
            <span>Koleksi Blok ({blocks.length})</span>
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
            <span>Template Halaman Siap Pakai ({builderTemplates.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'blocks' ? (
            <div className="space-y-5">
              {categories.map((cat) => {
                const catBlocks = blocks.filter((b) => b.category === cat);
                if (catBlocks.length === 0) return null;

                return (
                  <div key={cat} className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {CATEGORY_LABELS[cat] || cat}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {catBlocks.map((block) => (
                        <button
                          key={block.slug}
                          type="button"
                          onClick={() => {
                            onSelectBlock(block.slug);
                            onClose();
                          }}
                          className="flex items-start gap-3 p-3 text-left rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 hover:shadow-xs transition-all group cursor-pointer"
                        >
                          <div className="p-2 rounded-md bg-slate-100 group-hover:bg-white group-hover:shadow-xs transition-colors shrink-0">
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
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
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
                          {b.blockType}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectTemplate) {
                          onSelectTemplate(tmpl.blocks);
                          onClose();
                        }
                      }}
                      className="py-1.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      Terapkan Template Ini (+{tmpl.blocks.length} Seksi)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
