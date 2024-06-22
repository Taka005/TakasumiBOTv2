module.exports = async(id)=>{
  const db = require("./db");

  const data = await db(`SELECT * FROM admin WHERE id = "${id}";`);

  return data[0];
}