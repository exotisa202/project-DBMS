const path = require('path');

const express = require('express');
const oracledb = require('oracledb');

const rootDir = require('../util/path');

const router = express.Router();
let id,name,bg,amount;
async function run() {
  let connection;
  try {
    connection = await oracledb.getConnection({ user: "badhon", password: "password", connectionString: "localhost/orcl" });

    console.log("Successfully connected to Oracle Database"); 
    const sql = `insert into badhon.blood_bank(blood_bank_id,blood_bank_name,blood_group,amount) values(:1, :2, :3,:4)`;

    const rows =[[id,name,bg,amount]];

     let result = await connection.executeMany(sql, rows);

    console.log(result.rowsAffected, "Rows Inserted");
    if(result.rowsAffected>=0){
      console.log("successful");
      bool=true;
    }

    connection.commit();

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
}
} 
router.get('/bloodbank', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'bloodbankup.html'));
});
router.post('/bloodbank', (req, res, next) => { 
  name=req.body.name;
  id=req.body.id;
  amount=req.body.amount;
  bg=req.body.bg;
  run();
  res.redirect('/home');
});
module.exports = router;