# Rencana: Layout & Widget Builder untuk Homepage KalaWeb

**Tanggal:** 10 November 2026
**Status:** ✅ MVP diimplementasikan di branch `feat/layout-widget-builder`
**Basis audit:** `apps/cms` (Payload 3.91) + `apps/web-kala` (Astro 5 + Tailwind 3.4)
**Tujuan akhir:** homepage bisa diubah **layout, urutan, dan widget-nya** dari CMS — bukan hanya teks.

> **Catatan implementasi:** Fase 1–4 sudah dikerjakan (container 1–4 kolom, 11 widget, style tab, integrasi homepage `home`, Custom HTML + sanitasi + scan Tailwind). Panduan pemakaian ada di `docs/pedoman-layout-builder.md`. Langkah yang tersisa: membuat dokumen `home` di CMS dan menyusun ulang kontennya, lalu QA visual desktop/tablet/mobile.

---

## 1. Ringkasan Eksekutif

Masalahnya bukan "homepage tidak bisa diedit", tetapi **homepage hanya bisa diedit teksnya**. Struktur, urutan section, kolom, dan widget masih hardcoded di `index.astro`.

Builder yang ada sekarang adalah **section builder**: bisa tambah/hapus/urutkan section, tetapi tiap section bentuknya sudah dipatok komponen. Belum ada:

- container/kolom yang bisa diatur,
- widget dasar (heading, text, image, button, video, map),
- style control per blok (background, padding, warna, typography),
- halaman homepage yang benar-benar membaca `layout` dari CMS.

Rencana ini menambahkan **satu lapisan baru di atas builder yang sudah ada**:

```
Container (1–4 kolom)
  ├── Widget: Heading
  ├── Widget: Text
  ├── Widget: Image
  ├── Widget: Button WhatsApp
  └── Widget: Custom HTML / Embed
```

Pendekatan ini memberi **80–90% kebebasan Elementor** tanpa mengganti arsitektur Astro + Tailwind + Cloudflare, dan tanpa kehilangan tracking WhatsApp, SEO, serta keamanan mobile.

**Estimasi:** 3–5 minggu untuk satu developer. MVP (container + widget dasar + style) sekitar 2–2,5 minggu.

---

## 2. Kondisi Saat Ini (Baseline)

| Area | Sudah ada | Belum ada |
|---|---|---|
| Homepage | Teks hero, pain points, benefits, promo, booking steps via **Site Settings → 🏠 Teks Beranda** | Layout, urutan section, tambah/hapus section, warna, gambar hero |
| Builder | Drag reorder, duplicate, disable, undo/redo, live preview, template, inner items (array) | Container, kolom, widget, nested blocks, style tab |
| Blok | 14 blok section (hero, painPoints, solutions, pricing, comparison, steps, testimonials, guarantee, faq, richText, cta, gallery, midwifeSpotlight, templateRef) | Widget dasar, container, custom HTML, featuredServices, valueProps, coverageArea |
| Renderer | `BlockRenderer.astro` flat + rekursi `templateRef` | Rekursi container/column |
| Tailwind | `content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}']` | Scan konten dari CMS |
| Preview | Token JWT, iframe, device desktop/tablet/mobile, inspector klik section | Seleksi nested block, preview style draft |
| Publish | Deploy hook Cloudflare dari koleksi Pages/LandingPages | Homepage belum memicu deploy hook |
| CSP | `frame-src` hanya self, GTM, Facebook | Google Maps/YouTube untuk embed |

**Kesimpulan baseline:** fondasinya sudah kuat. Kita tidak mulai dari nol; yang kurang adalah **model data container/widget**, **UI rekursif**, dan **koneksi homepage ke builder**.

---

## 3. Tujuan & Non-Tujuan

### Tujuan (MVP)

