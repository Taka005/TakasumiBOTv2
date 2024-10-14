module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const money = require("../../lib/money");
  if(interaction.options.getSubcommand() === "pay"){
    const id = interaction.options.getString("id");

    const product = (await db(`SELECT * FROM product WHERE id = "${id}";`))[0];

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

    if(data.amount<product.price) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "購入できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "所持金が不足しています"
      }],
      ephemeral: true
    });

    await money.add(product.seller,product.price,`${product.name}の売り上げ`);
    await money.delete(interaction.user.id,product.price,`${product.name}の購入`);
    await db(`DELETE FROM product WHERE id = "${product.id}";`);
    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${product.name}(${product.price}コイン)を購入しました`,
          icon_url: "https://cdn.takasumibot.com/images/system/success.png"
        },
        description: product.content
      }],
      ephemeral: true
    });
  }
}