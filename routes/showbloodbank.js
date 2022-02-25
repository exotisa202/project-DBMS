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
        `select  BLOOD_BANK_ID,BLOOD_BANK_NAME,BLOOD_GROUP,AMOUNT  from badhon.Blood_bank `,[],
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
  router.get('/showbloodbank', async (req, res, next) => {
    await run();
    
  
    let Name = [], ID = [], Blood = [],Amount=[];
    for( let i = 0; i < rs.rows.length; i++){
      Name.push(rs.rows[i].BLOOD_BANK_NAME);
      ID.push(rs.rows[i].BLOOD_BANK_ID);
      Amount.push(rs.rows[i].AMOUNT);
      Blood.push(rs.rows[i].BLOOD_GROUP); 
      
    } 

  console.log(rs);
    res.render('showbloodbank.ejs', {
      
      title: 'Update bus Location',
      body: 'driver/update_bus_loc',
      partials: '../partials/messages',
      formPostUrl: '/driver/bus_position', 
      Name : Name,
      ID : ID, 
      Bg : Blood, 
      Amount: Amount
  }); 
});
module.exports=router;