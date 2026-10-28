import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function setSuperAdmin() {
  const targetEmail = process.argv[2] || 'admin@kalababyspa.com';
  console.log(`🔍 Memeriksa akun: ${targetEmail}...`);

  const payload = await getPayload({ config: configPromise });

  const users = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: targetEmail.trim().toLowerCase(),
      },
    },
  });

  if (users.totalDocs > 0) {
    const user = users.docs[0];
    console.log(`👤 Pengguna ditemukan (ID: ${user.id}, Role saat ini: ${user.role})`);

    const updated = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        role: 'superadmin',
      },
    });

    console.log(`✅ Berhasil! Akun ${updated.email} kini memiliki role: ${updated.role} (Super Admin Akses Penuh).`);
  } else {
    console.log(`⚠️ Akun ${targetEmail} belum terdaftar. Membuat akun Super Admin baru...`);
    const defaultPassword = process.env.NEW_ADMIN_PASSWORD || 'KalaAdminPassword2026!';
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email: targetEmail.trim().toLowerCase(),
        password: defaultPassword,
        name: 'Super Admin Kala',
        role: 'superadmin',
      },
    });
    console.log(`✅ Akun Super Admin baru berhasil dibuat:`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Password: ${defaultPassword}`);
    console.log(`   Role: ${newUser.role}`);
  }

  process.exit(0);
}

setSuperAdmin().catch((err) => {
  console.error('❌ Gagal mengubah role user:', err.message);
  process.exit(1);
});
