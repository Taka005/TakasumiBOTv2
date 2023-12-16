module.exports = async(message)=>{
  const { ChannelType } = require("discord.js");
  const db = require("../../lib/db");

  if(
    message.author.bot||
    message.channel.type !== ChannelType.GuildAnnouncement
  ) return;

  const data = await db(`SELECT * FROM announce WHERE channel = ${message.channel.id};`);
  if(data[0]){
    try{
      await message.crosspost();
      await message.react("✅");
    }catch{
      await db(`UPDATE announce SET count = ${Number(data[0].count)-1} WHERE server = ${message.guild.id};`);
      await db(`DELETE FROM announce WHERE channel = ${message.channel.id};`);
    }
  }
}