const db = require("./db");
const createId = require("./createId");

module.exports = {
  "get":async(id)=>{
    const data = await db(`SELECT * FROM money WHERE id = ${id};`);
    return data[0]||{
      amount: 0,
      roll: 0,
      yellow: 0,
      red: 0,
      blue: 0,
      random: 0,
      stock: 0
    };
  },
  "add":async(id,number,reason)=>{
    const data = await db(`SELECT * FROM money WHERE id = ${id};`);

    let amount = (data[0] ? data[0].amount : 0) + number;
    if(amount > 50000000){
      amount = 50000000;
    }

    await db(`INSERT INTO history (id, amount, reason, user, time) VALUES("${createId(10)}","${number}","${reason}","${id}",NOW());`);
    await db(`INSERT INTO money (id, amount, roll, yellow, red, blue, random, stock, time) VALUES("${id}","${amount}","0","0","0","0","0","0",NOW()) ON DUPLICATE KEY UPDATE amount = VALUES (amount),time = VALUES (time);`);
  },
  "delete":async(id,number,reason)=>{
    const data = await db(`SELECT * FROM money WHERE id = ${id};`);

    let amount = (data[0] ? data[0].amount : 0) - number;
    if(amount < 0){
      amount = 0;
    }

    await db(`INSERT INTO history (id, amount, reason, user, time) VALUES("${createId(10)}","${-number}","${reason}","${id}",NOW());`);
    await db(`INSERT INTO money (id, amount, roll, yellow, red, blue, random, stock, time) VALUES("${id}","${amount}","0","0","0","0","0","0",NOW()) ON DUPLICATE KEY UPDATE amount = VALUES (amount),time = VALUES (time);`);
  }
}