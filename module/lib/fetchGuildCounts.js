module.exports = async(client)=>{
  if(client.shard){
    return (await client.shard.broadcastEval(c=>c.guilds.cache.filter(g=>g.available).size))
      .reduce((a,c)=>a+c,0);
  }else{
    return client.guilds.cache.filter(g=>g.available).size;
  }
}