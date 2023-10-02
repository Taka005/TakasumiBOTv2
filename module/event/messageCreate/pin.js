const wait = require("../../lib/wait");
const Wait = new wait(5000);

module.exports = async(message)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const sleep = require("../../lib/sleep");

  if(message.author.bot) return;
    
  const channel = await db(`SELECT * FROM pin WHERE channel = ${message.channel.id} LIMIT 1;`);
  if(channel[0]){
    if(Wait.count(message.guild.id)) return;
    await sleep(5000);

    try{
      const before = await message.client.channels.cache.get(channel[0].channel).messages.fetch(channel[0].message)
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
      await db(`UPDATE pin SET count = ${Number(channel[0].count)-1} WHERE server = ${message.guild.id};`);
      await db(`DELETE FROM pin WHERE channel = ${message.channel.id} LIMIT 1;`);
    }
  }
}  