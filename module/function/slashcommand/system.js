module.exports = async(interaction)=>{
  const { WebhookClient, Colors } = require("discord.js");
  const { admin } = require("../../../config.json");
  const db = require("../../lib/db");
  const fetchGuild = require("../../lib/fetchGuild");
  const fetchUser = require("../../lib/fetchUser");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "system"){
    const id = interaction.options.getString("id");
    const type = interaction.options.getString("type");
    const message = interaction.options.getString("message") || "なし"

    if(interaction.user.id !== admin) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "このコマンドは関係者以外実行できません"
      }],
      ephemeral: true
    });

    const ID = id.match(/\d{18,19}/g);
    if(!ID) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "引数が無効です",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "ユーザー又はサーバーIDを指定する必要があります"
      }],
      ephemeral: true
    });

    if(type === "leave"){//サーバーから脱退する
      const guild = await fetchGuild(interaction.client,ID[0]);
      if(!guild) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "サーバーから脱退できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "指定したサーバーが存在しません"
        }],
        ephemeral: true
      });

      await guild.leave()
        .then(async(g)=>{
          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${g.name} から脱退しました`,
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              }
            }]
          })
        })
        .catch(async(error)=>{
          await interaction.reply({
            embeds:[{
              color: Colors.Red,
              author:{
                name: "サーバーから脱退できませんでした",
                icon_url: "https://cdn.taka.ml/images/system/error.png"
              },
              description: `\`\`\`${error}\`\`\``
            }],
            ephemeral: true
          });
        });
    }else if(type === "delete"){//グローバルチャットの登録情報を削除
      const guild = await fetchGuild(interaction.client,ID[0]);
      if(!guild) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "登録情報を削除できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "指定したサーバーが存在しません"
        }],
        ephemeral: true
      });

      const data = await db(`SELECT * FROM global WHERE server = ${guild.id} LIMIT 1;`);
  
      if(!data[0]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "登録情報を削除できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "指定されたサーバーは登録されていません"
        }],
        ephemeral: true
      });

      const webhooks = new WebhookClient({id: data[0].id, token: data[0].token});
      await webhooks.delete()
        .then(async()=>{
          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${guild.name} の登録の削除が完了しました`,
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              }
            }]
          });
        })
        .catch(async()=>{
          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${guild.name} の登録の削除が完了しました`,
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              description: "※webhookは既に削除済みのため、\n登録情報のみ削除しました"
            }]
          })
        });

      await interaction.client.channels.cache.get(data.channel).send({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "登録情報が削除されました",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "グローバルチャットは、管理者によって強制的に切断されました\n再度登録するには`/global`を使用してください"
        }]
      }).catch(()=>{});

    }else if(type === "mute_server"){//ミュートサーバーを追加する
      const data = await db(`SELECT * FROM mute_server WHERE id = ${ID[0]} LIMIT 1;`);
      if(data[0]){//登録済み
        await db(`DELETE FROM mute_server WHERE id = ${ID[0]} LIMIT 1;`);
  
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${ID[0]} のミュートを解除しました`,
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            }
          }]
        });
      }else{//登録なし
        await db(`INSERT INTO mute_server (id, reason, time) VALUES("${ID[0]}","${message||"なし"}",NOW())`);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${ID[0]} をミュートしました`,
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            }
          }]
        });
      }
    }else if(type === "mute_user"){//ミュートユーザーを追加する
      const user = await fetchUser(interaction.client,ID[0]);
      if(!user) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "ユーザーをミュートできませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "指定したユーザーが存在しません"
        }],
        ephemeral: true
      });
  
      const data = await db(`SELECT * FROM mute_user WHERE id = ${ID[0]} LIMIT 1;`);
      if(data[0]){//登録済み
        await db(`DELETE FROM mute_user WHERE id = ${ID[0]} LIMIT 1;`);
  
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${user.tag} のミュートを解除しました`,
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            }
          }]
        });
      }else{//登録なし
        await db(`INSERT INTO mute_user (id, reason, time) VALUES("${ID[0]}","${message||"なし"}",NOW())`);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${user.tag} をミュートしました`,
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            }
          }]
        });
      }
    }else if(type === "dm"){//DMを送信する
      const user = await fetchUser(interaction.client,ID[0]);
      if(!user) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "ユーザーにDMを送信できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "指定したユーザーが存在しません"
        }],
        ephemeral: true
      });

      await user.send(`${message}`)
        .then(async()=>{
          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${user.tag} にDMを送信しました`,
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              description: `内容:${message}`
            }],
            ephemeral: true
          })
        })
        .catch(async()=>{
          await interaction.reply({
            embeds:[{
              color: Colors.Red,
              author:{
                name: "送信に失敗しました",
                icon_url: "https://cdn.taka.ml/images/system/error.png"
              },
              description: "ユーザーがDMを有効にしていません"
            }],
            ephemeral: true
          })
        });
    }
  }
}