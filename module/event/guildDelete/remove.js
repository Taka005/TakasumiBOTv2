module.exports = async(guild)=>{
  const db = require("../../lib/db");

  await db(`DELETE FROM bump WHERE id = ${guild.id};`);
  await db(`DELETE FROM dissoku WHERE id = ${guild.id};`);
  await db(`DELETE FROM hiroyuki WHERE server = ${guild.id};`);
  await db(`DELETE FROM global WHERE server = ${guild.id};`);
  await db(`DELETE FROM pin WHERE server = ${guild.id};`);
  await db(`DELETE FROM \`ignore\` WHERE id = ${guild.id};`);
  await db(`DELETE FROM \`join\` WHERE server = ${guild.id};`);
  await db(`DELETE FROM \`leave\` WHERE server = ${guild.id};`);
  await db(`DELETE FROM server WHERE id = ${guild.id};`);
  await db(`DELETE FROM stats WHERE id = ${guild.id};`);
  await db(`DELETE FROM up WHERE id = ${guild.id};`);
}