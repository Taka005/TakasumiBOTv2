module.exports = async()=>{
  const fs = require("fs");

  global.messageCreate = await Promise.all(
    fs.readdirSync("./module/event/messageCreate")
      .map(file=>require(`../event/messageCreate/${file}`))
  );

  global.command = await Promise.all(
    fs.readdirSync("./module/function/command")
      .map(file=>require(`../function/command/${file}`))
  );

  global.interactionCreate = await Promise.all(
    fs.readdirSync("./module/event/interactionCreate")
      .map(file=>require(`../event/interactionCreate/${file}`))
  ); 

  global.auth = await Promise.all(
    fs.readdirSync("./module/function/auth")
      .map(file=>require(`../function/auth/${file}`))
  );

  global.slashcommand = await Promise.all(
    fs.readdirSync("./module/function/slashcommand")
      .map(file=>require(`../function/slashcommand/${file}`))
  );

  global.contextmenu = await Promise.all(
    fs.readdirSync("./module/function/contextmenu")
      .map(file=>require(`../function/contextmenu/${file}`))
  );
}