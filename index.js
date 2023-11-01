const { Client, GatewayIntentBits, Options } = require("discord.js");
require("dotenv").config();
const fs = require("fs");

const client = new Client({
  intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences
  ],
  makeCache: Options.cacheWithLimits({
    BaseGuildEmojiManager: 0,
    GuildEmojiManager: 0,
    GuildEmojiRoleManager: 0,
    GuildForumThreadManager: 0,
    GuildScheduledEventManager: 0,
    GuildStickerManager: 0,
    GuildTextThreadManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
    AutoModerationRuleManager: 0,
    VoiceStateManager: 0,
    GuildInviteManager: 0
  })
});

require("./module/event")(client);

client.login(process.env.BOT_TOKEN)
  .then(()=>{
    console.log("\x1b[34mログインしました\x1b[39m");
  });

process.on("message",(message)=>{
  if(!message.type) return;

  if(message.type == "shardId"){
    console.log(`\x1b[34m${message.data}番シャード起動\x1b[39m`);
    global.shardId = message.data;
  }
});

process.on("uncaughtException",async(error)=>{
  console.log(`\x1b[31m${error.stack}\x1b[39m`);

  fs.appendFileSync("./tmp/error.txt",`-------- UncaugthException: ${new Date().toLocaleString()} --------\n${error.stack}\n\n`,"utf8");
});

process.on("unhandledRejection",async(error)=>{
  console.log(`\x1b[31m${error.stack}\x1b[39m`);

  fs.appendFileSync("./tmp/error.txt",`-------- UnhandledRejection: ${new Date().toLocaleString()} --------\n${error.stack}\n\n`,"utf8");
});