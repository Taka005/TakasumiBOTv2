module.exports = async(interaction)=>{
  const { AttachmentBuilder } = require("discord.js");
  const db = require("../../lib/db");
  if(interaction.options.getSubcommand() === "db"){
    const query = interaction.options.getString("query");

    const data = JSON.stringify(await db(query),null,"  ");

    try{
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "実行しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `\`\`\`json\n${data}\`\`\``
        }]
      });
    }catch{
      await interaction.reply({
        files:[
          new AttachmentBuilder()
            .setFile(Buffer.from(data,"UTF-8"))
            .setName("DB.json")
        ]
      });
    }
  }
}