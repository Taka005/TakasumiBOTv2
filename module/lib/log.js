const db = require("../lib/db");
const config = require("../../config.json");
module.exports = {
  "message":async()=>{
    const data = await db(`SELECT * FROM count WHERE id = ${config.id} LIMIT 1;`);
    await db(`INSERT INTO count (id, message, command) VALUES("${config.id}","${Number(data[0].message)+1}","${data[0].command}");`);
  },
  "command":async()=>{
    const data = await db(`SELECT * FROM count WHERE id = ${config.id} LIMIT 1;`);
    await db(`INSERT INTO count (id, message, command) VALUES("${config.id}","${data[0].message}","${Number(data[0].command)+1}");`);
  }
}