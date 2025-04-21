const Spam = require("../../lib/spam");
const spam = new Spam(3600000,true);

module.exports = async(message)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const ignore = require("../../lib/ignore");

  if(
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ViewChannel)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.SendMessages)
  ) return;

  if(message.author.id === "761562078095867916"){
    if(
      message.embeds[0]?.fields[0]?.name.match(/をアップしたよ/)||
      message.embeds[0]?.fields[0]?.name.match(/I've bumped up/)
    ){
      if(
        spam.count(message.guild.id)||
        await ignore.check(message.guild.id,"dissoku")
      ) return;

      const data = await db(`SELECT * FROM dissoku WHERE id = ${message.guild.id};`);
      await message.channel.send({
        embeds:[{
          color: Colors.Blue,
          title: "UP通知",
          description: "UPを受信しました\n1時間後に通知します"
        }]
      }).catch(()=>{});

      setTimeout(async()=>{
        await message.channel.send({
          content: data[0] ? `<@&${data[0].role}>`:"",
          embeds:[{
            color: Colors.Blue,
            title: "UP通知",
            description: "DISSOKUの時間です\n</dissoku up:828002256690610256>でサーバーの表示順位を上げよう！"
          }]
        }).catch(()=>{});
      },7200000);
    }
  }
}