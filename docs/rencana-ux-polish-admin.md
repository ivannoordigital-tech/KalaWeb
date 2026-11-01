# Rencana UX Polish Admin Dashboard — Fase 8

> **STATUS: BAGIAN B (referensi kode) dari `docs/rencana-gabungan-fase-9.md`.**
> Dokumen ini **belum dieksekusi**. Eksekusi mengikuti urutan di rencana induk:
> - **Fase 9A** (stabilisasi deploy/security/CI/docs) — wajib lulus **sebelum** WP mana pun.
> - **Fase 9B** = WP-5, WP-1, WP-3 (spesifikasi WP-1 & WP-3 sudah disalin ke rencana induk).
> - **Fase 9C** = WP-2, WP-8, WP-6, WP-7, WP-4, WP-9 (urutan diubah: **WP-6 sebelum WP-7**).
>
> Bagian §1 (Prasyarat/Gate) di dokumen ini **digantikan** oleh Gate G-1 di rencana induk.
> Jika ada perbedaan angka baris/urutan, **rencana induk yang berlaku**.

**Tanggal:** 1 November 2026
**Basis kode:** `9f08d0d` (setelah `9637b66` = remediasi builder Fase 0–7 dan `6db225a`/`9f08d0d` = perbaikan deploy Cloudflare)
**Basis audit:** penilaian UX admin dashboard (7,2/10) + audit builder
**Sasaran akhir:** 7,2 → **8,5/10** tanpa perubahan arsitektur & tanpa migrasi database

---

## 0. Ringkasan Eksekutif

Dokumen ini adalah rencana eksekusi untuk **9 work package (WP)** perbaikan UX admin.
Setiap WP berisi: file yang disentuh, kode pengganti, kriteria penerimaan, cara uji, dan rollback.

**Prinsip yang tidak boleh dilanggar (sama seperti Fase 0–7):**

| Prinsip | Konsekuensi praktis |
|---|---|
| Tanpa migrasi schema | Tidak menambah/menghapus kolom DB. Hanya menambah field config yang aman (mis. `listSearchableFields`). |
| Tanpa autosave | Simpan tetap **eksplisit**. Tidak ada penulisan otomatis ke server. |
| `layout` blocks Payload tetap dipakai | Builder hanya membaca/menulis `layout` lewat `dispatchFields`. Tidak ada format data baru. |
| Kompatibel data lama | Dokumen lama harus tetap terbuka, tersimpan, dan terbit. |
| Security-first | Tidak menambah endpoint tanpa auth. `overrideAccess` hanya dimatikan bila ada `user`. |
| Rollback per WP | Setiap WP harus bisa di-`git revert` tanpa merusak WP lain. |

### 0.1 Target terukur

| Metrik | Sekarang | Target |
|---|---|---|
| Simpan tanpa keluar builder | 0 (harus tutup portal) | 1 klik / `Ctrl+S` |
| Peringatan perubahan belum tersimpan | Tidak ada | Ada (badge + guard navigasi + konfirmasi tutup) |
| Waktu menemukan field error | Tak terhingga (pesan generik) | < 5 detik (banner menyebut seksi + field) |
| Langkah membuat landing page baru | 3–5 tebakan koleksi | 1 panduan "Buat Halaman" |
| Akurasi angka dashboard | Salah saat > 50 dokumen | Akurat (`totalDocs`) |
| Dark mode | Rusak (warna hardcoded) | Konsisten |
| Cari media via nama file | Tidak bisa | Bisa |

### 0.2 Di luar ruang lingkup (jangan dikerjakan di Fase 8)

- ❌ Preview state form yang belum disimpan (butuh arsitektur `postMessage` data, bukan sekadar polish).
- ❌ Autosave / auto-draft.
- ❌ Penjadwalan terbit landing page.
- ❌ Redesign total dashboard (hanya perbaikan warna, akurasi, link).
- ❌ Migrasi ke Page Builder baru.
- ❌ Multi-bahasa UI (tetap Bahasa Indonesia).

### 0.3 Keputusan yang harus diambil SEBELUM mulai

Tanyakan/jawab dulu 4 hal ini, karena mengubah isi WP:

| # | Keputusan | Opsi A (disarankan) | Opsi B |
|---|---|---|---|
| D1 | Dark mode | **Kunci ke terang** (`admin.theme: 'light'`) di WP-6 Fase A, migrasi CSS var ditunda | Migrasi penuh CSS var (WP-6 Fase B) sekalian |
| D2 | "Buat Halaman" | **Panduan kartu** di list view (WP-4 inti) | Wizard penuh (butuh custom view baru, +2 hari) |
| D3 | Halaman audit SEO | Tidak (cukup perbaiki label & link) | Buat view `/admin/seo-audit` (WP-7.5, +0,5 hari) |
| D4 | Tombol Terbitkan di builder | Tampil hanya jika `hasPublishPermission` | Sembunyikan total, hanya Simpan Draf |

Default rencana ini memakai **Opsi A** untuk D1–D4.

---

## 1. Prasyarat (Gate) — JANGAN mulai bila belum lulus

Fase 0–7 (`9637b66`) **harus sudah selesai dieksekusi & terverifikasi**. Jalankan checklist ini dari root repo:

```powershell
cd D:\Jobs\KalaWeb

# 1. Working tree bersih (komit dulu perubahan wrangler.jsonc bila masih M)
git status --short

# 2. Parity registry/template lulus
npm run sync:builder

# 3. Unit test lulus
npm test --workspace=cms-kala

# 4. Type-check lulus
cd apps/cms; npx tsc --noEmit; cd ../..

# 5. Preview produksi aktif (harus 401, BUKAN 404)
curl.exe -s -o NUL -w "%{http_code}\n" https://kalababyspa.com/preview/zzz
```

| Gate | Lulus bila | Bila gagal |
|---|---|---|
| G1 | `git status --short` kosong | Komit `wrangler.jsonc` + `apps/web-kala/wrangler.jsonc` lebih dulu. Jika muncul `?? apps/web-kala/.wrangler/`, tambahkan `.wrangler/` ke `.gitignore` (jangan commit artefak build) |
| G2 | `check:parity` exit 0 | Selesaikan Fase 2 dulu |
| G3 | `npm test` hijau | Selesaikan Fase 7 dulu |
| G4 | `tsc --noEmit` exit 0 | Perbaiki tipe dulu |
| G5 | `/preview/zzz` = `401` | Selesaikan Fase 1 dulu — **WP-2 & WP-8 tidak akan teruji** |

> ⚠️ **G5 adalah gate keras.** Tanpa preview produksi hidup, WP-2 tidak bisa diverifikasi dan WP-1 hanya bisa diuji lokal.

**Perintah yang dipakai berulang di dokumen ini:**

```powershell
# Type-check CMS
cd apps/cms; npx tsc --noEmit

# Build CMS (wajib sebelum deploy)
npm run build:cms

# Regenerate import map (WAJIB setiap menambah komponen yang didaftarkan via path string)
npm run generate:importmap --workspace=cms-kala

# Sync registry + parity
npm run sync:builder
```

---

## 2. Peta Pekerjaan & Urutan Eksekusi

Urutan dipilih agar **setiap WP bisa dirilis sendiri** dan tidak saling menunggu.

| Urutan | WP | Judul | Dampak UX | Effort | Blocker WP lain |
|---|---|---|---|---|---|
| 1 | **WP-5** | Media bisa dicari via nama file | Sedang | 15 menit | — |
| 2 | **WP-1** | Simpan & Terbitkan di dalam builder | **Sangat tinggi** | 1,5–2 hari | WP-2, WP-3, WP-8 |
| 3 | **WP-3** | Banner error validasi di builder | **Tinggi** | 0,5–1 hari | — |
| 4 | **WP-2** | CTA "Simpan Draf" di panel preview kosong | Sedang | 0,25 hari | WP-1 |
| 5 | **WP-8** | Badge status deploy di halaman dokumen | Sedang | 0,5 hari | — |
| 6 | **WP-7** | Akurasi & performa dashboard | Sedang | 0,5 hari | — |
| 7 | **WP-6** | Dark mode konsisten | Sedang | 0,5 hari (A) / +1,5 hari (B) | — |
| 8 | **WP-4** | Unifikasi konsep "Buat Halaman" | **Tinggi** | 1 hari | — |
| 9 | **WP-9** | Bahasa, aksesibilitas, mobile | Sedang | 0,5 hari | WP-1 (header) |

**Total: ±5,5–6,5 hari kerja.** MVP (WP-5 + WP-1 + WP-3): **±2–3 hari** dan sudah menaikkan skor ke ±8,0.

### Aturan commit

Satu WP = satu commit. Format:

```
feat(admin-ux): <ringkasan WP>
```

Contoh: `feat(admin-ux): add save/publish actions inside visual builder`.

**Jangan gabungkan dua WP dalam satu commit** — rollback harus granular.

---

## 3. Konvensi Teknis Wajib

### 3.1 Path form builder (penting untuk WP-3)

Payload menyimpan state field dalam bentuk **flat path**:

```
layout                 → array-level (rows, error array)
layout.0               → row/block pertama
layout.0.title         → field `title` pada blok ke-0
layout.3.images.2.alt  → nested array di dalam blok
```

Gunakan `useAllFormFields()` → `[fields, dispatchFields]`.
Setiap entri punya `valid?: boolean` dan `errorMessage?: string`.

### 3.2 Warna: jangan hardcode

Semua komponen baru **wajib** memakai CSS variable Payload, bukan hex:

| Kebutuhan | Variable |
|---|---|
| Latar utama | `var(--theme-elevation-0)` |
| Latar sekunder | `var(--theme-elevation-50)` |
| Border | `var(--theme-elevation-150)` |
| Border kuat | `var(--theme-elevation-250)` |
| Teks utama | `var(--theme-text)` |
| Teks sekunder | `var(--theme-elevation-600)` |
| Sukses | `var(--theme-success-500)` |
| Peringatan | `var(--theme-warning-500)` |
| Error | `var(--theme-error-500)` |

> Verifikasi dulu bahwa variable yang dipakai benar-benar ada:
> ```powershell
> $css = (Invoke-WebRequest -Uri 'https://admin.kalababyspa.com/_next/static/css/10fd75af80250ab0.css' -UseBasicParsing).Content
> [regex]::Matches($css, '--theme-elevation-\d+:') | ForEach-Object { $_.Value } | Sort-Object -Unique
> [regex]::Matches($css, '--theme-(success|warning|error)-\d+:') | ForEach-Object { $_.Value } | Sort-Object -Unique
> ```
> Bila `--theme-elevation-600` tidak ada, pakai `--theme-elevation-500` atau `--theme-elevation-800`.

### 3.3 Komponen baru via path string

Setiap komponen yang didaftarkan sebagai `'/components/...#Nama'` **wajib** diikuti:

```powershell
npm run generate:importmap --workspace=cms-kala
```

Lupa langkah ini = komponen tidak muncul (tidak ada error jelas).

### 3.4 Encoding

File repo adalah **UTF-8**. Output PowerShell sering menampilkan mojibake (mis. emoji/aksen menjadi karakter aneh). Itu **hanya tampilan**, file aslinya benar.

- ✅ Edit lewat editor / tool `edit`.
- ❌ Jangan `Set-Content` tanpa `-Encoding UTF8` pada file berisi emoji/karakter Indonesia.
- Setelah edit: `git diff` dan pastikan tidak ada karakter rusak.

---

## 4. WP-5 — Media Bisa Dicari via Nama File

