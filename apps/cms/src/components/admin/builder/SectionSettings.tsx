'use client';

import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Image as ImageIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { builderRegistry, type BuilderFieldMeta } from '../../../blocks/registry';
import type { LayoutBlock } from './useBuilderLayout';
import { MediaPickerModal, type MediaItem } from './MediaPickerModal';

interface SectionSettingsProps {
  block: LayoutBlock;
  onBack: () => void;
  onUpdate: (updates: Partial<LayoutBlock>) => void;
  onAddInnerItem: (path: string, defaults?: Record<string, any>) => void;
  onRemoveInnerItem: (path: string, index: number) => void;
  onUpdateInnerItem: (path: string, index: number, fields: Record<string, any>) => void;
}

export const SectionSettings: React.FC<SectionSettingsProps> = ({
  block,
  onBack,
  onUpdate,
  onAddInnerItem,
  onRemoveInnerItem,
  onUpdateInnerItem,
}) => {
  const [activeMediaTarget, setActiveMediaTarget] = useState<{
    fieldName: string;
    isInner?: boolean;
    innerPath?: string;
    innerIndex?: number;
  } | null>(null);

  const meta = builderRegistry[block.blockType];
  const label = meta?.label || block.blockType;

  const handleFieldChange = (name: string, value: any) => {
    onUpdate({ [name]: value });
  };

  const renderFieldInput = (
    field: BuilderFieldMeta,
    value: any,
    onChange: (val: any) => void,
    contextInfo?: { isInner?: boolean; innerPath?: string; innerIndex?: number },
  ) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            rows={3}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full text-xs p-2 rounded border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
          />
        );
      case 'select':
        return (
          <select
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-xs p-2 rounded border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none bg-white transition-all"
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span>{field.label}</span>
          </label>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder={field.placeholder}
            className="w-full text-xs p-2 rounded border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
          />
        );
      case 'upload': {
        const hasMedia = value !== null && value !== undefined && value !== '';
        const thumbUrl = typeof value === 'object' ? value?.url : typeof value === 'string' && value.startsWith('http') ? value : null;
        const mediaDisplay = typeof value === 'object' ? value.alt || value.filename || `Media #${value.id}` : value ? `ID Media: ${value}` : '';

        return (
          <div className="space-y-1.5">
            {hasMedia ? (
              <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg border border-slate-200">
                <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden flex items-center justify-center shrink-0 border border-slate-300">
                  {thumbUrl ? (
                    <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={18} className="text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-700 truncate">{mediaDisplay}</p>
                  <p className="text-[10px] text-teal-700 font-semibold">Tersambung</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMediaTarget({
                        fieldName: field.name,
                        isInner: contextInfo?.isInner,
                        innerPath: contextInfo?.innerPath,
                        innerIndex: contextInfo?.innerIndex,
                      })
                    }
                    className="py-1 px-2 text-slate-600 hover:text-teal-800 hover:bg-slate-200 rounded text-[11px] font-semibold transition-colors"
                  >
                    Ganti
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(null)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Hapus foto"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setActiveMediaTarget({
                    fieldName: field.name,
                    isInner: contextInfo?.isInner,
                    innerPath: contextInfo?.innerPath,
                    innerIndex: contextInfo?.innerIndex,
                  })
                }
                className="w-full py-2.5 px-3 border border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/40 rounded-lg text-xs font-semibold text-slate-600 hover:text-teal-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ImageIcon size={15} />
                <span>Pilih Foto dari Media...</span>
              </button>
            )}
          </div>
        );
      }
      case 'text':
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full text-xs p-2 rounded border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
          />
        );
    }
  };

  const inner = meta?.innerBlocks;
  const innerItems = inner && Array.isArray(block[inner.path]) ? block[inner.path] : [];

  const moveInnerItem = (path: string, fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= innerItems.length) return;
    const items = [...innerItems];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    onUpdate({ [path]: items });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header & Breadcrumb */}
      <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </button>
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          {block.blockType}
        </span>
      </div>

      <div className="p-3 bg-white border-b border-slate-200">
        <h2 className="font-bold text-sm text-slate-900">{label}</h2>
        {meta?.description && (
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{meta.description}</p>
        )}
      </div>

      {/* Settings Form Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Simple Section Fields */}
        {meta?.fields && meta.fields.length > 0 && (
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pengaturan Seksi
            </h3>
            {meta.fields.map((f) => (
              <div key={f.name} className="space-y-1">
                {f.type !== 'checkbox' && (
                  <label className="block text-xs font-semibold text-slate-700">
                    {f.label}
                    {f.required && <span className="text-rose-500 ml-0.5">*</span>}
                  </label>
                )}
                {renderFieldInput(f, block[f.name], (val) => handleFieldChange(f.name, val))}
              </div>
            ))}
          </div>
        )}

        {/* Inner Blocks (3-Level Navigation) */}
        {inner && (
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {inner.label} ({innerItems.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onAddInnerItem(inner.path)}
                className="flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded transition-colors"
              >
                <Plus size={13} />
                <span>Tambah Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {innerItems.map((item: any, idx: number) => {
                const itemTitle = item[inner.itemTitleField] || `Item #${idx + 1}`;
                return (
                  <div
                    key={item.id || idx}
                    className="p-2.5 rounded border border-slate-200 bg-slate-50/60 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                        {itemTitle}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveInnerItem(inner.path, idx, idx - 1)}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                          title="Geser ke atas"
                        >
                          <ChevronUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveInnerItem(inner.path, idx, idx + 1)}
                          disabled={idx === innerItems.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                          title="Geser ke bawah"
                        >
                          <ChevronDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveInnerItem(inner.path, idx)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Hapus item ini"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      {inner.fields.map((field) => (
                        <div key={field.name} className="space-y-1">
                          {field.type !== 'checkbox' && (
                            <label className="block text-[11px] font-semibold text-slate-600">
                              {field.label}
                              {field.required && <span className="text-rose-500 ml-0.5">*</span>}
                            </label>
                          )}
                          {renderFieldInput(
                            field,
                            item[field.name],
                            (val) => onUpdateInnerItem(inner.path, idx, { [field.name]: val }),
                            { isInner: true, innerPath: inner.path, innerIndex: idx },
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={Boolean(activeMediaTarget)}
        onClose={() => setActiveMediaTarget(null)}
        currentMediaId={
          activeMediaTarget
            ? activeMediaTarget.isInner && typeof activeMediaTarget.innerIndex === 'number' && activeMediaTarget.innerPath
              ? innerItems[activeMediaTarget.innerIndex]?.[activeMediaTarget.fieldName]
              : block[activeMediaTarget.fieldName]
            : null
        }
        onSelect={(media: MediaItem) => {
          if (!activeMediaTarget) return;
          if (activeMediaTarget.isInner && typeof activeMediaTarget.innerIndex === 'number' && activeMediaTarget.innerPath) {
            onUpdateInnerItem(activeMediaTarget.innerPath, activeMediaTarget.innerIndex, {
              [activeMediaTarget.fieldName]: media.id,
            });
          } else {
            handleFieldChange(activeMediaTarget.fieldName, media.id);
            if (meta?.fields?.some((f) => f.name === 'imageAlt') && !block.imageAlt && media.alt) {
              handleFieldChange('imageAlt', media.alt);
            }
          }
        }}
      />
    </div>
  );
};
