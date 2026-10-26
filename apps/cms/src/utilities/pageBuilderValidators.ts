/**
 * Validation & Safeguards for KalaWeb Page Builder (Sprint 1: P3 & P5)
 * Enforces strict pre-publish checks for LandingPages and Pages:
 * - Single H1/HeroBlock
 * - Minimal 1 WhatsApp CTA (required for Canvas / Landing Pages)
 * - Reserved & valid slug check
 * - Non-empty image alt text
 * - No circular template references (max depth 1)
 * - Forbidden health advertising claims detection
 */

export const RESERVED_PAGE_SLUGS = [
  'admin',
  'api',
  'layanan',
  'area',
  'bidan',
  'blog',
  'lp',
  'sales',
  'segera-hadir',
  'tentang-kami',
  'kebijakan-privasi',
  'tim-bidan',
  '404',
  'rss.xml',
  'sitemap.xml',
  'sitemap-index.xml',
  '_blocks',
  'preview',
];

export const DEFAULT_FORBIDDEN_HEALTH_WORDS = [
  'menyembuhkan',
  'pasti sembuh',
  '100% aman',
  'terapi medis',
  'dijamin sembuh',
  'bebas komplikasi',
  'tanpa efek samping apapun',
  'jaminan sembuh',
];

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validatePageBuilderDoc(doc: any, isLandingPage = false): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Hanya terapkan validasi ketat saat dokumen hendak di-PUBLISH.
  // Saat masih berstatus DRAFT, user bebas menyimpan progres kerja sementara kapan saja.
  const isPublishing = doc._status === 'published';
  if (!isPublishing) {
    return { isValid: true, errors: [], warnings: [] };
  }

  const isLanding = isLandingPage || doc.pageType === 'landing';
  const isCanvas = doc.pageLayout === 'canvas';

  // 1. Slug Validation
  const slug = String(doc.slug || '').trim().toLowerCase();
  if (!slug) {
    errors.push('Slug URL wajib diisi sebelum publikasi.');
  } else {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      errors.push(`Format slug "${slug}" tidak valid. Hanya boleh menggunakan huruf kecil, angka, dan tanda hubung (-).`);
    }
    if (!isLanding && RESERVED_PAGE_SLUGS.includes(slug)) {
      errors.push(`Slug "${slug}" adalah rute tetap sistem web dan tidak boleh digunakan untuk halaman kustom.`);
    }
  }

  // 2. Ref Code Validation (for Landing Pages / Ads Campaign)
  if (isLanding) {
    const refCode = String(doc.refCode || '').trim();
    if (!refCode) {
      errors.push('Kode pelacak WhatsApp (refCode) wajib diisi untuk halaman kampanye iklan (landing page).');
    } else if (!/^[A-Z0-9_\-]+$/.test(refCode)) {
      errors.push(`Format refCode "${refCode}" tidak valid. Gunakan huruf kapital, angka, dan tanda hubung (contoh: LP-KOLIK-ADS atau KALA-LP-PROMO-A).`);
    }
  }

  // 3. Layout Blocks Validation
  const layout = Array.isArray(doc.layout) ? doc.layout : [];

  if (layout.length > 0) {
    // Check HeroBlock
    const heroBlocks = layout.filter((b: any) => b.blockType === 'hero');
    if (heroBlocks.length > 1) {
      errors.push(`Halaman hanya boleh memiliki maksimal satu Hero Block (H1). Terdeteksi ${heroBlocks.length} Hero Block.`);
    } else if (isCanvas && heroBlocks.length === 0 && !doc.headline) {
      // Pada blank canvas, wajib punya minimal 1 Hero / headline H1 karena tidak ada header tema bawaan
      errors.push('Halaman dengan layout Elementor Canvas wajib memiliki minimal satu Hero Block (H1).');
    }

    // Check Hero title length warning
    if (heroBlocks.length === 1) {
      const heroTitle = String(heroBlocks[0].title || heroBlocks[0].headline || '');
      if (heroTitle.length > 70) {
        warnings.push(`Judul Hero (${heroTitle.length} karakter) melebihi panjang ideal 70 karakter untuk kenyamanan layar mobile.`);
      }
    }

    // Check WhatsApp CTA presence for landing pages
    const hasCtaBlock = layout.some((b: any) =>
      b.blockType === 'hero' ||
      b.blockType === 'pricing' ||
      b.blockType === 'cta' ||
      b.blockType === 'solutions'
    );
    const hasBuiltInCta = doc.showWhatsAppCta !== false;

    if (isLanding && !hasCtaBlock && !hasBuiltInCta) {
      errors.push('Halaman iklan (landing page) wajib memiliki minimal satu CTA WhatsApp (Hero, Paket Harga, atau Banner CTA).');
    }

    // Check FAQ & Testimonials presence (warning for landing pages)
    if (isLanding) {
      const hasFaq = layout.some((b: any) => b.blockType === 'faq');
      const hasTestimonials = layout.some((b: any) => b.blockType === 'testimonials');
      if (!hasFaq) {
        warnings.push('Halaman belum memiliki FAQ Accordion untuk menjawab keraguan calon Bunda.');
      }
      if (!hasTestimonials) {
        warnings.push('Halaman belum memiliki Testimoni untuk memperkuat social proof.');
      }
    }

    // Check circular template references and image alt texts
    for (let i = 0; i < layout.length; i++) {
      const block = layout[i];

      // Check TemplateRef recursion
      if (block.blockType === 'templateRef') {
        const template = block.template;
        if (typeof template === 'object' && template !== null) {
          if (template.id === doc.id) {
            errors.push(`Blok ke-${i + 1} (TemplateRef) tidak boleh merujuk ke halaman itu sendiri (circular reference).`);
          }
          if (Array.isArray(template.layout)) {
            const hasNestedTemplateRef = template.layout.some((inner: any) => inner.blockType === 'templateRef');
            if (hasNestedTemplateRef) {
              errors.push(`Blok ke-${i + 1} (TemplateRef) mengandung template bersarang. Kedalaman template maksimal adalah 1.`);
            }
          }
        }
      }

      // Check image alt texts in Gallery, Hero, etc.
      if (block.blockType === 'gallery' && Array.isArray(block.items)) {
        block.items.forEach((item: any, imgIdx: number) => {
          if (item.image && !item.alt) {
            errors.push(`Gambar ke-${imgIdx + 1} pada Galeri Foto wajib memiliki Alt Text untuk aksesibilitas & SEO.`);
          }
        });
      }
      if (block.blockType === 'hero' && block.image && !block.imageAlt) {
        errors.push('Gambar pada Hero Block wajib memiliki Alt Text deskriptif.');
      }
    }

    // Check forbidden health claims in all block texts
    const stringifiedBlocks = JSON.stringify(layout).toLowerCase();
    for (const forbidden of DEFAULT_FORBIDDEN_HEALTH_WORDS) {
      if (stringifiedBlocks.includes(forbidden.toLowerCase())) {
        warnings.push(`Terdeteksi klaim medis berisiko: kata "${forbidden}" ditemukan pada konten halaman. Harap gunakan bahasa pendampingan kebidanan sesuai regulasi nakes.`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
