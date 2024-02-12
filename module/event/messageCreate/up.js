module.exports = async(message)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const ignore = require("../../lib/ignore");

  if(
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ViewChannel)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.SendMessages)
  ) return;

  if(message.author.id === "981314695543783484"){
    if(
      message.embeds[0]?.author?.name.match(/UPしました!/)
    ){
      if(ignore.check(message.guild.id,"up")) return;

      const data = await db(`SELECT * FROM up WHERE id = ${message.guild.id};`);
      setTimeout(async()=>{
        await message.channel.send({
          content: data[0] ? `<@&${data[0].role}>`:"",
          embeds:[{
            color: Colors.Green,
            title: "TakasumiBOT UP通知",
            description: "UPの時間です\n</up:1135405664852783157>でサーバーの表示順位を上げよう！"
          }]
        }).catch(()=>{});
      },3600000);
    }
  }
}