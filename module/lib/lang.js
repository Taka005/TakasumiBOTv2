module.exports = class Lang{
  async set(guildId){
    const db = require("./db");
    this.setting = await db(`SELECT * FROM lang WHERE id = ${guildId} LIMIT 1;`);
  }

  get(path,option){
    const format = require("string-template");
    const ja = require("../../lang/ja.json");
    const en = require("../../lang/en.json");

    return format(path.split(".").reduce((obj,name)=>{
      return obj ? obj[name] : null
    },this.setting[0]?en:ja),option);
  }
}