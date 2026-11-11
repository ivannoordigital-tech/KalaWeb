'use client';

import React, { useEffect, useState } from 'react';
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
import { Pencil, Plus } from 'lucide-react';
import { SortableSection } from './SortableSection';
import { builderRegistry } from '../../../blocks/registry';
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
  nestedSelection?: { sectionId: string; column: number; index: number } | null;
  onSelectNested?: (sectionId: string, column: number, index: number) => void;
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
  nestedSelection,
  onSelectNested,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Bagian yang dipilih otomatis dibuka agar isi kolomnya terlihat.
  useEffect(() => {
    if (!selectedId) return;
    setExpandedSections((prev) => (prev[selectedId] ? prev : { ...prev, [selectedId]: true }));
  }, [selectedId]);

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
          <span>Tambah Bagian</span>
        </button>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {layout.length === 0 ? (
          <div className="text-center py-12 px-4 text-slate-400">
            <p className="text-xs">Belum ada bagian di halaman ini.</p>
            <p className="text-[11px] mt-1">Klik tombol di atas untuk menambahkan bagian.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              {layout.map((block) => {
                const blockId = block.id || block.blockType;
                const columns =
                  block.blockType === 'section' && Array.isArray(block.columns)
                    ? (block.columns as any[])
                    : [];
                const hasNested = columns.length > 0;
                const isExpanded = expandedSections[blockId] === true;

                return (
                  <SortableSection
                    key={blockId}
                    block={block}
                    isSelected={selectedId === blockId}
                    onSelect={() => onSelect(blockId)}
                    hasNested={hasNested}
                    isExpanded={isExpanded}
                    onToggleExpand={() =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        [blockId]: !prev[blockId],
                      }))
                    }
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
                      const label = builderRegistry[block.blockType]?.label || 'bagian ini';
                      if (confirm(`Hapus ${label}?`)) {
                        onDelete(blockId);
                      }
                    }}
                  >
                    {columns.map((column, columnIndex) => {
                      const content: any[] = Array.isArray(column.content) ? column.content : [];
                      return (
                        <div key={columnIndex}>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-1 py-0.5">
                            Kolom {columnIndex + 1}
                          </p>
                          {content.length === 0 ? (
                            <p className="text-[10px] italic text-slate-400 px-1">Kosong</p>
                          ) : (
                            content.map((nested, nestedIndex) => {
                              const isActive =
                                nestedSelection?.sectionId === blockId &&
                                nestedSelection.column === columnIndex &&
                                nestedSelection.index === nestedIndex;
                              return (
                                <button
                                  key={nested.id || `${columnIndex}-${nestedIndex}`}
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    onSelectNested?.(blockId, columnIndex, nestedIndex);
                                  }}
                                  title="Edit isi kolom"
                                  className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left text-[11px] transition-colors ${
                                    isActive
                                      ? 'bg-teal-100 text-teal-900 font-semibold'
                                      : 'text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  <Pencil size={10} className="shrink-0 text-slate-400" aria-hidden="true" />
                                  <span className="truncate">
                                    {builderRegistry[nested.blockType]?.label || nested.blockType}
                                  </span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      );
                    })}
                  </SortableSection>
                );
              })}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};
