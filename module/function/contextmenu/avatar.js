module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const config = require("../../../config.json");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "アバターを表示"){
    const member = interaction.options.getMember("user");

    if(!member) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "メンバーを取得できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "指定したメンバーはサーバーに存在していません"
      }],
      ephemeral: true
    });

    try{
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${member.user.displayName}のアバター`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          thumbnail:{
            url: member.avatarURL({extension:"png",size:1024})
          },
          image:{
            url: member.user.avatarURL({extension:"png",size:1024})||member.user.defaultAvatarURL
          },
          footer:{
            text: "TakasumiBOT"
          },
          timestamp: new Date()
        }]
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ]
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setLabel("サポートサーバー")
                .setURL(config.inviteUrl)
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true
      });
    }
  }
}