# Rencana Perbaikan UX Page Builder (Admin Non-Teknis)

**Basis kode:** `origin/main` @ `991a95d` (11 Nov 2026)
**Sifat perubahan:** UI/UX CMS saja — **tanpa perubahan schema/database**
**Target:** admin non-teknis bisa menyusun halaman (termasuk layout 2–4 kolom) tanpa pendampingan.

---

## 1. Ringkasan

Page Builder produksi sudah lengkap secara fungsi: section, container 1–4 kolom,
blok nested, live preview, undo/redo, draft/publish. Masalahnya bukan kemampuan,
tetapi **kemampuan menemukan dan memahami kontrol**.

Penilaian awal: edit konten biasa **7/10**, membuat layout kolom **5/10** untuk admin non-teknis.

Plan ini dibagi tiga fase:

| Fase | Fokus | Estimasi |
| --- | --- | --- |
| 1 | Quick wins: label, pencarian, empty state, petunjuk simpan/publish | 2–3 hari |
| 2 | Struktur: nested tree, drag blok, onboarding, role-based | 3–5 hari |
| 3 | Shopify-like: edit di kanvas, drag handle, theme settings | 10–15 hari |

Fase 1 dan 2 sudah cukup untuk menghilangkan sebagian besar kebingungan.

---

## 2. Baseline & bukti masalah

| # | Masalah | Bukti di kode | Dampak |
| --- | --- | --- | --- |
| 1 | Istilah "container" teknis | `apps/cms/src/blocks/registry.ts` — label `Seksi & Kolom (Container)` | Admin tidak tahu itu fitur untuk membuat kolom |
| 2 | Katalog tanpa pencarian | `AddSectionMenu.tsx` — hanya daftar per kategori | Harus scroll dan menebak kategori |
| 3 | Kolom kosong tidak memberi aksi jelas | `SectionSettings.tsx` — teks "Kolom masih kosong" + dropdown kecil + tombol "Tambah" | Admin tidak tahu cara mengisi kolom |
| 4 | Blok nested tidak terlihat di sidebar | `SectionTree.tsx` hanya merender `layout` level atas | Admin tersesat saat ingin mengedit teks di dalam kolom |
| 5 | Preview tidak berubah saat mengetik | `PreviewFrame.tsx` — badge "Pratinjau = versi tersimpan", refresh setelah save | Dikira editor rusak |
| 6 | Publish tidak dijelaskan | `BuilderField.tsx` — tombol "Terbitkan Perubahan" | Takut salah klik / tidak sadar langsung tayang |
| 7 | Template langsung menambah 12 seksi | `AddSectionMenu.tsx` — `onSelectTemplate` langsung `applyTemplate` | Kaget, harus undo |
| 8 | Preview hilang di layar kecil | `BuilderField.tsx` — `<main class="... hidden md:block">` | Tidak bisa lihat hasil sambil edit di tablet/HP |
| 9 | Istilah campur Indonesia–Inggris | "Hero", "CTA", "HTML", "SEO", "canonical", "container" | Beban kognitif untuk admin baru |

---

## 3. Tujuan & metrik

**Tujuan**

1. Admin baru bisa menambah section 2 kolom + mengisi teks/gambar **tanpa dibantu**.
2. Admin tahu perbedaan **Simpan Draf** vs **Terbitkan**.
3. Admin selalu tahu di mana posisinya (section → kolom → blok).

**Metrik keberhasilan (uji 3 admin non-teknis)**

| Tugas | Target |
| --- | --- |
| Menambah section 2 kolom dan mengisi 2 blok | < 2 menit, tanpa bertanya |
| Mengubah teks di dalam kolom | < 1 menit |
| Menyimpan draft lalu melihat preview | < 1 menit |
| Membedakan draft vs publish | 3/3 benar |
| Menemukan container lewat pencarian | < 15 detik |

---

## 4. Prinsip

- **UI-only**: tidak ada migrasi, tidak ada perubahan collection/field.
- **Bahasa admin**, bukan bahasa developer.
- **Jangan ubah alur publish** yang sudah aman (draft + preview + hook deploy).
- **Progressive disclosure**: fitur lanjutan (HTML, SEO, canonical) tidak mendominasi.
- Semua perubahan lewat PR ke `main`, diuji di staging/lokal sebelum deploy CMS.

