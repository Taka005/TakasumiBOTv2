module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("auth_")){
    await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "認証できません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "この認証は現在使用不可です\n認証機能は`/auth`に統合しました"
      }],
      ephemeral: true
    });
  }
}