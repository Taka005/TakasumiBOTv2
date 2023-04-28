module.exports = async(message,client)=>{
  const fs = require("fs");
  const config = require("../../../config.json");
  if(message.content.startsWith(`${config.prefix}exec`)){
    if(message.author.id !== `${config.admin}`) return message.reply("このコマンドは関係者専用です").catch(()=>{});
    if(message.content === `${config.prefix}exec`) return message.reply("実行するコードが必要です").catch(()=>{});
    
    const script = `module.exports = async(message,client)=>{\n  ${message.content.slice(6)}\n}`;
    try{
      fs.writeFileSync("./tmp/script.js",script,"utf8");
      const run = require("../../../tmp/script");
      await run(message,client);
    }catch(error){
      message.reply(`実行中にエラーが発生しました\n\`\`\`js\n${error.stack}\`\`\``).catch(()=>{});
    }
    delete require.cache[require.resolve("../../../tmp/script")];
    }
}