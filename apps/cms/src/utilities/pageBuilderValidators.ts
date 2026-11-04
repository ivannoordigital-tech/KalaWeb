/**
 * Validation & Safeguards for KalaWeb CMS (Tier 2: ED-001, ED-002, ED-003)
 * Enforces strict pre-publish checks for Articles, LandingPages, and Pages:
 * - Single H1/HeroBlock
 * - Minimal 1 WhatsApp CTA (required for Canvas / Landing Pages)
 * - Reserved & valid slug check
 * - Non-empty content or layout check (reject empty pages/articles)
 * - Image alt text validation in Gallery (images) and Hero
 * - No circular template references (max depth 1)
 * - Strict forbidden health claims detection (Permenkes No. 1787/2010)
 * - Medical Reviewer sign-off verification for published articles
 * - Structured field-level error output (path, code, message)
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

/**
 * Klaim medis terlarang menurut etika dan Permenkes No. 1787/MENKES/PER/XII/2010:
 * Iklan layanan kesehatan dilarang menjamin kesembuhan mutlak atau keamanan tanpa risiko.
 */
export const DEFAULT_FORBIDDEN_HEALTH_WORDS = [
  'pasti sembuh',
  'dijamin sembuh',
  'jaminan sembuh',
  'garansi sembuh',
  '100% sembuh',
  '100% aman',
  'tanpa efek samping apapun',
  'bebas komplikasi',
  'tanpa risiko apapun',
  'obat ajaib',
  'terapi ajaib',
  'sembuh seketika',
  'langsung sembuh total',
];

const NEGATION_PATTERNS = [
  'tidak menjamin',
  'bukan berarti',
  'belum tentu',
  'tidak bisa dipastikan',
  'tidak ada jaminan',
  'tidak boleh mengklaim',
  'bukan jaminan',
  'tanpa jaminan',
  'tidak',
  'bukan',
];

/**
 * Mendeteksi apakah suatu frasa klaim terlarang muncul TANPA negasi / bantahan edukatif.
 * Contoh klaim terlarang (dilarang): "Pijat kolik pasti sembuh dalam 1 sesi"
 * Contoh edukatif bernegasi (diizinkan): "Terapi ini tidak menjamin pasti sembuh..."
 */
export function findUnnegatedMedicalClaim(text: string): string | null {
  if (!text) return null;
  const lower = text.toLowerCase();

  for (const forbidden of DEFAULT_FORBIDDEN_HEALTH_WORDS) {
    const term = forbidden.toLowerCase();
    let idx = lower.indexOf(term);

    while (idx !== -1) {
      // Ambil teks sebelum frasa dalam batas 60 karakter
      const start = Math.max(0, idx - 60);
      const precedingSlice = lower.slice(start, idx);

      // Hanya ambil klausa dalam kalimat yang sama (hindari lompat tanda baca akhir kalimat)
      const clause = (precedingSlice.split(/[.!?;\n]/).pop() || '').trim();

      // Cek apakah ada pola negasi mendahului frasa dalam klausa ini
      const isNegated = NEGATION_PATTERNS.some((neg) => {
        const words = clause.split(/\s+/).slice(-5);
        const tail = words.join(' ');
        return tail.includes(neg);
      });

      if (!isNegated) {
        return forbidden;
      }

      idx = lower.indexOf(term, idx + term.length);
    }
  }

  return null;
}

export interface FieldValidationError {
  path: string;
  code: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors: FieldValidationError[];
  warnings: string[];
}

/**
 * Deteksi apakah konten Lexical kosong (tidak ada teks atau hanya satu paragraf kosong).
 */
