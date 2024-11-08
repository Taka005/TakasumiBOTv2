const mysql = require("mysql");
const util = require("util");
const fs = require("fs");
require("dotenv").config();
const log = require("./log");
const config = require("../../config.json");

const connection = mysql.createConnection({
  host: config.database.host,
  database: config.database.name,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  charset: "utf8mb4"
});

module.exports = async(query)=>{
  connection.query = util.promisify(connection.query);

  try{
    const now = new Date();
    fs.appendFileSync("./tmp/db.log",`[${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] ${query}\n`,"utf8");

    return await connection.query(query);
  }catch(error){
    log.error(error);

    return [];
  }
}