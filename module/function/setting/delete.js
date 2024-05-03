module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(interaction.options.getSubcommand() === "delete"){
    await db(`DELETE FROM pin WHERE server = ${interaction.guild.id};`);
    await db(`DELETE FROM bump WHERE id = ${interaction.guild.id};`);
    await db(`DELETE FROM dissoku WHERE id = ${interaction.guild.id};`);
    await db(`DELETE FROM hiroyuki WHERE server = ${interaction.guild.id};`);
    await db(`DELETE FROM global WHERE server = ${interaction.guild.id};`);
    await db(`DELETE FROM \`ignore\` WHERE id = ${interaction.guild.id};`);
    await db(`DELETE FROM \`join\` WHERE server = ${interaction.guild.id};`);
    await db(`DELETE FROM \`leave\` WHERE server = ${interaction.guild.id};`);
    await db(`DELETE FROM server WHERE id = ${interaction.guild.id};`);
    await db(`DELETE FROM stats WHERE id = ${interaction.guild.id};`);
    await db(`DELETE FROM up WHERE id = ${interaction.guild.id};`);

    await interaction.reply({
      content: `<@${interaction.user.id}>`,
      embeds:[{
        color: Colors.Green,
        author:{
          name: "全ての設定情報を削除しました",
          icon_url: "https://cdn.takasumibot.com/images/system/success.png"
        }
      }]
    });
  }
}