module.exports = async(client)=>{
  const { Events, RESTEvents, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  require("dotenv").config();
  const fs = require("fs");
  const db = require("./lib/db");
  const count = require("./lib/count");
  const stats = require("./lib/stats");
  const money = require("./lib/money");
  const log = require("./lib/log");

  await require("./lib/fileLoader")();

  client.on(Events.ClientReady,async(client)=>{
    require("./event/ready/status")(client);
    require("./event/ready/load")(client);
    require("./event/ready/command")(client);
  });

  client.on(Events.MessageCreate,async(message)=>{
    if(
      !message.guild.members.me||
      !message.channel.viewable
    ) return;

    await count.message();

    Promise.all(global.messageCreate.map(fn=>fn(message)));
    
    if(message.author.bot) return;

    await stats.message(message.guild.id);

    Promise.all(global.command.map(fn=>fn(message)));
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
        color: Colors.Red,
        author:{
          name: "コマンドが実行できません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
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
    
    if(
      (await db(`SELECT * FROM mute_server WHERE id = ${interaction.guild.id};`))[0]||
      (await db(`SELECT * FROM mute_user WHERE id = ${interaction.user.id};`))[0]
    ) return await interaction.reply({ 
      embeds:[{
        color: Colors.Red,
        author:{
          name: "コマンドが実行できません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
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

    await count.command();
    await money.add(interaction.user.id,10);

    Promise.all(global.interactionCreate.map(fn=>fn(interaction)));
    Promise.all(global.auth.map(fn=>fn(interaction)));
    Promise.all(global.slashcommand.map(fn=>fn(interaction)));
    Promise.all(global.contextmenu.map(fn=>fn(interaction)));
  });

  client.on(Events.GuildMemberAdd,async(member)=>{
    await stats.join(member.guild.id);

    require("./event/guildMemberAdd/join")(member);
  });

  client.on(Events.GuildMemberRemove,async(member)=>{
    await stats.leave(member.guild.id);

    require("./event/guildMemberRemove/leave")(member);
  });

  client.rest.on(RESTEvents.InvalidRequestWarning,async(message)=>{
    log.error(message);

    fs.appendFileSync("./tmp/log.txt",`-------- [INVSLID_REQUEST]: ${new Date().toLocaleString()} --------\n${message}\n\n`,"utf8");
  });

  if(process.env.DEBUG){
    client.on(Events.Debug,(message)=>{
      log.debug(message);
    });

    client.on(Events.Warn,(message)=>{
      log.warn(message);
    });
  }
}