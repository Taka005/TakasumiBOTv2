module.exports = async(client,code)=>{
  try{
    return await client.fetchInvite(code);
  }catch{
    return null;
  }
}