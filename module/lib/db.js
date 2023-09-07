const mysql = require("mysql");
const util = require("util");
require("dotenv").config();
const connection = mysql.createConnection({
  host: "public.bfv4d.tky1.mdbs.jp",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "bfv4d_",
  charset: "utf8mb4"
});

module.exports = async(query)=>{
  connection.query = util.promisify(connection.query);
  try{
    return await connection.query(query);
  }catch(error){
    console.log(`\x1b[31mDB: ${error}\x1b[39m`);
    return [];
  }
}