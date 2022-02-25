const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createDatabase} = require('../util/database');
const fields = require('../util/fields');
test('database closes connection after success and error',async()=>{
 for(const fail of [false,true]){
  let closed=false;
  const db=createDatabase({OUT_FORMAT_OBJECT:1,getConnection:async()=>({execute:async()=>{if(fail)throw new Error('query failed');return {rows:[]}},close:async()=>{closed=true}})},{});
  if(fail) await assert.rejects(db('select'),/query failed/); else assert.deepEqual(await db('select'),{rows:[]});
  assert.equal(closed,true);
 }
});
test('parallel operations keep bind parameters isolated',async()=>{
 const db=createDatabase({OUT_FORMAT_OBJECT:1,getConnection:async()=>({execute:async(sql,binds)=>{await new Promise(r=>setTimeout(r,2));return binds},close:async()=>{}})},{});
 assert.deepEqual(await Promise.all([db('x',['one']),db('x',['two'])]),[['one'],['two']]);
});
test('fields rejects absent and structured values',()=>{
 assert.deepEqual(fields({name:' Demo '},['name']),['Demo']);
 for(const body of [{},{name:''},{name:['bad']},{name:'x'.repeat(256)}])assert.throws(()=>fields(body,['name']),/Invalid/);
});
