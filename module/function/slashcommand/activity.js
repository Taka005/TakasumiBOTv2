module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "activity"){

    if(!interaction.member.presence.activities.length) return await interaction.reply({
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
          return member.presence.activities.filter(memberActivitiy=>{
            return interaction.member.presence.activities.filter(activitiy=>activitiy.name === memberActivitiy.name);
          });
        });
console.log(members)
      await interaction.reply({
content:"test"
      });
    }catch(err){
      await interaction.reply({
        content:err
              });
    }
  }
}