module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "account"){
    const account = await db(`SELECT * FROM account WHERE id = ${interaction.user.id};`);

    if(!account[0]) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "登録されていません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "以下のリンクから登録を行うことができます\n登録が完了すると[利用規約](https://www.takasumibot.com/terms.html)にも同意したものとみなします"
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel("サイトへ移動")
              .setURL("https://auth.takasumibot.com/")
              .setStyle(ButtonStyle.Link))
      ],
      ephemeral: true
    });

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: "登録情報",
          icon_url: "https://cdn.takasumibot.com/images/system/success.png"
        },
        description: `ID\n\`${account[0].id}\`\nIPアドレス\n\`${account[0].ip}\`\n登録日時/更新日時\n\`${new Date(account[0].time).toLocaleString("ja-JP")}\``
      }],
      ephemeral: true
    });
  }
}