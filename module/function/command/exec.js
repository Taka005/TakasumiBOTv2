module.exports = async(message)=>{
  const fs = require("fs");
  const { admin } = require("../../../config.json");
  if(message.content.startsWith(`${config.prefix}exec`)){
    if(message.author.id !== admin) return message.reply("このコマンドは関係者専用です").catch(()=>{});
    
    const script = `module.exports = async(message,client)=>{\n  ${message.content.slice(6)}\n}`;
    try{
      fs.writeFileSync("./tmp/script.js",script,"utf8");
      await require("../../../tmp/script")(message,message.client);
    }catch(error){
      message.reply(`実行中にエラーが発生しました\n\`\`\`js\n${error.stack}\`\`\``).catch(()=>{});
    }
    delete require.cache[require.resolve("../../../tmp/script")];
  }
}