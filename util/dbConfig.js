// DATABASE_URL is supplied by the caller. Never commit a real connection URL.
module.exports = function databaseConfig() {
  if (!process.env.DATABASE_URL) throw new Error('Missing DATABASE_URL; see docs/POSTGRESQL.md.');
  return {connectionString: process.env.DATABASE_URL, max: 5,
    connectionTimeoutMillis: 5000, idleTimeoutMillis: 10000};
};
