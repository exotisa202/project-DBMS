// Optional connectivity check. Never queries account records or logs credentials.
const database = require('./database');

async function checkConnection() {
  const result = await database.execute('SELECT 1 AS OK FROM DUAL');
  return Boolean(result.rows && result.rows[0] && result.rows[0].OK === 1);
}

module.exports = checkConnection;
