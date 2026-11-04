/**
 * Konversi ringan Lexical <-> teks biasa untuk editor di dalam Visual Builder.
 *
 * Builder sengaja memakai textarea sederhana (bukan editor Lexical penuh) agar
 * bundel admin tetap ringan. Format tebal/link/tabel yang sudah ada tidak
 * dihapus sampai admin mengubah teksnya; untuk format kompleks, gunakan
 * "Mode Formulir Klasik" di halaman.
 */

function collectText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (node.type === 'text' && typeof node.text === 'string') return node.text;
  if (node.type === 'linebreak') return '\n';
  if (Array.isArray(node.children)) {
    return node.children.map(collectText).join('');
  }
  return '';
}

export function lexicalToPlainText(content: any): string {
  if (!content || typeof content !== 'object') return '';
  const root = content.root || content;
  const children = Array.isArray(root?.children) ? root.children : [];
  if (children.length === 0) return '';

  return children
    .map((child: any) => {
      if (!child) return '';
      if (child.type === 'list') {
        const items = Array.isArray(child.children) ? child.children : [];
        return items.map((item: any) => `- ${collectText(item)}`).join('\n');
      }
      if (child.type === 'quote') {
        return collectText(child);
      }
      if (child.type === 'heading' || child.type === 'paragraph' || child.type === 'listitem') {
        return collectText(child);
      }
      return collectText(child);
    })
    .join('\n');
}

export function plainTextToLexical(text: string): any {
  const lines = String(text || '').split(/\r?\n/);
  const children = lines.map((line) => {
    if (!line.trim()) {
      return { type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, children: [] };
    }
    return {
      type: 'paragraph',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children: [{ type: 'text', text: line, version: 1, format: 0, detail: 0, mode: 'normal', style: '' }],
    };
  });

  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children,
    },
  };
}

export function isoToLocalInput(value: unknown): string {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function localInputToIso(value: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}