1. **Homepage sebagai halaman builder** — `index.astro` membaca `layout` dari CMS, dengan fallback ke homepage lama.
2. **Container 1–4 kolom** — bisa mengatur gap, padding, background, alignment, dan urutan kolom di mobile.
3. **Widget dasar** — heading, text, image, button, spacer, divider, icon box, video, map.
4. **Style control per blok** — background, padding/margin, border radius, shadow, warna teks, alignment, max width, visibility per device.
5. **Builder UI rekursif** — section tree bisa expand/collapse, drag widget ke kolom, drag antar-kolom.
6. **Custom HTML block** — untuk embed/kode khusus, dengan sanitasi dan Tailwind scanning saat build.
7. **Tracking, SEO, dan performa tetap terjaga** — tombol WhatsApp tetap memakai komponen resmi; schema tidak berubah; tidak ada JS tambahan di frontend.

### Non-Tujuan (MVP)

- Free canvas / absolute positioning / resize bebas seperti Elementor.
- Inline text editing langsung di iframe (klik teks → ketik). Ini fase berikutnya.
- Container bersarang lebih dari 1 level.
- Custom CSS per halaman (bisa ditambahkan nanti dengan guardrail).
- Mengganti seluruh komponen Astro dengan HTML runtime.
- Migrasi semua halaman ke builder; fokus dulu homepage.

---

## 4. Arsitektur Target

### 4.1 Model Data

`layout` tetap bertipe `blocks`. Kita menambah dua kelompok blok:

#### A. Container block

```ts
// apps/cms/src/blocks/ContainerBlock.ts
export const ContainerBlock: Block = {
  slug: 'container',
  labels: { singular: 'Layout / Container', plural: 'Layout / Container' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          defaultValue: '2',
          options: [
            { label: '1 Kolom', value: '1' },
            { label: '2 Kolom', value: '2' },
            { label: '3 Kolom', value: '3' },
            { label: '4 Kolom', value: '4' },
          ],
          label: 'Jumlah Kolom',
          admin: { width: '50%' },
        },
        {
          name: 'gap',
          type: 'select',
          defaultValue: 'md',
          options: [
            { label: 'Rapat', value: 'sm' },
            { label: 'Normal', value: 'md' },
            { label: 'Longgar', value: 'lg' },
          ],
          label: 'Jarak Antar Kolom',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'column1',
      type: 'blocks',
      label: 'Kolom 1',
      blocks: widgetBlocks,
      admin: { condition: (_, siblingData) => Number(siblingData?.columns) >= 1 },
    },
    {
      name: 'column2',
      type: 'blocks',
      label: 'Kolom 2',
      blocks: widgetBlocks,
      admin: { condition: (_, siblingData) => Number(siblingData?.columns) >= 2 },
    },
    {
      name: 'column3',
      type: 'blocks',
      label: 'Kolom 3',
      blocks: widgetBlocks,
      admin: { condition: (_, siblingData) => Number(siblingData?.columns) >= 3 },
    },
    {
      name: 'column4',
      type: 'blocks',
      label: 'Kolom 4',
      blocks: widgetBlocks,
      admin: { condition: (_, siblingData) => Number(siblingData?.columns) >= 4 },
    },
    // Style fields (lihat 4.2)
  ],
};
```

**Catatan penting:**

- `widgetBlocks` **tidak** memasukkan `ContainerBlock` pada MVP, untuk mencegah rekursi tak terbatas dan menyederhanakan drag/drop.
- Kolom yang tidak dipakai tetap menyimpan data lama (jika user mengurangi jumlah kolom). Renderer hanya membaca `column1..N`.
- `id` blok menggunakan UUID dari builder (pola yang sudah dipakai top-level dan terbukti berjalan).
- `disabled` tetap disuntikkan lewat `withDisabled`.

#### B. Widget blocks

| Widget | Field utama | Catatan |
|---|---|---|
| `heading` | text, level (h1–h4), align, color | H1 hanya boleh satu per halaman (validasi) |
| `text` | rich text / textarea, align, color, size | Bisa memakai `richText` Lexical atau textarea + line break |
| `image` | upload, alt, caption, link, ratio, rounded | Wajib alt untuk SEO |
| `button` | text, variant, link type (WA/URL), refCode, message | Jika WA, render `WhatsAppButton` agar tracking jalan |
| `spacer` | height (sm/md/lg/xl) | Untuk jarak vertikal |
| `divider` | style, color, width | Garis pemisah |
| `iconBox` | icon/emoji, title, description, align | Untuk benefits/features |
| `video` | YouTube/Vimeo URL, ratio, caption | Gunakan facade/lite embed agar performa aman |
| `map` | Google Maps embed URL, height | Perlu update CSP `frame-src` |
| `card` | image, title, description, button | Kartu generik untuk promo/layanan |
| `html` | html, name | Escape hatch; sanitasi + Tailwind scan. Script dilarang di MVP. |

