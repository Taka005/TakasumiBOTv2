module.exports = async(client,guildId)=>{
  try{
    return await client.guilds.fetch(guildId);
  }catch{
    return null;
  }
}