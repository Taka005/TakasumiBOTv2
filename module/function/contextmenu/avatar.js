module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "View Avatar"){
    const member = interaction.options.getMember("user");

    if(!member) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "メンバーを取得できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "指定したユーザーが存在していないか、サーバーから退出しています"
      }],
      ephemeral: true
    });

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${member.user.tag}のアバター`,
          icon_url: "https://cdn.taka.ml/images/system/success.png"
        },
        thumbnail:{
          url: member.avatarURL({extension:"png",forceStatic:false,size:1024})
        },
        image:{
          url: member.user.avatarURL({extension:"png",forceStatic:false,size:1024})||member.user.defaultAvatarURL
        },
        footer:{
          text: "TakasumiBOT"
        },
        timestamp: new Date()
      }]
    })
    .catch(async(error)=>{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
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
                .setURL("https://discord.gg/NEesRdGQwD")
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true
      })
    });
  }
}