export function isEmptyLexical(content: any): boolean {
  if (!content) return true;
  if (typeof content !== 'object') return false;
  const root = content.root;
  if (!root || !Array.isArray(root.children) || root.children.length === 0) return true;
  if (root.children.length === 1) {
    const firstChild = root.children[0];
    if (
      firstChild.type === 'paragraph' &&
      (!Array.isArray(firstChild.children) || firstChild.children.length === 0)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Ratakan blok termasuk isi kolom pada blok Section, agar validasi
 * (hero, CTA, alt text) tetap berjalan untuk blok bersarang.
 */
export function flattenLayout(layout: any[]): any[] {
  const result: any[] = [];
  for (const block of Array.isArray(layout) ? layout : []) {
    if (!block) continue;
    result.push(block);
    if (block.blockType === 'section' && Array.isArray(block.columns)) {
      for (const column of block.columns) {
        if (Array.isArray(column?.content)) {
          result.push(...flattenLayout(column.content));
        }
      }
    }
  }
  return result;
}

/**
 * ED-001 & ED-003: Validasi dokumen Page Builder (Pages & LandingPages) saat publikasi.
 */
export function validatePageBuilderDoc(doc: any, isLandingPage = false): ValidationResult {
  const errors: string[] = [];
  const fieldErrors: FieldValidationError[] = [];
  const warnings: string[] = [];

  function addError(path: string, code: string, message: string) {
    errors.push(message);
    fieldErrors.push({ path, code, message });
  }

  // Hanya terapkan validasi ketat saat dokumen hendak di-PUBLISH.
  // Saat masih berstatus DRAFT, editor bebas menyimpan progres kerja sementara kapan saja.
  const isPublishing = doc._status === 'published' || doc.status === 'published';
  if (!isPublishing) {
    return { isValid: true, errors: [], fieldErrors: [], warnings: [] };
  }

  const isLanding = isLandingPage || doc.pageType === 'landing';
  const isCanvas = doc.pageLayout === 'canvas';

  // 1. Validasi Judul
  const title = String(doc.title || '').trim();
  if (!title) {
    addError('title', 'REQUIRED_FIELD', 'Judul halaman wajib diisi sebelum publikasi.');
  }

  // 2. Validasi Slug
  const slug = String(doc.slug || '').trim().toLowerCase();
  if (!slug) {
    addError('slug', 'REQUIRED_FIELD', 'Slug URL wajib diisi sebelum publikasi.');
  } else {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      addError(
        'slug',
        'INVALID_FORMAT',
        `Format slug "${slug}" tidak valid. Hanya boleh menggunakan huruf kecil, angka, dan tanda hubung (-).`
      );
    }
    if (!isLanding && RESERVED_PAGE_SLUGS.includes(slug)) {
      addError(
        'slug',
        'RESERVED_SLUG',
        `Slug "${slug}" adalah rute tetap sistem web dan tidak boleh digunakan untuk halaman kustom.`
      );
    }
  }

  // 3. Validasi Ref Code (khusus Landing Page iklan)
  if (isLanding) {
    const refCode = String(doc.refCode || '').trim();
    if (!refCode) {
      addError(
        'refCode',
        'REQUIRED_FIELD',
        'Kode pelacak WhatsApp (refCode) wajib diisi untuk halaman kampanye iklan (landing page).'
      );
    } else if (!/^[A-Z0-9_\-]+$/.test(refCode)) {
      addError(
        'refCode',
        'INVALID_FORMAT',
        `Format refCode "${refCode}" tidak valid. Gunakan huruf kapital, angka, dan tanda hubung (contoh: LP-KOLIK-ADS).`
      );
    }
  }

  // 4. ED-001: Pemeriksaan Konten / Susunan Blok (halaman kosong dilarang publish)
  const layout = Array.isArray(doc.layout) ? doc.layout : [];
  const hasContent = doc.content && !isEmptyLexical(doc.content);

  if (layout.length === 0 && !hasContent) {
    addError(
      'layout',
      'EMPTY_PAGE_CONTENT',
      'Halaman tidak boleh kosong. Wajib menyusun minimal satu blok visual atau mengisi konten artikel teks.'
    );
  }

  if (layout.length > 0) {
    const flatLayout = flattenLayout(layout);

    // Check HeroBlock
    const heroBlocks = flatLayout.filter((b: any) => b.blockType === 'hero');
    if (heroBlocks.length > 1) {
      addError(
        'layout',
        'MULTIPLE_HERO_BLOCKS',
        `Halaman hanya boleh memiliki maksimal satu Hero Block (H1). Terdeteksi ${heroBlocks.length} Hero Block.`
      );
    } else if (isCanvas && heroBlocks.length === 0 && !doc.headline) {
      addError(
        'layout',
        'MISSING_HERO_BLOCK',
        'Halaman dengan layout Kanvas Bersih wajib memiliki minimal satu Hero Block (H1) sebagai tajuk utama.'
      );
    }

    if (heroBlocks.length === 1) {
      const heroTitle = String(heroBlocks[0].title || heroBlocks[0].headline || '');
      if (heroTitle.length > 80) {
        warnings.push(`Judul Hero (${heroTitle.length} karakter) melebihi panjang ideal 80 karakter untuk keterbacaan mobile.`);
      }
    }

    // Check WhatsApp CTA presence for landing pages (ED-001: Wajib CTA nyata)
    const hasCtaBlock = flatLayout.some((b: any) =>
      b.blockType === 'cta' ||
      b.blockType === 'pricing' ||
      (b.blockType === 'hero' && Boolean(b.ctaText || b.buttonText))
    );
    const hasBuiltInCta = doc.showWhatsAppCta !== false;

    if (isLanding && !hasCtaBlock) {
      addError(
        'layout',
        'MISSING_WHATSAPP_CTA',
        'Halaman kampanye iklan (landing page) wajib memiliki minimal satu blok CTA WhatsApp nyata (blok CallToAction, Paket Harga, atau Hero dengan tombol CTA).'
      );
    } else if (isCanvas && !isLanding && !hasCtaBlock && !hasBuiltInCta) {
      addError(
        'layout',
        'MISSING_WHATSAPP_CTA',
        'Halaman kanvas wajib memiliki minimal satu tombol CTA WhatsApp nyata (blok CallToAction, Paket Harga, atau Hero dengan tombol CTA).'
      );
    }

    // Check Template recursion, image alt texts
    for (let i = 0; i < flatLayout.length; i++) {
      const block = flatLayout[i];

      // Check TemplateRef recursion
      if (block.blockType === 'templateRef') {
        const template = block.template;
        if (typeof template === 'object' && template !== null) {
          if (template.id === doc.id) {
            addError(
              `layout.${i}.template`,
              'CIRCULAR_TEMPLATE_REF',
              `Blok ke-${i + 1} (TemplateRef) tidak boleh merujuk ke halaman itu sendiri (circular reference).`
            );
          }
          if (Array.isArray(template.layout)) {
            const hasNestedTemplateRef = template.layout.some((inner: any) => inner.blockType === 'templateRef');
            if (hasNestedTemplateRef) {
              addError(
                `layout.${i}.template`,
                'NESTED_TEMPLATE_REF',
                `Blok ke-${i + 1} (TemplateRef) mengandung template bersarang. Kedalaman template maksimal adalah 1.`
              );
            }
          }
        }
      }

      // ED-001 Bug Fix: gallery uses "images" field, NOT "items"
      const galleryImages = Array.isArray(block.images)
        ? block.images
        : Array.isArray(block.items)
          ? block.items
          : [];

      if (block.blockType === 'gallery' && galleryImages.length > 0) {
        galleryImages.forEach((item: any, imgIdx: number) => {
          const hasImage = Boolean(item.image || item.imageUrlFallback);
          const hasAlt = Boolean(
            item.alt ||
            (typeof item.image === 'object' && item.image?.alt) ||
            item.caption
          );
          if (hasImage && !hasAlt) {
            addError(
              `layout.${i}.images.${imgIdx}.alt`,
              'MISSING_ALT_TEXT',
              `Gambar ke-${imgIdx + 1} pada Galeri Foto wajib memiliki Alt Text untuk aksesibilitas & SEO.`
            );
          }
        });
      }

      // Hero Block Image Alt
      if (block.blockType === 'hero' && block.image) {
        const hasHeroAlt = Boolean(
          block.imageAlt ||
          (typeof block.image === 'object' && block.image?.alt)
        );
        if (!hasHeroAlt) {
          addError(
            `layout.${i}.imageAlt`,
            'MISSING_ALT_TEXT',
            'Gambar pada Hero Block wajib memiliki Alt Text deskriptif.'
          );
        }
      }

      // Image Block Alt
      if (block.blockType === 'image' && (block.image || block.imageUrlFallback)) {
        const hasImageAlt = Boolean(
          block.alt ||
          (typeof block.image === 'object' && block.image?.alt)
        );
        if (!hasImageAlt) {
          addError(
            `layout.${i}.alt`,
            'MISSING_ALT_TEXT',
            'Gambar Tunggal wajib memiliki Alt Text deskriptif untuk aksesibilitas & SEO.'
          );
        }
      }

      // HTML Kustom: blokir konten berbahaya saat publikasi
      if (block.blockType === 'html') {
        const rawHtml = String(block.html || '');
        if (!rawHtml.trim()) {
          addError(
            `layout.${i}.html`,
            'EMPTY_HTML_BLOCK',
            'Blok HTML Kustom tidak boleh kosong saat publikasi.'
          );
        } else if (block.allowScripts) {
          warnings.push(
            `Blok ke-${i + 1} (HTML Kustom) menjalankan JavaScript di dalam iframe sandbox. Pastikan kode berasal dari sumber tepercaya.`
          );
          const containedMarkers: Array<{ pattern: RegExp; label: string }> = [
            { pattern: /<iframe\b/i, label: '<iframe>' },
            { pattern: /<object\b/i, label: '<object>' },
            { pattern: /<embed\b/i, label: '<embed>' },
            { pattern: /<form\b/i, label: '<form>' },
          ];
          const contained = containedMarkers
            .filter((item) => item.pattern.test(rawHtml))
            .map((item) => item.label);
          if (contained.length > 0) {
            warnings.push(
              `Blok HTML Kustom mengandung ${contained.join(', ')}. Elemen tersebut tidak akan berfungsi karena sandbox memblokir frame/form.`
            );
          }
        } else {
          const unsafeMarkers: Array<{ pattern: RegExp; label: string }> = [
            { pattern: /<script\b/i, label: '<script>' },
            { pattern: /<iframe\b/i, label: '<iframe>' },
            { pattern: /<object\b/i, label: '<object>' },
            { pattern: /<embed\b/i, label: '<embed>' },
            { pattern: /<form\b/i, label: '<form>' },
            { pattern: /\son[a-z]+\s*=/i, label: 'event handler (onclick dll)' },
            { pattern: /javascript\s*:/i, label: 'URL javascript:' },
          ];
          const found = unsafeMarkers.filter((item) => item.pattern.test(rawHtml)).map((item) => item.label);
          if (found.length > 0) {
            addError(
              `layout.${i}.html`,
              'UNSAFE_HTML',
              `HTML Kustom mengandung ${found.join(', ')}. Hapus kode tersebut sebelum publikasi, atau aktifkan mode "Jalankan JavaScript di dalam sandbox" bila memang diperlukan.`
            );
          }
        }
      }

      // Section kosong (tidak ada isi di semua kolom)
      if (block.blockType === 'section') {
        const hasColumnContent = Array.isArray(block.columns) && block.columns.some(
          (column: any) => Array.isArray(column?.content) && column.content.length > 0
        );
        if (!hasColumnContent) {
          warnings.push(
            `Blok ke-${i + 1} (Seksi & Kolom) belum memiliki isi di kolom mana pun sehingga tidak akan tampil.`
          );
        }
      }
    }

    // ED-003: Check forbidden medical claims (BLOCK publish, not just warning, with negation awareness)
    const stringifiedBlocks = JSON.stringify(layout);
    const forbiddenInBlocks = findUnnegatedMedicalClaim(stringifiedBlocks);
    if (forbiddenInBlocks) {
      addError(
        'layout',
        'FORBIDDEN_MEDICAL_CLAIM',
        `Klaim medis dilarang: frasa "${forbiddenInBlocks}" terdeteksi pada susunan blok tanpa negasi edukatif. Regulasi Kemenkes melarang janji/klaim kesembuhan mutlak.`
      );
    }
  }

  // ED-003: Check forbidden medical claims in rich text content as well
  if (doc.content) {
    const stringifiedContent = JSON.stringify(doc.content);
    const forbiddenInContent = findUnnegatedMedicalClaim(stringifiedContent);
    if (forbiddenInContent) {
      addError(
        'content',
        'FORBIDDEN_MEDICAL_CLAIM',
        `Klaim medis dilarang: frasa "${forbiddenInContent}" terdeteksi pada konten teks tanpa negasi edukatif. Regulasi Kemenkes melarang janji/klaim kesembuhan mutlak.`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors,
    warnings,
  };
}

/**
 * ED-001 & ED-003: Validasi dokumen Artikel Edukasi saat publikasi.
 */
export function validateArticleDoc(doc: any): ValidationResult {
  const errors: string[] = [];
  const fieldErrors: FieldValidationError[] = [];
  const warnings: string[] = [];

  function addError(path: string, code: string, message: string) {
    errors.push(message);
    fieldErrors.push({ path, code, message });
  }

  // Hanya periksa saat dokumen hendak dipublikasikan
  const isPublishing = doc._status === 'published' || doc.status === 'published';
  if (!isPublishing) {
    return { isValid: true, errors: [], fieldErrors: [], warnings: [] };
  }

  // 1. Validasi Judul
  const title = String(doc.title || '').trim();
  if (!title) {
    addError('title', 'REQUIRED_FIELD', 'Judul artikel wajib diisi sebelum publikasi.');
  }

  // 2. Validasi Slug
  const slug = String(doc.slug || '').trim().toLowerCase();
  if (!slug) {
    addError('slug', 'REQUIRED_FIELD', 'Slug URL artikel wajib diisi.');
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    addError(
      'slug',
      'INVALID_FORMAT',
      `Format slug artikel "${slug}" tidak valid. Hanya boleh menggunakan huruf kecil, angka, dan tanda hubung (-).`
    );
  }

  // 3. Validasi Ringkasan Deskripsi
  const description = String(doc.description || '').trim();
  if (!description) {
    addError('description', 'REQUIRED_FIELD', 'Ringkasan deskripsi artikel wajib diisi untuk cuplikan pembaca dan SEO.');
  } else if (description.length < 20) {
    warnings.push('Deskripsi artikel terlalu singkat (< 20 karakter). Disarankan minimal 50-160 karakter untuk SEO optimal.');
  }

  // 4. Validasi Kategori
  if (!doc.category) {
    addError('category', 'REQUIRED_FIELD', 'Pilar kategori artikel wajib dipilih.');
  }

  // 5. Validasi Isi Konten Lengkap
  if (!doc.content || isEmptyLexical(doc.content)) {
    addError('content', 'EMPTY_ARTICLE_CONTENT', 'Isi konten artikel tidak boleh kosong saat diterbitkan.');
  }

  // 6. ED-003 & ED-006: Validasi Reviewer Medis (Sign-off)
  const reviewer = String(doc.medicalReviewer || '').trim();
  const hasReviewerRelation = Boolean(doc.reviewedByMidwife);
  const isGenericReviewer =
    reviewer.toLowerCase().includes('tim medis & kebidanan kala') ||
    reviewer.toLowerCase() === 'tim medis kala' ||
    reviewer.toLowerCase() === 'tim medis';

  if (!reviewer && !hasReviewerRelation) {
    addError(
      'medicalReviewer',
      'MISSING_MEDICAL_REVIEWER',
      'Artikel edukasi kesehatan wajib mencantumkan Reviewer Medis (bidan ber-STR resmi) sebelum dipublikasikan.'
    );
  } else if (isGenericReviewer && !hasReviewerRelation) {
    addError(
      'medicalReviewer',
      'INVALID_MEDICAL_REVIEWER',
      'Reviewer Medis tidak boleh hanya menggunakan nama generik ("Tim Medis..."). Wajib memilih profil Bidan terverifikasi (reviewedByMidwife) atau mencantumkan nama bidan penanggung jawab beserta gelar/STR.'
    );
  }

  // Wajibkan tanggal peninjauan klinis (reviewedAt) saat publikasi demi akuntabilitas
  if (!doc.reviewedAt) {
    addError(
      'reviewedAt',
      'MISSING_REVIEW_DATE',
      'Tanggal peninjauan medis (reviewedAt) wajib diisi sebelum artikel diterbitkan demi akuntabilitas klinis.'
    );
  }

  // 7. ED-003: Deteksi Klaim Medis Terlarang dalam Artikel (dengan pengecekan negasi edukatif)
  const fullTextToScan = (
    title + ' ' +
    description + ' ' +
    JSON.stringify(doc.content || {})
  );

  const forbiddenInArticle = findUnnegatedMedicalClaim(fullTextToScan);
  if (forbiddenInArticle) {
    addError(
      'content',
      'FORBIDDEN_MEDICAL_CLAIM',
      `Klaim medis terlarang: frasa "${forbiddenInArticle}" terdeteksi dalam artikel tanpa negasi edukatif. Regulasi Kemenkes melarang garansi/klaim kesembuhan mutlak.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors,
    warnings,
  };
}
