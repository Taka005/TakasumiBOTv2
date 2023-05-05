module.exports = async(client,channelId)=>{
  try{
    return await client.channels.fetch(channelId);
  }catch{
    return null;
  }
}