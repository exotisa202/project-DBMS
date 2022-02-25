const router = require('express').Router();
const path = require('path');
const db = require('../util/database');
const asyncRoute = require('../util/asyncRoute');
const fields = require('../util/fields');
router.get('/donor', (req,res)=>res.sendFile(path.join(__dirname, '../views/donor.html')));
router.post('/donor', asyncRoute(async (req,res)=>{
  const binds = fields(req.body, ['id', 'name', 'dob', 'blg', 'lod', 'phone', 'email', 'location']);
  await db.execute("insert into badhon.donor(donor_id,donor_name,birth_date,blood_group,last_date_of_donation,phone_number,email,location) values(:1,:2,TO_DATE(:3, 'YYYY-MM-DD'),:4,TO_DATE(:5, 'YYYY-MM-DD'),:6,:7,:8)", binds, {autoCommit:true});
  res.redirect('/home');
}));
module.exports = router;
