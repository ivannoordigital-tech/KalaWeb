'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Copy, Trash2, ChevronRight, LayoutGrid } from 'lucide-react';
import { builderRegistry } from '../../../blocks/registry';
import type { LayoutBlock } from './useBuilderLayout';
import { getColumnChildren, getContainerColumns, isContainer } from './tree-utils';

interface SortableSectionProps {
  block: LayoutBlock;
  isSelected: boolean;
  selectedId?: string | null;
  onSelect: () => void;
  onToggleDisabled: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onSelectChild?: (id: string) => void;
}

export const SortableSection: React.FC<SortableSectionProps> = ({
  block,
  isSelected,
  selectedId,
  onSelect,
  onToggleDisabled,
  onDuplicate,
  onDelete,
  onSelectChild,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id || block.blockType,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : block.disabled ? 0.55 : 1,
  };

  const meta = builderRegistry[block.blockType];
  const label = meta?.label || block.blockType;
  const headline = block.headline || block.title || block.heading || block.text || '';
  const containerColumns = isContainer(block) ? getContainerColumns(block) : [];

  const childRows = containerColumns.flatMap((col, colIndex) =>
    getColumnChildren(block, col).map((child, childIndex) => ({
      child,
      colIndex,
      childIndex,
      total: getColumnChildren(block, col).length,
    })),
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border text-sm transition-all ${
        isSelected
          ? 'bg-teal-50/80 border-teal-500 shadow-sm ring-1 ring-teal-500'
          : 'bg-white hover:bg-slate-50 border-slate-200'
      }`}
    >
      <div
        onClick={onSelect}
        className="group flex items-center justify-between p-2.5 cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-slate-100"
            title="Geser untuk mengubah urutan"
          >
            <GripVertical size={16} />
          </button>

          {/* Section Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {isContainer(block) && <LayoutGrid size={12} className="text-teal-600 shrink-0" />}
              <span
                className={`font-semibold text-xs truncate ${
                  isSelected ? 'text-teal-900' : 'text-slate-800'
                }`}
              >
                {label}
              </span>
              {isContainer(block) && (
                <span className="text-[9px] bg-teal-100 text-teal-800 px-1 py-0.5 rounded font-mono">
                  {containerColumns.length} kolom
                </span>
              )}
              {block.disabled && (
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                  Off
                </span>
              )}
            </div>
            {headline && (
              <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">{headline}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={onToggleDisabled}
            title={block.disabled ? 'Tampilkan seksi' : 'Sembunyikan seksi'}
            className={`p-1 rounded hover:bg-slate-200/80 transition-colors ${
              block.disabled ? 'text-amber-600' : 'text-slate-500'
            }`}
          >
            {block.disabled ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            title="Duplikasi seksi ini"
            className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-200/80 transition-colors"
          >
            <Copy size={15} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            title="Hapus seksi"
            className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 transition-colors"
          >
            <Trash2 size={15} />
          </button>

          <ChevronRight
            size={14}
            className={`text-slate-400 ${isSelected ? 'text-teal-600' : ''}`}
          />
        </div>
      </div>

      {/* Nested children preview (click to select a widget) */}
      {isContainer(block) && childRows.length > 0 && (
        <div className="border-t border-slate-200/80 px-2.5 py-1.5 space-y-0.5">
          {childRows.map(({ child, colIndex, childIndex }) => {
            const childMeta = builderRegistry[child.blockType];
            const childId = child.id || `${block.id}-${colIndex}-${childIndex}`;
            const childSelected = Boolean(child.id && child.id === selectedId);
            return (
              <button
                key={childId}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (child.id && onSelectChild) onSelectChild(child.id);
                }}
                className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left transition-colors ${
                  childSelected ? 'bg-teal-100' : 'hover:bg-slate-100'
                }`}
              >
                <span className="text-[9px] font-mono text-slate-400 shrink-0">
                  K{colIndex + 1}
                </span>
                <span className="text-[10px] font-semibold text-slate-600 truncate">
                  {childMeta?.label || child.blockType}
                </span>
                {(child.text || child.title || child.headline) && (
                  <span className="text-[9px] text-slate-400 truncate flex-1 min-w-0">
                    · {child.text || child.title || child.headline}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
