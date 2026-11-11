'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  Pencil,
  Type,
  MousePointerClick,
  X,
  GripVertical,
  ShieldAlert,
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
  /** Diisi saat mengedit blok yang berada di dalam kolom sebuah bagian. */
  nestedContext?: { sectionLabel: string; columnNumber: number };
  /** Peran teknis boleh mengedit HTML kustom. */
  canUseAdvanced?: boolean;
  /** Seleksi blok nested yang dikendalikan dari sidebar (opsional). */
  activeNestedSelection?: { column: number; index: number } | null;
  onNestedSelectionChange?: (selection: { column: number; index: number } | null) => void;
}

const QUICK_COLUMN_BLOCKS: Array<{ slug: string; label: string; icon: React.ReactNode }> = [
  { slug: 'heading', label: 'Teks', icon: <Type size={13} /> },
  { slug: 'image', label: 'Gambar', icon: <ImageIcon size={13} /> },
  { slug: 'button', label: 'Tombol', icon: <MousePointerClick size={13} /> },
];

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
  onClose?: () => void;
}> = ({ meta, onAdd, onClose }) => {
  const available = meta.columns?.blockSlugs || [];
  const [slug, setSlug] = useState(available[0] || '');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Pilih komponen lain
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup daftar komponen"
            className="p-0.5 text-slate-400 hover:text-slate-700 rounded transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <select
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className={inputClass}
          aria-label="Pilih komponen untuk kolom"
        >
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
    </div>
  );
};

const ColumnDropArea: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`space-y-1.5 rounded-md transition-shadow ${
        isOver ? 'ring-2 ring-teal-400 ring-offset-1' : ''
      }`}
    >
      {children}
    </div>
  );
};

