module.exports = async(interaction)=>{
  const { PermissionFlagsBits, ChannelType, Colors } = require("discord.js");
  const db = require("../../lib/db");

  if(
    message.author.bot||
    message.channel.type !== ChannelType.GuildAnnouncement
  ) return;

  const data = await db(`SELECT * FROM announce WHERE channel = ${message.channel.id} LIMIT 1;`);
  if(data[0]){
    try{
      await message.crosspost();
      await message.react("✅");
    }catch{
      (await db(`SELECT * FROM announce WHERE server = ${message.guild.id};`))
        .forEach(async(data)=>{
          await db(`UPDATE announce SET count = ${Number(data.count)-1} WHERE server = ${message.guild.id};`);
        });
      await db(`DELETE FROM announce WHERE channel = ${message.channel.id} LIMIT 1;`);
    }
  }
}