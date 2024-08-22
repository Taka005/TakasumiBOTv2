module.exports = async(client)=>{
  const { Events, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors, ApplicationCommandOptionType } = require("discord.js");
  require("dotenv").config();
  const mute = require("./lib/mute");
  const count = require("./lib/count");
  const stats = require("./lib/stats");
  const log = require("./lib/log");
  const createId = require("./lib/createId");
  const db = require("./lib/db");
  const fileLoader = require("./lib/fileLoader");
  const config = require("../config.json");

  await fileLoader();

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
    if(!interaction.inGuild()) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "コマンドが実行できません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "BOTの操作はDMで実行することができません\nサーバー内で実行してください"
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel("サポートサーバー")
              .setURL(config.inviteUrl)
              .setStyle(ButtonStyle.Link))
      ]
    });

    if(
      await mute.getUser(interaction.user.id)||
      await mute.getServer(interaction.guild.id)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "コマンドが実行できません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "あなた又はこのサーバーはブラックリストに登録されているため実行できません"
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel("サポートサーバー")
              .setURL(config.inviteUrl)
              .setStyle(ButtonStyle.Link))
      ],
      ephemeral: true
    });

    if(interaction.isChatInputCommand()){
      const name = `${interaction.commandName}${interaction.options.getSubcommand(false) ? ` ${interaction.options.getSubcommand(false)}` : ""}`;
      const option = interaction.options.data
        .filter(data=>data.type !== ApplicationCommandOptionType.Subcommand||data.type !== ApplicationCommandOptionType.SubcommandGroup)
        .map(data=>`${data.name}:${data.value||"なし"}`).join(" ");
      console.log(interaction.options.data)
      await db(`INSERT INTO command (id, name, \`option\`, user, server, channel, time) VALUES("${createId(10)}","${name}","${option}","${interaction.user.id}","${interaction.guild.id}","${interaction.channel.id}",NOW());`);
    }

    await count.command();

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

  if(process.env.DEBUG){
    client.on(Events.Debug,(message)=>{
      log.debug(message);
    });

    client.on(Events.Warn,(message)=>{
      log.warn(message);
    });
  }
}