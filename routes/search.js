const router = require('express').Router();
const db = require('../util/database');
const asyncRoute = require('../util/asyncRoute');
router.post('/search', asyncRoute(async (req,res)=>{
  const result = await db.execute('select donor_name,phone_number,location,blood_group,last_date_of_donation from badhon.donor where blood_group = :1', require('../util/fields')(req.body, ['bg']));
  res.render('showdonor', {
    Name: result.rows.map(row=>row.DONOR_NAME),
    Contact: result.rows.map(row=>row.PHONE_NUMBER),
    Location: result.rows.map(row=>row.LOCATION),
    Blood: result.rows.map(row=>row.BLOOD_GROUP),
    Dates: result.rows.map(row=>row.LAST_DATE_OF_DONATION)
  });
}));
module.exports = router;
