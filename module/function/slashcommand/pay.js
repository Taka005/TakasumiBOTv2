module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const money = require("../../lib/money");
  const products = require("../../../file/products");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "pay"){
    const type = interaction.options.getString("type");
    const count = interaction.options.getInteger("count");

    const product = products.find(pro=>pro.id === type);

    if(!product) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "購入できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "存在しない商品です"
      }],
      ephemeral: true
    });

    const data = await money.get(interaction.user.id);

    if(data.amount<count*product.price||count<=0) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "購入できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "購入する回数は所持金の範囲内にする必要があります"
      }],
      ephemeral: true
    });

    const total = data[product.id] + count;
    if(total>product.limit) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "購入できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: `${product.name}は${product.limit}回までしか購入できません`
      }],
      ephemeral: true
    });

    await db(`UPDATE money SET ${product.id} = ${total} WHERE id = ${interaction.user.id}`);
    await money.delete(interaction.user.id,count*product.price,`${product.name}を${count}個購入`);
    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${product.name}を${count}回分(${count*product.price}コイン)購入しました`,
          icon_url: "https://cdn.takasumibot.com/images/system/success.png"
        }
      }]
    });
  }
}