const router = require('express').Router();
const db = require('../util/database');
const asyncRoute = require('../util/asyncRoute');
router.get('/showbloodbank', asyncRoute(async (req,res)=>{
  const result = await db.execute('select blood_bank_id,blood_bank_name,blood_group,amount from badhon.blood_bank');
  res.render('showbloodbank', {
    Name: result.rows.map(row=>row.BLOOD_BANK_NAME),
    ID: result.rows.map(row=>row.BLOOD_BANK_ID),
    Bg: result.rows.map(row=>row.BLOOD_GROUP),
    Amount: result.rows.map(row=>row.AMOUNT)
  });
}));
module.exports = router;
