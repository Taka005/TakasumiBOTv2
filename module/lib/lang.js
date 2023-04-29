module.exports = async(guildId,text)=>{
  const db = require("./db");
  const ja = require("../../lang/ja.json");
  const en = require("../../lang/en.json");

  const lang = await db(`SELECT * FROM lang WHERE id = ${guildId} LIMIT 1;`);
  if(lang[0]){
    return en[text];
  }else{
    return ja[text];
  }
}