import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Lengkap',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'admin',
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Admin / Bidan', value: 'admin' },
        { label: 'Penulis Konten', value: 'author' },
      ],
      required: true,
      label: 'Peran / Role',
    },
  ],
}
