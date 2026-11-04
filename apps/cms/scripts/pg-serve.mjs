import EmbeddedPostgres from 'embedded-postgres';
import fs from 'node:fs';

const dir = 'C:/Users/User/AppData/Local/Temp/opencode/kala-pg-migrate2';
fs.mkdirSync(dir, { recursive: true });

const pg = new EmbeddedPostgres({
  databaseDir: dir,
  user: 'postgres',
  password: 'postgres',
  port: 55432,
  persistent: true,
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
});

try {
  await pg.initialise();
} catch (error) {
  console.log('[pg] initialise skipped:', error?.message || String(error));
}

await pg.start();

try {
  await pg.createDatabase('kala_migrate');
} catch (error) {
  console.log('[pg] createDatabase skipped:', error?.message || String(error));
}

console.log('READY');
setInterval(() => {}, 1 << 30);
