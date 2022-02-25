const router = require('express').Router();
const path = require('path');
const db = require('../util/database');
const asyncRoute = require('../util/asyncRoute');
const fields = require('../util/fields');
router.get('/donor', (req,res)=>res.sendFile(path.join(__dirname, '../views/donor.html')));
router.post('/donor', asyncRoute(async (req,res)=>{
  const binds = fields(req.body, ['id', 'name', 'dob', 'blg', 'lod', 'phone', 'email', 'location']);
  await db.execute("insert into badhon.donor(donor_id,donor_name,birth_date,blood_group,last_date_of_donation,phone_number,email,location) values($1,$2,$3::date,$4,$5::date,$6,$7,$8)", binds);
  res.redirect('/home');
}));
module.exports = router;
