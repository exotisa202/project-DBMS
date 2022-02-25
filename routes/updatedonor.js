const router = require('express').Router();
const path = require('path');
const db = require('../util/database');
const asyncRoute = require('../util/asyncRoute');
const fields = require('../util/fields');
router.get('/updatedonor', (req,res)=>res.sendFile(path.join(__dirname, '../views/updatedonor.html')));
router.post('/updatedonor', asyncRoute(async (req,res)=>{
  const binds = fields(req.body, ['lod', 'id']);
  const result = await db.execute("update badhon.donor set last_date_of_donation=$1::date where donor_id=$2", binds);
  if (!result.rowCount) return res.status(404).send('Donor not found.');
  res.redirect('/home');
}));
module.exports = router;
