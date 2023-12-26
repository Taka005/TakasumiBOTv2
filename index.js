const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const log = require("./module/lib/log");

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
      interval: 3600,
      lifetime: 3600
    },
    users:{
      interval: 3600,
      filter: ()=>true,
    },
    guildMembers:{
      interval: 3600,
      filter: ()=>true,
    },
    reactions:{
      interval: 1800,
      filter: ()=>true,
    },
    presences:{
      interval: 1800,
      filter: ()=>true,
    },
    invites:{
      interval: 3600,
      lifetime: 86400
    },
    emojis:{
      interval: 1800,
      filter: ()=>true,
    },
    threads:{
      interval: 1800,
      lifetime: 3600
    },
    threadMembers:{
      interval: 1800,
      filter: ()=>true,
    },
    stickers:{
      interval: 1800,
      filter: ()=>true,
    },
    bans:{
      interval: 1800,
      filter: ()=>true,
    },
    voiceStates:{
      interval: 1800,
      filter: ()=>true,
    },
    stageInstances:{
      interval: 1800,
      filter: ()=>true,
    },
    applicationCommands:{
      interval: 1800,
      filter: ()=>true,
    },
    autoModerationRules:{
      interval: 1800,
      filter: ()=>true,
    },
    entitlements:{
      interval: 1800,
      filter: ()=>true,
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