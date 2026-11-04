import { mediaUrl, type PayloadArticle } from './payload';

export interface BlogEntryData {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate: Date;
  author: string;
  authorTitle?: string;
  category: 'bayi' | 'ibu-menyusui' | 'layanan' | 'kehamilan';
  heroImage?: string;
  heroImageAlt?: string;
  keywords?: string[];
  medicalReviewer?: string;
  seo?: {
    metaTitle?: string;
    ogImage?: { url?: string; alt?: string } | string;
    noIndex?: boolean;
    canonicalUrl?: string;
  };
}

export interface BlogEntry {
  slug: string;
  data: BlogEntryData;
}

/** Ubah artikel CMS menjadi bentuk yang dipahami BlogPostLayout. */
export function toBlogEntry(article: PayloadArticle): BlogEntry {
  return {
    slug: article.slug,
    data: {
      title: article.title,
      description: article.description,
      pubDate: new Date(article.pubDate),
      updatedDate: new Date(article.updatedDate || article.pubDate),
      author: article.author,
      authorTitle: article.authorTitle,
      category: article.category,
      heroImage: mediaUrl(article.heroImage, article.heroImageUrlFallback || '/images/hero-baby.jpg'),
      heroImageAlt: article.heroImageAlt,
      keywords: article.keywords?.map((item) => item.keyword),
      medicalReviewer: article.medicalReviewer,
      seo: article.seo
        ? {
            metaTitle: article.seo.metaTitle,
            ogImage: article.seo.ogImage
              ? { url: mediaUrl(article.seo.ogImage.url), alt: article.seo.ogImage.alt }
              : undefined,
            noIndex: article.seo.noIndex,
            canonicalUrl: article.seo.canonicalUrl,
          }
        : undefined,
    },
  };
}
