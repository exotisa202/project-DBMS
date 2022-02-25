// One connection per operation; no request-specific module globals.
function createDatabase(driver, config) {
  return async function execute(sql, binds = [], options = {}) {
    const connection = await driver.getConnection(config);
    try { return await connection.execute(sql, binds, {outFormat: driver.OUT_FORMAT_OBJECT, ...options}); }
    finally { await connection.close(); }
  };
}
async function execute(...args) {
  const driver = require('oracledb');
  return createDatabase(driver, require('./dbConfig'))(...args);
}
module.exports = {execute, createDatabase};
