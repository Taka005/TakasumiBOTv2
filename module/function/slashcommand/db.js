module.exports = async(interaction)=>{
  const { AttachmentBuilder, Colors } = require("discord.js");
  const { admin } = require("../../../config.json");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "db"){
    const query = interaction.options.getString("query");

    if(interaction.user.id !== admin) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドは関係者以外実行できません"
      }],
      ephemeral: true
    });

    const data = JSON.stringify(await db(query),null,"  ");
    await interaction.reply({
      files:[
        new AttachmentBuilder()
          .setFile(Buffer.from(data,"UTF-8")) 
          .setName("DB.json")
      ]
    });
  }
}