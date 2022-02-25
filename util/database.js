// pg.Pool.query acquires/releases a client for each single-statement operation.
function createDatabase(pool) {
  return async (text, values = []) => pool.query(text, values);
}
let pool;
function getPool() {
  if (!pool) {
    const {Pool, types} = require('pg');
    pool = new Pool({...require('./dbConfig')(), types: {
      getTypeParser(oid, format) { return oid === 1082 ? value => value : types.getTypeParser(oid, format); }
    }});
    // Do not log database errors: they can contain connection or record details.
    pool.on('error', () => console.error('PostgreSQL idle connection error.'));
  }
  return pool;
}
async function execute(text, values = []) { return createDatabase(getPool())(text, values); }
async function close() { if (pool) { const old = pool; pool = undefined; await old.end(); } }
module.exports = {execute, createDatabase, close};
