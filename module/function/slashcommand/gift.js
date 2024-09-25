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

      const debt = await db(`SELECT * FROM debt WHERE id = ${interaction.user.id};`);
      if(debt[0]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "作成できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "借金しているため、作成できません"
        }],
        ephemeral: true
      });

      const history = await db(`SELECT * FROM history WHERE user = ${interaction.user.id} and reason = "ギフトの作成" ORDER BY time DESC;`);
      if(history[0]&&new Date() - history[0].time <= 60000) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "作成できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: `次に実行できるまであと${time(60000 - (new Date() - history[0].time))}です`
        }],
        ephemeral: true
      });

      const user = await money.get(interaction.user.id);

      const comission = Math.round(gift.price*0.1);

      if(user.amount<gift.price+comission) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "作成できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "ギフトを送るための所持金が不足しています\n作成には作成する金額の10%の手数料が必要です"
        }],
        ephemeral: true
      });

      const data = await db(`SELECT * FROM gift WHERE user = ${interaction.user.id};`);
      if(data.length>=5) return await interaction.reply({
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
      await money.delete(interaction.user.id,gift.price,"ギフトの作成");
      await money.delete(interaction.user.id,comission,"ギフトの作成手数料");
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${gift.id}コインのギフトを作成しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `https://gift.takasumibot.com/${code}`
        }],
        ephemeral: true
      });
    }else if(interaction.options.getSubcommand() === "get"){
      const code = interaction.options.getString("code");

      const id = code.match(/\/([^/]+)$/);

      const data = (await db(`SELECT * FROM gift WHERE id = "${escape(id ? id[1] : code)}";`))[0];
      if(!data) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "不明なギフトコードです"
        }],
        ephemeral: true
      });

      const gift = gifts.find(gift=>gift.id === data.type);

      if(!gift) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "存在しない商品です"
        }],
        ephemeral: true
      });

      await money.add(interaction.user.id,gift.price,"ユーザーからのギフト");
      await db(`DELETE FROM gift WHERE id = "${data.id}";`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${gift.id}コインのギフトを受け取りました`,
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
          description: data.map(gift=>`${gift.type}コイン https://gift.takasumibot.com/${gift.id}`).join("\n")
        }],
        ephemeral: true
      });
    }
  }
}
