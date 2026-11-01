import React from 'react'
import Link from 'next/link'

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '16px',
  borderRadius: 12,
  border: '1px solid var(--theme-elevation-150, #e2e8f0)',
  background: 'var(--theme-elevation-0, #ffffff)',
  textDecoration: 'none',
  color: 'inherit',
}

const TITLE_STYLE: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--theme-text, #0f172a)',
}

const BODY_STYLE: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.5,
  color: 'var(--theme-elevation-600, #475569)',
}

export function PageTypeGuide() {
  return (
    <div
      style={{
        margin: '0 0 20px 0',
        padding: '18px 20px',
        borderRadius: 14,
        border: '1px solid var(--theme-elevation-150, #e2e8f0)',
        background: 'var(--theme-elevation-50, #f8fafc)',
      }}
    >
      <h2 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 700, color: 'var(--theme-text, #0f172a)' }}>
        Mau membuat halaman apa?
      </h2>
      <p style={{ ...BODY_STYLE, marginBottom: 14 }}>
        Pilih jenis halaman yang sesuai dengan kebutuhan Anda. Pemilihan yang tepat memastikan pelacakan iklan
        dan optimasi mesin pencari berjalan maksimal.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <Link href="/admin/collections/pages/create?pageType=info" style={CARD_STYLE}>
          <span style={{ fontSize: 18 }} aria-hidden="true">📄</span>
          <h3 style={TITLE_STYLE}>Halaman Informasi</h3>
          <p style={BODY_STYLE}>
            Tentang Kami, Profil Klinik, Layanan, Syarat & Ketentuan. Fokus pada kelengkapan informasi tanpa pelacakan iklan.
          </p>
        </Link>

        <Link href="/admin/collections/landing-pages/create" style={CARD_STYLE}>
          <span style={{ fontSize: 18 }} aria-hidden="true">🎯</span>
          <h3 style={TITLE_STYLE}>Landing Page Iklan</h3>
          <p style={BODY_STYLE}>
            Kampanye promo berbayar (Meta/Google Ads). Dilengkapi kode promo, tombol WhatsApp langsung, dan pelacakan CAPI.
          </p>
        </Link>

        <Link href="/admin/collections/page-templates" style={CARD_STYLE}>
          <span style={{ fontSize: 18 }} aria-hidden="true">🧩</span>
          <h3 style={TITLE_STYLE}>Mulai dari Template</h3>
          <p style={BODY_STYLE}>
            Gunakan susunan halaman siap pakai yang sudah teruji. Ideal untuk membuat promosi baru dengan cepat.
          </p>
        </Link>
      </div>

      <p style={{ ...BODY_STYLE, marginTop: 12 }}>
        Butuh bantuan? Silakan buka{' '}
        <Link href="/admin/collections/help-center" style={{ color: 'var(--theme-success-600, #0d9488)', fontWeight: 600 }}>
          Pusat Bantuan
        </Link>.
      </p>
    </div>
  )
}
