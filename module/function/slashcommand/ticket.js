module.exports = async(interaction)=>{
  const { MessageButton, MessageActionRow } = require("discord.js");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "ticket"){
    
    if(
      !interaction.member.permissions.has("MANAGE_MESSAGES")||
      !interaction.member.permissions.has("MANAGE_CHANNELS")
    ) return await interaction.reply({
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
            value: "```メッセージの管理\nチャンネルの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has("VIEW_CHANNEL")||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has("SEND_MESSAGES")||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has("MANAGE_CHANNELS")
    ) return await interaction.reply({
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
            value: "```チャンネルの閲覧\nチャンネル管理\nメッセージの送信```"
          }
        ]
      }],
      ephemeral: true
    });

    await interaction.channel.send({
      embeds:[{
        color: "GREEN",
        title:"チケット",
        description: "チケットの発行は下のボタンを押してください"
      }],
      components:[
        new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId("ticket")
              .setStyle("PRIMARY")
              .setLabel("作成"))
      ]
      }).catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "チケットが作成出来ませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
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
      }); 

      if(!interaction.guild.channels.cache.find(name => name.name === "ticket")){
        await interaction.guild.channels.create("ticket",{
          type: "GUILD_CATEGORY"
        });
      }

      await interaction.deferReply()
        .then(()=>interaction.deleteReply());
  }
}