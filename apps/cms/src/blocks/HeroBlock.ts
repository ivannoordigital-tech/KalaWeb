import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Blok Hero (Headline & Penawaran)',
    plural: 'Blok Hero (Headline & Penawaran)',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Penanda / Social Proof (Di atas judul)',
      admin: {
        placeholder: '✨ Dipercaya 1000+ Orang Tua di Surabaya & Sidoarjo sejak 2020',
      },
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      label: 'Judul Headline Utama (Hero H1)',
      admin: {
        description: 'Pemicu minat pertama pengunjung.',
        placeholder: 'Si Kecil Lebih Tenang, Tidur Lebih Nyenyak, Tumbuh Lebih Optimal',
      },
    },
    {
      name: 'subheadline',
      type: 'textarea',
      required: true,
      label: 'Subheadline / Kalimat Empati',
      admin: {
        description: 'Penjelasan 1-2 kalimat menenangkan orang tua.',
        placeholder: 'Layanan pijat & perawatan profesional untuk bayi dan ibu nifas langsung di rumah oleh bidan ber-STR resmi.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'text',
          label: 'Harga Promo / Final',
          admin: { width: '33%', placeholder: 'Rp60.000' },
        },
        {
          name: 'originalPrice',
          type: 'text',
          label: 'Harga Coret Asli (Opsional)',
          admin: { width: '33%', placeholder: 'Rp120.000' },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Durasi Layanan',
          admin: { width: '33%', placeholder: '40 Menit' },
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Teks Tombol WhatsApp Utama',
      defaultValue: 'Konsultasi Gratis via WhatsApp',
    },
    {
      name: 'ctaMessage',
      type: 'text',
      label: 'Pesan Otomatis WhatsApp (Opsional)',
      admin: {
        placeholder: 'Halo Bidan Kala, saya mau tanya promo treatment pertama',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Hero Utama (Opsional)',
    },
    {
      name: 'imageAlt',
      type: 'text',
      label: 'Alt Text Foto Hero (Wajib jika ada foto)',
      admin: {
        description: 'Deskripsi gambar untuk SEO dan tuna netra. Contoh: Bidan sedang memijat bayi dengan lembut.',
      },
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Teks Tengah (Rekomendasi Mobile)', value: 'center' },
        { label: 'Teks Kiri (2 Kolom Desktop)', value: 'left' },
      ],
      label: 'Tata Letak / Posisi Teks Hero',
    },
    {
      name: 'btnColor',
      type: 'select',
      defaultValue: 'terracotta',
      options: [
        { label: 'Terracotta Brand (#C2552B - Bawaan)', value: 'terracotta' },
        { label: 'Hijau WhatsApp (#128C4A)', value: 'whatsapp' },
        { label: 'Cokelat Hangat (#4B2E22)', value: 'chocolate' },
      ],
      label: 'Warna Tombol CTA',
    },
    {
      name: 'bgStyle',
      type: 'select',
      defaultValue: 'gradient',
      options: [
        { label: 'Gradasi Peach Hangat (Rekomendasi)', value: 'gradient' },
        { label: 'Krem Polos', value: 'plain' },
        { label: 'Putih Bersih', value: 'white' },
      ],
      label: 'Pilihan Warna Latar Belakang',
    },
  ],
}
