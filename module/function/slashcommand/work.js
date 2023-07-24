const spam = require("../../lib/spam");
const Spam = new spam(1200000);

module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  const random = require("../../lib/random");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "work"){

    if(Spam.count(interaction.user.id)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "まだお金は貰えません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "20分に一回実行できます"
      }],
      ephemeral: true
    });

    const amount = random([100,150,200,250,300,300,350,400,450,500]);

    const data = await money.get(interaction.user.id);
    await money.add(interaction.user.id,amount);
    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${amount}円手に入れました`,
          icon_url: "https://cdn.taka.cf/images/system/success.png"
        },
        description: `所持金: ${Number(data.amount)+amount}円`
      }]
    });
  }
}