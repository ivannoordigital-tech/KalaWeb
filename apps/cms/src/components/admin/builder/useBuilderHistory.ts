'use client';

import { useState, useCallback, useEffect } from 'react';

const MAX_HISTORY = 20;

export function useBuilderHistory<T>(initialState: T, onApply: (state: T) => void) {
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const pushSnapshot = useCallback((currentState: T) => {
    setPast((prev) => {
      const next = [...prev, structuredClone(currentState)];
      if (next.length > MAX_HISTORY) {
        return next.slice(next.length - MAX_HISTORY);
      }
      return next;
    });
    setFuture([]);
  }, []);

  const undo = useCallback((currentLayout: T) => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      const newPast = prevPast.slice(0, prevPast.length - 1);

      setFuture((prevFuture) => [structuredClone(currentLayout), ...prevFuture]);
      onApply(structuredClone(previous));
      return newPast;
    });
  }, [onApply]);

  const redo = useCallback((currentLayout: T) => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;
      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);

      setPast((prevPast) => [...prevPast, structuredClone(currentLayout)]);
      onApply(structuredClone(next));
      return newFuture;
    });
  }, [onApply]);

  const resetHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);

  return {
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    pushSnapshot,
    undo,
    redo,
    resetHistory,
  };
}
