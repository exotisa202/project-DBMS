const router = require('express').Router();
const path = require('path');
const db = require('../util/database');
const asyncRoute = require('../util/asyncRoute');
const fields = require('../util/fields');
router.get('/updatedonor', (req,res)=>res.sendFile(path.join(__dirname, '../views/updatedonor.html')));
router.post('/updatedonor', asyncRoute(async (req,res)=>{
  const binds = fields(req.body, ['lod', 'id']);
  await db.execute("update badhon.donor set last_date_of_donation=TO_DATE(:1, 'YYYY-MM-DD') where donor_id=:2", binds, {autoCommit:true});
  res.redirect('/home');
}));
module.exports = router;
