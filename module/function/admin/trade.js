module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  require("dotenv").config();
  if(interaction.options.getSubcommand() === "trade"){
    const type = interaction.options.getString("type");
    const count = interaction.options.getInteger("count");

    const price = (await db(`SELECT * FROM count WHERE id = ${process.env.ID};`))[0].stock;

    if(type === "add"){
      await db(`UPDATE count SET stock = stock + ${count} WHERE id = ${process.env.ID}`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `株価を${price}コインから${price + count}コインに変更しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }else if(type === "delete"){
      await db(`UPDATE count SET stock = stock - ${count} WHERE id = ${process.env.ID}`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `株価を${price}コインから${price - count}コインに変更しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }else if(type === "set"){
      await db(`UPDATE count SET stock = ${count} WHERE id = ${process.env.ID}`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `株価を${price}コインから${count}コインに変更しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }
  }
}