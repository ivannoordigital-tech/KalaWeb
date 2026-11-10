'use client';

import { useCallback, useRef, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { builderRegistry } from '../../../blocks/registry';
import {
  type ColumnKey,
  duplicateBlockInTree,
  findBlock,
  moveBlockInTree,
  moveChildToColumn as moveChildToColumnInTree,
  removeBlockFromTree,
  reorderColumnChildren,
  updateBlockInTree,
} from './tree-utils';

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
      const next = removeBlockFromTree(layoutRef.current, id);
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, flushHistory],
  );

  const duplicateSection = useCallback(
    (id: string) => {
      flushHistory(layoutRef.current);
      const { layout: next, newId } = duplicateBlockInTree(layoutRef.current, id);
      if (!newId) return null;
      layoutRef.current = next;
      setLayout(next);
      return newId;
    },
    [setLayout, flushHistory],
  );

  const toggleDisabled = useCallback(
    (id: string) => {
      flushHistory(layoutRef.current);
      const current = findBlock(layoutRef.current, id);
      if (!current) return;
      const next = updateBlockInTree(layoutRef.current, id, { disabled: !current.disabled });
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, flushHistory],
  );

  const updateSection = useCallback(
    (id: string, updates: Partial<LayoutBlock>) => {
      debounceRecordHistory(layoutRef.current);
      const next = updateBlockInTree(layoutRef.current, id, updates);
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, debounceRecordHistory],
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

  // ---------------------------------------------------------------
  // Nested container operations (max depth: container -> widget)
  // ---------------------------------------------------------------

  const addBlockToContainer = useCallback(
    (parentId: string, column: ColumnKey, slug: string) => {
      flushHistory(layoutRef.current);
      const meta = builderRegistry[slug];
      const defaults = meta ? meta.defaults : { blockType: slug };
      const newBlock: LayoutBlock = {
        blockType: slug,
        ...structuredClone(defaults),
        id: crypto.randomUUID(),
        disabled: false,
      };

      const next = layoutRef.current.map((parent) => {
        if ((parent.id || parent.blockType) !== parentId) return parent;
        const existing = Array.isArray(parent[column]) ? (parent[column] as LayoutBlock[]) : [];
        return { ...parent, [column]: [...existing, newBlock] };
      });
      layoutRef.current = next;
      setLayout(next);
      return newBlock.id;
    },
    [setLayout, flushHistory],
  );

  /** Move a block to a container column, or back to the top level. */
  const moveBlock = useCallback(
    (
      id: string,
      targetParentId: string | null,
      targetColumn: ColumnKey | null,
      targetIndex?: number,
    ) => {
      flushHistory(layoutRef.current);
      const next = moveBlockInTree(layoutRef.current, id, targetParentId, targetColumn, targetIndex);
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, flushHistory],
  );

  /** Reorder a widget inside a column. */
  const reorderColumnBlock = useCallback(
    (parentId: string, column: ColumnKey, oldIndex: number, newIndex: number) => {
      if (oldIndex === newIndex) return;
      flushHistory(layoutRef.current);
      const next = reorderColumnChildren(layoutRef.current, parentId, column, oldIndex, newIndex);
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, flushHistory],
  );

  /** Move a widget from one column to another. */
  const moveWidgetToColumn = useCallback(
    (parentId: string, fromColumn: ColumnKey, childIndex: number, toColumn: ColumnKey) => {
      if (fromColumn === toColumn) return;
      flushHistory(layoutRef.current);
      const next = moveChildToColumnInTree(
        layoutRef.current,
        parentId,
        fromColumn,
        childIndex,
        toColumn,
      );
      layoutRef.current = next;
      setLayout(next);
    },
    [setLayout, flushHistory],
  );

  const findBlockById = useCallback(
    (id: string) => findBlock(layoutRef.current, id),
    [],
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
    addBlockToContainer,
    moveBlock,
    reorderColumnBlock,
    moveWidgetToColumn,
    findBlockById,
  };
}
