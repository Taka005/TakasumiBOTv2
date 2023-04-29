module.exports = async(guild)=>{
  const db = require("../../lib/db");

  db(`DELETE FROM bump WHERE server = ${guild.id};`);
  db(`DELETE FROM dissoku WHERE server = ${guild.id};`);
  db(`DELETE FROM hiroyuki WHERE server = ${guild.id};`);
  db(`DELETE FROM global WHERE server = ${guild.id};`);
  db(`DELETE FROM moderate WHERE id = ${guild.id};`);
  db(`DELETE FROM pin WHERE server = ${guild.id};`);
  db(`DELETE FROM \`ignore\` WHERE id = ${guild.id};`);
  db(`DELETE FROM \`join\` WHERE server = ${guild.id};`);
  db(`DELETE FROM \`leave\` WHERE server = ${guild.id};`);
}