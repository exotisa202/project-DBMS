const router = require('express').Router();
const db = require('../util/database');
const asyncRoute = require('../util/asyncRoute');
router.get('/showreq', asyncRoute(async (req,res)=>{
  const result = await db.execute('select name,location,blood_group,hospital,phone,email from badhon.request');
  res.render('showreq', {
    Name: result.rows.map(row=>row.NAME),
    Location: result.rows.map(row=>row.LOCATION),
    Blood: result.rows.map(row=>row.BLOOD_GROUP),
    Hospital: result.rows.map(row=>row.HOSPITAL),
    Phone: result.rows.map(row=>row.PHONE),
    Email: result.rows.map(row=>row.EMAIL)
  });
}));
module.exports = router;
