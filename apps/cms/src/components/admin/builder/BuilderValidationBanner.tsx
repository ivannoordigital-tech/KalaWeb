'use client';

import React, { useMemo } from 'react';
import { AlertTriangle, ChevronRight, FormInput } from 'lucide-react';
import { useAllFormFields, useFormSubmitted } from '@payloadcms/ui';
import { parseBuilderFieldPath, humanizeBuilderField } from './validation-utils';
import type { LayoutBlock } from './useBuilderLayout';

interface BuilderValidationBannerProps {
  layout: LayoutBlock[];
  onFocusSection: (sectionId: string) => void;
  onOpenFormMode: () => void;
}

interface RowError {
  key: string;
  path: string;
  message: string;
  rowIndex: number | null;
  fieldPath: string;
}

export const BuilderValidationBanner: React.FC<BuilderValidationBannerProps> = ({
  layout,
  onFocusSection,
  onOpenFormMode,
}) => {
  const [fields] = useAllFormFields();
  const submitted = useFormSubmitted();

  const errors = useMemo<RowError[]>(() => {
    if (!submitted) return [];

    const out: RowError[] = [];
    for (const [path, state] of Object.entries(fields as Record<string, any>)) {
      if (!state || state.valid !== false) continue;

      const parsed = parseBuilderFieldPath(path);
      if (!parsed) continue;

      out.push({
        key: path,
        path,
        message: state.errorMessage || 'Nilai tidak valid.',
        rowIndex: parsed.rowIndex,
        fieldPath: parsed.fieldPath,
      });
    }
    return out;
  }, [fields, submitted]);

  if (!submitted || errors.length === 0) return null;

  const MAX_VISIBLE = 4;
  const visible = errors.slice(0, MAX_VISIBLE);
  const remaining = errors.length - visible.length;

  return (
    <div role="alert" className="shrink-0 bg-red-950/95 border-b border-red-800 px-4 py-2.5">
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="text-red-300 mt-0.5 shrink-0" aria-hidden="true" />

        <div className="min-w-0 flex-1">
          <p className="m-0 text-xs font-bold text-red-100">
            {errors.length} field perlu diperbaiki sebelum bisa disimpan/diterbitkan.
          </p>

          <ul className="mt-1.5 mb-0 list-none p-0 space-y-1">
            {visible.map((err) => {
              const block = err.rowIndex !== null ? layout[err.rowIndex] : null;
              const sectionId = block ? (block.id || block.blockType) : null;
              const sectionLabel = block
                ? `Seksi ${err.rowIndex! + 1} · ${block.blockType}`
                : 'Susunan seksi';

              return (
                <li key={err.key} className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-red-200 truncate">
                    <strong className="text-red-100">{sectionLabel}</strong>
                    {' → '}
                    {humanizeBuilderField(err.fieldPath)}: {err.message}
                  </span>

                  {sectionId && (
                    <button
                      type="button"
                      onClick={() => onFocusSection(String(sectionId))}
                      className="flex items-center gap-0.5 text-[11px] font-bold text-red-100 hover:text-white shrink-0 cursor-pointer"
                    >
                      Buka <ChevronRight size={12} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {remaining > 0 && (
            <p className="mt-1 mb-0 text-[11px] text-red-300">
              +{remaining} kesalahan lain. Buka mode formulir untuk melihat semuanya.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenFormMode}
          className="flex items-center gap-1 rounded-md border border-red-700 px-2 py-1 text-[11px] font-semibold text-red-100 hover:bg-red-900 shrink-0 cursor-pointer"
        >
          <FormInput size={12} />
          Mode Formulir
        </button>
      </div>
    </div>
  );
};
