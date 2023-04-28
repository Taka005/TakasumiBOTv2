module.exports = async(guild)=>{
  const mysql = require("../lib/mysql");

  mysql(`DELETE FROM bump WHERE server = ${guild.id};`);
  mysql(`DELETE FROM dissoku WHERE server = ${guild.id};`);
  mysql(`DELETE FROM hiroyuki WHERE server = ${guild.id};`);
  mysql(`DELETE FROM global WHERE server = ${guild.id};`);
  mysql(`DELETE FROM moderate WHERE id = ${guild.id};`);
  mysql(`DELETE FROM pin WHERE server = ${guild.id};`);
  mysql(`DELETE FROM \`ignore\` WHERE id = ${guild.id};`);
  mysql(`DELETE FROM \`join\` WHERE server = ${guild.id};`);
  mysql(`DELETE FROM \`leave\` WHERE server = ${guild.id};`);
}