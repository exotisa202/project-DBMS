const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createDatabase} = require('../util/database');
const fields = require('../util/fields');
test('database delegates statement and binds to the pool',async()=>{
 let seen;
 const db=createDatabase({query:async(...args)=>{seen=args;return {rows:[]};}});
 assert.deepEqual(await db('select $1',[1]),{rows:[]});assert.deepEqual(seen,['select $1',[1]]);
});
test('parallel operations keep bind parameters isolated',async()=>{
 const db=createDatabase({query:async(sql,binds)=>{await new Promise(r=>setTimeout(r,2));return binds;}});
 assert.deepEqual(await Promise.all([db('x',['one']),db('x',['two'])]),[['one'],['two']]);
});
test('fields rejects absent and structured values',()=>{
 assert.deepEqual(fields({name:' Demo '},['name']),['Demo']);
 for(const body of [{},{name:''},{name:['bad']},{name:'x'.repeat(256)}])assert.throws(()=>fields(body,['name']),/Invalid/);
});
