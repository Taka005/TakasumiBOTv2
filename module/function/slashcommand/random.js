module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const random = require("../../lib/random");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "random"){
    const selects = [
      interaction.options.getString("select_1"),
      interaction.options.getString("select_2"),
      interaction.options.getString("select_3"),
      interaction.options.getString("select_4"),
      interaction.options.getString("select_5"),
      interaction.options.getString("select_6"),
      interaction.options.getString("select_7"),
      interaction.options.getString("select_8"),
      interaction.options.getString("select_9"),
      interaction.options.getString("select_10")
    ].filter(select=>select!==null);

    await interaction.reply({
      embeds:[{    
        color: Colors.Green,
        author:{
          name: "ランダムで選択しました",
          icon_url: "https://cdn.taka.cf/images/system/success.png"
        },
        description: random(selects)
      }]
    });
  }
}