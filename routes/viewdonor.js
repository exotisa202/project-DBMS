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
        `select  donor_name,phone_number,location,blood_group,last_date_of_donation from badhon.donor `,[],
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
  router.get('/donorlist', async (req, res, next) => {
    await run();
    
  
    let Name = [], Contact = [], Location = [], Blood = [],Dates=[];
    for( let i = 0; i < rs.rows.length; i++){
      Name.push(rs.rows[i].DONOR_NAME);
      Contact.push(rs.rows[i].PHONE_NUMBER);
      Location.push(rs.rows[i].LOCATION);
      Blood.push(rs.rows[i].BLOOD_GROUP);
      Dates.push(rs.rows[i].LAST_DATE_OF_DONATION);
      
    }
    console.log(Name)
    console.log(Contact)
    console.log(Location)
    console.log(Blood)
  
  
  console.log(rs);
    res.render('showdonor.ejs', {
      
      title: 'Update bus Location',
      body: 'driver/update_bus_loc',
      partials: '../partials/messages',
      formPostUrl: '/driver/bus_position', 
      Name : Name,
      Contact : Contact,
      Location : Location,
      Blood : Blood,
      Dates:Dates
  }); 
});
module.exports=router;