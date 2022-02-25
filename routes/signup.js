const path = require('path');

const express = require('express');
const oracledb = require('oracledb');



const rootDir = require('../util/path'); 

const router = express.Router();
router.get('/',(req,res,next)=>{
  res.redirect('/login'); 
})
let name,password,email;
let bool;

async function run() {
  let connection;
  try {
    connection = await oracledb.getConnection({ user: "badhon", password: "password", connectionString: "localhost/orcl" });

    console.log("Successfully connected to Oracle Database");

    // Insert some data

    //const sql = `insert into badhon.login (user_name,password) values('bc','abc')`;


    //let result = await connection.execute(sql);

    //console.log(result.rowsAffected, "Rows Inserted");
    const sql = `insert into badhon.login (user_name,password,email) values(:1, :2, :3)`;

    const rows =[[name,password,email]];

    let result = await connection.executeMany(sql, rows);

    console.log(result.rowsAffected, "Rows Inserted");
    if(result.rowsAffected>=0){
      bool=true;
    }

    connection.commit();
    /*let a="abc";
    // Now query the rows 
    let result;
    result = await  connection.execute(
      `select  user_name,password from badhon.login where user_name = ?`, 
      [a],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    const rs = result.resultSet;
    let row;

    while ((row = await rs.getRow())) {
      console.log(row.user_name,row.password);
    }

    await rs.close();*/

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
router.post('/',async (req, res, next) => {
  name=req.body.username;
  console.log(name);
  password=req.body.password;
  email=req.body.email;

 await run();
  if(bool){
    res.redirect('/home');
  }
  else {
    res.redirect('/wlogin');
  }
 
});

module.exports = router;
