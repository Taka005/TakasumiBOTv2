module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const config = require("../../../config.json");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("reset_")){
    const data = interaction.customId.split("_");

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageChannels)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの管理\nチャンネルの閲覧\nメッセージの送信```"
          }
        ]
      }],
      ephemeral: true
    });

    if(data[1] !== interaction.user.id) return await interaction.reply({
      embeds:[{
        author:{
          name: "リセットできませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        color: Colors.Red,
        description: "このコマンドは別の人が実行しています"
      }],
      ephemeral: true
    });

    try{
      const channel = await interaction.channel.clone();
      await channel.setPosition(interaction.channel.position+1);
      await interaction.channel.delete();

      await interaction.deferUpdate({});
      await channel.send({
        content: `<@${interaction.user.id}>`,
        embeds:[{
          color: Colors.Green,
          author:{
            name: "チャンネルをリセットしました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      }).catch(()=>{});
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "チャンネルをリセットできませんでした",
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