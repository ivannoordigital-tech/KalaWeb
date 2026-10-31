# Rencana Eksekusi Revisi — Visual Landing Page Builder KalaWeb

**Status:** Disetujui untuk dieksekusi
**Versi:** 1.0
**Tanggal:** 31 Oktober 2026
**Basis audit:** HEAD `1855fb7`
**Target:** Membangun editor visual 3-level (Section → Block → Settings) di atas Payload CMS yang sudah ada, tanpa migrasi database dan tanpa mengorbankan performa halaman publik.

---

## 0. Ringkasan Keputusan (baca ini dulu)

| # | Keputusan | Alasan |
|---|---|---|
| D1 | **Storage tetap `layout` Payload blocks.** Tidak pindah ke `sections` JSON. | Tidak ada migrasi, validasi/versi/media tetap jalan, rollback mudah. |
| D2 | **Editor berupa custom field di admin Payload**, bukan SPA terpisah. | Auth, RBAC, draft, versions, media, dan API sudah tersedia. |
| D3 | **Preview memakai Astro SSR on-demand + signed token**, bukan mengirim seluruh state lewat `postMessage`. | Satu renderer (Astro), tidak ada drift visual, draft benar-benar ter-render. |
| D4 | **Granularitas: section-specific inner blocks**, bukan atom bebas. | Mengikuti model Shopify; memakai field array yang sudah ada; tidak membangun Elementor. |
| D5 | **Sumber state tunggal = form state Payload (`useField` path `layout`).** Tidak ada zustand di MVP. | Menghindari dua sumber kebenaran dan race saat save. |
| D6 | **Tidak ada autosave di MVP.** Simpan draft eksplisit, publish eksplisit. | Mencegah deploy storm dan konflik versi. |
| D7 | **Theme bebas (font/hex) ditunda.** MVP memakai opsi warna yang sudah ada. | Menjaga WCAG AA dan konsistensi brand. |
| D8 | **Tracking dimatikan total di `/preview/*`.** | Preview saat ini mengirim PageView CAPI asli. |

**Prinsip eksekusi:** setiap sprint harus punya exit criteria yang terukur. Jangan mulai sprint berikutnya sebelum exit criteria sprint sebelumnya lulus.

---

## 1. Scope

### 1.1 MVP (Sprint 0–3, target 5–6 minggu)

- Editor visual 2 kolom: sidebar section tree + iframe preview.
- Drag-and-drop urutan section.
- Tambah, hapus, duplikasi, sembunyikan section.
- Undo/redo 20 langkah.
- Inline settings untuk field sederhana: text, textarea, select, checkbox, number.
- Preview draft yang akurat, privat, dan bebas analytics.
- Klik elemen di canvas → section terpilih di sidebar (dan sebaliknya).
- Breakpoint 375 / 768 / fluid.
- 3-level navigation untuk section berbasis array (Pricing, FAQ, Testimonials, Gallery, dll.).
- Fallback ke mode form native untuk field kompleks (rich text, upload, array tertentu).

### 1.2 Sprint 4–5 (setelah MVP)

- Media picker + upload di sidebar.
- Virtual inner blocks untuk Hero dan CTA (reorder badge/heading/image/button tanpa nested blocks).
- Insert template dari `block-templates`.
- Theme token terbatas (opsional, beta).
- E2E, visual regression, rollout bertahap.

### 1.3 Di luar scope (jangan dikerjakan sekarang)

- Mengganti `layout` dengan JSON `sections`.
- Renderer client-side duplikat untuk preview instan.
- Atom bebas lintas section (heading/paragraph/button global).
- Theme designer penuh (font bebas, hex bebas, layout bebas).
- Kolaborasi real-time / komentar.
- Drag block antar section.
- Multi-language.
- Autosave.
- Per-block WhatsApp number.

---

## 2. Arsitektur Target

```
┌──────────────────────────────────────────────────────────────┐
│ admin.kalababyspa.com (Payload CMS / Next.js 15)             │
│                                                              │
│  LandingPages edit form                                      │
│  ├── sidebar fields (title, slug, refCode, status, ...)      │
│  ├── field "builder" (ui) ──> BuilderField (client)          │
│  │     ├── SectionTree (dnd-kit)                             │
│  │     ├── SectionSettings (registry-driven)                 │
│  │     ├── InnerBlockList (array path)                       │
│  │     ├── useBuilderHistory (undo/redo)                     │
│  │     └── PreviewFrame ──────────────┐                      │
│  └── field "layout" (native, hidden in visual mode)          │
│                                       │ postMessage           │
│  endpoint /api/preview-token          │ (origin-checked)      │
│  endpoint /api/preview-redirect       │                      │
└───────────────────────────────────────┼──────────────────────┘
                                        │ iframe src + token
                                        ▼
┌──────────────────────────────────────────────────────────────┐
│ kalababyspa.com (Astro 5)                                    │
│                                                              │
│  /preview/sales/[slug]  (prerender = false)                  │
│  /preview/[slug]        (prerender = false)                  │
│  ├── verify JWT (jose)                                       │
│  ├── fetch draft via REST + API key (+ CF Access service)    │
│  ├── BlockRenderer (komponen Astro yang sama dengan publik)  │
│  └── preview-inspector.js (overlay, click, hover)            │
│                                                              │
│  /sales/[slug], /[slug]  → tetap static, 0 JS builder        │
└──────────────────────────────────────────────────────────────┘
```

