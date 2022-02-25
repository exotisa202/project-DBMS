// Synthetic database stub: tests route orchestration, not Oracle integration.
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const db=require('../util/database');
const calls=[];
db.execute=async(sql,binds=[],options={})=>{calls.push({sql,binds,options});if(binds.includes('FAIL'))throw new Error('simulated database failure');return {rows:[],rowsAffected:1};};
const app=require('../app');
let server,base;
before(async()=>{server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));base=`http://127.0.0.1:${server.address().port}`;});
after(()=>new Promise(r=>server.close(r)));
async function post(route,body){return fetch(base+route,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(body),redirect:'manual'});}
for(const route of ['/home','/login','/bloodbank','/donor','/request','/updatedonor','/donorlist','/showbloodbank','/showreq'])test(`legacy GET ${route}`,async()=>assert.equal((await fetch(base+route)).status,200));
const writes=[['/bloodbank',{id:'1',name:'Demo',bg:'A+',amount:'2'}],['/donor',{id:'1',name:'Demo',dob:'2000-01-01',blg:'A+',lod:'2025-01-01',phone:'synthetic',email:'demo@example.invalid',location:'Example'}],['/request',{name:'Demo',location:'Example',hospital:'Example',phone:'synthetic',email:'demo@example.invalid',bg:'A+'}],['/updatedonor',{lod:'2025-01-01',id:'1'}]];
for(const [route,body] of writes)test(`legacy POST ${route} awaits parameterized write`,async()=>{assert.equal((await post(route,body)).status,302);const last=calls.at(-1);assert.equal(last.options.autoCommit,true);assert.ok(last.sql.includes(':1'));assert.ok(last.binds.length>0);});
test('invalid input rejected before database call',async()=>{const n=calls.length;assert.equal((await post('/donor',{})).status,400);assert.equal(calls.length,n);});
test('database failure produces 500, not success redirect',async()=>assert.equal((await post('/bloodbank',{id:'1',name:'FAIL',bg:'A+',amount:'2'})).status,500));
test('search passes input as a bind',async()=>{assert.equal((await post('/search',{bg:'A+'})).status,200);assert.deepEqual(calls.at(-1).binds,['A+']);});
test('incomplete authentication is explicitly unavailable',async()=>{for(const route of ['/login','/'])assert.equal((await post(route,{})).status,501);});
