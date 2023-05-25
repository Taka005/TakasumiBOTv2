module.exports = async(interaction,Lang)=>{
  const fs = require("fs");
  const { Colors } = require("discord.js");
  const { admin } = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "reload"){
    
    if(interaction.user.id !== admin) return await interaction.reply({
      embeds:[{
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "このコマンドは関係者以外実行できません"
      }],
      ephemeral: true
    });
    
    //commands
    fs.readdir("./module/function/command/",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../command/${file}`);
        delete require.cache[require.resolve(`../command/${file}`)];
      });
    });
    //ContextMenu
    fs.readdir("./module/function/contextmenu/",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../contextmenu/${file}`);
        delete require.cache[require.resolve(`../contextmenu/${file}`)];
      });
    });
    //event/guildCreate
    fs.readdir("./module/event/guildCreate/",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../../event/guildCreate/${file}`);
        delete require.cache[require.resolve(`../../event/guildCreate/${file}`)];
      });
    });
    //event/guildDelete
    fs.readdir("./module/event/guildDelete/",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../../event/guildDelete/${file}`);
        delete require.cache[require.resolve(`../../event/guildDelete/${file}`)];
      });
    });
    //event/guildMemberAdd
    fs.readdir("./module/event/guildMemberAdd/",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../../event/guildMemberAdd/${file}`);
        delete require.cache[require.resolve(`../../event/guildMemberAdd/${file}`)];
      });
    });
    //event/guildMemberRemove
    fs.readdir("./module/event/guildMemberRemove/",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../../event/guildMemberRemove/${file}`);
        delete require.cache[require.resolve(`../../event/guildMemberRemove/${file}`)];
      });
    });
    //event/interactionCreate
    fs.readdir("./module/event/interactionCreate/",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../../event/interactionCreate/${file}`);
        delete require.cache[require.resolve(`../../event/interactionCreate/${file}`)];
      });
    });
    //event/messageCreate
    fs.readdir("./module/event/messageCreate/",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../../event/messageCreate/${file}`);
        delete require.cache[require.resolve(`../../event/messageCreate/${file}`)];
      });
    });
    //event/messageUpdate
    fs.readdir("./module/event/messageUpdate/",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../../event/messageUpdate/${file}`);
        delete require.cache[require.resolve(`../../event/messageUpdate/${file}`)];
      });
    });
    //lib
    fs.readdir("./module/lib/",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../../lib/${file}`);
        delete require.cache[require.resolve(`../../lib/${file}`)];
      });
    });
    //global
    fs.readdir("./module/function/globalchat",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../globalchat/${file}`);
        delete require.cache[require.resolve(`../globalchat/${file}`)];
      });
    });
    //slashcommands
    fs.readdir("./module/function/slashcommand/",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../slashcommand/${file}`);
        delete require.cache[require.resolve(`../slashcommand/${file}`)];
      });
    });
    //auth
    fs.readdir("./module/function/auth/",(err,files)=>{ 
      files.forEach((file) =>{
        if(!file.endsWith(".js")) return;
        require(`../auth/${file}`);
        delete require.cache[require.resolve(`../auth/${file}`)];
      });
    });
    
    //その他
    delete require.cache[require.resolve("../../../config.json")];
    delete require.cache[require.resolve("../../../package.json")];
    delete require.cache[require.resolve("../../../package-lock.json")];
    delete require.cache[require.resolve("../../../file/commandlist.json")];

    require("../../event/ready/command")(interaction.client);

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        description: "リロードが完了しました",
      }]
    });
  }
}