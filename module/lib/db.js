const mysql = require("mysql");
const util = require("util");
const fs = require("fs");
require("dotenv").config();
const log = require("./log");
const config = require("../../config.json");

let connection = mysql.createConnection({
  host: config.database.host,
  database: config.database.name,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  charset: "utf8mb4"
});

connection.on("error",error => {
  reconnect(error)
})

function reconnect(error) {
  if (error?.fetal || error?.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
    connection = mysql.createConnection({
      host: config.database.host,
      database: config.database.name,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      charset: "utf8mb4"
    });
    connection.on("error", (error) => {
      setTimeout(() => reconnect(error),750)
    })
    connection.connect(function (error) {
      if (error) {
        log.error("Failed to reconnect to the SQL server.\n"+error);
      } else {
        log.info("Succeeded in reconnecting to the SQL server.");
      }
    })
  }
}

module.exports = async(query)=>{
  const now = new Date();
  fs.appendFileSync("./tmp/db.log",`[${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] ${query}\n`,"utf8");
  return await new Promise((resolve,reject) => {
    connection.query(query, function(error,results) {
      if (error?.fatal || error?.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
        const reconnectInterval = setInterval(() => {
          connection = mysql.createConnection({
            host: config.database.host,
            database: config.database.name,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            charset: "utf8mb4"
          });
          connection.on("error", (error) => {
            setTimeout(() => reconnect(error),750)
          })
          connection.connect(function (error) {
            if (error) {
              log.error("Failed to reconnect to the SQL server.\n"+error);
              reject([])
            } else {
              log.info("Succeeded in reconnecting to the SQL server.");
              connection.query(query, function(error,results) {
                if (error) {
                  log.error(error);
                  reject([])
                } else {
                  resolve(results);
                }
                clearInterval(reconnectInterval);
              })
            }
          })
        }, 750)
      } else if (error) {
        log.error(error);
        reject([])
      } else {
        resolve(results);
      }
    });
  })
}
