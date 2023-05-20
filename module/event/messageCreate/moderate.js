const spam = require("../../lib/spam");
const Spam = new spam();

module.exports = async(message)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");

  if(
    message.author.bot||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ViewChannel)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.SendMessages)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ManageMessages)
  ) return;

  const data = await db(`SELECT * FROM moderate WHERE id = ${message.guild.id} LIMIT 1;`);
  if(data[0]){

    if(data[0].type === "high"){
      Spam.rate = 900;
      //文字数制限
      if(message.content.length > 800){
        await message.delete()
          .catch(()=>{});
        return await message.channel.send({
          content: `<@${message.author.id}>`,
          embeds:[{
            color: Colors.Yellow,
            author:{
              name: "自動モデレート",
              icon_url: "https://cdn.taka.ml/images/system/warn.png"
              },
              description: "メッセージの文字数が多すぎたため、メッセージを削除しました",
              timestamp: new Date()
            }]
        }).catch(()=>{});
      }
      //スパム検知
      if(Spam.count(message.author.id)){
        await message.delete()
          .catch(()=>{});

        if(!Spam.check(message.author.id)){
          return await message.channel.send({
            content: `<@${message.author.id}>`,
            embeds:[{
              color: Colors.Yellow,
              author:{
                name: "自動モデレート",
                icon_url: "https://cdn.taka.ml/images/system/warn.png"
              },
              description: "スパムを検知したため、メッセージを削除しました",
              timestamp: new Date()
            }]
          }).catch(()=>{});
        }
      }
    }else if(data[0].type === "normal"){
      Spam.rate = 600;
      //文字数制限
      if(message.content.length > 1000){
        await message.delete()
          .catch(()=>{});
        return message.channel.send({
          content: `<@${message.author.id}>`,
          embeds:[{
            color: Colors.Yellow,
            author:{
              name: "自動モデレート",
              icon_url: "https://cdn.taka.ml/images/system/warn.png"
              },
              description: "メッセージの文字数が多すぎたため、メッセージを削除しました",
              timestamp: new Date()
            }]
        }).catch(()=>{});
      }
      //スパム検知
      if(Spam.count(message.author.id)){
        await message.delete()
          .catch(()=>{});

        if(!Spam.check(message.author.id)){
          return await message.channel.send({
            content: `<@${message.author.id}>`,
            embeds:[{
              color: Colors.Yellow,
              author:{
                name: "自動モデレート",
                icon_url: "https://cdn.taka.ml/images/system/warn.png"
              },
              description: "スパムを検知したため、メッセージを削除しました",
              timestamp: new Date()
            }]
          }).catch(()=>{});
        }
      }
    }else if(data[0].type === "low"){
      Spam.rate = 400;
      //文字数制限
      if(message.content.length > 1500){
        await message.delete()
          .catch(()=>{});
        return await message.channel.send({
          content: `<@${message.author.id}>`,
          embeds:[{
            color: Colors.Yellow,
            author:{
              name: "自動モデレート",
              icon_url: "https://cdn.taka.ml/images/system/warn.png"
              },
              description: "メッセージの文字数が多すぎたため、メッセージを削除しました",
              timestamp: new Date()
            }]
        }).catch(()=>{});
      }
      //スパム検知
      if(Spam.count(message.author.id)){
        await message.delete()
          .catch(()=>{});

        if(!Spam.check(message.author.id)){
          return await message.channel.send({
            content: `<@${message.author.id}>`,
            embeds:[{
              color: Colors.Yellow,
              author:{
                name: "自動モデレート",
                icon_url: "https://cdn.taka.ml/images/system/warn.png"
              },
              description: "スパムを検知したため、メッセージを削除しました",
              timestamp: new Date()
            }]
          }).catch(()=>{});
        }
      }
    }
    //Token削除
    if(
      message.content.match(/[0-9a-zA-Z_-]{24}\.[0-9a-zA-Z_-]{6}\.[0-9a-zA-Z_-]{38}/)||
      message.content.match(/[0-9a-zA-Z_-]{24}\.[0-9a-zA-Z_-]{6}\.[0-9a-zA-Z_-]{27}/)
    ){
      await message.delete().catch(()=>{});
      return message.channel.send({
        content: `<@${message.author.id}>`,
        embeds:[{
          color: Colors.Yellow,
          author:{
            name: "自動モデレート",
            icon_url: "https://cdn.taka.ml/images/system/warn.png"
          },
          description: "メッセージにトークンが含まれていたため、メッセージを削除しました",
          timestamp: new Date()
        }]
      }).catch(()=>{});
    }
  }
}