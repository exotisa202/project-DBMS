const path = require('path');

const express = require('express');
const oracledb = require('oracledb');

const rootDir = require('../util/path');

const router = express.Router();

let name,email,id,number,location,bg,dob,lod;
let bool;

async function run() {
  let connection;
  try {
    connection = await oracledb.getConnection({ user: "badhon", password: "password", connectionString: "localhost/orcl" });

    console.log("Successfully connected to Oracle Database"); 
    const sql = `insert into badhon.donor(donor_id,donor_name,birth_date,blood_group,LAST_DATE_OF_DONATION,phone_number,email,location) values(:1, :2, :3,:4,:5,:6,:7,:8)`;

    const rows =[[id,name,dob,bg,lod,number,email,location]];

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
router.get('/donor', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'donor.html'));
});
router.post('/donor', (req, res, next) => { 
  name=req.body.name;
  id=req.body.id;
  number=req.body.phone;
  email=req.body.email;
  location=req.body.location;
  bg=req.body.blg;
  dob=req.body.dob;
  lod=req.body.lod;
  run();
  res.redirect('/home');
});
module.exports = router;