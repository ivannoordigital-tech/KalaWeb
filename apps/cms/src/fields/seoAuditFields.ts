import type { Field } from 'payload'

export const seoScoreField: Field = {
  name: 'seoScore',
  type: 'number',
  label: 'Skor SEO',
  defaultValue: 0,
  access: {
    // Sembunyikan field audit dari API publik, hanya user terotentikasi yang boleh membaca
    read: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    position: 'sidebar',
    readOnly: true,
    hidden: false, // tetap tampil di form sebagai informasi read-only; diperlukan agar nilai ikut terkirim ke cell daftar
    description: 'Skor kesehatan SEO (0 - 100) yang dihitung otomatis saat dokumen disimpan.',
    components: {
      Cell: '/components/admin/SeoScoreCell#SeoScoreCell',
    },
  },
}

export const seoAuditFields: Field = {
  name: 'seoAudit',
  type: 'group',
  label: 'Hasil Audit SEO Otomatis',
  access: {
    // Sembunyikan data audit mentah dari API publik
    read: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    position: 'sidebar',
    hidden: true, // Disembunyikan dari form isian karena sudah ada visual panel interaktif
    description: 'Data skor kesehatan SEO dan daftar masalah yang dihasilkan otomatis oleh mesin audit.',
  },
  fields: [
    {
      name: 'score',
      type: 'number',
      defaultValue: 0,
      label: 'Skor Numerik (0 - 100)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'grade',
      type: 'select',
      defaultValue: 'poor',
      options: [
        { label: '🟢 Baik (80–100)', value: 'good' },
        { label: '🟡 Cukup (60–79)', value: 'fair' },
        { label: '🔴 Perlu Diperbaiki (0–59)', value: 'poor' },
      ],
      label: 'Tingkat Kesehatan SEO',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'issues',
      type: 'array',
      label: 'Daftar Masalah yang Terdeteksi',
      admin: {
        readOnly: true,
      },
      fields: [
        { name: 'code', type: 'text', label: 'Kode Masalah' },
        {
          name: 'severity',
          type: 'select',
          options: [
            { label: 'Kritis (Penting)', value: 'critical' },
            { label: 'Saran (Peringatan)', value: 'warning' },
          ],
          label: 'Tingkat Keparahan',
        },
        { name: 'message', type: 'text', label: 'Pesan Rekomendasi' },
        { name: 'targetField', type: 'text', label: 'Kolom Target' },
      ],
    },
    {
      name: 'engineVersion',
      type: 'text',
      defaultValue: '2.1.0',
      label: 'Versi Mesin Audit',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'metrics',
      type: 'group',
      label: 'Rincian Metrik Audit',
      admin: {
        readOnly: true,
      },
      fields: [
        { name: 'titleScore', type: 'number', defaultValue: 0 },
        { name: 'descScore', type: 'number', defaultValue: 0 },
        { name: 'keywordScore', type: 'number', defaultValue: 0 },
        { name: 'h1Score', type: 'number', defaultValue: 0 },
        { name: 'altScore', type: 'number', defaultValue: 0 },
        { name: 'slugScore', type: 'number', defaultValue: 0 },
        { name: 'ogScore', type: 'number', defaultValue: 0 },
        { name: 'contentScore', type: 'number', defaultValue: 0 },
        { name: 'wordCount', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'lastAuditedAt',
      type: 'date',
      label: 'Terakhir Diaudit',
      admin: {
        readOnly: true,
      },
    },
  ],
}
