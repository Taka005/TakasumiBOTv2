module.exports = async(client)=>{
  const { MessageButton, MessageActionRow } = require("discord.js");
  const fs = require("fs");
  const db = require("./lib/db");

  client.once("ready",async(client)=>{
    require("./event/ready/status")(client);
    require("./event/ready/command")(client);
  });

  client.on("messageCreate",async(message)=>{
    if(!message.guild.members.me) return;
    //event/message
    fs.readdir("./module/event/messageCreate/",(err,files)=>{ 
      files.forEach((file)=>{
        if(!file.endsWith(".js")) return;
        require(`./event/messageCreate/${file}`)(message,client);
      });
    });
    
    if(message.channel.type !== "GUILD_TEXT"||message.author.bot) return;  

    console.log(`\x1b[37mLOG:(${message.author.tag}[${message.guild.id}])${message.content} PING[${client.ws.ping}ms]\x1b[39m`);

   //Globalchat
    require("./function/globalchat/global")(message,client).catch(()=>{});
    require("./function/globalchat/reply")(message,client).catch(()=>{});
    require("./function/globalchat/send")(message,client).catch(()=>{});

    //コマンド
    fs.readdir("./module/function/command/",(err,files)=>{ 
      files.forEach((file)=>{
        if(!file.endsWith(".js")) return;
        require(`./command/${file}`)(message,client);
      });
    });
  });

  client.on("messageUpdate",async(oldMessage,newMessage)=>{
    require("./event/messageUpdate/dissoku")(newMessage);
  });

  client.on("guildCreate",async(guild)=>{
    require("./event/guildCreate/add")(guild,client);
  });
  
  client.on("guildDelete",async(guild)=>{
    require("./event/guildDelete/remove")(guild,client);
  });

  client.on("interactionCreate",async(interaction)=>{

    if(!interaction.guild) return await interaction.reply({ 
      embeds:[{
        author:{
          name: "コマンドが実行できません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "BOTの操作はDMで実行することができません\nサーバー内で実行してください"
      }],      
      components:[
        new MessageActionRow()
          .addComponents( 
            new MessageButton()
              .setLabel("サポートサーバー")
              .setURL("https://discord.gg/NEesRdGQwD")
              .setStyle("LINK"))
      ]
    });

    const mute_server = await db(`SELECT * FROM mute_server WHERE id = ${interaction.guild.id} LIMIT 1;`);
    const mute_user = await db(`SELECT * FROM mute_user WHERE id = ${interaction.user.id} LIMIT 1;`);

    if(mute_server[0]||mute_user[0]) return await interaction.reply({ 
      embeds:[{
        author:{
          name: "コマンドが実行できません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "あなた又はこのサーバーはブラックリストに登録されているため実行できません"
      }],      
      components:[
        new MessageActionRow()
          .addComponents( 
            new MessageButton()
              .setLabel("サポートサーバー")
              .setURL("https://discord.gg/NEesRdGQwD")
              .setStyle("LINK"))
      ],
      ephemeral: true
    });

    //event/interaction
    fs.readdir("./module/event/interactionCreate/",(err,files)=>{ 
      files.forEach(async(file)=>{
        if(!file.endsWith(".js")) return;
        require(`./event/interactionCreate/${file}`)(interaction,client);
      });
    });
    //auth
    fs.readdir("./module/function/auth/",(err,files)=>{ 
      files.forEach(async(file)=>{
        if(!file.endsWith(".js")) return;
        require(`./auth/${file}`)(interaction,client);
      });
    });
    //slashcommands
    fs.readdir("./module/function/slashcommand/",(err,files)=>{ 
      files.forEach(async(file)=>{
        if(!file.endsWith(".js")) return;
        require(`./slashcommand/${file}`)(interaction,client);
      });
    });
    //contextmenu
    fs.readdir("./module/function/contextmenu/",(err,files)=>{ 
      files.forEach(async(file)=>{
        if(!file.endsWith(".js")) return;
        require(`./contextmenu/${file}`)(interaction,client);
      });
    });
  });

  client.on("guildMemberAdd",async(member)=>{
    require("./event/guildMemberAdd/join")(member,client);
  });

  client.on("guildMemberRemove",async(member)=>{
    require("./event/guildMemberRemove/leave")(member,client);
  });
}