module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const time = require("../../lib/time");
  const escape = require("../../lib/escape");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "afk"){
    const message = interaction.options.getString("message")||"メッセージはありません";

    if(message.length>300) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "AFKを設定できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "メッセージは300文字未満にしてください"
      }],
      ephemeral: true
    });

    const data = await db(`SELECT * FROM afk WHERE id = ${interaction.user.id};`);
    if(data[0]){
      await db(`DELETE FROM afk WHERE id = ${interaction.user.id};`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "AFKを無効にしました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `メンションは${data[0].mention}件ありました\n${time(new Date()-new Date(data[0].time))}間AFKでした`
        }]
      });
    }else{
      await db(`INSERT INTO afk (id, message, mention, time) VALUES("${interaction.user.id}","${escape(message)}","0",NOW());`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "AFKを有効にしました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }
  }
}