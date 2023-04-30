const time = [];

module.exports = async(message)=>{
  const { PermissionFlagsBits } = require("discord.js");
  const db = require("../../lib/db");

  if(
    message.author.bot||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ViewChannel)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.SendMessages)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ManageMessages)
  ) return;

  const data = await db(`SELECT * FROM moderate WHERE id = ${message.guild.id} LIMIT 1;`);
  if(data[0]){
    if(!time[message.author.id]){
      time[message.author.id] = [0,true];
    }

    if(data[0].type === "high"){
      //文字数制限
      if(message.content.length > 800){
        message.delete().catch(()=>{});
        return message.channel.send({
          content: `<@${message.author.id}>`,
          embeds:[{
            author:{
              name: "自動モデレート",
              icon_url: "https://cdn.taka.ml/images/system/warn.png"
              },
              description: "メッセージの文字数が多すぎたため、メッセージを削除しました",
              timestamp: new Date(),
              color: "YELLOW"
            }]
        }).catch(()=>{})
      }
      //スパム検知
      if(new Date() - time[message.author.id][0] <= 900){
        message.delete().catch(()=>{});
        if(!time[message.author.id][1]) return;
        message.channel.send({
          content: `<@${message.author.id}>`,
          embeds:[{
            author:{
              name: "自動モデレート",
              icon_url: "https://cdn.taka.ml/images/system/warn.png"
            },
            description: "スパムを検知したため、メッセージを削除しました",
            timestamp: new Date(),
            color: "YELLOW"
          }]
        }).catch(()=>{})
        return time[message.author.id] = [new Date(),false];
      }else{
        time[message.author.id] = [new Date(),true];
      }
    }else if(data[0].type === "normal"){
      //文字数制限
      if(message.content.length > 1000){
        message.delete().catch(()=>{});
        return message.channel.send({
          content: `<@${message.author.id}>`,
          embeds:[{
            author:{
              name: "自動モデレート",
              icon_url: "https://cdn.taka.ml/images/system/warn.png"
              },
              description: "メッセージの文字数が多すぎたため、メッセージを削除しました",
              timestamp: new Date(),
              color: "YELLOW"
            }]
        }).catch(()=>{})
      }
      //スパム検知
      if(new Date() - time[message.author.id][0] <= 600){
        message.delete().catch(()=>{});
        if(!time[message.author.id][1]) return;
        message.channel.send({
          content: `<@${message.author.id}>`,
          embeds:[{
            author:{
              name: "自動モデレート",
              icon_url: "https://cdn.taka.ml/images/system/warn.png"
            },
            description: "スパムを検知したため、メッセージを削除しました",
            timestamp: new Date(),
            color: "YELLOW"
          }]
        }).catch(()=>{})
        return time[message.author.id] = [new Date(),false];
      }else{
        time[message.author.id] = [new Date(),true];
      }
    }else if(data[0].type === "low"){
      //文字数制限
      if(message.content.length > 1500){
        message.delete().catch(()=>{});
        return message.channel.send({
          content: `<@${message.author.id}>`,
          embeds:[{
            author:{
              name: "自動モデレート",
              icon_url: "https://cdn.taka.ml/images/system/warn.png"
              },
              description: "メッセージの文字数が多すぎたため、メッセージを削除しました",
              timestamp: new Date(),
              color: "YELLOW"
            }]
        }).catch(()=>{})
      }
      //スパム検知
      if(new Date() - time[message.author.id][0] <= 300){
        message.delete().catch(()=>{});
        if(!time[message.author.id][1]) return;
        message.channel.send({
          content: `<@${message.author.id}>`,
          embeds:[{
            author:{
              name: "自動モデレート",
              icon_url: "https://cdn.taka.ml/images/system/warn.png"
            },
            description: "スパムを検知したため、メッセージを削除しました",
            timestamp: new Date(),
            color: "YELLOW"
          }]
        }).catch(()=>{})
        return time[message.author.id] = [new Date(),false];
      }else{
        time[message.author.id] = [new Date(),true];
      }
    }
    //Token削除
    if(
      message.content.match(/[0-9a-zA-Z_-]{24}\.[0-9a-zA-Z_-]{6}\.[0-9a-zA-Z_-]{38}/)||
      message.content.match(/[0-9a-zA-Z_-]{24}\.[0-9a-zA-Z_-]{6}\.[0-9a-zA-Z_-]{27}/)
    ){
      message.delete().catch(()=>{});
      return message.channel.send({
        content: `<@${message.author.id}>`,
        embeds:[{
          author:{
            name: "自動モデレート",
            icon_url: "https://cdn.taka.ml/images/system/warn.png"
          },
          description: "メッセージにトークンが含まれていたため、メッセージを削除しました",
          timestamp: new Date(),
          color: "YELLOW"
        }]
      }).catch(()=>{})
    }
  }
}