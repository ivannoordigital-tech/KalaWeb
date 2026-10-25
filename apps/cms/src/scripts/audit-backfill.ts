import { getPayload } from 'payload'
import configPromise from '../payload.config'
import {
  articleSeoAdapter,
  pageSeoAdapter,
  landingPageSeoAdapter,
  calculateSeoScore,
} from '../lib/seo-engine'

async function run() {
  console.log('🚀 Starting SEO Audit Backfill for Kala CMS...')
  const payload = await getPayload({ config: configPromise })

  // 1. Articles
  const articlesRes = await payload.find({
    collection: 'articles',
    depth: 0,
    limit: 100,
    overrideAccess: true,
  })

  console.log(`\n📚 Auditing ${articlesRes.docs.length} Articles:`)
  for (const doc of articlesRes.docs) {
    const input = articleSeoAdapter(doc)
    const audit = calculateSeoScore(input)
    await payload.update({
      collection: 'articles',
      id: doc.id,
      data: {
        seoScore: audit.score,
        seoAudit: {
          score: audit.score,
          grade: audit.grade,
          issues: audit.issues,
          lastAuditedAt: new Date().toISOString(),
        },
      },
      overrideAccess: true,
    })
    console.log(`  - [ID: ${doc.id}] ${doc.title.slice(0, 45)}... => Skor: ${audit.score} (${audit.grade})`)
  }

  // 2. Pages
  const pagesRes = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 100,
    overrideAccess: true,
  })

  console.log(`\n📄 Auditing ${pagesRes.docs.length} Pages:`)
  for (const doc of pagesRes.docs) {
    const input = pageSeoAdapter(doc)
    const audit = calculateSeoScore(input)
    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: {
        seoScore: audit.score,
        seoAudit: {
          score: audit.score,
          grade: audit.grade,
          issues: audit.issues,
          lastAuditedAt: new Date().toISOString(),
        },
      },
      overrideAccess: true,
    })
    console.log(`  - [ID: ${doc.id}] ${doc.title.slice(0, 45)}... => Skor: ${audit.score} (${audit.grade})`)
  }

  // 3. Landing Pages
  const lpRes = await payload.find({
    collection: 'landing-pages',
    depth: 0,
    limit: 100,
    overrideAccess: true,
  })

  console.log(`\n📢 Auditing ${lpRes.docs.length} Landing Pages:`)
  for (const doc of lpRes.docs) {
    const input = landingPageSeoAdapter(doc)
    const audit = calculateSeoScore(input)
    await payload.update({
      collection: 'landing-pages',
      id: doc.id,
      data: {
        seoScore: audit.score,
        seoAudit: {
          score: audit.score,
          grade: audit.grade,
          issues: audit.issues,
          lastAuditedAt: new Date().toISOString(),
        },
      },
      overrideAccess: true,
    })
    console.log(`  - [ID: ${doc.id}] ${doc.title.slice(0, 45)}... => Skor: ${audit.score} (${audit.grade})`)
  }

  console.log('\n✅ SEO Audit Backfill Complete!')
  process.exit(0)
}

run().catch((err) => {
  console.error('❌ Error during backfill:', err)
  process.exit(1)
})
