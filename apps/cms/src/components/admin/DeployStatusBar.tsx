'use client'

import React, { useEffect, useState } from 'react'

interface DeployStatusResponse {
  status: 'idle' | 'triggered' | 'success' | 'failed'
  isBuilding: boolean
  estimatedSecondsRemaining: number
  lastTriggeredAt?: string
  lastCompletedAt?: string
  lastReason?: string
  error?: string
}

export const DeployStatusBar: React.FC = () => {
  const [deployInfo, setDeployInfo] = useState<DeployStatusResponse | null>(null)
  const [dismissed, setDismissed] = useState(false)

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/deploy-status')
      if (res.ok) {
        const data = await res.json()
        setDeployInfo(data)
      }
    } catch {
      // Ignore network errors on polling
    }
  }

  useEffect(() => {
    fetchStatus()
    // Poll more frequently if a build is active, otherwise poll every 25 seconds
    const intervalTime = deployInfo?.isBuilding ? 3500 : 25000
    const timer = setInterval(fetchStatus, intervalTime)
    return () => clearInterval(timer)
  }, [deployInfo?.isBuilding])

  if (!deployInfo) return null

  // If building
  if (deployInfo.isBuilding) {
    const seconds = deployInfo.estimatedSecondsRemaining || 45
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'linear-gradient(90deg, #FEF3C7 0%, #FDE68A 100%)',
          border: '1px solid #F59E0B',
          borderRadius: '8px',
          padding: '8px 14px',
          margin: '0 0 16px 0',
          fontSize: '13px',
          color: '#92400E',
          fontWeight: 500,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#D97706',
              animation: 'pulse 1.5s infinite',
            }}
          />
          <span>
            <strong>Cloudflare Pages Build:</strong> Perubahan sedang diproses ke website live (~{seconds} dtk tersisa)...
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#B45309' }}>
          {deployInfo.lastReason || 'Deploy otomatis'}
        </span>
      </div>
    )
  }

  // If recently triggered or success
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        background: '#F0FDF4',
        border: '1px solid #86EFAC',
        borderRadius: '8px',
        padding: '6px 12px',
        margin: '0 0 14px 0',
        fontSize: '12px',
        color: '#166534',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#22C55E',
          }}
        />
        <span>
          Website Live: <strong>kalababyspa.com</strong> (Aktif)
        </span>
      </div>
      <a
        href="https://kalababyspa.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#15803D',
          textDecoration: 'underline',
          fontWeight: 600,
          fontSize: '12px',
        }}
      >
        Lihat Website Live &rarr;
      </a>
    </div>
  )
}

export default DeployStatusBar
