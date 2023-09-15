module.exports = async(client,channelId)=>{
  try{
    if(client.shard){
      return await client.shard.broadcastEval((c,id)=>c.channels.fetch(id),{ 
        context: channelId
      }).find(res=>res)||null;
    }else{
      return await client.channels.fetch(channelId);
    }
  }catch{
    return null;
  }
}