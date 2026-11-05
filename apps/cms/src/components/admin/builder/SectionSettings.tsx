'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Columns3,
  Settings2,
} from 'lucide-react';
import {
  builderRegistry,
  type BuilderFieldMeta,
  type BuilderBlockMeta,
} from '../../../blocks/registry';
import type { LayoutBlock } from './useBuilderLayout';
import { MediaPickerModal, type MediaItem } from './MediaPickerModal';
import { getMediaDisplay, getMediaThumbUrl, hasMediaValue } from './media-utils';
import {
  lexicalToPlainText,
  plainTextToLexical,
  isoToLocalInput,
  localInputToIso,
} from './lexical-lite';

interface SectionSettingsProps {
  block: LayoutBlock;
  onBack: () => void;
  onUpdate: (updates: Partial<LayoutBlock>, structural?: boolean) => void;
  onAddInnerItem: (path: string, defaults?: Record<string, any>) => void;
  onRemoveInnerItem: (path: string, index: number) => void;
  onUpdateInnerItem: (path: string, index: number, fields: Record<string, any>) => void;
}

const DEVICES: Array<{ id: 'mobile' | 'tablet' | 'desktop'; label: string }> = [
  { id: 'mobile', label: 'Ponsel' },
  { id: 'tablet', label: 'Tablet' },
  { id: 'desktop', label: 'Desktop' },
];

const inputClass =
  'w-full text-xs p-2 rounded border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all';
const labelClass = 'block text-xs font-semibold text-slate-700';

interface RelationshipOption {
  id: string | number;
  label: string;
}

