module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const config = require("../../../config.json");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("web_")){
    const data = interaction.customId.split("_");

    if(interaction.member.roles.cache.has(data[1])) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "既に認証済みです",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        }
      }],
      ephemeral: true
    });

    const account = await db(`SELECT * FROM account WHERE id = ${interaction.user.id};`);
    if(!account[0]) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "認証してください",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "以下のリンクからWeb認証を行い、再度認証ボタンを押してください\n認証してから3分を超えるとタイムアウトになります"
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel("サイトへ飛ぶ")
              .setURL("https://auth.takasumibot.com/")
              .setStyle(ButtonStyle.Link)
          )
      ],
      ephemeral: true
    });

    if(new Date() - new Date(account[0].time) > 180000) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "認証してください",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: `前回の認証から3分以上が経過しているため再度認証を行なってください\n前回の認証日時: ${new Date(account[0].time).toLocaleString()}`
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel("サイトへ飛ぶ")
              .setURL("https://auth.takasumibot.com/")
              .setStyle(ButtonStyle.Link)
          )
      ],
      ephemeral: true
    });

    try{
      await interaction.member.roles.add(data[1]);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "認証しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }],
        ephemeral: true
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "認証に失敗しました",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "BOTの権限が不足しているか、付与するロールがBOTより上の可能性があります",
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
        ],
        ephemeral: true
      });
    }
  }
}