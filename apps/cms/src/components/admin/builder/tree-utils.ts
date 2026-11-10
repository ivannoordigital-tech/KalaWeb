'use client';

import type { LayoutBlock } from './useBuilderLayout';

/** Keys of the column fields on a container block. */
export const CONTAINER_COLUMNS = ['column1', 'column2', 'column3', 'column4'] as const;
export type ColumnKey = (typeof CONTAINER_COLUMNS)[number];

export const blockKey = (block: LayoutBlock): string => block.id || block.blockType;

export const isContainer = (block: LayoutBlock): boolean => block.blockType === 'container';

/** Active column keys for a container, based on its `columns` field. */
export function getContainerColumns(block: LayoutBlock): ColumnKey[] {
  const count = Math.min(Math.max(Number(block.columns) || 2, 1), 4);
  return CONTAINER_COLUMNS.slice(0, count);
}

/** Children stored in a column of a container. */
export function getColumnChildren(block: LayoutBlock, column: ColumnKey): LayoutBlock[] {
  return Array.isArray(block[column]) ? (block[column] as LayoutBlock[]) : [];
}

export interface BlockLocation {
  block: LayoutBlock;
  /** Parent block id, or null when the block is at top level. */
  parentId: string | null;
  /** Column key when nested, or null when at top level. */
  column: ColumnKey | null;
  index: number;
}

/**
 * Locate a block anywhere in the tree (1 level of nesting).
 */
export function findBlockLocation(
  layout: LayoutBlock[],
  id: string,
  parentId: string | null = null,
  column: ColumnKey | null = null,
): BlockLocation | null {
  for (let i = 0; i < layout.length; i += 1) {
    const block = layout[i];
    if (blockKey(block) === id) {
      return { block, parentId, column, index: i };
    }
    if (isContainer(block)) {
      for (const col of CONTAINER_COLUMNS) {
        const found = findBlockLocation(getColumnChildren(block, col), id, blockKey(block), col);
        if (found) return found;
      }
    }
  }
  return null;
}

/** Find a block by id at any depth. */
export function findBlock(layout: LayoutBlock[], id: string): LayoutBlock | null {
  return findBlockLocation(layout, id)?.block ?? null;
}

/** Recursively update a block's fields. */
export function updateBlockInTree(
  layout: LayoutBlock[],
  id: string,
  updates: Partial<LayoutBlock>,
): LayoutBlock[] {
  return layout.map((block) => {
    if (blockKey(block) === id) {
      return { ...block, ...updates };
    }
    if (isContainer(block)) {
      const next: LayoutBlock = { ...block };
      for (const col of CONTAINER_COLUMNS) {
        if (Array.isArray(block[col])) {
          next[col] = updateBlockInTree(block[col] as LayoutBlock[], id, updates);
        }
      }
      return next;
    }
    return block;
  });
}

/** Recursively remove a block by id. */
export function removeBlockFromTree(layout: LayoutBlock[], id: string): LayoutBlock[] {
  const filtered = layout.filter((block) => blockKey(block) !== id);
  return filtered.map((block) => {
    if (!isContainer(block)) return block;
    const next: LayoutBlock = { ...block };
    for (const col of CONTAINER_COLUMNS) {
      if (Array.isArray(block[col])) {
        next[col] = removeBlockFromTree(block[col] as LayoutBlock[], id);
      }
    }
    return next;
  });
}

/** Deep-clone a block, assigning fresh ids to it and all descendants. */
export function cloneBlockWithNewIds(block: LayoutBlock, depth = 0): LayoutBlock {
  const clone: LayoutBlock = {
    ...structuredClone(block),
    id: crypto.randomUUID(),
  };

  if (isContainer(clone) && depth < 4) {
    for (const col of CONTAINER_COLUMNS) {
      if (Array.isArray(clone[col])) {
        clone[col] = (clone[col] as LayoutBlock[]).map((child) =>
          cloneBlockWithNewIds(child, depth + 1),
        );
      }
    }
  }

  return clone;
}

