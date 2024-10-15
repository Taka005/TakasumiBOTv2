module.exports = async(interaction)=>{
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "product"){
    Promise.all(global.product.map(fn=>fn(interaction)));
  }
}