module.exports = async(interaction)=>{
  const { MessageButton, MessageActionRow } = require("discord.js");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "auth"){
    const type = interaction.options.getString("type");
    const role = interaction.options.getRole("role");

    const color = {
      "normal": "WHITE",
      "panel": "BLUE",
      "image": "GREEN",
      "web": "YELLOW"
    };

    if(!interaction.member.permissions.has("MANAGE_ROLES")) return await interaction.reply({
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
            value: "```ロールの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has("MANAGE_ROLES")||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has("VIEW_CHANNEL")||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has("SEND_MESSAGES")
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
            value: "```ロールの管理\nメッセージの送信\nチャンネルの閲覧```"
          }
        ]
      }],
      ephemeral: true
    });
    
    await interaction.channel.send({
      embeds:[{
        color: color[type],
        description: `<@&${role.id}>を貰うには、認証ボタンを押してください`
      }],
      components:[
        new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId(`${type}_${role.id}`)
              .setStyle("PRIMARY")
              .setLabel("認証"))
        ]
    })
      .then(async()=>{
        await interaction.deferReply()
          .then(()=>interaction.deleteReply())
      })
      .catch(async(error)=>{
        await interaction.reply({ 
          embeds:[{
            author:{
              name: "認証機能の作成に失敗しました",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
            description: "BOTの権限等を確認し、もう一度実行してください",
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
        });
      })
  }
}