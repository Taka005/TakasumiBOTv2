module.exports = async(interaction,client)=>{
  const { MessageButton, MessageActionRow } = require("discord.js");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "follow"){

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
 
    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has("MANAGE_CHANNELS")) return await interaction.reply({
      embeds:[{
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "この機能はBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    await client.channels.cache.get("1049155527214628954").addFollower(interaction.channel,"TakasumiBOTアナウンス")
      .then(async()=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "アナウンスチャンネルを追加しました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            description: "このチャンネルでBOTをお知らせを受け取ることができます",
            color: "GREEN"
          }]
        });
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "フォローチャンネルを追加できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
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
          ],
          ephemeral: true
        });
      })
  }
}