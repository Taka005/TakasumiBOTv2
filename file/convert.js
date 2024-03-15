const fs = require("fs");
const log = require("../module/lib/log");
const commands = require("./commandlist");

log.info("出力中...");

const data = Object.values(commands)
  .map(command=>({
    "type": command.type,
    "name": command.name,
    "description": parseHTML(command.description),
    "example": parseHTML(command.example),
    "userPermission": command.userPermission,
    "botPermission": command.botPermission,
    "note": parseHTML(command.note)
  }));

fs.writeFileSync("../tmp/commandlist.json",JSON.stringify(data,null,"  "),"utf-8");

log.info("出力しました");

function parseHTML(str){
  return str
    .replace(/\n/g,"<br>")
    .replace(/`/g,"")
    .replace(/\[(.*?)\]\((.*?)\)/g,"$1");
}