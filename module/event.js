module.exports = async(client)=>{
  const { Events, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const fs = require("fs");
  const db = require("./lib/db");
  const lang = require("./lib/lang");
  const log = require("./lib/log");

  client.once(Events.ClientReady,async(client)=>{
    require("./event/ready/status")(client);
    require("./event/ready/command")(client);
  });

  client.on(Events.MessageCreate,async(message)=>{
    if(!message.guild.members.me) return;

    log.message();

    const Lang = new lang();
    Lang.set(message.guild.id);

    //event/message
    fs.readdir("./module/event/messageCreate/",(err,files)=>{
      files.forEach((file)=>{
        if(!file.endsWith(".js")) return;
        require(`./event/messageCreate/${file}`)(message,Lang);
      });
    });
    
    if(message.channel.type !== ChannelType.GuildText||message.author.bot) return;  

    console.log(`\x1b[37mLOG:(${message.author.tag}[${message.guild.id}])${message.content} PING[${client.ws.ping}ms]\x1b[39m`);

   //Globalchat
    require("./function/globalchat/global")(message).catch(()=>{});
    require("./function/globalchat/reply")(message).catch(()=>{});
    require("./function/globalchat/send")(message).catch(()=>{});

    //コマンド
    fs.readdir("./module/function/command/",(err,files)=>{ 
      files.forEach((file)=>{
        if(!file.endsWith(".js")) return;
        require(`./function/command/${file}`)(message);
      });
    });
  });

  client.on(Events.MessageUpdate,async(oldMessage,newMessage)=>{
    require("./event/messageUpdate/dissoku")(newMessage);
  });

  client.on(Events.GuildCreate,async(guild)=>{
    require("./event/guildCreate/add")(guild);
  });
  
  client.on(Events.GuildDelete,async(guild)=>{
    require("./event/guildDelete/remove")(guild);
  });

  client.on(Events.InteractionCreate,async(interaction)=>{

    if(!interaction.guild) return await interaction.reply({ 
      embeds:[{
        author:{
          name: "コマンドが実行できません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "BOTの操作はDMで実行することができません\nサーバー内で実行してください"
      }],      
      components:[
        new ActionRowBuilder()
          .addComponents( 
            new ButtonBuilder()
              .setLabel("サポートサーバー")
              .setURL("https://discord.gg/NEesRdGQwD")
              .setStyle(ButtonStyle.Link))
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
        color: Colors.Red,
        description: "あなた又はこのサーバーはブラックリストに登録されているため実行できません"
      }],      
      components:[
        new ActionRowBuilder()
          .addComponents( 
            new ButtonBuilder()
              .setLabel("サポートサーバー")
              .setURL("https://discord.gg/NEesRdGQwD")
              .setStyle(ButtonStyle.Link))
      ],
      ephemeral: true
    });

    log.command();

    const Lang = new lang();
    Lang.set(interaction.guild.id);

    //event/interaction
    fs.readdir("./module/event/interactionCreate/",(err,files)=>{ 
      files.forEach(async(file)=>{
        if(!file.endsWith(".js")) return;
        require(`./event/interactionCreate/${file}`)(interaction,Lang);
      });
    });
    //auth
    fs.readdir("./module/function/auth/",(err,files)=>{ 
      files.forEach(async(file)=>{
        if(!file.endsWith(".js")) return;
        require(`./function/auth/${file}`)(interaction,Lang);
      });
    });
    //slashcommands
    fs.readdir("./module/function/slashcommand/",(err,files)=>{ 
      files.forEach(async(file)=>{
        if(!file.endsWith(".js")) return;
        require(`./function/slashcommand/${file}`)(interaction,Lang);
      });
    });
    //contextmenu
    fs.readdir("./module/function/contextmenu/",(err,files)=>{ 
      files.forEach(async(file)=>{
        if(!file.endsWith(".js")) return;
        require(`./function/contextmenu/${file}`)(interaction,Lang);
      });
    });
  });

  client.on(Events.GuildMemberAdd,async(member)=>{
    require("./event/guildMemberAdd/join")(member);
  });

  client.on(Events.GuildMemberRemove,async(member)=>{
    require("./event/guildMemberRemove/leave")(member);
  });
}