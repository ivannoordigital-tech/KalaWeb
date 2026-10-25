'use client'

import React from 'react'

export const WelcomeDashboard: React.FC = () => {
  const quickActions = [
    {
      title: '🏠 Edit Konten Beranda',
      desc: 'Ubah teks judul hero, keluhan, manfaat, promo, & alur reservasi di halaman depan.',
      href: '/admin/globals/site-settings',
      badge: 'Utama',
      color: '#C2552B',
      bgColor: '#FFF9F4',
      borderColor: '#F6DCCD',
    },
    {
      title: '🏥 Tarif & Layanan Homecare',
      desc: 'Perbarui harga paket, durasi waktu, harga coret promo, dan badge rekomendasi.',
      href: '/admin/collections/services',
      color: '#15803D',
      bgColor: '#F0FDF4',
      borderColor: '#BBF7D0',
    },
    {
      title: '💬 Cerita & Testimoni Bunda',
      desc: 'Kelola ulasan nyata terverifikasi dari Bunda di Surabaya & Sidoarjo.',
      href: '/admin/collections/testimonials',
      color: '#0369A1',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD',
    },
    {
      title: '✍️ Artikel Edukasi & Blog',
      desc: 'Tulis panduan medis terpercaya untuk Bunda dengan standar nakes ber-STR.',
      href: '/admin/collections/articles',
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE',
    },
    {
      title: '📢 Landing Page Iklan (LP)',
      desc: 'Susun halaman kampanye iklan Meta/Google Ads menggunakan template blok visual.',
      href: '/admin/collections/landing-pages',
      color: '#B45309',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A',
    },
    {
      title: '📖 SOP & Panduan Operasional',
      desc: 'Pelajari petunjuk penulisan konten medis, etika iklan, dan integrasi WhatsApp.',
      href: '/admin/collections/help-center',
      color: '#475569',
      bgColor: '#F8FAFC',
      borderColor: '#E2E8F0',
    },
  ]

  return (
    <div
      style={{
        marginBottom: '28px',
        padding: '24px',
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div style={{ marginBottom: '18px' }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#1E293B',
            margin: '0 0 6px 0',
          }}
        >
          🌸 Selamat Datang di Admin Panel Kala Moms & Baby Spa
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
          Pusat kendali operasional, harga paket, artikel edukasi, dan konten website resmi <strong>kalababyspa.com</strong>.
          Pilih menu cepat di bawah untuk mulai mengelola:
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
        }}
      >
        {quickActions.map((action, idx) => (
          <a
            key={idx}
            href={action.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: action.bgColor,
              border: `1px solid ${action.borderColor}`,
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: action.color,
                  }}
                >
                  {action.title}
                </span>
                {action.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: action.color,
                      color: '#FFFFFF',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {action.badge}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: '#475569',
                  margin: 0,
                  lineHeight: 1.45,
                }}
              >
                {action.desc}
              </p>
            </div>
            <div
              style={{
                marginTop: '10px',
                fontSize: '11px',
                fontWeight: 600,
                color: action.color,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Buka Pengaturan &rarr;
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default WelcomeDashboard
