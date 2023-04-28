module.exports = async(client)=>{
  const express = require("express");
  const app = express();
  const os = require("os");
  const fs = require("fs");
  const https = require("https");
  const date = require("../../data/api.json");

  try{
    const server = https.createServer({
      key: fs.readFileSync("/home/taka/discordbot/ssl/server.key"),
      cert: fs.readFileSync("/home/taka/discordbot/ssl/server.pem")
    },app);

    server.listen(443,()=>{
      console.log(`\x1b[34mINFO: WEB(https)サーバーが起動しました\x1b[39m`);
    });
  }catch{
    console.log(`\x1b[33mWARN: sslを使用せずに起動しました\x1b[39m`);
  }

  app.listen(80,()=>{
    console.log(`\x1b[34mINFO: WEB(http)サーバーが起動しました\x1b[39m`);
  });
   
  app.get("/",(req,res)=>{
    res.send("<h1>API Server</h1>");
    console.log(`\x1b[34mINFO: [${req.ip}]からの接続\x1b[39m`);
    res.end()
  });

  //------API------//
  app.get("/v1/status",(req,res)=>{
    const time = new Date();
    res.setHeader("Access-Control-Allow-Origin","*")
         
    res.json({
      client:{
        bot:client.user.tag,
        ping:client.ws.ping,
        guild:client.guilds.cache.size,
        user:client.guilds.cache.map((g)=>g.memberCount).reduce((a,c)=>a+c)
      },
      system:{
        ram:{   
          total:os.totalmem(),
          free:os.freemem(),
          use:os.totalmem()-os.freemem()
        },
        uptime:{
          os:os.uptime(),
          process:process.uptime()
        },
      },
      time:{
        hour:time.getHours(),
        minute:time.getMinutes(),
        second:time.getSeconds()
      }
    });
    
    console.log(`\x1b[34mINFO: [${req.ip}]からAPIにリクエスト\x1b[39m`);
    res.end()
  });

  app.get("/v1/date",(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.json(date);

    console.log(`\x1b[34INFO: [${req.ip}]からAPIにリクエスト\x1b[39m`)
    res.end()
  });
  //------API------//

  //------ERROR処理------//
  app.use((req,res)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.status(404).send(`<h1>404 NOT FOUND</h1><br>[${req.path}]`);
    res.end()
  });

  app.use((err,req,res)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.status(500).send(`<h1>500 SERVER ERROR</h1><br>[${err}]`);
    res.end()
  });
  //------ERROR------
}