const fs = require("fs");

module.exports = {
  "info":(message)=>{
    const now = new Date();
    console.log(`\x1b[32m[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [INFO] ${message}\x1b[39m`);

    fs.appendFileSync("./tmp/app.log",`[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [INFO] ${message}\n`,"utf8");
  },
  "warn":(message)=>{
    const now = new Date();
    console.warn(`\x1b[33m[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [WARN] ${message}\x1b[39m`);

    fs.appendFileSync("./tmp/app.log",`[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [WARN] ${message}\n`,"utf8");
  },
  "error":(message)=>{
    const now = new Date();
    console.error(`\x1b[31m[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [ERROR] ${message}\x1b[39m`);

    fs.appendFileSync("./tmp/app.log",`[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [ERROR] ${message}\n`,"utf8");
  },
  "debug":(message)=>{
    const now = new Date();
    console.debug(`\x1b[34m[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [DEBUG] ${message}\x1b[39m`);

    fs.appendFileSync("./tmp/app.log",`[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [DEBUG] ${message}\n`,"utf8");
  },
  "reset":()=>{
    fs.writeFileSync("./tmp/app.log","","utf-8");
    fs.writeFileSync("./tmp/db.log","","utf-8");
  }
}