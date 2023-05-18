const spam = require("../../lib/spam");
const Spam = new spam(800);

module.exports = async(message)=>{
  const db = require("../../lib/db");
  const { WebhookClient, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const async = require("async");

  if(!(await db(`SELECT * FROM global WHERE channel = ${message.channel.id} LIMIT 1;`))[0]) return;

  if(
    (await db(`SELECT * FROM mute_server WHERE id = ${message.guild.id} LIMIT 1;`))[0]||
    (await db(`SELECT * FROM mute_user WHERE id = ${message.author.id} LIMIT 1;`))[0]||
    message.content.length > 300||
    Spam.count(message.guild.id)
  ) return message.react("❌").catch(()=>{});

  if(!(await db(`SELECT * FROM account WHERE id = ${message.author.id} LIMIT 1;`))[0]) return await message.reply({ 
      embeds:[{
        author:{
          name: "利用規約に同意してください",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "以下のリンクから認証を行うことでグローバルチャットを利用できます\n認証が完了すると[利用規約](https://gc.taka.ml/)に同意したものとみなします",
      }], 
      components:[
        new ActionRowBuilder()
          .addComponents( 
            new ButtonBuilder()
              .setLabel("サイトへ飛ぶ")
              .setURL("https://auth.taka.ml/")
              .setStyle(ButtonStyle.Link))
          .addComponents( 
            new ButtonBuilder()
              .setLabel("サポートサーバー")
              .setURL("https://discord.gg/NEesRdGQwD")
              .setStyle(ButtonStyle.Link))
      ]
    }).catch(()=>{});

}