**Yang tidak berubah:** halaman publik tetap SSG, tidak ada React/dnd-kit yang bocor ke pengunjung. Preview SSR hanya dijalankan untuk route `/preview/*`.

---

## 3. Kontrak Data

### 3.1 Storage (tidak berubah)

Tetap memakai field `layout` bertipe `blocks` di `LandingPages` dan `Pages`.

```ts
// bentuk yang sudah ada
layout: [
  {
    id: 'uuid-dari-payload',
    blockType: 'hero',
    disabled: false,          // field baru, opsional
    headline: '...',
    subheadline: '...',
    // ...field block lainnya
  }
]
```

**Aturan:**
- Jangan menambahkan field `sections`. Jangan mengubah API publik.
- `id` block selalu dari Payload. Saat duplikasi di client, generate `crypto.randomUUID()`.
- Field baru hanya `disabled` (semua block) dan `elementOrder` (Hero/CTA, Sprint 4).

### 3.2 Registry (single source of truth)

Buat `apps/cms/src/blocks/registry.ts`:

```ts
export type BuilderFieldType =
  | 'text' | 'textarea' | 'select' | 'checkbox'
  | 'number' | 'upload' | 'richtext' | 'array';

export interface BuilderFieldMeta {
  name: string;
  label: string;
  type: BuilderFieldType;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export interface BuilderInnerBlocks {
  path: string;                 // contoh: 'items', 'faqs', 'packages'
  label: string;                // contoh: 'Paket Harga'
  itemTitleField: string;       // contoh: 'name'
  fields: BuilderFieldMeta[];
  min?: number;
  max?: number;
}

export interface BuilderBlockMeta {
  slug: string;                 // 'hero'
  label: string;                // 'Banner Utama'
  icon: string;                 // nama ikon lucide
  category: 'hero' | 'proof' | 'offer' | 'content' | 'cta';
  description: string;
  defaults: Record<string, unknown>;   // wajib memenuhi field required
  fields: BuilderFieldMeta[];
  innerBlocks?: BuilderInnerBlocks;
  presets?: Array<{ id: string; label: string; defaults: Record<string, unknown> }>;
}
```

Registry harus mencakup **14 block** yang ada. Script sinkronisasi:

- `apps/cms/scripts/sync-builder-registry.ts` membaca registry, menulis `apps/web-kala/src/components/blocks/registry.generated.json`.
- Root script: `npm run sync:builder`.
- CI gagal jika hasil generate berbeda (`git diff --exit-code`).
- Script juga memvalidasi: setiap slug di `registry` ada di `allBlocks`, dan sebaliknya.

**Kenapa tidak membuat `packages/builder-core` sekarang?** Untuk MVP, generated JSON + relative import cukup dan tidak menambah konfigurasi build. Ekstraksi ke package bisa dilakukan setelah stabil.

### 3.3 Field `disabled`

Tambahkan helper di `apps/cms/src/blocks/withDisabled.ts`:

```ts
import type { Block } from 'payload';

export const withDisabled = (block: Block): Block => ({
  ...block,
  fields: [
    {
      name: 'disabled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Sembunyikan seksi ini dari halaman publik',
    },
    ...block.fields,
  ],
});
```

Terapkan **sekali** pada setiap block saat array didefinisikan di `apps/cms/src/blocks/index.ts`:

```ts
export const baseBlocks = [HeroBlock, PainPointsBlock, /* ... */].map(withDisabled);
export const allBlocks = [...baseBlocks, withDisabled(TemplateRefBlock)];
```

Jangan memanggil `withDisabled` dua kali pada block yang sama (field `disabled` ganda).

**Renderer:**
- Produksi: `if (block.disabled) return null`.
- Preview: tetap render, beri `data-kala-disabled="true"`, opacity 0.45, dan badge "Disembunyikan".
- `pageBuilderValidators.ts`: filter `!b.disabled` sebelum menghitung hero/CTA/FAQ/testimonial.
- SEO adapter: filter `disabled`.

### 3.4 ID, duplikasi, dan default

- `addSection(slug)`: ambil `defaults` dari registry, buat `id = crypto.randomUUID()`, sisipkan setelah section terpilih (atau di akhir).
- `duplicateSection(id)`: `structuredClone`, ganti `id`, sisipkan setelah sumber. Jangan menyalin `disabled`? Salin apa adanya, lalu set `disabled = false` agar terlihat.
- `duplicateInnerItem`: sama, untuk array item.
- `addInnerItem(sectionId, path)`: buat object default dari `innerBlocks.fields` (string kosong, array kosong, false, 0).
- **Jangan** menyimpan `id` duplikat. Ini menyebabkan React key collision dan Payload validation error.

### 3.5 Kompatibilitas

- Dokumen lama tanpa `disabled` dianggap `false`.
- Dokumen lama tanpa `elementOrder` memakai urutan default renderer.
- `TemplateRefBlock` tetap berfungsi; inner block dari template di-clone dengan ID baru saat disisipkan.
- API publik (`/api/landing-pages`) tidak berubah bentuk.

---

## 4. Editor (Payload Custom Field)

### 4.1 Pemasangan field

Di `LandingPages.ts` dan `Pages.ts`, tambahkan:

