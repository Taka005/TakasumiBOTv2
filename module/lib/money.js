const db = require("./db");
const createId = require("./createId");

module.exports = {
  "get":async(id)=>{
    const data = await db(`SELECT * FROM money WHERE id = ${id};`);
    return data[0]||{};
  },
  "add":async(id,number,reason)=>{
    const data = await db(`SELECT * FROM money WHERE id = ${id};`);

    let amount = (data[0] ? data[0].amount : 0) + number;
    if(amount > 10000000){
      amount = 10000000;
    }

    await db(`INSERT INTO history (id, flag, amount, reason, user, time) VALUES("${createId(10)}","add","${number}","${reason}","${id}",NOW());`);
    await db(`INSERT INTO money (id, amount, yellow, red, blue, random, stock, time) VALUES("${id}","${amount}","0","0","0","0","0",NOW()) ON DUPLICATE KEY UPDATE amount = VALUES (amount),time = VALUES (time);`);
  },
  "delete":async(id,number,reason)=>{
    const data = await db(`SELECT * FROM money WHERE id = ${id};`);

    let amount = (data[0] ? data[0].amount : 0) - number;
    if(amount < 0){
      amount = 0;
    }

    await db(`INSERT INTO history (id, flag, amount, reason, user, time) VALUES("${createId(10)}","delete","${number}","${reason}","${id}",NOW());`);
    await db(`INSERT INTO money (id, amount, yellow, red, blue, random, stock, time) VALUES("${id}","${amount}","0","0","0","0","0",NOW()) ON DUPLICATE KEY UPDATE amount = VALUES (amount),time = VALUES (time);`);
  }
}