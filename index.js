const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const config = require("./config.json"); 

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildEmojisAndStickers
  ],
  shards: "auto"
});

console.log("\x1b[32m*******************************\x1b[39m");
console.log("\x1b[32m          TakasumiBOT v2       \x1b[39m");
console.log("\x1b[32m    Created By Taka005#6668    \x1b[39m");
console.log("\x1b[32m*******************************\x1b[39m");

require("./module/event")(client);
require("./module/function/globalchat/gateway")(client);

client.login(process.env.BOT_TOKEN)
  .then(()=>{
    console.log("\x1b[34mINFO: Login Success\x1b[39m");
  })
  .catch(()=>{
    console.log("\x1b[31mERROR: Login Failed\x1b[39m");
    process.exit();
  })

process.on("uncaughtException",async(error)=>{
  console.log(`\x1b[31mERROR: ${error.stack}\x1b[39m`);

  await client.channels.cache.get(config.error).send({
    embeds:[{
      color: Colors.Red,
      description: `\`\`\`js\n${error.stack}\`\`\``,
      timestamp: new Date()
    }]
  }).catch(()=>{});
});

process.on("unhandledRejection",async(error)=>{
  console.log(`\x1b[31mERROR: ${error.stack}\x1b[39m`);

  await client.channels.cache.get(config.error).send({
    embeds:[{
      color: "ORANGE",
      description: `\`\`\`js\n${error.stack}\`\`\``,
      timestamp: new Date()
    }]
  }).catch(()=>{});
});