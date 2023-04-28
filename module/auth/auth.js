module.exports = async(interaction)=>{
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("auth_")){
    await interaction.reply({
      embeds:[{
        author:{
          name: "認証できません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "この認証は現在使用不可です\n認証機能は`/auth`に統合しました"
      }],
      ephemeral: true
    });
  }
}