const db = require("./db");
const escape = require("./escape");
module.exports = {
  "getUser":async(id)=>{
    const data = await db(`SELECT * FROM mute_user WHERE id = "${id}";`);
    return data[0];
  },
  "getServer":async(id)=>{
    const data = await db(`SELECT * FROM mute_server WHERE id = "${id}";`);
    return data[0];
  },
  "getIp":async(ip)=>{
    const data = await db(`SELECT * FROM mute_ip WHERE ip = "${ip}";`);
    return data[0];
  },
  "addUser":async(id,reason)=>{
    await db(`INSERT INTO mute_user (id, reason, time) VALUES("${id}","${escape(reason)}",NOW());`);
  },
  "addServer":async(id,reason)=>{
    await db(`INSERT INTO mute_server (id, reason, time) VALUES("${id}","${escape(reason)}",NOW());`);
  },
  "addIp":async(ip,reason)=>{
    await db(`INSERT INTO mute_ip (ip, reason, time) VALUES("${ip}","${escape(reason)}",NOW());`);
  },
  "removeUser":async(id)=>{
    await db(`DELETE FROM mute_user WHERE id = "${id}";`);
  },
  "removeServer":async(id)=>{
    await db(`DELETE FROM mute_server WHERE id = "${id}";`);
  },
  "removeIp":async(ip)=>{
    await db(`DELETE FROM mute_ip WHERE ip = "${ip}";`);
  }
}