export const prerender = false;

export const GET = async ({ locals }: { locals: any }) => {
  const runtime = locals?.runtime;
  const env = runtime?.env || {};

  return new Response(
    JSON.stringify({
      hasRuntime: Boolean(runtime),
      hasRuntimeEnv: Boolean(runtime?.env),
      hasPreviewSecret: Boolean(env.PREVIEW_SECRET),
      hasPreviewApiKey: Boolean(env.PREVIEW_API_KEY),
      hasPayloadUrl: Boolean(env.PAYLOAD_URL),
      envKeys: Object.keys(env).sort(),
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
