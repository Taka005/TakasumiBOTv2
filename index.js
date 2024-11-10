const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const log = require("./module/lib/log");
const config = require("./config.json");

const client = new Client({
  intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences
  ],
  sweepers:{
    messages:{
      interval: config.cacheLimit,
      lifetime: config.cacheLimit
    },
    users:{
      interval: config.cacheLimit,
      filter: ()=>user=>user.id !== client.user.id
    },
    guildMembers:{
      interval: config.cacheLimit,
      filter: ()=>member=>member.id !== client.user.id
    },
    reactions:{
      interval: config.cacheLimit,
      filter: ()=>()=>true
    },
    presences:{
      interval: config.cacheLimit,
      filter: ()=>()=>true
    },
    invites:{
      interval: config.cacheLimit,
      lifetime: config.cacheLimit
    },
    emojis:{
      interval: config.cacheLimit,
      filter: ()=>()=>true
    },
    threads:{
      interval: config.cacheLimit,
      lifetime: config.cacheLimit
    },
    threadMembers:{
      interval: config.cacheLimit,
      filter: ()=>()=>true
    },
    stickers:{
      interval: config.cacheLimit,
      filter: ()=>()=>true
    },
    bans:{
      interval: config.cacheLimit,
      filter: ()=>()=>true
    },
    voiceStates:{
      interval: config.cacheLimit,
      filter: ()=>()=>true
    },
    stageInstances:{
      interval: config.cacheLimit,
      filter: ()=>()=>true
    },
    applicationCommands:{
      interval: config.cacheLimit,
      filter: ()=>()=>true
    },
    autoModerationRules:{
      interval: config.cacheLimit,
      filter: ()=>()=>true
    },
    entitlements:{
      interval: config.cacheLimit,
      filter: ()=>()=>true
    }
  }
});

if(!client.shard) log.reset();

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