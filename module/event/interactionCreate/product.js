module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  const createId = require("../../lib/createId");
  const db = require("../../lib/db");
  const escape = require("../../lib/escape");
  const time = require("../../lib/time");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId.startsWith("create")){
    const name = interaction.fields.getTextInputValue("name");
    const price = interaction.fields.getTextInputValue("price");
    const content = interaction.fields.getTextInputValue("content");

    const product = await db(`SELECT * FROM product WHERE seller = ${interaction.user.id};`);
    if(product.length>7) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "商品を作成できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "商品は8個までしか作成できません"
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

    const history = await db(`SELECT * FROM history WHERE user = ${interaction.user.id} and reason = "借金の返済" ORDER BY time DESC;`);
    if(history[0]&&new Date() - history[0].time <= 86400000) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "作成できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: `借金を返済してから1日経過しないと作成できません\n次に実行できるまであと${time(86400000 - (new Date() - history[0].time))}です`
      }],
      ephemeral: true
    });

    const data = await money.get(interaction.user.id);

    if(isNaN(price)||!Number.isInteger(Number(price))||price < 10) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "商品を作成できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "値段を整数値かつ10コイン以上にしてください"
      }],
      ephemeral: true
    });

    if(price>data.amount) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "商品を作成できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "値段を所持金以下の値にしてください"
      }],
      ephemeral: true
    });

    await db(`INSERT INTO product (id, name, content, price, seller, time) VALUES("${createId(10)}","${escape(name)}","${escape(content)}","${escape(price)}","${interaction.user.id}",NOW());`);
    await money.delete(interaction.user.id,Math.floor(price*0.1),"商品の作成手数料");

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${name}(${price}コイン)を作成しました`,
          icon_url: "https://cdn.takasumibot.com/images/system/success.png"
        },
        description: content
      }],
      ephemeral: true
    });
  }
}