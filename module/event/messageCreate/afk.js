module.exports = async(message)=>{
  const db = require("../../lib/db");
  const time = require("../../lib/time");
  const limit = require("../../lib/limit");

  if(
    message.author.bot||
    !message.guild.members.me.permissionsIn(message.channel).has("VIEW_CHANNEL")||
    !message.guild.members.me.permissionsIn(message.channel).has("SEND_MESSAGES")
  ) return;

  let data = await db(`SELECT * FROM afk WHERE user = ${message.author.id} LIMIT 1;`);
  if(data[0]){
    await db(`DELETE FROM afk WHERE user = ${message.author.id} LIMIT 1;`);
    message.channel.send({
      embeds:[{
        author:{
          name: "AFKを無効にしました",
          icon_url: "https://cdn.taka.ml/images/system/success.png"
        },
        color: "GREEN",
        description: `メンションは${data[0].mention}件ありました\n${time(new Date()-new Date(data[0].time))}間AFKでした`
      }]
    }).catch(()=>{})
  }else{
    const mention = message.content.match(/<@\d{18,19}>/g);
    if(mention){
      const id = mention[0].match(/\d{18,19}/g);
      data = await db(`SELECT * FROM afk WHERE user = ${id[0]} LIMIT 1;`);
      if(data[0]){
        if(limit(message)) return;
        await db(`UPDATE afk SET mention = ${Number(data[0].mention)+1} WHERE user = ${id[0]}`);
        message.channel.send({
          embeds:[{
            author:{
              name: "AFK中です",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: "GREEN",
            description: data[0].message
          }]
        }).catch(()=>{})
      }
    }
  }
}