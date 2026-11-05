'use client'

import React from 'react'

interface PriceCellProps {
  cellData?: number | string | null
}

export const PriceCell: React.FC<PriceCellProps> = ({ cellData }) => {
  if (cellData === null || cellData === undefined || cellData === '') {
    return <span style={{ color: '#94a3b8' }}>—</span>
  }

  const numeric = typeof cellData === 'number' ? cellData : Number(cellData)
  if (!Number.isFinite(numeric)) {
    return <span>{String(cellData)}</span>
  }

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      {new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(numeric)}
    </span>
  )
}

export default PriceCell
