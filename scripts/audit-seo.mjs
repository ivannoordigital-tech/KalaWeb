#!/usr/bin/env node

/**
 * Automated CI Technical SEO & Internal Link Audit for KalaWeb
 * Tracks:
 * - B9: Zero broken internal links (no 404s)
 * - Single H1 per published page
 * - Valid Canonical URL
 * - Structured Data (JSON-LD Schema) validity
 * - OpenGraph Image presence
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../apps/web-kala/dist');

if (!fs.existsSync(DIST_DIR)) {
  console.error(`❌ [SEO Audit] Error: Dist directory not found at: ${DIST_DIR}`);
  console.error(`Please run "npm run build" first before executing SEO audit.\n`);
  process.exit(1);
}

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(DIST_DIR);
console.log(`\n🔍 [KalaWeb SEO Audit] Scanning ${htmlFiles.length} generated HTML pages in ${DIST_DIR}...\n`);

let totalErrors = 0;
let totalWarnings = 0;
const auditedPages = [];

for (const filePath of htmlFiles) {
  const relativePath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
  const html = fs.readFileSync(filePath, 'utf-8');

  // Skip 404 page from strict validation
  const is404Page = relativePath === '404.html';

  const pageReport = {
    file: relativePath,
    h1Count: 0,
    hasCanonical: false,
    hasSchema: false,
    hasOgImage: false,
    brokenLinks: [],
    warnings: [],
  };

  // 1. Check H1 tags
  const h1Matches = html.match(/<h1[\s>]/gi) || [];
  pageReport.h1Count = h1Matches.length;
  if (!is404Page) {
    if (pageReport.h1Count === 0) {
      pageReport.warnings.push('Missing <h1> heading tag.');
      totalWarnings++;
    } else if (pageReport.h1Count > 1) {
      pageReport.warnings.push(`Multiple (${pageReport.h1Count}) <h1> heading tags detected.`);
      totalWarnings++;
    }
  }

  // 2. Check Canonical
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                         html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  if (canonicalMatch && canonicalMatch[1]) {
    pageReport.hasCanonical = true;
  } else if (!is404Page) {
    pageReport.warnings.push('Missing <link rel="canonical"> tag.');
    totalWarnings++;
  }

  // 3. Check JSON-LD Schema
  const schemaMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (schemaMatches.length > 0) {
    pageReport.hasSchema = true;
    for (const match of schemaMatches) {
      try {
        JSON.parse(match[1]);
      } catch (err) {
        pageReport.warnings.push(`Invalid JSON-LD syntax: ${err.message}`);
        totalErrors++;
      }
    }
  } else if (!is404Page && !relativePath.startsWith('lp/')) {
    pageReport.warnings.push('Missing JSON-LD structured data schema.');
    totalWarnings++;
  }

  // 4. Check OpenGraph Image
  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                       html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogImageMatch && ogImageMatch[1]) {
    pageReport.hasOgImage = true;
  }

  // 5. Check Internal Links for 404
  const linkMatches = [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)];
  for (const match of linkMatches) {
    let href = match[1].trim();

    // Skip mailto, tel, javascript, hash-only anchors, external links
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('#')) {
      continue;
    }

    if (href.startsWith('https://kalababyspa.com')) {
      href = href.replace('https://kalababyspa.com', '');
    }

    // Only validate internal paths
    if (href.startsWith('/')) {
      const cleanPath = href.split('?')[0].split('#')[0];
      if (cleanPath === '' || cleanPath === '/') continue;

      const targetPathHtml = path.join(DIST_DIR, cleanPath.slice(1), 'index.html');
      const targetFileHtml = path.join(DIST_DIR, `${cleanPath.slice(1)}.html`);
      const targetExact = path.join(DIST_DIR, cleanPath.slice(1));

      if (!fs.existsSync(targetPathHtml) && !fs.existsSync(targetFileHtml) && !fs.existsSync(targetExact)) {
        // Exclude dynamic query LP routes or known redirects if any
        pageReport.brokenLinks.push(href);
        totalErrors++;
      }
    }
  }

  auditedPages.push(pageReport);
}

// Display Summary
let passCount = 0;
for (const page of auditedPages) {
  if (page.brokenLinks.length > 0 || page.warnings.length > 0) {
    console.log(`📄 Page: /${page.file}`);
    if (page.brokenLinks.length > 0) {
      console.log(`   ❌ Broken Internal Links:`);
      page.brokenLinks.forEach((l) => console.log(`      - ${l}`));
    }
    if (page.warnings.length > 0) {
      console.log(`   ⚠️ Warnings:`);
      page.warnings.forEach((w) => console.log(`      - ${w}`));
    }
  } else {
    passCount++;
  }
}

console.log('\n========================================');
console.log(`📊 [KalaWeb SEO & Link Audit Results]`);
console.log(`   Total Pages Audited: ${htmlFiles.length}`);
console.log(`   Clean Pages (100% Pass): ${passCount}`);
console.log(`   Total Errors (Broken Links / Bad Schema): ${totalErrors}`);
console.log(`   Total Warnings (Missing H1/Canonical): ${totalWarnings}`);
console.log('========================================\n');

if (totalErrors > 0) {
  console.error(`❌ Build check failed: ${totalErrors} technical SEO / broken link errors found.\n`);
  process.exit(1);
} else {
  console.log(`✅ All critical technical SEO checks passed successfully!\n`);
  process.exit(0);
}
