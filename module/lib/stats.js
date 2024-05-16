const db = require("./db");

module.exports = {
  "message":async(guildId)=>{
    await db(`UPDATE stats SET message = message + 1 WHERE id = ${guildId};`);
  },
  "join":async(guildId)=>{
    await db(`UPDATE stats SET \`join\` = \`join\` + 1 WHERE id = ${guildId};`);
  },
  "leave":async(guildId)=>{
    await db(`UPDATE stats SET \`leave\` = \`leave\` + 1 WHERE id = ${guildId};`);
  }
}