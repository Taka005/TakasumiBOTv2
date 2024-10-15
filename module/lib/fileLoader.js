module.exports = async()=>{
  const fs = require("fs");
  const log = require("./log");

  const files = await Promise.all([
    fs.readdirSync("./module/event/messageCreate")
      .map(file=>require(`../event/messageCreate/${file}`)),
    fs.readdirSync("./module/function/command")
      .map(file=>require(`../function/command/${file}`)),
    fs.readdirSync("./module/event/interactionCreate")
      .map(file=>require(`../event/interactionCreate/${file}`)),
    fs.readdirSync("./module/function/auth")
      .map(file=>require(`../function/auth/${file}`)),
    fs.readdirSync("./module/function/slashcommand")
      .map(file=>require(`../function/slashcommand/${file}`)),
    fs.readdirSync("./module/function/contextmenu")
      .map(file=>require(`../function/contextmenu/${file}`)),
    fs.readdirSync("./module/function/admin")
      .map(file=>require(`../function/admin/${file}`)),
    fs.readdirSync("./module/function/setting")
      .map(file=>require(`../function/setting/${file}`)),
    fs.readdirSync("./module/function/product")
      .map(file=>require(`../function/product/${file}`))
  ]);

  global.messageCreate = files[0];
  global.command = files[1];
  global.interactionCreate = files[2];
  global.auth = files[3];
  global.slashcommand = files[4];
  global.contextmenu = files[5];
  global.admin = files[6];
  global.setting = files[7];
  global.product = files[8]

  log.info("ファイルをロードしました");
}