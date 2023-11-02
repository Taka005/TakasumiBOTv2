const { ShardingManager } = require("discord.js");
require("dotenv").config();
const log = require("./module/lib/log");

log.reset();

const manager = new ShardingManager("./index.js",{
  token: process.env.BOT_TOKEN
});

log.info("シャード起動中...");

manager.on("shardCreate",(shard)=>{
  log.info(`${shard.id}番シャードが起動しました`);
});

manager.spawn({
  amount: 2
});