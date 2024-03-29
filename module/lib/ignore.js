const db = require("./db");

module.exports = {
  enable:async(guildId,type)=>{
    if(type){
      await db(`INSERT INTO \`ignore\` (id, ${type}, time) VALUES("${guildId}",true,NOW()) ON DUPLICATE KEY UPDATE id = VALUES (id), ${type} = VALUES(${type}), time = VALUES (time);`);
    }else{
      await db(`INSERT INTO \`ignore\` (id, bump, dissoku, up, expand, time) VALUES("${guildId}",true,true,true,true,NOW()) ON DUPLICATE KEY UPDATE id = VALUES (id), bump = VALUES(bump), dissoku = VALUES(dissoku), up = VALUES(up), expand = VALUES(expand), time = VALUES (time);`);
    }
  },
  disable:async(guildId,type)=>{
    if(type){
      await db(`INSERT INTO \`ignore\` (id, ${type}, time) VALUES("${guildId}",false,NOW()) ON DUPLICATE KEY UPDATE id = VALUES (id), ${type} = VALUES(${type}), time = VALUES (time);`);
    }else{
      await db(`DELETE FROM \`ignore\` WHERE id = ${guildId};`);
    }
  },
  check:async(guildId,type)=>{
    const data = await db(`SELECT * FROM \`ignore\` WHERE id = ${guildId};`);

    if(!data[0]) return false;

    return data[0][type];
  },
  isAllDisable:async(guildId)=>{
    const data = await db(`SELECT * FROM \`ignore\` WHERE id = ${guildId};`);

    if(!data[0]) return false;

    for(let key in data[0]){
      if(typeof data[0][key] === "number"&&data[0][key] === 1){
        return false;
      }
    }

    return true;
  }
}