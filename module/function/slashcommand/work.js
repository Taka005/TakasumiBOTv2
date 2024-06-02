const Spam = require("../../lib/spam");
const spam = new Spam(1200000,true);

module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "work"){

    if(spam.count(interaction.user.id)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "まだお金は貰えません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: `次に実行できるのは<t:${Number(String(Date.parse(spam.get(interaction.user.id))).slice(0,-3))+300}:R>です`
      }],
      ephemeral: true
    });

    const amount = Math.floor(Math.random()*500)+500;

    const data = await money.get(interaction.user.id);
    await money.add(interaction.user.id,amount,"給料");

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${amount}コイン手に入れました`,
          icon_url: "https://cdn.takasumibot.com/images/system/success.png"
        },
        description: `所持金: ${(data.amount||0)+amount}コイン`
      }]
    });
  }
}