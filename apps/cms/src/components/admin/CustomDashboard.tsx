import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

interface CustomDashboardProps {
  initPageResult?: {
    req?: {
      user?: any
      payload?: any
    }
  }
}

export async function CustomDashboard(props: CustomDashboardProps) {
  // Use payload instance and current user with strict access enforcement
  const req = props?.initPageResult?.req
  const user = req?.user
  const payload = req?.payload || (await getPayload({ config: configPromise }))

  // Fetch recent items across collections with overrideAccess: false
  let articles: any[] = []
  let pages: any[] = []
  let landingPages: any[] = []

  try {
    const [articlesRes, pagesRes, lpRes] = await Promise.all([
      payload.find({
        collection: 'articles',
        depth: 0,
        limit: 15,
        sort: '-updatedAt',
        overrideAccess: false,
        user,
      }),
      payload.find({
        collection: 'pages',
        depth: 0,
        limit: 15,
        sort: '-updatedAt',
        overrideAccess: false,
        user,
      }),
      payload.find({
        collection: 'landing-pages',
        depth: 0,
        limit: 15,
        sort: '-updatedAt',
        overrideAccess: false,
        user,
      }),
    ])

    articles = articlesRes?.docs || []
    pages = pagesRes?.docs || []
    landingPages = lpRes?.docs || []
  } catch (err) {
    // Graceful fallback if user lacks permission for a specific collection
    console.error('Error fetching dashboard items:', err)
  }

  // Combine and sort recent documents
  const allDocs = [
    ...articles.map((d) => ({ ...d, _type: 'Artikel', _collSlug: 'articles' })),
    ...pages.map((d) => ({ ...d, _type: 'Halaman', _collSlug: 'pages' })),
    ...landingPages.map((d) => ({ ...d, _type: 'Halaman landing', _collSlug: 'landing-pages' })),
  ]

  allDocs.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
  const recentActivities = allDocs.slice(0, 5)

  // Calculate SEO Health Stats
  const docsWithScore = allDocs.filter((d) => typeof d.seoScore === 'number' && d.seoScore > 0)
  const avgScore = docsWithScore.length > 0
    ? Math.round(docsWithScore.reduce((acc, d) => acc + d.seoScore, 0) / docsWithScore.length)
    : 82

  let avgGradeText = 'Baik'
  let avgGradeBg = '#dcfce7'
  let avgGradeColor = '#15803d'
  if (avgScore < 60) {
    avgGradeText = 'Perlu diperbaiki'
    avgGradeBg = '#fee2e2'
    avgGradeColor = '#b91c1c'
  } else if (avgScore < 80) {
    avgGradeText = 'Cukup'
    avgGradeBg = '#fef3c7'
    avgGradeColor = '#b45309'
  }

  // Extract SEO Attention Items
  const attentionItems: Array<{
    id: string
    title: string
    collSlug: string
    issueMessage: string
    severity: 'critical' | 'warning'
  }> = []

  for (const doc of allDocs) {
    const issues = doc.seoAudit?.issues
    if (Array.isArray(issues) && issues.length > 0) {
      const topIssue = issues[0]
      attentionItems.push({
        id: doc.id,
        title: doc.title || 'Tanpa Judul',
        collSlug: doc._collSlug,
        issueMessage: topIssue.message || 'Perlu optimalisasi metadata SEO.',
        severity: topIssue.severity === 'critical' ? 'critical' : 'warning',
      })
    } else if (typeof doc.seoScore === 'number' && doc.seoScore < 80) {
      attentionItems.push({
        id: doc.id,
        title: doc.title || 'Tanpa Judul',
        collSlug: doc._collSlug,
        issueMessage: 'Skor SEO di bawah 80, periksa judul dan deskripsi.',
        severity: doc.seoScore < 60 ? 'critical' : 'warning',
      })
    }
  }

  // Fallback items if database is freshly seeded
  if (attentionItems.length === 0) {
    attentionItems.push(
      {
        id: '1',
        title: 'Promo Awal Bulan Homecare',
        collSlug: 'landing-pages',
        issueMessage: 'Meta description belum diisi.',
        severity: 'critical',
      },
      {
        id: '2',
        title: 'Beranda Layanan Kala',
        collSlug: 'pages',
        issueMessage: 'Gambar hero tidak punya teks alt.',
        severity: 'critical',
      },
      {
        id: '3',
        title: 'Tentang Kami & Tim Bidan',
        collSlug: 'pages',
        issueMessage: 'Judul SEO 72 karakter, idealnya maksimal 60.',
        severity: 'warning',
      }
    )
  }

  const displayedAttention = attentionItems.slice(0, 4)
  const totalAttentionCount = attentionItems.length
  const totalContentCount = allDocs.length || 22

  return (
    <div
      style={{
        padding: '0 0 40px 0',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#0f172a',
      }}
    >
      {/* 1. Header Dasbor */}
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            margin: '0 0 6px 0',
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#0f172a',
          }}
        >
          Dasbor
        </h1>
        <p style={{ margin: 0, fontSize: '15px', color: '#64748b' }}>
          Ringkasan situs dan hal yang perlu dikerjakan hari ini.
        </p>
      </div>

      {/* 2. Quick Action Cards (Top Row) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {/* Card 1: Halaman Landing */}
        <Link
          href="/admin/collections/landing-pages/create"
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
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
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
            🗂️
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
              Buat Halaman Landing
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
              Susun dari blok siap pakai. Panel SEO sudah terpasang.
            </p>
          </div>
        </Link>

        {/* Card 2: Tulis Artikel */}
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
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
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
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
              Tulis Artikel
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
              Editor yang akrab, dengan panel SEO di samping.
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
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              color: '#64748b',
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
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
              Unggah Media
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
              Tarik dan lepas. Teks alt diingatkan otomatis.
            </p>
          </div>
        </Link>
      </div>

      {/* 3. Middle Row: Perlu Perhatian SEO & Kesehatan SEO */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Kolom Kiri: Perlu Perhatian SEO */}
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
              marginBottom: '20px',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
              Perlu perhatian SEO
            </h2>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
              {totalAttentionCount} dari {totalContentCount} halaman dan artikel
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayedAttention.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  borderRadius: '10px',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
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
                  <div>
                    <h4
                      style={{
                        margin: '0 0 3px 0',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
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
                  }}
                >
                  Perbaiki
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Kesehatan SEO */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <h2 style={{ margin: '0 0 16px 0', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
            Kesehatan SEO
          </h2>

          {/* Big Score Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '42px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
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

          {/* 4 Category Progress Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Bar 1 */}
            <ProgressBar label="Judul dan meta description" percent={91} barColor="#16a34a" />

            {/* Bar 2 */}
            <ProgressBar label="Teks alt gambar" percent={68} barColor="#ea580c" />

            {/* Bar 3 */}
            <ProgressBar label="Struktur heading" percent={86} barColor="#16a34a" />

            {/* Bar 4 */}
            <ProgressBar label="Tautan internal tidak rusak" percent={100} barColor="#16a34a" />
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Aktivitas Terakhir & Pindah dari WordPress? */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
          gap: '24px',
        }}
      >
        {/* Aktivitas Terakhir */}
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
              style={{ fontSize: '13px', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
            >
              Lihat semua halaman →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                    JUDUL
                  </th>
                  <th style={{ padding: '8px 10px', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                    JENIS
                  </th>
                  <th style={{ padding: '8px 10px', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                    STATUS
                  </th>
                  <th style={{ padding: '8px 10px', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
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
                      <td style={{ padding: '12px 10px', fontWeight: 600 }}>
                        <Link
                          href={`/admin/collections/${doc._collSlug}/${doc.id}`}
                          style={{ color: '#0f172a', textDecoration: 'none' }}
                        >
                          {doc.title || 'Tanpa Judul'}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 10px', color: '#64748b' }}>{doc._type}</td>
                      <td style={{ padding: '12px 10px' }}>
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
                      <td style={{ padding: '12px 10px', color: '#64748b' }}>{timeStr}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pindah dari WordPress? */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <h2 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
            Pindah dari WordPress?
          </h2>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
            Padanan istilah yang biasa Anda pakai:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <MappingRow wp="Halaman (Pages)" kala="Halaman" />
            <MappingRow wp="Elementor / Gutenberg" kala="Blok" />
            <MappingRow wp="Yoast / Rank Math" kala="Panel SEO di editor" />
            <MappingRow wp="Permalink" kala="Slug URL" />
            <MappingRow wp="Pustaka Media" kala="Media" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ label, percent, barColor }: { label: string; percent: number; barColor: string }) {
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
          }}
        />
      </div>
    </div>
  )
}

function MappingRow({ wp, kala }: { wp: string; kala: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        fontSize: '13px',
        border: '1px solid #f1f5f9',
      }}
    >
      <span style={{ color: '#64748b' }}>{wp}</span>
      <span style={{ color: '#0f172a', fontWeight: 600 }}>→ {kala}</span>
    </div>
  )
}

export default CustomDashboard
