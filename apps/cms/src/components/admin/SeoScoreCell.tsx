'use client'

import React from 'react'

interface SeoScoreCellProps {
  cellData?: number | null
  rowData?: {
    seoScore?: number | null
    seoAudit?: {
      score?: number | null
      grade?: string
    }
  }
}

export const SeoScoreCell: React.FC<SeoScoreCellProps> = ({ cellData, rowData }) => {
  const rawScore = typeof cellData === 'number' 
    ? cellData 
    : typeof rowData?.seoScore === 'number'
      ? rowData.seoScore
      : typeof rowData?.seoAudit?.score === 'number'
        ? rowData.seoAudit.score
        : null

  if (rawScore === null || rawScore === undefined) {
    return <span style={{ color: '#94a3b8', fontSize: '13px' }}>—</span>
  }

  const score = Math.round(rawScore)

  let bg = '#fee2e2'
  let text = '#b91c1c'
  let border = '#fca5a5'
  let label = 'Perlu diperbaiki'
  let dotColor = '#ef4444'

  if (score >= 80) {
    bg = '#dcfce7'
    text = '#15803d'
    border = '#86efac'
    label = 'Baik'
    dotColor = '#22c55e'
  } else if (score >= 60) {
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
      title={`Skor Audit SEO: ${score}/100 (${label})`}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block',
        }}
      />
      <span>{score} · {label}</span>
    </span>
  )
}

export default SeoScoreCell
