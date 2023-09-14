const { ShardingManager } = require("discord.js");
require("dotenv").config();

const manager = new ShardingManager("./index.js",{
  token: process.env.BOT_TOKEN
});

manager.on("shardCreate",(shard)=>{
  console.log(`${shard.id}番シャードが起動しました`)
});

manager.spawn({
  amount: 2
});