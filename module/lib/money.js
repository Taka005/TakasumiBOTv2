const db = require("./db");
module.exports = {
  "get":async(id)=>{
    const data = await db(`SELECT * FROM money WHERE id = ${id} LIMIT 1;`);
    return data[0];
  },
  "add":async(id,number)=>{
    const data = await db(`SELECT * FROM money WHERE id = ${id} LIMIT 1;`);

    let amount = Number(data[0] ? data[0].amount : 0) + number;
    if(amount > 100000000){
      amount = 100000000;
    }
    await db(`INSERT INTO money (id, amount, gc, time) VALUES("${id}","${amount}","0",NOW()) ON DUPLICATE KEY UPDATE amount = VALUES (amount),time = VALUES (time);`);
  },
  "delete":async(id,number)=>{
    const data = await db(`SELECT * FROM money WHERE id = ${id} LIMIT 1;`);

    let amount = Number(data[0] ? data[0].amount : 0) - number;
    if(amount < 0){
      amount = 0;
    }
    await db(`INSERT INTO money (id, amount, gc, time) VALUES("${id}","${amount}","0",NOW()) ON DUPLICATE KEY UPDATE amount = VALUES (amount),time = VALUES (time);`);
  },
  "set":async(id,number)=>{
    await db(`INSERT INTO money (id, amount, gc, time) VALUES("${id}","${number}","0",NOW()) ON DUPLICATE KEY UPDATE amount = VALUES (amount),time = VALUES (time);`);
  }
}