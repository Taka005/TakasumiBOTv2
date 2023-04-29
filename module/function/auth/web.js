module.exports = async(interaction)=>{
  const db = require("../../lib/db");
  const { MessageButton, MessageActionRow } = require("discord.js");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("web_")){
    const role = interaction.customId.split("_");

    if(interaction.member.roles.cache.has(role[1])) return await interaction.reply({
      embeds:[{
        author:{
          name: "既に認証済みです",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
      }],
      ephemeral: true
    });

    const account = await db(`SELECT * FROM account WHERE id = ${interaction.user.id} LIMIT 1;`);
    if(!account[0]) return await interaction.reply({
      embeds:[{
        author:{
          name: "認証してください",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "以下のリンクから認証を行い、再度認証ボタンを押してください\n認証してから3分を超えるとタイムアウトになります"
      }],
      components:[
        new MessageActionRow()
          .addComponents( 
            new MessageButton()
              .setLabel("サイトへ飛ぶ")
              .setURL("https://auth.taka.ml/")
              .setStyle("LINK")
          )
      ],
      ephemeral: true
    });

    if(new Date()-new Date(account[0].time)>180000) return await interaction.reply({
      embeds:[{
        author:{
          name: "認証してください",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: `前回の認証から3分以上が経過しているため、再度認証を行なってください\n前回の認証日時: ${new Date(account[0].time).toLocaleString()}`
      }],
      components:[
        new MessageActionRow()
          .addComponents( 
            new MessageButton()
              .setLabel("サイトへ飛ぶ")
              .setURL("https://auth.taka.ml/")
              .setStyle("LINK")
          )
      ],
      ephemeral: true
    });

    await interaction.member.roles.add(role[1])
      .then(async()=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "認証しました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: "GREEN"
          }],
          ephemeral: true
        });
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "認証に失敗しました",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
            description: "BOTの権限が不足しているか、付与するロールがBOTより上の可能性があります",
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
        })
      })
  }
}