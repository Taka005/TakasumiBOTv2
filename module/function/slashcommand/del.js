module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "del"){
    const number = interaction.options.getInteger("number");
    const user = interaction.options.getUser("user");

    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```メッセージの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageMessages)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です\n```チャンネルの閲覧\nメッセージの管理```",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの閲覧\nメッセージの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(number < 2||number > 99) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "削除できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "削除するメッセージの数は`2`以上`99`以下にする必要があります"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    try{
      if(user){
        const messages = (await interaction.channel.messages.fetch({ limit: 100 }))
          .filter(msg=>user.id === msg.author.id&&interaction.client.user.id !== msg.author.id).first(number);

        if(!messages[0]) return await interaction.editReply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "削除できませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            description: "メッセージに指定したユーザーが含まれていませんでした",
          }]
        });

        await interaction.channel.bulkDelete(messages);

        await interaction.editReply({
          content: `<@${interaction.user.id}>`,
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${user.tag} のメッセージを${number}個削除しました`,
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            }
          }]
        });
      }else{
        const messages = (await interaction.channel.messages.fetch({ limit: number }))
          .filter(msg=>msg.author.id !== interaction.client.user.id);

        await interaction.channel.bulkDelete(messages);

        await interaction.editReply({
          content: `<@${interaction.user.id}>`,
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${number}個のメッセージを削除しました`,
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            }
          }]
        });
      }
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "削除できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "二週間より前のメッセージが含まれていたか、BOTの権限が不足しています",
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
        ]
      });
    }
  }
}