module.exports = async(client)=>{
  require("dotenv").config();
  const { REST, Routes, ApplicationRoleConnectionMetadataType } = require("discord.js");
  const log = require("../../lib/log");
  const commands = require("../../../file/commandlist");

  const rest = new REST({version:"10"})
    .setToken(process.env.BOT_TOKEN);

  await rest.put(Routes.applicationCommands(client.application.id),{
    body: Object.values(commands).map(command=>command.data)
  });

  await client.application.editRoleConnectionMetadataRecords([
    {
      name: "TakasumiBOT Account",
      description: "TakasumiBOT Accountとリンクします",
      key: "account",
      type: ApplicationRoleConnectionMetadataType.IntegerGreaterThanOrEqual
    }
  ]);

  log.info("コマンドをロードしました");
}