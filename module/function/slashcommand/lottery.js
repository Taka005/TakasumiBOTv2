module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "lottery"){
    const number = interaction.options.getInteger("number");
    const role = interaction.options.getRole("role");
  
    if(number >= role.members.size) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "抽選できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "指定したロールを持っている人より、抽選する人数が多すぎます"
      }],
      ephemeral: true
    });

    const members = [];
    while(members.length < number){
      const random = Math.floor(Math.random()*role.members.size);

      if(!members.includes(role.members.toJSON()[random])){
        members.push(role.members.toJSON()[random]);
      }
    }

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: "抽選結果",
          icon_url: "https://cdn.taka.ml/images/system/success.png"
        },
        description: members.map(member=>`<@${member.id}>`).join("")
      }]
    });
  }
}