Widget komposit yang sudah ada (hero, pricing, testimonials, FAQ, dll.) tetap dipertahankan sebagai **section block** dan bisa dipakai berdampingan dengan container.

### 4.2 Style Controls

Daripada membebaskan user menulis class Tailwind arbitrer (yang memicu masalah purge), style control memakai **token terkurasi**:

| Kontrol | Nilai | Implementasi |
|---|---|---|
| `background` | none, cream, white, peach, terracotta, dark, gradient | Class map di komponen |
| `padding` | none, sm, md, lg, xl | Class map |
| `margin` | none, sm, md, lg | Class map |
| `radius` | none, md, lg, full | Class map |
| `shadow` | none, sm, md, lg | Class map |
| `align` | left, center, right | Class map |
| `maxWidth` | narrow, medium, wide, full | Class map |
| `textColor` | ink, muted, accent, white | Class map |
| `visibility` | all, desktop, tablet, mobile | `hidden md:block` dsb. |

Untuk nilai di luar token (misalnya padding 37px), gunakan **CSS variable inline**:

```astro
<section style={`--kala-pad-y: ${block.paddingY ?? '4rem'}`} class="kala-section">
```

Dengan begitu, tidak ada class Tailwind dinamis yang perlu di-purge.

**Prinsip:** 95% kebutuhan desain diselesaikan dengan token; 5% sisanya lewat Custom HTML atau CSS variable.

### 4.3 Renderer

`BlockRenderer.astro` ditambah:

```astro
{block.blockType === 'container' && <ContainerBlock block={block} isPreview={isPreview} />}
{block.blockType === 'heading' && <HeadingBlock block={block} />}
{block.blockType === 'text' && <TextBlock block={block} />}
{block.blockType === 'image' && <ImageBlock block={block} />}
{block.blockType === 'button' && <ButtonBlock block={block} />}
{block.blockType === 'spacer' && <SpacerBlock block={block} />}
{block.blockType === 'divider' && <DividerBlock block={block} />}
{block.blockType === 'iconBox' && <IconBoxBlock block={block} />}
{block.blockType === 'video' && <VideoBlock block={block} />}
{block.blockType === 'map' && <MapBlock block={block} />}
{block.blockType === 'card' && <CardBlock block={block} />}
{block.blockType === 'html' && <HtmlBlock block={block} />}
```

`ContainerBlock.astro`:

```astro
---
import BlockRenderer from './BlockRenderer.astro';
const { block } = Astro.props;
const columns = Math.min(Math.max(Number(block.columns) || 2, 1), 4);
const columnBlocks = Array.from({ length: columns }, (_, i) => block[`column${i + 1}`] || []);
const gridClass = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}[columns];
---
<section class={`kala-container ${gridClass}`}>
  {columnBlocks.map((children) => (
    <div class="min-w-0">
      {children.map((child) => <BlockRenderer block={child} isPreview={Astro.props.isPreview} />)}
    </div>
  ))}
</section>
```

**Penting:** `BlockRenderer` saat ini melakukan `return` di frontmatter untuk blok disabled. Rekursi tetap aman karena setiap child dirender oleh instance baru.

**Konsistensi nomor WhatsApp:** `ButtonBlock` harus memakai nomor dari **Site Settings**, bukan hardcode. Saat ini `WhatsAppButton` default ke `siteConfig.whatsappNumber`; jika CMS memiliki nomor berbeda, nomor CMS harus menang. Teruskan `siteSettings` melalui `BlockRenderer` → `ContainerBlock` → child, atau gunakan `Astro.locals`. Jangan sampai tracking/refCode terlewat hanya karena widget baru tidak memakai komponen resmi.

### 4.4 Builder UI Rekursif

