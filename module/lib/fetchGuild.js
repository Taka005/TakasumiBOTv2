module.exports = async(client,guildId)=>{
  try{
    if(client.shard){
      return await client.shard.broadcastEval((c,id)=>c.guilds.fetch(id),{ 
        context: guildId
      }).find(res=>!!res)||null;
    }else{
      return await client.guilds.fetch(guildId);
    }
  }catch{
    return null;
  }
}