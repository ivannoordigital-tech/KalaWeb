/**
 * Payload CMS Client for KalaWeb
 * Handles fetching dynamic content (Articles, Services, Testimonials) from Payload CMS,
 * with graceful fallback to local files when CMS is in build/offline mode.
 */

const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || 'https://admin.kalababyspa.com';

export interface PayloadArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  pubDate: string;
  updatedDate: string;
  author: string;
  authorTitle: string;
  category: 'bayi' | 'ibu-menyusui' | 'layanan' | 'kehamilan';
  heroImage?: {
    url?: string;
    alt?: string;
  };
  heroImageUrlFallback?: string;
  heroImageAlt?: string;
  keywords?: Array<{ keyword: string }>;
  medicalReviewer: string;
  content: any;
  status: 'draft' | 'published';
}

export interface PayloadService {
  id: string;
  name: string;
  serviceId: string;
  target: string;
  duration: string;
  originalPrice?: string;
  price: string;
  numericPrice: number;
  description: string;
  badge?: string;
  popular?: boolean;
  refCode: string;
  message?: string;
}

export interface PayloadTestimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  service: string;
}

/**
 * Fetch published articles from Payload CMS
 */
export async function fetchPayloadArticles(): Promise<PayloadArticle[]> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/articles?where[status][equals]=published&depth=1&limit=100`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000), // 3s timeout fail-safe
    });
    if (!res.ok) throw new Error(`Payload error: ${res.statusText}`);
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    console.debug('[PayloadClient] CMS offline or unreachable, using fallback mode:', (err as Error).message);
    return [];
  }
}

/**
 * Fetch featured services from Payload CMS
 */
export async function fetchPayloadServices(): Promise<PayloadService[]> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/services?limit=50`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`Payload error: ${res.statusText}`);
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    return [];
  }
}
