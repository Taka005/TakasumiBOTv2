const { ShardingManager } = require("discord.js");
require("dotenv").config();

const manager = new ShardingManager("./index.js",{
  token: process.env.BOT_TOKEN
});

manager.on("shardCreate",(shard)=>{
  console.log(`シャードが起動しました: ${shard.id}`)
});

manager.spawn();