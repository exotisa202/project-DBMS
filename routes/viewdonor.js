const router = require('express').Router();
const db = require('../util/database');
const asyncRoute = require('../util/asyncRoute');
router.get('/donorlist', asyncRoute(async (req,res)=>{
  const result = await db.execute('select donor_name,phone_number,location,blood_group,last_date_of_donation from badhon.donor');
  res.render('showdonor', {
    Name: result.rows.map(row=>row.donor_name),
    Contact: result.rows.map(row=>row.phone_number),
    Location: result.rows.map(row=>row.location),
    Blood: result.rows.map(row=>row.blood_group),
    Dates: result.rows.map(row=>row.last_date_of_donation)
  });
}));
module.exports = router;
