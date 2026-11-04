/**
 * Test Integrasi End-to-End Database & Payload Local API
 *
 * Menguji konektivitas riil ke database PostgreSQL, operasi CRUD koleksi,
 * penulisan koleksi Deployments, integrasi toolService dengan payloadInstance,
 * dan memastikan integritas data CMS.
 */
import config from '../payload.config';

async function runIntegrationTest() {
  console.log('================================================================================');
  console.log('🧪 PENGUJIAN INTEGRASI DATABASE POSTGRESQL & PAYLOAD LOCAL API');
  console.log('================================================================================\n');

  let payload: any = null;
  let isDbConnected = false;

  try {
    const { getPayload } = await import('payload');
    payload = await getPayload({ config });
    // Tes query ringan untuk cek koneksi TCP DB
    await payload.find({ collection: 'users', limit: 1 });
    isDbConnected = true;
    console.log('✅ Koneksi PostgreSQL Terbuka & Aktif.');
  } catch (err: any) {
    console.error('❌ PENGUJIAN INTEGRASI GAGAL: Database PostgreSQL lokal tidak dapat dihubungi!');
    console.error(`   Detail error: ${err.message}`);
    console.error('\n⚠️  Kebijakan Fail-Fast Antigravity:');
    console.error('   Pengujian test:integration menolak status fake-green saat database offline.');
    console.error('   Pastikan service PostgreSQL berjalan di host/port sesuai konfig .env sebelum menjalankan test ini.');
    process.exit(1);
  }

  if (isDbConnected && payload) {
    console.log('\n--- 1. Uji Koleksi Deployments (Pencatatan Build Nyata) ---');
    const testDeploy = await payload.create({
      collection: 'deployments',
      data: {
        deploymentId: `test-dep-${Date.now()}`,
        status: 'queued',
        source: 'webhook_estimate',
        triggerReason: 'Pengujian integrasi sistem otomatis',
        resource: 'articles',
      },
    });
    console.log(`✅ Berhasil menulis ke Deployments (ID: ${testDeploy.id})`);

    await payload.update({
      collection: 'deployments',
      id: testDeploy.id,
      data: {
        status: 'success',
        durationSeconds: 25,
      },
    });
    console.log(`✅ Berhasil memperbarui status Deployment menjadi success`);

    // Bersihkan data uji deploy
    await payload.delete({
      collection: 'deployments',
      id: testDeploy.id,
    });
    console.log(`✅ Pembersihan dokumen uji Deployment selesai`);

    console.log('\n--- 2. Uji ToolService dengan Real Payload Instance ---');
    const { toolService } = await import('../../../automation/dist/services/toolService.js');
    const articlesRes = await toolService.getArticles(
      { page: 1, limit: 5, status: 'published' },
      { actor: 'tester@kala.id', ip: '127.0.0.1', payloadInstance: payload }
    );
    console.log(`✅ toolService.getArticles berhasil dieksekusi via Local API (total: ${articlesRes.data?.length || 0} docs)`);

    console.log('\n--- 3. Verifikasi Pembersihan Artefak babyMassage ---');
    const orphanPages = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'babyMassage' } },
    });
    if (orphanPages.totalDocs === 0) {
      console.log('✅ Halaman uji babyMassage bersih (0 dokumen ditemukan di DB)');
    } else {
      console.warn(`⚠️ Ditemukan ${orphanPages.totalDocs} dokumen babyMassage di DB, membersihkan...`);
      for (const d of orphanPages.docs) {
        await payload.delete({ collection: 'pages', id: d.id });
      }
      console.log('✅ Pembersihan selesai');
    }

    console.log('\n================================================================================');
    console.log('🎉 SELURUH PENGUJIAN INTEGRASI DATABASE & LOCAL API BERHASIL!');
    console.log('================================================================================\n');
  }
}

runIntegrationTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Integration test failed:', err);
    process.exit(1);
  });
