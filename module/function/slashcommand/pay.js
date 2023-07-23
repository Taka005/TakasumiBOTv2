module.exports = async(interaction)=>{
  const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const money = require("../../lib/money");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "pay"){
    const type = interaction.options.getString("type");
    const count = interaction.options.getInteger("count");

    if(type === "gc"){
      const data = await money.get(interaction.user.id);
      if(Number(data.mount)-(count*10)<0||count<1) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "購入する回数は1以上かつ所持金の範囲内にする必要があります"
        }]
      });

      const total = Number(data.gc) + count;
      if(total>300) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "1人300回までしか購入できません"
        }]
      });

      await db(`UPDATE money SET gc = ${total} WHERE id = ${interaction.user.id}`);
      await money.delete(interaction.user.id,count*10);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${count}回分を購入しました`,
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: "グローバルチャットの表示色が変更されます"
        }]
      });
    }
  }
}
