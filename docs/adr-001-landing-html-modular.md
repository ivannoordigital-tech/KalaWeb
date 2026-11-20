# ADR-001: Landing Page Ads Modular Berbasis Blok HTML

**Tanggal:** 20 November 2026
**Status:** Accepted
**Pengganti keputusan:** `docs/rencana-landing-page-ads-kala-2026-11.md` (native-first hybrid)

---

## Konteks

Landing page iklan `/sales/promo-treatment` (Page ID 11) memiliki desain HTML/CSS statis yang sudah disetujui marketing. Pendekatan native-first pada rencana 16 November tidak mampu mereplikasi desain tersebut tanpa menulis ulang seluruh section menjadi blok native, dan membuat perubahan visual kecil (warna, jarak, animasi) bergantung pada deploy git.

Kebutuhan utama:

1. Tim marketing dapat mengubah layout, warna, font, dan CSS tanpa deploy.
2. Halaman tetap tampil identik dengan desain referensi di semua breakpoint.
3. Konten tetap aman dari injeksi script dari sumber tidak tepercaya.

## Keputusan

1. Halaman disusun dari **11 blok `html`** independen: satu blok CSS global + sepuluh blok section, sehingga urutan section dapat diubah lewat drag-and-drop.
2. **Blok CSS di CMS adalah satu-satunya sumber kebenaran** untuk styling halaman. File `apps/web-kala/src/styles/landing-page.css` tidak diimpor oleh route sales; salinannya disimpan sebagai arsip di repo.
3. `HtmlBlock.astro` mengizinkan tag `<style>` dan merender blok tanpa wrapper padding ketika mode layout `raw` aktif (native DOM, bukan iframe).
4. Mode `allowScripts` tetap tersedia untuk widget interaktif, tetapi berjalan di iframe `sandbox="allow-scripts"` tanpa `allow-same-origin`, dan hanya boleh diaktifkan oleh role admin.
5. Sanitasi HTML dilakukan saat render (dan direncanakan saat simpan) dengan allowlist tag/atribut; `<script>`, `<iframe>`, `<form>`, event handler, dan URL `javascript:` dibuang pada mode non-sandbox.

## Konsekuensi

**Positif**

- Marketing dapat mengubah token warna dan CSS langsung dari CMS.
- Section dapat di-reorder tanpa menyentuh kode.
- Tidak ada iframe bertumpuk, sehingga tidak ada scrollbar ganda dan font tidak diblokir CSP.

**Negatif / risiko yang harus dikelola**

- CSS inline di body tidak dapat di-cache CDN; ukurannya ~10 KB per halaman.
- Arsitektur ini membutuhkan `style-src 'unsafe-inline'` pada CSP untuk path `/sales/*`. CSP untuk path lain harus tetap ketat.
- `<style>` dari CMS adalah CSS arbitrer. `url()` eksternal dan overlay `position: fixed` harus dipantau; role editor wajib dibatasi.
- Validasi publish harus mengenali H1 dan CTA di dalam blok HTML, bukan hanya blok native.
- Template dan halaman dapat menyimpang jika dipelihara manual; backup JSON wajib dijalankan berkala.

## Tindak lanjut

- [x] Backup JSON Page 11 dan PageTemplate 1 (20 Nov 2026).
- [x] Validator publish mengenali H1/CTA di blok HTML.
- [x] Guard floating WhatsApp mobile + atribusi CTA per section.
- [x] Hapus impor `landing-page.css` dari route sales (Fase 2).
- [x] Scope selector CSS ke `.kala-html-raw` (Fase 2).
- [x] Kontrak raw eksplisit (`full + none`) dan background aman di mode raw (Fase 3).
- [x] Role gate `allowScripts` + validasi HTML/CSS saat simpan (Fase 4).

## Referensi

- `docs/rencana-perbaikan-landing-ads-2026-11-20.md`
- `apps/web-kala/src/components/blocks/HtmlBlock.astro`
- `apps/cms/src/utilities/pageBuilderValidators.ts`
- `backups/pages/page-11-promo-treatment-2026-11-20.json`
