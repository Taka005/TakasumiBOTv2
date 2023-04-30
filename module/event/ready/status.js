module.exports = async(client)=>{
  const { ActivityType } = require("discord.js");
  const config = require("../../../config.json"); 

  client.user.setStatus("online");

  let stats = 0; 
  setInterval(()=>{
    if(stats === 0){
      client.user.setActivity(`/help || ping:${client.ws.ping}ms`,{
        type: ActivityType.Playing
      });
      stats = 1;
    }else if(stats === 1){
      client.user.setActivity(`${client.guilds.cache.size}server || ${client.guilds.cache.map((g)=>g.memberCount).reduce((a,c)=>a+c)}user`,{
        type: ActivityType.Playing
      });
      stats = 0;
    }
  },5000)

  await client.channels.cache.get(config.log).send("システムが再起動されました");

  console.log(`\x1b[34mINFO: Account ${client.user.tag}\x1b[39m`);
  console.log(`\x1b[34mINFO: Server:${client.guilds.cache.size} User:${client.guilds.cache.map((g)=>g.memberCount).reduce((a,c)=>a+c)}\x1b[39m`);
}
