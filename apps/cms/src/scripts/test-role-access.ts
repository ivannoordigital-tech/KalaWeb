import type { CollectionConfig } from 'payload'
import type { UserRole } from '../access/roles'
import { Users } from '../collections/Users'
import { Articles } from '../collections/Articles'
import { Pages } from '../collections/Pages'
import { LandingPages } from '../collections/LandingPages'
import { Services } from '../collections/Services'
import { ServiceAreas } from '../collections/ServiceAreas'
import { Midwives } from '../collections/Midwives'
import { Testimonials } from '../collections/Testimonials'
import { FAQ } from '../collections/FAQ'
import { Media } from '../collections/Media'
import { BlockTemplates } from '../collections/BlockTemplates'
import { PageTemplates } from '../collections/PageTemplates'
import { Redirects } from '../collections/Redirects'
import { HelpCenter } from '../collections/HelpCenter'
import payloadConfig from '../payload.config'

interface MockUser {
  id: number
  email: string
  role: UserRole
}

const ROLES_TO_TEST: Array<{ label: string; role?: UserRole; user?: MockUser }> = [
  { label: 'Anonymous (Publik)', role: undefined, user: undefined },
  { label: 'Superadmin', role: 'superadmin', user: { id: 1, email: 'admin@kala.test', role: 'superadmin' } },
  { label: 'Operator Klinik', role: 'operator', user: { id: 2, email: 'operator@kala.test', role: 'operator' } },
  { label: 'Penulis (Author)', role: 'author', user: { id: 3, email: 'author@kala.test', role: 'author' } },
  { label: 'SEO Specialist', role: 'seo', user: { id: 4, email: 'seo@kala.test', role: 'seo' } },
  { label: 'Koordinator Bidan', role: 'midwife_coordinator', user: { id: 5, email: 'midwife@kala.test', role: 'midwife_coordinator' } },
  { label: 'Marketing Specialist', role: 'marketing', user: { id: 6, email: 'marketing@kala.test', role: 'marketing' } },
  { label: 'Agen Otomasi (Automation)', role: 'automation', user: { id: 7, email: 'bot@kala.test', role: 'automation' } },
]

const COLLECTIONS: Record<string, CollectionConfig> = {
  articles: Articles,
  pages: Pages,
  'landing-pages': LandingPages,
  services: Services,
  'service-areas': ServiceAreas,
  midwives: Midwives,
  testimonials: Testimonials,
  faq: FAQ,
  media: Media,
  'block-templates': BlockTemplates,
  'page-templates': PageTemplates,
  redirects: Redirects,
  'help-center': HelpCenter,
  users: Users,
}

type Action = 'read' | 'create' | 'update' | 'delete'

async function checkAccess(
  collection: CollectionConfig,
  action: Action,
  user?: MockUser
): Promise<boolean | object> {
  const accessFn = collection.access?.[action]
  if (typeof accessFn === 'function') {
    try {
      const res = await accessFn({ req: { user } as any, id: user ? user.id : undefined, data: {} } as any)
      return res
    } catch {
      return false
    }
  } else if (accessFn === undefined) {
    // Default Payload: read is public, others require authenticated user
    if (action === 'read') return true
    return Boolean(user)
  }
  return Boolean(accessFn)
}