---

## 5. Fase 1 — Quick wins (2–3 hari)

### UX-01 — Rename container & helper text
**File:** `apps/cms/src/blocks/registry.ts`

- Label: `Seksi & Kolom (Container)` → **`Baris Berkolom (2–4 konten sejajar)`**
- Deskripsi: "Tempatkan teks, gambar, atau tombol berdampingan dalam 2–4 kolom."
- Tambah `keywords: ['kolom', 'container', 'grid', 'berdampingan', 'layout']`.

**Acceptance:** muncul di katalog dengan label baru; parity 29/29 tetap lulus (slug tidak berubah).

---

### UX-02 — Pencarian + "Sering dipakai" di katalog
**File:** `AddSectionMenu.tsx`, `registry.ts`

- Input pencarian sticky di atas tab: cari berdasarkan label, deskripsi, dan `keywords`.
- Bagian **"Sering dipakai"** berisi: Baris Berkolom, Hero, Judul, Gambar, Tombol, Teks.
- Empty state: "Tidak ada komponen yang cocok. Coba kata lain."
- Ekstrak fungsi filter ke `catalog-utils.ts` agar bisa di-unit-test.

**Acceptance:** ketik "kolom" → container muncul; "gambar" → Image; "zzz" → empty state.

---

### UX-03 — Empty state kolom yang actionable
**File:** `SectionSettings.tsx`

Ganti dropdown kecil + tombol "Tambah" dengan:

- Tombol utama **`+ Tambah isi kolom`**.
- Saat diklik, tampil 3 pilihan cepat: **Teks**, **Gambar**, **Tombol** (plus "Lihat semua blok").
- Jika kolom kosong, tampilkan ilustrasi/teks: "Kolom ini belum ada isinya. Mulai dengan teks atau gambar."

**Acceptance:** dari section baru → isi kolom kiri dengan teks = maksimal 2 klik.

---

### UX-04 — Perjelas konteks blok nested
**File:** `SectionSettings.tsx`

- Header panel: **`Mengedit: <Nama Blok>`** + breadcrumb `Halaman › <Section> › Kolom 1 › <Blok>`.
- Tombol **`← Kembali ke <Section>`** yang jelas (bukan hanya ikon).
- Baris nested diberi ikon pensil + teks "Klik untuk edit".
- Badge kecil "Di dalam kolom" agar admin tahu blok ini bukan section utama.

**Acceptance:** admin yang membuka blok nested bisa menjelaskan sedang mengedit apa.

---

### UX-05 — Petunjuk preview
**File:** `PreviewFrame.tsx`

- Saat ada perubahan belum disimpan, badge menjadi:
  **"Preview masih versi tersimpan — klik Simpan Draf untuk melihat perubahan."**
- Tambah tooltip pada tombol refresh: "Muat ulang preview dari versi tersimpan."
- Pertimbangkan live update setelah autosave (jika autosave sudah berjalan, refresh otomatis).

**Acceptance:** admin tidak mengira editor rusak saat preview belum berubah.

---

### UX-06 — Perjelas aksi Publish
**File:** `BuilderField.tsx`

- Tambah teks bantuan di dekat tombol: **"Terbitkan = langsung tampil di website."**
- Untuk publish pertama kali, tampilkan konfirmasi singkat:
  "Halaman akan langsung tayang. Lanjutkan?"
- Tombol draft tetap: "Simpan Draf (tidak tayang)".

**Acceptance:** 3/3 admin memahami perbedaan draft vs publish.

---

### UX-07 — Konfirmasi terapkan template
**File:** `AddSectionMenu.tsx`

- Tombol `Terapkan Template Ini (+12 Seksi)` → dialog:
  "Tambahkan 12 seksi ke halaman? Kamu bisa membatalkan dengan Undo."
- Tampilkan jumlah seksi dan nama template.

**Acceptance:** tidak ada penambahan 12 seksi tanpa konfirmasi.

---

### UX-08 — Preview di layar kecil
**File:** `BuilderField.tsx`

