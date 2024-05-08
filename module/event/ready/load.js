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

    await db("DELETE FROM log WHERE time <= DATE_SUB(NOW(),INTERVAL 1 WEEK);");
    await db("DELETE FROM gift WHERE time <= DATE_SUB(NOW(),INTERVAL 1 MONTH)");

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
    const data = (await db(`SELECT * FROM count WHERE id = ${process.env.ID};`))[0];
    const trade = await db("SELECT * FROM trade");

    let price = data.stock;
    const per = (trade[trade.length - 1].buy - trade[trade.length - 1].sell)*2;

    if(rate(false,true,0.4)){
      price -= Math.round(Math.random()*50 + 1) + per;
    }else if(rate(false,true,0.4)){
      price += Math.round(Math.random()*50 + 1) + per;
    }else{
      price += per;
    }

    if(price < 100){
      price = 100;
    }else if(price > 10000){
      price = 10000;
    }

    await db("DELETE FROM trade WHERE time <= DATE_SUB(NOW(), INTERVAL 3 DAY);");

    await db(`UPDATE count SET stock = ${price}, buy = 0, sell = 0 WHERE id = ${process.env.ID};`);
    await db(`INSERT INTO trade (time, price, buy, sell) VALUES(NOW(),"${price}","${data.buy}","${data.sell}");`);

    log.info("株価を更新しました");
  });
}