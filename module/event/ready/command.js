module.exports = async(client)=>{
  const { Routes } = require("discord.js");
  const log = require("../../lib/log");
  const commands = require("../../../file/commandlist");

  await client.rest.put(Routes.applicationCommands(client.application.id),{
    body: Object.values(commands)
      .filter(command=>command.hasOwnProperty("data"))
      .map(command=>command.data)
  });

  log.info("コマンドをロードしました");
}