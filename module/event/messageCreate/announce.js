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
      await db(`DELETE FROM announce WHERE channel = ${message.channel.id};`);
    }
  }
}