'use client';

import { useCallback, useState } from 'react';
import { useDocumentInfo, useForm } from '@payloadcms/ui';

export type SaveIntent = 'draft' | 'publish';

export interface BuilderSaveApi {
  save: (intent: SaveIntent) => Promise<boolean>;
  isSaving: boolean;
  intent: SaveIntent | null;
  error: string | null;
  lastSavedAt: number | null;
  isNew: boolean;
  canSave: boolean;
  canPublish: boolean;
}

export function useBuilderSave(): BuilderSaveApi {
  const { submit, setModified } = useForm();
  const docInfo = useDocumentInfo();

  const [isSaving, setIsSaving] = useState(false);
  const [intent, setIntent] = useState<SaveIntent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const save = useCallback(
    async (next: SaveIntent): Promise<boolean> => {
      if (isSaving) return false;

      setIsSaving(true);
      setIntent(next);
      setError(null);

      try {
        // `submit` memakai `action` dari Form edit view (create & edit sama-sama benar).
        // Draft: boleh tidak valid (skipValidation) — sama seperti tombol Save Draft Payload.
        // Publish: validasi penuh dijalankan server & client.
        const result: any = await (submit as any)({
          overrides: { _status: next },
          skipValidation: next === 'draft',
        });

        const ok = Boolean(result?.res?.ok);

        if (!ok) {
          setError(
            next === 'publish'
              ? 'Penerbitan gagal. Periksa daftar kesalahan di banner merah.'
              : 'Penyimpanan gagal. Periksa daftar kesalahan di banner merah.',
          );
          return false;
        }

        setModified(false);
        setLastSavedAt(Date.now());
        return true;
      } catch (err) {
        setError((err as Error)?.message || 'Terjadi kesalahan tak terduga saat menyimpan.');
        return false;
      } finally {
        setIsSaving(false);
        setIntent(null);
      }
    },
    [isSaving, submit, setModified],
  );

  return {
    save,
    isSaving,
    intent,
    error,
    lastSavedAt,
    isNew: !docInfo?.id,
    canSave: docInfo?.hasSavePermission !== false,
    canPublish: docInfo?.hasPublishPermission === true,
  };
}
