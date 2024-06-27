module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  const db = require("../../lib/db");
  const fetchUser = require("../../lib/fetchUser");
  const products = require("../../../file/products");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "money"){
    const id = interaction.options.getString("id");

    const rank = (await db("SELECT * FROM money;"))
      .sort((m1,m2)=>m2.amount - m1.amount)
      .map(m=>m.id);

    if(!id){
      const data = await money.get(interaction.user.id);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${interaction.user.tag}の持ち物`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          fields:[
            {
              name: "残高",
              value: `${data.amount}コイン`
            },
            {
              name: "アイテム",
              value: `${products.map(pro=>`${pro.name}: ${data[pro.id]}`).join("\n")}\n株: ${data.stock}個`,
            },
            {
              name: "順位",
              value: `${rank.indexOf(interaction.user.id)+1}/${rank.length}位`
            }
          ]
        }]
      });
    }else{
      const userId = id.match(/\d{17,19}/g);
      if(!userId) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "ユーザーID、メンションを入力してください"
        }],
        ephemeral: true
      });

      const user = await fetchUser(interaction.client,userId[0]);
      if(!user) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "指定したユーザーが存在しません"
        }],
        ephemeral: true
      });

      const data = await money.get(user.id);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${user.tag}の持ち物`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          fields:[
            {
              name: "残高",
              value: `${data.amount}コイン`
            },
            {
              name: "アイテム",
              value: `${products.map(pro=>`${pro.name}: ${data[pro.id]}`).join("\n")}\n株: ${data.stock}個`,
            },
            {
              name: "順位",
              value: `${rank.indexOf(user.id) !== -1 ? rank.indexOf(user.id)+1 : rank.length}/${rank.length}位`
            }
          ]
        }]
      });
    }
  }
}