```ts
{
  name: 'editorMode',
  type: 'select',
  defaultValue: 'visual',
  options: [
    { label: 'Visual Builder', value: 'visual' },
    { label: 'Form Klasik', value: 'form' },
  ],
  admin: { position: 'sidebar' },
},
{
  name: 'builder',
  type: 'ui',
  admin: {
    components: {
      Field: '/components/admin/builder/BuilderField#BuilderField',
    },
    condition: (data) => data?.editorMode !== 'form',
  },
},
```

Field `layout` yang lama:

```ts
admin: {
  hidden: ({ data }) => data?.editorMode !== 'form',
}
```

Jalankan `npm run generate:importmap --workspace=cms-kala` setelah menambah komponen.

**Keuntungan:** form native tetap ada sebagai fallback. Tidak ada duplikasi field. Save/validasi/versi tetap ditangani Payload.

### 4.2 `BuilderField`

Komponen client (`'use client'`) yang:

- Membaca `layout` dengan `useField<Block[]>({ path: 'layout' })`. Jika versi Payload ini membatasi `useField` pada field pemilik komponen, gunakan `useFormFields` untuk membaca dan `useForm().dispatchFields` untuk menulis path `layout`.
- Membaca `useDocumentInfo()` untuk `id`, `collectionSlug`, `data.slug`, `data.updatedAt`.
- Menampilkan kartu ringkasan + tombol **Buka Visual Builder**.
- Membuka overlay full-screen lewat portal (bukan mengubah layout form Payload).
- Menyediakan tombol **Mode Form** yang menutup overlay dan mengarahkan user ke field native.

Struktur UI:

```
┌─────────────────────────────────────────────────────────────┐
│ Topbar: [Judul] [Draft/Published] [Preview] [Undo/Redo] [X] │
├───────────────────────┬─────────────────────────────────────┤
│ Sidebar 360px         │ Canvas                              │
│                       │                                     │
│ Breadcrumb:           │  ┌───────────────────────────────┐  │
│ Halaman > Hero        │  │  iframe preview               │  │
│                       │  │  (token, no-store)            │  │
│ [+ Tambah Seksi]      │  │                               │  │
│                       │  │  overlay seleksi biru         │  │
│ ☰ Hero        👁 ⋯    │  │                               │  │
│ ☰ Pain Points 👁 ⋯    │  └───────────────────────────────┘  │
│ ☰ Pricing     👁 ⋯    │                                     │
│                       │  Device: [375] [768] [100%]         │
│ ── Settings Hero ──   │                                     │
│ Badge   [.........]   │                                     │
│ Judul   [.........]   │                                     │
│ ...                   │                                     │
└───────────────────────┴─────────────────────────────────────┘
```

### 4.3 Interaksi sidebar

| Aksi | Perilaku |
|---|---|
| Drag handle | Reorder `layout` via `arrayMove` |
| Klik section | Pilih section; tampilkan settings; kirim `select` ke iframe |
| Ikon mata | Toggle `disabled`; preview langsung menandai |
| Duplikat | Clone + ID baru; sisipkan setelah sumber |
| Hapus | Konfirmasi; hapus dari `layout` |
| Tambah Seksi | Menu dikelompokkan per kategori; klik = insert defaults |
| Chevron | Buka daftar inner blocks (jika ada) |
| Klik inner block | Breadcrumb level 3; tampilkan field item |
| Tombol Mode Form | Fallback ke field native |

### 4.4 State & history

- **Satu sumber kebenaran:** `setValue(newLayout)` dari `useField`.
- Semua mutasi (section maupun inner item) dilakukan pada **seluruh nilai `layout`**: clone → ubah → `setValue`. `innerBlocks.path` hanya penanda lokasi array di dalam section, bukan path field Payload yang harus di-dispatch satu per satu.
- Tidak ada state duplikat di zustand/Context untuk `layout`.
- `useBuilderHistory` menyimpan snapshot JSON `layout` (maks 20). Setiap mutasi mendorong snapshot. `Ctrl/Cmd+Z` dan `Ctrl/Cmd+Shift+Z`.
- History di-reset setelah save sukses (`updatedAt` berubah).
- Jangan mencampur history lokal dengan Payload versions. UI hanya meng-undo edit yang belum disimpan.

### 4.5 Inline settings

Untuk MVP, render otomatis berdasarkan `BuilderFieldMeta`:

| Tipe | Komponen |
|---|---|
| `text` | `<input type="text">` |
| `textarea` | `<textarea>` |
| `select` | `<select>` |
| `checkbox` | `<input type="checkbox">` |
| `number` | `<input type="number">` |
| `upload` | Placeholder + tombol "Edit di mode form" (Sprint 4 baru picker) |
| `richtext` | Tombol "Edit di mode form" |
| `array` | Dikelola sebagai inner blocks, bukan input tunggal |

**Validasi required:** baca `useForm().formState` dan tandai field yang error. Tampilkan banner "N seksi belum lengkap" dengan tombol menuju section terkait. Jangan biarkan user publish tanpa melihat error.

### 4.6 Save & preview refresh

- Save memakai tombol Save/Publish Payload yang sudah ada.
- Setelah `data.updatedAt` berubah, iframe di-refresh otomatis (debounce 500 ms) dengan `&v=timestamp`.
- Tampilkan badge **"Preview = versi tersimpan"** jika ada perubahan lokal yang belum disimpan.
- Untuk dokumen baru (belum punya `id`), tampilkan: "Simpan draft dulu untuk mengaktifkan preview."
- Tidak ada autosave di MVP.

---

