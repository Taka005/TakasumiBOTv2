module.exports = async(client)=>{
  const { ActivityType } = require("discord.js");
  const fetchGuildCounts = require("../../lib/fetchGuildCounts");
  const fetchUserCounts = require("../../lib/fetchUserCounts");

  client.user.setStatus("online");

  let stats = 0;
  setInterval(async()=>{
    if(stats === 0){
      client.user.setActivity(`[メンテ予定] 8日 10時～12時`,{
        // `/help || ping:${client.ws.ping}ms`
        type: ActivityType.Playing
      });

      stats = 1;
    }else if(stats === 1){
      client.user.setActivity(`[予定] v3リリース メンテナンス`,{
        // `${await fetchGuildCounts(client)}server || ${await fetchUserCounts(client)}user${client.shard ? ` || ${client.shard.count}shard` : ""}`
        type: ActivityType.Playing
      });

      stats = 0;
    }
  },5000);
}
