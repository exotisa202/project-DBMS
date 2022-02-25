const path = require('path');

const express = require('express');
const oracledb = require('oracledb');

const rootDir = require('../util/path');

const router = express.Router();
let id,lod;
async function run() {
  let connection;
  try {
    connection = await oracledb.getConnection({ user: "badhon", password: "password", connectionString: "localhost/orcl" });

    console.log("Successfully connected to Oracle Database"); 
    const sql = `UPDATE badhon.donor
    SET last_date_of_donation = :1
    WHERE donor_ID = :2`;

    const rows =[[lod,id]];

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
router.get('/updatedonor', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'updatedonor.html'));
});
router.post('/updatedonor', (req, res, next) => { 
  lod=req.body.lod;
  id=req.body.id;
  run();
  res.redirect('/home');
});
module.exports = router;