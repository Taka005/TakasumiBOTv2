module.exports = async(channel,messageId)=>{
  try{
    return await channel.messages.fetch(messageId);
  }catch{
    return null;
  }
}