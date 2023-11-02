const { Client, GatewayIntentBits, Options } = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const log = require("./module/lib/log");

log.reset();

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
    log.info(`${process.env.SHARDS ? `${process.env.SHARDS}番シャードが` : ""}ログインしました`);
  });

process.on("uncaughtException",async(error)=>{
  log.error(error.stack);
});

process.on("unhandledRejection",async(error)=>{
  log.error(error.stack);
});