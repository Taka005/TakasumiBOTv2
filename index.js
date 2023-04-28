const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const config = require("./config.json"); 

const client = new Client({
  intents: Object.values(GatewayIntentBits).filter(Number.isInteger),
  shards: "auto"
});

console.log("\x1b[32m*******************************\x1b[39m");
console.log("\x1b[32m          TakasumiBOT v2       \x1b[39m");
console.log("\x1b[32m    Created By Taka005#6668    \x1b[39m");
console.log("\x1b[32m*******************************\x1b[39m");

require("./module/events")(client);
require("./module/api/server")(client);
require("./module/global/gateway")(client);
require("./module/events/load")(client);

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
      color: "RED",
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