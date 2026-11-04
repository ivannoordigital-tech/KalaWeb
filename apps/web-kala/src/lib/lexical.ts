/**
 * Shared Lexical → HTML renderer for KalaWeb (Astro).
 *
 * Dipakai oleh:
 * - Halaman kustom (`/[slug]`)
 * - Blok rich text (`RichTextBlock`)
 * - Artikel blog dari CMS (`/blog/[...slug]`)
 * - Route preview
 *
 * Renderer ini sengaja tidak bergantung pada runtime Payload/React agar aman
 * dipakai saat build statis Astro. Semua teks dan atribut di-escape.
 */

const FORMAT = {
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4,
  UNDERLINE: 8,
  CODE: 16,
  SUBSCRIPT: 32,
  SUPERSCRIPT: 64,
} as const;

const PAYLOAD_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.PAYLOAD_URL) ||
  (typeof process !== 'undefined' && process.env?.PAYLOAD_URL) ||
  'https://admin.kalababyspa.com';

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Hanya izinkan skema URL yang aman untuk konten publik. */
export function sanitizeUrl(raw: unknown): string {
  const url = String(raw ?? '').trim();
  if (!url) return '#';
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  if (url.startsWith('/') || url.startsWith('#')) return url;
  return '#';
}

/** Pastikan URL media dari CMS selalu absolut di domain publik. */
export function resolveMediaUrl(raw: unknown): string {
  const url = String(raw ?? '').trim();
  if (!url) return '';
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url;
  try {
    return new URL(url, PAYLOAD_URL).toString();
  } catch {
    return url;
  }
}

function renderText(node: any): string {
  let text = escapeHtml(node.text);
  const format = Number(node.format) || 0;

  if (format & FORMAT.BOLD) text = `<strong>${text}</strong>`;
  if (format & FORMAT.ITALIC) text = `<em>${text}</em>`;
  if (format & FORMAT.STRIKETHROUGH) text = `<s>${text}</s>`;
  if (format & FORMAT.UNDERLINE) text = `<u>${text}</u>`;
  if (format & FORMAT.CODE) text = `<code>${text}</code>`;
  if (format & FORMAT.SUBSCRIPT) text = `<sub>${text}</sub>`;
  if (format & FORMAT.SUPERSCRIPT) text = `<sup>${text}</sup>`;

  return text;
}

function alignmentStyle(node: any): string {
  const format = typeof node?.format === 'string' ? node.format : '';
  if (['left', 'center', 'right', 'justify'].includes(format)) {
    return ` style="text-align:${format}"`;
  }
  return '';
}

function renderChildren(node: any): string {
  return Array.isArray(node?.children) ? node.children.map(renderNode).join('') : '';
}

function renderTableCellChildren(node: any): string {
  if (!Array.isArray(node?.children)) return '';
  return node.children
    .map((child: any) => {
      if (child?.type === 'paragraph') {
        const inner = renderChildren(child);
        return `<p class="m-0 leading-relaxed text-[#4B2E22]">${inner || '<br />'}</p>`;
      }
      return renderNode(child);
    })
    .join('');
}

