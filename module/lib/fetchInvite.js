module.exports = async(guild,code)=>{
  try{
    return await guild.invites.fetch(code)
  }catch{
    return null;
  }
}