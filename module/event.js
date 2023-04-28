module.exports = async(client)=>{
  const { MessageButton, MessageActionRow } = require("discord.js");
  const fs = require("fs");
  const mysql = require("./lib/mysql");

  client.once("ready",async(client)=>{
    require("./events/status")(client);
    require("./events/command")(client);
  });

  client.on("messageCreate",async(message)=>{
    if(!message.guild.members.me) return;
    //event/message
    fs.readdir("./module/events/message/",(err,files)=>{ 
      files.forEach((file)=>{
        if(!file.endsWith(".js")) return;
        require(`./events/message/${file}`)(message,client);
      });
    });
    
    if(message.channel.type !== "GUILD_TEXT"||message.author.bot) return;  

    console.log(`\x1b[37mLOG:(${message.author.tag}[${message.guild.id}])${message.content} PING[${client.ws.ping}ms]\x1b[39m`);

   //Globalchat
    require("./global/global")(message,client).catch(()=>{});
    require("./global/reply")(message,client).catch(()=>{});
    require("./global/send")(message,client).catch(()=>{});

    //コマンド
    fs.readdir("./module/commands/",(err,files)=>{ 
      files.forEach((file)=>{
        if(!file.endsWith(".js")) return;
        require(`./commands/${file}`)(message,client);
      });
    });
  });

  client.on("messageUpdate",async(oldMessage,newMessage)=>{
    require("./events/dissoku")(newMessage);
  });

  client.on("guildCreate",async(guild)=>{
    require("./events/add")(guild,client);
  });
  
  client.on("guildDelete",async(guild)=>{
    require("./events/remove")(guild,client);
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

    const mute_server = await mysql(`SELECT * FROM mute_server WHERE id = ${interaction.guild.id} LIMIT 1;`);
    const mute_user = await mysql(`SELECT * FROM mute_user WHERE id = ${interaction.user.id} LIMIT 1;`);

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
    fs.readdir("./module/events/interaction/",(err,files)=>{ 
      files.forEach(async(file)=>{
        if(!file.endsWith(".js")) return;
        require(`./events/interaction/${file}`)(interaction,client);
      });
    });
    //auth
    fs.readdir("./module/auth/",(err,files)=>{ 
      files.forEach(async(file)=>{
        if(!file.endsWith(".js")) return;
        require(`./auth/${file}`)(interaction,client);
      });
    });
    //slashcommands
    fs.readdir("./module/slashcommands/",(err,files)=>{ 
      files.forEach(async(file)=>{
        if(!file.endsWith(".js")) return;
        require(`./slashcommands/${file}`)(interaction,client);
      });
    });
    //contextmenu
    fs.readdir("./module/contextmenu/",(err,files)=>{ 
      files.forEach(async(file)=>{
        if(!file.endsWith(".js")) return;
        require(`./contextmenu/${file}`)(interaction,client);
      });
    });
  });

  client.on("guildMemberAdd",async(member)=>{
    require("./events/join")(member,client);
  });

  client.on("guildMemberRemove",async(member)=>{
    require("./events/leave")(member,client);
  });
}