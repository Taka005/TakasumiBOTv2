require("dotenv").config();
const db = require("./db");
module.exports = {
  "message":async()=>{
    const data = await db(`SELECT * FROM count WHERE id = ${process.env.ID};`);
    await db(`UPDATE count SET message=${Number(data[0].message)+1} WHERE id=${process.env.ID};`);
  },
  "command":async()=>{
    const data = await db(`SELECT * FROM count WHERE id = ${process.env.ID};`);
    await db(`UPDATE count SET command=${Number(data[0].command)+1} WHERE id=${process.env.ID};`);
  }
}