Perubahan utama di `apps/cms/src/components/admin/builder/`:

| File | Perubahan |
|---|---|
| `useBuilderLayout.ts` | Operasi tree: `addBlock(parentId, column, slug)`, `removeBlock(id)`, `duplicateBlock(id)`, `moveBlock(id, targetParentId, targetColumn, index)`, `updateBlock(id, fields)`, `findBlock(id)` |
| `SectionTree.tsx` | Render rekursif: container → column → widget; expand/collapse; indentation; drag handle per level |
| `SortableSection.tsx` | Dukung `children`, `depth`, `columnIndex`, tombol "Tambah widget" per kolom |
| `SectionSettings.tsx` | Tabs **Konten / Style / Advanced**; untuk container tampilkan tab per kolom |
| `AddSectionMenu.tsx` | Tabs: **Layout** (container), **Widget** (basic), **Seksi** (existing), **Template** |
| `BuilderField.tsx` | `selectedBlock` dicari lewat tree, bukan `layout.find`; undo/redo menyimpan seluruh tree |
| `PreviewFrame.tsx` | Kirim `sectionId` nested; inspector memilih child; tetap kompatibel dengan top-level |
| `preview-inspector.js` | `data-kala-section-id` sudah ada di setiap blok; pastikan container dan child punya ID unik |

**Drag & drop MVP:**

- Top-level: tetap seperti sekarang.
- Di dalam container: `SortableContext` per kolom, `verticalListSortingStrategy`.
- Pindah antar-kolom: dnd-kit `onDragOver`/`onDragEnd` dengan `over.id` berisi `column:<containerId>:<index>`.
- Batasi kedalaman 1 level (container → widget) agar kompleksitas tetap terkendali.

**Empty state:** setiap kolom kosong menampilkan tombol "+ Tambah widget" agar editor tidak bingung.

### 4.5 Custom HTML Block

Field:

```ts
{
  name: 'html',
  type: 'code',
  label: 'Kode HTML',
  admin: { language: 'html', description: 'Gunakan untuk embed. Script dan <style> dilarang di MVP.' },
},
{
  name: 'name',
  type: 'text',
  label: 'Nama Blok (untuk builder)',
},
```

**Kebijakan MVP:** tidak ada `<script>`, tidak ada `<style>`, dan tidak ada `on*` attribute. Embed memakai `iframe` dari domain allowlist. Jika nanti butuh widget pihak ketiga yang memerlukan script, buat blok khusus (misalnya `instagramEmbed`) dengan komponen resmi — jangan membuka script arbitrer di Custom HTML.

Alur render:

1. **Sanitasi** dengan `sanitize-html`:
   - allowlist tag: `section, div, span, p, h1-h6, ul, ol, li, a, img, picture, source, video, iframe, strong, em, br, hr, table, thead, tbody, tr, th, td`
   - allowlist atribut: `class, style, href, src, alt, title, width, height, loading, target, rel, allow, allowfullscreen, frameborder`
   - atribut `style` dibatasi ke properti aman (warna, spacing, border, typography) — jangan izinkan `url()`, `expression()`, atau `position: fixed`
   - buang `<script>`, `on*`, `javascript:`, `data:text/html`
   - iframe hanya dari domain allowlist (YouTube, Google Maps, Vimeo)
2. **Token replacement**:
   - `{{wa_link}}` → URL WhatsApp bertracking (refCode + message)
   - `{{phone}}` → nomor WhatsApp
   - `{{ref_code}}` → refCode halaman
3. **Render** dengan `set:html`.

**Tailwind scanning saat build:**

Karena situs static, class Tailwind yang hanya ada di CMS tidak akan masuk CSS. Solusi:

- Script `apps/web-kala/scripts/scan-cms-html.mjs`:
  - fetch published pages/landing pages/homepage dari Payload API,
  - telusuri `layout` **secara rekursif** (termasuk `column1..4`) dan kumpulkan semua field `html` dari blok `html`,
  - tulis `apps/web-kala/src/generated/cms-scan.html`.
- Tambahkan file itu ke `tailwind.config.mjs`:

