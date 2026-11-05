'use client'

import React from 'react'
import { resolveSeoScore, type SeoMetricsLike } from '../../lib/seo-engine/display'

interface SeoScoreCellProps {
  cellData?: number | null
  rowData?: {
    seoScore?: number | null
    seoAudit?: {
      score?: number | null
      grade?: string
      metrics?: SeoMetricsLike | null
      lastAuditedAt?: string | null
    }
  }
}

export const SeoScoreCell: React.FC<SeoScoreCellProps> = ({ cellData, rowData }) => {
  const score = resolveSeoScore({
    cellData,
    seoScore: rowData?.seoScore,
    auditScore: rowData?.seoAudit?.score,
    metrics: rowData?.seoAudit?.metrics,
    lastAuditedAt: rowData?.seoAudit?.lastAuditedAt,
  })

  if (score === null) {
    return (
      <span
        title="Belum ada audit SEO yang valid. Simpan dokumen atau jalankan audit ulang."
        aria-label="Belum diaudit"
        style={{ color: '#94a3b8', fontSize: '13px' }}
      >
        —
      </span>
    )
  }

  const rounded = Math.round(score)

  let bg = '#fee2e2'
  let text = '#b91c1c'
  let border = '#fca5a5'
  let label = 'Perlu diperbaiki'
  let dotColor = '#ef4444'

  if (rounded >= 80) {
    bg = '#dcfce7'
    text = '#15803d'
    border = '#86efac'
    label = 'Baik'
    dotColor = '#22c55e'
  } else if (rounded >= 60) {
    bg = '#fef3c7'
    text = '#b45309'
    border = '#fcd34d'
    label = 'Cukup'
    dotColor = '#f59e0b'
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
      title={`Skor Audit SEO: ${rounded}/100 (${label})`}
      aria-label={`Skor SEO ${rounded} dari 100, ${label}`}
    >
      <span
        aria-hidden="true"
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block',
        }}
      />
      <span>{rounded} · {label}</span>
    </span>
  )
}

export default SeoScoreCell