- Di bawah `md`, ganti `hidden md:block` dengan **tab switch `Editor | Pratinjau`**.
- State tab disimpan selama sesi.
- Tetap tampilkan banner "disarankan desktop" sebagai info, bukan penghalang.

**Acceptance:** admin di tablet bisa berpindah editor ↔ preview tanpa kehilangan perubahan.

---

### UX-09 — Konsistensi istilah
**File:** `AddSectionMenu.tsx`, `SectionTree.tsx`, `BuilderField.tsx`

- `Tambah Seksi Baru` → **`+ Tambah Bagian`**.
- `Koleksi Blok` → **`Komponen`**.
- `Template Halaman Siap Pakai` → **`Template Halaman`**.
- `Seksi & Kolom` → **`Baris Berkolom`**.
- Jangan rename field database/slug apa pun.

**Acceptance:** tidak ada istilah teknis di jalur utama admin.

---

### UX-10 — Panduan 1 halaman
**File baru:** `docs/panduan-builder-admin.md`

Isi: 6 langkah bergambar (placeholder screenshot):
1. Buka halaman & builder.
2. Tambah bagian.
3. Tambah baris berkolom.
4. Isi kolom.
5. Simpan draft & preview.
6. Terbitkan.

Tautkan dari panel bantuan builder (link "Panduan singkat").

**Acceptance:** admin baru bisa mengikuti tanpa bertanya.

---

## 6. Fase 2 — Struktur & discoverability (3–5 hari)

### UX-11 — Nested tree di sidebar
**File:** `SectionTree.tsx`, `SortableSection.tsx`, `BuilderField.tsx`, `useBuilderLayout.ts`

- Section bisa di-expand/collapse.
- Anak: `Kolom 1 → Judul`, `Kolom 1 → Gambar`, dst.
- Klik anak → panel edit blok tersebut.
- Section terpilih tetap ter-highlight.

**Risiko:** state seleksi nested harus diangkat ke `BuilderField`; hati-hati duplikasi ID.
**Acceptance:** edit teks dalam kolom tanpa harus klik section dulu.

---

### UX-12 — Drag blok nested
**File:** `SectionSettings.tsx`

- Drag & drop blok di dalam kolom (dnd-kit sudah dipakai di level section).
- Drag antar kolom.
- Fallback tombol naik/turun tetap ada untuk aksesibilitas.

**Acceptance:** memindahkan gambar dari kolom 1 ke kolom 2 tanpa hapus/tambah ulang.

---

### UX-13 — Onboarding 3 langkah
**File:** `BuilderField.tsx`

- Overlay sekali per user (flag di `localStorage` + tombol "Jangan tampilkan lagi"):
  1. "Ini daftar bagian halaman."
  2. "Klik bagian untuk mengedit."
  3. "Simpan Draf dulu, Terbitkan jika sudah siap."

**Acceptance:** admin baru paham alur dalam < 30 detik.

---

### UX-14 — Field lanjutan untuk role teknis
**File:** `Pages.ts`, `access/roles.ts`, komponen builder

- Sembunyikan HTML/SEO/canonical untuk role non-teknis, atau pindahkan ke tab **"Lanjutan"** dengan label peringatan.
- Role `superadmin`/`operator` tetap melihat semua.

**Risiko:** perubahan access control harus diuji per role.
**Acceptance:** admin marketing tidak melihat field yang berisiko.

---

## 7. Fase 3 — Shopify-like (opsional, 10–15 hari)

Ditunda sampai Fase 1–2 terbukti dipakai.

1. **Inline editing di kanvas**: klik teks di preview → field terkait fokus (butuh postMessage antara iframe dan builder).
2. **Drag handle di kanvas**: drag section/blok langsung dari preview.
3. **Responsive editing**: edit terpisah per breakpoint.
4. **Theme settings global**: warna, font, radius, spacing.
5. **Block library dengan preview thumbnail**.

Risiko tinggi, perubahan besar. Jangan dikerjakan sebelum ada bukti Fase 1–2 mengurangi kebingungan.

---

## 8. Rencana pengujian

