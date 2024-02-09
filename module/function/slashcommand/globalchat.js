module.exports = async(interaction)=>{
  const { ChannelType, WebhookClient, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "globalchat"){

    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return await interaction.reply({
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
            value: "```チャンネルの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageWebhooks)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.AddReactions)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)||
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
            value: "```リアクションの追加\nチャンネルの閲覧\nメッセージの送信\nウェブフックの管理\nチャンネルの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    const data = await db(`SELECT * FROM global WHERE server = ${interaction.guild.id};`);
    if(data[0]){//登録済み
      const webhook = new WebhookClient({id: data[0].id, token: data[0].token});

      await db(`DELETE FROM global WHERE server = ${interaction.guild.id};`);
      await webhook.delete()
        .then(async()=>{
          await interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds:[{
              color: Colors.Green,
              author:{
                name: "登録の削除が完了しました",
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              }
            }]
          });
        })
        .catch(async()=>{
          await interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds:[{
              color: Colors.Green,
              author:{
                name: "登録の削除が完了しました",
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              },
              description: "※webhookは既に削除済みのため、\n登録情報のみ削除しました"
            }]
          })
        });
    }else{
      if(
        interaction.guild.memberCount < 20||
        (await interaction.guild.members.fetch()).filter(m=>!m.user.bot).size < 8
      ) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "参加条件を満たしていません",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "グローバルチャットを利用するには以下の条件を満たしている必要があります",
          fields:[
            {
              name: "必要な条件",
              value: "```20人以上のメンバー\n8人以上のユーザー```"
            }
          ]
        }],
        ephemeral: true
      });

      if(interaction.channel.type !== ChannelType.GuildText) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "グローバルチャットに参加できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "設定するチャンネルはテキストチャンネルにしてください"
        }],
        ephemeral: true
      });

      await interaction.deferReply();
      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          description: "登録情報を確認、登録中....",
        }]
      });

      try{
        const webhook = await interaction.channel.createWebhook({
          name: "TakasumiBOT Global",
          avatar: "https://cdn.takasumibot.com/images/icon.png",
        });

        await db(`INSERT INTO global (channel, server, id, token, time) VALUES("${interaction.channel.id}","${interaction.guild.id}","${webhook.id}","${webhook.token}",NOW());`);
        const mute = await db(`SELECT * FROM mute_server;`);

        const global = await db("SELECT * FROM global;");
        global.map(async(data)=>{
          if(
            data.server === interaction.guild.id||
            mute.find(m=>m.id === data.server)
          ) return;

          try{
            const webhooks = new WebhookClient({id: data.id, token: data.token});
            await webhooks.send({
              embeds:[{
                color: Colors.Green,
                title: `${interaction.guild.name}<${interaction.guild.id}>`,
                thumbnail:{
                  url: interaction.guild.iconURL({extension:"png",size:1024})||"https://cdn.discordapp.com/embed/avatars/0.png"
                },
                description: "グローバルチャットに新しいサーバーが参加しました！\nみんなで挨拶してみましょう!",
                footer:{
                  text: `登録数:${global.length}`
                },
                timestamp: new Date()
              }],
              username: "TakasumiBOT Global",
              avatarURL: "https://cdn.takasumibot.com/images/icon.png"
            });
          }catch(error){
            await db(`DELETE FROM global WHERE channel = ${data.channel};`);
            await interaction.client.channels.cache.get(data.channel).send({
              embeds:[{
                author:{
                  name: "グローバルチャットでエラーが発生しました",
                  icon_url: "https://cdn.takasumibot.com/images/system/error.png"
                },
                color: Colors.Red,
                description: "エラーが発生したため、強制的に切断されました\n再度登録するには`/global`を使用してください",
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
            }).catch(()=>{});
          }
        });

        await interaction.editReply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: interaction.guild.name,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            },
            description: "グローバルチャットに新しいサーバーを追加しました\nみんなに挨拶してみましょう!\nこのチャンネルに入力された内容は、登録チャンネル全てに送信されます\n\n※チャットを利用した場合、[利用規約](https://takasumibot.github.io/terms.html)に同意されたことになります。必ずご確認ください",
            timestamp: new Date()
          }]
        });
      }catch(error){
        await interaction.editReply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "Webhookの作成に失敗しました",
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
                  .setURL("https://discord.gg/NEesRdGQwD")
                  .setStyle(ButtonStyle.Link))
          ]
        });
      }
    }
  }
}