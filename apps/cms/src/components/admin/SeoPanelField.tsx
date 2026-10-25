'use client'

import React, { useMemo } from 'react'
import { useFormFields } from '@payloadcms/ui'
import { calculateSeoScore } from '../../lib/seo-engine/calculateSeoScore'
import type { NormalizedSeoInput } from '../../lib/seo-engine/types'

export const SeoPanelField: React.FC = () => {
  // Read form state using Payload's useFormFields hook
  const title = (useFormFields(([fields]) => fields?.title?.value) as string) || ''
  const metaTitle = (useFormFields(([fields]) => fields?.['seo.metaTitle']?.value) as string) || ''
  const metaDescription = (useFormFields(([fields]) => fields?.['seo.metaDescription']?.value) as string) || ''
  const focusKeyword = (useFormFields(([fields]) => fields?.['seo.focusKeyword']?.value) as string) || ''
  const slug = (useFormFields(([fields]) => fields?.slug?.value) as string) || ''
  const ogImage = useFormFields(([fields]) => fields?.['seo.ogImage']?.value)
  const heroImage = useFormFields(([fields]) => fields?.heroImage?.value)
  const heroImageAlt = (useFormFields(([fields]) => fields?.heroImageAlt?.value) as string) || ''

  // Compute live SEO audit result
  const auditResult = useMemo(() => {
    const hasHero = Boolean(heroImage)
    const hasAlt = Boolean(heroImageAlt?.trim())
    const hasOg = Boolean(ogImage || heroImage)

    const input: NormalizedSeoInput = {
      title,
      metaTitle,
      metaDescription,
      focusKeyword,
      slug,
      hasOgImage: hasOg,
      h1Count: title.trim() ? 1 : 0,
      totalImages: hasHero ? 1 : 0,
      imagesWithoutAltCount: hasHero && !hasAlt ? 1 : 0,
      wordCount: 300, // Client preview estimate
    }

    return calculateSeoScore(input)
  }, [title, metaTitle, metaDescription, focusKeyword, slug, ogImage, heroImage, heroImageAlt])

  const { score, grade, issues } = auditResult

  // Effective values for Google Snippet Preview
  const displayTitle = (metaTitle || title || 'Judul Halaman Belum Diisi').trim()
  const displayDesc = (metaDescription || 'Belum ada deskripsi. Google akan memilih potongan teks sendiri dari konten halaman Anda.').trim()
  const displaySlug = (slug || 'url-halaman').trim()

  // Length validations
  const titleLen = (metaTitle || title).trim().length
  const descLen = metaDescription.trim().length

  // Grade badge styling
  let badgeBg = '#fee2e2'
  let badgeColor = '#b91c1c'
  let badgeText = 'Perlu diperbaiki'
  if (grade === 'good') {
    badgeBg = '#dcfce7'
    badgeColor = '#15803d'
    badgeText = 'Baik'
  } else if (grade === 'fair') {
    badgeBg = '#fef3c7'
    badgeColor = '#b45309'
    badgeText = 'Cukup'
  }

  // Count passed checks (7 total checks)
  const passedChecksCount = Math.max(0, 7 - issues.length)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '18px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: '20px',
        fontFamily: 'inherit',
      }}
    >
      {/* 1. Header Skor SEO */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '14px',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>/ 100</span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
            {passedChecksCount} dari 7 pemeriksaan lolos
          </p>
        </div>

        <span
          style={{
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: badgeBg,
            color: badgeColor,
            lineHeight: 1.2,
          }}
        >
          {badgeText}
        </span>
      </div>

      {/* 2. Pratinjau Tampilan di Google */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#64748b',
            marginBottom: '8px',
          }}
        >
          Tampilan di Google
        </label>
        <div
          style={{
            padding: '14px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
              }}
            >
              K
            </span>
            <span style={{ fontSize: '12px', color: '#202124', wordBreak: 'break-all' }}>
              kalababyspa.com › {displaySlug}
            </span>
          </div>

          <div
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#1a0dab',
              cursor: 'pointer',
              marginBottom: '4px',
              lineHeight: 1.3,
            }}
          >
            {displayTitle}
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: '#4d5156',
              lineHeight: 1.45,
            }}
          >
            {displayDesc}
          </p>
        </div>
      </div>

      {/* 3. Penghitung Karakter Real-time */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Judul SEO Counter */}
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: titleLen >= 30 && titleLen <= 60 ? '#f0fdf4' : '#fffbeb',
            border: `1px solid ${titleLen >= 30 && titleLen <= 60 ? '#bbf7d0' : '#fde68a'}`,
            borderRadius: '8px',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>Karakter Judul SEO:</span>
            <span style={{ color: titleLen >= 30 && titleLen <= 60 ? '#15803d' : '#b45309' }}>
              {titleLen} / 60 karakter
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            {titleLen === 0
              ? 'Belum diisi. Masukkan judul 30–60 karakter.'
              : titleLen >= 30 && titleLen <= 60
                ? '🟢 Panjang pas untuk hasil pencarian Google.'
                : titleLen > 60
                  ? '⚠️ Melebihi 60 karakter. Berisiko terpotong di Google.'
                  : '⚠️ Agak pendek. Tambahkan detail agar lebih menarik di Google.'}
          </div>
        </div>

        {/* Deskripsi Counter */}
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: descLen >= 120 && descLen <= 155 ? '#f0fdf4' : '#fffbeb',
            border: `1px solid ${descLen >= 120 && descLen <= 155 ? '#bbf7d0' : '#fde68a'}`,
            borderRadius: '8px',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>Karakter Deskripsi:</span>
            <span style={{ color: descLen >= 120 && descLen <= 155 ? '#15803d' : '#b45309' }}>
              {descLen} / 155 karakter
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            {descLen === 0
              ? 'Belum diisi. Tulis deskripsi 120–155 karakter.'
              : descLen >= 120 && descLen <= 155
                ? '🟢 Panjang pas dan informatif untuk hasil pencarian.'
                : descLen > 155
                  ? '⚠️ Melebihi 155 karakter. Google akan memotong bagian belakang.'
                  : '⚠️ Kurang dari 120 karakter. Jelaskan manfaat utama bagi Bunda.'}
          </div>
        </div>
      </div>

      {/* 4. Daftar Checklist Pemeriksaan SEO */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#64748b',
            marginBottom: '8px',
          }}
        >
          Pemeriksaan SEO ({passedChecksCount}/7 Lolos)
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Item 1: Judul SEO */}
          <ChecklistItem
            ok={titleLen >= 30 && titleLen <= 60}
            title={titleLen >= 30 && titleLen <= 60 ? 'Panjang judul SEO sudah pas' : 'Panjang judul SEO belum optimal'}
            hint={titleLen >= 30 && titleLen <= 60 ? 'Ideal 30–60 karakter.' : `${titleLen} karakter (target 30–60).`}
          />

          {/* Item 2: Meta Description */}
          <ChecklistItem
            ok={descLen >= 120 && descLen <= 155}
            title={descLen >= 120 && descLen <= 155 ? 'Deskripsi SEO lengkap dan pas' : 'Meta description belum optimal'}
            hint={
              descLen === 0
                ? 'Tanpa ini, Google memilih potongan teks sendiri.'
                : `${descLen} karakter (target 120–155).`
            }
          />

          {/* Item 3: Kata Kunci Fokus */}
          <ChecklistItem
            ok={Boolean(focusKeyword && (metaTitle || title).toLowerCase().includes(focusKeyword.toLowerCase()))}
            title={
              focusKeyword && (metaTitle || title).toLowerCase().includes(focusKeyword.toLowerCase())
                ? 'Kata kunci fokus ada di judul SEO'
                : 'Kata kunci fokus belum ada di judul SEO'
            }
            hint={
              focusKeyword
                ? `Kata kunci target: "${focusKeyword}"`
                : 'Tentukan kata kunci fokus di kolom bawah.'
            }
          />

          {/* Item 4: Struktur H1 Tunggal */}
          <ChecklistItem
            ok={Boolean(title.trim())}
            title={title.trim() ? 'Hanya ada satu judul utama (H1)' : 'Judul halaman belum diisi (H1 hilang)'}
            hint="Sistem template Astro otomatis menyematkan H1 tunggal."
          />

          {/* Item 5: Teks Alt Gambar */}
          <ChecklistItem
            ok={!heroImage || Boolean(heroImageAlt?.trim())}
            title={
              !heroImage || heroImageAlt?.trim()
                ? 'Teks alt gambar sampul sudah diisi'
                : 'Gambar hero belum punya teks alt'
            }
            hint="Dibaca mesin pencari Google dan pembaca layar disabilitas."
          />

          {/* Item 6: Slug URL */}
          <ChecklistItem
            ok={Boolean(slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 50)}
            title={
              slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 50
                ? 'Slug singkat dan deskriptif'
                : 'Format slug URL perlu diperbaiki'
            }
            hint="Hanya huruf kecil, angka, tanda hubung, dan maksimal 50 karakter."
          />

          {/* Item 7: Open Graph Image */}
          <ChecklistItem
            ok={Boolean(ogImage || heroImage)}
            title={
              ogImage || heroImage
                ? 'Gambar untuk media sosial (OG) siap'
                : 'Gambar untuk dibagikan (Open Graph) belum diatur'
            }
            hint="Dipakai saat tautan dibagikan ke WhatsApp, Instagram, atau Facebook."
          />
        </div>
      </div>
    </div>
  )
}

interface ChecklistItemProps {
  ok: boolean
  title: string
  hint?: string
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ ok, title, hint }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        padding: '8px 10px',
        borderRadius: '6px',
        backgroundColor: ok ? '#f8fafc' : '#fff7ed',
        border: `1px solid ${ok ? '#f1f5f9' : '#fed7aa'}`,
      }}
    >
      <span
        style={{
          marginTop: '2px',
          fontSize: '13px',
          color: ok ? '#16a34a' : '#ea580c',
          lineHeight: 1,
        }}
      >
        {ok ? '✅' : '⚠️'}
      </span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: ok ? '#334155' : '#9a3412',
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        {hint && (
          <div
            style={{
              fontSize: '11px',
              color: ok ? '#64748b' : '#c2410c',
              marginTop: '2px',
              lineHeight: 1.3,
            }}
          >
            {hint}
          </div>
        )}
      </div>
    </div>
  )
}

export default SeoPanelField
