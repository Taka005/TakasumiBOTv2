module.exports = async(guild,channelId)=>{
  try{
    return await guild.channels.fetch(channelId);
  }catch{
    return null;
  }
}