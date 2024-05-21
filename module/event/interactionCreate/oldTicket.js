module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, Colors } = require("discord.js");
  const config = require("../../../config.json");
  if(!interaction.isButton()) return;
  if(interaction.customId === "ticket"){

    if(interaction.guild.channels.cache.find(channel=>channel.name === interaction.user.id)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "作成できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "既にチケットが作成済みです"
      }],
      ephemeral: true
    });

    const channel = interaction.guild.channels.cache.find(channel=>channel.name === "ticket")
    if(!channel) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "作成できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "ticketカテゴリーが存在していません"
      }],
      ephemeral: true
    });

    try{
      await interaction.message.edit({
        embeds: interaction.message.embeds,
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`ticket_${channel.id}`)
                .setStyle(ButtonStyle.Primary)
                .setLabel("作成"))
        ]
      });

      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "作成できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "このチケットは旧型のため自動更新しました\n再度作成ボタンを押してチケットを作成してください"
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
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "作成できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "このチケットは旧型のため移行中です\n移行には`/ticket`コマンドで更新する必要があります"
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
  }else if(interaction.customId === "close"){
    try{
      await interaction.channel.delete();
    }catch(error){
      await interaction.reply({
        embeds:[{
          author:{
            name: "チケットを削除できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
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
                .setURL(config.inviteUrl)
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true
      });
    }
  }
}