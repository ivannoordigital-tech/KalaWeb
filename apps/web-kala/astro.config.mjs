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
      filter: (page) => !page.includes('/segera-hadir') && !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date('2026-10-20'),
    }),
  ],
});
