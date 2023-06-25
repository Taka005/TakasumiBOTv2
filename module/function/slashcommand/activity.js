module.exports = async(interaction)=>{
  const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "activity"){

    if(!interaction.member.presence?.activities[0]) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "表示出来ませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "あなたのアクティビティがありません"
      }],
      ephemeral: true
    });

    try{
      const members = (await interaction.guild.members.fetch())
        .filter(member=>{
          if(!member.presence?.activities[0]) return false;
          return member.presence.activities.filter(activitiy=>interaction.member.presence.activities[0].name === activitiy.name)[0];
        });

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${interaction.member.presence.activities[0].name}のアクティビティ一覧`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          description: members.map(member=>`<@${member.id}>`).join("\n")
        }]
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "表示出来ませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error.stack}\`\`\``
            }
          ]
        }],
        components:[
          new ActionRowBuilder()
            .addComponents( 
              new ButtonBuilder()
                .setLabel("サポートサーバー")
                .setURL("https://discord.gg/NEesRdGQwD")
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true
      });
    }
  }
}