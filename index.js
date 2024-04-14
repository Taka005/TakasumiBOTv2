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
      interval: 10800,
      lifetime: 10800
    },
    users:{
      interval: 3600,
      filter: ()=>user=>user.id !== client.user.id
    },
    guildMembers:{
      interval: 3600,
      filter: ()=>member=>member.id !== client.user.id
    },
    reactions:{
      interval: 3600,
      filter: ()=>()=>true
    },
    presences:{
      interval: 3600,
      filter: ()=>()=>true
    },
    invites:{
      interval: 3600,
      lifetime: 3600
    },
    emojis:{
      interval: 3600,
      filter: ()=>()=>true
    },
    threads:{
      interval: 3600,
      lifetime: 3600
    },
    threadMembers:{
      interval: 3600,
      filter: ()=>()=>true
    },
    stickers:{
      interval: 3600,
      filter: ()=>()=>true
    },
    bans:{
      interval: 3600,
      filter: ()=>()=>true
    },
    voiceStates:{
      interval: 3600,
      filter: ()=>()=>true
    },
    stageInstances:{
      interval: 3600,
      filter: ()=>()=>true
    },
    applicationCommands:{
      interval: 3600,
      filter: ()=>()=>true
    },
    autoModerationRules:{
      interval: 3600,
      filter: ()=>()=>true
    },
    entitlements:{
      interval: 3600,
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