```js
content: [
  './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  './src/generated/cms-scan.html',
],
```

- Jalankan di `prebuild` (setelah `convert-webp.mjs`).

**Keterbatasan yang harus disepakati:** class baru yang ditulis di draft belum muncul di preview sampai rebuild. Tampilkan notice di builder: "Class Tailwind baru akan aktif setelah publish/rebuild."

**CSP:** update `apps/web-kala/public/_headers`:

```
frame-src 'self' https://www.googletagmanager.com https://*.facebook.com https://www.facebook.com
  https://www.youtube.com https://www.youtube-nocookie.com https://maps.google.com https://www.google.com;
```

### 4.6 Integrasi Homepage

**Pilihan yang direkomendasikan: Page `home`, bukan Global.**

Alasannya: Page sudah punya builder, preview token, versioning, deploy hook, dan validasi. Kita tidak perlu membangun pipeline baru.

Langkah:

1. Tambah `'home'` ke `reservedSlugs` di `apps/web-kala/src/pages/[slug].astro` supaya tidak ada route duplikat `/home`.
   **Jangan** tambahkan `'home'` ke `RESERVED_SLUGS` di CMS — kalau ditambahkan, halaman `home` justru tidak bisa dipublish. Sebagai gantinya:
   - Tambah opsi `pageType: 'home'` dengan label "Beranda Utama".
   - Validasi: slug `home` hanya boleh dipakai jika `pageType === 'home'`; `pageType === 'home'` wajib memakai slug `home`.
2. Buat fungsi `fetchHomepage()` di `apps/web-kala/src/lib/payload.ts`:
   ```ts
   // Payload REST mengembalikan versi published secara default saat drafts aktif.
   // Filter pageType di sisi client untuk memastikan hanya homepage yang dipakai.
   fetch(`${PAYLOAD_URL}/api/pages?where[slug][equals]=home&depth=3&limit=1`)
   ```
3. `index.astro`:
   ```astro
   const homepage = await fetchHomepage();
   const blocks = homepage?.layout ?? [];
   ```
   - Jika `blocks.length > 0` → render `BlockRenderer` + `BaseLayout` dengan schema `home`.
   - Jika kosong/gagal → render homepage lama (fallback).
4. Migrasi konten:
   - Buat halaman `home` di CMS.
   - Susun ulang section homepage memakai blok yang ada + container/widget.
   - Preview di `/preview/home?token=...`.
   - Bandingkan visual desktop/tablet/mobile dengan homepage lama.
   - Setelah sign-off, homepage lama tetap disimpan sebagai fallback di kode (tidak dihapus pada fase ini).
5. Deploy hook: karena `home` adalah dokumen Pages, publish otomatis memicu rebuild Cloudflare (sudah ada di `Pages.ts`).

**Fallback adalah kunci rollback:** jika CMS down atau layout kosong, homepage lama tetap tampil.

### 4.7 Blok Komposit yang Perlu Ditambahkan

Untuk mempertahankan tampilan homepage saat migrasi:

| Blok | Sumber data | Catatan |
|---|---|---|
| `featuredServices` | Koleksi `services` | Grid layanan + CTA |
| `valueProps` | Statis / Site Settings | 5 pembeda layanan |
| `coverageArea` | Site Settings `coverageAreas` | Daftar area + CTA |
| `html` | Field `html` | Embed/kode khusus |

Setelah ini, homepage bisa disusun 100% dari blok tanpa kehilangan section.

---

## 5. Katalog Blok Target

| Kategori | Blok | Status |
|---|---|---|
| Layout | `container` | **Baru** |
| Widget dasar | `heading`, `text`, `image`, `button`, `spacer`, `divider`, `iconBox`, `video`, `map`, `card`, `html` | **Baru** |
| Section existing | `hero`, `painPoints`, `solutions`, `pricing`, `comparison`, `steps`, `testimonials`, `guarantee`, `faq`, `richText`, `cta`, `gallery`, `midwifeSpotlight`, `templateRef` | Ada |
| Section baru | `featuredServices`, `valueProps`, `coverageArea` | **Baru** |

