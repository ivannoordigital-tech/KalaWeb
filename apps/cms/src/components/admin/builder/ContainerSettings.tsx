'use client';

import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  MoveRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { builderRegistry } from '../../../blocks/registry';
import type { LayoutBlock } from './useBuilderLayout';
import { getColumnChildren, getContainerColumns, type ColumnKey } from './tree-utils';

interface ContainerSettingsProps {
  block: LayoutBlock;
  onUpdate: (updates: Partial<LayoutBlock>) => void;
  onSelectChild: (id: string) => void;
  onAddWidget: (column: ColumnKey) => void;
  onRemoveChild: (column: ColumnKey, index: number) => void;
  onMoveChild: (column: ColumnKey, index: number, direction: -1 | 1) => void;
  onDuplicateChild: (column: ColumnKey, index: number) => void;
  onMoveChildToColumn: (column: ColumnKey, index: number, target: ColumnKey) => void;
}

const childSummary = (child: LayoutBlock): string => {
  return (
    child.text ||
    child.title ||
    child.headline ||
    child.heading ||
    child.name ||
    child.caption ||
    ''
  );
};

export const ContainerSettings: React.FC<ContainerSettingsProps> = ({
  block,
  onUpdate,
  onSelectChild,
  onAddWidget,
  onRemoveChild,
  onMoveChild,
  onDuplicateChild,
  onMoveChildToColumn,
}) => {
  const columns = useMemo(() => getContainerColumns(block), [block]);
  const [activeColumn, setActiveColumn] = useState<ColumnKey>(columns[0] ?? 'column1');

  const safeActiveColumn = columns.includes(activeColumn) ? activeColumn : columns[0];
  const children = getColumnChildren(block, safeActiveColumn);

  const columnIndex = columns.indexOf(safeActiveColumn);
  const totalColumns = Number(block.columns) || columns.length;

  const updateColumns = (nextCount: number) => {
    onUpdate({ columns: String(nextCount) });
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Kolom & Widget
        </h3>
        <span className="text-[10px] font-semibold text-slate-400">
          {totalColumns} kolom
        </span>
      </div>

      {/* Column count quick switch */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4].map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => updateColumns(count)}
            className={`flex-1 py-1.5 rounded text-[11px] font-bold border transition-colors ${
              totalColumns === count
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
            }`}
            title={`${count} kolom`}
          >
            {count}
          </button>
        ))}
      </div>

      {/* Column tabs */}
      <div className="flex flex-wrap gap-1">
        {columns.map((col, idx) => {
          const count = getColumnChildren(block, col).length;
          const isActive = col === safeActiveColumn;
          return (
            <button
              key={col}
              type="button"
              onClick={() => setActiveColumn(col)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-semibold border transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-800 border-teal-400'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>Kolom {idx + 1}</span>
              <span
                className={`text-[9px] px-1 rounded ${
                  isActive ? 'bg-teal-200 text-teal-900' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Children list */}
      <div className="space-y-2">
        {children.length === 0 ? (
          <div className="text-center py-4 px-3 border border-dashed border-slate-300 rounded-lg bg-slate-50">
            <p className="text-[11px] text-slate-500 font-medium">
              Kolom {columnIndex + 1} masih kosong.
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Tambahkan widget untuk mengisi kolom ini.
            </p>
          </div>
        ) : (
          children.map((child, idx) => {
            const meta = builderRegistry[child.blockType];
            const summary = childSummary(child);
            return (
              <div
                key={child.id || `${child.blockType}-${idx}`}
                className="p-2 rounded border border-slate-200 bg-slate-50/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => child.id && onSelectChild(child.id)}
                    className="min-w-0 flex-1 text-left"
                    title="Buka pengaturan widget"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-800">
                        {idx + 1}. {meta?.label || child.blockType}
                      </span>
                      {child.disabled && (
                        <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded">
                          Off
                        </span>
                      )}
                    </div>
                    {summary && (
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{summary}</p>
                    )}
                  </button>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onMoveChild(safeActiveColumn, idx, -1)}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      title="Geser ke atas"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveChild(safeActiveColumn, idx, 1)}
                      disabled={idx === children.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      title="Geser ke bawah"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicateChild(safeActiveColumn, idx)}
                      className="p-1 text-slate-400 hover:text-teal-700"
                      title="Duplikasi widget"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveChild(safeActiveColumn, idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="Hapus widget"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {columns.length > 1 && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <MoveRight size={12} className="text-slate-400 shrink-0" />
                    <select
                      value=""
                      onChange={(e) => {
                        const target = e.target.value as ColumnKey;
                        if (target) onMoveChildToColumn(safeActiveColumn, idx, target);
                        e.currentTarget.value = '';
                      }}
                      className="flex-1 text-[10px] py-1 px-1.5 rounded border border-slate-200 bg-white text-slate-600"
                      title="Pindahkan widget ke kolom lain"
                    >
                      <option value="">Pindah ke kolom…</option>
                      {columns
                        .filter((col) => col !== safeActiveColumn)
                        .map((col) => (
                          <option key={col} value={col}>
                            Kolom {columns.indexOf(col) + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <button
        type="button"
        onClick={() => onAddWidget(safeActiveColumn)}
        className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-teal-400 text-teal-700 hover:bg-teal-50 rounded-lg text-[11px] font-bold transition-colors"
      >
        <Plus size={13} />
        <span>Tambah Widget ke Kolom {columnIndex + 1}</span>
      </button>

      {Number(block.columns) < 4 && (
        <p className="text-[10px] text-slate-400 leading-snug">
          Mengurangi jumlah kolom tidak menghapus data kolom lain. Widget akan tampil lagi jika
          kolom ditambahkan kembali.
        </p>
      )}
    </div>
  );
};
