const Spam = require("../../lib/spam");
const spam = new Spam(6000,true);

module.exports = async(message)=>{
  const db = require("../../lib/db");
  const sleep = require("../../lib/sleep");

  if(message.author.bot) return;

  const data = await db(`SELECT * FROM pin WHERE channel = ${message.channel.id};`);
  if(data[0]){
    if(spam.count(message.channel.id)) return;
    await sleep(5000);

    try{
      const before = await message.channel.messages.fetch(data[0].message);
      await before.delete();

      const after = await message.channel.send({
        embeds: before.embeds
      });

      await db(`UPDATE pin SET message = ${after.id} WHERE channel = ${message.channel.id};`);
    }catch{
      await db(`UPDATE pin SET count = ${data[0].count-1} WHERE server = ${message.guild.id};`);
      await db(`DELETE FROM pin WHERE channel = ${message.channel.id};`);
    }
  }
}