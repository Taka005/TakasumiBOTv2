module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "activity"){

    if(!interaction.member.presence?.activities) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "表示出来ませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "アクティビティがありません"
      }],
      ephemeral: true
    });


    try{
      const members = (await interaction.guild.members.fetch())
        .filter(member=>{
          if(!member.presence?.activities) return false;
          const a = member.presence.activities.filter(activitiy=>interaction.member.presence.activities[0].name === activitiy.name);
        });
      console.log(members.map(member=>member.user.tag))
      await interaction.reply({
content:"test"
      });
    }catch(err){
      await interaction.reply({
        content: `${err.stack}`
              });
    }
  }
}