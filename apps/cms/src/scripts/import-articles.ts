/**
 * Import artikel Markdown dari web-kala ke Payload CMS.
 *
 * Jalankan dari root repo:
 *   npm run import:articles --workspace=cms-kala
 *
 * Script ini idempotent: artikel dicocokkan berdasarkan slug, lalu di-update
 * jika sudah ada atau dibuat baru jika belum ada.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPayload } from 'payload';
import { convertMarkdownToLexical } from '@payloadcms/richtext-lexical';
import { parse as parseYaml } from 'yaml';
import config from '../payload.config';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const blogDir = path.resolve(dirname, '../../../web-kala/src/content/blog');

interface Frontmatter {
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  author: string;
  authorTitle?: string;
  category: 'bayi' | 'ibu-menyusui' | 'layanan' | 'kehamilan';
  heroImage?: string;
  heroImageAlt?: string;
  keywords?: string[];
  medicalReviewer?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    noIndex?: boolean;
    canonicalUrl?: string;
  };
}

function parseMarkdownFile(source: string): { data: Frontmatter; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Frontmatter tidak ditemukan. Pastikan file diawali dan diakhiri "---".');
  }

  const data = parseYaml(match[1]) as Frontmatter;
  if (!data?.title || !data?.description || !data?.category) {
    throw new Error('Frontmatter wajib memiliki title, description, dan category.');
  }

  return { data, body: match[2] };
}

/**
 * Ubah sintaks GitHub alert menjadi blockquote biasa agar bisa dirender
 * oleh Lexical tanpa kehilangan konteks peringatan medis.
 */
function normalizeMarkdown(body: string): string {
  return body
    .replace(/^>\s*\[!CAUTION\]\s*$/gim, '> **⚠️ PERHATIAN MEDIS**')
    .replace(/^>\s*\[!WARNING\]\s*$/gim, '> **⚠️ PERINGATAN**')
    .replace(/^>\s*\[!IMPORTANT\]\s*$/gim, '> **PENTING**')
    .replace(/^>\s*\[!NOTE\]\s*$/gim, '> **CATATAN**')
    .replace(/^>\s*\[!TIP\]\s*$/gim, '> **TIPS**');
}