## 5. Preview

### 5.1 SSR on-demand

Di `apps/web-kala`:

```bash
npx astro add cloudflare
```

Lalu di `astro.config.mjs`:

```js
export default defineConfig({
  output: 'static', // tetap static; hanya route preview yang on-demand
  adapter: cloudflare(),
  // ...
});
```

Di kedua route preview:

```astro
---
export const prerender = false;
---
```

**Verifikasi:** `npm run build --workspace=web-kala` harus menghasilkan `_worker.js` dan tetap menghasilkan halaman statis untuk route publik. Jika adapter bermasalah, fallback: worker terpisah `apps/preview` yang mengimpor komponen dari `apps/web-kala/src/components` (jangan duplikasi komponen).

### 5.2 Token & akses

**CMS endpoint** `GET /api/preview-token`:

- Wajib `req.user`.
- Role yang diizinkan: `superadmin`, `operator`, `marketing`, `seo`.
- Query: `collection=landing-pages|pages`, `id=<docId>`.
- Sign JWT HS256 dengan `jose`:
  - `sub`: doc id
  - `collection`
  - `slug`
  - `iss`: `kala-cms`
  - `aud`: `kala-preview`
  - `exp`: 15 menit
- Return `{ url: `${PREVIEW_BASE_URL}/preview/...?token=...` }`.

**CMS endpoint** `GET /api/preview-redirect?collection=...&id=...`:

- Sama seperti di atas, tetapi langsung `302` ke URL preview. Dipakai untuk tombol "Preview" di admin.

**Astro** `apps/web-kala/src/lib/preview.ts`:

```ts
import { jwtVerify } from 'jose';

export async function verifyPreviewToken(token: string, secret: string) {
  const key = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, key, {
    issuer: 'kala-cms',
    audience: 'kala-preview',
  });
  return payload; // { sub, collection, slug }
}
```

> **Penting:** di SSR Cloudflare, jangan memakai `import.meta.env` untuk secret karena nilainya bisa ter-inline saat build. Ambil dari runtime:
>
> ```astro
> const env = Astro.locals.runtime.env; // @astrojs/cloudflare
> const payload = await verifyPreviewToken(token, env.PREVIEW_SECRET);
> ```
>
> API key dan header Cloudflare Access juga harus dibaca dari `Astro.locals.runtime.env`, bukan dari bundle client. Di dev lokal, sediakan fallback ke `import.meta.env` hanya jika `Astro.locals.runtime` tidak tersedia; jangan pernah mengandalkan fallback itu di production.

**Fetch draft:**

```
GET https://admin.kalababyspa.com/api/{collection}/{id}?draft=true&depth=3
Authorization: users API-Key ${PREVIEW_API_KEY}
CF-Access-Client-Id: ${PREVIEW_CF_ACCESS_CLIENT_ID}
CF-Access-Client-Secret: ${PREVIEW_CF_ACCESS_CLIENT_SECRET}
```

- Buat user service `preview-bot` dengan role `author` (least privilege untuk tulis LP) dan API key.
- Jika `admin.kalababyspa.com` di belakang Cloudflare Access, service token **wajib**; tanpa itu Worker akan menerima halaman login Access.
- Jangan pernah menaruh API key di client/browser.

**Keamanan route:**
- Tanpa token / token invalid / expired → `401`.
- `Cache-Control: no-store`.
- `X-Robots-Tag: noindex, nofollow`.
- `Referrer-Policy: no-referrer`.
- `frame-ancestors` tetap `'self' https://admin.kalababyspa.com http://localhost:3005`.
- Hapus `tracker.js`, `ConsentBanner`, dan pixel dari preview.
- Jangan tampilkan pesan error yang membocorkan isi dokumen.

### 5.3 postMessage protocol (v1)

**Prinsip:** hanya selection/hover/scroll/click yang lewat `postMessage`. **Tidak ada full document state** di MVP.

Origin allowlist:

```ts
const PARENT_ORIGINS = [
  'https://admin.kalababyspa.com',
  'http://localhost:3005',
];
const PREVIEW_ORIGINS = [
  'https://kalababyspa.com',
  'http://localhost:4321',
];
```

Semua pesan memakai `v: 1` dan divalidasi:

```ts
// parent
if (!PARENT_ORIGINS.includes(event.origin)) return;
if (event.source !== iframeRef.current?.contentWindow) return;

// child
if (!PREVIEW_ORIGINS.includes(event.origin)) return;
```

**Child → Parent:**

| Type | Payload |
|---|---|
| `kala:preview:ready` | `{ v: 1, docId }` |
| `kala:preview:click` | `{ v: 1, selection: { sectionId, itemId?, itemPath?, element? } }` |
| `kala:preview:hover` | `{ v: 1, selection }` |
| `kala:preview:height` | `{ v: 1, height }` |

**Parent → Child:**

| Type | Payload |
|---|---|
| `kala:builder:select` | `{ v: 1, selection }` |
| `kala:builder:hover` | `{ v: 1, selection }` |
| `kala:builder:scrollTo` | `{ v: 1, sectionId }` |
| `kala:builder:reload` | `{ v: 1, url }` (opsional; biasanya parent mengganti `src`) |

