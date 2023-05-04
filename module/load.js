module.exports = async(client)=>{
  const cron = require("node-cron");
  const db = require("../lib/db");
  cron.schedule("0 * * * *",async()=>{
    const log = await db("SELECT * FROM log");
    if(log.length > 168){
      
    }
  });
}