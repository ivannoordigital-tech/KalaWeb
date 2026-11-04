import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '..');
const blogDir = path.resolve(srcDir, 'content/blog');
const pagesDir = path.resolve(srcDir, 'pages');

let datesCache = null;

/**
 * Resolves real modification timestamps dynamically for every sitemap URL:
 * 1. Scans local blog markdown files and extracts frontmatter updatedDate / pubDate or mtime.
 * 2. Scans static Astro page templates and uses actual filesystem mtime.
 * 3. If CMS is reachable, overrides/supplements with actual document updatedAt timestamps.
 */
export async function getDynamicDateMap() {
  if (datesCache) return datesCache;

  const dateMap = new Map();

  // 1. Scan blog markdown files
  try {
    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
      for (const file of files) {
        const slug = file.replace(/\.md$/i, '');
        const filePath = path.join(blogDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const stat = fs.statSync(filePath);

        const updatedMatch = content.match(/updatedDate:\s*([^\r\n]+)/);
        const pubMatch = content.match(/pubDate:\s*([^\r\n]+)/);

        let dateVal = null;
        if (updatedMatch) {
          const raw = updatedMatch[1].trim().replace(/['"]/g, '');
          const d = new Date(raw);
          if (!isNaN(d.getTime())) dateVal = d;
        }
        if (!dateVal && pubMatch) {
          const raw = pubMatch[1].trim().replace(/['"]/g, '');
          const d = new Date(raw);
          if (!isNaN(d.getTime())) dateVal = d;
        }

        const finalDate = dateVal || stat.mtime;
        dateMap.set(`/blog/${slug}`, finalDate);
        dateMap.set(`/blog/${slug}/`, finalDate);
      }
    }
  } catch (err) {
    console.warn('[Sitemap] Notice: could not scan markdown blog:', err.message);
  }

  // 2. Scan static Astro page files
  try {
    if (fs.existsSync(pagesDir)) {
      const scanDir = (dir, prefix = '') => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
          if (entry.isDirectory()) {
            if (entry.name === 'preview' || entry.name === 'sales' || entry.name === 'lp') continue;
            scanDir(path.join(dir, entry.name), `${prefix}/${entry.name}`);
          } else if (entry.name.endsWith('.astro')) {
            const stat = fs.statSync(path.join(dir, entry.name));
            if (entry.name === 'index.astro') {
              const urlPath = prefix === '' ? '/' : prefix;
              dateMap.set(urlPath, stat.mtime);
              dateMap.set(urlPath.endsWith('/') ? urlPath : `${urlPath}/`, stat.mtime);
            } else if (!entry.name.startsWith('[')) {
              const baseName = entry.name.replace(/\.astro$/, '');
              const urlPath = `${prefix}/${baseName}`;
              dateMap.set(urlPath, stat.mtime);
              dateMap.set(`${urlPath}/`, stat.mtime);
            }
          }
        }
      };
      scanDir(pagesDir);
    }
  } catch (err) {
    console.warn('[Sitemap] Notice: could not scan pages dir:', err.message);
  }

  // 3. Query CMS if reachable
  const payloadUrl = process.env.PAYLOAD_URL || 'https://admin.kalababyspa.com';

  try {
    const settingsRes = await fetch(`${payloadUrl}/api/globals/site-settings`, {
      signal: AbortSignal.timeout(3000),
    });
    if (settingsRes.ok) {
      const data = await settingsRes.json();
      if (data?.updatedAt) {
        const d = new Date(data.updatedAt);
        if (!isNaN(d.getTime())) {
          dateMap.set('/', d);
          dateMap.set('', d);
        }
      }
    }
  } catch (_) {}

  const collections = [
    { name: 'articles', prefix: '/blog' },
    { name: 'pages', prefix: '' },
    { name: 'services', prefix: '/layanan' },
    { name: 'service-areas', prefix: '/area' },
    { name: 'midwives', prefix: '/bidan' },
  ];

  for (const col of collections) {
    try {
      const res = await fetch(`${payloadUrl}/api/${col.name}?limit=100&depth=0`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const body = await res.json();
        for (const doc of body.docs || []) {
          if (!doc.slug) continue;
          const rawDate = doc.updatedDate || doc.updatedAt || doc.pubDate || doc.createdAt;
          if (rawDate) {
            const d = new Date(rawDate);
            if (!isNaN(d.getTime())) {
              const pathUrl = col.prefix ? `${col.prefix}/${doc.slug}` : `/${doc.slug}`;
              dateMap.set(pathUrl, d);
              dateMap.set(`${pathUrl}/`, d);
            }
          }
        }
      }
    } catch (_) {}
  }

  datesCache = dateMap;
  return dateMap;
}
