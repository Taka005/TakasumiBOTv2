require("dotenv").config();
const db = require("./db");

module.exports = {
  "message":async()=>{
    await db(`UPDATE count SET message = message + 1 WHERE id = ${process.env.ID};`);
  },
  "command":async()=>{
    await db(`UPDATE count SET command = command + 1 WHERE id = ${process.env.ID};`);
  }
}