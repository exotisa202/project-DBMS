const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const oracledb = require('oracledb');
const router = express.Router();
let rs;

async function run() {
    let connection;
    try {
      connection = await oracledb.getConnection({ user: "badhon", password: "password", connectionString: "localhost/orcl" });
  
      console.log("Successfully connected to Oracle Database");
  
      // Insert some data
      rs = await  connection.execute(
        `select   name, location,blood_group,hospital,phone,email  from badhon.request `,[],
        {outFormat: oracledb.OUT_FORMAT_OBJECT });
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
  router.get('/showreq', async (req, res, next) => {
    await run();
    
  
    let Name = [],  Location = [], Blood = [],Email=[],Hospital=[],Phone=[];
    for( let i = 0; i < rs.rows.length; i++){
      Name.push(rs.rows[i].NAME);
      Phone.push(rs.rows[i].PHONE );
      Location.push(rs.rows[i].LOCATION);
      Blood.push(rs.rows[i].BLOOD_GROUP);
     Email.push(rs.rows[i].EMAIL);
     Hospital.push(rs.rows[i].HOSPITAL);
      
    } 
  
  
  console.log(rs);
    res.render('showreq.ejs', {
      
      title: 'Update bus Location',
      body: 'driver/update_bus_loc',
      partials: '../partials/messages',
      formPostUrl: '/driver/bus_position', 
      Name : Name,
      Phone : Phone,
      Location : Location,
      Blood : Blood,
      Hospital:Hospital,
      Email:Email
  }); 
});
module.exports=router;