module.exports = async(client)=>{
  const { Events, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const fs = require("fs");
  require("dotenv");
  const db = require("./lib/db");
  const count = require("./lib/count");

  const messageCreate = fs.readdirSync("./module/event/messageCreate")
    .map(file=>require(`./event/messageCreate/${file}`));

  const command = fs.readdirSync("./module/function/command")
    .map(file=>require(`./function/command/${file}`));

  const interactionCreate = fs.readdirSync("./module/event/interactionCreate")
    .map(file=>require(`./event/interactionCreate/${file}`))

  const auth = fs.readdirSync("./module/function/auth")
    .map(file=>require(`./function/auth/${file}`));

  const slashcommand = fs.readdirSync("./module/function/slashcommand")
    .map(file=>require(`./function/slashcommand/${file}`));

  const contextmenu = fs.readdirSync("./module/function/contextmenu")
    .map(file=>require(`./function/contextmenu/${file}`));

  client.once(Events.ClientReady,async(client)=>{
    require("./event/ready/status")(client);
    require("./event/ready/load")(client);
    require("./event/ready/command")(client);
  });

  client.on(Events.MessageCreate,async(message)=>{
    if(
      !message.guild.members.me||
      !message.channel.viewable
    ) return;

    count.message();

    messageCreate.forEach(fn=>fn());
    
    if(message.author.bot) return;  

    console.log(`\x1b[37mMESSAGE: ${message.author.tag}(${message.guild.id})${message.content}\x1b[39m`);

    command.forEach(fn=>fn());
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

    count.command();

    interactionCreate.forEach(fn=>fn());
    auth.forEach(fn=>fn());
    slashcommand.forEach(fn=>fn());
    contextmenu.forEach(fn=>fn());
  });

  client.on(Events.GuildMemberAdd,async(member)=>{
    require("./event/guildMemberAdd/join")(member);
  });

  client.on(Events.GuildMemberRemove,async(member)=>{
    require("./event/guildMemberRemove/leave")(member);
  });

  if(process.env.DEBUG === "true"){
    client.on(Events.Debug,(message)=>{
      console.log(`Debug: ${message}`);
    });

    client.on(Events.Warn,(message)=>{
      console.log(`Warn: ${message}`);
    });

    client.on(Events.Error,(error)=>{
      console.log(`Error: ${error}`);
    });
  }
}