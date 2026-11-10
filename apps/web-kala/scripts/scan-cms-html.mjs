/**
 * Collect Tailwind class names used inside CMS "Custom HTML" blocks.
 *
 * The site is statically built, so classes that only exist in the CMS
 * database would otherwise be purged. This script fetches published
 * pages/landing pages, walks the layout recursively (including container
 * columns), and writes the raw HTML into a generated file listed in
 * `tailwind.config.mjs`.
 *
 * It is intentionally fail-safe: if the CMS is unreachable, it writes an
 * empty file and exits successfully so a deploy never fails because of
 * class scanning.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outFile = path.join(root, 'src', 'generated', 'cms-scan.html');

const PAYLOAD_URL =
  process.env.PAYLOAD_URL || 'https://admin.kalababyspa.com';

const COLLECTIONS = ['pages', 'landing-pages'];
const COLUMN_KEYS = ['column1', 'column2', 'column3', 'column4'];

function collectHtmlBlocks(blocks, out) {
  if (!Array.isArray(blocks)) return;

  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue;

    if (block.blockType === 'html' && typeof block.html === 'string' && block.html.trim()) {
      // Wrap in a div so Tailwind sees the classes as valid HTML context.
      out.push(`<div>${block.html}</div>`);
    }

    for (const key of COLUMN_KEYS) {
      if (Array.isArray(block[key])) {
        collectHtmlBlocks(block[key], out);
      }
    }
  }
}

async function fetchCollection(collection) {
  const res = await fetch(
    `${PAYLOAD_URL}/api/${collection}?where[_status][equals]=published&depth=0&limit=200`,
    {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function ensureOutput(contents) {
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, contents, 'utf8');
}

async function main() {
  const htmlParts = [];

  for (const collection of COLLECTIONS) {
    try {
      const data = await fetchCollection(collection);
      for (const doc of data.docs || []) {
        collectHtmlBlocks(doc.layout, htmlParts);
      }
      console.log(
        `[scan-cms-html] ${collection}: ${docsCount(data)} dokumen diperiksa.`,
      );
    } catch (err) {
      console.warn(
        `[scan-cms-html] Lewati "${collection}" karena CMS tidak dapat diakses: ${err.message}`,
      );
    }
  }

  await ensureOutput(htmlParts.join('\n'));
  console.log(
    `[scan-cms-html] Selesai. ${htmlParts.length} blok Custom HTML ditulis ke ${path.relative(root, outFile)}.`,
  );
}

function docsCount(data) {
  return Array.isArray(data?.docs) ? data.docs.length : 0;
}

main().catch(async (err) => {
  console.warn(`[scan-cms-html] Gagal total: ${err.message}. Menulis file kosong.`);
  try {
    await ensureOutput('');
  } catch (writeErr) {
    console.warn(`[scan-cms-html] Tidak dapat menulis file scan: ${writeErr.message}`);
  }
  process.exit(0);
});
