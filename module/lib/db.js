const mysql = require("mysql");
const util = require("util");
require("dotenv").config();
const pool = mysql.createPool({
  host: "public.bfv4d.tky1.mdbs.jp",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "bfv4d_"
});
pool.getConnection = util.promisify(pool.getConnection);

module.exports = async(query)=>{
  const connection = await pool.getConnection();
  connection.query = util.promisify(connection.query);
  try{
    return await connection.query(query);
  }catch(error){
    console.log(`\x1b[31mDB: ${error}\x1b[39m`);
    return [];
  }finally{
    connection.release();
  }
}