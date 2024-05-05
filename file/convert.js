const fs = require("fs");
const commands = require("./commandlist");

const data = Object.values(commands)
  .filter(command=>command.type !== "none")
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

function parseHTML(str){
  return str
    .replace(/\n/g,"<br>")
    .replace(/`/g,"")
    .replace(/\[(.*?)\]\((.*?)\)/g,"$1");
}