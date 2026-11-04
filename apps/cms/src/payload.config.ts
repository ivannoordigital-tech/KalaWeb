import { id } from '@payloadcms/translations/languages/id'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { EXPERIMENTAL_TableFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import crypto from 'crypto'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { FAQ } from './collections/FAQ'
import { ServiceAreas } from './collections/ServiceAreas'
import { Midwives } from './collections/Midwives'
import { Redirects } from './collections/Redirects'
import { LandingPages } from './collections/LandingPages'
import { Pages } from './collections/Pages'
import { BlockTemplates } from './collections/BlockTemplates'
import { PageTemplates } from './collections/PageTemplates'
import { HelpCenter } from './collections/HelpCenter'
import { Deployments } from './collections/Deployments'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'
import { getDeployStatus, fetchRealCloudflareDeployStatus } from './utilities/triggerDeployHook'
import { getUserRole } from './access/roles'
import { validatePageBuilderDoc, validateArticleDoc, type ValidationResult } from './utilities/pageBuilderValidators'
import { previewEndpoints } from './endpoints/preview'
import { s3Storage } from '@payloadcms/storage-s3'

// MED-002: Cloudflare R2 Storage Adapter configuration
const isR2Configured = Boolean(
  process.env.R2_BUCKET &&
  process.env.R2_ENDPOINT &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY
)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Proteksi Secret & Environment Variables:
const isBuildPhase =
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.npm_lifecycle_event === 'build' ||
  Boolean(process.env.npm_lifecycle_event?.includes('generate')) ||
  process.argv.some((arg) => arg.includes('generate')) ||
  process.argv.some((arg) => arg.includes('next') && arg.includes('build'))

const payloadSecret =
  process.env.PAYLOAD_SECRET ||
  (isBuildPhase
    ? crypto.randomBytes(32).toString('hex')
    : process.env.NODE_ENV !== 'production'
      ? 'dev-insecure-secret-key-change-in-env-file-min32'
      : undefined)

if (!payloadSecret && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: PAYLOAD_SECRET environment variable is required at runtime in production.')
}

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://admin.kalababyspa.com'
    : 'http://localhost:3005')

if (!process.env.NEXT_PUBLIC_SERVER_URL && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ PERINGATAN: NEXT_PUBLIC_SERVER_URL tidak diset di env, menggunakan default https://admin.kalababyspa.com')
}

const databaseUri =
  process.env.DATABASE_URI ||
  (isBuildPhase
    ? 'postgresql://placeholder:placeholder@127.0.0.1:5432/kala_cms_placeholder'
    : undefined)

if (!databaseUri) {
  throw new Error('FATAL: DATABASE_URI environment variable is required. Pastikan DATABASE_URI sudah dikonfigurasi di file .env Anda.')
}

