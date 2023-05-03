const db = require("./db");
const config = require("../../config.json");
module.exports = {
  "message":async()=>{
    const data = await db(`SELECT * FROM count WHERE id = ${config.id} LIMIT 1;`);
    await db(`UPDATE count SET message=${Number(data[0].message)+1} WHERE id=${config.id};`);
  },
  "command":async()=>{
    const data = await db(`SELECT * FROM count WHERE id = ${config.id} LIMIT 1;`);
    await db(`UPDATE count SET command=${Number(data[0].command)+1} WHERE id=${config.id};`);
  }
}