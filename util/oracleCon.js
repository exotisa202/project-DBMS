
const oracledb = require('oracledb');

async function run() {

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "badhon", password: "password", connectionString: "localhost/orcl" });

    console.log("Successfully connected to Oracle Database");

    // Insert some data

    const sql = `insert into badhon.login (user_name,password) values('bc','abc')`;


    //let result = await connection.execute(sql);

    //console.log(result.rowsAffected, "Rows Inserted");
   /* const sql = `insert into products (id, name, price, description) values(:1, :2, :3, :4)`;

    const rows =
      [[8, "p8", 100, "d8"],
      [9, "p9", 200, "d9"],
      [10, "p10", 300, "d10"]];

    let result = await connection.executeMany(sql, rows);

    console.log(result.rowsAffected, "Rows Inserted");

    connection.commit();*/
    let a={"user": "abc"};
    // Now query the rows 
    let result;
    result = await  connection.execute(
      `select  user_name,password from badhon.login where user_name = :user`, 
      a,
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    const rs = result.resultSet;
    let row;

    while ((row = await rs.getRow())) {
      console.log(row.user_name,row.password);
    }

    await rs.close();
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
module.exports=run;