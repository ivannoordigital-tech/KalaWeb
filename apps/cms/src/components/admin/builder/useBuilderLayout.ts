'use client';

import { useCallback, useRef, useEffect } from 'react';
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
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced history recording for continuous text edits (500ms)
  const debounceRecordHistory = useCallback(
    (current: LayoutBlock[]) => {
      if (!historyTimeoutRef.current) {
        // Record state snapshot before the typing burst begins
        recordHistory(current);
      }
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
      }
      historyTimeoutRef.current = setTimeout(() => {
        historyTimeoutRef.current = null;
      }, 500);
    },
    [recordHistory],
  );

  // Immediate history recording for structural changes
  const flushHistory = useCallback(
    (current: LayoutBlock[]) => {
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
        historyTimeoutRef.current = null;
      }
      recordHistory(current);
    },
    [recordHistory],
  );

  useEffect(() => {
    return () => {
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
      }
    };
  }, []);

  const addSection = useCallback(
    (slug: string, afterIndex?: number) => {
      flushHistory(layoutRef.current);
      const meta = builderRegistry[slug];
      const defaults = meta ? meta.defaults : { blockType: slug };

      const newBlock: LayoutBlock = {
        blockType: slug,
        ...structuredClone(defaults),
        id: crypto.randomUUID(),
        disabled: false,
      };

      const next = [...layoutRef.current];
      if (typeof afterIndex === 'number' && afterIndex >= 0 && afterIndex < next.length) {
        next.splice(afterIndex + 1, 0, newBlock);
      } else {
        next.push(newBlock);
      }
      layoutRef.current = next;
      setLayout(next);
      return newBlock.id;
    },
    [setLayout, flushHistory],
  );

  const removeSection = useCallback(
    (id: string) => {
      flushHistory(layoutRef.current);
      const next = layoutRef.current.filter((b) => b.id !== id);
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, flushHistory],
  );

  const duplicateSection = useCallback(
    (id: string) => {
      flushHistory(layoutRef.current);
      const index = layoutRef.current.findIndex((b) => b.id === id);
      if (index === -1) return;

      const source = layoutRef.current[index];
      const clone: LayoutBlock = {
        ...structuredClone(source),
        id: crypto.randomUUID(),
      };

      const next = [...layoutRef.current];
      next.splice(index + 1, 0, clone);
      layoutRef.current = next;
      setLayout(next);
      return clone.id;
    },
    [setLayout, flushHistory],
  );

  const toggleDisabled = useCallback(
    (id: string) => {
      flushHistory(layoutRef.current);
      const next = layoutRef.current.map((b) => (b.id === id ? { ...b, disabled: !b.disabled } : b));
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, flushHistory],
  );

  const updateSection = useCallback(
    (id: string, updates: Partial<LayoutBlock>, structural = false) => {
      if (structural) {
        flushHistory(layoutRef.current);
      } else {
        debounceRecordHistory(layoutRef.current);
      }
      const next = layoutRef.current.map((b) => (b.id === id ? { ...b, ...updates } : b));
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, debounceRecordHistory, flushHistory],
  );

  const reorderSections = useCallback(
    (oldIndex: number, newIndex: number) => {
      if (oldIndex === newIndex) return;
      flushHistory(layoutRef.current);
      const next = arrayMove(layoutRef.current, oldIndex, newIndex);
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, flushHistory],
  );

  // Level 3 inner block operations
  const addInnerItem = useCallback(
    (sectionId: string, path: string, itemDefaults: Record<string, any> = {}) => {
      flushHistory(layoutRef.current);
      const next = layoutRef.current.map((b) => {
        if (b.id === sectionId) {
          const list = Array.isArray(b[path]) ? [...b[path]] : [];
          list.push(structuredClone(itemDefaults));
          return { ...b, [path]: list };
        }
        return b;
      });
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, flushHistory],
  );

  const removeInnerItem = useCallback(
    (sectionId: string, path: string, itemIndex: number) => {
      flushHistory(layoutRef.current);
      const next = layoutRef.current.map((b) => {
        if (b.id === sectionId && Array.isArray(b[path])) {
          const list = b[path].filter((_: any, idx: number) => idx !== itemIndex);
          return { ...b, [path]: list };
        }
        return b;
      });
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, flushHistory],
  );

  const updateInnerItem = useCallback(
    (sectionId: string, path: string, itemIndex: number, fields: Record<string, any>) => {
      debounceRecordHistory(layoutRef.current);
      const next = layoutRef.current.map((b) => {
        if (b.id === sectionId && Array.isArray(b[path])) {
          const list = [...b[path]];
          list[itemIndex] = { ...list[itemIndex], ...fields };
          return { ...b, [path]: list };
        }
        return b;
      });
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, debounceRecordHistory],
  );

  const applyTemplate = useCallback(
    (templateBlocks: Array<Record<string, any>>, mode: 'replace' | 'append' = 'append') => {
      flushHistory(layoutRef.current);
      const newBlocks: LayoutBlock[] = templateBlocks.map((b) => ({
        blockType: b.blockType || 'hero',
        ...structuredClone(b),
        id: crypto.randomUUID(),
        disabled: false,
      }));

      const next = mode === 'replace' ? newBlocks : [...layoutRef.current, ...newBlocks];
      layoutRef.current = next;
      setLayout(next);
      return newBlocks[0]?.id || null;
    },
    [setLayout, flushHistory],
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
