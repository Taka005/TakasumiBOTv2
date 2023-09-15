const { Client, GatewayIntentBits, Options, Colors } = require("discord.js");
require("dotenv").config();
const fetchChannel = require("./module/lib/fetchChannel");
const config = require("./config.json"); 

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

process.on("uncaughtException",async(error)=>{
  console.log(`\x1b[31m${error.stack}\x1b[39m`);

  await fetchChannel(client,config.log)?.send({
    embeds:[{
      color: Colors.Red,
      description: `\`\`\`js\n${error.stack}\`\`\``,
      timestamp: new Date()
    }]
  }).catch(()=>{});
});

process.on("unhandledRejection",async(error)=>{
  console.log(`\x1b[31m${error.stack}\x1b[39m`);

  await fetchChannel(client,config.log)?.send({
    embeds:[{
      color: Colors.Orange,
      description: `\`\`\`js\n${error.stack}\`\`\``,
      timestamp: new Date()
    }]
  }).catch(()=>{});
});