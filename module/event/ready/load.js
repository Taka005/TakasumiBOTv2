module.exports = async(client)=>{
  const cron = require("node-cron");
  const os = require("os");
  require("dotenv").config();
  const db = require("../../lib/db");
  const cpu = require("../../lib/cpu");
  const fetchGuildCounts = require("../../lib/fetchGuildCounts");
  const fetchUserCounts = require("../../lib/fetchUserCounts");

  cron.schedule("0 * * * *",async()=>{
    const log = await db("SELECT * FROM log;");

    const ping = client.ws.ping < 300 ? client.ws.ping : 300;
    const user = await fetchUserCounts(client);
    const guild = await fetchGuildCounts(client);
    const count = await db(`SELECT * FROM count WHERE id = ${process.env.ID};`);
    const cpuUsage = await cpu();
    const ram = 100 - Math.floor((os.freemem()/os.totalmem())*100);

    let logCount = log.length;
    while(logCount >= 168){
      await db("DELETE FROM log ORDER BY time LIMIT 1;");
      logCount--;
      if(logCount <= 167) break;
    }
    
    await db(`INSERT INTO log (time, ping, user, guild, message, command, cpu, ram) VALUES(NOW(),"${ping}","${user}","${guild}","${count[0].message}","${count[0].command}","${cpuUsage}","${ram}");`);
    await db(`UPDATE count SET message = 0, command = 0 WHERE id = ${process.env.ID};`);
  });

  cron.schedule("0 0 0 * * *",async()=>{
    await db(`UPDATE count SET message = 0;`);
    await db(`UPDATE count SET \`join\` = 0;`);
    await db(`UPDATE count SET \`leave\` = 0;`);
  });
}