### Otomatis
- Unit test `catalog-utils.ts`: filter label/keywords, empty state.
- Unit test tree flatten (jika UX-11 dikerjakan).
- Regression wajib:
  ```bash
  npm run sync:builder
  cd apps/cms && npx tsc --noEmit
  npm test --workspace=cms-kala
  npm run build:cms
  npm run build
  ```
- Parity harus tetap 29/29 (label berubah, slug tidak).

### Manual (uji admin non-teknis)
Skenario:
1. Tambah baris 2 kolom, isi teks + gambar, simpan draft.
2. Ubah teks di dalam kolom tanpa membuka section dua kali.
3. Cari "kolom" di katalog.
4. Bedakan draft vs publish.
5. Terapkan template → muncul konfirmasi.
6. Buka di tablet → pindah Editor/Pratinjau.
7. Undo setelah hapus section.
8. Preview menampilkan perubahan setelah simpan.

### Aksesibilitas
- Semua tombol punya `aria-label`/title.
- Fokus keyboard tidak terjebak saat modal buka/tutup.
- Kontras teks di panel gelap.

---

## 9. Rollout & deploy

1. Branch: `feat/builder-ux-quick-wins` dari `main`.
2. PR + CI (parity, tsc, test, build CMS).
3. Review desain/UX dengan 1 admin non-teknis.
4. Merge ke `main`.
5. Deploy **CMS saja** di VPS:
   ```bash
   cd /opt/kalaweb
   git pull --ff-only
   cd apps/cms
   docker compose build cms
   docker compose up -d cms
   ```
   Tidak ada migrasi/schema baru. Web tidak perlu di-deploy karena perubahan hanya di admin CMS.
6. Verifikasi: buka Pages → Homepage 2 → builder; cek katalog, pencarian, empty state, preview.
7. Rollback: tag image sebelum deploy (`cms-cms:pre-ux-<tanggal>`), lalu `docker compose up -d` dengan image lama.

Catatan: produksi memakai `push: false` + `prodMigrations`; perubahan UI tidak menyentuh DB.

---

## 10. Risiko

| Risiko | Mitigasi |
| --- | --- |
| Rename label membingungkan pengguna lama | Sertakan sekali banner "Istilah baru: Seksi → Bagian" atau batasi rename pada container |
| Pencarian menyembunyikan blok | Default tampil semua; pencarian hanya filter |
| Nested tree memecah seleksi/duplikasi | Unit test ID unik + QA manual duplicate/delete |
| Drag nested merusak urutan | Simpan fallback tombol naik/turun; test undo/redo |
| Deploy CMS menyebabkan downtime singkat | Deploy di jam sepi; siapkan rollback image |
| Perubahan role membuka akses berlebih | Review access control + uji per role |

---

## 11. Timeline usulan

| Minggu | Pekerjaan |
| --- | --- |
| 1 | UX-01…UX-06, UX-10 (quick wins inti) |
| 1 | QA + usability test 3 admin |
| 2 | UX-07…UX-09, UX-11, UX-12 |
| 2 | Deploy CMS + monitoring |
| 3 | UX-13, UX-14 (jika disetujui) |
| 4+ | Evaluasi; putuskan Fase 3 |

---

## 12. Pertanyaan terbuka

1. Rename global "Seksi" → "Bagian", atau hanya label container?
2. Siapa yang boleh **Terbitkan** — semua admin atau hanya operator/superadmin?
3. Prioritas mobile/tablet: perlu sekarang atau setelah Fase 1?
4. Apakah drag blok nested masuk Fase 2 atau ditunda?
5. Perlu screenshot asli untuk panduan, atau cukup ilustrasi?

---

## 13. Definition of Done (Fase 1)

- [ ] Label & deskripsi container baru terpasang.
- [ ] Pencarian katalog berfungsi + empty state.
- [ ] Empty column punya CTA jelas.
- [ ] Konteks nested terlihat (breadcrumb + tombol kembali).
- [ ] Petunjuk preview & publish jelas.
- [ ] Konfirmasi template.
- [ ] Preview bisa diakses di tablet.
- [ ] Panduan 1 halaman tersedia.
- [ ] Parity 29/29, tsc, test, build CMS lulus.
- [ ] Diuji 3 admin non-teknis dengan metrik di §3.
- [ ] Deploy CMS sukses + rollback image tersedia.