const NestedBlockRow: React.FC<{
  id: string;
  label: string;
  isSelected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}> = ({ id, label, isSelected, canMoveUp, canMoveDown, onEdit, onMoveUp, onMoveDown, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className={`flex items-center justify-between gap-1.5 bg-white border rounded px-2 py-1.5 transition-colors ${
        isSelected ? 'border-teal-500 ring-1 ring-teal-400' : 'border-slate-200 hover:border-teal-400'
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        onClick={(event) => event.stopPropagation()}
        className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing p-0.5 rounded"
        title="Geser blok"
        aria-label="Geser blok"
      >
        <GripVertical size={12} />
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-1.5 min-w-0 flex-1 text-left"
        title="Klik untuk edit"
      >
        <Pencil size={11} className="text-slate-400 shrink-0" aria-hidden="true" />
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold text-slate-800 truncate">{label}</span>
          <span className="block text-[9px] text-slate-400">Klik untuk edit</span>
        </span>
        <ChevronRight size={12} className="text-slate-400 shrink-0" />
      </button>

      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
          title="Geser ke atas"
          aria-label="Geser blok ke atas"
        >
          <ChevronUp size={12} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
          title="Geser ke bawah"
          aria-label="Geser blok ke bawah"
        >
          <ChevronDown size={12} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-slate-400 hover:text-rose-600"
          title="Hapus blok"
          aria-label="Hapus blok dari kolom"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

const nestedRowId = (block: any, columnIndex: number, blockIndex: number): string =>
  block?.id ? String(block.id) : `nested-${columnIndex}-${blockIndex}`;

export const SectionSettings: React.FC<SectionSettingsProps> = ({
  block,
  onBack,
  onUpdate,
  onAddInnerItem,
  onRemoveInnerItem,
  onUpdateInnerItem,
  nestedContext,
  canUseAdvanced = true,
  activeNestedSelection,
  onNestedSelectionChange,
}) => {
  const [activeMediaTarget, setActiveMediaTarget] = useState<{
    fieldName: string;
    isInner?: boolean;
    innerPath?: string;
    innerIndex?: number;
  } | null>(null);
  const [internalNestedSelection, setInternalNestedSelection] = useState<{
    column: number;
    index: number;
  } | null>(null);
  const nestedSelection =
    activeNestedSelection !== undefined ? activeNestedSelection : internalNestedSelection;
  const setNestedSelection = (selection: { column: number; index: number } | null) => {
    onNestedSelectionChange?.(selection);
    if (activeNestedSelection === undefined) setInternalNestedSelection(selection);
  };
  const [expandedColumn, setExpandedColumn] = useState<Record<number, boolean>>({});
  const nestedSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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
            nestedContext={{ sectionLabel: label, columnNumber: nestedSelection.column + 1 }}
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
    if (
      nestedSelection?.column === columnIndex &&
      nestedSelection?.index === blockIndex
    ) {
      setNestedSelection(null);
    }
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

  const findNestedBlock = (rowId: string) => {
    for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
      const content: any[] = columns[columnIndex].content || [];
      for (let blockIndex = 0; blockIndex < content.length; blockIndex += 1) {
        if (nestedRowId(content[blockIndex], columnIndex, blockIndex) === rowId) {
          return { columnIndex, blockIndex };
        }
      }
    }
    return null;
  };

  const handleNestedDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const source = findNestedBlock(activeId);
    if (!source) return;

    let targetColumn: number;
    let targetIndex: number;

    if (overId.startsWith('column-')) {
      targetColumn = Number(overId.slice('column-'.length));
      targetIndex = (columns[targetColumn]?.content || []).length;
    } else {
      const target = findNestedBlock(overId);
      if (!target) return;
      targetColumn = target.columnIndex;
      targetIndex = target.blockIndex;
    }

    if (!columns[targetColumn]) return;
    if (source.columnIndex === targetColumn && source.blockIndex === targetIndex) return;

    const next = columns.map((column) => ({
      ...column,
      content: [...(column.content || [])],
    }));
    const [moved] = next[source.columnIndex].content.splice(source.blockIndex, 1);
    if (!moved) return;
    next[targetColumn].content.splice(targetIndex, 0, moved);
    setColumns(next);
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
      <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors min-w-0"
        >
          <ArrowLeft size={16} className="shrink-0" />
          <span className="truncate">
            {nestedContext ? `Kembali ke ${nestedContext.sectionLabel}` : 'Kembali ke daftar bagian'}
          </span>
        </button>
        {nestedContext ? (
          <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Di dalam kolom
          </span>
        ) : (
          <span className="shrink-0 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            {block.blockType}
          </span>
        )}
      </div>

      <div className="p-3 bg-white border-b border-slate-200">
        {nestedContext && (
          <p className="flex items-center flex-wrap gap-0.5 text-[10px] text-slate-500 mb-1">
            <span>Halaman</span>
            <ChevronRight size={10} aria-hidden="true" />
            <span>{nestedContext.sectionLabel}</span>
            <ChevronRight size={10} aria-hidden="true" />
            <span>Kolom {nestedContext.columnNumber}</span>
            <ChevronRight size={10} aria-hidden="true" />
            <strong className="text-slate-700">{label}</strong>
          </p>
        )}
        <h2 className="font-bold text-sm text-slate-900">Mengedit: {label}</h2>
        {meta?.description && (
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{meta.description}</p>
        )}
      </div>

      {/* Settings Form Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {block.blockType === 'html' && !canUseAdvanced && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
            <ShieldAlert size={15} className="shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong>Komponen teknis.</strong> HTML kustom hanya untuk tim teknis. Perubahan di
              sini bisa merusak tampilan halaman — minta bantuan operator jika perlu.
            </p>
          </div>
        )}

        {/* Simple Section Fields */}
        {meta?.fields && meta.fields.length > 0 && (
          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {nestedContext ? 'Pengaturan Konten' : 'Pengaturan Bagian'}
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
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Columns3 size={14} />
                  {columnsMeta.label} ({columns.length})
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Atur lebar dan isi tiap kolom. Konten akan tampil berdampingan di layar lebar.
                </p>
              </div>
              <button
                type="button"
                onClick={addColumn}
                disabled={columns.length >= columnsMeta.maxColumns}
                title={
                  columns.length >= columnsMeta.maxColumns
                    ? `Maksimal ${columnsMeta.maxColumns} kolom`
                    : 'Tambah kolom'
                }
                className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 disabled:opacity-40 px-2.5 py-1 rounded transition-colors"
              >
                <Plus size={13} />
                <span>Tambah Kolom</span>
              </button>
            </div>

            <DndContext
              sensors={nestedSensors}
              collisionDetection={closestCenter}
              onDragEnd={handleNestedDragEnd}
            >
              {columns.map((column, columnIndex) => {
              const columnContent: any[] = column.content || [];
              const isExpanded = expandedColumn[columnIndex] === true;

              return (
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
                        aria-label={`Lebar kolom ${columnIndex + 1}`}
                        title="Lebar kolom"
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
                        aria-label={`Hapus kolom ${columnIndex + 1}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <ColumnDropArea id={`column-${columnIndex}`}>
                    <SortableContext
                      items={columnContent.map((nested, blockIndex) =>
                        nestedRowId(nested, columnIndex, blockIndex),
                      )}
                      strategy={verticalListSortingStrategy}
                    >
                      {columnContent.length === 0 && !isExpanded && (
                        <div className="rounded-lg border border-dashed border-teal-300 bg-teal-50/50 p-3 text-center space-y-2">
                          <p className="text-[11px] font-semibold text-teal-900">
                            Kolom ini belum ada isinya.
                          </p>
                          <p className="text-[10px] text-teal-800/80">
                            Mulai dengan menambahkan:
                          </p>
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {QUICK_COLUMN_BLOCKS.map((quick) => (
                              <button
                                key={quick.slug}
                                type="button"
                                onClick={() => addBlockToColumn(columnIndex, quick.slug)}
                                className="flex items-center gap-1 py-1.5 px-2.5 bg-white border border-teal-300 hover:border-teal-500 hover:bg-teal-50 text-teal-800 rounded-md text-[11px] font-bold transition-colors"
                              >
                                {quick.icon}
                                {quick.label}
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedColumn((prev) => ({ ...prev, [columnIndex]: true }))
                            }
                            className="text-[10px] font-semibold text-teal-700 hover:text-teal-900 underline"
                          >
                            Lihat semua komponen
                          </button>
                        </div>
                      )}

                      {columnContent.map((nested: any, blockIndex: number) => {
                        const rowId = nestedRowId(nested, columnIndex, blockIndex);
                        return (
                          <NestedBlockRow
                            key={rowId}
                            id={rowId}
                            label={builderRegistry[nested.blockType]?.label || nested.blockType}
                            isSelected={
                              nestedSelection?.column === columnIndex &&
                              nestedSelection?.index === blockIndex
                            }
                            canMoveUp={blockIndex > 0}
                            canMoveDown={blockIndex < columnContent.length - 1}
                            onEdit={() =>
                              setNestedSelection({ column: columnIndex, index: blockIndex })
                            }
                            onMoveUp={() => moveNestedBlock(columnIndex, blockIndex, -1)}
                            onMoveDown={() => moveNestedBlock(columnIndex, blockIndex, 1)}
                            onRemove={() => removeNestedBlock(columnIndex, blockIndex)}
                          />
                        );
                      })}
                    </SortableContext>
                  </ColumnDropArea>

                  {columnContent.length > 0 && !isExpanded && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedColumn((prev) => ({ ...prev, [columnIndex]: true }))
                      }
                      className="w-full flex items-center justify-center gap-1 py-1.5 border border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/40 text-slate-600 hover:text-teal-800 rounded text-[11px] font-semibold transition-colors"
                    >
                      <Plus size={12} />
                      Tambah isi kolom
                    </button>
                  )}

                  {isExpanded && (
                    <AddNestedBlock
                      meta={meta!}
                      onAdd={(slug) => {
                        addBlockToColumn(columnIndex, slug);
                        setExpandedColumn((prev) => ({ ...prev, [columnIndex]: false }));
                      }}
                      onClose={() =>
                        setExpandedColumn((prev) => ({ ...prev, [columnIndex]: false }))
                      }
                    />
                  )}
                </div>
              );
            })}
            </DndContext>
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
