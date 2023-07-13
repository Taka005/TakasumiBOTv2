module.exports = async(interaction)=>{
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

    await interaction.deferReply();
    
    //commands
    fs.readdirSync("./module/function/command")
      .map(file=>{
        require(`../command/${file}`)
        delete require.cache[require.resolve(`../command/${file}`)];
      });

    //ContextMenu
    fs.readdirSync("./module/function/contextmenu/")
      .map(file=>{
        require(`../contextmenu/${file}`)
        delete require.cache[require.resolve(`../contextmenu/${file}`)];
      });

    //event/guildCreate
    fs.readdirSync("./module/event/guildCreate/")
      .map(file=>{
        require(`../../event/guildCreate/${file}`)
        delete require.cache[require.resolve(`../../event/guildCreate/${file}`)];
      });

    //event/guildDelete
    fs.readdirSync("./module/event/guildDelete/")
      .map(file=>{
        require(`../../event/guildDelete/${file}`)
        delete require.cache[require.resolve(`../../event/guildDelete/${file}`)];
      });

    //event/guildMemberAdd
    fs.readdirSync("./module/event/guildMemberAdd/")
      .map(file=>{
        require(`../../event/guildMemberAdd/${file}`)
        delete require.cache[require.resolve(`../../event/guildMemberAdd/${file}`)];
      });

    //event/guildMemberRemove
    fs.readdirSync("./module/event/guildMemberRemove/")
      .map(file=>{
        require(`../../event/guildMemberRemove/${file}`)
        delete require.cache[require.resolve(`../../event/guildMemberRemove/${file}`)];
      });

    //event/interactionCreate
    fs.readdirSync("./module/event/interactionCreate/")
      .map(file=>{
        require(`../../event/interactionCreate/${file}`)
        delete require.cache[require.resolve(`../../event/interactionCreate/${file}`)];
      });

    //event/messageCreate
    fs.readdirSync("./module/event/messageCreate/")
      .map(file=>{
        require(`../../event/messageCreate/${file}`)
        delete require.cache[require.resolve(`../../event/messageCreate/${file}`)];
      });

    //event/messageUpdate
    fs.readdirSync("./module/event/messageUpdate/")
      .map(file=>{
        require(`../../event/messageUpdate/${file}`)
        delete require.cache[require.resolve(`../../event/messageUpdate/${file}`)];
      });
    
    //lib
    fs.readdirSync("./module/lib/")
      .map(file=>{
        require(`../../lib/${file}`)
        delete require.cache[require.resolve(`../../lib/${file}`)];
      });

    //slashcommands
    fs.readdirSync("./module/function/slashcommand/")
      .map(file=>{
        delete require.cache[require.resolve(`../slashcommand/${file}`)];
        require(`../slashcommand/${file}`)
      });
   
    //auth
    fs.readdirSync("./module/function/auth/")
    .map(file=>{
      require(`../auth/${file}`)
      delete require.cache[require.resolve(`../auth/${file}`)];
    });
    
    //その他
    delete require.cache[require.resolve("../../../config.json")];
    delete require.cache[require.resolve("../../../package.json")];
    delete require.cache[require.resolve("../../../package-lock.json")];
    delete require.cache[require.resolve("../../../file/commandlist.json")];

    require("../../event/ready/command")(interaction.client);

    await interaction.editReply({
      embeds:[{
        color: Colors.Green,
        description: "リロードが完了しました",
      }]
    });
  }
}