import type { Endpoint } from 'payload';
import { SignJWT, jwtVerify } from 'jose';
import { getUserRole } from '../access/roles';

// Role `preview` sengaja TIDAK ada di sini: akun mesin tidak boleh membuat token preview.
const ALLOWED_ROLES = ['superadmin', 'operator', 'marketing', 'seo'];

/**
 * Helper to generate signed preview token and redirect URL
 */
async function generatePreviewData(req: any) {
  let user = req.user;
  if (!user && req.payload?.auth) {
    try {
      const authResult = await req.payload.auth({ headers: req.headers });
      user = authResult?.user || null;
    } catch {}
  }

  if (!user) {
    return { error: 'Unauthorized: Sesi login CMS diperlukan.', status: 401 };
  }

  const role = getUserRole(user);
  if (!role || !ALLOWED_ROLES.includes(role)) {
    return { error: 'Forbidden: Peran Anda tidak memiliki hak akses preview.', status: 403 };
  }

  const url = new URL(req.url, 'http://localhost:3000');
  const collection = url.searchParams.get('collection') as 'landing-pages' | 'pages';
  const id = url.searchParams.get('id');

  if (!collection || !id) {
    return { error: 'Bad Request: Parameter collection dan id wajib disertakan.', status: 400 };
  }

  if (collection !== 'landing-pages' && collection !== 'pages') {
    return { error: 'Bad Request: Koleksi hanya boleh landing-pages atau pages.', status: 400 };
  }

  try {
    const doc = await req.payload.findByID({
      collection,
      id,
      draft: true,
      depth: 0,
    });

    if (!doc || !doc.slug) {
      return { error: 'Dokumen tidak ditemukan atau belum memiliki slug.', status: 404 };
    }

    const secret = process.env.PREVIEW_SECRET;
    if (!secret || secret.trim().length < 32) {
      return {
        error: 'Konfigurasi server error: PREVIEW_SECRET wajib disetel minimal 32 karakter di environment CMS.',
        status: 500,
      };
    }
    const key = new TextEncoder().encode(secret.trim());

    const token = await new SignJWT({
      sub: String(doc.id),
      collection,
      slug: doc.slug,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('kala-cms')
      .setAudience('kala-preview')
      .setExpirationTime('15m')
      .sign(key);

    const baseUrl = process.env.PREVIEW_BASE_URL || 'http://localhost:4321';
    const isLandingPage =
      collection === 'landing-pages' || (collection === 'pages' && doc.pageType === 'landing');
    const prefix = isLandingPage ? '/editor-view/sales' : '/editor-view';
    const previewUrl = `${baseUrl}${prefix}/${doc.slug}?token=${token}`;

    return { previewUrl, token, doc };
  } catch (err) {
    return { error: `Gagal memproses dokumen: ${(err as Error).message}`, status: 500 };
  }
}

export const previewEndpoints: Endpoint[] = [
  {
    path: '/preview-token',
    method: 'get',
    handler: async (req) => {
      const result = await generatePreviewData(req);
      if ('error' in result) {
        return new Response(JSON.stringify({ error: result.error }), {
          status: result.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return Response.json({
        url: result.previewUrl,
        token: result.token,
        slug: result.doc.slug,
        id: result.doc.id,
      });
    },
  },
  {
    path: '/preview-redirect',
    method: 'get',
    handler: async (req) => {
      const result = await generatePreviewData(req);
      if ('error' in result) {
        return new Response(result.error, { status: result.status });
      }
      return Response.redirect(result.previewUrl, 302);
    },
  },
  {
    /**
     * Proxy data draft untuk website preview.
     *
     * Website hanya mengirim token preview yang sudah ditandatangani CMS.
     * CMS yang memverifikasi token dan mengambil draft, sehingga Worker tidak
     * perlu menyimpan PREVIEW_SECRET / PREVIEW_API_KEY sama sekali.
     */
    path: '/preview-draft',
    method: 'get',
    handler: async (req) => {
      const json = (body: unknown, status = 200) =>
        new Response(JSON.stringify(body), {
          status,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'X-Robots-Tag': 'noindex, nofollow',
          },
        });

      const url = new URL(req.url, 'http://localhost:3000');
      const token = url.searchParams.get('token');

      if (!token) {
        return json({ error: 'Token pratinjau tidak disertakan.' }, 401);
      }

      const secret = process.env.PREVIEW_SECRET;
      if (!secret || secret.trim().length < 32) {
        return json({ error: 'PREVIEW_SECRET belum disetel di CMS.' }, 500);
      }

      let payload: { sub?: string; collection?: string };
      try {
        const verified = await jwtVerify(token, new TextEncoder().encode(secret.trim()), {
          issuer: 'kala-cms',
          audience: 'kala-preview',
        });
        payload = verified.payload as { sub?: string; collection?: string };
      } catch {
        return json({ error: 'Token pratinjau tidak valid atau sudah kedaluwarsa.' }, 401);
      }

      const collection = payload.collection;
      const id = payload.sub;

      if (!id || (collection !== 'pages' && collection !== 'landing-pages')) {
        return json({ error: 'Token pratinjau tidak lengkap.' }, 400);
      }

      try {
        const doc = await req.payload.findByID({
          collection,
          id,
          draft: true,
          depth: 3,
          overrideAccess: true,
        });

        if (!doc) {
          return json({ error: 'Dokumen draft tidak ditemukan.' }, 404);
        }

        return json({ doc });
      } catch (err) {
        return json({ error: `Gagal mengambil draft: ${(err as Error).message}` }, 502);
      }
    },
  },
];
