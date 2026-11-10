import type { Field } from 'payload';

/**
 * Token gaya yang aman untuk builder.
 *
 * Semua nilai dipetakan ke class Tailwind yang sudah ada di source code,
 * sehingga tidak ada class dinamis dari CMS yang gagal di-purge.
 */
export const commonStyleFields: Field[] = [
  {
    name: 'styleBackground',
    type: 'select',
    defaultValue: 'none',
    label: 'Latar Belakang',
    options: [
      { label: 'Transparan', value: 'none' },
      { label: 'Krem Hangat', value: 'cream' },
      { label: 'Putih Bersih', value: 'white' },
      { label: 'Peach Lembut', value: 'peach' },
      { label: 'Terracotta', value: 'terracotta' },
      { label: 'Cokelat Tua', value: 'dark' },
      { label: 'Gradasi Peach', value: 'gradient' },
    ],
  },
  {
    name: 'stylePadding',
    type: 'select',
    defaultValue: 'none',
    label: 'Padding',
    options: [
      { label: 'Tanpa Padding', value: 'none' },
      { label: 'Rapat', value: 'sm' },
      { label: 'Normal', value: 'md' },
      { label: 'Longgar', value: 'lg' },
      { label: 'Sangat Longgar', value: 'xl' },
    ],
  },
  {
    name: 'styleMargin',
    type: 'select',
    defaultValue: 'none',
    label: 'Margin Atas/Bawah',
    options: [
      { label: 'Tanpa Margin', value: 'none' },
      { label: 'Kecil', value: 'sm' },
      { label: 'Sedang', value: 'md' },
      { label: 'Besar', value: 'lg' },
    ],
  },
  {
    name: 'styleRadius',
    type: 'select',
    defaultValue: 'none',
    label: 'Sudut Melengkung',
    options: [
      { label: 'Kotak', value: 'none' },
      { label: 'Sedang', value: 'md' },
      { label: 'Besar', value: 'lg' },
      { label: 'Bulat Penuh', value: 'full' },
    ],
  },
  {
    name: 'styleShadow',
    type: 'select',
    defaultValue: 'none',
    label: 'Bayangan',
    options: [
      { label: 'Tanpa Bayangan', value: 'none' },
      { label: 'Halus', value: 'sm' },
      { label: 'Sedang', value: 'md' },
      { label: 'Kuat', value: 'lg' },
    ],
  },
  {
    name: 'styleAlign',
    type: 'select',
    defaultValue: 'left',
    label: 'Perataan Teks',
    options: [
      { label: 'Kiri', value: 'left' },
      { label: 'Tengah', value: 'center' },
      { label: 'Kanan', value: 'right' },
    ],
  },
  {
    name: 'styleMaxWidth',
    type: 'select',
    defaultValue: 'full',
    label: 'Lebar Maksimum',
    options: [
      { label: 'Sempit', value: 'narrow' },
      { label: 'Sedang', value: 'medium' },
      { label: 'Lebar', value: 'wide' },
      { label: 'Penuh', value: 'full' },
    ],
  },
  {
    name: 'styleTextColor',
    type: 'select',
    defaultValue: 'ink',
    label: 'Warna Teks',
    options: [
      { label: 'Cokelat Ink', value: 'ink' },
      { label: 'Cokelat Muted', value: 'muted' },
      { label: 'Terracotta', value: 'accent' },
      { label: 'Putih', value: 'white' },
    ],
  },
  {
    name: 'styleVisibility',
    type: 'select',
    defaultValue: 'all',
    label: 'Tampil Di',
    options: [
      { label: 'Semua Perangkat', value: 'all' },
      { label: 'Desktop Saja', value: 'desktop' },
      { label: 'Tablet Saja', value: 'tablet' },
      { label: 'Mobile Saja', value: 'mobile' },
    ],
  },
];
