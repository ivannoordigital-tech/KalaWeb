import type { Block } from 'payload';

/**
 * Higher-order helper to inject the `disabled` field into any Payload Block.
 * Allows sections to be toggled visible/hidden from the visual builder sidebar.
 */
export const withDisabled = (block: Block): Block => ({
  ...block,
  fields: [
    {
      name: 'disabled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Sembunyikan seksi ini dari halaman publik',
      admin: {
        description: 'Jika dicentang, seksi ini tidak akan tampil ke pengunjung web publik (tetap terlihat di preview builder).',
      },
    },
    ...block.fields,
  ],
});
