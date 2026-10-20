import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    author: z.string().default('Bidan Kala'),
    authorTitle: z.string().default('Bidan Profesional Ber-STR'),
    category: z.enum(['bayi', 'ibu-menyusui', 'layanan', 'kehamilan']),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    medicalReviewer: z.string().default('Tim Medis & Bidan Kala'),
    draft: z.boolean().default(false),
    seo: z.object({
      metaTitle: z.string().optional(),
      ogImage: z.string().optional(),
      noIndex: z.boolean().default(false).optional(),
      canonicalUrl: z.string().optional(),
    }).optional(),
  }),
});

export const collections = {
  blog,
};
