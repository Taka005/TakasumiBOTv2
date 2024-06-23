module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(interaction.options.getSubcommand() === "stats"){

    const data = await db(`SELECT * FROM stats WHERE id = ${interaction.guild.id};`);
    if(!data[0]){
      await db(`INSERT INTO stats (id, message, react, \`join\`, \`leave\`, time) VALUES("${interaction.guild.id}","0","0","0","0",NOW());`);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "統計情報の収集を有効にしました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }else{
      await db(`DELETE FROM stats WHERE id = ${interaction.guild.id};`);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "統計情報の収集を無効にしました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }
  }
}