**Aturan tambahan:**
- Kirim `hover` maksimal sekali per frame (`requestAnimationFrame`).
- Debounce `scrollTo` 50 ms.
- Child memasang listener setelah DOM siap; parent mengirim `ready` ulang setelah iframe `load`.
- `preventDefault()` pada klik link/CTA di dalam preview agar tidak navigasi.
- Jangan gunakan `targetOrigin: '*'`. Selalu origin eksplisit.

### 5.4 Inspector overlay (di dalam iframe)

Karena iframe cross-origin, overlay **harus digambar di child**, bukan di parent.

- `BlockRenderer` menerima prop `preview`.
- Di preview, setiap section dibungkus:

```astro
<div
  data-kala-section-id={block.id}
  data-kala-block-type={block.blockType}
  data-kala-disabled={block.disabled ? 'true' : undefined}
>
  <Block ... />
</div>
```

- Setiap item array (inner block) dibungkus `data-kala-item-id` dan `data-kala-item-path`.
- `preview-inspector.js`:
  - Membuat container overlay `position: fixed; pointer-events: none; z-index: 9999`.
  - `mouseover` → hitung `getBoundingClientRect()` → gambar outline biru + label tipe block.
  - `click` → `preventDefault`, cari ancestor terdekat dengan `data-kala-section-id`, kirim `click`.
  - Section `disabled` → outline putus-putus + badge "Disembunyikan".
  - `scroll`/`resize` → perbarui posisi outline.
- Di parent, section terpilih diberi highlight di sidebar dan `scrollIntoView` jika perlu.
- Script ini **hanya** dimuat di route preview, bukan di halaman publik.

### 5.5 Breakpoint

- Mobile 375×667, Tablet 768×1024, Desktop 100% (min 1024).
- Parent mengubah lebar iframe; Tailwind media queries bekerja karena viewport iframe berubah.
- Simpan pilihan breakpoint di `localStorage` (key `kala-builder-breakpoint`).
- Saat breakpoint berubah, kirim `scrollTo` section terpilih agar konteks tidak hilang.

### 5.6 Tracking guard

Di `apps/web-kala/src/scripts/tracker.js`, tambahkan paling atas:

```js
if (window.location.pathname.startsWith('/preview/')) return;
```

Dan di route preview:

- Jangan import `tracker.js`.
- Jangan render `ConsentBanner`.
- Jangan render pixel/GTM.
- Tambahkan test yang memastikan tidak ada request ke `app.kalababyspa.online/api/tracking/pageview` saat preview dibuka.

---

## 6. Keamanan & Kepatuhan

| Risiko | Mitigasi |
|---|---|
| Preview publik | JWT 15 menit + API key server-side + `no-store` + `noindex` |
| Token bocor via referrer | `Referrer-Policy: no-referrer` untuk `/preview/*` |
| XSS via rich text/link | Sanitasi HTML di server; allowlist skema URL (`http`, `https`, `tel`, `mailto`, path internal); tolak `javascript:` |
| Gambar dari URL liar | Hanya media relation/ID; allowlist domain `admin.kalababyspa.com` dan `/images/` |
| postMessage spoofing | Cek `event.origin` + `event.source`; `targetOrigin` eksplisit |
| CSRF | Semua endpoint preview memakai sesi Payload; API key hanya server-side |
| Deploy storm | Tanpa autosave; publish eksplisit; debounce hook yang sudah ada |
| Konten medis terlarang | Validator publish tetap jalan; tambahkan warning di editor |
| WCAG | Jangan izinkan warna/font bebas di MVP; pertahankan token brand |
| Data iklan tercemar | Tracking guard preview (Sprint 0) |
| Akses tidak sah ke draft | API key user `preview-bot` least privilege; rotasi berkala |

---

## 7. Work Breakdown

Estimasi dalam **hari kerja** untuk 1 developer full-stack. Dengan 2 developer, paralelkan CMS dan Astro setelah Sprint 1.

### Sprint 0 — Hotfix & audit (2 hari)

| ID | Task | File | DoD | Est |
|---|---|---|---|---|
| S0-01 | Guard tracking preview | `apps/web-kala/src/scripts/tracker.js` | Tidak ada `landing_page_view`/CAPI beacon di `/preview/*` | 0.5 |
| S0-02 | Hapus tracker/consent dari preview + header | `apps/web-kala/src/pages/preview/**`, `public/_headers` | Preview tanpa analytics; `X-Robots-Tag`, `no-referrer`, `no-store` | 0.5 |
| S0-03 | Audit deploy hook vs draft save | `LandingPages.ts`, `Pages.ts`, `triggerDeployHook.ts` | Matriks draft/publish/unpublish terdokumentasi; tidak ada unpublish tak sengaja | 0.5 |
| S0-04 | Siapkan env & service user | `.env.example` (CMS & web), runbook | `PREVIEW_SECRET`, `PREVIEW_API_KEY`, `PREVIEW_CF_ACCESS_*` terdokumentasi di app yang tepat; user `preview-bot` dibuat | 0.5 |

**Exit:** preview tidak lagi mengirim event iklan; header keamanan aktif; deploy semantics jelas.

### Sprint 1 — Fondasi preview & registry (8 hari)

