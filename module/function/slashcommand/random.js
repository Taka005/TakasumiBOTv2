module.exports = async(interaction)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
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
      interaction.options.getString("select_8")
    ].filter(select=>select!==null);

    await interaction.reply({
      embeds:[{    
        color: Colors.Green,
        author:{
          name: "ランダム",
          icon_url: "https://cdn.taka.ml/images/system/success.png"
        },
        description: random(selects)
      }]
    });
  }
}