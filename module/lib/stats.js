const db = require("./db");

module.exports = {
  "message":async(guildId)=>{
    const data = await db(`SELECT * FROM stats WHERE id = ${guildId};`);
    if(data[0]){
      await db(`UPDATE stats SET message = ${data[0].message+1} WHERE id = ${data[0].id};`);
    }
  },
  "join":async(guildId)=>{
    const data = await db(`SELECT * FROM stats WHERE id = ${guildId};`);
    if(data[0]){
      await db(`UPDATE stats SET \`join\` = ${data[0].join+1} WHERE id = ${data[0].id};`);
    }
  },
  "leave":async(guildId)=>{
    const data = await db(`SELECT * FROM stats WHERE id = ${guildId};`);
    if(data[0]){
      await db(`UPDATE stats SET \`leave\` = ${data[0].leave+1} WHERE id = ${data[0].id};`);
    }
  }
}