| ID | Task | File | DoD | Est |
|---|---|---|---|---|
| S1-01 | Tambah Cloudflare adapter, verifikasi static build | `apps/web-kala/astro.config.mjs`, `package.json` | `astro build` sukses; route publik tetap static; `_worker.js` ada | 1 |
| S1-02 | Endpoint token & redirect | `apps/cms/src/endpoints/preview.ts` atau `payload.config.ts` | JWT 15 menit; 401 tanpa auth; role dicek | 1 |
| S1-03 | Verifikasi token + fetch draft | `apps/web-kala/src/lib/preview.ts` | Draft ter-fetch via API key + CF Access service token | 1.5 |
| S1-04 | Rewrite route preview jadi SSR | `apps/web-kala/src/pages/preview/sales/[slug].astro`, `preview/[slug].astro` | `prerender=false`; 401 untuk token invalid/expired; draft baru bisa dipreview | 1.5 |
| S1-05 | Tombol Preview di admin | `LandingPages.ts`, `Pages.ts` | `admin.preview` mengarah ke `${CMS_PUBLIC_URL}/api/preview-redirect?collection=...&id=...`; buka tab baru | 0.5 |
| S1-06 | Wrapper `data-kala-*` + `disabled` | `BlockRenderer.astro`, `blocks/index.ts`, `withDisabled.ts` | Publik skip disabled; preview menandai; validator/SEO abaikan disabled | 1 |
| S1-07 | Registry + generated JSON + parity script | `apps/cms/src/blocks/registry.ts`, `scripts/sync-builder-registry.ts` | 14 block tercakup (termasuk `innerBlocks`); `npm run sync:builder` idempoten; CI check | 2 |
| S1-08 | Defaults & preset Hero | `registry.ts` | Semua field required punya default valid; tambah section tidak langsung gagal save | 0.5 |

**Exit:** dokumen draft baru bisa dibuka lewat URL bertoken; akses tanpa token 401; halaman publik tidak berubah; registry tervalidasi.

### Sprint 2 — Editor shell (10 hari)

