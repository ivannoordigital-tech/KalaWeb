# RFC: Fondasi Otomasi & Model Konteks Agen (MCP) KalaWeb
**ID:** RFC-AUT-001  
**Status:** Approved / Accepted  
**Tanggal:** November 2026  
**Penulis:** Tim Engineering & AI Systems KalaWeb  

---

## 1. Latar Belakang & Masalah

Sebelum pembaruan ini, seluruh integrasi otomatisasi (AI agent, bot pemesanan, atau workflow n8n) berisiko karena:
1. **Tidak Ada Boundary / Least Privilege:** Agen yang diberikan API key admin Payload CMS dapat tanpa sengaja mengubah tarif layanan medis, mengubah halaman landing page aktif, atau bahkan mengubah peran pengguna.
2. **Ketiadaan Idempotency:** Jika request jaringan bot mengalami timeout dan di-retry, sistem berpotensi membuat artikel atau testimoni duplikat.
3. **Bypass Validasi Medis:** Penulisan langsung via REST API Payload mentah berisiko meloloskan klaim terlarang (*Permenkes No. 1787/2010*) seperti "dijamin sembuh" atau "pasti aman".
4. **Format Lexical AST Rumit:** AI Agent sering kali menghasilkan Markdown teks biasa, bukan AST pohon Lexical JSON yang rumit dan rentan error parsing.

---

## 2. Prinsip Desain (Guiding Principles)

1. **Service Perantara (Gateway) + Model Context Protocol (MCP):**
   Agen AI **TIDAK** mengakses database PostgreSQL secara langsung. Agen berinteraksi melalui service otomasi (`apps/automation`) atau MCP server terisolasi dengan kontrak Zod yang terdefinisi ketat.
2. **Least Privilege (Peran `automation`):**
   Agen menggunakan API Key ber-role `automation`. Role ini hanya memiliki izin `create`/`update` untuk artikel dalam status `draft` dan membaca layanan, FAQ, serta area. Perubahan harga, halaman landing page, dan akun staf bidan mutlak **DITOLAK (403 Forbidden)**.
3. **Idempotency Wajib (Header `Idempotency-Key`):**
   Setiap operasi tulis (create/update) menyertakan `Idempotency-Key` unik berbasis UUID atau hash payload. Jika permintaan diulang dengan kunci yang sama, server mengembalikan respon yang telah di-cache tanpa mengeksekusi tulis ulang.
4. **Dry-Run Validation Sebelum Commit:**
   Setiap alat tulis mendukung flag `--dry-run` atau validasi via endpoint `/api/validate` untuk mendeteksi pelanggaran Permenkes sebelum disimpan.
5. **Audit Trail Lengkap:**
   Setiap tindakan agen dicatat dengan identitas `actor: 'agent:kala-bot'`, timestamp ISO, IP asal, payload hash, dan perubahan data (before/after).

---

## 3. Matriks 12 Tool Kontrak Zod

| No | Nama Tool MCP | Metode | Deskripsi | Hak Akses |
|---|---|---|---|---|
| 1 | `get_articles` | Read | Mengambil daftar artikel dengan filter kategori, status, dan pagination | Publik / Auth |
| 2 | `get_article_by_slug` | Read | Mengambil artikel detail berdasarkan slug unik | Publik / Auth |
| 3 | `create_article` | Write (Idempotent) | Membuat draf artikel baru dari Markdown dengan sanitasi klaim medis | Role `automation` |
| 4 | `update_article` | Write (Idempotent) | Memperbarui isi draf artikel atau metadata SEO | Role `automation` |
| 5 | `validate_content` | Dry-run | Memvalidasi teks artikel/halaman terhadap Permenkes 1787 & panjang kata | Any User |
| 6 | `get_services` | Read | Mengambil daftar katalog paket perawatan homecare & tarif resmi | Publik / Auth |
| 7 | `get_service_areas` | Read | Mengambil daftar jangkauan kecamatan, kota, dan estimasi waktu tiba | Publik / Auth |
| 8 | `get_faq` | Read | Mengambil daftar tanya-jawab resmi klinik Kala | Publik / Auth |
| 9 | `upload_media` | Write | Mengunggah gambar/PDF dengan teks alt wajib dan menghasilkan URL CDN absolut | Role `automation` |
| 10 | `get_seo_audit` | Read | Menghitung skor kesehatan SEO substantif & daftar rekomendasi perbaikan | Auth |
| 11 | `trigger_deploy` | Write | Memicu antrean build Cloudflare Pages dengan alasan trigger terverifikasi | Operator / Bot |
| 12 | `get_deploy_status` | Read | Memeriksa status build nyata di Cloudflare Pages (queued/building/success/failed) | Auth |

---

## 4. Arsitektur Idempotency

```
Client / Agent AI
      │
      │ 1. POST /api/tools/create_article
      │    Header: Idempotency-Key: uuid-v4-1234
      ▼
Idempotency Middleware
      ├── Cek Cache: Apakah Idempotency-Key sudah pernah dieksekusi?
      │     ├── YA: Kembalikan cached response (HTTP 200) tanpa panggil DB
      │     └── TIDAK: Lanjutkan ke Tool Handler
      ▼
Tool Handler & Guard Permenkes 1787
      ├── Validasi skema Zod
      ├── Deteksi kata klaim terlarang ("pasti sembuh", "100% aman")
      │     └── Jika ada: Tolak dengan HTTP 422 (FORBIDDEN_MEDICAL_CLAIM)
      ▼
Payload CMS Core (Database Write)
      ├── Simpan dokumen (status: 'draft')
      ├── Catat ke Audit Trail (Actor, Action, Diff)
      └── Simpan response ke Idempotency Cache
```

---

## 5. Model Keamanan & HMAC Outbound Webhook

Ketika artikel diterbitkan atau proses deploy Cloudflare selesai, webhook keluar dikirim ke endpoint konsumen (misal n8n, Slack, atau CRM) dengan tanda tangan kriptografis HMAC-SHA256:

```http
POST /webhook/content-published
X-Kala-Signature: sha256=a1b2c3d4e5f6...
X-Kala-Timestamp: 1730628000
Content-Type: application/json

{
  "event": "content.published",
  "resource": "Articles",
  "slug": "bayi-kolik-malam-hari",
  "title": "Panduan Bidan Mengatasi Bayi Kolik",
  "publishedAt": "2026-11-03T10:00:00Z"
}
```

Penerima memverifikasi keaslian webhook menggunakan shared secret:
`crypto.createHmac('sha256', WEBHOOK_SECRET).update(timestamp + '.' + rawBody).digest('hex')`.

---

## 6. Kesimpulan & Status Implementasi

Arsitektur ini memastikan agen AI bekerja secara aman, terukur, dan tidak dapat merusak data kritis rumah produksi KalaWeb. Implementasi kode berada di paket `apps/automation`.
