const mysql = require("mysql");
require("dotenv").config();
const connection = mysql.createConnection({
  host: "public.bfv4d.tky1.mdbs.jp",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "bfv4d_",
  multipleStatements: true
});  

module.exports = async(query)=>{
  const util = require("util");
  connection.query = util.promisify(connection.query);

  try{
    return await connection.query(query);
  }catch(error){
    console.log(`\x1b[31mDB: ${error}\x1b[39m`);
    return [];
  }
}