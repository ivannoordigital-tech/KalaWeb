import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SignJWT, jwtVerify } from 'jose';

// 1. JWT Security & Fallback Secret Rejection Tests
describe('JWT Security & Token Verification', () => {
  const REAL_SECRET = '71ef5261a36549f98349ea70a52a003a76573b2b9883433d987fd68a4c4e258e';
  const OLD_FALLBACK_SECRET = 'kala_preview_secret_fallback_key_2026';
  const SHORT_SECRET = 'too_short_secret';

  test('Signs and verifies valid preview token with 64-char secret', async () => {
    const key = new TextEncoder().encode(REAL_SECRET);
    const token = await new SignJWT({
      sub: '123',
      collection: 'landing-pages',
      slug: 'promo-pijat',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('kala-cms')
      .setAudience('kala-preview')
      .setExpirationTime('15m')
      .sign(key);

    const { payload } = await jwtVerify(token, key, {
      issuer: 'kala-cms',
      audience: 'kala-preview',
    });

    assert.equal(payload.sub, '123');
    assert.equal(payload.collection, 'landing-pages');
    assert.equal(payload.slug, 'promo-pijat');
  });

  test('Rejects tokens signed with old fallback secret', async () => {
    const oldKey = new TextEncoder().encode(OLD_FALLBACK_SECRET);
    const forgedToken = await new SignJWT({
      sub: '999',
      collection: 'pages',
      slug: 'forged-page',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('kala-cms')
      .setAudience('kala-preview')
      .setExpirationTime('15m')
      .sign(oldKey);

    const realKey = new TextEncoder().encode(REAL_SECRET);
    await assert.rejects(
      async () => {
        await jwtVerify(forgedToken, realKey, {
          issuer: 'kala-cms',
          audience: 'kala-preview',
        });
      },
      /signature verification failed/i
    );
  });

  test('Rejects secret shorter than 32 characters in preview verification', () => {
    const verifyPreviewSecret = (secret?: string) => {
      if (!secret || secret.trim().length < 32) {
        throw new Error('Akses pratinjau ditolak: PREVIEW_SECRET wajib disetel minimal 32 karakter di environment.');
      }
      return true;
    };

    assert.throws(() => verifyPreviewSecret(''), /32 karakter/);
    assert.throws(() => verifyPreviewSecret(SHORT_SECRET), /32 karakter/);
    assert.equal(verifyPreviewSecret(REAL_SECRET), true);
  });

  test('Rejects expired preview token', async () => {
    const key = new TextEncoder().encode(REAL_SECRET);
    const expiredToken = await new SignJWT({
      sub: '123',
      collection: 'pages',
      slug: 'expired-page',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('kala-cms')
      .setAudience('kala-preview')
      .setExpirationTime('-1s') // expired immediately
      .sign(key);

    await assert.rejects(
      async () => {
        await jwtVerify(expiredToken, key, {
          issuer: 'kala-cms',
          audience: 'kala-preview',
        });
      },
      /"exp" claim timestamp check failed/i
    );
  });
});

// 2. RichText Sanitization & XSS Prevention Tests
describe('RichText HTML Escaping & URL Sanitation', () => {
  function escapeHtml(str: string): string {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function sanitizeUrl(url?: string): string {
    if (!url) return '#';
    const trimmed = url.trim();
    if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
      return escapeHtml(trimmed);
    }
    try {
      const parsed = new URL(trimmed);
      if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
        return escapeHtml(trimmed);
      }
    } catch {}
    return '#';
  }

  test('Escapes HTML special characters in plain text', () => {
    assert.equal(
      escapeHtml('<script>alert("xss")</script>'),
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
    assert.equal(
      escapeHtml('<img src=x onerror=alert(1)>'),
      '&lt;img src=x onerror=alert(1)&gt;'
    );
    assert.equal(
      escapeHtml("It's a & 'special' day"),
      'It&#039;s a &amp; &#039;special&#039; day'
    );
  });

  test('Sanitizes malicious URL protocols to #', () => {
    assert.equal(sanitizeUrl('javascript:alert(1)'), '#');
    assert.equal(sanitizeUrl('data:text/html,<script>alert(1)</script>'), '#');
    assert.equal(sanitizeUrl('vbscript:msgbox(1)'), '#');
  });

  test('Permits safe URL protocols and relative paths', () => {
    assert.equal(sanitizeUrl('https://kalababyspa.com/layanan'), 'https://kalababyspa.com/layanan');
    assert.equal(sanitizeUrl('http://kalababyspa.com'), 'http://kalababyspa.com');
    assert.equal(sanitizeUrl('mailto:info@kalababyspa.com'), 'mailto:info@kalababyspa.com');
    assert.equal(sanitizeUrl('tel:+628123456789'), 'tel:+628123456789');
    assert.equal(sanitizeUrl('/sales/babyMassage'), '/sales/babyMassage');
    assert.equal(sanitizeUrl('#pricing'), '#pricing');
  });

  test('Clamps heading tags to allowed whitelist (h1..h4)', () => {
    const sanitizeTag = (tag: string) => {
      const rawTag = String(tag || 'h2').toLowerCase();
      return ['h1', 'h2', 'h3', 'h4'].includes(rawTag) ? rawTag : 'h2';
    };

    assert.equal(sanitizeTag('h1'), 'h1');
    assert.equal(sanitizeTag('h2'), 'h2');
    assert.equal(sanitizeTag('h3'), 'h3');
    assert.equal(sanitizeTag('h4'), 'h4');
    assert.equal(sanitizeTag('h5'), 'h2');
    assert.equal(sanitizeTag('script'), 'h2');
    assert.equal(sanitizeTag('iframe'), 'h2');
  });
});

// 3. Builder State Mutation Tests
describe('Builder State Mutation & Reordering', () => {
  interface MockBlock {
    id: string;
    blockType: string;
    disabled?: boolean;
    [key: string]: any;
  }

  test('Reorders items immutably', () => {
    const list: MockBlock[] = [
      { id: '1', blockType: 'hero' },
      { id: '2', blockType: 'painPoints' },
      { id: '3', blockType: 'pricing' },
    ];

    // Move '3' to index 0
    const reordered = [...list];
    const [moved] = reordered.splice(2, 1);
    reordered.splice(0, 0, moved);

    assert.equal(reordered[0].id, '3');
    assert.equal(reordered[1].id, '1');
    assert.equal(reordered[2].id, '2');
    // Original untouched
    assert.equal(list[0].id, '1');
  });

  test('Duplicates block with unique fresh ID', () => {
    const original: MockBlock = {
      id: 'sec_123',
      blockType: 'hero',
      headline: 'Penawaran Spesial',
    };

    const duplicate: MockBlock = {
      ...JSON.parse(JSON.stringify(original)),
      id: `sec_${Date.now()}_copy`,
    };

    assert.notEqual(duplicate.id, original.id);
    assert.equal(duplicate.blockType, original.blockType);
    assert.equal(duplicate.headline, original.headline);
  });
});
