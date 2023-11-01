const { ShardingManager } = require("discord.js");
require("dotenv").config();
const log = require("./module/lib/log");

const manager = new ShardingManager("./index.js",{
  token: process.env.BOT_TOKEN
});

log.info("シャード起動中...");

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