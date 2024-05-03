module.exports = async(interaction)=>{
  const { AttachmentBuilder } = require("discord.js");
  const db = require("../../lib/db");
  if(interaction.options.getSubcommand() === "db"){
    const query = interaction.options.getString("query");

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