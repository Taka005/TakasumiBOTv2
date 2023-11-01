const { Client, GatewayIntentBits, Options } = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const log = require("./module/lib/log");

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

client.login(process.env.BOT_TOKEN);

process.on("message",(message)=>{
  if(!message.type) return;

  if(message.type === "shardId"){
    log.info(`${message.data}番シャードが起動しました`);
    global.shardId = message.data;
  }
});

process.on("uncaughtException",async(error)=>{
  log.error(error.stack);

  fs.appendFileSync("./tmp/error.txt",`-------- [UNCAUGTH_EXCEPTION]: ${new Date().toLocaleString()} --------\n${error.stack}\n\n`,"utf8");
});

process.on("unhandledRejection",async(error)=>{
  log.error(error.stack);

  fs.appendFileSync("./tmp/error.txt",`-------- [UNHANDLED_REJECTION]: ${new Date().toLocaleString()} --------\n${error.stack}\n\n`,"utf8");
});