module.exports = async(interaction)=>{
  const { WebhookClient, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "hiroyuki"){
  
    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return await interaction.reply({
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
            value: "```チャンネルの管理```"
          }
        ]
      }],
      ephemeral: true
    });
  
    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageWebhooks)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageMessages)
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
            value: "```チャンネルの閲覧\nメッセージの送信\nウェブフックの管理\nチャンネルの管理```"
          }
        ]
      }],
      ephemeral: true
    });
  
    const data = await db(`SELECT * FROM hiroyuki WHERE server = ${interaction.guild.id} LIMIT 1;`);
    if(data[0]){0
      const webhook = new WebhookClient({id: data[0].id, token: data[0].token});

      await db(`DELETE FROM hiroyuki WHERE server = ${interaction.guild.id} LIMIT 1;`);
      await webhook.delete()
        .then(async()=>{
          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: "ひろゆきの退出が完了しました",
                icon_url: "https://cdn.taka.cf/images/system/success.png"
              }
            }]
          });
        })
        .catch(async()=>{
          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: "ひろゆきの退出が完了しました",
                icon_url: "https://cdn.taka.cf/images/system/success.png"
              },
              description: "※webhookは既に削除済みのため、\n登録情報のみ削除しました"
            }]
          });
        })
    }else{//登録なし
      await interaction.deferReply();
      try{
        await interaction.channel.createWebhook({
          name: "ひろゆき",
          avatar: "https://cdn.taka.cf/images/hiroyuki.png",
        });

        await db(`INSERT INTO hiroyuki (channel, server, id, token, time) VALUES("${interaction.channel.id}","${interaction.guild.id}","${webhook.id}","${webhook.token}",NOW());`);

        await interaction.editReply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "ひろゆきの召喚に成功しました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            }
          }]
        });
      }catch(error){
        await interaction.editReply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "ひろゆきの召喚に失敗しました",
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
      }
    }
  }
}