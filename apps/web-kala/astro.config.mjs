import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kalababyspa.com',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => !page.includes('/segera-hadir') && !page.includes('/404') && !page.includes('/lp/'),
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date('2026-10-20'),
    }),
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
