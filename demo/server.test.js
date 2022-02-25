const {test, before, after} = require('node:test');
const assert = require('node:assert/strict');
const app = require('./server');
let server, base;
before(async()=>{server=app.listen(0,'127.0.0.1'); await new Promise(r=>server.once('listening',r)); base=`http://127.0.0.1:${server.address().port}`;});
after(()=>new Promise(r=>server.close(r)));
for (const route of ['/', '/home', '/donorlist', '/showbloodbank', '/showreq']) {
 test(`GET ${route} renders`, async()=>{const res=await fetch(base+route); assert.equal(res.status,200); assert.match(await res.text(), /<html/i);});
}
test('health declares demo mode', async()=>assert.deepEqual(await (await fetch(base+'/health')).json(),{status:'ok',mode:'synthetic-readonly'}));
test('search filters synthetic donors',async()=>{const res=await fetch(base+'/search',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'bg=A%2B'}); const body=await res.text();assert.equal(res.status,200);assert.match(body,/Demo Donor A/);assert.doesNotMatch(body,/Demo Donor B/);});
test('no matches renders empty list',async()=>{const res=await fetch(base+'/search',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'bg=AB-'});assert.equal(res.status,200);assert.doesNotMatch(await res.text(),/Demo Donor [AB]/);});
test('writes are disabled',async()=>assert.equal((await fetch(base+'/donor',{method:'POST',body:'ignored'})).status,405));
test('unknown page gives 404',async()=>assert.equal((await fetch(base+'/missing')).status,404));
