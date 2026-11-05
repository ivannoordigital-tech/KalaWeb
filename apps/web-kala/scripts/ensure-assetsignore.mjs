import { mkdirSync, writeFileSync } from 'node:fs';

// Cloudflare Workers + Assets: folder _worker.js adalah kode server,
// bukan aset publik. Tanpa file ini, `wrangler deploy` menolak build.
mkdirSync('dist', { recursive: true });
writeFileSync('dist/.assetsignore', '_worker.js\n_worker.js/**\n', 'utf8');
console.log('[build] dist/.assetsignore dibuat');
