module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "auth"){
    const type = interaction.options.getString("type");
    const role = interaction.options.getRole("role");

    const color = {
      "normal": Colors.White,
      "panel": Colors.Blue,
      "image": Colors.Green,
      "web": "YELLOW"
    };

    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return await interaction.reply({
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
            value: "```ロールの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageRoles)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)
    ) return await interaction.reply({
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
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`${type}_${role.id}`)
              .setStyle(ButtonStyle.Primary)
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
            color: Colors.Red,
            description: "BOTの権限等を確認し、もう一度実行してください",
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