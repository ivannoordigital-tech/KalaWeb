import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

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
import { SiteSettings } from './globals/SiteSettings'
import { getDeployStatus } from './utilities/triggerDeployHook'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Proteksi Secret: Wajib ada di runtime production, tapi jangan memblokir next build di CI/Docker
const isBuildPhase =
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.npm_lifecycle_event === 'build' ||
  process.argv.some((arg) => arg.includes('next') && arg.includes('build'))

const payloadSecret =
  process.env.PAYLOAD_SECRET ||
  (isBuildPhase
    ? 'KALA_CMS_TEMPORARY_BUILD_SECRET_2026'
    : process.env.NODE_ENV !== 'production'
      ? 'KALA_BABY_SPA_SECRET_KEY_DEV_ONLY_2026'
      : undefined)

if (!payloadSecret && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: PAYLOAD_SECRET environment variable is required at runtime in production.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  endpoints: [
    {
      path: '/deploy-status',
      method: 'get',
      handler: () => {
        return Response.json(getDeployStatus())
      },
    },
  ],
  collections: [
    HelpCenter,
    LandingPages,
    PageTemplates,
    BlockTemplates,
    Pages,
    Services,
    Midwives,
    ServiceAreas,
    Testimonials,
    FAQ,
    Articles,
    Media,
    Redirects,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: payloadSecret as string,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    push: true,
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgresql://kala_cms_user:postgres@127.0.0.1:5432/kala_cms_db',
      connectionTimeoutMillis: 10000,
    },
  }),
})