**Dampak:** staf yang mencari `IMG_2034.jpg` saat ini tidak menemukannya karena pencarian hanya lewat `alt`.

**Effort:** 15 menit. **Risiko:** sangat rendah. **DB:** tidak berubah.

### File

| File | Aksi |
|---|---|
| `apps/cms/src/collections/Media.ts` | Tambah 1 properti |

### Langkah

**5.1** Buka `apps/cms/src/collections/Media.ts`, pada blok `admin` (sekitar baris 15–19) tambahkan:

```ts
  admin: {
    group: 'Konten & Blog',
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'filesize', 'createdAt'],
    listSearchableFields: ['alt', 'filename', 'caption'], // ← tambahkan baris ini
  },
```

**5.2** (Opsional, disarankan) Tambahkan deskripsi pencarian:

```ts
    description:
      'Cari gambar berdasarkan teks alternatif, nama file (contoh: IMG_2034.jpg), atau keterangan.',
```

> `description` di `admin` = teks di atas tabel list. Aman, tidak mengubah schema.

### Kriteria penerimaan

- [ ] Di `/admin/collections/media`, ketik `IMG_` → hasil muncul berdasarkan `filename`.
- [ ] Ketik potongan `alt` → hasil muncul.
- [ ] Ketik potongan `caption` → hasil muncul.
- [ ] Tidak ada perubahan pada tabel DB (`git diff` hanya 1 file TS).

### Uji manual

1. Upload gambar dengan nama file `kala-test-2026.jpg`, alt "Tes pencarian media".
2. Buka list Media, cari `kala-test` → harus muncul.
3. Hapus gambar uji.

### Rollback

Hapus baris `listSearchableFields`. Tidak ada data yang terpengaruh.

---

## 5. WP-1 — Simpan & Terbitkan di Dalam Builder

**Dampak:** gesekan terbesar di seluruh admin. Tanpa ini, admin harus keluar portal untuk menyimpan.

**Effort:** 1,5–2 hari. **Risiko:** sedang. **DB:** tidak berubah.

### 5.1 Fakta teknis yang sudah diverifikasi

Dari `node_modules/@payloadcms/ui`:

| Fakta | Bukti |
|---|---|
| `useForm()` mengembalikan `submit` & `setModified` | `forms/Form/types.d.ts` |
| `submit({ overrides })` mengirim `_status` | `elements/SaveDraftButton/index.js:70` |
| SaveDraft memakai `skipValidation: true` | idem |
| Publish memakai `overrides: { _status: 'published' }` + validasi | `elements/PublishButton/index.js:159` |
| `submit` mengembalikan `{ formState, res }` saat sukses, `undefined` saat gagal | `forms/Form/index.js:205-430` |
| `submit` otomatis `setModified(false)` setelah sukses | `forms/Form/index.js:329` |
| `dispatchFields` **tidak** menandai form modified | `useField/index.js:99` memanggil `setModified(true)` manual |
| `LeaveWithoutSaving` sudah ada di header edit view & menangani `beforeunload` + route change | `elements/LeaveWithoutSaving/*` |
| `docInfo.hasSavePermission` & `hasPublishPermission` tersedia | `providers/DocumentInfo/types.d.ts` |
| `ConfirmationModal` Payload memakai `@faceless-ui/modal` → **jangan dipakai di dalam portal** (z-index & container berbeda) | `elements/ConfirmationModal/index.js` |

**Konsekuensi penting:**

1. Kita **tidak perlu** menulis `beforeunload` sendiri — cukup `setModified(true)`.
2. Kita **tidak boleh** memakai `ConfirmationModal` di dalam portal → buat dialog sendiri.
3. `submit` tanpa `action` memakai `action` dari Form edit view → aman untuk create & edit.

### 5.2 File

| File | Aksi |
|---|---|
| `apps/cms/src/components/admin/builder/useBuilderSave.ts` | **BARU** — hook simpan |
| `apps/cms/src/components/admin/builder/BuilderField.tsx` | Ubah header, close guard, shortcut, modified |
| `apps/cms/src/components/admin/builder/BuilderHeader.tsx` | **BARU (disarankan)** — pisahkan header agar BuilderField tidak membengkak |
| `apps/cms/src/app/(payload)/custom.scss` | Tambah style kecil untuk dialog (opsional) |

### 5.3 Langkah 1 — Buat hook `useBuilderSave.ts`

Buat file `apps/cms/src/components/admin/builder/useBuilderSave.ts`:

```tsx
'use client';

import { useCallback, useState } from 'react';
import { useDocumentInfo, useForm } from '@payloadcms/ui';

export type SaveIntent = 'draft' | 'publish';

export interface BuilderSaveApi {
  save: (intent: SaveIntent) => Promise<boolean>;
  isSaving: boolean;
  intent: SaveIntent | null;
  error: string | null;
  lastSavedAt: number | null;
  isNew: boolean;
  canSave: boolean;
  canPublish: boolean;
}

export function useBuilderSave(): BuilderSaveApi {
  const { submit, setModified } = useForm();
  const docInfo = useDocumentInfo();

  const [isSaving, setIsSaving] = useState(false);
  const [intent, setIntent] = useState<SaveIntent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const save = useCallback(
    async (next: SaveIntent): Promise<boolean> => {
      if (isSaving) return false;

      setIsSaving(true);
      setIntent(next);
      setError(null);

      try {
        // `submit` memakai `action` dari Form edit view (create & edit sama-sama benar).
        // Draft: boleh tidak valid (skipValidation) — sama seperti tombol Save Draft Payload.
        // Publish: validasi penuh dijalankan server & client.
        const result: any = await (submit as any)({
          overrides: { _status: next },
          skipValidation: next === 'draft',
        });

        const ok = Boolean(result?.res?.ok);

        if (!ok) {
          setError(
            next === 'publish'
              ? 'Penerbitan gagal. Periksa daftar kesalahan di banner merah.'
              : 'Penyimpanan gagal. Periksa daftar kesalahan di banner merah.',
          );
          return false;
        }

        setModified(false);
        setLastSavedAt(Date.now());
        return true;
      } catch (err) {
        setError((err as Error)?.message || 'Terjadi kesalahan tak terduga saat menyimpan.');
        return false;
      } finally {
        setIsSaving(false);
        setIntent(null);
      }
    },
    [isSaving, submit, setModified],
  );

  return {
    save,
    isSaving,
    intent,
    error,
    lastSavedAt,
    isNew: !docInfo?.id,
    canSave: docInfo?.hasSavePermission !== false,
    canPublish: docInfo?.hasPublishPermission === true,
  };
}
```

**Catatan tipe:** `submit` di `@payloadcms/ui` bertipe generic `Submit`. Bila `npx tsc --noEmit` mengeluh soal type argument, `(submit as any)` sudah menanganinya. Jangan menghapus cast tanpa menggantinya dengan type argument eksplisit.

### 5.4 Langkah 2 — Ubah `BuilderField.tsx`

#### 5.4.1 Import

Ganti baris import di bagian atas:

```tsx
import { useForm, useFormFields, useDocumentInfo, useFormModified } from '@payloadcms/ui';
import {
  Undo2, Redo2, X, Sparkles, Layers, Save, Rocket, Loader2, ExternalLink,
} from 'lucide-react';
import { useBuilderSave } from './useBuilderSave';
```

#### 5.4.2 State & hook

Ganti blok state (baris ~14–21) menjadi:

```tsx
export const BuilderField: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const { dispatchFields, setModified } = useForm();
  const docInfo = useDocumentInfo();
  const modified = useFormModified();
  const {
    save, isSaving, intent: saveIntent, error: saveError,
    lastSavedAt, canSave, canPublish, isNew,
  } = useBuilderSave();
```

> `hasUnsavedChanges` **dihapus**. Penggantinya `modified` dari Payload — lebih akurat karena ikut menghitung perubahan `title`, `slug`, dll.

#### 5.4.3 Tandai modified saat layout berubah

Ganti `updatePayloadLayout`:

```tsx
  const updatePayloadLayout = useCallback(
    (newLayout: LayoutBlock[]) => {
      setModified(true);
      dispatchFields({ type: 'UPDATE', path: 'layout', value: newLayout });
    },
    [dispatchFields, setModified],
  );
```

#### 5.4.4 Undo/redo juga menandai modified

Ganti callback history:

```tsx
  const { canUndo, canRedo, pushSnapshot, undo, redo, resetHistory } =
    useBuilderHistory<LayoutBlock[]>(layout, (restoredLayout) => {
      setModified(true);
      dispatchFields({ type: 'UPDATE', path: 'layout', value: restoredLayout });
    });
```

Dan ganti effect reset:

```tsx
  const lastUpdateTime = (docInfo as any)?.lastUpdateTime;

  useEffect(() => {
    if (docInfo?.id) resetHistory();
    // Sengaja tidak menyentuh `setModified` — itu urusan `submit` Payload.
  }, [docInfo?.id, lastUpdateTime, resetHistory]);
```

#### 5.4.5 Shortcut `Ctrl/Cmd+S`

Di handler `keydown` (baris ~101), **tambahkan di paling atas** sebelum logika `z`:

```tsx
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd+S → simpan draf (cegah Payload men-submit dua kali)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        e.stopPropagation();
        if (!isSaving && canSave) void save('draft');
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        // ... kode lama tetap
      }
    };
```

Update dependency array:

```tsx
  }, [isOpen, isAddMenuOpen, selectedSectionId, canUndo, canRedo, undo, redo, layout, isSaving, canSave, save]);
```

#### 5.4.6 Escape & tombol tutup → konfirmasi

Ganti cabang `Escape`:

```tsx
      } else if (e.key === 'Escape') {
        if (isAddMenuOpen) {
          setIsAddMenuOpen(false);
        } else if (showCloseConfirm) {
          setShowCloseConfirm(false);
        } else if (selectedSectionId) {
          setSelectedSectionId(null);
        } else if (modified) {
          setShowCloseConfirm(true);
        } else {
          setIsOpen(false);
        }
      }
```

> Urutan penting: Escape **tidak boleh** menutup builder yang masih kotor tanpa konfirmasi.

#### 5.4.7 Header baru

Ganti seluruh `<header>` (baris ~208–257) dengan:

