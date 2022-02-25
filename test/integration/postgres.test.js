// Opt-in test against a real, fresh disposable PostgreSQL database.
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const db=require('../../util/database');
const app=require('../../app');
let server,base;
before(async()=>{
 const url=new URL(process.env.DATABASE_URL || 'postgresql://localhost/missing');
 assert.match(url.pathname, /^\/badhon_test_[a-z0-9_]+$/, 'Use a fresh database named badhon_test_<suffix>.');
 assert.equal((await db.execute("SELECT to_regnamespace('badhon') AS existing")).rows[0].existing,null,'Refusing to modify a database with an existing badhon schema. Create a new disposable test database.');
 await db.execute(fs.readFileSync(path.join(__dirname,'../../database/schema.sql'),'utf8'));
 server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));base=`http://127.0.0.1:${server.address().port}`;
});
after(async()=>{if(server)await new Promise(r=>server.close(r));await db.close();});
function post(route,body){return fetch(base+route,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(body),redirect:'manual'});}
const donor={id:'101',name:'Synthetic Integration Donor',dob:'2000-02-29',blg:'AB+',lod:'2025-02-01',phone:'not-a-phone',email:'fixture@example.invalid',location:'Example District'};
test('PostgreSQL donor creation, listing, filtering, and date update',async()=>{
 assert.equal((await post('/donor',donor)).status,302);
 const row=(await db.execute('SELECT * FROM badhon.donor WHERE donor_id=$1',[101])).rows[0];assert.equal(row.donor_name,donor.name);assert.equal(row.birth_date,'2000-02-29');
 assert.match(await (await fetch(base+'/donorlist')).text(),/Synthetic Integration Donor/);
 assert.match(await (await post('/search',{bg:'AB+'})).text(),/Synthetic Integration Donor/);
 assert.doesNotMatch(await (await post('/search',{bg:'O-'})).text(),/Synthetic Integration Donor/);
 assert.equal((await post('/updatedonor',{id:'101',lod:'2025-03-01'})).status,302);
 assert.equal((await db.execute('SELECT last_date_of_donation FROM badhon.donor WHERE donor_id=$1',[101])).rows[0].last_date_of_donation,'2025-03-01');
});
test('PostgreSQL inventory create and listing, including AB group',async()=>{
 assert.equal((await post('/bloodbank',{id:'102',name:'Synthetic Integration Bank',bg:'AB-',amount:'3'})).status,302);
 assert.equal((await db.execute('SELECT amount FROM badhon.blood_bank WHERE blood_bank_id=$1',[102])).rows[0].amount,3);
 assert.match(await (await fetch(base+'/showbloodbank')).text(),/Synthetic Integration Bank/);
});
test('PostgreSQL blood request create and listing',async()=>{
 assert.equal((await post('/request',{name:'Synthetic Recipient',location:'Example',hospital:'Example Hospital',phone:'not-a-phone',email:'recipient@example.invalid',bg:'A+'})).status,302);
 assert.equal((await db.execute('SELECT count(*)::int AS n FROM badhon.request')).rows[0].n,1);
 assert.match(await (await fetch(base+'/showreq')).text(),/Synthetic Recipient/);
});
test('PostgreSQL duplicate keys, invalid dates, and constraints reject writes',async()=>{
 assert.equal((await post('/donor',donor)).status,409);
 assert.equal((await post('/donor',{...donor,id:'103',dob:'2001-02-29'})).status,400);
 assert.equal((await post('/bloodbank',{id:'104',name:'Invalid',bg:'XYZ',amount:'3'})).status,400);
 assert.equal((await post('/bloodbank',{id:'105',name:'Invalid',bg:'A+',amount:'-1'})).status,400);
 assert.equal((await db.execute('SELECT count(*)::int AS n FROM badhon.donor')).rows[0].n,1);
});
test('bound search cannot inject SQL',async()=>{
 const res=await post('/search',{bg:"A+' OR 1=1 --"});assert.equal(res.status,200);assert.doesNotMatch(await res.text(),/Synthetic Integration Donor/);
 assert.equal((await db.execute('SELECT count(*)::int AS n FROM badhon.donor')).rows[0].n,1);
});
test('concurrent PostgreSQL writes remain separate',async()=>{
 const results=await Promise.all([201,202].map(id=>post('/donor',{...donor,id:String(id),name:`Synthetic Donor ${id}`})));
 assert.deepEqual(results.map(r=>r.status),[302,302]);
 assert.deepEqual((await db.execute('SELECT donor_name FROM badhon.donor WHERE donor_id IN (201,202) ORDER BY donor_id')).rows.map(r=>r.donor_name),['Synthetic Donor 201','Synthetic Donor 202']);
});
test('authentication remains explicitly unavailable',async()=>{
 assert.equal((await post('/login',{})).status,501);assert.equal((await post('/',{})).status,501);
});

test('updating an absent donor returns 404',async()=>{
 assert.equal((await post('/updatedonor',{id:'99999',lod:'2025-01-01'})).status,404);
});
test('synthetic seed is idempotent and contains no account records',async()=>{
 const sql=fs.readFileSync(path.join(__dirname,'../../database/seed.sql'),'utf8');
 await db.execute(sql);await db.execute(sql);
 assert.equal((await db.execute('SELECT count(*)::int AS n FROM badhon.donor WHERE donor_id=9001')).rows[0].n,1);
 assert.equal((await db.execute('SELECT count(*)::int AS n FROM badhon.blood_bank WHERE blood_bank_id=9001')).rows[0].n,1);
 assert.equal((await db.execute("SELECT to_regclass('badhon.login') AS existing")).rows[0].existing,null);
});
