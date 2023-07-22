module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "money"){
    const user = interaction.options.getUser("user");

    if(!user){
      const data = await money.get(interaction.user.id)[0];
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${interaction.user.tag}の所持金`,
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: `${data.amount}円`
        }]
      });
    }else{
      const data = await money.get(user.id)[0];
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${user.tag}の所持金`,
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: `${data?.amount||0}円`
        }]
      });
    }
  }
}