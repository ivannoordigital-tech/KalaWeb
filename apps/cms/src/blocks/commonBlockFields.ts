import type { Field } from 'payload'

/**
 * Pengaturan umum yang dimiliki semua blok page builder.
 * Dibungkus dalam grup collapsible agar form blok tetap ringkas,
 * tetapi admin tetap punya kontrol anchor dan visibilitas per perangkat.
 */
export const blockSettingsFields: Field[] = [
  {
    type: 'collapsible',
    label: '⚙️ Pengaturan Blok (Anchor & Visibilitas)',
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: 'anchorId',
        type: 'text',
        label: 'ID Anchor Bagian (Opsional)',
        admin: {
          description:
            'Dipakai untuk tautan langsung ke bagian ini, contoh: paket-harga. Hanya huruf kecil, angka, dan tanda hubung.',
          placeholder: 'paket-harga',
        },
        validate: (val: any) => {
          if (!val) return true
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(val))) {
            return 'ID Anchor hanya boleh huruf kecil, angka, dan tanda hubung (contoh: paket-harga).'
          }
          return true
        },
      },
      {
        name: 'visibility',
        type: 'select',
        hasMany: true,
        label: 'Tampilkan di Perangkat',
        defaultValue: ['mobile', 'tablet', 'desktop'],
        options: [
          { label: '📱 Ponsel', value: 'mobile' },
          { label: '📲 Tablet', value: 'tablet' },
          { label: '💻 Desktop', value: 'desktop' },
        ],
        admin: {
          description:
            'Kosongkan pilihan untuk menyembunyikan blok ini sepenuhnya. Berguna untuk menyembunyikan bagian yang terlalu panjang di ponsel.',
        },
      },
    ],
  },
]