async function run() {
  console.log('========================================================================================')
  console.log('🧪 PENGUJIAN MATRIKS HAK AKSES PER-ROLE & KEAMANAN ESKALASI (FIX-002, FIX-003, FIX-012)')
  console.log('========================================================================================\n')

  let failureCount = 0

  function assert(condition: boolean, message: string) {
    if (!condition) {
      console.error(`❌ GAGAL: ${message}`)
      failureCount++
    } else {
      console.log(`✅ LULUS: ${message}`)
    }
  }

  // -------------------------------------------------------------
  // 1. Matriks CRUD Koleksi
  // -------------------------------------------------------------
  console.log('\n--- 1. Matriks Hak Akses Koleksi ---')
  for (const { label, user } of ROLES_TO_TEST) {
    const roleName = user?.role || 'anonymous'
    const summary: string[] = []

    for (const [slug, coll] of Object.entries(COLLECTIONS)) {
      const canRead = await checkAccess(coll, 'read', user)
      const canCreate = await checkAccess(coll, 'create', user)
      const canUpdate = await checkAccess(coll, 'update', user)
      const canDelete = await checkAccess(coll, 'delete', user)

      const isReadOk = Boolean(canRead)
      const isCreateOk = Boolean(canCreate)
      const isUpdateOk = Boolean(canUpdate)
      const isDeleteOk = Boolean(canDelete)

      summary.push(`${slug}: [R:${isReadOk ? '✓' : '✗'} C:${isCreateOk ? '✓' : '✗'} U:${isUpdateOk ? '✓' : '✗'} D:${isDeleteOk ? '✓' : '✗'}]`)
    }
    console.log(`\n[${label}] (role: ${roleName}):\n  ` + summary.join('\n  '))
  }

  // -------------------------------------------------------------
  // 2. Uji Keamanan Eskalasi Role (P0-4 / FIX-002)
  // -------------------------------------------------------------
  console.log('\n\n--- 2. Uji Keamanan Eskalasi Role (FIX-002) ---')

  const roleField = Users.fields?.find(
    (f: any) => 'name' in f && f.name === 'role'
  ) as any

  assert(Boolean(roleField), 'Field "role" ditemukan pada koleksi Users')

  const fieldUpdateAccess = roleField?.access?.update
  assert(
    typeof fieldUpdateAccess === 'function',
    'Field "role" memiliki kontrol akses tingkat-field (field-level access)'
  )

  // Uji bahwa SELURUH non-superadmin ditolak saat mencoba update field role
  const nonSuperadminRoles: UserRole[] = ['operator', 'author', 'seo', 'midwife_coordinator', 'marketing', 'automation']
  for (const r of nonSuperadminRoles) {
    const mockUser: MockUser = { id: 88, email: `${r}@kala.test`, role: r }
    const allowed = fieldUpdateAccess({ req: { user: mockUser } as any })
    assert(!allowed, `Field-level access: Role "${r}" DITOLAK saat mencoba update field "role"`)
  }

  // Superadmin HARUS diizinkan update field role
  const superadminUser: MockUser = { id: 1, email: 'admin@kala.test', role: 'superadmin' }
  const superadminAllowed = fieldUpdateAccess({ req: { user: superadminUser } as any })
  assert(Boolean(superadminAllowed), 'Field-level access: Superadmin DIIZINKAN update field "role"')

  // Uji Hook beforeChange Users untuk mendeteksi percobaan eskalasi
  const beforeChangeHook = Users.hooks?.beforeChange?.[0]
  assert(typeof beforeChangeHook === 'function', 'Hook beforeChange terpasang pada koleksi Users')

  if (beforeChangeHook) {
    for (const r of nonSuperadminRoles) {
      const mockUser: MockUser = { id: 88, email: `${r}@kala.test`, role: r }
      let threw = false
      try {
        await beforeChangeHook({
          req: { user: mockUser } as any,
          operation: 'update',
          data: { role: 'superadmin' },
          originalDoc: { id: 88, role: r },
        } as any)
      } catch (err: any) {
        threw = true
        assert(
          err.message.includes('Forbidden') || err.message.includes('Super Admin'),
          `Hook beforeChange: Percobaan eskalasi dari "${r}" ke "superadmin" dicegah dengan pesan keamanan`
        )
      }
      assert(threw, `Hook beforeChange: Role "${r}" gagal eskalasi ke superadmin`)
    }

    // Superadmin mengubah role pengguna lain harus berhasil (tidak melempar error)
    let superadminThrew = false
    try {
      await beforeChangeHook({
        req: { user: superadminUser } as any,
        operation: 'update',
        data: { role: 'operator' },
        originalDoc: { id: 99, role: 'author' },
      } as any)
    } catch {
      superadminThrew = true
    }
    assert(!superadminThrew, 'Hook beforeChange: Superadmin berhasil mengubah role pengguna lain')
  }

  // -------------------------------------------------------------
  // 3. Uji Filter Akses Publik Anonim (P0-6 / FIX-003)
  // -------------------------------------------------------------
  console.log('\n--- 3. Uji Filter Akses Publik Anonim (FIX-003) ---')

  // Testimonials
  const testimonialsReadAnon = await checkAccess(Testimonials, 'read', undefined)
  assert(
    typeof testimonialsReadAnon === 'object' &&
      testimonialsReadAnon !== null &&
      'active' in (testimonialsReadAnon as any) &&
      'permissionGranted' in (testimonialsReadAnon as any),
    'Testimonials: Pembaca anonim hanya mendapat filter { active: true, permissionGranted: true }'
  )

  // Services
  const servicesReadAnon = await checkAccess(Services, 'read', undefined)
  assert(
    typeof servicesReadAnon === 'object' &&
      servicesReadAnon !== null &&
      'active' in (servicesReadAnon as any),
    'Services: Pembaca anonim hanya mendapat filter { active: true }'
  )

  // Service Areas
  const areasReadAnon = await checkAccess(ServiceAreas, 'read', undefined)
  assert(
    typeof areasReadAnon === 'object' &&
      areasReadAnon !== null &&
      'active' in (areasReadAnon as any),
    'ServiceAreas: Pembaca anonim hanya mendapat filter { active: true }'
  )

  // Midwives
  const midwivesReadAnon = await checkAccess(Midwives, 'read', undefined)
  assert(
    typeof midwivesReadAnon === 'object' &&
      midwivesReadAnon !== null &&
      'active' in (midwivesReadAnon as any),
    'Midwives: Pembaca anonim hanya mendapat filter { active: true }'
  )

  // FAQ
  const faqReadAnon = await checkAccess(FAQ, 'read', undefined)
  assert(
    typeof faqReadAnon === 'object' &&
      faqReadAnon !== null &&
      'active' in (faqReadAnon as any),
    'FAQ: Pembaca anonim hanya mendapat filter { active: true }'
  )

  // Koleksi dengan drafts: anonim hanya boleh membaca published.
  const articlesReadAnon = await checkAccess(Articles, 'read', undefined)
  assert(
    typeof articlesReadAnon === 'object' &&
      articlesReadAnon !== null &&
      '_status' in (articlesReadAnon as any),
    'Articles: pembaca anonim hanya mendapat filter { _status: published }'
  )

  const pagesReadAnon = await checkAccess(Pages, 'read', undefined)
  assert(
    typeof pagesReadAnon === 'object' &&
      pagesReadAnon !== null &&
      '_status' in (pagesReadAnon as any),
    'Pages: pembaca anonim hanya mendapat filter { _status: published }'
  )

  const landingReadAnon = await checkAccess(LandingPages, 'read', undefined)
  assert(
    typeof landingReadAnon === 'object' &&
      landingReadAnon !== null &&
      '_status' in (landingReadAnon as any) &&
      'active' in (landingReadAnon as any),
    'LandingPages: pembaca anonim hanya mendapat filter { _status: published, active: true }'
  )

  // Pengguna terautentikasi (superadmin / operator) harus mendapat full access (true)
  const testimonialsReadAuth = await checkAccess(Testimonials, 'read', superadminUser)
  assert(testimonialsReadAuth === true, 'Testimonials: Superadmin mendapat full read access (true)')

  // Users: anonim tidak boleh membaca/mengubah data pengguna
  const usersReadAnon = await checkAccess(Users, 'read', undefined)
  const usersUpdateAnon = await checkAccess(Users, 'update', undefined)
  assert(usersReadAnon === false, 'Users: pembaca anonim DITOLAK membaca data pengguna')
  assert(usersUpdateAnon === false, 'Users: pembaca anonim DITOLAK mengubah data pengguna')

  // -------------------------------------------------------------
  // 4. Uji Endpoint Terlindungi /api/deploy-status (FIX-011)
  // -------------------------------------------------------------
  console.log('\n--- 4. Uji Perlindungan Endpoint /api/deploy-status (FIX-011) ---')

  const resolvedConfig = await payloadConfig
  const deployStatusEndpoint = resolvedConfig.endpoints?.find(
    (e: any) => e.path === '/deploy-status'
  )
  assert(Boolean(deployStatusEndpoint), 'Endpoint /deploy-status terdaftar di payload.config')

  if (deployStatusEndpoint) {
    // Request tanpa user (anonim)
    const unauthRes = await deployStatusEndpoint.handler({ user: undefined } as any)
    assert(
      unauthRes.status === 401,
      `Request anonim ke /api/deploy-status ditolak dengan status 401 (aktual: ${unauthRes.status})`
    )

    // Request dengan user terautentikasi
    const authRes = await deployStatusEndpoint.handler({ user: superadminUser } as any)
    assert(
      authRes.status === 200,
      `Request terautentikasi ke /api/deploy-status diizinkan dengan status 200 (aktual: ${authRes.status})`
    )
  }

  // -------------------------------------------------------------
  // 5. Uji Sinkronisasi Harga & Durasi (P1-1 / FIX-009)
  // -------------------------------------------------------------
  console.log('\n--- 5. Uji Sinkronisasi Harga/Durasi (FIX-009) ---')

  const serviceBeforeValidate = Services.hooks?.beforeValidate?.[0]
  assert(typeof serviceBeforeValidate === 'function', 'Hook beforeValidate terpasang pada Services')

  if (serviceBeforeValidate) {
    // Case A: numericPrice diubah, price lama harus otomatis disinkronkan
    const inputDataA = {
      name: 'Baby Spa Treatment',
      numericPrice: 175000,
      price: 'Rp150.000', // harga lama yang basi
      durationMinutes: 90,
      duration: '60 Menit', // durasi lama yang basi
    }
    const resultA = await serviceBeforeValidate({
      data: inputDataA,
      originalDoc: { numericPrice: 150000, durationMinutes: 60 },
      req: {} as any,
      operation: 'update',
    } as any)

    assert(resultA?.price === 'Rp175.000', `Format harga otomatis disinkronkan ke Rp175.000 (aktual: ${resultA?.price})`)
    assert(resultA?.duration === '90 Menit', `Format durasi otomatis disinkronkan ke 90 Menit (aktual: ${resultA?.duration})`)

    // Case B: confirmLargePriceChange harus di-reset ke false agar tidak sticky
    const inputDataB = {
      name: 'Baby Spa Treatment',
      numericPrice: 250000,
      confirmLargePriceChange: true,
    }
    const resultB = await serviceBeforeValidate({
      data: inputDataB,
      originalDoc: { numericPrice: 150000 },
      req: {} as any,
      operation: 'update',
    } as any)

    assert(
      resultB?.confirmLargePriceChange === false,
      'confirmLargePriceChange berhasil di-reset ke false setelah validasi (tidak sticky)'
    )
  }

  // -------------------------------------------------------------
  // 6. Ringkasan Akhir
  // -------------------------------------------------------------
  console.log('\n========================================================================================')
  if (failureCount > 0) {
    console.error(`🚨 PENGUJIAN GAGAL: Terdeteksi ${failureCount} pelanggaran aturan / regresi keamanan!`)
    process.exit(1)
  } else {
    console.log('🎉 SEMUA PENGUJIAN MATRIKS HAK AKSES & KEAMANAN LULUS (0 REGRESI)!')
    console.log('========================================================================================\n')
    process.exit(0)
  }
}

run().catch((err) => {
  console.error('Fatal error during test run:', err)
  process.exit(1)
})
