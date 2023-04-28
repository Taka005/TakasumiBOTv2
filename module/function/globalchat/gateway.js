module.exports = async(client)=>{
  const zlib = require("zlib");
  const ws = require("ws");
  require("dotenv").config();
  const connect = require("./connect");

  function connection(){
    const websocket = new ws("wss://ugc.renorari.net/api/v2/gateway");

    websocket.on("close",(code,reason)=>{
      console.log(`\x1b[33mWARN: UGC Close ${code} ${reason}\x1b[39m`); 
      setTimeout(()=>{
        connection();
      },10000);
    });
    
    websocket.on("error",(error)=>{
      console.log(`\x1b[31mERROR: ${error}\x1b[39m`); 
    });

    websocket.on("message",(rawData)=>{
      zlib.inflate(rawData,(err,_data)=>{
        if(err) return console.log(`\x1b[31mERROR: ${err}\x1b[39m`);
        const data = JSON.parse(_data);
        if(data.type === "hello"){
          websocket.send(zlib.deflateSync(JSON.stringify({
            "type": "identify",
            "data": {
              "token": process.env.UGC_KEY
            }
            }),(err)=>{
              if(err) return console.log(`\x1b[31mERROR: ${err}\x1b[39m`); 
            }
          ));
        }else if(data.type === "message"){
          connect(data.data.data,client);
        }else if(data.type === "identify"){
          if(!data.success) return console.log(`\x1b[31mERROR: Connect UGC Failed\x1b[39m`); 
          console.log(`\x1b[34mINFO: Connect UGC\x1b[39m`); 

          setInterval(()=>{
            websocket.send(zlib.deflateSync(JSON.stringify({
              "type": "heartbeat"
            }),(err)=>{
              if(err) return console.log(`\x1b[31mERROR: ${err}\x1b[39m`); 
            }));
          },10000);
        }
      });
    });
  }
  connection();
}