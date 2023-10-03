const spam = require("../../lib/spam");
const Spam = new spam(5000,true);

module.exports = async(message)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const sleep = require("../../lib/sleep");

  if(message.author.bot) return;
    
  const data = await db(`SELECT * FROM pin WHERE channel = ${message.channel.id} LIMIT 1;`);
  if(data[0]){
    if(Spam.count(message.guild.id)) return;
    await sleep(5000);

    try{
      const before = await message.channel.messages.fetch(data[0].message);
      await before.delete();

      const after = await message.channel.send({
        embeds:[{
          color: Colors.Green,
          author:{
            name: before.embeds[0].author.name,
            icon_url: before.embeds[0].author.iconURL,
          },
          description: before.embeds[0].description,
          footer:{
            text: "TakasumiBOT PIN"
          }
        }]
      });

      await db(`UPDATE pin SET message = ${after.id} WHERE channel = ${message.channel.id};`);
    }catch{
      await db(`UPDATE pin SET count = ${Number(data[0].count)-1} WHERE server = ${message.guild.id};`);
      await db(`DELETE FROM pin WHERE channel = ${message.channel.id} LIMIT 1;`);
    }
  }
}  