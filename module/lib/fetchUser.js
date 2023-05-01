module.exports = async(client,userId)=>{
  try{
    return await client.users.fetch(userId);
  }catch{
    return null;
  }
}