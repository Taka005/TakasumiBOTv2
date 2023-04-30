module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, PermissionFlagsBits, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "slowmode"){
    const time = interaction.options.getInteger("time");
  
    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return await interaction.reply({
      embeds:[{
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの管理```"
          }
        ]
      }],
      ephemeral: true
    });
   
    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageChannels)) return await interaction.reply({
      embeds:[{
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(time < 0 || time > 21600) return await interaction.reply({
      embeds:[{
        author:{
          name: "引数が無効です",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "低速モードは0秒以上、21600秒以下にする必要があります"
      }],
      ephemeral: true
    });

    await interaction.channel.setRateLimitPerUser(time)
      .then(async()=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "低速モードを設定しました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            description: `低速モードは現在${time}秒です`,
            color: Colors.Green
          }]
        })
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "低速モードが設定できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
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
                  .setStyle("LINK"))
          ],
          ephemeral: true
        });
      })
  }
}