Total: **14 existing + 15 new = 29 blok** (container 1 + widget 11 + section baru 3). Jika `card` ditunda, totalnya 28.

---

## 6. Fase & Estimasi

### Fase 0 — Desain & Guardrails (1–2 hari)

- Finalkan katalog blok, token style, dan model data container.
- Buat wireframe UI: tree, tab konten/style, tombol tambah widget per kolom.
- Tulis ADR singkat: kenapa container 1 level, kenapa bukan GrapesJS.
- Siapkan branch/worktree dan backup database.

**Output:** dokumen ini disetujui + wireframe + ADR.

### Fase 1 — Core Layout Engine (4–6 hari)

- `ContainerBlock.ts` + registrasi `allBlocks` + registry metadata.
- `widgetBlocks` placeholder (heading, text, image, button).
- `ContainerBlock.astro` + rekursi `BlockRenderer`.
- Tree-aware `useBuilderLayout` (add/remove/duplicate/move/find).
- `SectionTree` + `SortableSection` rekursif (1 level).
- `AddSectionMenu` tab Layout/Widget/Seksi/Template.
- Preview selection untuk nested block.
- Update `check-builder-parity.ts` untuk nested blocks.
- Test manual: container 2 kolom → heading + text → reorder → save → preview → publish.

**Exit criteria:** editor bisa membuat layout 2 kolom berisi 2 widget, menyimpan, dan melihat hasilnya di preview.

### Fase 2 — Widget & Style Controls (4–6 hari)

- 10 widget dasar: heading, text, image, button, spacer, divider, iconBox, video, map, card.
- Style tab: background, padding, margin, radius, shadow, align, maxWidth, textColor, visibility.
- `ButtonBlock` memakai `WhatsAppButton` + refCode.
- `ImageBlock` memakai `alt` wajib + `loading="lazy"`.
- `VideoBlock` memakai facade/lite embed.
- Responsive visibility + preview mobile/tablet/desktop.
- Validasi: satu H1 per halaman, alt text, CTA untuk landing page.

**Exit criteria:** editor bisa membuat section baru dari nol (container + widget + style) tanpa menyentuh kode.

### Fase 3 — Homepage Migration (3–4 hari)

- `fetchHomepage()` + `index.astro` membaca `layout` + fallback.
- Tambah `featuredServices`, `valueProps`, `coverageArea`.
- Buat halaman `home` di CMS dan susun ulang homepage.
- QA visual parity: desktop, tablet, mobile.
- Pastikan schema `home`, meta title/description, dan CTA tetap benar.
- Pastikan publish `home` memicu deploy hook.

**Exit criteria:** homepage tampil dari CMS, fallback lama masih berfungsi, tidak ada regresi SEO/tracking.

### Fase 4 — Custom HTML & Embed (2–3 hari)

- `HtmlBlock.ts` + `HtmlBlock.astro`.
- Tambah dependency `sanitize-html` + `@types/sanitize-html` di `apps/web-kala`.
- Sanitasi + token replacement.
- `scan-cms-html.mjs` + `prebuild` + `tailwind.config.mjs`.
- Buat placeholder `src/generated/cms-scan.html` yang di-commit agar Tailwind tidak warning saat dev.
- Script scan harus **fail-safe**: jika CMS tidak bisa diakses, tulis file kosong dan lanjutkan build (jangan menggagalkan deploy).
- Update CSP `_headers` untuk YouTube/Maps.
- Test: paste section Tailwind UI → publish → class muncul; embed map/video tampil; payload XSS gagal.

**Exit criteria:** custom HTML aman dipakai dan styling Tailwind bekerja setelah publish.

### Fase 5 — Hardening & Dokumentasi (2–3 hari)

- Accessibility: keyboard navigation, focus trap, aria label di builder.
- Performance: pastikan tidak ada JS baru di frontend; cek Lighthouse mobile.
- Test: parity, renderer snapshot, e2e happy path (add container → widget → save → preview → publish).
- Dokumentasi:
  - `docs/pedoman-layout-builder.md` untuk tim marketing.
  - Update `docs/pedoman-landing-page.md` dengan blok baru.
  - Update runbook deploy/rollback.
- Training singkat untuk admin.

