'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { SortableSection } from './SortableSection';
import type { LayoutBlock } from './useBuilderLayout';

interface SectionTreeProps {
  layout: LayoutBlock[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
  onToggleDisabled: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenAddMenu: () => void;
}

export const SectionTree: React.FC<SectionTreeProps> = ({
  layout,
  selectedId,
  onSelect,
  onReorder,
  onToggleDisabled,
  onDuplicate,
  onDelete,
  onOpenAddMenu,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = layout.findIndex((b) => (b.id || b.blockType) === active.id);
      const newIndex = layout.findIndex((b) => (b.id || b.blockType) === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    }
  };

  const itemIds = layout.map((b) => b.id || b.blockType);

  return (
    <div className="flex flex-col h-full">
      {/* Add Section Button */}
      <div className="p-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onOpenAddMenu}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          <Plus size={16} />
          <span>Tambah Seksi Baru</span>
        </button>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {layout.length === 0 ? (
          <div className="text-center py-12 px-4 text-slate-400">
            <p className="text-xs">Belum ada seksi di halaman ini.</p>
            <p className="text-[11px] mt-1">Klik tombol di atas untuk menambahkan seksi.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              {layout.map((block) => {
                const blockId = block.id || block.blockType;
                return (
                  <SortableSection
                    key={blockId}
                    block={block}
                    isSelected={selectedId === blockId}
                    onSelect={() => onSelect(blockId)}
                    onToggleDisabled={(e) => {
                      e.stopPropagation();
                      onToggleDisabled(blockId);
                    }}
                    onDuplicate={(e) => {
                      e.stopPropagation();
                      onDuplicate(blockId);
                    }}
                    onDelete={(e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus seksi ${block.blockType}?`)) {
                        onDelete(blockId);
                      }
                    }}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};
