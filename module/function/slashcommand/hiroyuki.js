module.exports = async(interaction)=>{
    const mysql = require("../lib/mysql");
    const { WebhookClient, MessageButton, MessageActionRow } = require("discord.js");
    if(!interaction.isCommand()) return;
    if(interaction.commandName === "hiroyuki"){
  
      if(!interaction.member.permissions.has("MANAGE_CHANNELS")) return await interaction.reply({
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
        !interaction.guild.members.me.permissionsIn(interaction.channel).has("MANAGE_WEBHOOKS")||
        !interaction.guild.members.me.permissionsIn(interaction.channel).has("VIEW_CHANNEL")||
        !interaction.guild.members.me.permissionsIn(interaction.channel).has("SEND_MESSAGES")||
        !interaction.guild.members.me.permissionsIn(interaction.channel).has("MANAGE_CHANNELS")
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
              value: "```チャンネルの閲覧\nメッセージの送信\nウェブフックの管理\nチャンネルの管理```"
            }
          ]
        }],
        ephemeral: true
      });
  
      const data = await mysql(`SELECT * FROM hiroyuki WHERE server = ${interaction.guild.id} LIMIT 1;`);

      if(data[0]){//登録済み
        const webhook = new WebhookClient({id: data[0].id, token: data[0].token});

        await mysql(`DELETE FROM hiroyuki WHERE server = ${interaction.guild.id} LIMIT 1;`);
        await webhook.delete()
          .then(async()=>{
            await interaction.reply({
              embeds:[{
                author:{
                  name: "ひろゆきの退出が完了しました",
                  icon_url: "https://cdn.taka.ml/images/system/success.png"
                },
                color: "GREEN"
              }]
            });
          })
          .catch(async()=>{
            await interaction.reply({
              embeds:[{
                author:{
                  name: "ひろゆきの退出が完了しました",
                  icon_url: "https://cdn.taka.ml/images/system/success.png"
                },
                description: "※webhookは既に削除済みのため、\n登録情報のみ削除しました",
                color: "GREEN"
              }]
            });
          })
      }else{//登録なし
        await interaction.deferReply();

        await interaction.channel.createWebhook("ひろゆき",{
          avatar: "https://cdn.taka.ml/images/hiroyuki.png",
        })
          .then(async(webhook)=>{
            await mysql(`INSERT INTO hiroyuki (channel, server, id, token, time) VALUES("${interaction.channel.id}","${interaction.guild.id}","${webhook.id}","${webhook.token}",NOW()) ON DUPLICATE KEY UPDATE channel = VALUES (channel),server = VALUES (server),id = VALUES (id),token = VALUES (token),time = VALUES (time);`);

            await interaction.editReply({
              embeds:[{
                color: "GREEN",
                author:{
                  name: "ひろゆきの召喚に成功しました",
                  icon_url: "https://cdn.taka.ml/images/system/success.png"
                }
              }]
            });
          })
          .catch(async(error)=>{
            await interaction.editReply({
              embeds:[{
                author:{
                  name: "ひろゆきの召喚に失敗しました",
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
                new MessageActionRow()
                  .addComponents( 
                    new MessageButton()
                      .setLabel("サポートサーバー")
                      .setURL("https://discord.gg/NEesRdGQwD")
                      .setStyle("LINK"))
              ]
            });
          })
      }
  }
}