const router = require('express').Router();
const path = require('path');
const db = require('../util/database');
const asyncRoute = require('../util/asyncRoute');
const fields = require('../util/fields');
router.get('/bloodbank', (req,res)=>res.sendFile(path.join(__dirname, '../views/bloodbankup.html')));
router.post('/bloodbank', asyncRoute(async (req,res)=>{
  const binds = fields(req.body, ['id', 'name', 'bg', 'amount']);
  await db.execute('insert into badhon.blood_bank(blood_bank_id,blood_bank_name,blood_group,amount) values($1,$2,$3,$4)', binds);
  res.redirect('/home');
}));
module.exports = router;
