import type { Block } from 'payload';
import { commonStyleFields } from '../commonStyleFields';

export const ButtonBlock: Block = {
  slug: 'button',
  labels: { singular: 'Widget: Tombol', plural: 'Widget: Tombol' },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      defaultValue: 'Konsultasi via WhatsApp',
      label: 'Teks Tombol',
    },
    {
      name: 'linkType',
      type: 'select',
      defaultValue: 'whatsapp',
      label: 'Jenis Link',
      options: [
        { label: 'WhatsApp (dengan tracking)', value: 'whatsapp' },
        { label: 'URL Biasa', value: 'url' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL Tujuan',
      admin: {
        placeholder: '/layanan',
        condition: (_, siblingData) => siblingData?.linkType === 'url',
      },
    },
    {
      name: 'refCode',
      type: 'text',
      label: 'Kode Pelacak WhatsApp (Ref Code)',
      admin: {
        placeholder: 'KALA-WIDGET',
        condition: (_, siblingData) => siblingData?.linkType === 'whatsapp',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Pesan Otomatis WhatsApp',
      admin: {
        placeholder: 'Halo Bu Bidan, saya mau konsultasi...',
        condition: (_, siblingData) => siblingData?.linkType === 'whatsapp',
      },
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'primary',
      label: 'Gaya Tombol',
      options: [
        { label: 'Hijau WhatsApp', value: 'primary' },
        { label: 'Terracotta', value: 'secondary' },
        { label: 'Promo Kuning', value: 'promo' },
        { label: 'Hero Besar', value: 'hero' },
      ],
    },
    {
      name: 'fullWidth',
      type: 'checkbox',
      defaultValue: false,
      label: 'Lebar Penuh',
    },
    ...commonStyleFields,
  ],
};
