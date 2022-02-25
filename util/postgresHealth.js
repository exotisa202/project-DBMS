const database = require('./database');
module.exports = async function checkConnection() {
  const {rows} = await database.execute('SELECT 1 AS ok');
  return Boolean(rows[0] && rows[0].ok === 1);
};
