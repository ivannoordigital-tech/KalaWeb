'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Copy, Trash2, ChevronRight } from 'lucide-react';
import { builderRegistry } from '../../../blocks/registry';
import type { LayoutBlock } from './useBuilderLayout';

interface SortableSectionProps {
  block: LayoutBlock;
  isSelected: boolean;
  onSelect: () => void;
  onToggleDisabled: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const SortableSection: React.FC<SortableSectionProps> = ({
  block,
  isSelected,
  onSelect,
  onToggleDisabled,
  onDuplicate,
  onDelete,
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
  const headline = block.headline || block.title || block.heading || '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group flex items-center justify-between p-2.5 rounded-lg border text-sm transition-all cursor-pointer ${
        isSelected
          ? 'bg-teal-50/80 border-teal-500 shadow-sm ring-1 ring-teal-500'
          : 'bg-white hover:bg-slate-50 border-slate-200'
      }`}
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
            <span className={`font-semibold text-xs truncate ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
              {label}
            </span>
            {block.disabled && (
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-mono">
                Off
              </span>
            )}
          </div>
          {headline && (
            <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
              {headline}
            </p>
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

        <ChevronRight size={14} className={`text-slate-400 ${isSelected ? 'text-teal-600' : ''}`} />
      </div>
    </div>
  );
};
