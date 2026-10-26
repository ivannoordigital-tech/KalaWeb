'use client'

import React, { useMemo } from 'react'
import { useFormFields } from '@payloadcms/ui'
import { calculateSeoScore } from '../../lib/seo-engine/calculateSeoScore'
import { SEO_THRESHOLDS } from '../../lib/seo-engine/constants'
import type { NormalizedSeoInput } from '../../lib/seo-engine/types'

interface ChecklistItemData {
  id: string
  title: string
  hint: string
  status: 'passed' | 'warning' | 'critical'
}

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

  const { score, grade, isUnrated } = auditResult

  // Effective values for Google Snippet Preview
  const displayTitle = (metaTitle || title || 'Judul Halaman Belum Diisi').trim()
  const displayDesc = (
    metaDescription ||
    'Belum ada deskripsi meta. Google akan mengambil potongan teks pertama dari konten artikel Anda.'
  ).trim()
  const displaySlug = (slug || 'url-halaman').trim()

  // Length validations with centralized constants
  const effectiveTitle = (metaTitle || title).trim()
  const titleLen = effectiveTitle.length
  const descLen = metaDescription.trim().length

  // Grade badge styling
  let badgeBg = '#f1f5f9'
  let badgeColor = '#475569'
  let badgeText = 'Belum dinilai'

  if (!isUnrated && effectiveTitle.length > 0) {
    if (grade === 'good') {
      badgeBg = '#dcfce7'
      badgeColor = '#15803d'
      badgeText = 'Baik'
    } else if (grade === 'fair') {
      badgeBg = '#fef3c7'
      badgeColor = '#b45309'
      badgeText = 'Cukup'
    } else {
      badgeBg = '#fee2e2'
      badgeColor = '#b91c1c'
      badgeText = 'Perlu diperbaiki'
    }
  }

  // Build checklist items with 3 distinct states: passed, warning, critical
  const checklistItems: ChecklistItemData[] = useMemo(() => {
    const items: ChecklistItemData[] = []

    // 1. Judul SEO (Meta Title)
    if (titleLen === 0) {
      items.push({
        id: 'title',
        status: isUnrated ? 'warning' : 'critical',
        title: 'Judul artikel belum diisi',
        hint: `Masukkan judul 30–60 karakter untuk hasil pencarian Google yang optimal.`,
      })
    } else if (
      titleLen >= SEO_THRESHOLDS.TITLE_MIN_OPTIMAL &&
      titleLen <= SEO_THRESHOLDS.TITLE_MAX_OPTIMAL
    ) {
      items.push({
        id: 'title',
        status: 'passed',
        title: 'Panjang judul SEO optimal',
        hint: `${titleLen} karakter (ideal 30–60).`,
      })
    } else if (titleLen > SEO_THRESHOLDS.TITLE_MAX_OPTIMAL) {
      items.push({
        id: 'title',
        status: titleLen > SEO_THRESHOLDS.TITLE_MAX_ACCEPTABLE ? 'critical' : 'warning',
        title: 'Judul SEO terlalu panjang',
        hint: `${titleLen} karakter (berisiko terpotong di Google, maks 60).`,
      })
    } else {
      items.push({
        id: 'title',
        status: titleLen < SEO_THRESHOLDS.TITLE_MIN_ACCEPTABLE ? 'critical' : 'warning',
        title: 'Judul SEO agak pendek',
        hint: `${titleLen} karakter (tambahkan detail agar minimal 30 karakter).`,
      })
    }

    // 2. Meta Description
    if (descLen === 0) {
      items.push({
        id: 'desc',
        status: isUnrated ? 'warning' : 'critical',
        title: 'Meta description belum diisi',
        hint: `Tulis ringkasan 70–160 karakter agar Google tidak memilih cuplikan acak.`,
      })
    } else if (
      descLen >= SEO_THRESHOLDS.DESC_MIN_OPTIMAL &&
      descLen <= SEO_THRESHOLDS.DESC_MAX_OPTIMAL
    ) {
      items.push({
        id: 'desc',
        status: 'passed',
        title: 'Deskripsi SEO lengkap dan pas',
        hint: `${descLen} karakter (ideal 70–160).`,
      })
    } else if (descLen > SEO_THRESHOLDS.DESC_MAX_OPTIMAL) {
      items.push({
        id: 'desc',
        status: descLen > SEO_THRESHOLDS.DESC_MAX_ACCEPTABLE ? 'critical' : 'warning',
        title: 'Deskripsi SEO melebihi batas',
        hint: `${descLen} karakter (Google akan memotong kalimat di atas 160).`,
      })
    } else {
      items.push({
        id: 'desc',
        status: descLen < SEO_THRESHOLDS.DESC_MIN_ACCEPTABLE ? 'critical' : 'warning',
        title: 'Deskripsi SEO agak singkat',
        hint: `${descLen} karakter (tambahkan manfaat bagi Bunda, min 70).`,
      })
    }

    // 3. Kata Kunci Fokus
    const lowerKeyword = focusKeyword.trim().toLowerCase()
    const titleHasKeyword = Boolean(
      lowerKeyword && (metaTitle || title).toLowerCase().includes(lowerKeyword)
    )
    if (!lowerKeyword) {
      items.push({
        id: 'keyword',
        status: 'warning',
        title: 'Kata kunci fokus belum ditentukan',
        hint: 'Tentukan kata kunci target di kolom Kata Kunci Utama.',
      })
    } else if (titleHasKeyword) {
      items.push({
        id: 'keyword',
        status: 'passed',
        title: 'Kata kunci fokus ada di judul SEO',
        hint: `Kata kunci target "${focusKeyword}" terdeteksi pada judul.`,
      })
    } else {
      items.push({
        id: 'keyword',
        status: 'warning',
        title: 'Kata kunci belum ada di judul SEO',
        hint: `Sisipkan "${focusKeyword}" ke dalam judul agar relevansi Google lebih kuat.`,
      })
    }

    // 4. Struktur H1 Tunggal
    if (title.trim()) {
      items.push({
        id: 'h1',
        status: 'passed',
        title: 'Satu judul utama (H1) terdefinisi',
        hint: 'Template Astro otomatis menyematkan H1 tunggal untuk judul ini.',
      })
    } else {
      items.push({
        id: 'h1',
        status: isUnrated ? 'warning' : 'critical',
        title: 'Judul utama halaman belum ada (H1 hilang)',
        hint: 'Wajib ada judul utama sebagai acuan topik halaman.',
      })
    }

    // 5. Teks Alt Gambar Sampul
    const hasHero = Boolean(heroImage)
    const hasAlt = Boolean(heroImageAlt?.trim())
    if (hasHero && !hasAlt) {
      items.push({
        id: 'alt',
        status: 'critical',
        title: 'Foto sampul belum memiliki teks alt',
        hint: 'Teks alt wajib diisi untuk aksesibilitas disabilitas dan SEO Google Images.',
      })
    } else if (hasHero && hasAlt) {
      items.push({
        id: 'alt',
        status: 'passed',
        title: 'Teks alt foto sampul terisi',
        hint: 'Google dan pembaca layar dapat mengenali konteks gambar.',
      })
    } else {
      items.push({
        id: 'alt',
        status: 'warning',
        title: 'Foto sampul belum diunggah',
        hint: 'Sangat disarankan menyertakan foto sampul ber-alt text.',
      })
    }

    // 6. Format Slug URL
    const isValidSlug = Boolean(
      slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 50
    )
    if (!slug) {
      items.push({
        id: 'slug',
        status: 'warning',
        title: 'Slug URL belum dibuat',
        hint: 'Sistem akan otomatis membuat slug ramah Google dari judul saat disimpan.',
      })
    } else if (isValidSlug) {
      items.push({
        id: 'slug',
        status: 'passed',
        title: 'Slug URL bersih dan ramah SEO',
        hint: `Alamat tautan: /${slug}`,
      })
    } else {
      items.push({
        id: 'slug',
        status: 'critical',
        title: 'Format slug URL belum valid',
        hint: 'Gunakan hanya huruf kecil, angka, tanda hubung (-), dan maks 50 karakter.',
      })
    }

    // 7. Open Graph (OG) Image
    if (ogImage || heroImage) {
      items.push({
        id: 'og',
        status: 'passed',
        title: 'Gambar media sosial (OG) siap',
        hint: 'Gambar akan tampil saat tautan dibagikan ke WhatsApp / medsos.',
      })
    } else {
      items.push({
        id: 'og',
        status: 'warning',
        title: 'Gambar untuk dibagikan belum ada',
        hint: 'Unggah OG image atau foto sampul agar tautan di WhatsApp menarik.',
      })
    }

    // Sort order: critical first, then warning, then passed
    const severityWeight: Record<ChecklistItemData['status'], number> = {
      critical: 0,
      warning: 1,
      passed: 2,
    }

    return items.sort((a, b) => severityWeight[a.status] - severityWeight[b.status])
  }, [
    title,
    metaTitle,
    metaDescription,
    focusKeyword,
    slug,
    heroImage,
    heroImageAlt,
    ogImage,
    titleLen,
    descLen,
    isUnrated,
  ])

  const passedCount = checklistItems.filter((i) => i.status === 'passed').length
  const totalCount = checklistItems.length

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        marginBottom: '24px',
        fontFamily: 'inherit',
      }}
    >
      {/* 1. Header Skor SEO */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: isUnrated ? '#64748b' : '#0f172a',
                lineHeight: 1,
              }}
            >
              {isUnrated ? '—' : score}
            </span>
            <span style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>/ 100</span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            {isUnrated
              ? 'Belum ada konten untuk dinilai'
              : `${passedCount} dari ${totalCount} pemeriksaan lolos`}
          </p>
        </div>

        <span
          style={{
            padding: '6px 14px',
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
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: '#475569',
            marginBottom: '8px',
          }}
        >
          Pratinjau di Google
        </label>
        <div
          style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              K
            </span>
            <span style={{ fontSize: '13px', color: '#202124', wordBreak: 'break-all' }}>
              kalababyspa.com › {displaySlug}
            </span>
          </div>

          <div
            style={{
              fontSize: '17px',
              fontWeight: 500,
              color: '#1a0dab',
              cursor: 'pointer',
              marginBottom: '6px',
              lineHeight: 1.35,
            }}
          >
            {displayTitle}
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: '#4d5156',
              lineHeight: 1.5,
            }}
          >
            {displayDesc}
          </p>
        </div>
      </div>

      {/* 3. Penghitung Karakter Real-time Terstandar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Judul SEO Counter */}
        <div
          style={{
            padding: '10px 14px',
            backgroundColor:
              titleLen >= SEO_THRESHOLDS.TITLE_MIN_OPTIMAL &&
              titleLen <= SEO_THRESHOLDS.TITLE_MAX_OPTIMAL
                ? '#f0fdf4'
                : '#fffbeb',
            border: `1px solid ${
              titleLen >= SEO_THRESHOLDS.TITLE_MIN_OPTIMAL &&
              titleLen <= SEO_THRESHOLDS.TITLE_MAX_OPTIMAL
                ? '#bbf7d0'
                : '#fde68a'
            }`,
            borderRadius: '8px',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>Karakter Judul SEO:</span>
            <span
              style={{
                color:
                  titleLen >= SEO_THRESHOLDS.TITLE_MIN_OPTIMAL &&
                  titleLen <= SEO_THRESHOLDS.TITLE_MAX_OPTIMAL
                    ? '#15803d'
                    : '#b45309',
              }}
            >
              {titleLen} / {SEO_THRESHOLDS.TITLE_MAX_OPTIMAL} karakter
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
            {titleLen === 0
              ? `Belum diisi. Masukkan judul ${SEO_THRESHOLDS.TITLE_MIN_OPTIMAL}–${SEO_THRESHOLDS.TITLE_MAX_OPTIMAL} karakter.`
              : titleLen >= SEO_THRESHOLDS.TITLE_MIN_OPTIMAL &&
                titleLen <= SEO_THRESHOLDS.TITLE_MAX_OPTIMAL
              ? '🟢 Panjang pas untuk hasil pencarian Google.'
              : titleLen > SEO_THRESHOLDS.TITLE_MAX_OPTIMAL
              ? `⚠️ Melebihi ${SEO_THRESHOLDS.TITLE_MAX_OPTIMAL} karakter. Berisiko terpotong di Google.`
              : `⚠️ Agak pendek. Tambahkan detail agar minimal ${SEO_THRESHOLDS.TITLE_MIN_OPTIMAL} karakter.`}
          </div>
        </div>

        {/* Deskripsi Counter */}
        <div
          style={{
            padding: '10px 14px',
            backgroundColor:
              descLen >= SEO_THRESHOLDS.DESC_MIN_OPTIMAL &&
              descLen <= SEO_THRESHOLDS.DESC_MAX_OPTIMAL
                ? '#f0fdf4'
                : '#fffbeb',
            border: `1px solid ${
              descLen >= SEO_THRESHOLDS.DESC_MIN_OPTIMAL &&
              descLen <= SEO_THRESHOLDS.DESC_MAX_OPTIMAL
                ? '#bbf7d0'
                : '#fde68a'
            }`,
            borderRadius: '8px',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>Karakter Deskripsi:</span>
            <span
              style={{
                color:
                  descLen >= SEO_THRESHOLDS.DESC_MIN_OPTIMAL &&
                  descLen <= SEO_THRESHOLDS.DESC_MAX_OPTIMAL
                    ? '#15803d'
                    : '#b45309',
              }}
            >
              {descLen} / {SEO_THRESHOLDS.DESC_MAX_OPTIMAL} karakter
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
            {descLen === 0
              ? `Belum diisi. Tulis deskripsi ${SEO_THRESHOLDS.DESC_MIN_OPTIMAL}–${SEO_THRESHOLDS.DESC_MAX_OPTIMAL} karakter.`
              : descLen >= SEO_THRESHOLDS.DESC_MIN_OPTIMAL &&
                descLen <= SEO_THRESHOLDS.DESC_MAX_OPTIMAL
              ? '🟢 Panjang pas dan informatif untuk cuplikan Google.'
              : descLen > SEO_THRESHOLDS.DESC_MAX_OPTIMAL
              ? `⚠️ Melebihi ${SEO_THRESHOLDS.DESC_MAX_OPTIMAL} karakter. Google akan memotong bagian belakang.`
              : `⚠️ Agak pendek. Jelaskan keunggulan dan manfaat bagi Bunda (min ${SEO_THRESHOLDS.DESC_MIN_OPTIMAL} karakter).`}
          </div>
        </div>
      </div>

      {/* 4. Daftar Checklist Pemeriksaan SEO (Item Gagal/Kritis di Atas) */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <label
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#475569',
            }}
          >
            Checklist SEO ({passedCount}/{totalCount} Lolos)
          </label>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Urut dari prioritas tertinggi</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {checklistItems.map((item) => (
            <ChecklistItemRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

const ChecklistItemRow: React.FC<{ item: ChecklistItemData }> = ({ item }) => {
  let bg = '#f8fafc'
  let border = '#e2e8f0'
  let textColor = '#334155'
  let hintColor = '#64748b'
  let icon = '✅'

  if (item.status === 'critical') {
    bg = '#fef2f2'
    border = '#fecaca'
    textColor = '#991b1b'
    hintColor = '#b91c1c'
    icon = '🔴'
  } else if (item.status === 'warning') {
    bg = '#fffbeb'
    border = '#fde68a'
    textColor = '#92400e'
    hintColor = '#b45309'
    icon = '🟡'
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '10px 12px',
        borderRadius: '8px',
        backgroundColor: bg,
        border: `1px solid ${border}`,
      }}
    >
      <span style={{ marginTop: '1px', fontSize: '13px', lineHeight: 1 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 650, color: textColor, lineHeight: 1.35 }}>
          {item.title}
        </div>
        <div style={{ fontSize: '12px', color: hintColor, marginTop: '2px', lineHeight: 1.35 }}>
          {item.hint}
        </div>
      </div>
    </div>
  )
}

export default SeoPanelField
