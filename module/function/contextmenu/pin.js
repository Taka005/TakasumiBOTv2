module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const config = require("../../../config.json");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "メッセージを固定"){
    const message = interaction.options.getMessage("message");

    if(
      !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)||
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) return await interaction.reply({
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
            value: "```メッセージの管理\nチャンネルの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageMessages)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageChannels)
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
            value: "```チャンネルの閲覧\nチャンネルの管理\nメッセージの送信\nメッセージの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    const channel = await db(`SELECT * FROM pin WHERE channel = ${message.channel.id};`);
    const server = await db(`SELECT * FROM pin WHERE server = ${message.guild.id};`);
    if(!channel[0]){
      if(!message.content) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "メッセージをピン留めできませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "メッセージの内容が存在しません"
        }],
        ephemeral: true
      });

      if(server.length > 7) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "メッセージをピン留めできませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "サーバーには最大8個までしかPINは使えません"
        }],
        ephemeral: true
      });

      try{
        await interaction.deferReply()
          .then(()=>interaction.deleteReply());

        const msg = await interaction.channel.send({
          embeds:[{
            color: Colors.Green,
            author:{
              name: message.author.tag,
              icon_url: message.author.avatarURL()||message.author.defaultAvatarURL,
            },
            description: message.content,
            footer:{
              text: "TakasumiBOT PIN"
            }
          }]
        });

        await db(`INSERT INTO pin (channel, server, message, time) VALUES("${message.channel.id}","${message.guild.id}","${msg.id}",NOW());`);
      }catch(error){
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "メッセージをピン留めできませんでした",
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
    }else{
      try{
        await db(`DELETE FROM pin WHERE channel = ${message.channel.id};`);
        await (await message.channel.messages.fetch(channel[0].message)).delete();

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "ピン留めを削除しました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }catch{
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "ピン留めを削除しました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            },
            description: "メッセージを削除できなかったため登録のみ削除しました"
          }]
        });
      }
    }
  }
}