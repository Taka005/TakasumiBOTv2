module.exports = async(guildId,text,option)=>{
  const format = require("string-template");
  const db = require("./db");
  const ja = require("../../lang/ja.json");
  const en = require("../../lang/en.json");

  const path = text.split(".");

  const lang = await db(`SELECT * FROM lang WHERE id = ${guildId} LIMIT 1;`);
  if(lang[0]){
    return format(path.reduce((obj,name)=>{
      return obj ? obj[name] : null
    },en),option);
  }else{
    return format(path.reduce((obj,name)=>{
      return obj ? obj[name] : null
    },ja),option);
  }
}