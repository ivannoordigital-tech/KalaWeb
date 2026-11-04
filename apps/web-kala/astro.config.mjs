import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDynamicDateMap } from './src/lib/sitemap-date-resolver.mjs';

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
  server: {
    host: true, // Listen on all network interfaces (IPv4 0.0.0.0 & IPv6 ::)
    port: 4321,
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => !page.includes('/segera-hadir') && !page.includes('/404') && !page.includes('/sales/') && !page.includes('/lp/') && !page.includes('/preview/') && !page.includes('/_blocks'),
      changefreq: 'weekly',
      priority: 0.8,
      async serialize(item) {
        const dateMap = await getDynamicDateMap();
        const urlObj = new URL(item.url);
        const pathname = urlObj.pathname;

        // Cari tanggal dinamis dari map (berdasarkan URL path)
        const dynamicDate =
          dateMap.get(pathname) ||
          dateMap.get(pathname.replace(/\/$/, '')) ||
          dateMap.get(pathname.endsWith('/') ? pathname : `${pathname}/`);

        if (pathname === '/' || pathname === '') {
          item.priority = 1.0;
          item.changefreq = 'daily';
          item.lastmod = dynamicDate || new Date();
        } else if (pathname.startsWith('/blog/')) {
          item.priority = 0.9;
          item.changefreq = 'monthly';
          item.lastmod = dynamicDate || new Date();
        } else if (pathname.startsWith('/layanan/')) {
          item.priority = 0.85;
          item.changefreq = 'monthly';
          item.lastmod = dynamicDate || new Date();
        } else if (pathname.startsWith('/area/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
          item.lastmod = dynamicDate || new Date();
        } else if (pathname.startsWith('/bidan/')) {
          item.priority = 0.75;
          item.changefreq = 'monthly';
          item.lastmod = dynamicDate || new Date();
        } else if (pathname.includes('/kebijakan-privasi') || pathname.includes('/syarat-ketentuan')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
          item.lastmod = dynamicDate || new Date();
        } else {
          item.priority = 0.7;
          item.changefreq = 'weekly';
          item.lastmod = dynamicDate || new Date();
        }
        return item;
      },
    }),
    payloadRedirectsIntegration(),
  ],
  image: {
    domains: [
      'admin.kalababyspa.com',
      'cdn.kalababyspa.com',
      'media.kalababyspa.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.kalababyspa.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.kalababyspa.com',
      },
      {
        protocol: 'https',
        hostname: 'media.kalababyspa.com',
      },
    ],
  },
});
