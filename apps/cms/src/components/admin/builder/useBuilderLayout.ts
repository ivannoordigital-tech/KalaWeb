'use client';

import { useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { builderRegistry } from '../../../blocks/registry';

export interface LayoutBlock {
  id?: string;
  blockType: string;
  disabled?: boolean;
  [key: string]: any;
}

export function useBuilderLayout(
  layout: LayoutBlock[],
  setLayout: (newLayout: LayoutBlock[]) => void,
  recordHistory: (current: LayoutBlock[]) => void,
) {
  const addSection = useCallback(
    (slug: string, afterIndex?: number) => {
      recordHistory(layout);
      const meta = builderRegistry[slug];
      const defaults = meta ? meta.defaults : { blockType: slug };

      const newBlock: LayoutBlock = {
        blockType: slug,
        ...structuredClone(defaults),
        id: crypto.randomUUID(),
        disabled: false,
      };

      const next = [...layout];
      if (typeof afterIndex === 'number' && afterIndex >= 0 && afterIndex < next.length) {
        next.splice(afterIndex + 1, 0, newBlock);
      } else {
        next.push(newBlock);
      }
      setLayout(next);
      return newBlock.id;
    },
    [layout, setLayout, recordHistory],
  );

  const removeSection = useCallback(
    (id: string) => {
      recordHistory(layout);
      const next = layout.filter((b) => b.id !== id);
      setLayout(next);
    },
    [layout, setLayout, recordHistory],
  );

  const duplicateSection = useCallback(
    (id: string) => {
      recordHistory(layout);
      const index = layout.findIndex((b) => b.id === id);
      if (index === -1) return;

      const source = layout[index];
      const clone: LayoutBlock = {
        ...structuredClone(source),
        id: crypto.randomUUID(),
      };

      const next = [...layout];
      next.splice(index + 1, 0, clone);
      setLayout(next);
      return clone.id;
    },
    [layout, setLayout, recordHistory],
  );

  const toggleDisabled = useCallback(
    (id: string) => {
      recordHistory(layout);
      const next = layout.map((b) => (b.id === id ? { ...b, disabled: !b.disabled } : b));
      setLayout(next);
    },
    [layout, setLayout, recordHistory],
  );

  const updateSection = useCallback(
    (id: string, updates: Partial<LayoutBlock>) => {
      recordHistory(layout);
      const next = layout.map((b) => (b.id === id ? { ...b, ...updates } : b));
      setLayout(next);
    },
    [layout, setLayout, recordHistory],
  );

  const reorderSections = useCallback(
    (oldIndex: number, newIndex: number) => {
      if (oldIndex === newIndex) return;
      recordHistory(layout);
      const next = arrayMove(layout, oldIndex, newIndex);
      setLayout(next);
    },
    [layout, setLayout, recordHistory],
  );

  // Level 3 inner block operations
  const addInnerItem = useCallback(
    (sectionId: string, path: string, itemDefaults: Record<string, any> = {}) => {
      recordHistory(layout);
      const next = layout.map((b) => {
        if (b.id === sectionId) {
          const list = Array.isArray(b[path]) ? [...b[path]] : [];
          list.push(structuredClone(itemDefaults));
          return { ...b, [path]: list };
        }
        return b;
      });
      setLayout(next);
    },
    [layout, setLayout, recordHistory],
  );

  const removeInnerItem = useCallback(
    (sectionId: string, path: string, itemIndex: number) => {
      recordHistory(layout);
      const next = layout.map((b) => {
        if (b.id === sectionId && Array.isArray(b[path])) {
          const list = b[path].filter((_: any, idx: number) => idx !== itemIndex);
          return { ...b, [path]: list };
        }
        return b;
      });
      setLayout(next);
    },
    [layout, setLayout, recordHistory],
  );

  const updateInnerItem = useCallback(
    (sectionId: string, path: string, itemIndex: number, fields: Record<string, any>) => {
      recordHistory(layout);
      const next = layout.map((b) => {
        if (b.id === sectionId && Array.isArray(b[path])) {
          const list = [...b[path]];
          list[itemIndex] = { ...list[itemIndex], ...fields };
          return { ...b, [path]: list };
        }
        return b;
      });
      setLayout(next);
    },
    [layout, setLayout, recordHistory],
  );

  const applyTemplate = useCallback(
    (templateBlocks: Array<Record<string, any>>, mode: 'replace' | 'append' = 'append') => {
      recordHistory(layout);
      const newBlocks: LayoutBlock[] = templateBlocks.map((b) => ({
        blockType: b.blockType || 'hero',
        ...structuredClone(b),
        id: crypto.randomUUID(),
        disabled: false,
      }));

      const next = mode === 'replace' ? newBlocks : [...layout, ...newBlocks];
      setLayout(next);
      return newBlocks[0]?.id || null;
    },
    [layout, setLayout, recordHistory],
  );

  return {
    addSection,
    removeSection,
    duplicateSection,
    toggleDisabled,
    updateSection,
    reorderSections,
    addInnerItem,
    removeInnerItem,
    updateInnerItem,
    applyTemplate,
  };
}
