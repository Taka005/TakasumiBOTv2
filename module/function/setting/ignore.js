module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const ignore = require("../../lib/ignore");
  if(interaction.options.getSubcommand() === "ignore"){
    const type = interaction.options.getString("type");

    const types = {
      "bump": "Bump通知",
      "dissoku": "Dissoku通知",
      "up": "UP通知",
      "expand": "メッセージ展開"
    }

    if(type === "all"){
      const data = await db(`SELECT * FROM \`ignore\` WHERE id = ${interaction.guild.id};`);
      if(!data[0]){
        await ignore.enable(interaction.guild.id);

        await db(`DELETE FROM bump WHERE id = ${interaction.guild.id};`);
        await db(`DELETE FROM dissoku WHERE id = ${interaction.guild.id};`);
        await db(`DELETE FROM up WHERE id = ${interaction.guild.id};`);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "全て無効にしました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }else{
        await ignore.disable(interaction.guild.id);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "全て有効にしました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }
    }else{
      const check = await ignore.check(interaction.guild.id,type);
      if(!check){
        await ignore.enable(interaction.guild.id,type);

        if(type === "bump"){
          await db(`DELETE FROM bump WHERE id = ${interaction.guild.id};`);
        }else if(type === "dissoku"){
          await db(`DELETE FROM dissoku WHERE id = ${interaction.guild.id};`);
        }else if(type === "up"){
          await db(`DELETE FROM up WHERE id = ${interaction.guild.id};`);
        }

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${types[type]}を無効にしました`,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }else{
        await ignore.disable(interaction.guild.id,type);

        if(await ignore.isAllDisable(interaction.guild.id)){
          await ignore.disable(interaction.guild.id);
        }

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${types[type]}を有効にしました`,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }
    }
  }
}