import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function payloadRedirectsIntegration() {
  return {
    name: 'payload-redirects',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        try {
          const { fetchPayloadRedirects } = await import('./src/lib/payload.ts');
          const redirects = await fetchPayloadRedirects();
          if (redirects && redirects.length > 0) {
            const outPath = path.join(fileURLToPath(dir), '_redirects');
            let content = '';
            if (fs.existsSync(outPath)) {
              content = fs.readFileSync(outPath, 'utf-8');
            }
            content += '\n# Dynamic redirects managed via Payload CMS\n';
            for (const r of redirects) {
              if (r.from && r.to) {
                content += `${r.from} ${r.to} ${r.type || '301'}\n`;
              }
            }
            fs.writeFileSync(outPath, content, 'utf-8');
            console.log(`[Redirects] Injected ${redirects.length} dynamic CMS redirects into _redirects.`);
          }
        } catch (err) {
          console.warn('[Redirects] Notice: Failed to sync dynamic redirects during build:', err.message);
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://kalababyspa.com',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => !page.includes('/segera-hadir') && !page.includes('/404') && !page.includes('/lp/') && !page.includes('/preview/') && !page.includes('/_blocks'),
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date('2026-10-20'),
    }),
    payloadRedirectsIntegration(),
  ],
  image: {
    domains: ['admin.kalababyspa.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.kalababyspa.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
});