export default buildConfig({
  serverURL,
  cors: [
    'https://kalababyspa.com',
    'http://localhost:4321',
    'http://localhost:3000',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  csrf: [
    'https://kalababyspa.com',
    'http://localhost:4321',
    'http://localhost:3000',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        dashboard: {
          Component: '/components/admin/CustomDashboard#CustomDashboard',
        },
      },
    },
    meta: {
      titleSuffix: ' — Kala Moms and Baby Spa Admin',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/favicon.svg',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          url: '/favicon-32x32.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          url: '/apple-touch-icon.png',
        },
      ],
      openGraph: {
        images: [
          {
            url: '/images/og-kala-homecare.png',
            width: 1200,
            height: 630,
            alt: 'Kala Moms and Baby Spa Admin',
          },
        ],
      },
    },
  },
  endpoints: [
    ...previewEndpoints,
    // ED-002: Endpoint validasi dry-run untuk UI & agent tanpa menyimpan ke database
    {
      path: '/validate',
      method: 'post',
      handler: async (req) => {
        try {
          let body: any = {}
          if (typeof req.json === 'function') {
            body = await req.json()
          }
          const { collection, data } = body || {}
          if (!collection || !data) {
            return Response.json(
              { error: 'Bad Request: parameter collection dan data wajib disertakan.' },
              { status: 400 }
            )
          }

          let result: ValidationResult
          if (collection === 'pages' || collection === 'landing-pages') {
            result = validatePageBuilderDoc(data, collection === 'landing-pages')
          } else if (collection === 'articles') {
            result = validateArticleDoc(data)
          } else {
            result = { isValid: true, errors: [], fieldErrors: [], warnings: [] }
          }

          return Response.json({
            valid: result.isValid,
            errors: result.errors,
            fieldErrors: result.fieldErrors,
            warnings: result.warnings,
          })
        } catch (err: any) {
          return Response.json(
            { error: 'Validation Handler Error: ' + err.message },
            { status: 500 }
          )
        }
      },
    },
    // PRV-001: Endpoint pratinjau bertoken untuk draft CMS dengan CORS terproteksi
    {
      path: '/preview',
      method: 'get',
      handler: async (req: any) => {
        const url = new URL(req.url, 'http://localhost');
        const token = url.searchParams.get('token');
        const collection = url.searchParams.get('collection');
        const slug = url.searchParams.get('slug');

        const expectedSecret = process.env.PREVIEW_SECRET || process.env.PAYLOAD_SECRET;
        const isAuthorized = Boolean(req.user) || (Boolean(expectedSecret) && token === expectedSecret);

        if (!isAuthorized) {
          return Response.json(
            { error: 'Unauthorized: Pratinjau draf memerlukan autentikasi login atau preview token yang sah.' },
            { status: 401 }
          );
        }

        if (!collection || !slug) {
          return Response.json(
            { error: 'Bad Request: Parameter collection dan slug wajib disertakan.' },
            { status: 400 }
          );
        }

        // Whitelist koleksi agar endpoint tidak dapat dipakai membaca koleksi sensitif (users, dsb).
        const PREVIEWABLE_COLLECTIONS = new Set([
          'articles',
          'pages',
          'services',
          'service-areas',
          'landing-pages',
        ]);
        if (!PREVIEWABLE_COLLECTIONS.has(collection)) {
          return Response.json(
            { error: `Forbidden: Koleksi "${collection}" tidak diizinkan untuk pratinjau.` },
            { status: 403 }
          );
        }

        try {
          const res = await req.payload.find({
            collection,
            where: { slug: { equals: slug } },
            draft: true,
            limit: 1,
            overrideAccess: true,
          });

          const doc = res.docs?.[0];
          if (!doc) {
            return Response.json(
              { error: `Not Found: Dokumen dengan slug "${slug}" di koleksi "${collection}" tidak ditemukan.` },
              { status: 404 }
            );
          }

          return Response.json({ success: true, doc });
        } catch (err: any) {
          return Response.json({ error: err.message }, { status: 500 });
        }
      },
    },
    {
      path: '/deploy-status',
      method: 'get',
      handler: async (req) => {
        if (!req.user) {
          return Response.json(
            { error: 'Unauthorized: Akses ditolak. Silakan login ke dashboard CMS.' },
            { status: 401 }
          )
        }
        await fetchRealCloudflareDeployStatus((req as any).payload);
        return Response.json(getDeployStatus());
      },
    },
    // AUT-008: HTTP Server Gateway untuk OpenAPI & Agen AI
    {
      path: '/tools/:tool',
      method: 'post',
      handler: async (req: any) => {
        const userRole = getUserRole(req.user);
        if (!req.user || (userRole !== 'superadmin' && userRole !== 'operator' && userRole !== 'automation')) {
          return Response.json(
            { error: 'Forbidden: Endpoint tools otomasi hanya dapat diakses oleh akun agen berizin (role: automation/operator/superadmin).' },
            { status: 403 }
          );
        }
        const toolName = req.routeParams?.tool;
        let body: any = {};
        try {
          if (typeof req.json === 'function') body = await req.json();
        } catch (e) {}

        const ctx = {
          actor: req.user.email || 'agent:api',
          ip: (typeof req.headers?.get === 'function' ? req.headers.get('x-forwarded-for') : '') || '127.0.0.1',
          payloadInstance: req.payload,
        };

        try {
          const { toolService } = await import('../../automation/dist/services/toolService.js');
          if (toolName === 'get_articles') return Response.json(await toolService.getArticles(body, ctx));
          if (toolName === 'get_article_by_slug') return Response.json(await toolService.getArticleBySlug(body, ctx));
          if (toolName === 'create_article') return Response.json(await toolService.createArticle(body, ctx));
          if (toolName === 'update_article') return Response.json(await toolService.updateArticle(body, ctx));
          if (toolName === 'validate_content') return Response.json(await toolService.validateContent(body));
          if (toolName === 'get_services') return Response.json(await toolService.getServices(body, ctx));
          if (toolName === 'get_service_areas') return Response.json(await toolService.getServiceAreas(body, ctx));
          if (toolName === 'get_faq') return Response.json(await toolService.getFaq(body, ctx));
          if (toolName === 'upload_media') return Response.json(await toolService.uploadMedia(body, ctx));
          if (toolName === 'get_seo_audit') return Response.json(await toolService.getSeoAudit(body));
          if (toolName === 'trigger_deploy') return Response.json(await toolService.triggerDeploy(body, ctx));
          if (toolName === 'get_deploy_status') return Response.json(await toolService.getDeployStatus(body, ctx));

          return Response.json({ error: 'Tool "' + toolName + '" tidak ditemukan.' }, { status: 404 });
        } catch (err: any) {
          return Response.json({ error: err.message }, { status: 500 });
        }
      },
    },
  ],
  plugins: [
    ...(isR2Configured
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'media',
                generateFileURL: ({ filename, prefix }) => {
                  const cdnBase = (process.env.MEDIA_PUBLIC_URL || process.env.MEDIA_CDN_URL || '').replace(/\/+$/, '')
                  if (cdnBase) {
                    return `${cdnBase}/${prefix ? `${prefix}/` : ''}${filename}`
                  }
                  return undefined as any
                },
              },
            },
            bucket: process.env.R2_BUCKET!,
            config: {
              endpoint: process.env.R2_ENDPOINT!,
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
              },
              region: 'auto',
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
  collections: [
    // 1. Konten & Blog (Paling sering digunakan harian)
    Articles,
    Media,

    // 2. Halaman Website & Penawaran
    Pages,
    LandingPages,
    PageTemplates,
    BlockTemplates,

    // 3. Layanan & Klinik
    Services,
    Midwives,
    ServiceAreas,
    Testimonials,
    FAQ,

    // 4. Pengaturan & Bantuan
    Deployments,
    Redirects,
    HelpCenter,
    Users,
  ],
  globals: [SiteSettings],
  i18n: {
    fallbackLanguage: 'id',
    supportedLanguages: { id },
    translations: {
      id: {
        version: {
          publishChanges: 'Terbitkan',
          publish: 'Terbitkan',
          publishing: 'Menerbitkan...',
          draftSavedSuccessfully: 'Draf berhasil disimpan.',
          autosavedSuccessfully: 'Otomatis tersimpan.',
        } as any,
      },
    },
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // Tabel diperlukan untuk artikel medis (perbandingan langkah/manfaat).
      // Fitur ini masih ditandai eksperimental oleh Payload, tetapi sudah stabil
      // untuk kebutuhan editor sederhana dan mendukung konversi Markdown.
      EXPERIMENTAL_TableFeature(),
    ],
    admin: {
      placeholder:
        'Mulai menulis konten di sini... (Tekan "/" untuk opsi format teks, subjudul, daftar poin, tabel, atau kutipan)',
    },
  }),
  secret: payloadSecret as string,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
  db: postgresAdapter({
    push: false,
    prodMigrations: migrations,
    pool: {
      connectionString: databaseUri,
      connectionTimeoutMillis: 10000,
    },
  }),
})
