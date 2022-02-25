// Separate, read-only demonstration: never imports the database-backed routes.
const express = require('express');
const path = require('node:path');
const app = express();
const root = path.resolve(__dirname, '..');
app.set('view engine', 'ejs');
app.set('views', path.join(root, 'views'));
app.use(express.urlencoded({ extended: false, limit: '8kb' }));
app.use(express.static(path.join(root, 'public')));
const donors = [
  {name: 'Demo Donor A', contact: 'Not a real phone', location: 'Example District', blood: 'A+', date: '2025-01-01'},
  {name: 'Demo Donor B', contact: 'Not a real phone', location: 'Example Town', blood: 'O+', date: '2025-02-01'}
];
function showDonors(res, rows) {
  return res.render('showdonor', {Name: rows.map(x=>x.name), Contact: rows.map(x=>x.contact),
    Location: rows.map(x=>x.location), Blood: rows.map(x=>x.blood), Dates: rows.map(x=>x.date)});
}
app.get('/health', (_,res)=>res.json({status:'ok', mode:'synthetic-readonly'}));
app.get(['/', '/home'], (_,res)=>res.send(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Badhon demo</title><body style="font:18px system-ui;max-width:720px;margin:4rem auto;padding:1rem"><h1>Badhon: blood-donation database coursework</h1><p><strong>Synthetic, read-only UI preview.</strong> No real donors, authentication, database connection, or persistence. Do not enter personal information.</p><ul><li><a href="/donorlist">Donor directory</a></li><li><a href="/showbloodbank">Blood-bank inventory</a></li><li><a href="/showreq">Sample requests</a></li></ul><form action="/search" method="post"><label>Filter demo donors by blood group <select name="bg"><option>A+</option><option>O+</option><option>AB-</option></select></label><button>Search</button></form><p>The listing pages reuse the original project templates. Form submissions and login are deliberately disabled in this preview.</p></body></html>`));
app.get('/donorlist', (_,res)=>showDonors(res, donors));
app.post('/search', (req,res)=>showDonors(res, donors.filter(x=>x.blood === String(req.body.bg || '').toUpperCase())));
app.get('/showbloodbank', (_,res)=>res.render('showbloodbank', {Name:['Example Bank'], ID:['DEMO-1'], Bg:['A+'], Amount:[5]}));
app.get('/showreq', (_,res)=>res.render('showreq', {Name:['Demo Recipient'], Phone:['Not a real phone'], Location:['Example Town'], Blood:['O+'], Hospital:['Example Hospital'], Email:['demo@example.invalid']}));
app.use((req,res)=>res.status(req.method === 'GET' ? 404 : 405).send('Not available in this read-only demo. Return to /home.'));
app.use((err,req,res,next)=>{ console.error(err.message); res.status(500).send('Unable to render demo page.'); });
if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, '127.0.0.1', ()=>console.log(`Read-only synthetic demo: http://127.0.0.1:${port}`));
}
module.exports = app;
