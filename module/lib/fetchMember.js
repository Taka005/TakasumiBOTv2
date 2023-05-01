module.exports = async(guild,memberId)=>{
  try{
    return await guild.members.fetch(memberId);
  }catch{
    return null;
  }
}