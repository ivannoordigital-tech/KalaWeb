import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import {
  articleSeoAdapter,
  pageSeoAdapter,
  landingPageSeoAdapter,
  calculateSeoScore,
  type SeoAuditResult,
} from '../../lib/seo-engine'
import { getDeployStatus } from '../../utilities/triggerDeployHook'

interface CustomDashboardProps {
  payload?: any
  user?: any
  initPageResult?: {
    req?: {
      user?: any
      payload?: any
    }
  }
}

export async function CustomDashboard(props?: CustomDashboardProps) {
  // Use payload instance with fallback
  const req = props?.initPageResult?.req
  const payload = props?.payload || req?.payload || (await getPayload({ config: configPromise }))

  // Fetch recent items across collections with overrideAccess: true for dashboard aggregation
  let articles: any[] = []
  let pages: any[] = []
  let landingPages: any[] = []

  try {
    const [articlesRes, pagesRes, lpRes] = await Promise.all([
      payload.find({
        collection: 'articles',
        depth: 1,
        limit: 50,
        sort: '-updatedAt',
        overrideAccess: true,
      }),
      payload.find({
        collection: 'pages',
        depth: 1,
        limit: 50,
        sort: '-updatedAt',
        overrideAccess: true,
      }),
      payload.find({
        collection: 'landing-pages',
        depth: 1,
        limit: 50,
        sort: '-updatedAt',
        overrideAccess: true,
      }),
    ])

    articles = articlesRes?.docs || []
    pages = pagesRes?.docs || []
    landingPages = lpRes?.docs || []
  } catch (err) {
    console.error('Error fetching dashboard items:', err)
  }

  // Combine and sort recent documents, filtering out test artifacts
  const rawDocs = [
    ...articles.map((d: any) => ({
      ...d,
      _type: 'Artikel Edukasi',
      _collSlug: 'articles',
      _adapter: () => articleSeoAdapter(d),
    })),
    ...pages.map((d: any) => {
      const isLanding = d.pageType === 'landing'
      const layoutLabel =
        d.pageLayout === 'canvas'
          ? ' (Kanvas Bersih)'
          : d.pageLayout === 'full_width'
          ? ' (Lebar Penuh)'
          : ''
      return {
        ...d,
        _type: isLanding ? `Halaman Penawaran${layoutLabel}` : `Halaman Informasi${layoutLabel}`,
        _collSlug: 'pages',
        _adapter: () => pageSeoAdapter(d),
      }
    }),
    ...landingPages.map((d: any) => ({
      ...d,
      _type: 'Halaman Penawaran Khusus',
      _collSlug: 'landing-pages',
      _adapter: () => landingPageSeoAdapter(d),
    })),
  ]

  // Filter out any leftover test documents
  const allDocs = rawDocs.filter((d: any) => {
    const title = (d.title || d.name || '').toLowerCase()
    return !title.startsWith('test ads') && !title.startsWith('test1')
  })

  // Sort recent activities by updatedAt descending
  allDocs.sort(
    (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  )
  const recentActivities = allDocs.slice(0, 6)

  // Real Dynamic SEO Audit Calculation (No Mock Data)
  interface AuditedItem {
    id: string | number
    title: string
    collSlug: string
    score: number
    grade: string
    isPublished: boolean
    issues: Array<{
      code: string
      severity: 'critical' | 'warning'
      message: string
      targetField?: string
    }>
    metrics: {
      titleScore: number
      descScore: number
      keywordScore: number
      h1Score: number
      altScore: number
      slugScore: number
      ogScore: number
    }
  }

  const auditedItems: AuditedItem[] = allDocs.map((doc: any) => {
    const isPublished = doc._status === 'published' || doc.status === 'published'

    if (doc.seoAudit?.score && doc.seoAudit?.metrics) {
      return {
        id: doc.id,
        title: doc.title || doc.name || 'Tanpa Judul',
        collSlug: doc._collSlug,
        score: doc.seoAudit.score,
        grade: doc.seoAudit.grade || 'fair',
        isPublished,
        issues: doc.seoAudit.issues || [],
        metrics: doc.seoAudit.metrics,
      }
    }

    const input = doc._adapter()
    const result: SeoAuditResult = calculateSeoScore(input)
    return {
      id: doc.id,
      title: doc.title || doc.name || 'Tanpa Judul',
      collSlug: doc._collSlug,
      score: result.score,
      grade: result.grade,
      isPublished,
      issues: result.issues || [],
      metrics: result.metrics,
    }
  })

  const totalContentCount = auditedItems.length
  const publishedItems = auditedItems.filter((i) => i.isPublished)
  const draftItems = auditedItems.filter((i) => !i.isPublished)

  // Calculate average score prioritizing published content
  const targetForScore = publishedItems.length > 0 ? publishedItems : auditedItems
  const avgScore =
    targetForScore.length > 0
      ? Math.round(targetForScore.reduce((acc, d) => acc + d.score, 0) / targetForScore.length)
      : 0

  let avgGradeText = 'Belum Ada Data'
  let avgGradeBg = '#f1f5f9'
  let avgGradeColor = '#475569'

  if (targetForScore.length > 0) {
    if (avgScore >= 80) {
      avgGradeText = 'Baik'
      avgGradeBg = '#dcfce7'
      avgGradeColor = '#15803d'
    } else if (avgScore >= 60) {
      avgGradeText = 'Cukup'
      avgGradeBg = '#fef3c7'
      avgGradeColor = '#b45309'
    } else {
      avgGradeText = 'Perlu diperbaiki'
      avgGradeBg = '#fee2e2'
      avgGradeColor = '#b91c1c'
    }
  }

  // Real Category Progress Percentages from actual metrics
  let titleDescPct = 0
  let imageAltPct = 0
  let headingPct = 0
  let keywordPct = 0

  if (totalContentCount > 0) {
    const rawTitleDesc =
      auditedItems.reduce(
        (sum, d) => sum + ((d.metrics.titleScore + d.metrics.descScore) / 40) * 100,
        0
      ) / totalContentCount
    const rawAlt =
      auditedItems.reduce((sum, d) => sum + (d.metrics.altScore / 15) * 100, 0) / totalContentCount
    const rawHeading =
      auditedItems.reduce((sum, d) => sum + (d.metrics.h1Score / 15) * 100, 0) / totalContentCount
    const rawKeyword =
      auditedItems.reduce(
        (sum, d) => sum + ((d.metrics.keywordScore + d.metrics.slugScore) / 25) * 100,
        0
      ) / totalContentCount

    titleDescPct = Math.min(100, Math.round(rawTitleDesc))
    imageAltPct = Math.min(100, Math.round(rawAlt))
    headingPct = Math.min(100, Math.round(rawHeading))
    keywordPct = Math.min(100, Math.round(rawKeyword))
  }

  // Real Attention Items: docs with issues or score < 80, sorted by severity
  const attentionItems: Array<{
    id: string | number
    title: string
    collSlug: string
    issueMessage: string
    severity: 'critical' | 'warning'
  }> = []

  for (const doc of auditedItems) {
    if (doc.issues.length > 0) {
      const topIssue = doc.issues.find((i) => i.severity === 'critical') || doc.issues[0]
      attentionItems.push({
        id: doc.id,
        title: doc.title,
        collSlug: doc.collSlug,
        issueMessage: topIssue.message,
        severity: topIssue.severity,
      })
    } else if (doc.score < 80) {
      attentionItems.push({
        id: doc.id,
        title: doc.title,
        collSlug: doc.collSlug,
        issueMessage: 'Skor SEO di bawah 80, periksa kelengkapan judul dan deskripsi.',
        severity: doc.score < 60 ? 'critical' : 'warning',
      })
    }
  }

  // Show top 3 attention items (per user specification: "Tampilkan 3 teratas + Lihat semua")
  const displayedAttention = attentionItems.slice(0, 3)
  const totalAttentionCount = attentionItems.length

  // Live Deploy Status & Last Published Timestamp
  const deployStatus = getDeployStatus()
  const latestPublishedDoc = allDocs.find(
    (d: any) => d._status === 'published' || d.status === 'published'
  )
  const lastActiveTimestamp =
    deployStatus.lastCompletedAt ||
    deployStatus.lastTriggeredAt ||
    latestPublishedDoc?.updatedAt ||
    null

  const lastActiveFormatted = lastActiveTimestamp
    ? new Date(lastActiveTimestamp).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div
      style={{
        padding: '24px 32px 48px 32px',
        maxWidth: '1280px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#0f172a',
      }}
    >
      {/* 1. Header Dasbor & Status Situs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div>
          <h1
            style={{
              margin: '0 0 6px 0',
              fontSize: '28px',
              fontWeight: 750,
              letterSpacing: '-0.02em',
              color: '#0f172a',
            }}
          >
            Dasbor
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
            Ringkasan performa situs dan hal yang perlu dikerjakan hari ini.
          </p>
        </div>

        {/* Status Penerbitan & Tautan Lihat Situs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: deployStatus.isBuilding
                ? '#fef3c7'
                : deployStatus.status === 'failed'
                ? '#fee2e2'
                : '#ecfdf5',
              color: deployStatus.isBuilding
                ? '#b45309'
                : deployStatus.status === 'failed'
                ? '#b91c1c'
                : '#047857',
              border: `1px solid ${
                deployStatus.isBuilding
                  ? '#fde68a'
                  : deployStatus.status === 'failed'
                  ? '#fca5a5'
                  : '#a7f3d0'
              }`,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: deployStatus.isBuilding
                  ? '#f59e0b'
                  : deployStatus.status === 'failed'
                  ? '#ef4444'
                  : '#10b981',
              }}
            />
            <span>
              {deployStatus.isBuilding
                ? `Membangun (~${deployStatus.estimatedSecondsRemaining}s)`
                : deployStatus.status === 'failed'
                ? 'Build Terakhir Gagal'
                : `Situs Aktif & Tayang${lastActiveFormatted ? ` (${lastActiveFormatted})` : ''}`}
            </span>
          </div>

          <a
            href="https://kalababyspa.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0f172a',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              textDecoration: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <span>🌐</span>
            <span>Lihat Website</span>
            <span style={{ color: '#64748b', fontSize: '12px' }}>↗</span>
          </a>
        </div>
      </div>

      {/* 2. Tiga Kartu Aksi Cepat Utama */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {/* Card 1: Tulis Artikel */}
        <Link
          href="/admin/collections/articles/create"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            textDecoration: 'none',
            color: 'inherit',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'border-color 0.15s ease',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            ✍️
          </div>
          <div>
            <h3
              style={{
                margin: '0 0 4px 0',
                fontSize: '16px',
                fontWeight: 650,
                color: '#0f172a',
              }}
            >
              Tulis Artikel Baru
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.45 }}>
              Publikasikan panduan kesehatan ibu dan buah hati dengan checklist SEO otomatis.
            </p>
          </div>
        </Link>

        {/* Card 2: Buat Halaman */}
        <Link
          href="/admin/collections/pages/create"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            textDecoration: 'none',
            color: 'inherit',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'border-color 0.15s ease',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            📄
          </div>
          <div>
            <h3
              style={{
                margin: '0 0 4px 0',
                fontSize: '16px',
                fontWeight: 650,
                color: '#0f172a',
              }}
            >
              Buat Halaman Baru
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.45 }}>
              Susun halaman informasi klinik atau halaman penawaran khusus kampanye iklan.
            </p>
          </div>
        </Link>

        {/* Card 3: Unggah Media */}
        <Link
          href="/admin/collections/media/create"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            textDecoration: 'none',
            color: 'inherit',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'border-color 0.15s ease',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            🖼️
          </div>
          <div>
            <h3
              style={{
                margin: '0 0 4px 0',
                fontSize: '16px',
                fontWeight: 650,
                color: '#0f172a',
              }}
            >
              Unggah Media
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.45 }}>
              Kompresi format WebP otomatis dan verifikasi teks alt aksesibilitas.
            </p>
          </div>
        </Link>
      </div>

      {/* 3. Baris Tengah: Perlu Perhatian SEO & Kesehatan SEO */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Kolom Kiri: Perlu Perhatian SEO (Maks 3 item + Lihat Semua) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
              Perlu perhatian SEO
            </h2>
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>
              {totalContentCount > 0
                ? `${totalAttentionCount} dari ${totalContentCount} konten`
                : 'Belum ada dokumen'}
            </span>
          </div>

          {/* Kondisi 1: Dokumen Perlu Perbaikan Ada */}
          {displayedAttention.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {displayedAttention.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    borderRadius: '10px',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: item.severity === 'critical' ? '#fee2e2' : '#fef3c7',
                        color: item.severity === 'critical' ? '#b91c1c' : '#b45309',
                        lineHeight: 1.2,
                        marginTop: '2px',
                        flexShrink: 0,
                      }}
                    >
                      {item.severity === 'critical' ? 'Penting' : 'Saran'}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <h4
                        style={{
                          margin: '0 0 3px 0',
                          fontSize: '14px',
                          fontWeight: 650,
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          color: '#475569',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.issueMessage}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/admin/collections/${item.collSlug}/${item.id}`}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#0f172a',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      flexShrink: 0,
                    }}
                  >
                    Perbaiki
                  </Link>
                </div>
              ))}

              {/* Tautan Lihat Semua jika lebih dari 3 isu */}
              {totalAttentionCount > 3 && (
                <div style={{ paddingTop: '8px', textAlign: 'right' }}>
                  <Link
                    href="/admin/collections/articles"
                    style={{
                      fontSize: '13px',
                      color: '#0284c7',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Lihat semua {totalAttentionCount} isu SEO selengkapnya →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Kondisi 2: Semua Konten Lolos SEO */}
          {totalContentCount > 0 && displayedAttention.length === 0 && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 16px',
                textAlign: 'center',
                backgroundColor: '#f0fdf4',
                borderRadius: '10px',
                border: '1px dashed #bbf7d0',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
              <h4
                style={{
                  margin: '0 0 6px 0',
                  fontSize: '15px',
                  fontWeight: 650,
                  color: '#15803d',
                }}
              >
                Semua Konten Memenuhi Standar SEO
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#166534',
                  maxWidth: '380px',
                  lineHeight: 1.45,
                }}
              >
                Seluruh {totalContentCount} halaman dan artikel telah memiliki metadata lengkap dan
                lolos standar Google.
              </p>
            </div>
          )}

          {/* Kondisi 3: Belum Ada Konten */}
          {totalContentCount === 0 && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 16px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '1px dashed #cbd5e1',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
              <h4
                style={{
                  margin: '0 0 6px 0',
                  fontSize: '15px',
                  fontWeight: 650,
                  color: '#0f172a',
                }}
              >
                Belum Ada Halaman atau Artikel
              </h4>
              <p
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '13px',
                  color: '#475569',
                  maxWidth: '380px',
                  lineHeight: 1.45,
                }}
              >
                Data audit SEO akan otomatis dihitung saat Anda mulai membuat artikel atau halaman
                pertama.
              </p>
              <Link
                href="/admin/collections/articles/create"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Tulis Artikel Pertama →
              </Link>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Kesehatan SEO (Dihitung dari Data Nyata) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
              Kesehatan SEO
            </h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {publishedItems.length} Terbit • {draftItems.length} Draf
            </span>
          </div>

          {/* Big Real Score Counter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span
                style={{
                  fontSize: '44px',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                {avgScore}
              </span>
              <span style={{ fontSize: '18px', color: '#64748b', fontWeight: 500 }}>/ 100</span>
            </div>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                backgroundColor: avgGradeBg,
                color: avgGradeColor,
              }}
            >
              {avgGradeText}
            </span>
          </div>

          {/* 4 Real Progress Bars (Calculated from Actual Database Metrics) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ProgressBar
              label="Judul dan meta description"
              percent={titleDescPct}
              barColor={titleDescPct >= 80 ? '#16a34a' : titleDescPct >= 60 ? '#f59e0b' : '#dc2626'}
            />
            <ProgressBar
              label="Teks alt gambar"
              percent={imageAltPct}
              barColor={imageAltPct >= 80 ? '#16a34a' : imageAltPct >= 60 ? '#f59e0b' : '#dc2626'}
            />
            <ProgressBar
              label="Struktur heading (H1)"
              percent={headingPct}
              barColor={headingPct >= 80 ? '#16a34a' : headingPct >= 60 ? '#f59e0b' : '#dc2626'}
            />
            <ProgressBar
              label="Kata kunci fokus & slug URL"
              percent={keywordPct}
              barColor={keywordPct >= 80 ? '#16a34a' : keywordPct >= 60 ? '#f59e0b' : '#dc2626'}
            />
          </div>

          <p
            style={{
              margin: '20px 0 0 0',
              fontSize: '12px',
              color: '#64748b',
              lineHeight: 1.4,
              borderTop: '1px solid #f1f5f9',
              paddingTop: '12px',
            }}
          >
            ⚡ Dihitung otomatis dari seluruh konten aktif di database.
          </p>
        </div>
      </div>

      {/* 4. Baris Bawah: Aktivitas Terakhir (Kiri) & Status Sistem & Panduan (Kanan) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '24px',
        }}
      >
        {/* Kolom Kiri: Aktivitas Terakhir */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
              Aktivitas terakhir
            </h2>
            <Link
              href="/admin/collections/pages"
              style={{
                fontSize: '13px',
                color: '#0284c7',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Lihat semua dokumen →
            </Link>
          </div>

          {recentActivities.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th
                      style={{
                        padding: '8px 10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#475569',
                      }}
                    >
                      JUDUL
                    </th>
                    <th
                      style={{
                        padding: '8px 10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#475569',
                      }}
                    >
                      JENIS
                    </th>
                    <th
                      style={{
                        padding: '8px 10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#475569',
                      }}
                    >
                      STATUS
                    </th>
                    <th
                      style={{
                        padding: '8px 10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#475569',
                      }}
                    >
                      DIPERBARUI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((doc, idx) => {
                    const status = doc._status || doc.status || 'published'
                    let statusLabel = 'Terbit'
                    let statusBg = '#dcfce7'
                    let statusColor = '#15803d'

                    if (status === 'draft') {
                      statusLabel = 'Draf'
                      statusBg = '#f1f5f9'
                      statusColor = '#475569'
                    } else if (status === 'scheduled') {
                      statusLabel = 'Terjadwal'
                      statusBg = '#fef3c7'
                      statusColor = '#b45309'
                    }

                    const timeStr = doc.updatedAt
                      ? new Date(doc.updatedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Hari ini'

                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid #f8fafc',
                          fontSize: '13px',
                        }}
                      >
                        <td
                          style={{
                            padding: '12px 10px',
                            fontWeight: 600,
                            maxWidth: '240px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          <Link
                            href={`/admin/collections/${doc._collSlug}/${doc.id}`}
                            style={{ color: '#0f172a', textDecoration: 'none' }}
                            title={doc.title || doc.name || 'Tanpa Judul'}
                          >
                            {doc.title || doc.name || 'Tanpa Judul'}
                          </Link>
                        </td>
                        <td
                          style={{
                            padding: '12px 10px',
                            color: '#475569',
                            fontSize: '12px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {doc._type}
                        </td>
                        <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: statusBg,
                              color: statusColor,
                            }}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '12px 10px',
                            color: '#475569',
                            fontSize: '12px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {timeStr}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{
                padding: '36px 16px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px dashed #e2e8f0',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📁</div>
              <h4
                style={{
                  margin: '0 0 4px 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0f172a',
                }}
              >
                Belum Ada Aktivitas Terbaru
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>
                Setiap perubahan atau pembuatan konten baru akan tercatat di sini secara otomatis.
              </p>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Status Sistem & Panduan Penerbitan */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
            Status Sistem & Panduan
          </h2>

          {/* Info Card 1: Penerbitan Otomatis */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '16px' }}>⚡</span>
              <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                Penerbitan Otomatis (Cloudflare Pages)
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.45 }}>
              Saat Anda menekan <strong>Terbitkan</strong> pada artikel atau halaman, Cloudflare
              otomatis membangun ulang website statis dalam 60–90 detik tanpa perlu tindakan teknis
              manual.
            </p>
          </div>

          {/* Info Card 2: Layanan WhatsApp Pasien */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '16px' }}>💬</span>
              <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                Integrasi Chat Reservasi WhatsApp
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.45 }}>
              Seluruh tombol WhatsApp pada halaman penawaran menyematkan kode referensi otomatis agar
              admin CS mengetahui sumber iklan pasien dengan tepat.
            </p>
          </div>

          {/* Info Card 3: Bantuan Operasional */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '8px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <Link
              href="/admin/collections/help-center"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>📖 Buka Pusat Bantuan & SOP Admin</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressBar({
  label,
  percent,
  barColor,
}: {
  label: string
  percent: number
  barColor: string
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '13px',
          marginBottom: '6px',
        }}
      >
        <span style={{ color: '#334155', fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 700, color: '#0f172a' }}>{percent}%</span>
      </div>
      <div
        style={{
          width: '100%',
          height: '7px',
          backgroundColor: '#e2e8f0',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: '9999px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}

export default CustomDashboard