**Total:** 16–24 hari kerja (3–5 minggu). MVP setelah Fase 2: sekitar 2–2,5 minggu.

---

## 7. Acceptance Criteria

### Fungsional

- [x] Editor bisa membuat container 1–4 kolom.
- [x] Editor bisa menambah widget ke kolom tertentu.
- [x] Editor bisa memindahkan widget antar-kolom dan mengubah urutan.
- [x] Editor bisa duplicate/disable/delete container beserta isinya.
- [x] Editor bisa mengubah background, padding, margin, radius, shadow, alignment, max width.
- [x] Editor bisa mengatur visibility desktop/tablet/mobile.
- [x] Editor bisa menyimpan draft, preview, dan publish.
- [x] Homepage membaca `layout` dari CMS dan fallback ke homepage lama jika kosong.
- [x] Custom HTML bisa menampilkan embed dan Tailwind class setelah publish.

### Non-Fungsional

- [ ] Tidak ada class Tailwind dinamis yang gagal ter-compile untuk widget predefined.
- [ ] Tidak ada XSS dari Custom HTML (test payload `<script>`, `onerror`, `javascript:`).
- [ ] Tidak ada regresi tracking WhatsApp: refCode, `data-use-capi`, dan event tracker tetap jalan.
- [ ] Tidak ada regresi SEO: satu H1, schema `home`, meta title/description, alt text.
- [ ] Tidak ada overflow horizontal di 375px, 768px, 1280px.
- [ ] Lighthouse mobile tidak turun lebih dari 5 poin dari baseline.
- [ ] Build time tidak naik lebih dari 30 detik (di luar fetch CMS).

---

## 8. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Drag/drop rekursif terlalu kompleks | Fase 1 molor | Batasi 1 level; column-based model; incremental test |
| Payload nested blocks tidak stabil | Data rusak | Parity check diperluas; validasi server; backup DB |
| Tailwind purge untuk custom HTML | Style hilang | Generated scan file + notice rebuild |
| Preview draft class baru belum muncul | Editor bingung | Notice di builder; rebuild manual |
| Homepage migrasi mengubah SEO | Ranking turun | Fallback + QA parity + preview + publish bertahap |
| Custom HTML XSS | Keamanan | Sanitasi allowlist; script dilarang total; CSP |
| Build time naik | Deploy lambat | Scan hanya field html; cache fetch; batasi limit |
| Scope creep (minta free canvas) | Tidak selesai | Non-goals disepakati; GrapesJS dievaluasi terpisah |

---

## 9. Rollback

1. **Feature flag:** `editorMode` sudah ada (`builder` vs `form`). Tambahkan flag `ENABLE_CONTAINER_BUILDER` jika perlu.
2. **Homepage fallback:** `index.astro` tetap menyimpan markup lama; jika `home` tidak ada atau `layout` kosong, fallback otomatis.
3. **Data additive:** tidak ada migrasi destruktif. Blok lama tetap valid.
4. **Deploy rollback:** Cloudflare deployment sebelumnya bisa di-rollback.
5. **Database:** backup sebelum Fase 1 dan sebelum migrasi homepage.

---

## 10. File Map

### CMS (`apps/cms`)

**Baru:**

- `src/blocks/ContainerBlock.ts`
- `src/blocks/widgets/HeadingBlock.ts`
- `src/blocks/widgets/TextBlock.ts`
- `src/blocks/widgets/ImageBlock.ts`
- `src/blocks/widgets/ButtonBlock.ts`
- `src/blocks/widgets/SpacerBlock.ts`
- `src/blocks/widgets/DividerBlock.ts`
- `src/blocks/widgets/IconBoxBlock.ts`
- `src/blocks/widgets/VideoBlock.ts`
- `src/blocks/widgets/MapBlock.ts`
- `src/blocks/widgets/CardBlock.ts`
- `src/blocks/widgets/HtmlBlock.ts`
- `src/blocks/widgets/index.ts`
- `src/blocks/FeaturedServicesBlock.ts`
- `src/blocks/ValuePropsBlock.ts`
- `src/blocks/CoverageAreaBlock.ts`
- `src/components/admin/builder/ContainerSettings.tsx`
- `src/components/admin/builder/tree-utils.ts`
- `src/blocks/commonStyleFields.ts`

