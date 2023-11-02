const fs = require("fs");

module.exports = {
  "info":(str)=>{
    const now = new Date();
    console.log(`\x1b[32m[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [INFO] ${str}\x1b[39m`);

    fs.appendFileSync("./tmp/app.log",`[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [INFO] ${str}\n`,"utf8");
  },
  "warn":(str)=>{
    const now = new Date();
    console.warn(`\x1b[33m[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [WARN] ${str}\x1b[39m`);

    fs.appendFileSync("./tmp/app.log",`[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [WARN] ${str}\n`,"utf8");
  },
  "error":(str)=>{
    const now = new Date();
    console.error(`\x1b[31m[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [ERROR] ${str}\x1b[39m`);

    fs.appendFileSync("./tmp/app.log",`[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [ERROR] ${str}\n`,"utf8");
  },
  "debug":(str)=>{
    const now = new Date();
    console.debug(`\x1b[34m[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [DEBUG] ${str}\x1b[39m`);

    fs.appendFileSync("./tmp/app.log",`[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [DEBUG] ${str}\n`,"utf8");
  },
  "reset":()=>{
    fs.writeFileSync("./tmp/app.log","","utf-8");
  }
}