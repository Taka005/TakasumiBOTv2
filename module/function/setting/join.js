module.exports = async(interaction)=>{
  const { ChannelType, WebhookClient, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const escape = require("../../lib/escape");
  const config = require("../../../config.json");
  if(interaction.options.getSubcommand() === "join"){
    const message = interaction.options.getString("message");

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageWebhooks)
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
            value: "```チャンネルの閲覧\nメッセージの送信\nWebhookの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(!message){
      const data = await db(`SELECT * FROM \`join\` WHERE server = ${interaction.guild.id};`);
      if(!data[0]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "参加メッセージを無効にできませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "参加メッセージが設定されていません"
        }],
        ephemeral: true
      });

      const webhook = new WebhookClient({id: data[0].id, token: data[0].token});
      await webhook.delete()
        .catch(()=>{});

      await db(`DELETE FROM \`join\` WHERE server = ${interaction.guild.id};`);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "参加メッセージを無効にしました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }else{
      if(message.length > 100) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "参加メッセージを設定できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "メッセージは100文字以内にしてください"
        }],
        ephemeral: true
      });

      if(interaction.channel.type !== ChannelType.GuildText) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "参加メッセージを設定できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "メッセージを送信するチャンネルはテキストチャンネルにしてください"
        }],
        ephemeral: true
      });

      await interaction.deferReply();
      try{
        const webhook = await interaction.channel.createWebhook({
          name: "TakasumiBOT Join",
          avatar: "https://cdn.takasumibot.com/images/icon.png",
        });

        await db(`INSERT INTO \`join\` (server, channel, message, id, token, time) VALUES("${interaction.guild.id}","${interaction.channel.id}","${escape(message)}","${webhook.id}","${webhook.token}",NOW()) ON DUPLICATE KEY UPDATE server = VALUES (server),channel = VALUES (channel),message = VALUES (message),id = VALUES (id),token = VALUES (token),time = VALUES (time);`);
        await interaction.editReply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "参加メッセージを設定しました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            },
            description: `送信メッセージ: ${message}`
          }]
        });
      }catch(error){
        await interaction.editReply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "参加メッセージを設定できませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "BOTの権限が不足しているか,\n既にwebhookの作成回数が上限に達しています",
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
          ]
        });
      }
    }
  }
}