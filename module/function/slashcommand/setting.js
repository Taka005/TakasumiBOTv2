module.exports = async(interaction)=>{
  const { ChannelType, WebhookClient, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const fetchMember = require("../../lib/fetchMember");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "setting"){

    if(interaction.options.getSubcommand() === "help"){//Help画面
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          title: "HELP 設定",
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
              name: "/setting up",
              value: "TakasumiBOTのUPの時間に通知するロールを設定します"
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
          color: Colors.Red,
          author:{
            name: "権限がありません",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
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

      if(
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
        !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)
      ) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "BOTに権限がありません",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
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
        const data = await db(`SELECT * FROM bump WHERE id = ${interaction.guild.id} LIMIT 1;`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "通知ロールを無効にできませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            description: "通知ロールが設定されていません"
          }],
          ephemeral: true
        });

        await db(`DELETE FROM bump WHERE id = ${interaction.guild.id} LIMIT 1;`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "通知ロールを無効にしました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
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
              icon_url: "https://cdn.taka.cf/images/system/error.png"
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
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            },
            description: `Bump通知に<@&${role.id}>に設定しました`
          }]
        });
      }

    }else if(interaction.options.getSubcommand() === "dissoku"){//Dissokuロール設定
      const role = interaction.options.getRole("role");

      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
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
          color: Colors.Red,
          author:{
            name: "BOTに権限がありません",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
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
        const data = await db(`SELECT * FROM dissoku WHERE id = ${interaction.guild.id} LIMIT 1;`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "通知ロールを無効にできませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            description: "通知ロールが設定されていません"
          }],
          ephemeral: true
        });

        await db(`DELETE FROM dissoku WHERE id = ${interaction.guild.id} LIMIT 1;`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "通知ロールを無効にしました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
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
              icon_url: "https://cdn.taka.cf/images/system/error.png"
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
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            },
            description: `Dissoku通知に<@&${role.id}>に設定しました`
          }]
        });
      }
    }else if(interaction.options.getSubcommand() === "up"){//TakasumiBOTロール設定
      const role = interaction.options.getRole("role");

      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
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
          color: Colors.Red,
          author:{
            name: "BOTに権限がありません",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
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
        const data = await db(`SELECT * FROM up WHERE id = ${interaction.guild.id} LIMIT 1;`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "通知ロールを無効にできませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            description: "通知ロールが設定されていません"
          }],
          ephemeral: true
        });

        await db(`DELETE FROM up WHERE id = ${interaction.guild.id} LIMIT 1;`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "通知ロールを無効にしました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            }
          }]
        });
      }else{
        await db(`INSERT INTO up (id, role, time) VALUES("${interaction.guild.id}","${role.id}",NOW()) ON DUPLICATE KEY UPDATE id = VALUES (id),role = VALUES (role),time = VALUES (time);`);
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "通知ロールを有効にしました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            },
            description: `TakasumiBOTのUP通知に<@&${role.id}>に設定しました`
          }]
        });
      }
    }else if(interaction.options.getSubcommand() === "join"){//join
      const message = interaction.options.getString("message");

      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
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
          color: Colors.Red,
          author:{
            name: "BOTに権限がありません",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
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
        const data = await db(`SELECT * FROM \`join\` WHERE server = ${interaction.guild.id} LIMIT 1;`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "参加メッセージを無効にできませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
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
            color: Colors.Green,
            author:{
              name: "参加メッセージを無効にしました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            }
          }]
        });
      }else{
        if(message.length > 100) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "参加メッセージを設定できませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
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
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            description: "メッセージを送信するチャンネルはテキストチャンネルにしてください"
          }],
          ephemeral: true
        });

        await interaction.deferReply();
        await interaction.channel.createWebhook({
          name: "TakasumiBOT Join",
          avatar: "https://cdn.taka.cf/images/icon.png",
        })
          .then(async(webhook)=>{
            await db(`INSERT INTO \`join\` (server, channel, message, id, token, time) VALUES("${interaction.guild.id}","${interaction.channel.id}","${message}","${webhook.id}","${webhook.token}",NOW()) ON DUPLICATE KEY UPDATE server = VALUES (server),channel = VALUES (channel),message = VALUES (message),id = VALUES (id),token = VALUES (token),time = VALUES (time);`);
            await interaction.editReply({
              embeds:[{
                color: Colors.Green,
                author:{
                  name: "参加メッセージを設定しました",
                  icon_url: "https://cdn.taka.cf/images/system/success.png"
                },
                description: `送信メッセージ: ${message}`
              }]
            });
          })
          .catch(async(error)=>{
            await interaction.editReply({
              embeds:[{
                color: Colors.Red,
                author:{
                  name: "参加メッセージを設定できませんでした",
                  icon_url: "https://cdn.taka.cf/images/system/error.png"
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
          })
      }
    }else if(interaction.options.getSubcommand() === "leave"){//leave
      const message = interaction.options.getString("message");

      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
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
          color: Colors.Red,
          author:{
            name: "BOTに権限がありません",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
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
        const data = await db(`SELECT * FROM \`leave\` WHERE server = ${interaction.guild.id} LIMIT 1;`);
        if(!data[0]) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "退出メッセージを無効にできませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
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
            color: Colors.Green,
            author:{
              name: "退出メッセージを無効にしました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            }
          }]
        });
      }else{
        if(message.length > 100) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "退出メッセージを設定できませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
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
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            description: "メッセージを送信するチャンネルはテキストチャンネルにしてください"
          }],
          ephemeral: true
        });

        await interaction.deferReply();
        await interaction.channel.createWebhook({
          name: "TakasumiBOT Leave",
          avatar: "https://cdn.taka.cf/images/icon.png",
        })
          .then(async(webhook)=>{
            await db(`INSERT INTO \`leave\` (server, channel, message, id, token, time) VALUES("${interaction.guild.id}","${interaction.channel.id}","${message}","${webhook.id}","${webhook.token}",NOW()) ON DUPLICATE KEY UPDATE server = VALUES (server),channel = VALUES (channel),message = VALUES (message),id = VALUES (id),token = VALUES (token),time = VALUES (time);`);
            await interaction.editReply({
              embeds:[{
                color: Colors.Green,
                author:{
                  name: "退出メッセージを設定しました",
                  icon_url: "https://cdn.taka.cf/images/system/success.png"
                },
                description: `送信メッセージ: ${message}`
              }]
            });
          })
          .catch(async(error)=>{
            await interaction.editReply({
              embeds:[{
                color: Colors.Red,
                author:{
                  name: "退出メッセージを設定できませんでした",
                  icon_url: "https://cdn.taka.cf/images/system/error.png"
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
          })
      }
    }else if(interaction.options.getSubcommand() === "ignore"){//ignore
      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
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
              value: "```管理者```"
            }
          ]
        }],
        ephemeral: true
      });

      const data = await db(`SELECT * FROM \`ignore\` WHERE id = ${interaction.guild.id} LIMIT 1;`);
      if(!data[0]){
        await db(`INSERT INTO \`ignore\` (id, time) VALUES("${interaction.guild.id}",NOW()) ON DUPLICATE KEY UPDATE id = VALUES (id),time = VALUES (time);`);
        await db(`DELETE FROM bump WHERE id = ${interaction.guild.id};`);
        await db(`DELETE FROM dissoku WHERE id = ${interaction.guild.id};`);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "有効にしました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            }
          }]
        });
      }else{
        await db(`DELETE FROM \`ignore\` WHERE id = ${interaction.guild.id};`);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "無効にしました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            }
          }]
        });
      }
    }else if(interaction.options.getSubcommand() === "info"){//info
      const bump = await db(`SELECT * FROM bump WHERE id = ${interaction.guild.id} LIMIT 1;`);
      const dissoku = await db(`SELECT * FROM dissoku WHERE id = ${interaction.guild.id} LIMIT 1;`);
      const global = await db(`SELECT * FROM global WHERE server = ${interaction.guild.id} LIMIT 1;`);
      const hiroyuki = await db(`SELECT * FROM hiroyuki WHERE server = ${interaction.guild.id} LIMIT 1;`);
      const ignore = await db(`SELECT * FROM \`ignore\` WHERE id = ${interaction.guild.id} LIMIT 1;`);
      const join = await db(`SELECT * FROM \`join\` WHERE server = ${interaction.guild.id} LIMIT 1;`);
      const leave = await db(`SELECT * FROM \`leave\` WHERE server = ${interaction.guild.id} LIMIT 1;`);
      const pin = await db(`SELECT * FROM pin WHERE server = ${interaction.guild.id};`);
      const server = await db(`SELECT * FROM server WHERE id = ${interaction.guild.id} LIMIT 1;`);
      const up = await db(`SELECT * FROM up WHERE id = ${interaction.guild.id} LIMIT 1;`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "データベース設定状況",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
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
              name: "TakasumiBOT UP通知",
              value: up[0] ? "設定済み":"未設定",
              inline: true
            },
            {
              name: "サーバー掲示板",
              value: server[0] ? "登録済み":"未登録",
              inline: true
            },
            {
              name: "グローバルチャット",
              value: global[0] ? "登録済み":"未登録",
              inline: true
            },
            {
              name: "ひろゆき",
              value: hiroyuki[0] ? "登録済み":"未登録",
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
              name: "ピン",
              value: `${pin.length}個設定済み`,
              inline: true
            }
          ]
        }]
      });
    }else if(interaction.options.getSubcommand() === "delete"){//delete
      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
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
              value: "```管理者```"
            }
          ]
        }],
        ephemeral: true
      });

      await db(`DELETE FROM pin WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM bump WHERE id = ${interaction.guild.id};`);
      await db(`DELETE FROM dissoku WHERE id = ${interaction.guild.id};`);
      await db(`DELETE FROM hiroyuki WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM global WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM \`ignore\` WHERE id = ${interaction.guild.id};`);
      await db(`DELETE FROM \`join\` WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM \`leave\` WHERE server = ${interaction.guild.id};`);
      await db(`DELETE FROM server WHERE id = ${interaction.guild.id};`);
      await db(`DELETE FROM up WHERE id = ${interaction.guild.id};`);

      await interaction.reply({
        content: `<@${interaction.user.id}>`,
        embeds:[{
          color: Colors.Green,
          author:{
            name: "全ての設定情報を削除しました",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          }
        }]
      });
    }
  }
}