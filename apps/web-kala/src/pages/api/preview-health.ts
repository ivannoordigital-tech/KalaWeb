export const prerender = false;

const CMS_URL = 'https://admin.kalababyspa.com';

/**
 * Diagnostik pratinjau.
 *
 * Sejak preview memakai pola "CMS proxy", Worker TIDAK membutuhkan
 * PREVIEW_SECRET / PREVIEW_API_KEY. Endpoint ini memastikan CMS dapat
 * dihubungi dan endpoint verifikasi token merespons dengan benar.
 */
export const GET = async () => {
  let cmsReachable = false;
  let cmsStatus = 0;

  try {
    const res = await fetch(`${CMS_URL}/api/preview-draft?token=healthcheck`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    cmsStatus = res.status;
    // 401 = CMS hidup dan menolak token palsu (perilaku yang benar).
    cmsReachable = res.status < 500;
  } catch {
    cmsReachable = false;
  }

  return new Response(
    JSON.stringify({
      mode: 'cms-proxy',
      cmsUrl: CMS_URL,
      cmsReachable,
      cmsStatus,
      requiresWorkerPreviewSecrets: false,
    }),
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex, nofollow',
      },
    },
  );
};
