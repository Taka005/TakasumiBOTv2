module.exports = async(client)=>{
  require("dotenv").config();
  const { REST, Routes } = require("discord.js");
  const log = require("../../lib/log");
  const commands = require("../../../file/commandlist");

  const rest = new REST({version:"10"})
    .setToken(process.env.BOT_TOKEN);
            
  await rest.put(Routes.applicationCommands(client.application.id),{ 
    body: Object.values(commands).map(command=>command.data)
  });

  log.info("コマンドをロードしました")
}