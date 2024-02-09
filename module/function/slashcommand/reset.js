module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "reset"){

    if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```管理者```"
          }
        ]
      }],
      ephemeral: true
    });

    await interaction.reply({
      embeds:[{
        color: Colors.Yellow,
        author:{
          name: "本当にこのチャンネルをリセットしますか？",
          icon_url: "https://cdn.takasumibot.com/images/system/warn.png"
        }
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel("リセットする")
              .setCustomId(`reset_${interaction.user.id}`)
              .setStyle(ButtonStyle.Danger))
      ]
    });
  }
}