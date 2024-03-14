module.exports = async(interaction)=>{
  const { ChannelType, WebhookClient, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const fetchMember = require("../../lib/fetchMember");
  const escape = require("../../lib/escape");
  const ignore = require("../../lib/ignore");
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "setting"){

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

    if(interaction.options.getSubcommand() === "help"){
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          title: "HELP 設定",
          description: "設定の変更には`管理者`の権限が必要です",
          fields:[
            {
              name: "/setting stats",
              value: "サーバーの統計情報の収集の有効・無効を切り替えます"
            },
            {
              name: "/setting bump",
              value: "BUMPの時間に通知するロールを設定します"
            },
            {
              name: "/setting dissoku",
              value: "Dissoku UPの時間に通知するロールを設定します"
            },
            {
              name: "/setting up",
              value: "TakasumiBOTのUPの時間に通知するロールを設定します"
            },
            {
              name: "/setting join",
              value: "実行したチャンネルに参加メッセージの設定をします\n\n利用可能な変数\n[User] ユーザーメンション\n[UserName] ユーザーの名前\n[UserDisplayName] ユーザーの表示名\n[UserID] ユーザーID\n[ServerName] サーバーの名前\n[ServerID] サーバーID\n[Count] メンバー数"
            },
            {
              name: "/setting leave",
              value: "実行したチャンネルに退出メッセージの設定をします\n`/setting join`と同じ変数を利用できます"
            },
            {
              name: "/setting ignore",
              value: "メッセージ展開、Bump通知、Dissoku通知、UP通知の無効・有効を切り替えます\n有効にすると各通知機能の設定情報は削除されます"
            },
            {
              name: "/setting info",
              value: "データベースの設定状況を表示します"
            },
            {
              name: "/setting delete",
              value: "サーバーの設定情報を**全て**削除します\n**この操作は元に戻せません**"
            }
          ]
        }]
      });
    }else if(interaction.options.getSubcommand() === "stats"){

      const data = await db(`SELECT * FROM stats WHERE id = ${interaction.guild.id};`);
      if(!data[0]){
        await db(`INSERT INTO stats (id, message, \`join\`, \`leave\`, time) VALUES("${interaction.guild.id}","0","0","0",NOW());`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "統計情報の収集を有効にしました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }else{
        await db(`DELETE FROM stats WHERE id = ${interaction.guild.id};`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "統計情報の収集を無効にしました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }
    }else if(interaction.options.getSubcommand() === "bump"){
      const role = interaction.options.getRole("role");

      if(
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
              value: "```チャンネルの閲覧\nメッセージの送信```"
            }
          ]
        }],
        ephemeral: true
      });

      if(!role){
        const data = await db(`SELECT * FROM bump WHERE id = ${interaction.guild.id};`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "通知ロールを無効にできませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "通知ロールが設定されていません"
          }],
          ephemeral: true
        });

        await db(`DELETE FROM bump WHERE id = ${interaction.guild.id};`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "通知ロールを無効にしました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }else{
        const bot = await fetchMember(interaction.guild,"302050872383242240");
        if(!bot) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "通知ロールを有効にできませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "このサーバーにDisboardが参加していません"
          }],
          ephemeral: true
        });

        await db(`INSERT INTO bump (id, role, time) VALUES("${interaction.guild.id}","${role.id}",NOW()) ON DUPLICATE KEY UPDATE id = VALUES (id),role = VALUES (role),time = VALUES (time);`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "通知ロールを有効にしました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            },
            description: `Bump通知に<@&${role.id}>に設定しました`
          }]
        });
      }
    }else if(interaction.options.getSubcommand() === "dissoku"){
      const role = interaction.options.getRole("role");

      if(
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)
      ) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "BOTに権限がありません",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "このコマンドはBOTに以下の権限が必要です\n```チャンネルの閲覧\nメッセージの送信```",
          fields:[
            {
              name: "必要な権限",
              value: "```チャンネルの閲覧\nメッセージの送信```"
            }
          ]
        }],
        ephemeral: true
      });

      if(!role){
        const data = await db(`SELECT * FROM dissoku WHERE id = ${interaction.guild.id};`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "通知ロールを無効にできませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "通知ロールが設定されていません"
          }],
          ephemeral: true
        });

        await db(`DELETE FROM dissoku WHERE id = ${interaction.guild.id};`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "通知ロールを無効にしました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }else{
        const bot = await fetchMember(interaction.guild,"761562078095867916");
        if(!bot) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "通知ロールを有効にできませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "このサーバーにDissokuが参加していません"
          }],
          ephemeral: true
        });

        await db(`INSERT INTO dissoku (id, role, time) VALUES("${interaction.guild.id}","${role.id}",NOW()) ON DUPLICATE KEY UPDATE id = VALUES (id),role = VALUES (role),time = VALUES (time);`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "通知ロールを有効にしました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            },
            description: `Dissoku通知に<@&${role.id}>に設定しました`
          }]
        });
      }
    }else if(interaction.options.getSubcommand() === "up"){
      const role = interaction.options.getRole("role");

      if(
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)
      ) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "BOTに権限がありません",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "このコマンドはBOTに以下の権限が必要です\n```チャンネルの閲覧\nメッセージの送信```",
          fields:[
            {
              name: "必要な権限",
              value: "```チャンネルの閲覧\nメッセージの送信```"
            }
          ]
        }],
        ephemeral: true
      });

      if(!role){
        const data = await db(`SELECT * FROM up WHERE id = ${interaction.guild.id};`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "通知ロールを無効にできませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "通知ロールが設定されていません"
          }],
          ephemeral: true
        });

        await db(`DELETE FROM up WHERE id = ${interaction.guild.id};`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "通知ロールを無効にしました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }else{
        if(!(await db(`SELECT * FROM server WHERE id = ${interaction.guild.id};`))[0]) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "通知ロールを有効にできませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "掲示板に登録されていません"
          }],
          ephemeral: true
        });

        await db(`INSERT INTO up (id, role, time) VALUES("${interaction.guild.id}","${role.id}",NOW()) ON DUPLICATE KEY UPDATE id = VALUES (id),role = VALUES (role),time = VALUES (time);`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "通知ロールを有効にしました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            },
            description: `TakasumiBOTのUP通知に<@&${role.id}>に設定しました`
          }]
        });
      }
    }else if(interaction.options.getSubcommand() === "join"){
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
    }else if(interaction.options.getSubcommand() === "leave"){
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
        const data = await db(`SELECT * FROM \`leave\` WHERE server = ${interaction.guild.id};`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "退出メッセージを無効にできませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "退出メッセージが設定されていません"
          }],
          ephemeral: true
        });

        const webhook = new WebhookClient({id: data[0].id, token: data[0].token});
        await webhook.delete()
          .catch(()=>{});

        await db(`DELETE FROM \`leave\` WHERE server = ${interaction.guild.id};`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "退出メッセージを無効にしました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }else{
        if(message.length > 100) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "退出メッセージを設定できませんでした",
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
              name: "退出メッセージを設定できませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "メッセージを送信するチャンネルはテキストチャンネルにしてください"
          }],
          ephemeral: true
        });

        await interaction.deferReply();
        try{
          const webhook = await interaction.channel.createWebhook({
            name: "TakasumiBOT Leave",
            avatar: "https://cdn.takasumibot.com/images/icon.png",
          });

          await db(`INSERT INTO \`leave\` (server, channel, message, id, token, time) VALUES("${interaction.guild.id}","${interaction.channel.id}","${escape(message)}","${webhook.id}","${webhook.token}",NOW()) ON DUPLICATE KEY UPDATE server = VALUES (server),channel = VALUES (channel),message = VALUES (message),id = VALUES (id),token = VALUES (token),time = VALUES (time);`);
          await interaction.editReply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: "退出メッセージを設定しました",
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
                name: "退出メッセージを設定できませんでした",
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
    }else if(interaction.options.getSubcommand() === "ignore"){
      const type = interaction.options.getString("type");

      const types = {
        "bump": "Bump通知",
        "dissoku": "Dissoku通知",
        "up": "UP通知",
        "expand": "メッセージ展開"
      }

      if(type === "all"){
        const data = await db(`SELECT * FROM \`ignore\` WHERE id = ${interaction.guild.id};`);
        if(!data[0]){
          await ignore.enable(interaction.guild.id);

          await db(`DELETE FROM bump WHERE id = ${interaction.guild.id};`);
          await db(`DELETE FROM dissoku WHERE id = ${interaction.guild.id};`);
          await db(`DELETE FROM up WHERE id = ${interaction.guild.id};`);

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: "全て無効にしました",
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              }
            }]
          });
        }else{
          await ignore.disable(interaction.guild.id);

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: "全て有効にしました",
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              }
            }]
          });
        }
      }else{
        const check = await ignore.check(interaction.guild.id,type);
        if(!check){
          await ignore.enable(interaction.guild.id,type);

          if(type === "bump"){
            await db(`DELETE FROM bump WHERE id = ${interaction.guild.id};`);
          }else if(type === "dissoku"){
            await db(`DELETE FROM dissoku WHERE id = ${interaction.guild.id};`);
          }else if(type === "up"){
            await db(`DELETE FROM up WHERE id = ${interaction.guild.id};`);
          }

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${types[type]}を無効にしました`,
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              }
            }]
          });
        }else{
          await ignore.disable(interaction.guild.id,type);

          if(await ignore.isAllDisable(interaction.guild.id)){
            await ignore.disable(interaction.guild.id);
          }

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${types[type]}を有効にしました`,
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              }
            }]
          });
        }
      }
    }else if(interaction.options.getSubcommand() === "info"){
      const bump = await db(`SELECT * FROM bump WHERE id = ${interaction.guild.id};`);
      const dissoku = await db(`SELECT * FROM dissoku WHERE id = ${interaction.guild.id};`);
      const global = await db(`SELECT * FROM global WHERE server = ${interaction.guild.id};`);
      const hiroyuki = await db(`SELECT * FROM hiroyuki WHERE server = ${interaction.guild.id};`);
      const ignore = await db(`SELECT * FROM \`ignore\` WHERE id = ${interaction.guild.id};`);
      const join = await db(`SELECT * FROM \`join\` WHERE server = ${interaction.guild.id};`);
      const leave = await db(`SELECT * FROM \`leave\` WHERE server = ${interaction.guild.id};`);
      const pin = await db(`SELECT * FROM pin WHERE server = ${interaction.guild.id};`);
      const server = await db(`SELECT * FROM server WHERE id = ${interaction.guild.id};`);
      const stats = await db(`SELECT * FROM stats WHERE id = ${interaction.guild.id};`);
      const up = await db(`SELECT * FROM up WHERE id = ${interaction.guild.id};`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "データベース設定状況",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          fields:[
            {
              name: "統計情報の収集",
              value: stats[0] ? "設定済み":"未設定"
            },
            {
              name: "Bump通知",
              value: bump[0] ? "設定済み":"未設定"
            },
            {
              name: "Dissoku通知",
              value: dissoku[0] ? "設定済み":"未設定"
            },
            {
              name: "TakasumiBOT UP通知",
              value: up[0] ? "設定済み":"未設定"
            },
            {
              name: "サーバー掲示板",
              value: server[0] ? "登録済み":"未登録"
            },
            {
              name: "グローバルチャット",
              value: global[0] ? "登録済み":"未登録"
            },
            {
              name: "ひろゆき",
              value: hiroyuki[0] ? "登録済み":"未登録"
            },
            {
              name: "メッセージ無視",
              value: ignore[0] ? `Bump通知: ${ignore[0].bump?"無効":"有効"}\nDissoku通知: ${ignore[0].dissoku?"無効":"有効"}\nUP通知: ${ignore[0].up?"無効":"有効"}\nメッセージ展開: ${ignore[0].expand?"無効":"有効"}`:"無効"
            },
            {
              name: "参加メッセージ",
              value: join[0] ? "設定済み":"未設定"
            },
            {
              name: "退出メッセージ",
              value: leave[0] ? "設定済み":"未設定"
            },
            {
              name: "ピン",
              value: `${pin.length}個設定済み`
            }
          ]
        }]
      });
    }else if(interaction.options.getSubcommand() === "delete"){
      await db(`DELETE FROM pin WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM bump WHERE id = ${interaction.guild.id};`);
      await db(`DELETE FROM dissoku WHERE id = ${interaction.guild.id};`);
      await db(`DELETE FROM hiroyuki WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM global WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM \`ignore\` WHERE id = ${interaction.guild.id};`);
      await db(`DELETE FROM \`join\` WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM \`leave\` WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM server WHERE id = ${interaction.guild.id};`);
      await db(`DELETE FROM stats WHERE id = ${interaction.guild.id};`);
      await db(`DELETE FROM up WHERE id = ${interaction.guild.id};`);

      await interaction.reply({
        content: `<@${interaction.user.id}>`,
        embeds:[{
          color: Colors.Green,
          author:{
            name: "全ての設定情報を削除しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }
  }
}