function toIsoDate(value: string | Date | undefined): string {
  if (!value) return new Date().toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function collectNodeTypes(node: any, types: Set<string> = new Set()): Set<string> {
  if (!node || typeof node !== 'object') return types;
  if (typeof node.type === 'string') types.add(node.type);
  if (Array.isArray(node.children)) {
    for (const child of node.children) collectNodeTypes(child, types);
  }
  return types;
}

async function run() {
  const dryRun = process.argv.includes('--dry-run') || process.env.DRY_RUN === 'true';
  const force = process.argv.includes('--force') || process.env.FORCE === 'true';
  console.log('🚀 Memulai import artikel Markdown → Payload CMS...');
  console.log(`📁 Sumber: ${blogDir}`);
  if (dryRun) console.log('🧪 Mode DRY-RUN: tidak ada data yang ditulis ke database.');
  if (force) console.log('⚠️  Mode FORCE: metadata CMS yang sudah ada akan ditimpa Markdown.');

  if (!fs.existsSync(blogDir)) {
    throw new Error(`Direktori artikel tidak ditemukan: ${blogDir}`);
  }

  const resolvedConfig: any = await config;
  const editorConfig = resolvedConfig.editor?.editorConfig;

  if (!editorConfig) {
    throw new Error('Editor config Lexical tidak ditemukan pada Payload config.');
  }

  const payload = dryRun ? null : await getPayload({ config });

  const files = fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith('.md') && !file.startsWith('_'));

  if (files.length === 0) {
    console.log('Tidak ada file Markdown untuk diimpor.');
    return;
  }

  let created = 0;
  let updated = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/i, '');
    const fullPath = path.join(blogDir, file);
    const source = fs.readFileSync(fullPath, 'utf8');
    const { data, body } = parseMarkdownFile(source);

    const lexicalContent = convertMarkdownToLexical({
      editorConfig,
      markdown: normalizeMarkdown(body),
    });

    // ED-003 & ED-006: Validasi ketat Peninjau Medis (Medical Reviewer) ber-STR
    const rawReviewer = String(data.medicalReviewer || '').trim();
    if (!rawReviewer) {
      throw new Error(
        `Artikel "${slug}" gagal diimpor: Field frontmatter 'medicalReviewer' wajib diisi dengan identitas bidan peninjau resmi.`
      );
    }

    const reviewerLower = rawReviewer.toLowerCase();
    if (
      reviewerLower.includes('tim medis & kebidanan kala') ||
      reviewerLower === 'tim medis kala' ||
      reviewerLower === 'tim medis'
    ) {
      throw new Error(
        `Artikel "${slug}" gagal diimpor: 'medicalReviewer' tidak boleh menggunakan nama generik ("${rawReviewer}"). ` +
        `Wajib mencantumkan nama bidan penanggung jawab klinis beserta gelar/STR.`
      );
    }

    const reviewDate = data.updatedDate || data.pubDate;
    if (!reviewDate) {
      throw new Error(
        `Artikel "${slug}" gagal diimpor: Tanggal peninjauan klinis (updatedDate atau pubDate) wajib dicantumkan.`
      );
    }

    let reviewedByMidwifeId: any = undefined;
    if (payload) {
      const midwifeRes = await payload.find({
        collection: 'midwives',
        limit: 100,
        overrideAccess: true,
      });

      if (midwifeRes.docs.length === 0) {
        throw new Error(
          `Artikel "${slug}" gagal diimpor: Database koleksi midwives masih kosong. Harap jalankan seed midwives terlebih dahulu.`
        );
      }

      // Ekstrak nomor STR jika ada dalam teks medicalReviewer
      const strMatch = rawReviewer.match(/STR[\w-]+/i)?.[0];

      // Cocokkan bidan terdaftar berdasarkan nomor STR atau kecocokan nama
      const matched = midwifeRes.docs.find((m: any) => {
        if (strMatch && m.strNumber && m.strNumber.toLowerCase() === strMatch.toLowerCase()) {
          return true;
        }
        if (m.name && rawReviewer.includes(m.name)) {
          return true;
        }
        // Cek nama pokok tanpa gelar depan/belakang
        const cleanMidwifeName = m.name?.replace(/^(Bidan\s+)|(,\s*.*)$/gi, '').trim();
        if (cleanMidwifeName && cleanMidwifeName.length > 3 && rawReviewer.includes(cleanMidwifeName)) {
          return true;
        }
        return false;
      });

      if (!matched) {
        throw new Error(
          `Artikel "${slug}" gagal diimpor: Bidan peninjau "${rawReviewer}" tidak terdaftar di database midwives. ` +
          `Dilarang menetapkan id bidan sembarangan secara acak/fallback.`
        );
      }

      reviewedByMidwifeId = matched.id;
    }

    const articleData = {
      title: data.title,
      slug,
      description: data.description,
      content: lexicalContent,
      category: data.category,
      heroImageAlt: data.heroImageAlt || `Ilustrasi artikel ${data.title}`,
      heroImageUrlFallback: data.heroImage || undefined,
      keywords: (data.keywords || []).map((keyword) => ({ keyword })),
      author: data.author,
      authorTitle: data.authorTitle || 'Bidan Praktisi Homecare Kala',
      medicalReviewer: rawReviewer,
      reviewedByMidwife: reviewedByMidwifeId,
      reviewedAt: toIsoDate(reviewDate),
      pubDate: toIsoDate(data.pubDate),
      updatedDate: toIsoDate(reviewDate),
      seo: {
        metaTitle: data.seo?.metaTitle || data.title,
        metaDescription: data.seo?.metaDescription || data.description,
        focusKeyword: data.seo?.focusKeyword || data.keywords?.[0] || '',
        noIndex: data.seo?.noIndex || false,
        canonicalUrl: data.seo?.canonicalUrl || `https://kalababyspa.com/blog/${slug}`,
      },
    };

    if (dryRun) {
      const nodeCount = Array.isArray((lexicalContent as any)?.root?.children)
        ? (lexicalContent as any).root.children.length
        : 0;
      const nodeTypes = collectNodeTypes((lexicalContent as any)?.root);
      const hasTable = nodeTypes.has('table');
      console.log(
        `🧪 Siap diimpor: ${slug} (${nodeCount} node, kategori: ${data.category}${hasTable ? ', termasuk tabel' : ''})`
      );
      continue;
    }

    const existing = await payload!.find({
      collection: 'articles',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    if (existing.docs.length > 0) {
      const existingDoc: any = existing.docs[0];

      if (existingDoc.content && !force) {
        console.log(`⏭️  Dilewati (sudah punya konten CMS): ${slug}`);
        continue;
      }

      // Pertahankan metadata CMS yang sudah ada; isi konten dan field yang masih kosong.
      const hasGenericExistingReviewer =
        existingDoc.medicalReviewer &&
        existingDoc.medicalReviewer.toLowerCase().includes('tim medis & kebidanan kala');

      const mergedData = force
        ? articleData
        : {
            ...articleData,
            title: existingDoc.title || articleData.title,
            description: existingDoc.description || articleData.description,
            category: existingDoc.category || articleData.category,
            author: existingDoc.author || articleData.author,
            authorTitle: existingDoc.authorTitle || articleData.authorTitle,
            medicalReviewer:
              !hasGenericExistingReviewer && existingDoc.medicalReviewer
                ? existingDoc.medicalReviewer
                : articleData.medicalReviewer,
            reviewedByMidwife: existingDoc.reviewedByMidwife || articleData.reviewedByMidwife,
            reviewedAt: existingDoc.reviewedAt || articleData.reviewedAt,
            pubDate: existingDoc.pubDate || articleData.pubDate,
            heroImageAlt: existingDoc.heroImageAlt || articleData.heroImageAlt,
            heroImageUrlFallback:
              existingDoc.heroImage?.url ||
              existingDoc.heroImageUrlFallback ||
              articleData.heroImageUrlFallback,
            keywords: existingDoc.keywords?.length ? existingDoc.keywords : articleData.keywords,
            seo: {
              ...articleData.seo,
              ...(existingDoc.seo || {}),
            },
          };

      await payload!.update({
        collection: 'articles',
        id: existingDoc.id,
        data: mergedData,
        draft: false,
        overrideAccess: true,
      });
      updated += 1;
      console.log(`♻️  Diperbarui: ${slug}`);
    } else {
      await payload!.create({
        collection: 'articles',
        data: articleData,
        draft: false,
        overrideAccess: true,
      });
      created += 1;
      console.log(`✅ Dibuat: ${slug}`);
    }
  }

  if (dryRun) {
    console.log(`\n🧪 Dry-run selesai. ${files.length} artikel siap diimpor.`);
    return;
  }

  console.log(`\n🎉 Selesai. Dibuat: ${created}, diperbarui: ${updated}.`);
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Import gagal:', error);
    process.exit(1);
  });
