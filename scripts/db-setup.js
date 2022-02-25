const fs = require('node:fs');
const path = require('node:path');
const db = require('../util/database');
const files = process.argv.includes('--seed') ? ['schema.sql', 'seed.sql'] : ['schema.sql'];
(async () => {
  try {
    for (const file of files) await db.execute(fs.readFileSync(path.join(__dirname, '../database', file), 'utf8'));
    console.log('PostgreSQL schema ready' + (files.length > 1 ? '; fictional fixtures added.' : '.'));
  } catch (error) {
    // Do not disclose server error details or a credential-bearing URL.
    console.error('Database setup failed. Check DATABASE_URL, connectivity, and schema permissions.');
    process.exitCode = 1;
  } finally { await db.close(); }
})();
