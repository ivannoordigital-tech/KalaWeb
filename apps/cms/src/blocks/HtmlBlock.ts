import type { Block } from 'payload'
import { blockSettingsFields } from './commonBlockFields'

export const HtmlBlock: Block = {
  slug: 'html',
  labels: {
    singular: 'HTML Kustom (Advanced)',
    plural: 'HTML Kustom (Advanced)',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Nama Blok (Penanda Admin)',
      admin: {
        description: 'Hanya tampil di admin, tidak tampil di website.',
        placeholder: 'Embed Google Ads / Form Pihak Ketiga',
      },
    },
    {
      name: 'html',
      type: 'code',
      required: true,
      label: 'Kode HTML',
      admin: {
        language: 'html',
        description:
          'Tempel HTML/CSS di sini. Demi keamanan, tag <script>, <iframe>, <form>, <style>, event handler (onclick dll), dan URL javascript: akan dibuang otomatis saat halaman dirender. Gunakan atribut style inline atau class Tailwind untuk styling.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'maxWidth',
          type: 'select',
          defaultValue: 'normal',
          label: 'Lebar Maksimal',
          admin: { width: '50%' },
          options: [
            { label: 'Sempit (768px)', value: 'narrow' },
            { label: 'Normal (1152px)', value: 'normal' },
            { label: 'Lebar (1280px)', value: 'wide' },
            { label: 'Penuh Layar', value: 'full' },
          ],
        },
        {
          name: 'padding',
          type: 'select',
          defaultValue: 'normal',
          label: 'Jarak Atas-Bawah',
          admin: { width: '50%' },
          options: [
            { label: 'Tanpa Jarak', value: 'none' },
            { label: 'Rapat', value: 'compact' },
            { label: 'Normal', value: 'normal' },
            { label: 'Longgar', value: 'spacious' },
          ],
        },
      ],
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'transparent',
      label: 'Latar Belakang',
      options: [
        { label: 'Transparan', value: 'transparent' },
        { label: 'Putih', value: 'white' },
        { label: 'Krem', value: 'cream' },
        { label: 'Peach', value: 'peach' },
      ],
    },
    ...blockSettingsFields,
  ],
}
