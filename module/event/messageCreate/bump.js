module.exports = async(message)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");

  if(
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ViewChannel)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.SendMessages)
  ) return;

  if(message.author.id === "302050872383242240"){
    if(
      message.embeds[0]?.description.match(/表示順をアップしたよ/)||
      message.embeds[0]?.description.match(/Bump done/)
    ){
      const ignore = await db(`SELECT * FROM \`ignore\` WHERE id = ${message.guild.id};`);
      if(ignore[0]) return;

      const data = await db(`SELECT * FROM bump WHERE id = ${message.guild.id};`);
      await message.channel.send({
        embeds:[{
          color: Colors.White,
          title: "BUMP通知",
          description: "UPを受信しました\n2時間後に通知します"
        }]  
      }).catch(()=>{});

      setTimeout(async()=>{
        await message.channel.send({
          content: data[0] ? `<@&${data[0].role}>`:"",
          embeds:[{
            color: Colors.White,
            title: "BUMP通知",
            description: "BUMPの時間です\n</bump:947088344167366698>でサーバーの表示順位を上げよう！"
          }]  
        }).catch(()=>{});
      },7200000);
    }
  }
}