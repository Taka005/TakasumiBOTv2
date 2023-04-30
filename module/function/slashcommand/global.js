module.exports = async(interaction)=>{
  const db = require("../../lib/db");
  const { ChannelType, WebhookClient, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "global"){

    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return await interaction.reply({
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
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
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

    const data = await db(`SELECT * FROM global WHERE server = ${interaction.guild.id} LIMIT 1;`);

    if(data[0]){//登録済み
      const webhook = new WebhookClient({id: data[0].id, token: data[0].token});

      await db(`DELETE FROM global WHERE server = ${interaction.guild.id} LIMIT 1;`);
      await webhook.delete()
        .then(async()=>{
          await interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds:[{
              author:{
                name: "登録の削除が完了しました",
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              color: "GREEN"
            }]
          });
        })
        .catch(async()=>{
          await interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds:[{
              author:{
                name: "登録の削除が完了しました",
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              description: "※webhookは既に削除済みのため、\n登録情報のみ削除しました",
              color: "GREEN"
            }]
          })
        });

      await interaction.channel.setTopic("")
        .catch(()=>{})
    }else{
      if(
        interaction.guild.memberCount < 20||
        (await interaction.guild.members.fetch()).filter(m => !m.user.bot).size < 8
      ) return await interaction.reply({
        embeds:[{
          author:{
            name: "参加条件を満たしていません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
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
          author:{
            name: "グローバルチャットに参加できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "設定するチャンネルはテキストチャンネルにしてください"
        }],
        ephemeral: true
      });

      await interaction.deferReply();
      await interaction.editReply({
        embeds:[{
          color: "GREY",
          description: "登録情報を確認、登録中....",
        }]
      });

      await interaction.channel.createWebhook("TakasumiBOT Global",{
        avatar: "https://cdn.taka.ml/images/icon.png",
      })
        .then(async(webhook)=>{
          await interaction.channel.setTopic("ここはTakasumiBOTグローバルチャットです\nこのチャンネルに入力された内容は登録チャンネル全部に送信されます\n\nチャットを利用する前に\n[利用規約](https://gc.taka.ml/ )をご確認ください")
            .catch(()=>{})

          await db(`INSERT INTO global (channel, server, id, token, time) VALUES("${interaction.channel.id}","${interaction.guild.id}","${webhook.id}","${webhook.token}",NOW()) ON DUPLICATE KEY UPDATE channel = VALUES (channel),server = VALUES (server),id = VALUES (id),token = VALUES (token),time = VALUES (time);`);
          
          const global = await db("SELECT * FROM global;");
  
          global.forEach(async(data)=>{
            const mute = await db(`SELECT * FROM mute_server WHERE id = ${data.server} LIMIT 1;`);
            if(data.server === interaction.guild.id||mute[0]) return;

            const webhooks = new WebhookClient({id: data.id, token: data.token});
            await webhooks.send({
              embeds:[{
                color: "GREEN",
                title: `${interaction.guild.name}<${interaction.guild.id}>`,
                thumbnail:{
                  url: interaction.guild.iconURL({extension:"png",forceStatic:false,size:1024})||"https://cdn.discordapp.com/embed/avatars/0.png"
                },
                description: "グローバルチャットに新しいサーバーが参加しました！\nみんなで挨拶してみましょう!",
                footer:{
                  text: `登録数:${global.length}`
                },
                timestamp: new Date()
              }],
              username: "TakasumiBOT Global",
              avatarURL: "https://cdn.taka.ml/images/icon.png"
            }).catch(async()=>{
              await db(`DELETE FROM global WHERE server = ${interaction.guild.id} LIMIT 1;`);
            })
          });

          await interaction.editReply({
            embeds:[{
              color: "GREEN",
              author:{
                name: interaction.guild.name,
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              description: "グローバルチャットに新しいサーバーを追加しました\nみんなに挨拶してみましょう!\nこのチャンネルに入力された内容は、登録チャンネル全てに送信されます\n\n※チャットを利用した場合、[利用規約](http://taka.ml/bot/takasumi.html)に同意されたことになります。必ずご確認ください",
              timestamp: new Date()
            }]
          });
      })
      .catch(async(error)=>{
        await interaction.editReply({
          embeds:[{
            author:{
              name: "Webhookの作成に失敗しました",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
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
                  .setStyle("LINK"))
          ]
        });
      });
    }
  }
}