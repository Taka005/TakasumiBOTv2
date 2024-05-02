module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const money = require("../../lib/money");
  const createId = require("../../lib/createId");
  const escape = require("../../lib/escape");
  const gifts = require("../../../file/gifts");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "gift"){
    if(interaction.options.getSubcommand() === "create"){
      const type = interaction.options.getString("type");

      const gift = gifts.find(gift=>gift.id === type);

      if(!gift) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "作成できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "存在しない商品です"
        }],
        ephemeral: true
      });

      const user = await money.get(interaction.user.id);

      if(user.amount<gift.price) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "作成できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "ギフトを送るための所持金が不足しています"
        }],
        ephemeral: true
      });

      const data = await db(`SELECT * FROM gift WHERE user = ${interaction.user.id};`);
      if(data.length>5) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "作成できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: `ギフトは5個までしか作成できません`
        }],
        ephemeral: true
      });

      const code = createId(10);

      await db(`INSERT INTO gift (id, type, user, time) VALUES("${code}","${gift.id}","${interaction.user.id}",NOW());`);
      await money.delete(interaction.user.id,gift.price);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${gift.name}(${gift.price}コイン)のギフトを作成しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `ギフトコード: \`${code}\``
        }],
        ephemeral: true
      });
    }else if(interaction.options.getSubcommand() === "get"){
      const code = interaction.options.getString("code");

      const data = await db(`SELECT * FROM gift WHERE id = ${escape(code)};`);
      if(!data[0]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: `不明なギフトコードです`
        }],
        ephemeral: true
      });

      const gift = gifts.find(gift=>gift.id === data.type);
      const user = await money.get(interaction.user.id);

      await db(`UPDATE money SET ${gift.type} = ${user[gift.type] + gift.amount} WHERE id = ${interaction.user.id}`);
      await db(`DELETE FROM gift WHERE id = ${data.id};`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${gift.name}のギフトを受け取りました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }else if(interaction.options.getSubcommand() === "list"){
      const data = await db(`SELECT * FROM gift WHERE user = ${interaction.user.id};`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `作成したギフト一覧`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: data.map(gift=>`${gifts.find(g=>g.id === gift.type).name} コード: ${gift.id}`).join("\n")
        }],
        ephemeral: true
      });
    }
  }
}