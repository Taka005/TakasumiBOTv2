module.exports = async(client)=>{
  const db = require("../../lib/db");
  const fs = require("fs");
  const os = require("os");
  const fetch = require("node-fetch");

  setInterval(async()=>{
    if(api.time.length > 100){
      api.time.shift();
    }else if(api.ping.length > 100){
      api.ping.shift();
    }else if(api.web.length > 100){
      api.web.shift();
    }else if(api.user.length > 100){
      api.user.shift();
    }else if(api.guild.length > 100){
      api.guild.shift();
    }else if(api.gc.length > 100){
      api.gc.shift();  
    }else if(api.cpu.length > 100){
      api.cpu.shift();
    }else if(api.ram.length > 100){
      api.ram.shift();
    }else{
      const cpuusage = await new Promise((resolve)=>{
        require("os-utils").cpuUsage(resolve);
      });

      const start = performance.now(); 
      await fetch("https://api.taka.ml/v1/status")
      const end = performance.now(); 

      const time = new Date();

      let ping = client.ws.ping;
      let web = Math.floor(end - start);
      if(ping > 500){
        ping = 500;
      }else if(web > 500){
        web = 500;
      }

      const global = await db(`SELECT * FROM global;`);

      api.time.push(`${time.getMonth()+1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}`)
      api.ping.push(`${ping}`)
      api.web.push(`${web}`)
      api.user.push(`${client.guilds.cache.map((g) => g.memberCount).reduce((a, c) => a + c)}`)
      api.guild.push(`${client.guilds.cache.size}`)
      api.gc.push(`${global.length}`)
      api.cpu.push(`${(cpuusage * 100).toFixed(2)}`)
      api.ram.push(`${100 - Math.floor((os.freemem() / os.totalmem()) * 100)}`)
    }
  },900000)
}