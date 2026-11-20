import type { Block } from 'payload'
import { getUserRole } from '../access/roles'
import { blockSettingsFields } from './commonBlockFields'

const canToggleScripts = ({ req }: { req: { user?: any } }) => {
  const role = getUserRole(req.user)
  return role === 'superadmin' || role === 'operator'
}

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
      access: {
        update: ({ req, siblingData }: any) =>
          !siblingData?.allowScripts || canToggleScripts({ req }),
      },
      admin: {
        language: 'html',
        description:
          'Tempel HTML/CSS di sini. Demi keamanan, tag <script>, <iframe>, <form>, <style>, event handler (onclick dll), dan URL javascript: akan dibuang otomatis saat halaman dirender. Gunakan atribut style inline atau class Tailwind untuk styling.',
      },
    },
    {
      name: 'allowScripts',
      type: 'checkbox',
      defaultValue: false,
      label: 'Jalankan JavaScript di dalam sandbox (Advanced)',
      access: {
        create: canToggleScripts,
        update: canToggleScripts,
      },
      admin: {
        description:
          'Jika dicentang, HTML dirender di dalam iframe sandbox: script boleh berjalan, tetapi tidak bisa mengakses DOM halaman induk, cookie, localStorage, atau mengarahkan ulang halaman. Hanya aktifkan untuk kode yang Anda percaya.',
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
          admin: {
            width: '50%',
            description: 'Pilih "Penuh Layar" + "Tanpa Jarak" untuk mode full-bleed tanpa container.',
          },
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
          admin: {
            width: '50%',
            description: 'Pilih "Tanpa Jarak" + lebar "Penuh Layar" untuk mode full-bleed.',
          },
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
      admin: {
        description: 'Warna tetap diterapkan pada mode full-bleed (Penuh Layar + Tanpa Jarak).',
      },
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
