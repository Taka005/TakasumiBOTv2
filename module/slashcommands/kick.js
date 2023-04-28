module.exports = async(interaction)=>{
  const { MessageButton, MessageActionRow } = require("discord.js");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "kick"){
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason")||`${interaction.user.tag}によってKICK`;
    
    if(!interaction.member.permissions.has("KICK_MEMBERS")) return await interaction.reply({
      embeds:[{
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```メンバーをKICK```"
          }
        ]
      }],
      ephemeral: true
    });

    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has("KICK_MEMBERS")) return await interaction.reply({
      embeds:[{
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```メンバーをKICK```"
          }
        ]
      }],
      ephemeral: true
    });

    const member = await interaction.guild.members.cache.get(user.id);
    if(!member) return await interaction.reply({
      embeds:[{
        author:{
          name: "KICKできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "指定したユーザーが取得できません"
      }],
      ephemeral: true
    });

    if(member.user.id === interaction.user.id) return await interaction.reply({
      embeds:[{
        author:{
          name: "KICKできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "自分自身をKICKすることはできません"
      }],
      ephemeral: true
    });

    await member.kick({reason:`${reason}`})
      .then(async()=>{
        await interaction.reply({
          content: `<@${interaction.user.id}>`,
          embeds:[{
            author:{
              name: `${member.user.tag}をサーバーからKICKしました`,
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: "GREEN"
          }]
        })
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "KICKできませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
            description: "BOTの権限が不足しているか、メンバーが正しく指定されていません",
            fields:[
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          components:[
            new MessageActionRow()
              .addComponents( 
                new MessageButton()
                  .setLabel("サポートサーバー")
                  .setURL("https://discord.gg/NEesRdGQwD")
                  .setStyle("LINK"))
          ],
          ephemeral: true
        })
      })
  }
}