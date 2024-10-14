module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  const createId = require("../../lib/createId");
  const db = require("../../lib/db");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId.startsWith("create")){
    const name = interaction.fields.getTextInputValue("name");
    const price = interaction.fields.getTextInputValue("price");
    const content = interaction.fields.getTextInputValue("content");

    const data = await money.get(interaction.user.id);

    if(isNaN(price)&&price>data.amount) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "商品を作成できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "値段を数字かつ所持金以下の値にしてください"
      }],
      ephemeral: true
    });

    await db(`INSERT INTO product (id, name, content, price, seller, time) VALUES("${createId(10)}","${name}","${content}","${price}","${interaction.user.id}",NOW());`);

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