module.exports = async(message)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");

  if(
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ViewChannel)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.SendMessages)
  ) return;

  if(message.author.id === "981314695543783484"){
    if(
      message.embeds[0]?.author?.name.match(/UPしました!/)
    ){
      const ignore = await db(`SELECT * FROM \`ignore\` WHERE id = ${message.guild.id} LIMIT 1;`);
      if(ignore[0]) return;

      const data = await db(`SELECT * FROM up WHERE id = ${message.guild.id} LIMIT 1;`);
      await message.channel.send({
        embeds:[{
          color: Colors.White,
          title: "TakasumiBOT UP通知",
          description: "UPを受信しました\n1時間後に通知します"
        }]  
      }).catch(()=>{});

      setTimeout(async()=>{
        await message.channel.send({
          content: data[0] ? `<@&${data[0].role}>`:"",
          embeds:[{
            color: Colors.White,
            title: "TakasumiBOT UP通知",
            description: "UPの時間です\n</up:1135405664852783157>でサーバーの表示順位を上げよう！"
          }]  
        }).catch(()=>{});
      },3600000);
    }
  }
}