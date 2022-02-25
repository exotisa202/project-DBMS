const {test} = require('node:test');
const assert = require('node:assert/strict');
const database = require('../util/database');
const checkConnection = require('../util/oracleCon');

test('connectivity helper only queries DUAL, without account data', async () => {
  let statement;
  database.execute = async sql => { statement = sql; return {rows: [{OK: 1}]}; };
  assert.equal(await checkConnection(), true);
  assert.equal(statement, 'SELECT 1 AS OK FROM DUAL');
  database.execute = async () => ({rows: []});
  assert.equal(await checkConnection(), false);
});

test('connectivity errors propagate to the caller', async () => {
  database.execute = async () => { throw new Error('synthetic connection failure'); };
  await assert.rejects(checkConnection(), /synthetic connection failure/);
});
