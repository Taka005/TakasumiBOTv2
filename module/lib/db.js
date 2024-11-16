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

module.exports = async(query)=>{
  //connection.query = util.promisify(connection.query);
  const now = new Date();
  fs.appendFileSync("./tmp/db.log",`[${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] ${query}\n`,"utf8");
  return await new Promise((resolve,reject) => {
    connection.query(query, function(error,results) {
    	if (error?.fatal) { //fatal errorが発生したときに自動的に再接続をする。fetal errorのほとんどが再接続で直る
      	const reconnectInterval = setInterval(() => {
      		connection = mysql.createConnection({
      		  host: config.database.host,
      		  database: config.database.name,
        		user: process.env.DB_USER,
        	  password: process.env.DB_PASSWORD,
        	  charset: "utf8mb4"
      		});
      		connection.connect(function (error) {
      		  if (error) {
          		log.error("Failed to reconnect to the SQL server.\n"+error);
              reject([])
        	  } else {
        			log.info("Succeeded in reconnecting to the SQL server.");
              connection.query(query, function(error,results) { //再接続したらもう一度実行する
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
    	  log.error(error); //fatalではないエラー
        reject([])
    	} else {
        resolve(results); //正常
      }
    });
  })
}
