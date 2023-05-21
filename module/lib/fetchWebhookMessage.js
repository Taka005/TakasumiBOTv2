module.exports = async(webhook,messageId)=>{
  try{
    return await webhook.fetchMessage(messageId);
  }catch{
    return null;
  }
}