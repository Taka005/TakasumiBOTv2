const { ShardingManager } = require("discord.js");
require("dotenv").config();

const manager = new ShardingManager("./index.js",{
  token: process.env.BOT_TOKEN
});

console.log(`\x1b[34mシャードを起動中...\x1b[39m`);

manager.on("shardCreate",(shard)=>{
  shard.on("ready",async()=>{
    await shard.send({
      type: "shardId",
      data: shard.id
    });
  });
});

manager.spawn({
  amount: 2
});