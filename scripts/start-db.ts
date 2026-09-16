import EmbeddedPostgres from 'embedded-postgres';
import path from 'path';
import fs from 'fs';

async function run() {
  const dbDir = path.resolve(__dirname, '../.data/postgres');
  const isInit = !fs.existsSync(dbDir);

  const pg = new EmbeddedPostgres({
    databaseDir: dbDir,
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    persistent: true,
  });

  if (isInit) {
    console.log('Initializing embedded postgres cluster at', dbDir);
    await pg.initialise();
  }

  console.log('Starting PostgreSQL server on port 5432...');
  await pg.start();
  console.log('PostgreSQL server started.');

  try {
    console.log('Ensuring database "bldr" exists...');
    await pg.createDatabase('bldr');
    console.log('Database "bldr" created.');
  } catch (err: any) {
    if (err?.message?.includes('already exists')) {
      console.log('Database "bldr" already exists.');
    } else {
      console.log('Notice when creating bldr database:', err?.message || err);
    }
  }

  console.log('PostgreSQL is ready and accepting connections on localhost:5432');
  console.log('Connection URL: postgresql://postgres:postgres@localhost:5432/bldr');

  // Keep process alive
  process.on('SIGINT', async () => {
    console.log('Stopping PostgreSQL...');
    await pg.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Stopping PostgreSQL...');
    await pg.stop();
    process.exit(0);
  });
}

run().catch((err) => {
  console.error('Failed to start postgres:', err);
  process.exit(1);
});
