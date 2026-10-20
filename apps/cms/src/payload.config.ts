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
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Articles,
    Services,
    Testimonials,
    FAQ,
    ServiceAreas,
    Midwives,
    Redirects,
    LandingPages,
    Pages,
    BlockTemplates,
    PageTemplates,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'KALA_BABY_SPA_SECRET_KEY_PROD_2026',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgresql://postgres:postgres@127.0.0.1:5432/kala_cms_db',
    },
  }),
})
