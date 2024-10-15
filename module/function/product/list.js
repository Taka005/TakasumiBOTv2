module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const fetchUser = require("../../lib/fetchUser");
  if(interaction.options.getSubcommand() === "list"){
    const type = interaction.options.getString("type");

    if(type === "all"){
      const data = await db(`SELECT * FROM product ORDER BY RAND() LIMIT 25;`);
      if(!data[0]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "商品を表示できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "購入できる商品が存在しません"
        }],
        ephemeral: true
      });

      const list = await Promise.all(data.map(async(pro)=>{
        const user = await fetchUser(interaction.client,pro.id);
  
        return {
          name: `${pro.name} ${pro.price}コイン`,
          value: `商品ID: ${pro.id}\n出品者: ${user ? `${user.username}` : "不明"}(${pro.seller})`
        };
      }));

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "商品一覧",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: "ランダムな商品が表示されています",
          fields: list
        }]
      });
    }else{
      const data = await db(`SELECT * FROM product WHERE seller = "${interaction.user.id}";`);
      if(!data[0]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "作成した商品を表示できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "商品をまだ作成していません"
        }],
        ephemeral: true
      });

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "作成した商品一覧",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          fields: data.map(pro=>({
            name: `${pro.name} ${pro.price}コイン`,
            value: pro.content.lenght > 10 ? `${pro.content.slice(0,9)}...` : pro.content
          }))
        }],
        ephemeral: true
      });
    }
  }
}