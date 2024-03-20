module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const money = require("../../lib/money");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "pay"){
    const type = interaction.options.getString("type");
    const count = interaction.options.getInteger("count");

    if(type === "yellow"){
      const data = await money.get(interaction.user.id);

      if(data.amount<count*10||count<3) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "購入する回数は3以上かつ所持金の範囲内にする必要があります"
        }],
        ephemeral: true
      });

      const total = data.yellow + count;
      if(total>300) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "300回までしか購入できません"
        }],
        ephemeral: true
      });

      await db(`UPDATE money SET yellow = ${total} WHERE id = ${interaction.user.id}`);
      await money.delete(interaction.user.id,count*10);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${count}回分(${count*10}コイン)を購入しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }else if(type === "red"){
      const data = await money.get(interaction.user.id);

      if(data.amount<count*100||count<1) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "購入する回数は1以上かつ所持金の範囲内にする必要があります"
        }],
        ephemeral: true
      });

      const total = data.red + count;
      if(total>300) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "300回までしか購入できません"
        }],
        ephemeral: true
      });

      await db(`UPDATE money SET red = ${total} WHERE id = ${interaction.user.id}`);
      await money.delete(interaction.user.id,count*100);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${count}回分(${count*100}コイン)を購入しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }else if(type === "blue"){
      const data = await money.get(interaction.user.id);

      if(data.amount<count*800||count<1) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "購入する回数は1以上かつ所持金の範囲内にする必要があります"
        }],
        ephemeral: true
      });

      const total = data.blue + count;
      if(total>300) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "300回までしか購入できません"
        }],
        ephemeral: true
      });

      await db(`UPDATE money SET blue = ${total} WHERE id = ${interaction.user.id}`);
      await money.delete(interaction.user.id,count*800);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${count}回分(${count*800}コイン)を購入しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }
  }
}