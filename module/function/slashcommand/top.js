module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "top"){

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ReadMessageHistory)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの閲覧\nメッセージ履歴の閲覧```"
          }
        ]
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    await interaction.editReply({
      embeds:[{
        color: Colors.Green,
        description: "取得中..."
      }]
    });

    const msg = await interaction.channel.messages.fetch({after:"0",limit:1})
      .then(msg=>msg.first());

    await interaction.editReply({
      embeds:[{
        color: Colors.Green,
        title: "最初のメッセージ",
        description: "下のリンクから飛べます"
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel("メッセージへ飛ぶ")
              .setURL(msg.url)
              .setStyle(ButtonStyle.Link))
      ]
    });
  }
}