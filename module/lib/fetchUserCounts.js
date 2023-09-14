module.exports = async(client)=>{
  if(client.shard){
    return (await client.shard.broadcastEval(c=>c.guilds.cache.reduce((a,g)=>a+g.memberCount,0)))
      .reduce((a,c)=>a+c,0);
  }else{
    return client.guilds.cache.reduce((a,g)=>a+g.memberCount,0);
  }
}