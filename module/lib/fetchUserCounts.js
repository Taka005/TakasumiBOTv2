module.exports = async(client)=>{
  if(client.shard){
    const users = await client.shard.broadcastEval(c=>{
      return c.guilds.cache
        .filter(g=>g.available)
        .reduce((a,g)=>a+g.memberCount,0)
    });

    return users.reduce((a,c)=>a+c,0);
  }else{
    return client.guilds.cache
      .filter(g=>g.available)
      .reduce((a,g)=>a+g.memberCount,0);
  }
}