| ID | Task | File | DoD | Est |
|---|---|---|---|---|
| S2-01 | Install dnd-kit | `apps/cms/package.json` | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` terpasang; build sukses | 0.5 |
| S2-02 | Field `editorMode` + `builder` + hidden `layout` | `LandingPages.ts`, `Pages.ts` | Mode visual/form bisa ditukar; import map diperbarui | 1 |
| S2-03 | `BuilderField` + full-screen portal | `components/admin/builder/BuilderField.tsx` | Overlay terbuka/tertutup; state form tetap; Escape menutup | 1.5 |
| S2-04 | `useBuilderLayout` | `components/admin/builder/useBuilderLayout.ts` | add/remove/reorder/duplicate/toggle/updateSection; setValue sinkron | 1.5 |
| S2-05 | `SectionTree` + dnd-kit | `SectionTree.tsx`, `SortableSection.tsx` | Drag 60fps untuk 30 section; keyboard reorder | 2 |
| S2-06 | `AddSectionMenu` + presets | `AddSectionMenu.tsx` | Menu kategori; insert defaults + UUID; posisi setelah selection | 1 |
| S2-07 | `SectionSettings` (simple fields) | `SectionSettings.tsx`, `fields/*` | text/textarea/select/checkbox/number; fallback tombol mode form | 1.5 |
| S2-08 | `useBuilderHistory` | `useBuilderHistory.ts` | 20 snapshot; Ctrl/Cmd+Z; reset setelah save | 1 |
| S2-09 | `PreviewFrame` | `PreviewFrame.tsx` | Fetch token; iframe; refresh; error state; badge versi tersimpan | 1 |
| S2-10 | Validasi required + banner | `BuilderField.tsx` | Error field terlihat; banner jumlah section belum lengkap | 0.5 |

**Exit:** marketing bisa menambah, mengurutkan, menyembunyikan, menduplikasi, dan menghapus section; edit field sederhana; undo/redo; simpan draft; preview mengikuti versi tersimpan.

### Sprint 3 — Inspector & 3-level (7 hari)

| ID | Task | File | DoD | Est |
|---|---|---|---|---|
| S3-01 | `preview-inspector.js` | `apps/web-kala/src/scripts/preview-inspector.js` | Hover/select outline; click mengirim selection; disabled badge | 1.5 |
| S3-02 | postMessage bus | `PreviewFrame.tsx`, `preview-inspector.js` | Origin + source check; v1; rAF throttle; tanpa `*` | 1 |
| S3-03 | Sinkronisasi selection | `BuilderField.tsx`, `SectionTree.tsx` | Klik canvas ↔ sidebar; scrollIntoView | 1 |
| S3-04 | Inner blocks untuk array | `InnerBlockList.tsx`, `useBuilderLayout.ts` | Reorder/add/duplicate/delete item; breadcrumb level 3 | 2 |
| S3-05 | Breakpoint switcher | `PreviewFrame.tsx` | 375/768/100%; persist; scroll dipertahankan | 0.5 |
| S3-06 | Error/401/token refresh | `PreviewFrame.tsx`, `preview.ts` | Token expired → refresh otomatis; pesan jelas | 1 |

**Exit:** klik elemen canvas memilih section; sidebar memilih elemen canvas; Pricing/FAQ/Testimonials bisa mengelola item tanpa mode form; breakpoint bekerja.

### Sprint 4 — Media, template, virtual blocks (10 hari)

| ID | Task | File | DoD | Est |
|---|---|---|---|---|
| S4-01 | Media picker + upload | `MediaPicker.tsx` | Pilih dari `/api/media`; upload baru; set ID + alt | 2 |
| S4-02 | Rich text fallback | `SectionSettings.tsx` | Tombol buka mode form pada field richText | 0.5 |
| S4-03 | Insert template | `TemplatePicker.tsx` | Fetch `block-templates`; clone layout + ID baru; tidak ada circular ref | 1.5 |
| S4-04 | Virtual inner blocks Hero | `registry.ts`, `HeroBlock.astro`, `HeroBlock.ts` | `elementOrder` + drag badge/heading/image/button; renderer menghormati urutan | 3 |
| S4-05 | Virtual inner blocks CTA | `CallToActionBlock.astro`, block config | Sama untuk heading/text/button | 1.5 |
| S4-06 | Sanitasi link & gambar | `lib/sanitize.ts`, renderer | Tolak `javascript:`; hanya media ID/domain allowlist | 1 |
| S4-07 | Theme token beta (opsional) | `theme` group, CSS variables | Hanya token allowlist; contrast check; section opt-in | 0.5 |

**Exit:** 80% edit konten selesai tanpa keluar dari visual mode; gambar bisa dipilih/diunggah; Hero/CTA bisa reorder elemen; template bisa disisipkan.

### Sprint 5 — Hardening & rollout (5 hari)

| ID | Task | DoD | Est |
|---|---|---|---|
| S5-01 | Unit test | reorder, duplicate ID, history, validator disabled, token verify | 1 |
| S5-02 | Playwright e2e | create → add → drag → save → preview → hide → publish validation → undo | 1.5 |
| S5-03 | Visual regression | 3 template × 3 breakpoint; screenshot diff | 1 |
| S5-04 | Security review | token, origin, XSS, preview auth, rate limit, headers | 0.5 |
| S5-05 | Feature flag + pilot | 1 LP internal; monitor 1 minggu; lalu marketing | 0.5 |
| S5-06 | Docs | runbook, SOP marketing, env vars, rollback | 0.5 |

**Total:** 42 hari kerja + buffer 20% ≈ **50 hari (~10 minggu)**.
**MVP (Sprint 0–3):** 27 hari ≈ **5,5 minggu**.

---

## 8. Testing Matrix

| Level | Tool | Kasus wajib |
|---|---|---|
| Unit | Vitest (atau Node test) | `arrayMove`, duplicate ID unik, history undo/redo, validator mengabaikan disabled, JWT invalid/expired |
| Integration | Playwright | Buka builder, tambah Hero, isi judul, simpan, preview menampilkan judul baru |
| E2E | Playwright | Drag urutan, hide section, duplicate, delete, undo, publish ditolak tanpa hero/CTA |
| Security | curl/Playwright | `/preview/...` tanpa token = 401; token expired = 401; origin salah diabaikan |
| Visual | Playwright screenshot | 3 template × 3 breakpoint; tidak ada pergeseran layout |
| Performance | Lighthouse/CI | JS publik tidak bertambah; LCP tidak regresi; build time tidak > +20% |
| Analytics | Playwright network | Preview tidak memanggil `pageview`, GTM, Meta CAPI |
| A11y | axe/Playwright | Editor bisa dioperasikan keyboard; kontras tombol/token |

---

## 9. Rollout & Rollback

### Rollout

1. **Internal:** aktifkan `editorMode=visual` hanya untuk 1 LP uji.
2. **Pilot marketing:** 1 kampanye nyata; bandingkan waktu penyusunan vs mode form.
3. **General:** default `visual` untuk semua LP/Pages; mode form tetap tersedia.
4. **Monitoring:** log Payload, alert Telegram deploy, Cloudflare 401/5xx, error console via test.

### Rollback

- **Tanpa migrasi DB**, rollback = set `editorMode` default ke `form` dan sembunyikan field `builder` (atau feature flag `BUILDER_VISUAL_ENABLED=false`).
- Jika SSR preview bermasalah: nonaktifkan route preview SSR, kembalikan sementara ke static preview, atau matikan tombol preview. Halaman publik tidak terpengaruh.
- Jika adapter Cloudflare mengganggu build: revert `astro.config.mjs` dan `package.json`; preview kembali static (fitur preview draft dimatikan sementara).
- Tidak ada rollback database yang diperlukan karena `layout` tidak berubah.

---

## 10. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Adapter Cloudflare mengubah pipeline build | Tinggi | Spike S1-01; fallback worker terpisah; uji preview deployment sebelum merge |
| Payload custom field API berubah | Sedang | Pin Payload 3.91; isolasi komponen; jangan patch internal |
| dnd-kit tidak stabil di React 19 | Sedang | Uji di S2-01; fallback HTML5 drag |
| Form state race / value hilang | Tinggi | Satu sumber `useField`; test save/reload; jangan simpan state di dua tempat |
| Required field tersembunyi memblokir save | Sedang | Banner error `formState`; fallback mode form; defaults valid |
| Token/API key bocor | Tinggi | TTL 15 menit; server-side only; rotasi; `no-store`; `no-referrer` |
| Cloudflare Access memblokir fetch draft | Tinggi | Service token; uji dari Worker sebelum rilis |
| Scope creep (nested blocks/theme) | Tinggi | Backlog gate; MVP hanya array inner blocks + Hero virtual |
| Deploy storm | Sedang | Tanpa autosave; publish eksplisit; debounce existing |
| Preview drift dari halaman publik | Sedang | Satu renderer Astro; visual regression |

---

## 11. Keputusan Terbuka (default sudah ditetapkan)

| Pertanyaan | Default | Kapan ditinjau |
|---|---|---|
| Preview instan (<100 ms) atau reload 1–2 s? | Reload server-rendered | Setelah pilot; hanya buat client renderer jika editor mengeluh |
| Maksimum section per halaman? | 100 | Sprint 3 |
| Maksimum inner item? | 50 per array | Sprint 3 |
| Token TTL? | 15 menit | Sprint 1 |
| Autosave? | Tidak | Setelah Sprint 5 |
| Theme bebas? | Tidak; token allowlist | Setelah MVP |
| Nested blocks untuk semua section? | Tidak; array + virtual | Setelah MVP |
| Siapa yang boleh memakai builder? | `superadmin`, `operator`, `marketing`, `seo` | Sprint 2 |

Jika ada keputusan yang berubah, catat di `docs/adr/` dan perbarui dokumen ini.

---

## 12. Checklist Mulai Hari Ini

- [x] S0-01: guard `tracker.js` untuk `/preview/*`.
- [x] S0-02: hapus tracker/consent dari route preview; tambah header `X-Robots-Tag` + `Referrer-Policy`.
- [x] S0-03: uji save draft pada dokumen published; pastikan tidak memicu unpublish deploy.
- [x] S0-04: buat `PREVIEW_SECRET`, user `preview-bot` + API key, catat env di runbook.
- [x] S1-01: `npx astro add cloudflare` di `apps/web-kala`; verifikasi `npm run build`.
- [x] S1-02: buat endpoint `/api/preview-token` dengan `jose`.
- [x] S1-06: tambahkan `disabled` + wrapper `data-kala-*`.

---

## Lampiran A — Environment Variables

### CMS (`apps/cms/.env`)

```env
PREVIEW_SECRET=          # JWT secret, harus sama dengan web
PREVIEW_BASE_URL=https://kalababyspa.com
CMS_PUBLIC_URL=https://admin.kalababyspa.com
```

### Web (`apps/web-kala` / Cloudflare Pages)

```env
PREVIEW_SECRET=          # sama dengan CMS
PREVIEW_API_URL=https://admin.kalababyspa.com
PREVIEW_API_KEY=         # API key user preview-bot (server-side only)
PREVIEW_CF_ACCESS_CLIENT_ID=
PREVIEW_CF_ACCESS_CLIENT_SECRET=
```

### Cloudflare Access

- Service token untuk `admin.kalababyspa.com/api/*` (atau khusus endpoint yang dipakai preview).
- Pastikan token hanya bisa membaca, bukan menulis.

---

## Lampiran B — File Map

**Baru (CMS):**

```
apps/cms/src/blocks/registry.ts
apps/cms/src/blocks/withDisabled.ts
apps/cms/src/components/admin/builder/BuilderField.tsx
apps/cms/src/components/admin/builder/SectionTree.tsx
apps/cms/src/components/admin/builder/SectionSettings.tsx
apps/cms/src/components/admin/builder/InnerBlockList.tsx
apps/cms/src/components/admin/builder/AddSectionMenu.tsx
apps/cms/src/components/admin/builder/TemplatePicker.tsx
apps/cms/src/components/admin/builder/MediaPicker.tsx
apps/cms/src/components/admin/builder/PreviewFrame.tsx
apps/cms/src/components/admin/builder/useBuilderLayout.ts
apps/cms/src/components/admin/builder/useBuilderHistory.ts
apps/cms/src/endpoints/preview.ts
apps/cms/scripts/sync-builder-registry.ts
```

**Baru (Web):**

```
apps/web-kala/src/lib/preview.ts
apps/web-kala/src/scripts/preview-inspector.js
apps/web-kala/src/components/blocks/registry.generated.json
```

**Diubah:**

```
apps/cms/src/collections/LandingPages.ts
apps/cms/src/collections/Pages.ts
apps/cms/src/blocks/index.ts
apps/cms/src/utilities/pageBuilderValidators.ts
apps/cms/src/lib/seo-engine/**            (abaikan disabled)
apps/cms/package.json
apps/cms/next.config.mjs                  (transpile jika perlu)
apps/web-kala/astro.config.mjs
apps/web-kala/package.json
apps/web-kala/src/components/blocks/BlockRenderer.astro
apps/web-kala/src/pages/preview/sales/[slug].astro
apps/web-kala/src/pages/preview/[slug].astro
apps/web-kala/src/scripts/tracker.js
apps/web-kala/public/_headers
```

**Root:**

```
package.json                              (script sync:builder)
docs/runbook-teknis.md                    (env + rollback)
docs/sop-operasional.md                   (cara pakai builder)
```

---

## Lampiran C — Perintah

```bash
# dependencies (dijalankan dari root repo)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities jose --workspace=cms-kala
npm install jose --workspace=web-kala

# adapter (dijalankan dari dalam apps/web-kala)
cd apps/web-kala
npx astro add cloudflare
cd ../..

# generate
npm run generate:types --workspace=cms-kala
npm run generate:importmap --workspace=cms-kala
npm run sync:builder

# verifikasi
npm run build --workspace=web-kala
npm run build --workspace=cms-kala
```

---

**Catatan akhir:** dokumen ini sengaja tidak memasukkan theme designer, nested blocks universal, dan renderer client-side. Ketiganya adalah perluasan setelah MVP terbukti dipakai. Fokus MVP adalah **mengganti form blok yang panjang dengan tree + preview yang akurat**, tanpa mengubah data atau performa halaman publik.
