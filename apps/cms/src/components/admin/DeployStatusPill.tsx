'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDocumentInfo } from '@payloadcms/ui';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeployStatusResponse {
  status: 'idle' | 'triggered' | 'success' | 'failed';
  isBuilding: boolean;
  estimatedSecondsRemaining: number;
  lastTriggeredAt?: string;
  lastCompletedAt?: string;
  error?: string;
}

export const DeployStatusPill: React.FC = () => {
  const docInfo = useDocumentInfo();
  const [data, setData] = useState<DeployStatusResponse | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/deploy-status', { cache: 'no-store' });
      if (!res.ok) return;
      setData((await res.json()) as DeployStatusResponse);
    } catch {
      /* informatif */
    }
  }, []);

  // Muat saat mount & setiap dokumen selesai disimpan
  useEffect(() => {
    void load();
  }, [load, (docInfo as any)?.lastUpdateTime]);

  // Polling hanya saat membangun
  useEffect(() => {
    if (!data?.isBuilding) return;
    const timer = setInterval(() => {
      void load();
    }, 15000);
    return () => clearInterval(timer);
  }, [data?.isBuilding, load]);

  const label = useMemo(() => {
    if (!data) return null;
    if (data.status === 'failed') return 'Deploy terakhir gagal';
    if (data.isBuilding) return `Sedang tayang… ±${Math.max(0, data.estimatedSecondsRemaining)} dtk`;
    if (data.status === 'success' || data.status === 'triggered') return 'Perubahan sudah tayang';
    return null;
  }, [data]);

  if (!docInfo?.id || !label) return null;

  const tone =
    data?.status === 'failed'
      ? {
          bg: 'var(--theme-error-50, #fef2f2)',
          border: 'var(--theme-error-500, #ef4444)',
          text: 'var(--theme-error-600, #dc2626)',
        }
      : data?.isBuilding
      ? {
          bg: 'var(--theme-warning-50, #fffbeb)',
          border: 'var(--theme-warning-500, #f59e0b)',
          text: 'var(--theme-warning-600, #d97706)',
        }
      : {
          bg: 'var(--theme-success-50, #f0fdf4)',
          border: 'var(--theme-success-500, #10b981)',
          text: 'var(--theme-success-600, #059669)',
        };

  return (
    <div
      role="status"
      aria-live="polite"
      title={data?.error || data?.lastCompletedAt || ''}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        border: `1px solid ${tone.border}`,
        background: tone.bg,
        color: tone.text,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {data?.status === 'failed' ? (
        <AlertTriangle size={12} />
      ) : data?.isBuilding ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <CheckCircle2 size={12} />
      )}
      {label}
    </div>
  );
};