function renderNode(node: any): string {
  if (!node || typeof node !== 'object') return '';

  switch (node.type) {
    case 'text':
      return renderText(node);

    case 'linebreak':
      return '<br />';

    case 'paragraph': {
      const inner = renderChildren(node);
      return `<p class="mb-5 leading-relaxed text-[#4B2E22]"${alignmentStyle(node)}>${inner || '<br />'}</p>`;
    }

    case 'heading': {
      const tag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag) ? node.tag : 'h2';
      const sizes: Record<string, string> = {
        h1: 'text-2xl sm:text-3xl',
        h2: 'text-xl sm:text-2xl',
        h3: 'text-lg sm:text-xl',
        h4: 'text-base sm:text-lg',
        h5: 'text-base',
        h6: 'text-sm',
      };
      return `<${tag} class="font-brand font-bold text-[#4B2E22] mt-8 mb-4 ${sizes[tag]}"${alignmentStyle(node)}>${renderChildren(node)}</${tag}>`;
    }

    case 'list': {
      const isOrdered = node.listType === 'number';
      const tag = isOrdered ? 'ol' : 'ul';
      const classes = isOrdered ? 'list-decimal ml-6 mb-5 space-y-2' : 'list-disc ml-6 mb-5 space-y-2';
      const start = isOrdered && Number(node.start) > 1 ? ` start="${Number(node.start)}"` : '';
      return `<${tag} class="${classes}"${start}>${renderChildren(node)}</${tag}>`;
    }

    case 'listitem': {
      const checked =
        typeof node.checked === 'boolean'
          ? `<input type="checkbox" disabled${node.checked ? ' checked' : ''} class="mr-2 align-middle" />`
          : '';
      return `<li class="leading-relaxed text-[#4B2E22]">${checked}${renderChildren(node)}</li>`;
    }

    case 'quote':
    case 'blockquote':
      return `<blockquote class="border-l-4 border-[#B3471E] pl-4 py-2 italic text-[#86675A] bg-[#FFEFE5]/40 rounded-r-xl my-6">${renderChildren(node)}</blockquote>`;

    case 'horizontalrule':
      return '<hr class="border-[#F6DCCD] my-8" />';

    case 'link':
    case 'autolink': {
      const href = sanitizeUrl(node.fields?.url);
      const newTab = Boolean(node.fields?.newTab) || node.fields?.linkType === 'external';
      const rel = newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${escapeHtml(href)}" class="text-[#B3471E] underline font-semibold hover:text-[#A3431F]"${rel}>${renderChildren(node)}</a>`;
    }

    case 'upload': {
      const value = node.value;
      if (!value || typeof value !== 'object') return '';
      const url = resolveMediaUrl(value.url);
      const alt = escapeHtml(node.fields?.alt || value.alt || '');
      const mime = String(value.mimeType || '');

      if (!url) return '';
      if (!mime.startsWith('image')) {
        return `<a href="${escapeHtml(url)}" class="text-[#B3471E] underline font-semibold" target="_blank" rel="noopener noreferrer">${escapeHtml(value.filename || 'Unduh dokumen')}</a>`;
      }

      const width = value.width ? ` width="${Number(value.width)}"` : '';
      const height = value.height ? ` height="${Number(value.height)}"` : '';
      return `<img src="${escapeHtml(url)}" alt="${alt}"${width}${height} loading="lazy" decoding="async" class="rounded-2xl border border-[#F6DCCD] w-full h-auto my-6" />`;
    }

    case 'table':
      return `<div class="overflow-x-auto my-8"><table class="w-full text-left border-collapse text-sm">${renderChildren(node)}</table></div>`;

    case 'tablerow':
      return `<tr class="border-b border-[#F6DCCD]">${renderChildren(node)}</tr>`;

    case 'tablecell': {
      const isHeader = Number(node.headerState) > 0;
      const tag = isHeader ? 'th' : 'td';
      const classes = isHeader
        ? 'border border-[#F6DCCD] bg-[#FFEFE5] px-3 py-2 align-top font-bold text-[#4B2E22]'
        : 'border border-[#F6DCCD] px-3 py-2 align-top text-[#4B2E22]';
      const colSpan = Number(node.colSpan) > 1 ? ` colspan="${Number(node.colSpan)}"` : '';
      const rowSpan = Number(node.rowSpan) > 1 ? ` rowspan="${Number(node.rowSpan)}"` : '';
      return `<${tag} class="${classes}"${colSpan}${rowSpan}>${renderTableCellChildren(node)}</${tag}>`;
    }

    case 'tab':
      return '<span class="inline-block w-4" aria-hidden="true"></span>';

    default:
      return renderChildren(node);
  }
}

/**
 * Render Lexical JSON (Payload) menjadi HTML siap pakai.
 * Mengembalikan string kosong bila konten tidak valid.
 */
export function renderLexicalToHtml(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return escapeHtml(content);

  const root = content.root || content;
  if (!Array.isArray(root?.children)) return '';

  return root.children.map(renderNode).join('');
}

export default renderLexicalToHtml;
