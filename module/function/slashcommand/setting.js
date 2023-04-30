module.exports = async(interaction)=>{
  const { ChannelType, WebhookClient, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "setting"){

    if(interaction.options.getSubcommand() === "help"){//Help画面
      await interaction.reply({
        embeds:[{
          title: "HELP 設定",
          color: Colors.Green,
          description: "設定の変更には`管理者`の権限が必要です",
          fields:[
            {
              name: "/setting bump",
              value: "BUMPの時間に通知するロールを設定します"
            },
            {
              name: "/setting dissoku",
              value: "Dissoku UPの時間に通知するロールを設定します"
            },
            {
              name: "/setting join",
              value: "実行したチャンネルに参加メッセージの設定をします\n\n利用可能な変数\n[User] ユーザーメンション\n[UserName] ユーザーの名前\n[UserID] ユーザーID\n[ServerName] サーバーの名前\n[ServerID] サーバーID\n[Count] メンバー数"
            },
            {
              name: "/setting leave",
              value: "実行したチャンネルに退出メッセージの設定をします\n`/setting join`と同じ変数を利用できます"
            },
            {
              name: "/setting ignore",
              value: "メッセージ展開、Bump通知、Dissoku通知の無効化と有効化を切り替えます\n有効にするとBump通知、Dissoku通知の設定情報は削除されます"
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
    }else if(interaction.options.getSubcommand() === "bump"){//BUMPロール設定
      const role = interaction.options.getRole("role");

      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
        embeds:[{
          author:{
            name: "権限がありません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
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

      if(
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)
      ) return await interaction.reply({
        embeds:[{
          author:{
            name: "BOTに権限がありません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
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
        const data = await db(`SELECT * FROM bump WHERE server = ${interaction.guild.id} LIMIT 1;`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            author:{
              name: "通知ロールを無効にできませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: "通知ロールが設定されていません"
          }],
          ephemeral: true
        });

        await db(`DELETE FROM bump WHERE server = ${interaction.guild.id} LIMIT 1;`);
        await interaction.reply({
          embeds:[{
            author:{
              name: "通知ロールを無効にしました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: Colors.Green
          }]
        });
      }else{
        const bot = interaction.guild.members.cache.get("302050872383242240");
        if(!bot) return await interaction.reply({
          embeds:[{
            author:{
              name: "通知ロールを有効にできませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: "このサーバーにDisboardが参加していません\nもし参加している場合はDisboardを操作してみてください"
          }],
          ephemeral: true
        });
  
        await db(`INSERT INTO bump (server, role, time) VALUES("${interaction.guild.id}","${role.id}",NOW()) ON DUPLICATE KEY UPDATE server = VALUES (server),role = VALUES (role),time = VALUES (time);`);
        await interaction.reply({
          embeds:[{
            author:{
              name: "通知ロールを有効にしました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: Colors.Green,
            description: `Bump通知に<@&${role.id}>に設定しました`
          }]
        });
      }

    }else if(interaction.options.getSubcommand() === "dissoku"){//Dissokuロール設定
      const role = interaction.options.getRole("role");

      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
        embeds:[{
          author:{
            name: "権限がありません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
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

      if(
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)
      ) return await interaction.reply({
        embeds:[{
          author:{
            name: "BOTに権限がありません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
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
        const data = await db(`SELECT * FROM dissoku WHERE server = ${interaction.guild.id} LIMIT 1;`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            author:{
              name: "通知ロールを無効にできませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: "通知ロールが設定されていません"
          }],
          ephemeral: true
        });

        await db(`DELETE FROM dissoku WHERE server = ${interaction.guild.id} LIMIT 1;`);
        await interaction.reply({
          embeds:[{
            author:{
              name: "通知ロールを無効にしました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: Colors.Green
          }]
        });
      }else{
        const bot = interaction.guild.members.cache.get("761562078095867916");
        if(!bot) return await interaction.reply({
          embeds:[{
            author:{
              name: "通知ロールを有効にできませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: "このサーバーにDissokuが参加していません\nもし参加している場合はDissokuを操作してみてください"
          }],
          ephemeral: true
        });
  
        await db(`INSERT INTO dissoku (server, role, time) VALUES("${interaction.guild.id}","${role.id}",NOW()) ON DUPLICATE KEY UPDATE server = VALUES (server),role = VALUES (role),time = VALUES (time);`);
        await interaction.reply({
          embeds:[{
            author:{
              name: "通知ロールを有効にしました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: Colors.Green,
            description: `Dissoku通知に<@&${role.id}>に設定しました`
          }]
        });
      }
    }else if(interaction.options.getSubcommand() === "join"){//join
      const message = interaction.options.getString("message");

      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
        embeds:[{
          author:{
            name: "権限がありません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
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

      if(
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)||
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageWebhooks)
      ) return await interaction.reply({
        embeds:[{
          author:{
            name: "BOTに権限がありません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
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
        const data = await db(`SELECT * FROM \`join\` WHERE server = ${interaction.guild.id} LIMIT 1;`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            author:{
              name: "参加メッセージを無効にできませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: "参加メッセージが設定されていません"
          }],
          ephemeral: true
        });

        const webhook = new WebhookClient({id: data[0].id, token: data[0].token});
        await webhook.delete()
          .catch(()=>{});

        await db(`DELETE FROM \`join\` WHERE server = ${interaction.guild.id} LIMIT 1;`);
        await interaction.reply({
          embeds:[{
            author:{
              name: "参加メッセージを無効にしました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: Colors.Green
          }]
        });
      }else{
        if(message.length > 100) return await interaction.reply({
          embeds:[{
            author:{
              name: "参加メッセージを設定できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: "メッセージは100文字以内にしてください"
          }],
          ephemeral: true
        });

        if(interaction.channel.type !== ChannelType.GuildText) return await interaction.reply({
          embeds:[{
            author:{
              name: "参加メッセージを設定できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: "メッセージを送信するチャンネルはテキストチャンネルにしてください"
          }],
          ephemeral: true
        });

        await interaction.deferReply();
        await interaction.channel.createWebhook("TakasumiBOT Join",{
          avatar: "https://cdn.taka.ml/images/icon.png",
        })
          .then(async(webhook)=>{
            await db(`INSERT INTO \`join\` (server, channel, message, id, token, time) VALUES("${interaction.guild.id}","${interaction.channel.id}","${message}","${webhook.id}","${webhook.token}",NOW()) ON DUPLICATE KEY UPDATE server = VALUES (server),channel = VALUES (channel),message = VALUES (message),id = VALUES (id),token = VALUES (token),time = VALUES (time);`);
            await interaction.editReply({
              embeds:[{
                author:{
                  name: "参加メッセージを設定しました",
                  icon_url: "https://cdn.taka.ml/images/system/success.png"
                },
                color: Colors.Green,
                description: `送信メッセージ: ${message}`
              }]
            });
          })
          .catch(async(error)=>{
            await interaction.editReply({
              embeds:[{
                author:{
                  name: "参加メッセージを設定できませんでした",
                  icon_url: "https://cdn.taka.ml/images/system/error.png"
                },
                color: Colors.Red,
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
          })
      }
    }else if(interaction.options.getSubcommand() === "leave"){//leave
      const message = interaction.options.getString("message");

      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
        embeds:[{
          author:{
            name: "権限がありません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
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

      if(
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)||
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageWebhooks)
      ) return await interaction.reply({
        embeds:[{
          author:{
            name: "BOTに権限がありません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
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
        const data = await db(`SELECT * FROM \`leave\` WHERE server = ${interaction.guild.id} LIMIT 1;`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            author:{
              name: "退出メッセージを無効にできませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: "退出メッセージが設定されていません"
          }],
          ephemeral: true
        });

        const webhook = new WebhookClient({id: data[0].id, token: data[0].token});
        await webhook.delete()
          .catch(()=>{});

        await db(`DELETE FROM \`leave\` WHERE server = ${interaction.guild.id} LIMIT 1;`);
        await interaction.reply({
          embeds:[{
            author:{
              name: "退出メッセージを無効にしました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: Colors.Green
          }]
        });
      }else{
        if(message.length > 100) return await interaction.reply({
          embeds:[{
            author:{
              name: "退出メッセージを設定できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: "メッセージは100文字以内にしてください"
          }],
          ephemeral: true
        });

        if(interaction.channel.type !== ChannelType.GuildText) return await interaction.reply({
          embeds:[{
            author:{
              name: "退出メッセージを設定できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: "メッセージを送信するチャンネルはテキストチャンネルにしてください"
          }],
          ephemeral: true
        });

        await interaction.deferReply();
        await interaction.channel.createWebhook("TakasumiBOT Leave",{
          avatar: "https://cdn.taka.ml/images/icon.png",
        })
          .then(async(webhook)=>{
            await db(`INSERT INTO \`leave\` (server, channel, message, id, token, time) VALUES("${interaction.guild.id}","${interaction.channel.id}","${message}","${webhook.id}","${webhook.token}",NOW()) ON DUPLICATE KEY UPDATE server = VALUES (server),channel = VALUES (channel),message = VALUES (message),id = VALUES (id),token = VALUES (token),time = VALUES (time);`);
            await interaction.editReply({
              embeds:[{
                author:{
                  name: "退出メッセージを設定しました",
                  icon_url: "https://cdn.taka.ml/images/system/success.png"
                },
                color: Colors.Green,
                description: `送信メッセージ: ${message}`
              }]
            });
          })
          .catch(async(error)=>{
            await interaction.editReply({
              embeds:[{
                author:{
                  name: "退出メッセージを設定できませんでした",
                  icon_url: "https://cdn.taka.ml/images/system/error.png"
                },
                color: Colors.Red,
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
          })
      }
    }else if(interaction.options.getSubcommand() === "ignore"){//ignore
    
      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
        embeds:[{
          author:{
            name: "権限がありません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
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

      const data = await db(`SELECT * FROM \`ignore\` WHERE id = ${interaction.guild.id} LIMIT 1;`);
      if(!data[0]){
        await db(`INSERT INTO \`ignore\` (id, time) VALUES("${interaction.guild.id}",NOW()) ON DUPLICATE KEY UPDATE id = VALUES (id),time = VALUES (time);`);
        await db(`DELETE FROM bump WHERE server = ${interaction.guild.id};`);
        await db(`DELETE FROM dissoku WHERE server = ${interaction.guild.id};`);

        await interaction.reply({
          embeds:[{
            author:{
              name: "有効にしました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: Colors.Green
          }]
        });
      }else{
        await db(`DELETE FROM \`ignore\` WHERE id = ${interaction.guild.id};`);

        await interaction.reply({
          embeds:[{
            author:{
              name: "無効にしました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: Colors.Green
          }]
        });
      }
    }else if(interaction.options.getSubcommand() === "info"){//info
      const bump = await db(`SELECT * FROM bump WHERE server = ${interaction.guild.id} LIMIT 1;`);
      const dissoku = await db(`SELECT * FROM dissoku WHERE server = ${interaction.guild.id} LIMIT 1;`);
      const global = await db(`SELECT * FROM global WHERE server = ${interaction.guild.id} LIMIT 1;`);
      const hiroyuki = await db(`SELECT * FROM hiroyuki WHERE server = ${interaction.guild.id} LIMIT 1;`);
      const ignore = await db(`SELECT * FROM \`ignore\` WHERE id = ${interaction.guild.id} LIMIT 1;`);
      const join = await db(`SELECT * FROM \`join\` WHERE server = ${interaction.guild.id} LIMIT 1;`);
      const leave = await db(`SELECT * FROM \`leave\` WHERE server = ${interaction.guild.id} LIMIT 1;`);
      const moderate = await db(`SELECT * FROM moderate WHERE id = ${interaction.guild.id} LIMIT 1;`);
      const pin = await db(`SELECT * FROM pin WHERE server = ${interaction.guild.id};`);

      await interaction.reply({
        embeds:[{
          author:{
            name: "データベース設定状況",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          color: Colors.Green,
          fields:[
            {
              name: "Bump通知",
              value: bump[0] ? "設定済み":"未設定",
              inline: true
            },
            {
              name: "Dissoku通知",
              value: dissoku[0] ? "設定済み":"未設定",
              inline: true
            },
            {
              name: "グローバルチャット",
              value: global[0] ? "設定済み":"未設定",
              inline: true
            },
            {
              name: "ひろゆき",
              value: hiroyuki[0] ? "設定済み":"未設定",
              inline: true
            },
            {
              name: "メッセージ無視",
              value: ignore[0] ? "設定済み":"未設定",
              inline: true
            },
            {
              name: "参加メッセージ",
              value: join[0] ? "設定済み":"未設定",
              inline: true
            },
            {
              name: "退出メッセージ",
              value: leave[0] ? "設定済み":"未設定",
              inline: true
            },    
            {
              name: "モデレート",
              value: moderate[0] ? "設定済み":"未設定",
              inline: true
            },
            {
              name: "ピン",
              value: `${pin.length}個設定済み`,
              inline: true
            },
          ]
        }]
      });
    }else if(interaction.options.getSubcommand() === "delete"){//delete

      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
        embeds:[{
          author:{
            name: "権限がありません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
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

      await db(`DELETE FROM moderate WHERE id = ${interaction.guild.id};`);
      await db(`DELETE FROM pin WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM bump WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM dissoku WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM hiroyuki WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM global WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM \`ignore\` WHERE id = ${interaction.guild.id};`);
      await db(`DELETE FROM \`join\` WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM \`leave\` WHERE server = ${interaction.guild.id};`);

      await interaction.reply({
        content: `<@${interaction.user.id}>`,
        embeds:[{
          author:{
            name: "全ての設定情報を削除しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          color: Colors.Green
        }]
      });
    }
  }
}