> Widget & style controls diimplementasikan langsung di `SectionSettings.tsx` (tab Konten/Gaya), bukan file terpisah.

**Diubah:**

- `src/blocks/index.ts`
- `src/blocks/registry.ts` (tambah `BuilderFieldType` `code` dan metadata `nestedBlocks`)
- `src/collections/Pages.ts`
- `src/collections/LandingPages.ts` (opsional)
- `src/utilities/pageBuilderValidators.ts`
- `src/components/admin/builder/useBuilderLayout.ts`
- `src/components/admin/builder/SectionTree.tsx`
- `src/components/admin/builder/SortableSection.tsx`
- `src/components/admin/builder/SectionSettings.tsx`
- `src/components/admin/builder/AddSectionMenu.tsx`
- `src/components/admin/builder/BuilderField.tsx`
- `src/components/admin/builder/PreviewFrame.tsx`
- `scripts/check-builder-parity.ts`
- `scripts/sync-builder-registry.ts`

### Web (`apps/web-kala`)

**Baru:**

- `src/components/blocks/ContainerBlock.astro`
- `src/components/blocks/widgets/HeadingBlock.astro`
- `src/components/blocks/widgets/TextBlock.astro`
- `src/components/blocks/widgets/ImageBlock.astro`
- `src/components/blocks/widgets/ButtonBlock.astro`
- `src/components/blocks/widgets/SpacerBlock.astro`
- `src/components/blocks/widgets/DividerBlock.astro`
- `src/components/blocks/widgets/IconBoxBlock.astro`
- `src/components/blocks/widgets/VideoBlock.astro`
- `src/components/blocks/widgets/MapBlock.astro`
- `src/components/blocks/widgets/CardBlock.astro`
- `src/components/blocks/widgets/HtmlBlock.astro`
- `src/components/blocks/FeaturedServicesBlock.astro`
- `src/components/blocks/ValuePropsBlock.astro`
- `src/components/blocks/CoverageAreaBlock.astro`
- `scripts/scan-cms-html.mjs`
- `src/generated/cms-scan.html` (placeholder yang di-commit)

**Diubah:**

- `src/components/blocks/BlockRenderer.astro`
- `src/pages/index.astro`
- `src/pages/[slug].astro`
- `src/lib/payload.ts`
- `tailwind.config.mjs`
- `package.json` (`prebuild`)
- `public/_headers`
- `src/styles/global.css` (token style)

---

## 11. Keputusan yang Perlu Disetujui

1. **Homepage sebagai Page `home`** (rekomendasi) vs Global `Homepage`. Page lebih cepat karena memakai pipeline builder/preview/deploy yang sudah ada.
2. **Kedalaman container:** 1 level (rekomendasi MVP) vs nested tak terbatas.
3. **Widget dasar:** 10 widget di MVP (heading, text, image, button, spacer, divider, iconBox, video, map, card). Apakah ada widget prioritas lain (tabs, accordion, gallery)?
4. **Custom HTML:** rekomendasi MVP adalah **script dilarang total**; embed memakai `iframe` dari domain allowlist. Apakah ada kebutuhan embed yang benar-benar memerlukan script?
5. **Target waktu:** apakah 3–5 minggu realistis dengan prioritas lain saat ini?
6. **SOP:** siapa yang akan menulis panduan marketing dan melakukan training?

---

## 12. Langkah Berikutnya

1. Setujui dokumen ini dan keputusan di bagian 11.
2. Fase 0: finalkan wireframe + ADR + backup database.
3. Buat branch `feat/layout-widget-builder`.
4. Implementasi Fase 1 (container + recursive builder).
5. Demo internal: buat 1 section custom dari CMS, preview, publish.
6. Lanjut Fase 2–5 setelah Fase 1 diterima.

**Definition of Done keseluruhan:** homepage bisa diubah layout dan widget-nya dari CMS, tanpa developer, tanpa kehilangan tracking/SEO/mobile, dan dengan rollback yang aman.
