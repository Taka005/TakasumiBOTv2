module.exports = async(message)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const time = require("../../lib/time");
  const limit = require("../../lib/limit");

  if(
    message.author.bot||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ViewChannel)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.SendMessages)
  ) return;

  const data = await db(`SELECT * FROM afk WHERE id = ${message.author.id};`);
  if(data[0]){
    await db(`DELETE FROM afk WHERE id = ${message.author.id};`);
    await message.channel.send({
      embeds:[{
        color: Colors.Green,
        author:{
          name: "AFKを無効にしました",
          icon_url: "https://cdn.takasumibot.com/images/system/success.png"
        },
        description: `メンションは${data[0].mention}件ありました\n${time(new Date()-new Date(data[0].time))}間AFKでした`
      }]
    }).catch(()=>{});
  }else{
    const mention = message.content.match(/<@\d{17,19}>/g);
    if(mention){
      const id = mention[0].match(/\d{17,19}/g);
      const afk = await db(`SELECT * FROM afk WHERE id = ${id[0]};`);
      if(afk[0]){
        if(limit(message)) return;
        await db(`UPDATE afk SET mention = mention + 1, time = time WHERE id = ${afk[0].id}`);
        await message.channel.send({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "AFK中です",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            },
            description: afk[0].message
          }]
        }).catch(()=>{});
      }
    }
  }
}