const RelationshipSelect: React.FC<{
  field: BuilderFieldMeta;
  value: any;
  hasMany?: boolean;
  onChange: (value: any) => void;
}> = ({ field, value, hasMany, onChange }) => {
  const [options, setOptions] = useState<RelationshipOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const relation = field.relationTo || 'midwives';
    const url =
      relation === 'midwives'
        ? '/api/midwives?limit=100&depth=0'
        : '/api/block-templates?limit=100&depth=0';

    fetch(url, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { docs: [] }))
      .then((data) => {
        if (cancelled) return;
        const docs = Array.isArray(data.docs) ? data.docs : [];
        setOptions(
          docs.map((doc: any) => ({
            id: doc.id,
            label: doc.name || doc.title || `#${doc.id}`,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [field.relationTo]);

  const currentIds = hasMany
    ? (Array.isArray(value) ? value : []).map((item: any) =>
        typeof item === 'object' && item ? item.id : item,
      )
    : [typeof value === 'object' && value ? value.id : value].filter(
        (id) => id !== undefined && id !== null && id !== '',
      );

  if (hasMany) {
    return (
      <div className="space-y-1.5 rounded border border-slate-200 bg-slate-50/60 p-2">
        {loading && <p className="text-[11px] text-slate-500">Memuat pilihan…</p>}
        {!loading && options.length === 0 && (
          <p className="text-[11px] text-slate-500">Belum ada data. Kosongkan berarti semua data aktif.</p>
        )}
        {options.map((option) => {
          const checked = currentIds.map(String).includes(String(option.id));
          return (
            <label key={option.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => {
                  const nextIds = event.target.checked
                    ? [...currentIds, option.id]
                    : currentIds.filter((id) => String(id) !== String(option.id));
                  onChange(nextIds);
                }}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <select
      value={currentIds[0] !== undefined ? String(currentIds[0]) : ''}
      onChange={(event) => onChange(event.target.value || null)}
      className={inputClass}
    >
      <option value="">— Pilih —</option>
      {options.map((option) => (
        <option key={option.id} value={String(option.id)}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const RichTextArea: React.FC<{
  value: any;
  onChange: (value: any) => void;
}> = ({ value, onChange }) => {
  const [text, setText] = useState(() => lexicalToPlainText(value));
  const lastEmitted = useRef(text);

  useEffect(() => {
    const incoming = lexicalToPlainText(value);
    if (incoming !== lastEmitted.current) {
      lastEmitted.current = incoming;
      setText(incoming);
    }
  }, [value]);

  return (
    <textarea
      rows={5}
      value={text}
      onChange={(event) => {
        const next = event.target.value;
        setText(next);
        lastEmitted.current = next;
        onChange(plainTextToLexical(next));
      }}
      placeholder="Tulis teks di sini…"
      className={inputClass}
    />
  );
};

const AddNestedBlock: React.FC<{
  meta: BuilderBlockMeta;
  onAdd: (slug: string) => void;
}> = ({ meta, onAdd }) => {
  const available = meta.columns?.blockSlugs || [];
  const [slug, setSlug] = useState(available[0] || '');

  return (
    <div className="flex items-center gap-1.5">
      <select value={slug} onChange={(event) => setSlug(event.target.value)} className={inputClass}>
        {available.map((item) => (
          <option key={item} value={item}>
            {builderRegistry[item]?.label || item}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => slug && onAdd(slug)}
        className="shrink-0 flex items-center gap-1 py-1.5 px-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-[11px] font-bold transition-colors"
      >
        <Plus size={12} />
        Tambah
      </button>
    </div>
  );
};

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
  const [nestedSelection, setNestedSelection] = useState<{ column: number; index: number } | null>(null);

  const meta = builderRegistry[block.blockType];
  const label = meta?.label || block.blockType;

  const columnsMeta = meta?.columns;
  const columns: any[] = columnsMeta && Array.isArray(block[columnsMeta.path])
    ? block[columnsMeta.path]
    : [];
  if (columnsMeta && nestedSelection) {
    const column = columns[nestedSelection.column];
    const nestedBlock = column?.content?.[nestedSelection.index];

    if (nestedBlock) {
      const updateNested = (updates: Partial<LayoutBlock>, structural = false) => {
        const nextColumns = columns.map((col, colIndex) =>
          colIndex !== nestedSelection.column
            ? col
            : {
                ...col,
                content: (col.content || []).map((item: any, itemIndex: number) =>
                  itemIndex !== nestedSelection.index ? item : { ...item, ...updates },
                ),
              },
        );
        onUpdate({ [columnsMeta.path]: nextColumns }, structural);
      };

      const updateNestedList = (path: string, updater: (list: any[]) => any[]) => {
        const current = Array.isArray(nestedBlock[path]) ? nestedBlock[path] : [];
        updateNested({ [path]: updater(current) } as Partial<LayoutBlock>, true);
      };

      return (
        <>
          <SectionSettings
            block={nestedBlock}
            onBack={() => setNestedSelection(null)}
            onUpdate={updateNested}
            onAddInnerItem={(path, defaults) =>
              updateNestedList(path, (list) => [...list, structuredClone(defaults || {})])
            }
            onRemoveInnerItem={(path, index) =>
              updateNestedList(path, (list) => list.filter((_, i) => i !== index))
            }
            onUpdateInnerItem={(path, index, fields) =>
              updateNestedList(path, (list) =>
                list.map((item, i) => (i === index ? { ...item, ...fields } : item)),
              )
            }
          />
        </>
      );
    }
  }

  const setColumns = (nextColumns: any[], structural = true) => {
    if (!columnsMeta) return;
    onUpdate({ [columnsMeta.path]: nextColumns } as Partial<LayoutBlock>, structural);
  };

  const addColumn = () => {
    if (!columnsMeta || columns.length >= columnsMeta.maxColumns) return;
    setColumns([...columns, { width: columnsMeta.defaultWidth, content: [] }]);
  };

  const removeColumn = (index: number) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter((_, i) => i !== index));
    setNestedSelection(null);
  };

  const updateColumnWidth = (index: number, width: string) => {
    setColumns(
      columns.map((column, i) => (i === index ? { ...column, width } : column)),
      false,
    );
  };

  const addBlockToColumn = (columnIndex: number, slug: string) => {
    const blockMeta = builderRegistry[slug];
    if (!blockMeta) return;
    const newBlock = {
      blockType: slug,
      ...structuredClone(blockMeta.defaults),
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `blk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      disabled: false,
    };
    setColumns(
      columns.map((column, i) =>
        i !== columnIndex
          ? column
          : { ...column, content: [...(column.content || []), newBlock] },
      ),
    );
  };

  const removeNestedBlock = (columnIndex: number, blockIndex: number) => {
    setColumns(
      columns.map((column, i) =>
        i !== columnIndex
          ? column
          : { ...column, content: (column.content || []).filter((_: any, idx: number) => idx !== blockIndex) },
      ),
    );
  };

  const moveNestedBlock = (columnIndex: number, blockIndex: number, direction: -1 | 1) => {
    setColumns(
      columns.map((column, i) => {
        if (i !== columnIndex) return column;
        const content = [...(column.content || [])];
        const target = blockIndex + direction;
        if (target < 0 || target >= content.length) return column;
        const [moved] = content.splice(blockIndex, 1);
        content.splice(target, 0, moved);
        return { ...column, content };
      }),
    );
  };

  // ---- Generic field renderer ----
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
            className={inputClass}
          />
        );
      case 'richtext':
        return (
          <div className="space-y-1">
            <RichTextArea value={value} onChange={onChange} />
            {field.description && (
              <p className="text-[10px] text-slate-500 leading-snug">{field.description}</p>
            )}
          </div>
        );
      case 'code':
        return (
          <div className="space-y-1">
            <textarea
              rows={14}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              spellCheck={false}
              placeholder={'<div class="...">...</div>'}
              className={`${inputClass} font-mono text-[11px] leading-relaxed whitespace-pre`}
            />
            {field.description && (
              <p className="text-[10px] text-slate-500 leading-snug">{field.description}</p>
            )}
          </div>
        );
      case 'date':
        return (
          <input
            type="datetime-local"
            value={isoToLocalInput(value)}
            onChange={(e) => onChange(localInputToIso(e.target.value))}
            className={inputClass}
          />
        );
      case 'relationship':
        return (
          <RelationshipSelect
            field={field}
            value={value}
            hasMany={field.hasMany}
            onChange={onChange}
          />
        );
      case 'select':
        return (
          <select
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
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
            className={inputClass}
          />
        );
      case 'upload': {
        const hasMedia = hasMediaValue(value);
        const thumbUrl = getMediaThumbUrl(value);
        const mediaDisplay = getMediaDisplay(value);

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
                    aria-label="Hapus foto"
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
            className={inputClass}
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

  // Array kosong = blok lama tanpa field visibilitas = tampil di semua device.
  const storedVisibility = Array.isArray(block.visibility) ? block.visibility : [];
  const visibility =
    storedVisibility.length > 0 ? storedVisibility : ['mobile', 'tablet', 'desktop'];

  const toggleDevice = (device: string) => {
    const next = visibility.includes(device)
      ? visibility.filter((item) => item !== device)
      : [...visibility, device];
    onUpdate({ visibility: next });
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
                  <label className={labelClass}>
                    {f.label}
                    {f.required && <span className="text-rose-500 ml-0.5">*</span>}
                  </label>
                )}
                {renderFieldInput(f, block[f.name], (val) => handleFieldChange(f.name, val))}
                {f.description && f.type !== 'richtext' && (
                  <p className="text-[10px] text-slate-500 leading-snug">{f.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Columns editor (depth 1) */}
        {columnsMeta && (
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Columns3 size={14} />
                {columnsMeta.label} ({columns.length})
              </h3>
              <button
                type="button"
                onClick={addColumn}
                disabled={columns.length >= columnsMeta.maxColumns}
                className="flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 disabled:opacity-40 px-2.5 py-1 rounded transition-colors"
              >
                <Plus size={13} />
                <span>Tambah Kolom</span>
              </button>
            </div>

            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-700">
                    Kolom {columnIndex + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <select
                      value={column.width || 'full'}
                      onChange={(event) => updateColumnWidth(columnIndex, event.target.value)}
                      className="text-[11px] p-1 rounded border border-slate-300 bg-white"
                    >
                      {columnsMeta.widthOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeColumn(columnIndex)}
                      disabled={columns.length <= 1}
                      className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-20 transition-colors"
                      title="Hapus kolom"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {(column.content || []).length === 0 && (
                    <p className="text-[11px] text-slate-400 italic py-1">Kolom masih kosong.</p>
                  )}
                  {(column.content || []).map((nested: any, blockIndex: number) => (
                    <div
                      key={nested.id || blockIndex}
                      className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded px-2 py-1.5 hover:border-teal-400 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setNestedSelection({ column: columnIndex, index: blockIndex })}
                        className="flex items-center gap-1.5 min-w-0 flex-1 text-left"
                      >
                        <span className="text-[11px] font-semibold text-slate-800 truncate">
                          {builderRegistry[nested.blockType]?.label || nested.blockType}
                        </span>
                        <ChevronRight size={12} className="text-slate-400 shrink-0" />
                      </button>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveNestedBlock(columnIndex, blockIndex, -1)}
                          disabled={blockIndex === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Geser ke atas"
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveNestedBlock(columnIndex, blockIndex, 1)}
                          disabled={blockIndex === (column.content || []).length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Geser ke bawah"
                        >
                          <ChevronDown size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeNestedBlock(columnIndex, blockIndex)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Hapus blok"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <AddNestedBlock meta={meta!} onAdd={(slug) => addBlockToColumn(columnIndex, slug)} />
              </div>
            ))}
          </div>
        )}

        {/* Inner Blocks (arrays like gallery images, pricing packages, dll.) */}
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

        {/* Common block settings: anchor & visibility */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Settings2 size={14} />
            Pengaturan Blok
          </h3>
          <div className="space-y-1">
            <label className={labelClass}>ID Anchor (Opsional)</label>
            <input
              type="text"
              value={block.anchorId || ''}
              onChange={(event) => onUpdate({ anchorId: event.target.value })}
              placeholder="paket-harga"
              className={inputClass}
            />
            <p className="text-[10px] text-slate-500">
              Dipakai untuk tautan langsung, contoh: #paket-harga.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Tampilkan di Perangkat</label>
            {DEVICES.map((device) => (
              <label key={device.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibility.includes(device.id)}
                  onChange={() => toggleDevice(device.id)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>{device.label}</span>
              </label>
            ))}
            <p className="text-[10px] text-slate-500">
              Hilangkan semua centang untuk menyembunyikan blok ini sepenuhnya.
            </p>
          </div>
        </div>
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

          if (
            activeMediaTarget.isInner &&
            typeof activeMediaTarget.innerIndex === 'number' &&
            activeMediaTarget.innerPath
          ) {
            const updates: Record<string, any> = { [activeMediaTarget.fieldName]: media.id };
            onUpdateInnerItem(
              activeMediaTarget.innerPath,
              activeMediaTarget.innerIndex,
              updates,
            );
          } else {
            const updates: Record<string, any> = { [activeMediaTarget.fieldName]: media.id };
            if (meta?.fields?.some((f) => f.name === 'imageAlt') && !block.imageAlt && media.alt) {
              updates.imageAlt = media.alt;
            }
            onUpdate(updates);
          }
        }}
      />
    </div>
  );
};
