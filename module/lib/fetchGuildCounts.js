module.exports = async(client)=>{
  if(client.shard){
    return (await client.shard.broadcastEval(c=>c.guilds.cache.size))
      .reduce((a,c)=>a+c,0);
  }else{
    return client.guilds.cache.size;
  }
}