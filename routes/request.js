const path = require('path');

const express = require('express');
const oracledb = require('oracledb');

const rootDir = require('../util/path');

const router = express.Router();

let name,email, number,location,bg,hospital;
let bool;

async function run() {
  let connection;
  try {
    connection = await oracledb.getConnection({ user: "badhon", password: "password", connectionString: "localhost/orcl" });

    console.log("Successfully connected to Oracle Database"); 
    const sql = `insert into badhon.request( name,location,hospital ,phone ,email, blood_group) values(:1, :2, :3,:4,:5,:6 )`;

    const rows =[[ name, location,hospital, number,email,bg]];

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
router.get('/request', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'request.html'));
});
router.post('/request', (req, res, next) => { 
  name=req.body.name; 
  number=req.body.phone;
  email=req.body.email;
  location=req.body.location;
  bg=req.body.bg;
  hospital=req.body.hospital; 
  run();
  res.redirect('/donorlist');
});
module.exports = router;