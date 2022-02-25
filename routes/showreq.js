const router = require('express').Router();
const db = require('../util/database');
const asyncRoute = require('../util/asyncRoute');
router.get('/showreq', asyncRoute(async (req,res)=>{
  const result = await db.execute('select name,location,blood_group,hospital,phone,email from badhon.request');
  res.render('showreq', {
    Name: result.rows.map(row=>row.name),
    Location: result.rows.map(row=>row.location),
    Blood: result.rows.map(row=>row.blood_group),
    Hospital: result.rows.map(row=>row.hospital),
    Phone: result.rows.map(row=>row.phone),
    Email: result.rows.map(row=>row.email)
  });
}));
module.exports = router;