/** Duplicate a block in place (right after the original) at any depth. */
export function duplicateBlockInTree(
  layout: LayoutBlock[],
  id: string,
): { layout: LayoutBlock[]; newId: string | null } {
  const location = findBlockLocation(layout, id);
  if (!location) return { layout, newId: null };

  const clone = cloneBlockWithNewIds(location.block);

  if (!location.parentId || !location.column) {
    const next = [...layout];
    next.splice(location.index + 1, 0, clone);
    return { layout: next, newId: clone.id ?? null };
  }

  const next = layout.map((block) => {
    if (blockKey(block) !== location.parentId) return block;
    const list = [...getColumnChildren(block, location.column as ColumnKey)];
    list.splice(location.index + 1, 0, clone);
    return { ...block, [location.column as ColumnKey]: list };
  });

  return { layout: next, newId: clone.id ?? null };
}

/** Insert a block at top level or into a container column. */
export function insertBlockInTree(
  layout: LayoutBlock[],
  block: LayoutBlock,
  targetParentId: string | null,
  targetColumn: ColumnKey | null,
  targetIndex?: number,
): LayoutBlock[] {
  if (!targetParentId || !targetColumn) {
    const next = [...layout];
    const at =
      typeof targetIndex === 'number'
        ? Math.max(0, Math.min(targetIndex, next.length))
        : next.length;
    next.splice(at, 0, block);
    return next;
  }

  return layout.map((parent) => {
    if (blockKey(parent) !== targetParentId) return parent;
    const list = [...getColumnChildren(parent, targetColumn)];
    const at =
      typeof targetIndex === 'number'
        ? Math.max(0, Math.min(targetIndex, list.length))
        : list.length;
    list.splice(at, 0, block);
    return { ...parent, [targetColumn]: list };
  });
}

/**
 * Move a block to a new parent/column/index. Prevents putting a container
 * inside another container (max depth 1).
 */
export function moveBlockInTree(
  layout: LayoutBlock[],
  id: string,
  targetParentId: string | null,
  targetColumn: ColumnKey | null,
  targetIndex?: number,
): LayoutBlock[] {
  if (id === targetParentId) return layout;

  const location = findBlockLocation(layout, id);
  if (!location) return layout;

  // Containers can only live at the top level in the MVP.
  if (isContainer(location.block) && targetParentId) return layout;

  // Do not move a container into one of its own columns.
  if (targetParentId && blockKey(location.block) === targetParentId) return layout;

  let adjustedIndex = targetIndex;
  const sameParent =
    location.parentId === targetParentId && location.column === targetColumn;

  if (sameParent && typeof adjustedIndex === 'number' && location.index < adjustedIndex) {
    adjustedIndex -= 1;
  }

  const without = removeBlockFromTree(layout, id);
  return insertBlockInTree(without, location.block, targetParentId, targetColumn, adjustedIndex);
}

/** Reorder a child inside one column. */
export function reorderColumnChildren(
  layout: LayoutBlock[],
  parentId: string,
  column: ColumnKey,
  oldIndex: number,
  newIndex: number,
): LayoutBlock[] {
  if (oldIndex === newIndex) return layout;

  return layout.map((parent) => {
    if (blockKey(parent) !== parentId) return parent;
    const list = [...getColumnChildren(parent, column)];
    if (oldIndex < 0 || oldIndex >= list.length || newIndex < 0 || newIndex >= list.length) {
      return parent;
    }
    const [moved] = list.splice(oldIndex, 1);
    list.splice(newIndex, 0, moved);
    return { ...parent, [column]: list };
  });
}

/** Move a child from one column to another (append at the end by default). */
export function moveChildToColumn(
  layout: LayoutBlock[],
  parentId: string,
  fromColumn: ColumnKey,
  childIndex: number,
  toColumn: ColumnKey,
  toIndex?: number,
): LayoutBlock[] {
  if (fromColumn === toColumn) return layout;

  return layout.map((parent) => {
    if (blockKey(parent) !== parentId) return parent;

    const fromList = [...getColumnChildren(parent, fromColumn)];
    if (childIndex < 0 || childIndex >= fromList.length) return parent;

    const [moved] = fromList.splice(childIndex, 1);
    const toList = [...getColumnChildren(parent, toColumn)];
    const at =
      typeof toIndex === 'number'
        ? Math.max(0, Math.min(toIndex, toList.length))
        : toList.length;
    toList.splice(at, 0, moved);

    return {
      ...parent,
      [fromColumn]: fromList,
      [toColumn]: toList,
    };
  });
}
