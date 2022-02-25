const router = require('express').Router();
const path = require('path');
const db = require('../util/database');
const asyncRoute = require('../util/asyncRoute');
const fields = require('../util/fields');
router.get('/request', (req,res)=>res.sendFile(path.join(__dirname, '../views/request.html')));
router.post('/request', asyncRoute(async (req,res)=>{
  const binds = fields(req.body, ['name', 'location', 'hospital', 'phone', 'email', 'bg']);
  await db.execute('insert into badhon.request(name,location,hospital,phone,email,blood_group) values($1,$2,$3,$4,$5,$6)', binds);
  res.redirect('/donorlist');
}));
module.exports = router;
