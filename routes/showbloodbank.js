const router = require('express').Router();
const db = require('../util/database');
const asyncRoute = require('../util/asyncRoute');
router.get('/showbloodbank', asyncRoute(async (req,res)=>{
  const result = await db.execute('select blood_bank_id,blood_bank_name,blood_group,amount from badhon.blood_bank');
  res.render('showbloodbank', {
    Name: result.rows.map(row=>row.blood_bank_name),
    ID: result.rows.map(row=>row.blood_bank_id),
    Bg: result.rows.map(row=>row.blood_group),
    Amount: result.rows.map(row=>row.amount)
  });
}));
module.exports = router;
