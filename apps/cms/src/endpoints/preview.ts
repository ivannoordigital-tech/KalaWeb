import type { Endpoint } from 'payload';
import { SignJWT } from 'jose';
import { getUserRole } from '../access/roles';

const ALLOWED_ROLES = ['superadmin', 'operator', 'marketing', 'seo'];

/**
 * Helper to generate signed preview token and redirect URL
 */
async function generatePreviewData(req: any) {
  if (!req.user) {
    return { error: 'Unauthorized: Sesi login CMS diperlukan.', status: 401 };
  }

  const role = getUserRole(req.user);
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

    const secret = process.env.PREVIEW_SECRET || 'kala_preview_secret_fallback_key_2026';
    const key = new TextEncoder().encode(secret);

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
    const prefix = collection === 'landing-pages' ? '/preview/sales' : '/preview';
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
];
