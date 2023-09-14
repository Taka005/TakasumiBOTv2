module.exports = async(client)=>{
  const { ActivityType } = require("discord.js");
  const fetchGuildCounts = require("../../fetchGuildCounts");
  const fetchUserCounts = require("../../fetchUserCounts");
  const config = require("../../../config.json"); 

  client.user.setStatus("online");

  let stats = 0; 
  setInterval(async()=>{
    if(stats === 0){
      client.user.setActivity(`/help || ping:${client.ws.ping}ms`,{
        type: ActivityType.Playing
      });
      stats = 1;
    }else if(stats === 1){
      client.user.setActivity(`${await fetchGuildCounts(client)}server || ${await fetchUserCounts(client)}user${client.shard ? ` || ${client.shard.id}shard` : ""}`,{
        type: ActivityType.Playing
      });
      stats = 0;
    }
  },5000)

  await client.channels.cache.get(config.log).send("システムが再起動されました");

  console.log(`\x1b[34mINFO: Account ${client.user.tag}\x1b[39m`);
  console.log(`\x1b[34mINFO: Server:${await fetchGuildCounts(client)} User:${await fetchUserCounts(client)}\x1b[39m`);
}
