module.exports = async(client)=>{
  const cron = require("node-cron");
  const os = require("os");
  require("dotenv").config();
  const db = require("../../lib/db");
  const log = require("../../lib/log");
  const cpu = require("../../lib/cpu");
  const rate = require("../../lib/rate");
  const fetchGuildCounts = require("../../lib/fetchGuildCounts");
  const fetchUserCounts = require("../../lib/fetchUserCounts");

  if(client.shard&&process.env.SHARDS !== "0") return;

  cron.schedule("0 * * * *",async()=>{
    const ping = client.ws.ping < 300 ? client.ws.ping : 300;
    const user = await fetchUserCounts(client);
    const guild = await fetchGuildCounts(client);
    const count = await db(`SELECT * FROM count WHERE id = ${process.env.ID};`);
    const cpuUsage = await cpu();
    const ram = 100 - Math.floor((os.freemem()/os.totalmem())*100);

    let logCount = (await db("SELECT * FROM log;")).length;
    while(logCount >= 168){
      await db("DELETE FROM log ORDER BY time LIMIT 1;");
      logCount--;
      if(logCount <= 167) break;
    }

    await db(`INSERT INTO log (time, ping, user, guild, message, command, cpu, ram) VALUES(NOW(),"${ping}","${user}","${guild}","${count[0].message}","${count[0].command}","${cpuUsage}","${ram}");`);
    await db(`UPDATE count SET message = 0, command = 0 WHERE id = ${process.env.ID};`);

    log.info("ログを保存しました");
  });

  cron.schedule("0 0 0 * * *",async()=>{
    await db(`UPDATE stats SET message = 0;`);
    await db(`UPDATE stats SET \`join\` = 0;`);
    await db(`UPDATE stats SET \`leave\` = 0;`);

    log.info("統計データリセットしました");
  });

  cron.schedule("*/15 * * * *",async()=>{
    let price = (await db(`SELECT * FROM count WHERE id = ${process.env.ID};`))[0].stock;

    const trade = await db("SELECT * FROM trade;");
    let tradeLength = trade.length;
    while(tradeLength >= 288){
      await db("DELETE FROM trade ORDER BY time LIMIT 1;");
      tradeLength--;
      if(tradeLength <= 287) break;
    }

    if(price >= 1000){
      if(rate(false,true,0.6)){
        price -= Math.round(price*(Math.random()*0.02 + 0.03));
      }else if(rate(false,true,0.2)){
        price += Math.round(price*(Math.random()*0.02 + 0.03));
      }
    }else{
      if(rate(false,true,0.6)){
        price += Math.round(price*(Math.random()*0.02 + 0.03));
      }else if(rate(false,true,0.2)){
        price -= Math.round(price*(Math.random()*0.02 + 0.03));
      }
    }

    await db(`UPDATE count SET stock = ${price} WHERE id = ${process.env.ID};`);
    await db(`INSERT INTO trade (time, price) VALUES(NOW(),"${price}");`);
  });
}