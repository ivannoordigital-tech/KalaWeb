/**
 * Payload CMS Client for KalaWeb
 * Handles fetching dynamic content (Articles, Services, Testimonials, FAQs, Areas, Midwives, SiteSettings)
 * with strict production protection (build failure on Cloudflare Pages) and graceful local dev fallback.
 */

const PAYLOAD_URL = (typeof import.meta !== 'undefined' && import.meta.env?.PAYLOAD_URL) || process.env.PAYLOAD_URL || 'https://admin.kalababyspa.com';

const isDev = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);
// Fallback is allowed in local development OR when explicitly permitted via ALLOW_FALLBACK=true.
// In production builds (Cloudflare Pages), if CMS is unreachable, the build fails to keep previous deployment live.
const allowFallback = isDev || (typeof import.meta !== 'undefined' && import.meta.env?.ALLOW_FALLBACK === 'true') || process.env.ALLOW_FALLBACK === 'true';

function handleFetchError(resource: string, err: Error): void {
  if (!allowFallback) {
    throw new Error(
      `[PayloadClient] FATAL PRODUCTION ERROR: Failed to fetch "${resource}" from CMS (${PAYLOAD_URL}): ${err.message}. ` +
      `Aborting build so Cloudflare Pages retains the last live deployment intact.`
    );
  }
  console.warn(`[PayloadClient] Warning: CMS offline/unreachable for "${resource}" (${err.message}). Using local fallback mode.`);
}

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
  seo?: {
    metaTitle?: string;
    ogImage?: { url: string; alt?: string };
    noIndex?: boolean;
    canonicalUrl?: string;
  };
}

export interface PayloadService {
  id: string;
  name: string;
  slug: string;
  serviceId?: string;
  target: string;
  duration: string;
  originalPrice?: string;
  price: string;
  numericPrice: number;
  shortDescription?: string;
  description: string;
  includedItems?: Array<{ item: string }> | string[];
  badge?: string;
  recommended?: boolean;
  popular?: boolean;
  refCode: string;
  message?: string;
}

export interface PayloadTestimonial {
  id: string;
  author: string;
  area?: string;
  location?: string;
  service: string;
  quote: string;
  date?: string;
  permissionGranted?: boolean;
}

export interface PayloadFAQ {
  id: string;
  question: string;
  answer: string;
  category: 'layanan' | 'keamanan-medis' | 'reservasi-homecare' | 'biaya-wilayah';
  order?: number;
}

export interface PayloadServiceArea {
  id: string;
  name: string;
  slug: string;
  city: 'Surabaya' | 'Sidoarjo';
  uniqueDescription: string;
  landmarks?: Array<{ name: string }>;
  estimatedArrivalMinutes?: string;
  availableServices?: Array<{ serviceName: string }>;
}

export interface PayloadMidwife {
  id: string;
  name: string;
  slug: string;
  title: string;
  strNumber: string;
  experienceYears?: number;
  specialties?: Array<{ specialty: string }>;
  bio: string;
  photo?: {
    url?: string;
    alt?: string;
  };
}

export interface PayloadRedirect {
  id: string;
  from: string;
  to: string;
  type: '301' | '302';
  active: boolean;
  notes?: string;
}

export interface SiteSettingsData {
  whatsappNumber?: string;
  whatsappNumberFormatted?: string;
  instagram?: string;
  operationalHours?: string;
  heroBadgeText?: string;
  socialProofText?: string;
  announcementBanner?: string;
  coverageAreas?: Array<{ area: string }>;
}

/**
 * Fetch published articles from Payload CMS
 */
export async function fetchPayloadArticles(): Promise<PayloadArticle[]> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/articles?where[status][equals]=published&depth=1&limit=100`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`Payload error: ${res.statusText}`);
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    handleFetchError('articles', err as Error);
    return [];
  }
}

/**
 * Fetch services from Payload CMS
 */
export async function fetchPayloadServices(): Promise<PayloadService[]> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/services?where[active][equals]=true&limit=50`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`Payload error: ${res.statusText}`);
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    handleFetchError('services', err as Error);
    return [];
  }
}

/**
 * Fetch verified testimonials from Payload CMS
 */
export async function fetchPayloadTestimonials(): Promise<PayloadTestimonial[]> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/testimonials?where[active][equals]=true&where[permissionGranted][equals]=true&limit=50`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`Payload error: ${res.statusText}`);
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    handleFetchError('testimonials', err as Error);
    return [];
  }
}

/**
 * Fetch FAQs from Payload CMS
 */
export async function fetchPayloadFAQs(): Promise<PayloadFAQ[]> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/faq?where[active][equals]=true&sort=order&limit=50`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`Payload error: ${res.statusText}`);
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    handleFetchError('faq', err as Error);
    return [];
  }
}

/**
 * Fetch service areas from Payload CMS
 */
export async function fetchPayloadServiceAreas(): Promise<PayloadServiceArea[]> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/service-areas?where[active][equals]=true&limit=50`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`Payload error: ${res.statusText}`);
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    handleFetchError('service-areas', err as Error);
    return [];
  }
}

/**
 * Fetch midwives team from Payload CMS
 */
export async function fetchPayloadMidwives(): Promise<PayloadMidwife[]> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/midwives?where[active][equals]=true&limit=50`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`Payload error: ${res.statusText}`);
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    handleFetchError('midwives', err as Error);
    return [];
  }
}

/**
 * Fetch global site settings from Payload CMS
 */
export async function fetchSiteSettings(): Promise<SiteSettingsData | null> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/globals/site-settings`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`Payload error: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    handleFetchError('site-settings', err as Error);
    return null;
  }
}

/**
 * Fetch dynamic SEO redirects from Payload CMS
 */
export async function fetchPayloadRedirects(): Promise<PayloadRedirect[]> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/redirects?where[active][equals]=true&limit=500`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`Payload error: ${res.statusText}`);
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    handleFetchError('redirects', err as Error);
    return [];
  }
}