```tsx
      <header className="h-[52px] bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0">
        {/* Kiri: judul + status */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 motion-safe:animate-pulse shrink-0" aria-hidden="true" />
          <h1 className="text-sm font-bold text-white truncate max-w-[150px] sm:max-w-[260px]" title={title}>
            {title}
          </h1>

          <span
            className={`text-[11px] px-2 py-0.5 rounded font-mono font-semibold uppercase shrink-0 ${
              status === 'published'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-800 text-amber-400 border border-slate-700'
            }`}
          >
            {status === 'published' ? 'Terbit' : 'Draf'}
          </span>

          <span className="hidden lg:inline text-[11px] text-slate-400" aria-live="polite">
            {isSaving
              ? saveIntent === 'publish' ? 'Menerbitkan…' : 'Menyimpan…'
              : modified
                ? '● Belum disimpan'
                : lastSavedAt
                  ? `Tersimpan ${new Date(lastSavedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                  : null}
          </span>
        </div>

        {/* Kanan: aksi */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => canUndo && undo(layout)}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 transition-colors"
          >
            <Undo2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => canRedo && redo(layout)}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 transition-colors"
          >
            <Redo2 size={16} />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" aria-hidden="true" />

          {canSave && (
            <button
              type="button"
              onClick={() => void save('draft')}
              disabled={isSaving}
              className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-slate-100 rounded-lg text-xs font-semibold transition-colors"
              aria-label="Simpan draf"
            >
              {isSaving && saveIntent === 'draft'
                ? <Loader2 size={15} className="animate-spin" />
                : <Save size={15} />}
              <span className="hidden sm:inline">Simpan Draf</span>
            </button>
          )}

          {canPublish && (
            <button
              type="button"
              onClick={() => void save('publish')}
              disabled={isSaving}
              className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              aria-label={docInfo?.hasPublishedDoc ? 'Terbitkan perubahan' : 'Terbitkan halaman'}
            >
              {isSaving && saveIntent === 'publish'
                ? <Loader2 size={15} className="animate-spin" />
                : <Rocket size={15} />}
              <span className="hidden sm:inline">
                {docInfo?.hasPublishedDoc ? 'Terbitkan Perubahan' : 'Terbitkan'}
              </span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-700 mx-1" aria-hidden="true" />

          <button
            type="button"
            onClick={() => (modified ? setShowCloseConfirm(true) : setIsOpen(false))}
            className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            aria-label="Tutup builder"
          >
            <X size={15} />
            <span className="hidden sm:inline">Tutup</span>
          </button>
        </div>
      </header>
```

**Banner error sementara** (nanti diganti WP-3) — tambahkan tepat **di bawah** `</header>`:

```tsx
      {saveError && (
        <div role="alert" className="shrink-0 bg-red-950 border-b border-red-800 px-4 py-2 text-xs text-red-200">
          {saveError}
        </div>
      )}
```

#### 5.4.8 Dialog konfirmasi tutup (tanpa `ConfirmationModal` Payload)

Tambahkan **sebelum** penutup `</div>` portal (setelah `<AddSectionMenu ... />`):

```tsx
      {showCloseConfirm && (
        <div
          className="absolute inset-0 z-[100000] flex items-center justify-center bg-slate-950/70 p-4"
          role="presentation"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCloseConfirm(false); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="kala-close-title"
            aria-describedby="kala-close-desc"
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl"
          >
            <h2 id="kala-close-title" className="text-base font-bold text-slate-900 m-0">
              Tutup builder?
            </h2>
            <p id="kala-close-desc" className="mt-2 text-xs leading-relaxed text-slate-600">
              Masih ada perubahan yang <strong>belum disimpan</strong>. Menutup builder tidak menghapus
              perubahan — perubahan tetap ada di formulir sampai Anda menekan <em>Simpan Draf</em>.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={async () => {
                  const ok = await save('draft');
                  if (ok) { setShowCloseConfirm(false); setIsOpen(false); }
                }}
                className="w-full rounded-lg bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 disabled:opacity-60"
              >
                {isSaving ? 'Menyimpan…' : 'Simpan Draf & Tutup'}
              </button>

              <button
                type="button"
                onClick={() => { setShowCloseConfirm(false); setIsOpen(false); }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tutup Tanpa Menyimpan
              </button>

              <button
                type="button"
                onClick={() => setShowCloseConfirm(false)}
                className="w-full rounded-lg px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
```

> **Kenapa bukan `ConfirmationModal` Payload?** Komponen itu merender modal lewat `ModalContainer` di root admin. Portal kita berada di `document.body` dengan `z-index: 99999`, sehingga dialog akan muncul **di belakang** overlay builder. Dialog inline di atas menghindari masalah ini.

#### 5.4.9 Tambah tombol simpan di kartu dalam formulir

Di `inFormCard`, setelah tombol "Buka Visual Page Builder", tambahkan:

```tsx
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {canSave && modified && (
            <button
              type="button"
              onClick={() => void save('draft')}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-lg border border-teal-700 text-teal-800 text-xs font-bold hover:bg-teal-50 disabled:opacity-60"
            >
              {isSaving ? 'Menyimpan…' : 'Simpan Draf'}
            </button>
          )}

          {/* tombol "Buka Visual Page Builder" yang sudah ada */}
        </div>
```

Ini memberi jalan keluar ketika admin sudah menutup builder tapi lupa menyimpan.

#### 5.4.10 Teruskan status ke PreviewFrame

```tsx
          <PreviewFrame
            collection={collectionSlug}
            docId={docInfo?.id}
            slug={slug}
            hasUnsavedChanges={modified}
            onSaveDraft={() => save('draft')}
            isSavingDraft={isSaving && saveIntent === 'draft'}
            canSaveDraft={canSave}
            selectedSectionId={selectedSectionId}
            onSelectFromIframe={(sectionId) => setSelectedSectionId(sectionId)}
            lastSaved={lastUpdateTime}
          />
```

### 5.5 Edge case yang wajib diuji

| Kasus | Perilaku yang benar |
|---|---|
| Dokumen **baru** (belum ada ID) | Tombol Simpan Draf ada; setelah sukses Payload redirect ke edit view; builder tertutup; buka lagi → preview aktif |
| Role tanpa izin publish | Tombol Terbitkan **tidak tampil** (`hasPublishPermission !== true`) |
| Role read-only | Kedua tombol tersembunyi, tapi builder tetap bisa dibuka (hanya lihat) |
| Validasi gagal saat Terbitkan | Tetap di builder, banner error muncul (WP-3), tidak ada data hilang |
| Simpan draf saat field wajib kosong | **Berhasil** (skipValidation) — sesuai perilaku Payload |
| Klik Tutup saat kotor | Dialog konfirmasi muncul, bukan langsung tertutup |
| Tutup tab / F5 saat kotor | Browser menampilkan prompt bawaan (dari `LeaveWithoutSaving`) |
| Klik menu sidebar saat kotor | Payload menampilkan modal "leave without saving" |
| Tekan `Ctrl+S` berulang cepat | Hanya satu request (`isSaving` guard) |
| Simpan sukses | Badge berubah "Tersimpan HH:mm", preview auto-refresh (dari Fase 6) |
| Simpan gagal (500) | Banner merah, status tetap "Belum disimpan", data tidak hilang |

### 5.6 Kriteria penerimaan

- [ ] Builder punya tombol **Simpan Draf** dan **Terbitkan** di header.
- [ ] `Ctrl+S` / `Cmd+S` menyimpan draf tanpa menutup builder.
- [ ] Badge header: `● Belum disimpan` → `Tersimpan HH:mm` setelah simpan.
- [ ] Menutup builder saat kotor memunculkan dialog 3 opsi.
- [ ] `setModified(true)` terpanggil untuk perubahan layout **dan** undo/redo.
- [ ] Menutup tab saat kotor memunculkan prompt browser.
- [ ] Navigasi menu saat kotor memunculkan modal Payload.
- [ ] Simpan dari builder → reload halaman → perubahan persisted.
- [ ] Terbitkan dari builder → `_status` = `published` di DB.
- [ ] Role `author` tidak melihat tombol Terbitkan.
- [ ] `npx tsc --noEmit` exit 0.

### 5.7 Rollback

`git revert` commit WP-1. Tidak ada perubahan data. `dispatchFields` lama tetap kompatibel.

---

## 6. WP-3 — Banner Error Validasi di Dalam Builder

**Dampak:** saat ini, jika `layout` invalid, admin hanya melihat toast "Correct invalid fields" tanpa tahu field mana — karena field-nya tersembunyi di mode builder.

**Effort:** 0,5–1 hari. **Risiko:** rendah. **DB:** tidak berubah.

### 6.1 File

| File | Aksi |
|---|---|
| `apps/cms/src/components/admin/builder/validation-utils.ts` | **BARU** — fungsi murni (mudah dites) |
| `apps/cms/src/components/admin/builder/BuilderValidationBanner.tsx` | **BARU** — komponen banner |
| `apps/cms/src/components/admin/builder/BuilderField.tsx` | Render banner + handler |
| `apps/cms/tests/ux-polish.test.ts` | **BARU** — unit test parser |

### 6.2 Langkah 1 — Fungsi murni

Buat `apps/cms/src/components/admin/builder/validation-utils.ts`:

```ts
export interface ParsedFieldPath {
  /** null = error level array `layout`, bukan baris tertentu */
  rowIndex: number | null;
  /** field di dalam blok, mis. 'title' atau 'images.2.alt' */
  fieldPath: string;
}

/**
 * Mengubah path form Payload menjadi info baris & field.
 * 'layout'            → { rowIndex: null, fieldPath: '' }
 * 'layout.3'          → { rowIndex: 3,    fieldPath: '' }
 * 'layout.3.title'    → { rowIndex: 3,    fieldPath: 'title' }
 * 'layout.3.images.0.alt' → { rowIndex: 3, fieldPath: 'images.0.alt' }
 */
export function parseBuilderFieldPath(path: string): ParsedFieldPath | null {
  if (path !== 'layout' && !path.startsWith('layout.')) return null;
  if (path === 'layout') return { rowIndex: null, fieldPath: '' };

  const parts = path.split('.');
  const rowIndex = Number(parts[1]);

  if (!Number.isInteger(rowIndex) || rowIndex < 0) {
    return { rowIndex: null, fieldPath: parts.slice(1).join('.') };
  }

  return { rowIndex, fieldPath: parts.slice(2).join('.') };
}

/** Label ramah untuk field yang sering muncul. */
export const BUILDER_FIELD_LABELS: Record<string, string> = {
  title: 'Judul',
  subtitle: 'Subjudul',
  badge: 'Badge',
  heading: 'Judul',
  description: 'Deskripsi',
  image: 'Gambar',
  imageAlt: 'Teks alternatif gambar',
  images: 'Galeri gambar',
  alt: 'Teks alternatif',
  caption: 'Keterangan',
  ctaLabel: 'Teks tombol',
  ctaHref: 'Tautan tombol',
  buttonText: 'Teks tombol',
  buttonLink: 'Tautan tombol',
  href: 'Tautan',
  url: 'URL',
  items: 'Daftar item',
  questions: 'Daftar pertanyaan',
  answer: 'Jawaban',
  name: 'Nama',
  price: 'Harga',
  slug: 'Slug',
  refCode: 'Kode referensi',
};

export function humanizeBuilderField(fieldPath: string): string {
  if (!fieldPath) return 'Susunan seksi';

  const segments = fieldPath.split('.').filter((s) => !/^\d+$/.test(s));
  const last = segments[segments.length - 1] || fieldPath;

  return BUILDER_FIELD_LABELS[last] ?? last.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}
```

### 6.3 Langkah 2 — Komponen banner

Buat `apps/cms/src/components/admin/builder/BuilderValidationBanner.tsx`:

```tsx
'use client';

import React, { useMemo } from 'react';
import { AlertTriangle, ChevronRight, FormInput } from 'lucide-react';
import { useAllFormFields, useFormSubmitted } from '@payloadcms/ui';
import { parseBuilderFieldPath, humanizeBuilderField } from './validation-utils';
import type { LayoutBlock } from './useBuilderLayout';

interface BuilderValidationBannerProps {
  layout: LayoutBlock[];
  onFocusSection: (sectionId: string) => void;
  onOpenFormMode: () => void;
}

interface RowError {
  key: string;
  path: string;
  message: string;
  rowIndex: number | null;
  fieldPath: string;
}

export const BuilderValidationBanner: React.FC<BuilderValidationBannerProps> = ({
  layout,
  onFocusSection,
  onOpenFormMode,
}) => {
  const [fields] = useAllFormFields();
  const submitted = useFormSubmitted();

  const errors = useMemo<RowError[]>(() => {
    const out: RowError[] = [];

    for (const [path, state] of Object.entries(fields as Record<string, any>)) {
      if (!state || state.valid !== false) continue;

      const parsed = parseBuilderFieldPath(path);
      if (!parsed) continue;

      out.push({
        key: path,
        path,
        message: state.errorMessage || 'Nilai tidak valid.',
        rowIndex: parsed.rowIndex,
        fieldPath: parsed.fieldPath,
      });
    }

    return out;
  }, [fields]);

  // Jangan tampilkan sebelum admin mencoba menyimpan/menerbitkan.
  if (!submitted || errors.length === 0) return null;

  const MAX_VISIBLE = 4;
  const visible = errors.slice(0, MAX_VISIBLE);
  const remaining = errors.length - visible.length;

  return (
    <div
      role="alert"
      className="shrink-0 bg-red-950/95 border-b border-red-800 px-4 py-2.5"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="text-red-300 mt-0.5 shrink-0" aria-hidden="true" />

        <div className="min-w-0 flex-1">
          <p className="m-0 text-xs font-bold text-red-100">
            {errors.length} field perlu diperbaiki sebelum bisa disimpan/diterbitkan.
          </p>

          <ul className="mt-1.5 mb-0 list-none p-0 space-y-1">
            {visible.map((err) => {
              const block = err.rowIndex !== null ? layout[err.rowIndex] : null;
              const sectionId = block ? (block.id || block.blockType) : null;
              const sectionLabel = block
                ? `Seksi ${err.rowIndex! + 1} · ${block.blockType}`
                : 'Susunan seksi';

              return (
                <li key={err.key} className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-red-200 truncate">
                    <strong className="text-red-100">{sectionLabel}</strong>
                    {' → '}
                    {humanizeBuilderField(err.fieldPath)}: {err.message}
                  </span>

                  {sectionId && (
                    <button
                      type="button"
                      onClick={() => onFocusSection(String(sectionId))}
                      className="flex items-center gap-0.5 text-[11px] font-bold text-red-100 hover:text-white shrink-0"
                    >
                      Buka <ChevronRight size={12} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {remaining > 0 && (
            <p className="mt-1 mb-0 text-[11px] text-red-300">
              +{remaining} kesalahan lain. Buka mode formulir untuk melihat semuanya.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenFormMode}
          className="flex items-center gap-1 rounded-md border border-red-700 px-2 py-1 text-[11px] font-semibold text-red-100 hover:bg-red-900 shrink-0"
        >
          <FormInput size={12} />
          Mode Formulir
        </button>
      </div>
    </div>
  );
};
```

> **Catatan performa:** `useAllFormFields` menyebabkan re-render setiap ketikan. Karena komponen ini kecil dan `layout` biasanya < 30 blok, ini masih murah. Jika nanti terasa lambat, bungkus `errors` dengan `useDeferredValue` atau hitung hanya saat `submitted === true` (sudah dilakukan untuk render, tapi `useMemo` tetap jalan — boleh dipindah ke dalam `if`).

### 6.4 Langkah 3 — Pasang di `BuilderField`

Di dalam portal, tepat **setelah** blok `{saveError && ...}`:

```tsx
      <BuilderValidationBanner
        layout={layout}
        onFocusSection={(id) => setSelectedSectionId(id)}
        onOpenFormMode={() => {
          setModified(true);
          dispatchFields({ type: 'UPDATE', path: 'editorMode', value: 'form' });
          setIsOpen(false);
          setShowCloseConfirm(false);
        }}
      />
```

Tambahkan import:

```tsx
import { BuilderValidationBanner } from './BuilderValidationBanner';
```

### 6.5 Kenapa ini bekerja

1. Saat admin klik **Terbitkan**, `submit()` memanggil `validateForm()`.
2. Jika invalid → `setSubmitted(true)` + `errorToast('Correct invalid fields')` (`Form/index.js:286-291`).
3. Server error juga di-dispatch sebagai `ADD_SERVER_ERRORS` (`Form/index.js:404`).
4. Banner membaca `fields[path].valid === false` → menampilkan seksi + field.
5. Tombol "Buka" memilih seksi tersebut → panel kanan menampilkan `SectionSettings` untuk field itu.
6. Tombol "Mode Formulir" mengalihkan `editorMode` ke `form` → field blocks asli Payload tampil dengan error merahnya.

### 6.6 Kriteria penerimaan

- [ ] Tambah blok Hero, kosongkan Judul, klik Terbitkan → banner muncul.
- [ ] Banner menyebut **nomor seksi + nama field + pesan**.
- [ ] Klik "Buka" → seksi tersebut terpilih di sidebar.
- [ ] Klik "Mode Formulir" → builder tertutup, form Payload menampilkan field blocks dengan error.
- [ ] Banner **tidak** muncul saat mengetik normal sebelum submit.
- [ ] Banner hilang setelah semua error diperbaiki dan simpan berhasil.
- [ ] `parseBuilderFieldPath` lulus unit test (lihat §11).

### 6.7 Rollback

Hapus render `<BuilderValidationBanner />` + 2 file baru. Tidak ada efek samping.

---

## 7. WP-2 — CTA "Simpan Draf" di Panel Preview Kosong

**Dampak:** halaman baru menampilkan "Simpan draft terlebih dahulu" tanpa jalan keluar.

**Effort:** 0,25 hari. **Risiko:** rendah. **DB:** tidak berubah. **Bergantung pada WP-1.**

### 7.1 File

| File | Aksi |
|---|---|
| `apps/cms/src/components/admin/builder/PreviewFrame.tsx` | Tambah props + empty state baru |

### 7.2 Langkah

**7.2.1** Tambah props:

```tsx
interface PreviewFrameProps {
  collection: 'landing-pages' | 'pages';
  docId?: string | number;
  slug?: string;
  hasUnsavedChanges: boolean;
  selectedSectionId?: string | null;
  onSelectFromIframe?: (sectionId: string) => void;
  lastSaved?: number;
  onSaveDraft?: () => Promise<boolean>;
  isSavingDraft?: boolean;
  canSaveDraft?: boolean;
}
```

**7.2.2** Destructure props baru.

**7.2.3** Ganti guard di `fetchToken` — jangan jadikan "belum ada ID" sebagai error:

```tsx
  const fetchToken = useCallback(async () => {
    if (!docId) {
      setPreviewUrl(null);
      setError(null);
      return;
    }
    // ... sisa kode tetap
  }, [collection, docId]);
```

**7.2.4** Ganti blok render error/empty (baris ~229–254) dengan logika berurutan:

```tsx
      <div className="flex-1 overflow-auto flex items-center justify-center p-3">
        {!docId ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-md text-center">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-3">
              <Monitor size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Pratinjau belum aktif</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Halaman ini belum punya versi tersimpan, jadi belum ada yang bisa dipratinjau.
              Simpan draf terlebih dahulu — halaman akan dimuat ulang, lalu buka builder kembali.
            </p>

            {canSaveDraft && (
              <button
                type="button"
                disabled={isSavingDraft}
                onClick={() => void onSaveDraft?.()}
                className="mt-4 w-full rounded-lg bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 disabled:opacity-60"
              >
                {isSavingDraft ? 'Menyimpan…' : 'Simpan Draf & Muat Ulang'}
              </button>
            )}

            <p className="mt-2 text-[11px] text-slate-400">
              Tidak ada autosave. Perubahan hanya tersimpan saat Anda menekan tombol simpan.
            </p>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-md text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              !
            </div>
            <h3 className="text-sm font-bold text-slate-800">Pratinjau gagal dimuat</h3>
            <p className="text-xs text-slate-600 mt-1">{error}</p>
            <button
              type="button"
              onClick={fetchToken}
              className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Coba Lagi
            </button>
          </div>
        ) : previewUrl ? (
          /* ... iframe yang sudah ada, tidak diubah ... */
        ) : (
          /* ... loading yang sudah ada, tidak diubah ... */
        )}
      </div>
```

**7.2.5** Ganti teks badge "Preview = Versi Tersimpan":

```tsx
            <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
              Pratinjau = versi tersimpan
            </span>
```

### 7.3 Kriteria penerimaan

- [ ] Buka builder pada dokumen **baru** → kartu CTA muncul (bukan pesan error).
- [ ] Klik "Simpan Draf & Muat Ulang" → dokumen tersimpan, halaman redirect ke edit view.
- [ ] Buka builder lagi → preview tampil.
- [ ] Token error (401/500) → kartu "Pratinjau gagal dimuat" + tombol "Coba Lagi".
- [ ] Role read-only tidak melihat tombol simpan.

### 7.4 Rollback

`git revert` commit WP-2. Preview lama kembali berperilaku seperti semula.

---

## 8. WP-8 — Badge Status Deploy di Halaman Dokumen

**Dampak:** setelah klik Terbitkan, admin tidak tahu apakah situs sedang dibangun (60–90 detik). Saat ini status hanya ada di dashboard.

**Effort:** 0,5 hari. **Risiko:** rendah. **DB:** tidak berubah.

### 8.1 Fakta

- Endpoint sudah ada: `GET /api/deploy-status` (`payload.config.ts` → `endpoints`).
- `getDeployStatus()` mengembalikan `{ status, isBuilding, estimatedSecondsRemaining, lastTriggeredAt, lastCompletedAt, lastReason, error }`.
- Status disimpan **in-memory per proses**. Restart container = reset ke `idle`. Multi-replica = bisa tidak akurat.

### 8.2 File

| File | Aksi |
|---|---|
| `apps/cms/src/components/admin/DeployStatusPill.tsx` | **BARU** |
| `apps/cms/src/collections/Pages.ts` | Daftarkan di `admin.components.edit.beforeDocumentControls` |
| `apps/cms/src/collections/LandingPages.ts` | idem |
| `apps/cms/src/collections/Articles.ts` | idem (opsional) |

### 8.3 Komponen

Buat `apps/cms/src/components/admin/DeployStatusPill.tsx`:

```tsx
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDocumentInfo } from '@payloadcms/ui';
import { CloudUpload, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeployStatusResponse {
  status: 'idle' | 'triggered' | 'success' | 'failed';
  isBuilding: boolean;
  estimatedSecondsRemaining: number;
  lastTriggeredAt?: string;
  lastCompletedAt?: string;
  error?: string;
}

export const DeployStatusPill: React.FC = () => {
  const docInfo = useDocumentInfo();
  const [data, setData] = useState<DeployStatusResponse | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/deploy-status', { cache: 'no-store' });
      if (!res.ok) return;
      setData((await res.json()) as DeployStatusResponse);
    } catch {
      /* diamkan — badge bersifat informatif */
    }
  }, []);

  // Muat saat mount & setiap dokumen selesai disimpan
  useEffect(() => {
    void load();
  }, [load, docInfo?.lastUpdateTime]);

  // Polling hanya saat membangun
  useEffect(() => {
    if (!data?.isBuilding) return;
    const timer = setInterval(() => {
      void load();
    }, 15000);
    return () => clearInterval(timer);
  }, [data?.isBuilding, load]);

  const label = useMemo(() => {
    if (!data) return null;
    if (data.status === 'failed') return 'Deploy terakhir gagal';
    if (data.isBuilding) return `Sedang tayang… ±${Math.max(0, data.estimatedSecondsRemaining)} dtk`;
    if (data.status === 'success' || data.status === 'triggered') return 'Perubahan sudah tayang';
    return null;
  }, [data]);

  if (!docInfo?.id || !label) return null;

  const tone =
    data?.status === 'failed'
      ? { bg: 'var(--theme-error-50)', border: 'var(--theme-error-500)', text: 'var(--theme-error-600)' }
      : data?.isBuilding
        ? { bg: 'var(--theme-warning-50)', border: 'var(--theme-warning-500)', text: 'var(--theme-warning-600)' }
        : { bg: 'var(--theme-success-50)', border: 'var(--theme-success-500)', text: 'var(--theme-success-600)' };

  return (
    <div
      role="status"
      aria-live="polite"
      title={data?.error || data?.lastCompletedAt || ''}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        border: `1px solid ${tone.border}`,
        background: tone.bg,
        color: tone.text,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {data?.status === 'failed'
        ? <AlertTriangle size={12} />
        : data?.isBuilding
          ? <Loader2 size={12} className="animate-spin" />
          : <CheckCircle2 size={12} />}
      {label}
    </div>
  );
};
```

> Jika `--theme-error-50` / `--theme-success-50` tidak tersedia, ganti dengan `var(--theme-elevation-50)` untuk background dan pertahankan warna teks/border.

### 8.4 Registrasi

Di `apps/cms/src/collections/Pages.ts` pada blok `admin`, tambahkan:

```ts
    components: {
      edit: {
        beforeDocumentControls: ['/components/admin/DeployStatusPill#DeployStatusPill'],
      },
    },
```

Lakukan hal yang sama di `LandingPages.ts` (dan `Articles.ts` bila ingin).

Lalu:

```powershell
npm run generate:importmap --workspace=cms-kala
```

### 8.5 Kriteria penerimaan

- [ ] Buka dokumen yang sudah ada → badge status muncul di header.
- [ ] Klik Terbitkan → dalam < 5 detik badge berubah "Sedang tayang… ±90 dtk".
- [ ] Setelah ±90 detik → "Perubahan sudah tayang".
- [ ] Buka dokumen **baru** (create) → badge tidak muncul.
- [ ] Badge terbaca di dark mode (pakai CSS var).

### 8.6 Batasan yang harus didokumentasikan

Tambahkan catatan di `docs/runbook-teknis.md`:

> Status deploy disimpan di memori proses CMS. Restart container mereset status ke `idle`. Jika CMS dijalankan lebih dari satu replika, badge bisa menampilkan status dari replika berbeda.

### 8.7 Rollback

Hapus entri `components.edit.beforeDocumentControls` + file komponen. Jalankan `generate:importmap` lagi.

---

## 9. WP-7 — Akurasi & Performa Dashboard

**Dampak:** dashboard mengklaim "dihitung dari seluruh konten" padahal hanya 50 dokumen terbaru per koleksi. Link "Lihat semua" juga salah arah.

**Effort:** 0,5 hari. **Risiko:** rendah. **DB:** tidak berubah.

### 9.1 Temuan pasti (baris di `CustomDashboard.tsx`)

| Baris | Masalah |
|---|---|
| 30–57 | `overrideAccess: true` untuk 3 koleksi |
| 40, 47, 54 | `limit: 50` → `docs` hanya 50 terbaru |
| 99–102 | Filter hardcoded `test ads` / `test1` |
| 165 | `totalContentCount = auditedItems.length` (maks 150) |
| 591 | `"X dari Y konten"` → Y menyesatkan |
| 689–699 | "Lihat semua isu SEO" → `/admin/collections/articles` (padahal isu lintas koleksi) |
| 740 | `"Seluruh X halaman dan artikel"` → menyesatkan |
| 900 | `"Dihitung otomatis dari seluruh konten aktif di database"` → salah |
| 934–943 | "Lihat semua dokumen" → `/admin/collections/pages` (tidak mencakup landing page) |

### 9.2 Langkah 1 — Query yang benar

Ganti blok baris 30–65 dengan:

```tsx
  // Dashboard harus menghormati akses user yang login.
  // Bila tidak ada user (mis. render anonim), jangan query apa pun.
  const user = props?.user ?? req?.user

  let articles: any[] = []
  let pages: any[] = []
  let landingPages: any[] = []
  let totals = { articles: 0, pages: 0, landingPages: 0 }

  try {
    if (user) {
      const [articlesRes, pagesRes, lpRes] = await Promise.all([
        payload.find({
          collection: 'articles',
          depth: 1,
          limit: 50,
          sort: '-updatedAt',
          overrideAccess: false,
          user,
        }),
        payload.find({
          collection: 'pages',
          depth: 1,
          limit: 50,
          sort: '-updatedAt',
          overrideAccess: false,
          user,
        }),
        payload.find({
          collection: 'landing-pages',
          depth: 1,
          limit: 50,
          sort: '-updatedAt',
          overrideAccess: false,
          user,
        }),
      ])

      articles = articlesRes?.docs || []
      pages = pagesRes?.docs || []
      landingPages = lpRes?.docs || []

      totals = {
        articles: articlesRes?.totalDocs ?? articles.length,
        pages: pagesRes?.totalDocs ?? pages.length,
        landingPages: lpRes?.totalDocs ?? landingPages.length,
      }
    }
  } catch (err) {
    console.error('Error fetching dashboard items:', err)
  }
```

> `totalDocs` dihitung Payload dari query **sebelum** `limit` diterapkan. Jadi tidak perlu query `count()` tambahan.

### 9.3 Langkah 2 — Angka yang jujur

Setelah `const totalContentCount = auditedItems.length` (baris 165), tambahkan:

```tsx
  const auditedCount = totalContentCount
  const totalDocuments = totals.articles + totals.pages + totals.landingPages
  const isAuditTruncated = totalDocuments > auditedCount
```

Ganti tiga teks:

**Baris ~591:**

```tsx
              {auditedCount > 0
                ? `${totalAttentionCount} dari ${auditedCount} konten terbaru`
                : 'Belum ada konten'}
```

**Baris ~740:**

```tsx
                Seluruh {auditedCount} konten terbaru telah memiliki metadata lengkap dan
```

**Baris ~900:**

```tsx
            ⚡ Skor dihitung dari {auditedCount} dokumen terbaru (maks. 50 per koleksi).
            {isAuditTruncated && ` Total ${totalDocuments} dokumen di database.`}
```

### 9.4 Langkah 3 — Link "Lihat semua" yang benar

**Baris ~689–699** — ganti satu link menjadi dua:

```tsx
              {totalAttentionCount > 3 && (
                <div style={{ paddingTop: '8px', display: 'flex', gap: '16px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <Link href="/admin/collections/articles" style={{ fontSize: '13px', color: 'var(--kala-link)', fontWeight: 600, textDecoration: 'none' }}>
                    Artikel →
                  </Link>
                  <Link href="/admin/collections/pages" style={{ fontSize: '13px', color: 'var(--kala-link)', fontWeight: 600, textDecoration: 'none' }}>
                    Halaman →
                  </Link>
                  <Link href="/admin/collections/landing-pages" style={{ fontSize: '13px', color: 'var(--kala-link)', fontWeight: 600, textDecoration: 'none' }}>
                    Landing page →
                  </Link>
                </div>
              )}
```

**Baris ~934–943** — perbaiki label & href:

```tsx
            <Link href="/admin/collections/pages" style={{ fontSize: '13px', color: 'var(--kala-link)', fontWeight: 600, textDecoration: 'none' }}>
              Semua halaman →
            </Link>
```

> `var(--kala-link)` baru didefinisikan di WP-6. Jika WP-7 dieksekusi lebih dulu, pakai `#0284c7` sementara.

### 9.5 Langkah 4 — Hapus filter hardcoded

Ganti baris 99–102 dengan konstanta di atas fungsi:

```tsx
const HIDDEN_TEST_TITLE_PREFIXES = ['test ads', 'test1']
```

dan:

```tsx
  const allDocs = rawDocs.filter((d: any) => {
    const title = (d.title || d.name || '').toLowerCase()
    return !HIDDEN_TEST_TITLE_PREFIXES.some((prefix) => title.startsWith(prefix))
  })
```

> **Jangan hapus filternya** di Fase 8 — masih ada dokumen uji di DB produksi. Hapus filter hanya setelah dokumen uji dibersihkan (tugas terpisah).

### 9.6 Langkah 5 (opsional, D3 = Opsi B) — Halaman `/admin/seo-audit`

Bila ingin "Lihat semua isu" benar-benar berfungsi:

1. Buat `apps/cms/src/components/admin/SeoAuditView.tsx` (server component) yang menjalankan logika `auditedItems` yang sama dan merender tabel lengkap + filter severity.
2. Daftarkan di `payload.config.ts`:

```ts
    components: {
      views: {
        dashboard: { Component: '/components/admin/CustomDashboard#CustomDashboard' },
        seoAudit: {
          Component: '/components/admin/SeoAuditView#SeoAuditView',
          path: '/seo-audit',
        },
      },
    },
```

3. Jalankan `npm run generate:importmap --workspace=cms-kala`.
4. Ubah link "Lihat semua" → `/admin/seo-audit`.

> **Risiko:** duplikasi logika SEO. Ekstrak perhitungan ke `apps/cms/src/lib/dashboard-data.ts` agar dashboard & view memakai fungsi yang sama. Bila waktu terbatas, **lewati langkah ini**.

### 9.7 Kriteria penerimaan

- [ ] Angka "Total X dokumen" = jumlah nyata di DB (uji dengan > 50 artikel).
- [ ] Copy tidak lagi mengklaim "seluruh konten" untuk skor.
- [ ] Link "Semua halaman" menuju daftar halaman.
- [ ] Tiga link artikel/halaman/landing page berfungsi.
- [ ] User dengan role terbatas tidak menyebabkan error 500 (query di-skip bila `user` kosong).
- [ ] Dashboard tetap render < 2 detik dengan 150 dokumen.

### 9.8 Rollback

`git revert` commit WP-7. Query lama (`overrideAccess: true`) kembali.

---

## 10. WP-6 — Dark Mode Konsisten

**Dampak:** `CustomDashboard` memakai ±150 warna hex hardcoded. Saat admin memilih tema gelap, dashboard tampak "sobek".

**Effort:** 0,5 hari (Fase A) / +1,5 hari (Fase B). **Risiko:** rendah (A) / sedang (B). **DB:** tidak berubah.

### 10.1 Fase A — Kunci tema terang (WAJIB, lakukan selalu)

`apps/cms/src/payload.config.ts`, di dalam `admin:` tambahkan:

```ts
  admin: {
    user: Users.slug,
    theme: 'light', // ← tambahkan
    importMap: { ... },
```

**Efek:** tombol ganti tema hilang, admin selalu terang. Dashboard langsung konsisten.

**Trade-off:** user yang suka gelap kehilangan pilihan. Ini **lebih baik** daripada dashboard rusak.

> Bila D1 = Opsi B, **tetap lakukan Fase A dulu**, lalu lanjut Fase B, lalu ubah ke `theme: 'all'` di akhir.

### 10.2 Fase B — Migrasi ke CSS variable

#### 10.2.1 Buat token semantik

Buat `apps/cms/src/app/(payload)/kala-dashboard.scss`:

```scss
.kala-dashboard {
  --kala-surface: var(--theme-elevation-0);
  --kala-surface-muted: var(--theme-elevation-50);
  --kala-surface-subtle: var(--theme-elevation-100);
  --kala-border: var(--theme-elevation-150);
  --kala-border-strong: var(--theme-elevation-250);
  --kala-text: var(--theme-text);
  --kala-text-muted: var(--theme-elevation-600);
  --kala-link: var(--theme-success-600);
  --kala-shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06);

  color: var(--kala-text);
}

[data-theme='dark'] .kala-dashboard {
  --kala-shadow-card: 0 1px 3px rgba(0, 0, 0, 0.4);
}
```

Import di `apps/cms/src/app/(payload)/custom.scss` (paling atas):

```scss
@import './kala-dashboard.scss';
```

#### 10.2.2 Pasang class di root dashboard

`CustomDashboard.tsx` baris ~273:

```tsx
    <div
      className="kala-dashboard"
      style={{
        padding: '24px 32px 48px 32px',
        maxWidth: '1280px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: 'var(--kala-text)',
      }}
    >
```

#### 10.2.3 Tabel penggantian warna

Gunakan **Find & Replace di editor** (bukan PowerShell) agar encoding aman.

| Cari | Ganti | Catatan |
|---|---|---|
| `#0f172a` | `var(--kala-text)` | semua teks utama |
| `#475569` | `var(--kala-text-muted)` | teks sekunder |
| `#64748b` | `var(--kala-text-muted)` | teks sekunder |
| `#e2e8f0` | `var(--kala-border)` | border & divider |
| `#cbd5e1` | `var(--kala-border-strong)` | border tombol |
| `#f8fafc` | `var(--kala-surface-muted)` | latar |
| `#f1f5f9` | `var(--kala-surface-subtle)` | latar |
| `#0284c7` | `var(--kala-link)` | link |
| `rgba(0,0,0,0.04)` | `var(--kala-shadow-card)` | shadow kartu |
| `rgba(0,0,0,0.05)` | `var(--kala-shadow-card)` | shadow |

**Pengecualian penting — JANGAN ganti buta:**

| Pola | Alasan | Tindakan |
|---|---|---|
| `color: '#ffffff'` | Teks putih di atas tombol berwarna (teal). Jika diganti jadi `--kala-surface`, teks menjadi gelap di dark mode dan tak terbaca. | **Biarkan** `#ffffff`. |
| `backgroundColor: '#ffffff'` | Ini latar kartu. | Ganti ke `var(--kala-surface)` **hanya** pola ini. |
| `#fee2e2`, `#fef3c7`, `#dcfce7` | Badge pastel. | Biarkan dulu (aksen kecil). |
| `#b91c1c`, `#b45309`, `#15803d` | Teks badge. | Biarkan dulu. |
| Gradient `linear-gradient(...)` di hero | Perlu varian gelap. | Ganti manual (lihat 10.2.4). |

**Perintah verifikasi jumlah sisa hex:**

```powershell
rg -n "#[0-9a-fA-F]{6}" apps/cms/src/components/admin/CustomDashboard.tsx
```

Target: hanya tersisa warna badge & teks putih tombol.

#### 10.2.4 Gradient hero

Cari `linear-gradient(` di `CustomDashboard.tsx`. Ganti latar kartu hero menjadi:

```tsx
background: 'linear-gradient(135deg, var(--theme-elevation-50) 0%, var(--theme-elevation-0) 55%, var(--theme-elevation-100) 100%)',
```

#### 10.2.5 Aktifkan kembali tema gelap

Setelah semua hex netral hilang:

```ts
    theme: 'all',
```

### 10.3 Kriteria penerimaan

- [ ] Fase A: tidak ada tombol tema; dashboard selalu terang.
- [ ] Fase B: ganti tema via DevTools (`document.documentElement.dataset.theme = 'dark'`) → dashboard tetap terbaca.
- [ ] Tidak ada teks gelap di atas latar gelap.
- [ ] Kartu, border, tabel, dan badge terlihat jelas di kedua tema.
- [ ] Kontras teks ≥ 4.5:1 (cek dengan DevTools color picker).

### 10.4 Rollback

Fase A: hapus baris `theme`. Fase B: `git revert`. Tidak ada perubahan data.

---

## 11. WP-4 — Unifikasi Konsep "Buat Halaman"

**Dampak:** ada 4 konsep mirip (`Pages`, `LandingPages`, `PageTemplates`, `BlockTemplates`). Marketing selalu bertanya: "Saya bikin halaman promo, pakai yang mana?"

**Effort:** 1 hari (inti). **Risiko:** rendah (hanya label + komponen panduan). **DB:** tidak berubah.

### 11.1 File

| File | Aksi |
|---|---|
| `apps/cms/src/collections/Pages.ts` | `labels`, `admin.description` |
| `apps/cms/src/collections/LandingPages.ts` | `labels`, `admin.description` |
| `apps/cms/src/components/admin/PageTypeGuide.tsx` | **BARU** — kartu panduan |
| `apps/cms/src/collections/Pages.ts` | daftarkan `beforeList` |
| `apps/cms/src/collections/LandingPages.ts` | daftarkan `beforeList` |
| `apps/cms/src/collections/PageTemplates.ts` | `beforeList` (opsional) |
| `docs/sop-operasional.md` | Tambah bagian "Membuat Halaman Baru" |

### 11.2 Langkah 1 — Label & deskripsi

**`Pages.ts`:**

```ts
  labels: {
    singular: 'Halaman Info',
    plural: 'Halaman Info',
  },
  admin: {
    group: 'Halaman Website',
    description:
      'Halaman tetap situs: Tentang Kami, Layanan, Area, Kebijakan Privasi. Gunakan ini untuk konten yang tidak beriklan.',
    ...
```

**`LandingPages.ts`:**

```ts
  labels: {
    singular: 'Landing Page Iklan',
    plural: 'Landing Page Iklan',
  },
  admin: {
    group: 'Halaman Website',
    description:
      'Halaman kampanye iklan (Meta/Google Ads) dengan kode referensi, pelacakan WhatsApp, dan CAPI. Gunakan ini untuk promo berbayar.',
    ...
```

> **Jangan** mengubah `slug` koleksi. Itu akan merusak semua URL admin & API.

### 11.3 Langkah 2 — Komponen panduan `beforeList`

Buat `apps/cms/src/components/admin/PageTypeGuide.tsx` (server component, tanpa `'use client'`):

```tsx
import React from 'react'
import Link from 'next/link'

type GuideVariant = 'pages' | 'landing-pages'

interface PageTypeGuideProps {
  variant?: GuideVariant
}

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '16px',
  borderRadius: 12,
  border: '1px solid var(--theme-elevation-150)',
  background: 'var(--theme-elevation-0)',
  textDecoration: 'none',
  color: 'inherit',
}

const TITLE_STYLE: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--theme-text)',
}

const BODY_STYLE: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.5,
  color: 'var(--theme-elevation-600)',
}

export function PageTypeGuide({ variant = 'pages' }: PageTypeGuideProps) {
  return (
    <div
      style={{
        margin: '0 0 20px 0',
        padding: '18px 20px',
        borderRadius: 14,
        border: '1px solid var(--theme-elevation-150)',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <h2 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 700, color: 'var(--theme-text)' }}>
        Mau membuat apa?
      </h2>
      <p style={{ ...BODY_STYLE, marginBottom: 14 }}>
        Pilih jenis halaman yang sesuai. Salah pilih tidak merusak data, tetapi membuat pelacakan iklan
        dan SEO tidak optimal.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <Link href="/admin/collections/pages/create?pageType=info" style={CARD_STYLE}>
          <span style={{ fontSize: 18 }} aria-hidden="true">📄</span>
          <h3 style={TITLE_STYLE}>Halaman Informasi</h3>
          <p style={BODY_STYLE}>
            Tentang Kami, Layanan, Area, Kebijakan Privasi. Tidak ada iklan, fokus pada kelengkapan informasi.
          </p>
        </Link>

        <Link href="/admin/collections/landing-pages/create" style={CARD_STYLE}>
          <span style={{ fontSize: 18 }} aria-hidden="true">🎯</span>
          <h3 style={TITLE_STYLE}>Landing Page Iklan</h3>
          <p style={BODY_STYLE}>
            Promo berbayar (Meta/Google Ads). Punya kode referensi, tombol WhatsApp, dan pelacakan konversi.
          </p>
        </Link>

        <Link href="/admin/collections/page-templates" style={CARD_STYLE}>
          <span style={{ fontSize: 18 }} aria-hidden="true">🧩</span>
          <h3 style={TITLE_STYLE}>Mulai dari Template</h3>
          <p style={BODY_STYLE}>
            Salin susunan halaman yang sudah terbukti. Cocok untuk kampanye baru tanpa mulai dari nol.
          </p>
        </Link>
      </div>

      <p style={{ ...BODY_STYLE, marginTop: 12 }}>
        Bingung? Buka <Link href="/admin/collections/help-center" style={{ color: 'var(--theme-success-600)' }}>Pusat Bantuan</Link>.
      </p>
    </div>
  )
}
```

> Jika `variant` tidak terpakai, hapus prop-nya agar tidak memicu lint. Atau gunakan untuk menyorot kartu aktif (mis. `variant === 'pages'` → border tebal di kartu "Halaman Informasi").

**Registrasi** di `Pages.ts`:

```ts
  admin: {
    ...
    components: {
      beforeList: ['/components/admin/PageTypeGuide#PageTypeGuide'],
    },
  },
```

di `LandingPages.ts` sama. Lalu:

```powershell
npm run generate:importmap --workspace=cms-kala
```

### 11.4 Langkah 3 (opsional, hati-hati) — Prefill `pageType`

Buat `apps/cms/src/components/admin/CreatePagePrefill.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDocumentInfo, useForm } from '@payloadcms/ui'

export function CreatePagePrefill() {
  const params = useSearchParams()
  const { dispatchFields, setModified } = useForm()
  const docInfo = useDocumentInfo()
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    if (docInfo?.id) return // hanya untuk dokumen baru
    done.current = true

    const pageType = params.get('pageType')
    if (pageType !== 'info' && pageType !== 'landing') return

    dispatchFields({ type: 'UPDATE', path: 'pageType', value: pageType })
    // Jangan setModified(true) — nilai ini default, bukan perubahan user.
  }, [params, dispatchFields, docInfo?.id])

  return null
}
```

Daftarkan di `Pages.ts`:

```ts
    components: {
      beforeList: ['/components/admin/PageTypeGuide#PageTypeGuide'],
      edit: {
        beforeDocumentControls: [
          '/components/admin/DeployStatusPill#DeployStatusPill',
          '/components/admin/CreatePagePrefill#CreatePagePrefill',
        ],
      },
    },
```

**Risiko:** komponen ini mengubah form state di halaman create. Bila Payload me-remount komponen, `done` ref bisa reset dan menimpa pilihan user. Karena itu:
- Hanya set sekali per mount.
- Jangan `setModified(true)`.
- Uji: buka create → ubah `pageType` manual → nilai tidak berubah sendiri.

**Bila ragu, lewati langkah ini.** Panduan kartu (11.3) sudah menyelesaikan 80% kebingungan.

### 11.5 Langkah 4 — Dokumentasi

Tambahkan di `docs/sop-operasional.md` bagian **"Membuat Halaman Baru"**:

```markdown
### Membuat Halaman Baru

1. Buka menu **Halaman Website**.
2. Pilih jenis:
   - **Halaman Info** → konten tetap (Tentang Kami, Layanan, Kebijakan).
   - **Landing Page Iklan** → kampanye berbayar (butuh kode referensi & pelacakan).
   - **Template Halaman** → mulai dari susunan yang sudah ada.
3. Isi Judul dan Slug.
4. Klik **Buka Visual Page Builder**.
5. Susun seksi, lalu klik **Simpan Draf** (atau `Ctrl+S`).
6. Periksa pratinjau di panel kanan.
7. Klik **Terbitkan**. Situs akan diperbarui dalam ±90 detik.
```

### 11.6 Kriteria penerimaan

- [ ] Menu menampilkan "Halaman Info" dan "Landing Page Iklan" (bukan dua nama yang mirip).
- [ ] List view kedua koleksi menampilkan kartu panduan 3 pilihan.
- [ ] Ketiga kartu mengarah ke halaman yang benar.
- [ ] Deskripsi koleksi muncul di list view.
- [ ] (Opsional) `?pageType=landing` mengisi field `pageType`.
- [ ] Tidak ada perubahan slug koleksi (`git diff` hanya label/admin/components).

### 11.7 Rollback

Hapus entri `beforeList` + file komponen, kembalikan label lama. Jalankan `generate:importmap`.

---

## 12. WP-9 — Bahasa, Aksesibilitas, Mobile

**Dampak:** istilah campur ("Shopify-Style", "Preview = Versi Tersimpan"), tombol ikon tanpa label, builder tidak ramah tablet.

**Effort:** 0,5 hari. **Risiko:** rendah. **DB:** tidak berubah.

### 12.1 File

| File | Aksi |
|---|---|
| `apps/cms/src/components/admin/builder/BuilderField.tsx` | Teks, `aria-*`, `role="dialog"` |
| `apps/cms/src/components/admin/builder/PreviewFrame.tsx` | Teks, `aria-label` |
| `apps/cms/src/components/admin/builder/useFocusTrap.ts` | **BARU** |
| `apps/cms/src/collections/Pages.ts` | Hapus emoji & "Shopify-Style" |
| `apps/cms/src/collections/LandingPages.ts` | idem |

### 12.2 Penggantian teks

| Lokasi | Sekarang | Menjadi |
|---|---|---|
| `BuilderField` judul kartu | `Shopify-Style Visual Builder` | `Builder Visual Halaman` |
| `BuilderField` tombol | `Tutup & Kembali` | `Tutup` |
| `PreviewFrame` badge | `Preview = Versi Tersimpan` | `Pratinjau = versi tersimpan` |
| `PreviewFrame` loading | `Menghubungkan ke server preview...` | `Menghubungkan ke pratinjau…` |
| `Pages.ts` opsi `editorMode` | `✨ Shopify-Style Visual Builder` | `Builder Visual (disarankan)` |
| `LandingPages.ts` opsi `editorMode` | `✨ Shopify-Style Visual Builder` | `Builder Visual (disarankan)` |
| `Pages.ts` opsi `editorMode` | `📝 Formulir Blok Klasik` | `Formulir Blok Klasik` |

> **Peringatan encoding:** baris opsi berisi emoji. Edit **hanya** bagian teks label dengan tool `edit`, lalu `git diff` untuk memastikan tidak ada karakter rusak. Jangan menyalin-tempel seluruh file dari output PowerShell.

### 12.3 Aksesibilitas

**12.3.1** Portal root — beri peran dialog:

```tsx
    <div
      className="kala-builder-portal fixed inset-0 z-[99999] ..."
      role="dialog"
      aria-modal="true"
      aria-label={`Builder visual: ${title}`}
      ...
```

**12.3.2** Semua tombol ikon wajib punya `aria-label` (sudah dicakup di WP-1 header). Tambahan di `PreviewFrame`:

```tsx
          <button ... aria-label="Muat ulang pratinjau" title="Muat ulang pratinjau">
          <a ... aria-label="Buka pratinjau di tab baru" title="Buka di tab baru">
```

**12.3.3** Focus trap ringan — buat `apps/cms/src/components/admin/builder/useFocusTrap.ts`:

```ts
'use client'

import { useEffect, type RefObject } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return
    const root = ref.current
    if (!root) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const first = root.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      )
      if (nodes.length === 0) return

      const firstNode = nodes[0]
      const lastNode = nodes[nodes.length - 1]

      if (e.shiftKey && document.activeElement === firstNode) {
        e.preventDefault()
        lastNode.focus()
      } else if (!e.shiftKey && document.activeElement === lastNode) {
        e.preventDefault()
        firstNode.focus()
      }
    }

    root.addEventListener('keydown', onKeyDown)
    return () => {
      root.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [ref, active])
}
```

Pakai di `BuilderField`:

```tsx
  const portalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(portalRef, isOpen);
```

dan `ref={portalRef}` pada div portal.

**12.3.4** Badge status `aria-live="polite"` (sudah ada di header WP-1).

**12.3.5** Kontras: ganti `text-slate-500` pada latar terang menjadi `text-slate-600` di `PreviewFrame` (baris 160, 172, 184, 198).

### 12.4 Mobile / tablet

Tambahkan di `BuilderField`, di dalam portal sebelum header:

```tsx
      {isNarrowScreen && !showNarrowOverride && (
        <div className="absolute inset-0 z-[100001] flex items-center justify-center bg-slate-950 p-6">
          <div className="max-w-sm text-center">
            <h2 className="text-base font-bold text-white">Builder lebih nyaman di desktop</h2>
            <p className="mt-2 text-xs text-slate-300">
              Layar Anda lebih sempit dari 1024px. Anda tetap bisa melanjutkan, tetapi panel pengaturan
              akan terasa sempit.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button type="button" onClick={() => setShowNarrowOverride(true)} className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white">
                Tetap Lanjutkan
              </button>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200">
                Kembali ke Formulir
              </button>
            </div>
          </div>
        </div>
      )}
```

dengan:

```tsx
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);
  const [showNarrowOverride, setShowNarrowOverride] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsNarrowScreen(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
```

> Jangan blokir total. `showNarrowOverride` memberi jalan keluar.

### 12.5 Kriteria penerimaan

- [ ] Tidak ada lagi tulisan "Shopify-Style" di UI.
- [ ] Tidak ada emoji di opsi `editorMode`.
- [ ] Tab hanya berputar di dalam builder saat terbuka.
- [ ] Fokus kembali ke tombol pembuka setelah builder ditutup.
- [ ] Semua tombol ikon punya `aria-label` (cek dengan screen reader / inspect).
- [ ] Di lebar 768px muncul peringatan, tombol "Tetap Lanjutkan" berfungsi.
- [ ] Tidak ada karakter rusak (`git diff` bersih dari mojibake).

### 12.6 Rollback

`git revert` commit WP-9.

---

## 13. Matriks Uji

### 13.1 Unit test baru

Buat `apps/cms/tests/ux-polish.test.ts`:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { parseBuilderFieldPath, humanizeBuilderField } from '../src/components/admin/builder/validation-utils'

test('parseBuilderFieldPath: array-level', () => {
  assert.deepEqual(parseBuilderFieldPath('layout'), { rowIndex: null, fieldPath: '' })
})

test('parseBuilderFieldPath: row-level', () => {
  assert.deepEqual(parseBuilderFieldPath('layout.3'), { rowIndex: 3, fieldPath: '' })
})

test('parseBuilderFieldPath: field-level', () => {
  assert.deepEqual(parseBuilderFieldPath('layout.3.title'), { rowIndex: 3, fieldPath: 'title' })
})

test('parseBuilderFieldPath: nested array', () => {
  assert.deepEqual(parseBuilderFieldPath('layout.3.images.0.alt'), {
    rowIndex: 3,
    fieldPath: 'images.0.alt',
  })
})

test('parseBuilderFieldPath: bukan layout', () => {
  assert.equal(parseBuilderFieldPath('title'), null)
  assert.equal(parseBuilderFieldPath('seo.metaTitle'), null)
})

test('humanizeBuilderField: label dikenal', () => {
  assert.equal(humanizeBuilderField('title'), 'Judul')
  assert.equal(humanizeBuilderField('imageAlt'), 'Teks alternatif gambar')
})

test('humanizeBuilderField: fallback camelCase', () => {
  assert.equal(humanizeBuilderField('ctaSecondaryLabel'), 'Cta Secondary Label')
})
```

Tambahkan ke script `test` di `apps/cms/package.json`:

```json
"test": "cross-env NODE_OPTIONS=--no-deprecation tsx --test tests/security-and-parity.test.ts tests/ux-polish.test.ts"
```

### 13.2 Uji manual per WP

| Skenario | WP | Langkah | Hasil yang diharapkan |
|---|---|---|---|
| Simpan dari builder | WP-1 | Buka builder → ubah judul seksi → Simpan Draf | Badge "Tersimpan", reload → perubahan ada |
| Ctrl+S | WP-1 | Tekan Ctrl+S | Simpan tanpa menutup builder |
| Tutup saat kotor | WP-1 | Klik Tutup | Dialog 3 opsi |
| Guard navigasi | WP-1 | Ubah layout → klik menu Articles | Modal "leave without saving" |
| Simpan dokumen baru | WP-1 | Create → isi judul → builder → Simpan Draf | Redirect ke edit view, data ada |
| Error validasi | WP-3 | Kosongkan Judul Hero → Terbitkan | Banner merah menyebut seksi & field |
| Buka field error | WP-3 | Klik "Buka" di banner | Seksi terpilih di sidebar |
| Mode formulir | WP-3 | Klik "Mode Formulir" | Builder tutup, field blocks tampil |
| Preview dokumen baru | WP-2 | Create → builder | Kartu CTA, bukan error |
| Deploy badge | WP-8 | Terbitkan dokumen | Badge "Sedang tayang…" |
| Total dashboard | WP-7 | Buat > 50 artikel | Angka total akurat |
| Link dashboard | WP-7 | Klik "Semua halaman" | Menuju list pages |
| Dark mode | WP-6 | Paksa `data-theme=dark` | Semua teks terbaca |
| Panduan halaman | WP-4 | Buka list Pages | 3 kartu panduan |
| Focus trap | WP-9 | Tekan Tab berulang | Fokus tidak keluar builder |
| Layar sempit | WP-9 | Kecilkan window < 1024px | Peringatan + tombol lanjut |

### 13.3 Regresi wajib (setelah SEMUA WP)

```powershell
npm run sync:builder
npm test --workspace=cms-kala
cd apps/cms; npx tsc --noEmit
npm run build:cms
```

- [ ] Tambah 14 blok → simpan sukses.
- [ ] Terapkan 2 template → simpan sukses.
- [ ] Pilih foto ber-alt → foto + alt tersimpan.
- [ ] Preview auto-refresh setelah simpan.
- [ ] Publikasi → situs berubah dalam ±90 detik.

---

## 14. Rollback & Risiko

### 14.1 Rollback per WP

| WP | Cara rollback | Dampak |
|---|---|---|
| WP-5 | Hapus 1 baris | Tidak ada |
| WP-1 | `git revert` | Tombol simpan hilang, alur lama kembali |
| WP-3 | Hapus render + 2 file | Banner hilang |
| WP-2 | `git revert` | Empty state lama kembali |
| WP-8 | Hapus registrasi + file, regenerate importmap | Badge hilang |
| WP-7 | `git revert` | Angka lama kembali |
| WP-6 | Hapus `theme` / revert | Warna lama kembali |
| WP-4 | Hapus registrasi + file, kembalikan label | Panduan hilang |
| WP-9 | `git revert` | Teks lama kembali |

### 14.2 Risiko

| Risiko | Prob. | Dampak | Mitigasi |
|---|---|---|---|
| `submit` tanpa `action` salah endpoint | Rendah | Simpan gagal | Uji create & edit; jika gagal, bangun `action` eksplisit seperti `SaveDraftButton` |
| `setModified(true)` memicu guard berlebihan | Sedang | Modal muncul saat tidak perlu | Hanya set saat nilai benar-benar berubah; uji undo/redo |
| `useAllFormFields` memperlambat builder | Rendah | UI tersendat | Pantau; pindahkan perhitungan ke dalam `if (submitted)` |
| Dialog konfirmasi tertutup overlay | Rendah | Tidak bisa konfirmasi | Dialog inline (bukan `ConfirmationModal`) |
| Import map tidak di-regenerate | Sedang | Komponen tidak muncul | Selalu jalankan `generate:importmap` |
| Prefill menimpa input user | Sedang | Data salah | Ref guard + hanya di create; opsional |
| Emoji rusak saat edit | Sedang | UI aneh | Edit via `edit` tool, cek `git diff` |
| `totalDocs` tidak tersedia | Rendah | Angka tetap salah | Fallback `docs.length` sudah ada |
| Badge deploy tidak akurat multi-replica | Sedang | Info menyesatkan | Dokumentasikan batasan |

---

## 15. Definition of Done

### Blocker (harus semua ✅)

- [ ] Builder punya **Simpan Draf** + **Terbitkan** di header.
- [ ] `Ctrl/Cmd+S` menyimpan draf.
- [ ] Badge "Belum disimpan" / "Tersimpan HH:mm" akurat.
- [ ] Dialog konfirmasi saat menutup builder yang kotor.
- [ ] Prompt browser saat menutup tab yang kotor.
- [ ] Banner validasi menyebut seksi + field + tombol "Buka".
- [ ] Preview dokumen baru punya CTA simpan.
- [ ] Media bisa dicari via `filename`.
- [ ] `npx tsc --noEmit` exit 0.
- [ ] `npm test --workspace=cms-kala` hijau.
- [ ] `npm run build:cms` sukses.

### Penting (disarankan)

- [ ] Badge deploy muncul di halaman dokumen.
- [ ] Angka total dashboard akurat.
- [ ] Dark mode konsisten (minimal: terkunci terang).
- [ ] Panduan "Mau membuat apa?" di list Pages & Landing Pages.
- [ ] Tidak ada teks "Shopify-Style" di UI.
- [ ] Tombol ikon punya `aria-label`.
- [ ] Peringatan layar sempit.
- [ ] `docs/sop-operasional.md` diperbarui.

### Bukti serah-terima

Lampirkan di PR/issue:

1. Screenshot header builder dengan tombol simpan.
2. Screenshot banner validasi.
3. Screenshot badge deploy.
4. Video/gif 30 detik: buat halaman → builder → simpan → terbitkan → situs berubah.
5. Output `npm test`, `tsc`, `build`.

---

## 16. Checklist Eksekusi

### Persiapan
- [ ] Gate G1–G5 lulus (§1)
- [ ] Putuskan D1–D4 (§0.3)
- [ ] Buat branch: `git checkout -b feat/admin-ux-polish`

### WP-5 (15 menit)
- [ ] Tambah `listSearchableFields: ['alt', 'filename', 'caption']`
- [ ] Uji cari via nama file
- [ ] Commit: `feat(admin-ux): search media by filename`

### WP-1 (1,5–2 hari)
- [ ] Buat `useBuilderSave.ts`
- [ ] Tambah `setModified(true)` di update layout & undo/redo
- [ ] Hapus state `hasUnsavedChanges`, pakai `useFormModified()`
- [ ] Ganti header (tombol simpan/terbit/tutup)
- [ ] Tambah shortcut `Ctrl/Cmd+S`
- [ ] Tambah dialog konfirmasi tutup
- [ ] Tambah tombol simpan di kartu formulir
- [ ] Teruskan props baru ke `PreviewFrame`
- [ ] Uji 11 edge case (§5.5)
- [ ] Commit: `feat(admin-ux): save & publish inside visual builder`

### WP-3 (0,5–1 hari)
- [ ] Buat `validation-utils.ts`
- [ ] Buat `BuilderValidationBanner.tsx`
- [ ] Render banner + handler mode formulir
- [ ] Tambah unit test parser
- [ ] Commit: `feat(admin-ux): validation banner in builder`

### WP-2 (0,25 hari)
- [ ] Tambah props `onSaveDraft` dkk
- [ ] Ganti empty state
- [ ] Perbaiki error state + "Coba Lagi"
- [ ] Commit: `feat(admin-ux): save-draft CTA in empty preview`

### WP-8 (0,5 hari)
- [ ] Buat `DeployStatusPill.tsx`
- [ ] Daftarkan di Pages & LandingPages
- [ ] `npm run generate:importmap --workspace=cms-kala`
- [ ] Uji terbitkan → badge berubah
- [ ] Commit: `feat(admin-ux): deploy status badge on document header`

### WP-7 (0,5 hari)
- [ ] Ganti query (`overrideAccess: false` + `user`)
- [ ] Pakai `totalDocs`
- [ ] Perbaiki 3 teks klaim
- [ ] Perbaiki link
- [ ] Sentralisasi filter dokumen uji
- [ ] Commit: `fix(admin): accurate dashboard totals and links`

### WP-6 (0,5 hari / +1,5 hari)
- [ ] Fase A: `theme: 'light'`
- [ ] Fase B: buat `kala-dashboard.scss`
- [ ] Fase B: tambah `className="kala-dashboard"`
- [ ] Fase B: ganti warna netral
- [ ] Fase B: gradient hero
- [ ] Fase B: `theme: 'all'`
- [ ] Uji kedua tema
- [ ] Commit: `feat(admin-ux): theme-aware dashboard`

### WP-4 (1 hari)
- [ ] Rename label Pages & LandingPages
- [ ] Tambah `admin.description`
- [ ] Buat `PageTypeGuide.tsx`
- [ ] Daftarkan `beforeList`
- [ ] `npm run generate:importmap --workspace=cms-kala`
- [ ] (Opsional) `CreatePagePrefill`
- [ ] Update `docs/sop-operasional.md`
- [ ] Commit: `feat(admin-ux): unify page creation concepts`

### WP-9 (0,5 hari)
- [ ] Ganti teks campur bahasa
- [ ] Hapus emoji dari opsi `editorMode`
- [ ] Tambah `role="dialog"`, `aria-label`
- [ ] Buat `useFocusTrap.ts` + pasang
- [ ] Perbaiki kontras `text-slate-500`
- [ ] Tambah peringatan layar sempit
- [ ] Commit: `feat(admin-ux): language consistency and accessibility`

### Penutup
- [ ] Jalankan semua regresi (§13.3)
- [ ] Update `docs/runbook-teknis.md` (batasan status deploy)
- [ ] Kumpulkan bukti (§15)
- [ ] Merge + deploy
- [ ] Ukur ulang skor UX (target ≥ 8,5/10)

---

## 17. Lampiran

### 17.1 Peta file lengkap

| File | WP | Status |
|---|---|---|
| `apps/cms/src/collections/Media.ts` | 5 | ubah |
| `apps/cms/src/components/admin/builder/useBuilderSave.ts` | 1 | baru |
| `apps/cms/src/components/admin/builder/BuilderField.tsx` | 1, 3, 9 | ubah |
| `apps/cms/src/components/admin/builder/validation-utils.ts` | 3 | baru |
| `apps/cms/src/components/admin/builder/BuilderValidationBanner.tsx` | 3 | baru |
| `apps/cms/src/components/admin/builder/PreviewFrame.tsx` | 2, 9 | ubah |
| `apps/cms/src/components/admin/builder/useFocusTrap.ts` | 9 | baru |
| `apps/cms/src/components/admin/DeployStatusPill.tsx` | 8 | baru |
| `apps/cms/src/components/admin/PageTypeGuide.tsx` | 4 | baru |
| `apps/cms/src/components/admin/CreatePagePrefill.tsx` | 4 | baru (opsional) |
| `apps/cms/src/components/admin/CustomDashboard.tsx` | 6, 7 | ubah |
| `apps/cms/src/app/(payload)/kala-dashboard.scss` | 6 | baru |
| `apps/cms/src/app/(payload)/custom.scss` | 6 | ubah |
| `apps/cms/src/collections/Pages.ts` | 4, 8, 9 | ubah |
| `apps/cms/src/collections/LandingPages.ts` | 4, 8, 9 | ubah |
| `apps/cms/src/collections/Articles.ts` | 8 | ubah (opsional) |
| `apps/cms/src/payload.config.ts` | 6 | ubah |
| `apps/cms/tests/ux-polish.test.ts` | 3 | baru |
| `apps/cms/package.json` | 3 | ubah (script test) |
| `docs/sop-operasional.md` | 4 | ubah |
| `docs/runbook-teknis.md` | 8 | ubah |
| `apps/cms/src/app/(payload)/admin/importMap.js` | 4, 8 | generated |

### 17.2 Perintah cepat

```powershell
# Dev
npm run dev:cms

# Type-check
cd apps/cms; npx tsc --noEmit

# Test
npm test --workspace=cms-kala

# Build
npm run build:cms

# Import map
npm run generate:importmap --workspace=cms-kala

# Parity builder
npm run sync:builder

# Cek sisa warna hardcoded
rg -n "#[0-9a-fA-F]{6}" apps/cms/src/components/admin/CustomDashboard.tsx

# Cek preview produksi (harus 401)
curl.exe -s -o NUL -w "%{http_code}\n" https://kalababyspa.com/preview/zzz
```

### 17.3 Referensi kode Payload (untuk verifikasi ulang)

| Topik | Path |
|---|---|
| `submit` & `setModified` | `node_modules/@payloadcms/ui/dist/forms/Form/types.d.ts` |
| Perilaku submit (return value) | `node_modules/@payloadcms/ui/dist/forms/Form/index.js:205-430` |
| Save Draft | `node_modules/@payloadcms/ui/dist/elements/SaveDraftButton/index.js:70` |
| Publish | `node_modules/@payloadcms/ui/dist/elements/PublishButton/index.js:159` |
| `useAllFormFields` | `node_modules/@payloadcms/ui/dist/forms/Form/context.d.ts` |
| Document info | `node_modules/@payloadcms/ui/dist/providers/DocumentInfo/types.d.ts` |
| ConfirmationModal | `node_modules/@payloadcms/ui/dist/elements/ConfirmationModal/index.js` |
| LeaveWithoutSaving | `node_modules/@payloadcms/ui/dist/elements/LeaveWithoutSaving/index.js` |

### 17.4 Yang **tidak** boleh dilakukan

| Larangan | Alasan |
|---|---|
| ❌ Memakai `ConfirmationModal` Payload di dalam portal | Modal muncul di belakang overlay (container berbeda) |
| ❌ Menulis `beforeunload` sendiri | Duplikasi dengan `LeaveWithoutSaving`, bisa memicu prompt ganda |
| ❌ Menghapus `skipValidation` pada simpan draf | Draf harus bisa disimpan meski belum lengkap |
| ❌ Memanggil `submit({ action })` dengan URL manual | Rawan salah pada create vs edit |
| ❌ Mengganti `color: '#ffffff'` menjadi `var(--kala-surface)` | Teks putih pada tombol berwarna jadi tak terbaca |
| ❌ Mengubah `slug` koleksi | Merusak URL admin, API, dan data relasi |
| ❌ Menambah kolom DB / field baru pada `layout` | Melanggar prinsip tanpa migrasi |
| ❌ Mengaktifkan autosave | Melanggar keputusan arsitektur |
| ❌ Commit beberapa WP sekaligus | Rollback jadi tidak mungkin granular |

---

**Selesai.** Ikuti urutan §16, jangan lewati gate §1, dan jalankan `npx tsc --noEmit` setelah setiap WP.
