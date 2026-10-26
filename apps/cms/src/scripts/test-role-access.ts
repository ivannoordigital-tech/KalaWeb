import { getPayload } from 'payload'
import configPromise from '../payload.config'
import type { UserRole } from '../access/roles'

interface MockUser {
  id: number
  email: string
  role: UserRole
}

const ROLES_TO_TEST: Array<{ label: string; user?: MockUser }> = [
  { label: 'Anonymous (Publik / Tanpa Login)', user: undefined },
  { label: 'Penulis (Author)', user: { id: 991, email: 'author@kala.test', role: 'author' } },
  { label: 'Koordinator Bidan (Midwife Coordinator)', user: { id: 992, email: 'midwife@kala.test', role: 'midwife_coordinator' } },
  { label: 'Operator Klinik', user: { id: 993, email: 'operator@kala.test', role: 'operator' } },
  { label: 'Superadmin', user: { id: 994, email: 'admin@kala.test', role: 'superadmin' } },
]

const COLLECTIONS_TO_TEST = [
  'articles',
  'pages',
  'services',
  'midwives',
  'media',
  'users',
] as const

async function run() {
  console.log('🧪 Memulai Pengujian Matriks Hak Akses Per-Role (overrideAccess: false)...\n')
  const payload = await getPayload({ config: configPromise })

  const results: Record<string, Record<string, { read: boolean; create: boolean }>> = {}

  for (const roleTest of ROLES_TO_TEST) {
    const roleKey = roleTest.label
    results[roleKey] = {}

    for (const coll of COLLECTIONS_TO_TEST) {
      // 1. Test Read Access
      let canRead = false
      try {
        await payload.find({
          collection: coll,
          limit: 1,
          overrideAccess: false,
          user: roleTest.user as any,
        })
        canRead = true
      } catch {
        canRead = false
      }

      // 2. Test Create Access (Dry-run test using dummy data or access check)
      let canCreate = false
      try {
        const config = payload.collections[coll]?.config
        const createAccess = config?.access?.create
        if (typeof createAccess === 'function') {
          const allowed = await createAccess({ req: { user: roleTest.user, payload } as any, data: {} as any })
          canCreate = Boolean(allowed)
        } else if (createAccess === undefined) {
          canCreate = Boolean(roleTest.user)
        }
      } catch {
        canCreate = false
      }

      results[roleKey][coll] = { read: canRead, create: canCreate }
    }
  }

  // Print Access Matrix
  console.log('========================================================================================')
  console.log('MATRIKS HAK AKSES PERAN (ACCESS CONTROL MATRIX) — KALA CMS')
  console.log('========================================================================================')
  console.log(
    'Peran Pengguna'.padEnd(35) +
      'Articles'.padEnd(14) +
      'Pages'.padEnd(14) +
      'Services'.padEnd(14) +
      'Midwives'.padEnd(14) +
      'Media'.padEnd(14) +
      'Users'
  )
  console.log('-'.repeat(110))

  for (const [role, colls] of Object.entries(results)) {
    const row =
      role.padEnd(35) +
      formatStatus(colls.articles).padEnd(14) +
      formatStatus(colls.pages).padEnd(14) +
      formatStatus(colls.services).padEnd(14) +
      formatStatus(colls.midwives).padEnd(14) +
      formatStatus(colls.media).padEnd(14) +
      formatStatus(colls.users)
    console.log(row)
  }
  console.log('========================================================================================')
  console.log('Keterangan: R = Baca (Read), C = Buat/Ubah (Create/Edit), ❌ = Akses Ditolak (Forbidden)\n')
  process.exit(0)
}

function formatStatus({ read, create }: { read: boolean; create: boolean }): string {
  if (read && create) return '✅ R+C'
  if (read && !create) return '👁️ R-Only'
  if (!read && create) return '✏️ C-Only'
  return '❌ Tutup'
}

run().catch((err) => {
  console.error('Test run failed:', err)
  process.exit(1)
})
