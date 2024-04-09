module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  const db = require("../../lib/db");
  const products = require("../../../file/products");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "money"){
    const user = interaction.options.getUser("user");

    const rank = (await db("SELECT * FROM money;"))
      .sort((m1,m2)=>m2.amount - m1.amount)
      .map(m=>m.id);

    if(!user){
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
              value: `${data?.amount||0}コイン`
            },
            {
              name: "アイテム",
              value: `${products.map(pro=>`${pro.name}: ${data[pro.id]||"0"}`).join("\n")}\n株: ${data?.stock||"0"}個`,
            },
            {
              name: "順位",
              value: `${data ? `${rank.indexOf(user.id)+1}/${rank.length}位`:"不明"}`
            }
          ]
        }]
      });
    }
  }
}