import sanitizeHtml from 'sanitize-html';

const ALLOWED_IFRAME_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'player.vimeo.com',
  'www.google.com',
  'google.com',
  'maps.google.com',
  'www.google.co.id',
]);

const SAFE_STYLE_PROPERTIES: Record<string, RegExp> = {
  color: /^#[0-9a-f]{3,8}$|^rgba?\([\d\s.,%]+\)$|^[a-z]+$/i,
  'background-color': /^#[0-9a-f]{3,8}$|^rgba?\([\d\s.,%]+\)$|^[a-z]+$/i,
  'font-size': /^[\d.]+(px|rem|em|%)$/i,
  'font-weight': /^(normal|bold|[1-9]00)$/i,
  'text-align': /^(left|right|center|justify)$/i,
  'line-height': /^[\d.]+(px|rem|em|%)?$/i,
  margin: /^[\d.\s]+(px|rem|em|%)?$/i,
  'margin-top': /^[\d.]+(px|rem|em|%)$/i,
  'margin-bottom': /^[\d.]+(px|rem|em|%)$/i,
  'margin-left': /^[\d.]+(px|rem|em|%)$/i,
  'margin-right': /^[\d.]+(px|rem|em|%)$/i,
  padding: /^[\d.\s]+(px|rem|em|%)?$/i,
  'padding-top': /^[\d.]+(px|rem|em|%)$/i,
  'padding-bottom': /^[\d.]+(px|rem|em|%)$/i,
  border: /^[\d.]+\s+(solid|dashed|dotted)\s+#[0-9a-f]{3,8}$/i,
  'border-radius': /^[\d.]+(px|rem|em|%)$/i,
};

const filterStyle = (value: string): string => {
  return value
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .filter((declaration) => {
      const [property, ...rest] = declaration.split(':');
      const prop = property?.trim().toLowerCase();
      const val = rest.join(':').trim();
      const rule = SAFE_STYLE_PROPERTIES[prop];
      return Boolean(rule && val && rule.test(val));
    })
    .join('; ');
};

/**
 * Sanitize CMS-supplied HTML before rendering with `set:html`.
 * Scripts, event handlers, inline <style>, and untrusted iframes are removed.
 */
export function sanitizeCmsHtml(input: string): string {
  if (!input) return '';

  return sanitizeHtml(input, {
    allowedTags: [
      'section',
      'article',
      'div',
      'span',
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'picture',
      'source',
      'video',
      'iframe',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'small',
      'br',
      'hr',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'blockquote',
      'figure',
      'figcaption',
    ],
    allowedAttributes: {
      '*': ['class', 'id', 'title', 'role', 'aria-label', 'aria-hidden'],
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
      iframe: [
        'src',
        'width',
        'height',
        'allow',
        'allowfullscreen',
        'frameborder',
        'loading',
        'referrerpolicy',
        'title',
      ],
      video: ['src', 'controls', 'poster', 'width', 'height', 'preload'],
      source: ['src', 'type', 'media'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan', 'scope'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
      iframe: ['https'],
      a: ['http', 'https', 'mailto', 'tel'],
    },
    disallowedTagsMode: 'discard',
    transformTags: {
      iframe: (tagName, attribs) => {
        try {
          const url = new URL(attribs.src || '');
          if (!ALLOWED_IFRAME_HOSTS.has(url.hostname)) {
            return { tagName: 'div', text: '' };
          }
          return { tagName, attribs };
        } catch {
          return { tagName: 'div', text: '' };
        }
      },
      '*': (tagName, attribs) => {
        if (attribs.style) {
          const safe = filterStyle(attribs.style);
          if (safe) {
            attribs.style = safe;
          } else {
            delete attribs.style;
          }
        }
        return { tagName, attribs };
      },
    },
  });
}

interface CmsTokens {
  waLink?: string;
  phone?: string;
  refCode?: string;
}

/** Replace safe CMS tokens in custom HTML. */
export function applyCmsTokens(html: string, tokens: CmsTokens): string {
  return html
    .replace(/\{\{\s*wa_link\s*\}\}/gi, tokens.waLink || '#')
    .replace(/\{\{\s*phone\s*\}\}/gi, tokens.phone || '')
    .replace(/\{\{\s*ref_code\s*\}\}/gi, tokens.refCode || '');
}
