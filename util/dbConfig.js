// Set these variables explicitly; never commit real credentials.
for (const name of ['DB_USER', 'DB_PASSWORD', 'DB_CONNECT_STRING']) {
  if (!process.env[name]) throw new Error(`Missing ${name}; see README.md. Use the demo/ app for a database-free preview.`);
}
module.exports = {user:process.env.DB_USER, password:process.env.DB_PASSWORD, connectString:process.env.DB_CONNECT_STRING};
